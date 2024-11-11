import { NotificationRepository } from "../repository/index.js";

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
const getTaskRecordOfChanges = async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await NotificationRepository.getTasksRecordOfChange(taskId);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  getGroupNotification,
  getTaskRecordOfChanges
};
