import express from "express";
import { OutcomeController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
const outcomeRouter = express.Router();
outcomeRouter.get("/getAllOutcome", verifyToken, OutcomeController.getAllOutcome);
outcomeRouter.post("/createOutcome", verifyToken, OutcomeController.createOutcome);
outcomeRouter.delete("/deleteOutcome/:outcomeId", verifyToken, OutcomeController.deleteOutcome);
export default outcomeRouter;
