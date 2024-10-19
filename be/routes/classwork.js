import express from "express";
import { ClassworkController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
const classWorkRouter = express.Router();
classWorkRouter.get("/getClassWorkByStudent/:type", verifyToken,ClassworkController.getClassWorkByStudent)
classWorkRouter.get("/getClassWorkByTeacher/:classId/:type", verifyToken, ClassworkController.getClassWorkByTeacher)
classWorkRouter.get("/viewOutcomes", verifyToken, ClassworkController.viewOutcomes)
classWorkRouter.get("/getOutcomesByTeacher/:classId",ClassworkController.getOutcomesByTeacher) //get all outcome theo lớp màn outcome-teacher
export default classWorkRouter;
