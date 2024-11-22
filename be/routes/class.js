import express from "express";
import { ClassController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
const classRouter = express.Router();
classRouter.get("/getTeacherClasses", verifyToken, ClassController.getClassesOfTeacher)
classRouter.put('/pinClasswork', verifyToken, ClassController.pinClasswork);
classRouter.get("/classes", ClassController.getAllClasses);
classRouter.post('/getAllClass', ClassController.getAllClass);
classRouter.get(
  "/getTeacherDashboardInfo",
  verifyToken,
  ClassController.getTeacherDashboardInfo
);
classRouter.post("/create", ClassController.createClass);
export default classRouter;
