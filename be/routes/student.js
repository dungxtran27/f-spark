import express from "express";
import { StudentController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
import multer from "multer"
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
const studentRouter = express.Router();
studentRouter.get('/viewStudentByGroup', verifyToken, StudentController.getStudentsInSameGroup);
studentRouter.get('/viewStudentGroupInfo', verifyToken, StudentController.getGroupAndClassInfo);
studentRouter.get("/getTeacherByStudentId", verifyToken, StudentController.getTeacherByStudentId)
studentRouter.get('/getAllStudentByClassId', verifyToken, StudentController.getAllStudentByClassId);
studentRouter.get('/:classId', verifyToken, StudentController.getAllStudentUnGroupByClassId);
studentRouter.post("/getAllStudentsNoClass", StudentController.getAllStudentsNoClass);
studentRouter.patch("/addStudentToClass", StudentController.addManyStudentNoClassToClass);
studentRouter.post('/', StudentController.getAllAccStudent);
studentRouter.post('/import', upload.single('file'), StudentController.importStudent);
studentRouter.post("/getTotalStudent", StudentController.getTotalStudentsByTerm);

// studentRouter.get('/noGroupStudents/:classId', StudentController.getAllStudentUnGroupByClassId)
export default studentRouter;

