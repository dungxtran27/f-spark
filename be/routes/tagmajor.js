import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { TagMajorController } from "../controller/index.js";
const classRouter = express.Router();


classRouter.get('/getAllTagMajor', TagMajorController.getAllMajor);

export default classRouter;