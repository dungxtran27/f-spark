import Notification from "../model/Notification.js";
import { NOTIFICATION_TYPE } from "../utils/const.js";
import Task from "../model/Task.js";
import mongoose from "mongoose";
const createNotification = async ({ data }) => {
  try {
    const result = await Notification.create({
      action: data?.action,
      type: data?.type,
      sender: data?.sender,
      receivers: data?.receivers,
      group: data?.group,
      senderType: data?.senderType,
      class: data?.class,
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
const getStudentNotificationStatisTic = async (groupId, classId, studentId) => {
  try {
    const [groupNotification, classNotification] = await Promise.all([
      Notification.find({
        type: NOTIFICATION_TYPE.GROUP,
        group: new mongoose.Types.ObjectId(groupId),
        receivers: {
          $in: [new mongoose.Types.ObjectId(studentId)],
        },
      }),
      Notification.find({
        type: NOTIFICATION_TYPE.CLASS,
        class: new mongoose.Types.ObjectId(classId),
      }),
    ]);
    return {
      groupNotification: groupNotification.length,
      classNotification: classNotification.length,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getStudentGroupNotification = async (groupId, studentId) => {
  try {
    const groupNotification = await Notification.find({
      type: NOTIFICATION_TYPE.GROUP,
      group: new mongoose.Types.ObjectId(groupId),
      receivers: {
        $in: [new mongoose.Types.ObjectId(studentId)],
      },
    });
    return groupNotification;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getStudentClassNotification = async (classId) =>{
  try {
    const classNotification = await Notification.find({
      type: NOTIFICATION_TYPE.CLASS,
      class: new mongoose.Types.ObjectId(classId),
    })
    return classNotification
  } catch (error) {
    throw new Error(error.message);
  }
}
export default {
  createNotification,
  getGroupNotification,
  getTasksRecordOfChange,
  getStudentNotificationStatisTic,
  getStudentGroupNotification,
  getStudentClassNotification
};
