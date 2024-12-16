import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorization from "../middleware/authorization.js";
import { SubmissionController } from "../controller/index.js";

const submissionRouter = express.Router();
submissionRouter.post(
  "/createSubmission",
  verifyToken,
  authorization.checkGroupAccess,
  SubmissionController.createSubmission
);
submissionRouter.post(
  "/createSingleSubmission",
  verifyToken,
  SubmissionController.createSubmission
);
submissionRouter.patch(
  "/addGrade",
  verifyToken,
  authorization.checkRole("TEACHER"),
  SubmissionController.addGrade
);
submissionRouter.get(
  "/getSubmissions/:classworkId",
  verifyToken,
  SubmissionController.getSubmissionsOfClassWork
);
submissionRouter.get('/submissionsByGroup', SubmissionController.getSubmissionsByGroup);

export default submissionRouter;
