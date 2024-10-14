import Task from "../model/Task.js";
import Account from "../model/Account.js";
import Classwork from "../model/ClassWork.js";
import TimeBlock from "../model/TimeBlock.js";
import Student from "../model/Student.js";

const createTask = async ({
  taskType,
  group,
  taskName,
  createdBy,
  description,
  attachment,
  status,
  assignee,
  classwork,
  timeblock,
  dueDate,
  parentTask,
  childTasks,
}) => {
  try {
    const result = await Task.create({
      taskType,
      taskName,
      description,
      group,
      attachment,
      status,
      createdBy,
      assignee,
      classwork,
      timeblock,
      dueDate,
      parentTask,
      childTasks,
    });
    return result._doc;
  } catch (error) {
    throw new Error(error.message);
  }
};

const viewTaskDetail = async (taskId) => {
  try {
    const task = await Task.findById(taskId)
      .populate({
        path: "assignee",
        select: "name",
        populate: {
          path: "account",
          select: "profilePicture -_id",
        },
      })
      .populate({
        path: "parentTask",
        select: "_id taskName dueDate assignee",
      })
      .populate({
        path: "childTasks",
        select: "_id taskName dueDate assignee",
      })
      .populate({
        path: "createdBy",
        select: "_id name",
        populate: {
          path: "account",
          select: "profilePicture -_id",
        },
      })
      .populate({
        path: "group", // Populate group details
        select: "_id GroupName",
      })
      .lean();

    if (!task) {
      throw new Error("Task not found");
    }
    if (
      task.assignee &&
      task.assignee.account &&
      task.createdBy &&
      task.createdBy.account
    ) {
      task.assignee.profilePicture = task.assignee.account.profilePicture;
      task.createdBy.profilePicture = task.createdBy.account.profilePicture;
      delete task.createdBy.account;
      delete task.assignee.account;
    }

    return task;
  } catch (error) {
    throw new Error("Error fetching task details: " + error.message);
  }
};

const updatedTask = async (taskId, updateData) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateData },
      { new: true }
    )
      .populate({
        path: "assignee",
        select: "name",
        populate: {
          path: "account",
          select: "profilePicture -_id",
        },
      })
      .populate({
        path: "childTasks",
        select: "_id taskType taskName dueDate assignee",
      })
      .populate({
        path: "parentTask",
        select: "_id taskType taskName dueDate assignee",
      })
      .populate({
        path: "createdBy",
        select: "_id name",
        populate: {
          path: "account",
          select: "profilePicture",
        },
      })
      .lean();

    return updatedTask;
  } catch (error) {
    throw new Error("Failed to update task: " + error.message);
  }
};

const viewListTaskInGroup = async ({
  groupId,
  status,
  taskType,
  assignee,
  search,
}) => {
  try {
    const query = {
      group: groupId,
    };
    if (taskType) {
      query.taskType = taskType;
    }
    if (assignee && assignee.length > 0) {
      query.assignee = { $in: assignee };
    }
    if (status && status !== "All") {
      query.status = status;
    }

    if (!!search || search !== "") {
      query.taskName = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(query)
      .populate({
        path: "assignee",
        select: "name",
        populate: {
          path: "account",
          select: "profilePicture -_id",
        },
      })
      .populate({
        path: "childTasks",
        select: "_id taskType taskName dueDate assignee",
      })
      .populate({
        path: "parentTask",
        select: "_id taskType taskName dueDate assignee",
      })
      .populate({
        path: "createdBy",
        select: "_id name",
        populate: {
          path: "account",
          select: "profilePicture",
        },
      })
      .lean();

    return tasks;
  } catch (error) {
    throw new Error("Error fetching tasks: " + error.message);
  }
};
export default {
  createTask,
  viewTaskDetail,
  updatedTask,
  viewListTaskInGroup,
};
