import Notification from "../model/Notification.js";
import { NOTIFICATION_TYPE } from "../utils/const.js";
import Task from "../model/Task.js";
const createNotification = async ({ data }) => {
  try {
    const result = await Notification.create({
      action: data?.action,
      type: data?.type,
      sender: data?.sender,
      receivers: data?.receivers,
      group: data?.group,
      senderType: data?.senderType,
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getGroupNotification = async (groupId) => {
  try {
    const result = await Notification.find({
      type: NOTIFICATION_TYPE.GROUP,
      group: groupId,
    })
      .populate({
        path: "sender",
        populate: {
          path: "account",
        },
      })
      .populate({
        path: "action.target",
        model: Task,
        select: "taskName _id assignee",
      })
      .sort({ createdAt: -1 });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getTasksRecordOfChange = async (taskId) => {
  try {
    const result = await Notification.find({
      "action.target": taskId,
    }).populate({
      path: "sender",
      populate: {
        path: "account",
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  createNotification,
  getGroupNotification,
  getTasksRecordOfChange,
};
