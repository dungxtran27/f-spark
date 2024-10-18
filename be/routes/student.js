import express from "express";
import { StudentController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
const studentRouter = express.Router();
studentRouter.get('/viewStudentByGroup', verifyToken, StudentController.getStudentsInSameGroup);
studentRouter.get('/getAllStudentByGroupId/:classId', verifyToken, StudentController.findAllStudentByGroupId)
studentRouter.get("/getTeacherByStudentId", verifyToken, StudentController.getTeacherByStudentId)
studentRouter.get('/viewStudentByGroup', verifyToken, StudentController.getStudentsInSameGroup);
studentRouter.get('/getAllStudentByClassId', verifyToken, StudentController.getAllStudentByClassId);
export default studentRouter;

