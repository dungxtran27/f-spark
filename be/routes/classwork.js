import express from "express";
import { ClassworkController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
import authorization from "../middleware/authorization.js";
const classWorkRouter = express.Router();
classWorkRouter.get(
  "/getClassWorkByStudent",
  verifyToken,
  ClassworkController.getClassWorkByStudent
);
classWorkRouter.get(
  "/viewOutcomes",
  verifyToken,
  ClassworkController.viewOutcomes
);
classWorkRouter.get(
  "/getOutcomesByTeacher/:classId",
  ClassworkController.getOutcomesByTeacher
);
classWorkRouter.get(
  "/getClassWorkByTeacher/:classId",
  verifyToken,
  authorization.checkRole("TEACHER"),
  authorization.checkTeacherClassAccess,
  ClassworkController.getClassWorkByTeacher
);
classWorkRouter.patch(
  "/editClassWorkForStreamByTeacher",
  ClassworkController.editClassWorkByTeacher
);
classWorkRouter.delete("/deleteClasswork", ClassworkController.deleteClasswork);
classWorkRouter.post(
  "/createClasswork/:classId",
  verifyToken,
  authorization.checkRole("TEACHER"),
  authorization.checkTeacherClassAccess,
  ClassworkController.createClassWork
);
classWorkRouter.patch(
  "/upvoteAnnouncement/:classWorkId",
  verifyToken, 
  ClassworkController.upvoteAnnouncement
)

//thang
classWorkRouter.get('/class/:classId', ClassworkController.getClassStatistics);

export default classWorkRouter;
