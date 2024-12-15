import express from "express";
import { GroupController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";
import authorization from "../middleware/authorization.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const groupRouter = express.Router();
groupRouter.post(
  "/createRow",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.createJourneyRow
);
groupRouter.post(
  "/createColumn",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.createJourneyCol
);
groupRouter.delete(
  "/deleteRow",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.deleteRow
);
groupRouter.delete(
  "/deleteCol",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.deleteCol
);
groupRouter.patch(
  "/updateCellContent",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.updateCellContent
);
groupRouter.patch(
  "/updateColumn",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.updateColumn
);
groupRouter.patch(
  "/updateRow",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.updateRow
);
groupRouter.patch(
  "/updateCanvas",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.updateCanvasCell
);

groupRouter.get(
  "/",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.findGroupById
);

groupRouter.post(
  "/createCustomerPersona",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.addCustomerPersona
);

groupRouter.patch(
  "/updateCustomerPersona",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.updateCustomerPersona
);

groupRouter.delete(
  "/deleteCustomerPersona",
  verifyToken,
  authorization.checkGroupAccess,
  GroupController.deleteCustomerPersona
);

groupRouter.get(
  "/getAllStudentByGroup/:classId",
  GroupController.findAllStudentByGroup
);
groupRouter.get(
  "/getClassTeacherAndgroupInfo/:classId",
  GroupController.getClassTeacherAndgroupInfo
);

groupRouter.post("/addStudentInGroup", GroupController.addStundentInGroup);

groupRouter.post("/assignLeader", GroupController.assignLeader);
groupRouter.post("/createGroup", GroupController.createGroup);
groupRouter.post(
  "/deleteStudentFromGroup",
  GroupController.deleteStudentFromGroup
);
groupRouter.post("/lockOrUnlockGroup", GroupController.lockOrUnlockGroup);
groupRouter.post("/ungroup", GroupController.ungroup);
groupRouter.get("/:classId", GroupController.getAllGroupByClassId);
groupRouter.put("/update", GroupController.editTimelineForManyGroups);
groupRouter.post("/", GroupController.getAllGroupsNoClass);
groupRouter.patch("/addGroupToClass", GroupController.addGroupToClass);
groupRouter.get(
  "/getGroupClassByTermCode/:termId",
  GroupController.getGroupClassByTermCode
);
groupRouter.get("/getGroupByClass/:classId", GroupController.getGroupByClassId);
groupRouter.post("/groupStatistic", GroupController.getGroupStatistic);
groupRouter.post(
  "/updateGroupSponsorStatus",
  verifyToken,
  GroupController.updateGroupSponsorStatus
);
groupRouter.get("/getGroupsOfTerm/:termId", GroupController.getGroupsOfTerm);
groupRouter.post(
  "/getAllGroupsOfTeacherbyClassIds",
  verifyToken,
  GroupController.getAllGroupsOfTeacherbyClassIds
);
groupRouter.post(
  "/addTransaction",
  verifyToken,
  GroupController.addTransaction
);
groupRouter.post(
  "/uploadGallery",
  verifyToken,
  upload.array("files"),
  GroupController.addImageToGroupGallery
);
groupRouter.get("/getGallery/:groupId", GroupController.getGallery);
groupRouter.post(
  "/deleteImageFromGallery",
  GroupController.deleteImageFromGallery
);
groupRouter.post(
  "/updateGroupInfo",
  verifyToken,
  GroupController.updateGroupInfo
);
groupRouter.post(
  "/deleteTransaction",
  verifyToken,
  GroupController.deleteTransaction
);
groupRouter.post(
  "/verifyTransaction",
  verifyToken,
  GroupController.verifyTransaction
);
groupRouter.get("/getGroupById/:groupId", GroupController.getGroupById);
export default groupRouter;
