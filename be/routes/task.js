import express from "express";
import { TaskController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
import authorization from "../middleware/authorization.js";
const taskRouter = express.Router();

taskRouter.post(
  "/create",
  verifyToken,
  authorization.checkGroupAccess,
  TaskController.createTask
);
taskRouter.get(
  "/",
  verifyToken,
  authorization.checkGroupAccess,
  TaskController.viewTaskDetail
);
taskRouter.get(
  "/excel",
  verifyToken,
  authorization.checkGroupAccess,
  TaskController.exportGroupTaskToExcel
);
taskRouter.patch(
  "/updateTask",
  verifyToken,
  authorization.checkGroupAccess,
  TaskController.updateTask
);
taskRouter.post(
  "/viewGroupTask",
  verifyToken,
  authorization.checkGroupAccess,
  TaskController.getTasksByGroup
);

export default taskRouter;
