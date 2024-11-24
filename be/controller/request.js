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
    const existingRequest = await RequestRepository.findExistingRequest(
      studentId,
      groupId,
      "leave"
    );

    if (!actionType) {
      return res.status(400).json({
        error: "Invalid action type.",
      });
    }

    if (existingRequest) {
      return res.status(400).json({
        error: "Request already exists for this student and group.",
      });
    }

    if (actionType === "leave") {
      const group = await RequestRepository.findGroupForLeaveRequest(
        groupId,
        studentId
      );

      if (!group) {
        return res.status(400).json({
          error: "Student is not part of the specified group.",
        });
      }

      await RequestRepository.createLeaveRequest({
        studentId,
        groupId,
        teamMembersCount: group.teamMembers.length,
      });

      await RequestRepository.updateGroupMembers(groupId, studentId);
      await RequestRepository.updateStudentGroup(studentId);

      return res.status(200).json({
        message: "Leave request approved and processed successfully.",
        group,
      });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const voteGroup = async (req, res) => {
  try {
    const { voteType, requestId } = req.body;
    const studentId = req.decodedToken?.role?.id;
    const groupId = req.groupId.toString();

    const request = await RequestRepository.findRequestById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    await RequestRepository.updateVote(requestId, studentId, voteType);

    const updatedRequest = await RequestRepository.findRequestById(requestId);

    const totalMembers = updatedRequest.group.teamMembers.length;
    const totalYesVotes = updatedRequest.upVoteYes.length;
    const totalVotes = updatedRequest.upVoteYes.length + updatedRequest.upVoteNo.length;
    if (totalVotes === totalMembers && request.actionType === "join") {
      if (totalYesVotes === totalMembers) {
        await RequestRepository.approveJoinRequest(
          groupId,
          request.createBy,
          requestId,
          totalMembers
        );
      } else {
        await RequestRepository.declineRequest(requestId, totalMembers);

      }
    }
    const requests = await RequestRepository.getUpdatedRequests(groupId);

    return res.status(200).json({ data: requests });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getAllGroup = async (req, res) => {
  try {
    const { page, limit, searchText } = req.body;
    const data = await GroupRepository.findAllGroups(page, limit, searchText);
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
  voteGroup,
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
