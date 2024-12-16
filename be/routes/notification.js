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
notificationRouter.get(
  "/student/statistic",
  verifyToken,
  NotificationController.getStudentNotificationStatisTic
);
notificationRouter.get(
  "/student/groupNotification",
  verifyToken,
  NotificationController.getDetailGroupNotification
);
notificationRouter.get(
  "/student/classNotification",
  verifyToken,
  NotificationController.getDetailClassNotification
)
notificationRouter.get(
  "/teacher/statistic",
  verifyToken,
  NotificationController.getTeacherClassNotification
);
notificationRouter.get(
  "/teacher/getTeacherClassNotificationByClass",
  verifyToken,
  NotificationController.getTeacherClassNotificationByClass
);
notificationRouter.post(
  "/teacher/remindGroupSubmitOutcome",
  verifyToken,
  NotificationController.remindGroupSubmitOutcome
)
export default notificationRouter;
