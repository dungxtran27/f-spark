import { io, userSocketMap } from "../index.js";
import {
  RequestRepository,
  GroupRepository,
  NotificationRepository,
  StudentRepository,
  TermRepository
} from "../repository/index.js";
import moment from "moment";

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
      actionType
    );
    if (!actionType) {
      return res.status(400).json({
        error: "Invalid action type.",
      });
    }
    // if (!studentId) {
    //   return res.status(400).json({
    //     error: "Student ID is missing or invalid.",
    //   });
    // }
    // const student = await StudentRepository.findById(studentId);
    // if (!student) {
    //   return res.status(404).json({
    //     error: "Student not found",
    //   });
    // }
    // if (!groupId) {
    //   return res.status(400).json({
    //     error: "Group ID is missing or invalid.",
    //   });
    // }
    // if (!actionType || !["join", "leave", "delete"].includes(actionType)) {
    //   return res.status(400).json({
    //     error: "Invalid or missing action type. Valid action types are: 'join', 'leave', or 'delete'.",
    //   });
    // }

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
    if (actionType === "delete") {
      const request = await RequestRepository.findGroupForLeaveRequest(
        groupId,
        studentId
      );

      if (!group) {
        return res.status(400).json({
          error: "Student is not part of the specified group.",
        });
      }

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
    const totalVotes =
      updatedRequest.upVoteYes.length + updatedRequest.upVoteNo.length;
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

    return res.status(200).json({ data: requests, message: "Voted" });
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
    const activeTerm = await TermRepository.getActiveTerm();
    const currentTime = moment().toISOString();
    const endDate = activeTerm.timeLine[0].endDate;
    if (moment(endDate).isBefore(currentTime)) {
      return res.status(400).json({ error: "The deadline for requesting to join the group has passed." });
    }

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
    const groupId = foundRequest.group;
    const group = await GroupRepository.findGroupById({ groupId });
    if (!group) {
      return res.status(400).json({ error: "No group found." });
    }
    const groupStudent = group.teamMembers;
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

      groupStudent.forEach((s) => {
        const socketIds = userSocketMap[s?.account?._id.toString()];
        if (socketIds) {
          io.to(socketIds).emit(
            "newNotification",
            `Your group request has been declined`
          );
        }
      });
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
    let data;
    const foundRequest = await RequestRepository.getRequestById({ requestId });

    if (!foundRequest) {
      return res.status(400).json({ error: "No Request found." });
    }
    const groupId = foundRequest.group;
    const group = await GroupRepository.findGroupById({ groupId });
    if (!group) {
      return res.status(400).json({ error: "No group found." });
    }
    const groupStudent = group.teamMembers;
    if (foundRequest.status !== "pending") {
      return res.status(400).json({ error: "Request is processed" });
    }
    if (foundRequest.typeRequest == "changeClass") {
      data = await RequestRepository.approveLeaveRequest({
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
    }
    if (foundRequest.typeRequest == "deleteFromGroup") {
      data = await RequestRepository.approveDeleteStudentRequest(
        foundRequest.group,
        foundRequest.studentDeleted,
        requestId
      );

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

        groupStudent.forEach((s) => {
          const socketIds = userSocketMap[s?.account?._id.toString()];
          if (socketIds) {
            io.to(socketIds).emit(
              "newNotification",
              `Your group request has been approved`
            );
          }
        });
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
const createDeleteStudentFromGroupRequest = async (req, res) => {
  try {
    const { actionType, studentDeleted } = req.body;
    const studentId = req.decodedToken?.role?.id;
    if (actionType !== "delete" || !studentDeleted || studentDeleted === "") {
      return res.status(400).json({
        error: "Invalid input",
      });
    }
    const fStudent = await StudentRepository.findById(studentId);
    if (!fStudent) {
      return res.status(400).json({
        error: "student not found.",
      });
    }
    const groupId = fStudent.group.toString();
    const existingRequest =
      await RequestRepository.findExistingDeleteStudentRequest(
        groupId,
        actionType,
        studentDeleted
      );

    if (existingRequest) {
      return res.status(400).json({
        error: "Request already exists for this student and group.",
      });
    }
    console.log(groupId, studentId);
    
    const group = await RequestRepository.findGroupForLeaveRequest(
      groupId,
      studentId
    );
    if (!group) {
      return res.status(400).json({
        error: "Group not found.",
      });
    }
    const requestCreated = await RequestRepository.createDeleteStudentRequest({
      studentId,
      studentDeleted,
      groupId,
      teamMembersCount: group.teamMembers.length,
    });
    return res.status(200).json({
      message: "Your request is processing",
      requestCreated,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateIsSponsorship = async () => {
  try {
    const activeTerm = await TermRepository.getActiveTerm();
    const currentTime = moment().toISOString();
    const endDate = activeTerm.timeLine.find((t) => t.type === "sponsorShip").endDate;
    if (moment(endDate).isBefore(currentTime)) {
      const requests = await RequestRepository.findRequestByTypeRequestFPT();
      const filterRequestByTerm = requests.filter((r) => r.group.term.toString() === activeTerm._id.toString());

      for (const request of filterRequestByTerm) {
        const totalMembers = request.group.teamMembers.length;
        const totalYesVotes = request.upVoteYes.length;
        const totalVotes = request.upVoteYes.length + request.upVoteNo.length;
        const requestId = request._id;
        const groupId = request.group._id;
        if (totalVotes === totalMembers) {
          if (totalYesVotes === totalMembers) {
            await RequestRepository.approveRequestIsSponsorship(groupId, requestId);
          }
        }
        else {
          await RequestRepository.declineRequestIsSponsorship(requestId);
        }
      }
    }
    else {
      return;
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const sendRequestSponsorship = async () => {
  try {
    const activeTerm = await TermRepository.getActiveTerm();
    const currentTime = moment().toISOString();
    const startDate = activeTerm.timeLine.find((t) => t.type === "sponsorShip").startDate;
    if (moment(startDate).isBefore(currentTime)) {
      const groups = await GroupRepository.findGroupByOldMark();

      if (!groups || groups.length === 0) {
        return res.status(404).json({ message: "Group not found." });
      }

      const requests = await Promise.all(
        groups.map(async (group) => {
          const existingRequests = await RequestRepository.findRequestByTypeRequestFPTSended(group._id);
          if (existingRequests && existingRequests.length > 0) {
            return null;
          } else {
            const request = {
              typeRequest: "FPT",
              createBy: null,
              actionType: null,
              title: "Thông báo: Mở đơn xin tài trợ",
              content: "Chào em,\nNhóm em đủ điều kiện nhận hỗ trợ kinh phí khởi nghiệp. Sinh viên đọc kỹ nội dung ở file đính kèm.\nThân mến.",
              status: "pending",
              attachmentUrl: "https://example.com/file.docx",
              group: group._id,
              upVoteYes: [],
              upVoteNo: [],
              totalMembers: group.teamMembers.length,
              updatedAt: new Date().toISOString(),
            };
            return RequestRepository.createRequestFPT(request);
          }
        })
      );
    }
    else {
      return;
    }
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
  createDeleteStudentFromGroupRequest,
  updateIsSponsorship,
  sendRequestSponsorship
};
