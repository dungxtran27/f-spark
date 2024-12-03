import moment from "moment";
import {
  ClassworkRepository,
  GroupRepository,
  NotificationRepository,
  StudentRepository,
  TeacherRepository,
  TermRepository,
} from "../repository/index.js";
import mongoose from "mongoose";
import { DEADLINE_TYPES } from "../utils/const.js";
import { CLASS_NOTIFICATION_ACTION_TYPE } from "../utils/const.js";
import { io, userSocketMap } from "../index.js";
const getGroupNotification = async (req, res) => {
  try {
    const groupId = req.groupId;
    const groupNotification = await NotificationRepository.getGroupNotification(
      groupId
    );
    return res.status(200).json({ data: groupNotification });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getStudentNotificationStatisTic = async (req, res) => {
  try {
    const studentId = req.decodedToken.account;
    const existingStudent = await StudentRepository.findStudentByAccountId(
      studentId
    );
    if (!existingStudent) {
      return res.status(403).json({ error: "Unauthorized!" });
    }
    const [groupNotification, classNotification] = await Promise.all([
      NotificationRepository.getStudentGroupNotification(
        existingStudent?.group,
        existingStudent?._id
      ),
      NotificationRepository.getStudentClassNotification(
        existingStudent?.classId
      ),
    ]);
    return res.status(200).json({
      data: {
        groupNotification: groupNotification?.length,
        classNotification: classNotification?.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getTaskRecordOfChanges = async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await NotificationRepository.getTasksRecordOfChange(taskId);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getDetailGroupNotification = async (req, res) => {
  try {
    const studentId = req.decodedToken.account;
    const existingStudent = await StudentRepository.findStudentByAccountId(
      studentId
    );
    if (!existingStudent) {
      return res.status(403).json({ error: "Unauthorized!" });
    }
    const result = await NotificationRepository.getStudentGroupNotification(
      existingStudent?.group,
      existingStudent?._id
    );
    console.log(result);
    
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getDetailClassNotification = async (req, res) => {
  try {
    const studentId = req.decodedToken.account;
    const existingStudent = await StudentRepository.findStudentByAccountId(
      studentId
    );
    if (!existingStudent) {
      return res.status(403).json({ error: "Unauthorized!" });
    }
    const result = await NotificationRepository.getStudentClassNotification(
      existingStudent?.classId
    );
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getTeacherClassNotification = async (req, res) => {
  try {
    const teacherId = req.decodedToken.account;
    console.log(teacherId);
    
    const teacher = await TeacherRepository.findByAccountId(teacherId);
    const classNotification = await NotificationRepository.getTeacherClassNotification(teacher?._id)
    return res.status(200).json({
      data: {
        classNotification: classNotification?.length,
        data: classNotification
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getTeacherClassNotificationByClass = async (req, res) => {
  try {
    const teacherId = req.decodedToken.account;
    
    const teacher = await TeacherRepository.findByAccountId(teacherId);
    const classNotification = await NotificationRepository.getTeacherClassNotification(teacher?._id)
    const classList = await TeacherRepository.getClassOfTeacher(teacher?._id)
    
    return res.status(200).json({
      classList: classList,
      data: classNotification,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const remindMemberTransferEnd = async () => {
  try {
    const activeTerm = await TermRepository.getActiveTerm();
    if (!activeTerm) {
      return;
    }
    const deadline = activeTerm.timeLine.find(
      (d) => d?.type === DEADLINE_TYPES.MEMBERS_TRANSFER
    );

    if (!deadline) {
      return;
    }

    if (
      Math.abs(moment().diff(moment(deadline?.endDate), "days")) <= 1 &&
      moment().utc().isBefore(moment(deadline?.endDate))
    ) {
      const notificationData = {
        senderType: "System",
        type: "System",
        action: {
          action:
            "The member transfer phase will soon come to an end in less than a day. After this deadline, group members will be set and can not be changed by students. ",
          priorVersion: deadline?.endDate,
        },
      };
      await NotificationRepository.createNotification({data: notificationData})
      console.log('create');
      
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const remindGroupSubmitOutcome = async (req, res) => {
  try {
    const {groupId, classworkId} = req.body;
    const classwork = await ClassworkRepository.getClassworkByClassworkId(
    new mongoose.Types.ObjectId(classworkId)
  )
  
  const members = await GroupRepository.getMemberOfGroupByGroupId(
    new mongoose.Types.ObjectId(groupId))
    if(groupId) {
      const notificationData = {
        class: classwork.classId,
        receivers: members,
        sender: req.decodedToken.role.id,
        group: groupId,
        senderType: "Teacher",
        type: "Group",
        action: {
          action: `remind group submit outcome`,
          target: classworkId,
          newVersion: classwork,
          actionType: CLASS_NOTIFICATION_ACTION_TYPE.REMIND_GROUP_SUBMIT,
          extraUrl: `/class/${classwork.classId}`
        }
      }
      
      await NotificationRepository.createNotification({
        data: notificationData,
      })
      const studentsOfGroup = await StudentRepository.getAllStudentByGroupId(
        new mongoose.Types.ObjectId(groupId)
      );
      console.log(studentsOfGroup[0].account?.toString());
      
      studentsOfGroup.forEach((s) => {
        const socketIds = userSocketMap[s?.account?.toString()];
        if (socketIds) {
          io.to(socketIds).emit(
            "newNotification",
            `Your group has been reminded about submitting assignments.`
          );
        }
      });
    }  
    return res.status(200).json({ data: classwork, message: `Reminder sent to group` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export default {
  getGroupNotification,
  getTaskRecordOfChanges,
  getStudentNotificationStatisTic,
  getDetailGroupNotification,
  getDetailClassNotification,
  getTeacherClassNotification,
  getTeacherClassNotificationByClass,
  remindMemberTransferEnd,
  remindGroupSubmitOutcome
};
