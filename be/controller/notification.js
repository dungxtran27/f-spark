import moment from "moment";
import {
  NotificationRepository,
  StudentRepository,
  TermRepository,
} from "../repository/index.js";
import { DEADLINE_TYPES } from "../utils/const.js";

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
export default {
  getGroupNotification,
  getTaskRecordOfChanges,
  getStudentNotificationStatisTic,
  getDetailGroupNotification,
  getDetailClassNotification,
  remindMemberTransferEnd,
};
