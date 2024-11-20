import express from "express";
import { RequestController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
import authorization from "../middleware/authorization.js";

const requestRouter = express.Router();
requestRouter.get(
  "/",
  verifyToken,
  authorization.checkGroupAccess,
  RequestController.getAllRequest
);
requestRouter.patch(
  "/voteGroup",
  verifyToken,
  authorization.checkGroupAccess,
  RequestController.voteOutGroup
);
requestRouter.post(
  "/createRequest",
  verifyToken,
  authorization.checkGroupAccess,
  RequestController.createRequest
);
requestRouter.get("/findAllGroup", RequestController.getAllGroup);
requestRouter.post("/joinGroup", verifyToken, RequestController.joinGroup);
requestRouter.get(
  "/findRequestJoinByStudentId",
  verifyToken,
  RequestController.getRequestJoinByStudentId
);
requestRouter.delete(
  "/deleteRequestJoinByStudentId/:groupId",
  verifyToken,
  RequestController.deleteRequestJoinByStudentId
);
requestRouter.post(
  "/approvedLeaveClassRequest",
  verifyToken,
  authorization.checkRole("ADMIN"),
  RequestController.approvedLeaveClassRequest
);
requestRouter.post(
  "/declinedLeaveClassRequest",
  verifyToken,
  authorization.checkRole("ADMIN"),

  RequestController.declineLeaveClassRequest
);
requestRouter.post(
  "/createLeaveClassRequest",
  verifyToken,
  RequestController.createLeaveClassRequest
);
requestRouter.post(
  "/cancelLeaveClassRequest",
  verifyToken,
  RequestController.cancelLeaveClassRequest
);
requestRouter.get(
  "/getAllLeaveClassRequest",
  verifyToken,
  authorization.checkRole("ADMIN"),

  RequestController.getAllLeaveClassRequest
);
requestRouter.get(
  "/getLeaveClassRequestOfStudent",
  verifyToken,
  RequestController.getLeaveClassRequestOfStudent
);

export default requestRouter;
