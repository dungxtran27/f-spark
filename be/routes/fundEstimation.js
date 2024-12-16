import express from "express";
import { FundEstimationController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
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
  // upload.single("file"),
  FundEstimationController.updateRequest
);
fundEstimationRouter.patch(
  "/updateReturnStatus",
  FundEstimationController.updateReturnStatus
);
fundEstimationRouter.post(
  "/updateEvidenceStatus",
  FundEstimationController.updateEvidenceStatus
);
export default fundEstimationRouter;
