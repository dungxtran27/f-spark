import Notification from "../model/Notification.js";
import { NOTIFICATION_TYPE } from "../utils/const.js";
import Task from "../model/Task.js";
import mongoose from "mongoose";
import Student from "../model/Student.js";
import Account from "../model/Account.js";
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
      .populate({
        path: "action.priorVersion.assignee",
        model: Student,
        populate: {
          path: "account",
          model: Account,
        },
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
      $or: [
        { "action.target": taskId },
        {
          "action.priorVersion.parentTask": new mongoose.Types.ObjectId(taskId),
        },
      ],
    })
      .populate({
        path: "sender",
        populate: {
          path: "account",
        },
      })
      .populate({
        path: "action.priorVersion.assignee",
        model: Student,
        populate: {
          path: "account",
          model: Account,
        },
      })
      .sort({
        createdAt: -1,
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
    })
      .populate({
        path: "sender",
        populate: { path: "account", select: "-password" },
      })
      .populate({ path: "action.target", model: Task })
      .populate({ path: "action.target.assignee", model: Student })
      .populate({ path: "action.newVersion.assignee", model: Student });
    return groupNotification;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getStudentClassNotification = async (classId) => {
  try {
    const classNotification = await Notification.find({
      type: NOTIFICATION_TYPE.CLASS,
      class: new mongoose.Types.ObjectId(classId),
    })
      .populate({
        path: "sender",
        populate: { path: "account", select: "-password" },
      })
      .populate({
        path: "class",
        select: "_id classCode",
      });
    return classNotification;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  createNotification,
  getGroupNotification,
  getTasksRecordOfChange,
  getStudentNotificationStatisTic,
  getStudentGroupNotification,
  getStudentClassNotification,
};
