import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { ClassController } from "../controller/index.js";
const classRouter = express.Router();


classRouter.put('/pinClasswork', verifyToken, ClassController.pinClasswork);
// classRouter.delete('/deleteclasswork', verifyToken, ClassController.deleteClasswork);
export default classRouter;
