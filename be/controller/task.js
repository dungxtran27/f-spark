import { TaskRepository, StudentRepository } from "../repository/index.js";
import XLSX from "xlsx";
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
      priority,
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
      priority: priority,
    };
    const newTask = await TaskRepository.createTask(taskData);
    if (parentTask && newTask) {
      const updatedTask = await TaskRepository.updateTaskChildren(
        parentTask,
        newTask._id
      );
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
const exportGroupTaskToExcel = async (req, res) => {
  try {
    const tasks = await TaskRepository.viewListTaskInGroup({
      groupId: req.groupId,
      assignee: [],
      search: "",
    });
    // const ws_data = tasks?.map((t) => ({
    //   Id: t?._id?.toString(),
    //   taskName: t?.taskName,
    //   description: t?.description,
    //   status: t?.status,
    //   priority: t?.priority,
    //   assignee: `${t?.assignee?.name} ${t?.assignee?.studentId}`,
    //   createdBy: `${t?.createdBy?.name} ${t?.createdBy?.studentId}`,
    //   taskType: t?.taskType,
    //   childTasks: t?.childTasks?.length,
    // }));
    const header = [
      "ID",
      "Task Name",
      "Description",
      "Status",
      "Priority",
      "Assignee",
      "Created By",
      "Task Type",
      "Child Tasks Count",
    ];

    const ws = XLSX.utils.aoa_to_sheet([
      header,
      ...tasks?.map((t) => [
        t?._id?.toString(),
        t?.taskName,
        t?.description,
        t?.status,
        t?.priority,
        `${t?.assignee?.name} ${t?.assignee?.studentId}`,
        `${t?.createdBy?.name} ${t?.createdBy?.studentId}`,
        t?.taskType,
        t?.childTasks?.length,
      ]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="exported-data.xlsx"'
    );
    res.send(wbout);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  createTask,
  viewTaskDetail,
  updateTask,
  getTasksByGroup,
  exportGroupTaskToExcel,
};
