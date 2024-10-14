import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { TeacherController } from "../controller/index.js";
const teacherRouter = express.Router();
teacherRouter.get("/getStudentByClassId/:classId",verifyToken, TeacherController.getTeacherByClassId)
export default teacherRouter;
