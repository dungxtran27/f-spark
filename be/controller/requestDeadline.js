import { RequestDeadlineRepository, StudentRepository, TeacherRepository, NotificationRepository, ClassRepository, ClassworkRepository, GroupRepository } from "../repository/index.js";
import mongoose from "mongoose";
import { CLASS_NOTIFICATION_ACTION_TYPE, REQUEST_DEADLINE_STATUS } from "../utils/const.js";
import { io, userSocketMap } from "../index.js";
const createRequestDeadline = async (req, res) => {
    try {
        const {classworkId, reason, dueDate, newDate} = req.body;
        const studentId = req.decodedToken.account;
        const student = await StudentRepository.findStudentDetailByAccountId(studentId)
        const teacherId = student.classId.teacher
        const classId = student.classId._id
        const groupId = student.group._id
        const GroupName = student.group.GroupName
        const data = await RequestDeadlineRepository.createRequestDeadline({
            classworkId, groupId, reason, dueDate, newDate, teacherId,classId
        })
        const timeline = await GroupRepository.getTimelineClassworkOfGroup({groupId, classworkId})
        const teacher = await TeacherRepository.getTeacherAccountByClassId(
            student.classId._id
        )
        
          if(data) {
            const notificationData = {
              class: student.classId._id,
              sender: req.decodedToken.role.id,
              receivers: [teacher._id],
              group: groupId,
              senderType: "Student",
              type: "Class",
              action: {
                action: `created request deadline in`,
                target: classworkId,
                priorVersion: timeline,
                newVersion: {endDate: newDate},
                actionType: CLASS_NOTIFICATION_ACTION_TYPE.CREATE_REQUEST_DEADLINE,
                extraUrl: `/class/${classId}`
              }
            }
            
            await NotificationRepository.createNotification({
              data: notificationData,
            })
            const socketIds = userSocketMap[teacher?.account.toString()];
              if (socketIds) {
                io.to(socketIds).emit(
                  "newNotification",
                  `Request Deadline from ${GroupName} (${student?.classId?.classCode})`
                );
              }
          }    

        return res.status(200).json({ data: data, message: `Request created` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getRequestDeadlineByTeacher = async (req, res) => {
  try {
    const teacherId = req.decodedToken.role.id;
    const classId = req.params.classId
    const status = req.params.status
    const page = req.params.page
    if(!teacherId){
      return res.status(200).json({ error: "Not fould teacher!" });
    }
    const requestDeadline = await RequestDeadlineRepository.getRequestDeadlineByTeacher({teacherId, classId, status, page})       
    return res.status(200).json({ data: requestDeadline, totalItems: requestDeadline.totalItems });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const updateClassWorkFollowRequestDeadline = async (req, res) => {
  try {
    const {classworkId, statusBoolean, requestDeadlineId} = req.body;
    let status = ''    
    if(statusBoolean){
      status = REQUEST_DEADLINE_STATUS.APPROVED_STATUS
    }else{
      status = REQUEST_DEADLINE_STATUS.DECLINED_STATUS
    } 
    

    const requestDeadline = await RequestDeadlineRepository.updateStatusRequestDeadline({requestDeadlineId, status})
    const newDate = requestDeadline.newDate;
    const groupId = requestDeadline.groupId;
    const timeline = await GroupRepository.getTimelineClassworkOfGroup({groupId, classworkId})
    let timelineUpdate = {}
    if(statusBoolean){
      timelineUpdate = await GroupRepository.updateTimelineForGroup({groupId, classworkId, newDate})
    }
    const members = await GroupRepository.getMemberOfGroupByGroupId(groupId)
    if(requestDeadline) {
      const notificationData = {
        class: requestDeadline.classId,
        receivers: members,
        sender: req.decodedToken.role.id,
        group: requestDeadline.groupId,
        senderType: "Teacher",
        type: "Group",
        action: {
          action: `request deadline response`,
          target: requestDeadlineId,
          priorVersion: timeline,
          newVersion: timelineUpdate,
          actionType: CLASS_NOTIFICATION_ACTION_TYPE.RESPONSE_REQUEST_DEADLINE,
          extraUrl: `/class/${requestDeadline.classId}`
        }
      }
      
      await NotificationRepository.createNotification({
        data: notificationData,
      })
      const studentsOfGroup = await StudentRepository.getAllStudentByGroupId(
        requestDeadline.groupId
      );
      studentsOfGroup.forEach((s) => {
        const socketIds = userSocketMap[s?.account?.toString()];
        if (socketIds) {
          io.to(socketIds).emit(
            "newNotification",
            `Your request deadline has been ${statusBoolean ? 'approved' : 'denied'}.`
          );
        }
      });
    }  
    return res.status(200).json({ data: requestDeadline, message: `Response created` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
export default {
    createRequestDeadline,
    getRequestDeadlineByTeacher,
    updateClassWorkFollowRequestDeadline
};
