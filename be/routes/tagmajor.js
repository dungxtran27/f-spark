import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { TagMajorController } from "../controller/index.js";
const tagMajorRouter = express.Router();
tagMajorRouter.get('/getAllTagMajor', TagMajorController.getAllMajor);

export default classRouter;