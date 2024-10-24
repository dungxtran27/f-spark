import express from "express";
import { StudentController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
const studentRouter = express.Router();
studentRouter.get('/viewStudentByGroup', verifyToken, StudentController.getStudentsInSameGroup);
studentRouter.get("/getTeacherByStudentId", verifyToken, StudentController.getTeacherByStudentId)
studentRouter.get('/getAllStudentByClassId', verifyToken, StudentController.getAllStudentByClassId);
studentRouter.get('/:classId', verifyToken, StudentController.getAllStudentUnGroupByClassId);
export default studentRouter;

