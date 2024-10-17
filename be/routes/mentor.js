import express from "express";
import { MentorController } from "../controller/index.js";
const mentorRouter = express.Router();
mentorRouter.get('/getMentor',MentorController.getMentor);
mentorRouter.put('/assignMentor',MentorController.assignMentor)
export default mentorRouter;
