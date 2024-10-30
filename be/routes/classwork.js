import express from "express";
import { ClassworkController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
const classWorkRouter = express.Router();
classWorkRouter.get("/getClassWorkByStudent/:type", verifyToken, ClassworkController.getClassWorkByStudent)
classWorkRouter.get("/viewOutcomes", verifyToken, ClassworkController.viewOutcomes)
classWorkRouter.get("/getOutcomesByTeacher/:classId", ClassworkController.getOutcomesByTeacher)
classWorkRouter.get("/getClassWorkByTeacher/:classId", ClassworkController.getClassWorkByTeacher)
classWorkRouter.patch("/editClassWorkForStreamByTeacher", ClassworkController.editClassWorkByTeacher)
classWorkRouter.delete("/deleteClasswork", ClassworkController.deleteClasswork)
classWorkRouter.post("/createClasswork", ClassworkController.createClassWork)

export default classWorkRouter;
