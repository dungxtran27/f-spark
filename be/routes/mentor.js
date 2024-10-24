import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { MentorController } from "../controller/index.js";
const mentorRouter = express.Router();

mentorRouter.post("/", MentorController.viewAllMentors);
mentorRouter.get("/getMentor", MentorController.getMentor);
mentorRouter.put("/assignMentor", MentorController.assignMentor);
export default mentorRouter;
