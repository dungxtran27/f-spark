import express from "express";
import { RequestDeadlineController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
const requestDeadlineRouter = express.Router();
requestDeadlineRouter.post("/createRequestDeadline", verifyToken, RequestDeadlineController.createRequestDeadline);
requestDeadlineRouter.get("/getRequestDeadlineByTeacher/:classId/:status/:page", verifyToken, RequestDeadlineController.getRequestDeadlineByTeacher);
requestDeadlineRouter.post("/updateClassWorkFollowRequestDeadline", verifyToken, RequestDeadlineController.updateClassWorkFollowRequestDeadline);
requestDeadlineRouter.get("/getRequestDeadlineForDashBoard/:classId", verifyToken, RequestDeadlineController.getRequestDeadlineForDashBoard);

export default requestDeadlineRouter;
