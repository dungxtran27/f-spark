import { RequestDeadlineRepository, StudentRepository, TeacherRepository, NotificationRepository } from "../repository/index.js";
import mongoose from "mongoose";
import { CLASS_NOTIFICATION_ACTION_TYPE } from "../utils/const.js";
import { io, userSocketMap } from "../index.js";
const createRequestDeadline = async (req, res) => {
    try {
        const {ClassworkId, ClassworkName, Reason, dueDate, newDate} = req.body;
        const studentId = req.decodedToken.account;
        const student = await StudentRepository.findStudentByAccountId(studentId)
        const teacherId = student.classId.teacher

        const GroupId = student.group._id
        const GroupName = student.group.GroupName
        const data = await RequestDeadlineRepository.createRequestDeadline({
            ClassworkId, ClassworkName, GroupId, GroupName, Reason, dueDate, newDate, teacherId
        })

        // const teacher = await TeacherRepository.getTeacherAccountByClassId(
        //     new mongoose.Types.ObjectId(student.classId._id)
        //   )
          
        //   if(data) {
        //     const notificationData = {
        //       class: student.classId._id,
        //       sender: studentId,
        //       receivers: [teacher._id],
        //       senderType: "Student",
        //       type: "Class",
        //       action: {
        //         action: `created request deadline in`,
        //         target: classworkId,
        //         actionType: CLASS_NOTIFICATION_ACTION_TYPE.CREATE_REQUEST_DEADLINE,
        //         extraUrl: `/class/${classworkId}`
        //       }
        //     }
        //     await NotificationRepository.createNotification({
        //       data: notificationData,
        //     })
        //     const socketIds = userSocketMap[teacher?.account.toString()];
        //       if (socketIds) {
        //         io.to(socketIds).emit(
        //           "newNotification",
        //           `Assignment ${classwork?.title} has a new submission`
        //         );
        //       }
        //   }    

        return res.status(200).json({ data: data, message: `Request created` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export default {
    createRequestDeadline,
};
