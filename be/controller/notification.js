import {
  NotificationRepository,
  StudentRepository,
} from "../repository/index.js";

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
export default {
  getGroupNotification,
  getTaskRecordOfChanges,
  getStudentNotificationStatisTic,
  getDetailGroupNotification,
  getDetailClassNotification
};
