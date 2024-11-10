import express from "express";
import { RequestController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
import authorization from "../middleware/authorization.js";

const requestRouter = express.Router();
requestRouter.get('/', verifyToken, authorization.checkGroupAccess, RequestController.getAllRequest);
requestRouter.patch('/voteGroup', verifyToken, authorization.checkGroupAccess, RequestController.voteOutGroup);
requestRouter.post('/createRequest', verifyToken, authorization.checkGroupAccess, RequestController.createRequest);
requestRouter.get('/findAllGroup', RequestController.getAllGroup)

export default requestRouter;

