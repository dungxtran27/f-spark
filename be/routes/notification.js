import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorization from "../middleware/authorization.js";
import { NotificationController } from "../controller/index.js";
const notificationRouter = express.Router();
notificationRouter.get(
  "/getGroupNotification",
  verifyToken,
  authorization.checkGroupAccess,
  NotificationController.getGroupNotification
);
notificationRouter.get(
    "/taskRecordOfChanges/:taskId",
    verifyToken,
    // authorization.checkGroupAccess,
    NotificationController.getTaskRecordOfChanges
  );
export default notificationRouter;