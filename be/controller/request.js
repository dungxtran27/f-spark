import { io, userSocketMap } from "../index.js";
import {
  RequestRepository,
  GroupRepository,
  NotificationRepository,
} from "../repository/index.js";

const getAllRequest = async (req, res) => {
  try {
    const data = await RequestRepository.getAllRequest({
      groupId: req.groupId,
    });
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createRequest = async (req, res) => {
  try {
    const { actionType } = req.body;
    const studentId = req.decodedToken?.role?.id;
    const groupId = req.groupId.toString();
    const data = await RequestRepository.createRequest({
      groupId,
      studentId,
      actionType,
    });
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const voteOutGroup = async (req, res) => {
  try {
    const { voteType, requestId } = req.body;
    const studentId = req.decodedToken?.role?.id;
    const groupId = req.groupId.toString();
    const data = await RequestRepository.voteOutGroup({
      requestId,
      groupId,
      studentId,
      voteType,
    });
    return res.status(201).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllGroup = async (req, res) => {
  try {
    const data = await GroupRepository.findAllGroups();
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const joinGroup = async (req, res) => {
  try {
    const studentId = req.decodedToken?.role?.id;
    const { groupId } = req.body;
    const data = await RequestRepository.joinGroup({ groupId, studentId });
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRequestJoinByStudentId = async (req, res) => {
  try {
    const studentId = req.decodedToken?.role?.id;
    const data = await RequestRepository.getRequestJoinByStudentId({
      studentId,
    });
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteRequestJoinByStudentId = async (req, res) => {
  try {
    const studentId = req.decodedToken?.role?.id;
    const { groupId } = req.params;
    const data = await RequestRepository.deleteRequestJoinByStudentId({
      groupId,
      studentId,
    });
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const createLeaveClassRequest = async (req, res) => {
  try {
    const { toClass } = req.body;
    console.log(req.body);

    const studentId = req.decodedToken?.role?.id;
    const data = await RequestRepository.createLeaveClassRequest({
      studentId,
      toClass,
    });
    return res
      .status(200)
      .json({ data: data, message: "Request create success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const declineLeaveClassRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const decodedToken = req.decodedToken;
    const foundRequest = await RequestRepository.getRequestById({ requestId });

    if (!foundRequest) {
      return res.status(400).json({ error: "No Request found." });
    }
    if (foundRequest.status !== "pending") {
      return res.status(400).json({ error: "Request is declined" });
    }
    const data = await RequestRepository.declineLeaveRequest({
      requestId,
    });
    if (data) {
      const notificationData = {
        sender: decodedToken?.role?.id,
        receivers: foundRequest.createBy?.account._id.toString(),
        type: "System",
        senderType: "Student",
        action: {
          action: "Your change class request is declined",
          target: requestId,
          actionType: "LeaveClass",
          extraUrl: `#`,
        },
      };
      await NotificationRepository.createNotification({
        data: notificationData,
      });

      const socketIds =
        userSocketMap[foundRequest.createBy?.account._id.toString()];
      if (socketIds) {
        io.to(socketIds).emit(
          "newNotification",
          `Your request has been declined`
        );
      }
    }
    return res.status(200).json({ data: data, message: "Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const approvedLeaveClassRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const decodedToken = req.decodedToken;

    const foundRequest = RequestRepository.getRequestById({ requestId });
    if (!foundRequest) {
      return res.status(400).json({ error: "No Request found." });
    }
    if (foundRequest.status !== "pending") {
      return res.status(400).json({ error: "Request is processed" });
    }
    const data = await RequestRepository.approveLeaveRequest({
      requestId,
    });
    if (data) {
      const notificationData = {
        sender: decodedToken?.role?.id,
        receivers: foundRequest.createBy?.account._id.toString(),
        type: "System",
        senderType: "Student",
        action: {
          action: "Your change class request is approved",
          target: requestId,
          actionType: "LeaveClass",
          extraUrl: `#`,
        },
      };
      await NotificationRepository.createNotification({
        data: notificationData,
      });

      const socketIds =
        userSocketMap[foundRequest.createBy?.account._id.toString()];
      if (socketIds) {
        io.to(socketIds).emit("newNotification", `Your request is approved`);
      }
    }
    return res.status(200).json({ data: data, message: "Approve success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const cancelLeaveClassRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const data = await RequestRepository.cancelLeaveRequest({
      requestId,
    });
    return res
      .status(200)
      .json({ data: data, message: "Cancel request success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getAllLeaveClassRequest = async (req, res) => {
  try {
    const pendingRequest = await RequestRepository.getPendingLeaveClassRequest(
      {}
    );
    const processedRequest =
      await RequestRepository.getProcessedLeaveClassRequest({});
    return res.status(200).json({
      pendingRequest: pendingRequest,
      processedRequest: processedRequest,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getLeaveClassRequestOfStudent = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const studentId = decodedToken?.role?.id;

    const request = await RequestRepository.getLeaveClassRequestOfStudent({
      studentId,
    });

    return res.status(200).json({
      data: request,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  getAllRequest,
  voteOutGroup,
  createRequest,
  getAllGroup,
  joinGroup,
  getRequestJoinByStudentId,
  deleteRequestJoinByStudentId,
  createLeaveClassRequest,
  declineLeaveClassRequest,
  approvedLeaveClassRequest,
  cancelLeaveClassRequest,
  getAllLeaveClassRequest,
  getLeaveClassRequestOfStudent,
};
