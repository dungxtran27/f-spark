import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { MentorController } from "../controller/index.js";
const mentorRouter = express.Router();

mentorRouter.get("/",verifyToken,MentorController.viewAllMentors);
export default mentorRouter;
