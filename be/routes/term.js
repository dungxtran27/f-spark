import express from "express";
import { TermController } from "../controller/index.js";
const termRouter = express.Router();
termRouter.post("/", TermController.createTerm);
termRouter.get("/", TermController.getAllTerms)
termRouter.post("/active", TermController.getActiveTerm);
export default termRouter