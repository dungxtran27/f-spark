import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { TeacherController } from "../controller/index.js";
const teacherRouter = express.Router();
teacherRouter.get("/getStudentByClassId/:classId",verifyToken, TeacherController.getTeacherByClassId);
teacherRouter.post("/", TeacherController.getAllAccTeacher);
teacherRouter.get('/:teacherId', TeacherController.getTeacherInfo);
teacherRouter.post("/totalTeacher", TeacherController.getTotalTeachers);
teacherRouter.post("/createTeacher", TeacherController.createTeacher);

export default teacherRouter;
