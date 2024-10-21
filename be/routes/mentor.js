import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authentication from "../middleware/authorization.js";
import { MentorController } from "../controller/index.js";
const mentorRouter = express.Router();

mentorRouter.get("/", verifyToken, authentication.checkRole('TEACHER'), MentorController.viewAllMentors);
mentorRouter.get('/getMentor', MentorController.getMentor);
mentorRouter.put('/assignMentor', MentorController.assignMentor)
export default mentorRouter;
