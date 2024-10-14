import express from "express";
import { StudentController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
import authorization from "../middleware/authorization.js";
const studentRouter = express.Router();
studentRouter.get('/viewStudentByGroup',verifyToken, StudentController.getStudentsInSameGroup);
studentRouter.get('/', verifyToken, authorization.checkGroupAccess, StudentController.findStudentByGroupId)
studentRouter.get("/getTeacherByStudentId",verifyToken, StudentController.getTeacherByStudentId)
studentRouter.get('/viewStudentByGroup',verifyToken, StudentController.getStudentsInSameGroup);
export default studentRouter;

