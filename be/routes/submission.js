import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorization from "../middleware/authorization.js";
import { SubmissionController } from "../controller/index.js";

const submissionRouter = express.Router();
submissionRouter.post("/createSubmission",
    verifyToken,
    authorization.checkGroupAccess,
    SubmissionController.createSubmission)
submissionRouter.put("/addGrade",SubmissionController.addGrade); //chấm điểm màn outcome của teacher
export default submissionRouter;