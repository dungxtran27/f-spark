import { TaskRepository, StudentRepository } from "../repository/index.js";

const createTask = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const {
      taskType,
      taskName,
      description,
      attachment,
      status,
      assignee,
      classwork,
      timeblock,
      dueDate,
      parentTask,
      childTasks,
      priority
    } = req.body;

    if (!taskName || !assignee || taskName === "" || !taskType) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const taskData = {
      taskType: taskType,
      taskName,
      description,
      attachment: attachment,
      status: status || "Pending",
      assignee: assignee,
      group: req.groupId,
      createdBy: decodedToken?.role?.id,
      classwork: classwork,
      timeblock: timeblock,
      dueDate: dueDate,
      parentTask: parentTask,
      childTasks: childTasks,
      priority: priority
    };
    const newTask = await TaskRepository.createTask(taskData);
    if(parentTask && newTask){
      const updatedTask = await TaskRepository.updateTaskChildren(parentTask, newTask._id)
    }
    return res.status(201).json({
      data: newTask,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const viewTaskDetail = async (req, res) => {
  try {
    const { taskId } = req.query;
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }
    const taskDetail = await TaskRepository.viewTaskDetail(taskId);
    if (!taskDetail) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ data: taskDetail });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.query.taskId;
    const updateData = req.body;

    const task = await TaskRepository.updatedTask(taskId, updateData);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task updated", data: task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasksByGroup = async (req, res) => {
  try {
    const { assignee, status, taskType, searchKey } = req.body;

    const tasks = await TaskRepository.viewListTaskInGroup({
      groupId: req.groupId,
      assignee: assignee || [],
      search: searchKey || "",
      status: status,
      taskType: taskType,
    });
    return res.status(200).json({ data: tasks });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  createTask,
  viewTaskDetail,
  updateTask,
  getTasksByGroup,
};
