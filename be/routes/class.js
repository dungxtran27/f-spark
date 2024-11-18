import express from "express";
import { ClassController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
const classRouter = express.Router();
classRouter.get(
  "/getTeacherClasses",
  verifyToken,
  ClassController.getClassesOfTeacher
);
classRouter.put("/pinClasswork", verifyToken, ClassController.pinClasswork);
classRouter.get(
  "/getTeacherDashboardInfo",
  verifyToken,
  ClassController.getTeacherDashboardInfo
);

export default classRouter;
