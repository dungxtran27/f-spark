import express from "express";
import { FundEstimationController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
const fundEstimationRouter = express.Router();
fundEstimationRouter.get(
  "/getGroupRequests",
  verifyToken,
  FundEstimationController.getGroupRequest
);
fundEstimationRouter.get(
  "/term/:termId",
  FundEstimationController.getTermRequest
);
fundEstimationRouter.get(
  "/getApproved/:termId",
  FundEstimationController.getDistribution
);
fundEstimationRouter.get(
  "/getReturn/:termId",
  FundEstimationController.getReturn
);
fundEstimationRouter.post(
  "/",
  verifyToken,
  FundEstimationController.createRequest
);
fundEstimationRouter.patch(
  "/updateRequests",
  FundEstimationController.updateRequest
);
export default fundEstimationRouter;
