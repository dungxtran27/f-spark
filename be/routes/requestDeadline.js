import express from "express";
import { RequestDeadlineController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
const requestDeadlineRouter = express.Router();
requestDeadlineRouter.post("/createRequestDeadline", verifyToken, RequestDeadlineController.createRequestDeadline);

export default requestDeadlineRouter;
