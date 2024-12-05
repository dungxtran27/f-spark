import express from "express";
import { TermController } from "../controller/index.js";
const termRouter = express.Router();
termRouter.post("/", TermController.createTerm);
termRouter.get("/getAll", TermController.getAllTermsToFilter);
termRouter.get("/", TermController.getAllTerms)
termRouter.post("/active", TermController.getActiveTerm);
termRouter.post("/getbyCodeTerm", TermController.getFillterTerm)
termRouter.delete("/deleteTermIncoming", TermController.deleteTermIncoming)
termRouter.get("/getTimelineOfTerm/:termId", TermController.getTimelineOfTerm);
termRouter.post("/createTimelineOfTerm", TermController.createTimelineOfTerm);
termRouter.post("/deleteTimelineOfTerm",TermController.deleteTimelineOfTerm)
termRouter.post("/updateTimelineOfTerm", TermController.updateTimelineOfTerm);
export default termRouter