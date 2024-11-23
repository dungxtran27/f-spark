import Request from "../model/Request.js";
import Group from "../model/Group.js";
import Student from "../model/Student.js";
import Class from "../model/Class.js";

const getAllRequest = async ({ groupId }) => {
  try {
    const requests = await Request.find({ group: groupId })
      .populate({
        path: "group",
        select: "teamMembers leader",
      })
      .populate({
        path: "createBy",
        select: "_id name studentId major",
        populate: {
          path: "account",
          select: "profilePicture",
        },
      });
    return requests;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getRequestById = async ({ requestId }) => {
  try {
    const requests = await Request.findById(requestId)
      .populate({
        path: "group",
        select: "teamMembers leader",
      })
      .populate({
        path: "createBy",
        select: "_id name studentId major",
        populate: {
          path: "account",
          select: "profilePicture",
        },
      });
    return requests;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createRequest = async ({ groupId, studentId, actionType }) => {
  try {
    const existingRequest = await Request.findOne({
      createBy: studentId,
      group: groupId,
      actionType: "leave",
      status: "pending",
    });

    if (existingRequest) {
      throw new Error("Request already exists for this student and group.");
    }

    if (actionType === "leave") {
      const group = await Group.findOne({
        _id: groupId,
        teamMembers: studentId,
      });

      if (group) {
        await Request.create({
          typeRequest: "Student",
          createBy: studentId,
          actionType: "leave",
          group: groupId,
          status: "approved",
          totalMembers: group.teamMembers.length,
        });
        await Group.updateOne(
          { _id: groupId },
          { $pull: { teamMembers: studentId } }
        );
        await Student.updateOne({ _id: studentId }, { group: null });
        return group;
      } else {
        throw new Error("Student is not part of the specified group.");
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const joinGroup = async ({ groupId, studentId }) => {
  try {
    const existingRequest = await Request.findOne({
      createBy: studentId,
      actionType: "join",
      status: "pending",
    });

    if (existingRequest) {
      throw new Error("Request join group is already exists");
    }

    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Group not found.");
    }

    const student = await Group.findOne({ teamMembers: studentId });
    if (student) {
      throw new Error("Student is already a member of another group.");
    }

    const newRequest = await Request.create({
      typeRequest: "Student",
      createBy: studentId,
      actionType: "join",
      group: groupId,
      totalMembers: group.teamMembers.length,
    });

    return newRequest._doc;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRequestJoinByStudentId = async ({ studentId }) => {
  try {
    const requests = await Request.find({
      createBy: studentId,
      status: "pending",
    });
    return requests;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getRequestDeleteStudentFromGroupByGroupId = async ({ groupId }) => {
  try {
    const requests = await Request.find({
      group: groupId,
      typeRequest: "deleteFromGroup",
    });
    return requests;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteRequestJoinByStudentId = async ({ groupId, studentId }) => {
  try {
    const pendingRequest = await Request.findOne({
      group: groupId,
      createBy: studentId,
      status: "pending",
    });

    if (!pendingRequest) {
      throw new Error("No pending request found for this student and group.");
    }

    const result = await Request.deleteOne({ _id: pendingRequest._id });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getPendingLeaveClassRequest = async () => {
  try {
    const result = await Request.find({
      status: "pending",
      typeRequest: "changeClass",
    })
      .populate({ path: "fromClass", select: " classCode " })
      .populate({ path: "toClass", select: " classCode " })
      .populate({ path: "createBy", select: "studentId name major" })
      .sort({ createdAt: -1 });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getProcessedLeaveClassRequest = async () => {
  try {
    const result = await Request.find({
      status: { $ne: "pending" },
      typeRequest: "changeClass",
    })
      .populate({ path: "fromClass", select: " classCode " })
      .populate({ path: "toClass", select: " classCode " })
      .populate({ path: "createBy", select: "studentId name major" })
      .sort({ createdAt: -1 });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getLeaveClassRequestOfStudent = async ({ studentId }) => {
  try {
    const result = await Request.find({
      typeRequest: "changeClass",
      createBy: studentId,
    })
      .populate({ path: "fromClass", select: " classCode " })
      .populate({ path: "toClass", select: " classCode " })
      .populate({ path: "createBy", select: "studentId name major" })
      .sort({ createdAt: -1 });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const createLeaveClassRequest = async ({ studentId, toClass }) => {
  try {
    const foundStudent = await Student.findById(studentId);
    const foundClass = await Class.findById(toClass);
    if (!foundClass) {
      throw new Error("Class not found");
    }
    if (!foundStudent) {
      throw new Error("No Student found.");
    }
    if (foundStudent.group) {
      throw new Error("You must leave your group before moveOut Class");
    }
    if (!foundStudent.classId) {
      throw new Error("Student is not in any class.");
    }
    if (foundStudent.classId == toClass) {
      throw new Error("Student is is already in this class.");
    }
    const pendingRequest = await Request.findOne({
      createBy: studentId,
      status: "pending",
      fromClass: foundStudent.classId,
    });

    if (pendingRequest) {
      throw new Error(
        "Your request is processing,cannot make change class request"
      );
    }

    const result = await Request.create({
      createBy: studentId,
      fromClass: foundStudent.classId,
      toClass: toClass,
      typeRequest: "changeClass",
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const declineLeaveRequest = async ({ requestId }) => {
  try {
    const declineReq = await Request.findByIdAndUpdate(requestId, {
      status: "declined",
    });
    return declineReq;
  } catch (error) {
    throw new Error(error.message);
  }
};
const approveLeaveRequest = async ({ requestId }) => {
  try {
    const foundRequest = await Request.findById(requestId);
    const updateStudent = await Student.findByIdAndUpdate(
      foundRequest.createBy,
      { classId: foundRequest.toClass }
    );
    const approvedReq = await Request.findByIdAndUpdate(requestId, {
      status: "approved",
    });
    return approvedReq;
  } catch (error) {
    throw new Error(error.message);
  }
};
const cancelLeaveRequest = async ({ requestId }) => {
  try {
    const foundRequest = await Request.findById(requestId);
    if (!foundRequest) {
      throw new Error("No Request found.");
    }
    if (foundRequest.status !== "pending") {
      throw new Error("Request is already processed");
    }

    const req = await Request.findByIdAndDelete(requestId);
    return req;
  } catch (error) {
    throw new Error(error.message);
  }
};

//code sửa
const updateVote = async (requestId, studentId, voteType) => {
  const updateField = voteType === "yes" ? "upVoteYes" : "upVoteNo";
  const oppositeField = voteType === "yes" ? "upVoteNo" : "upVoteYes";

  return Request.updateOne(
    { _id: requestId },
    {
      $addToSet: { [updateField]: studentId },
      $pull: { [oppositeField]: studentId },
    }
  );
};

const approveJoinRequest = async (
  groupId,
  studentId,
  requestId,
  totalMembers
) => {
  await Group.updateOne(
    { _id: groupId },
    { $addToSet: { teamMembers: studentId } }
  );

  await Student.updateOne({ _id: studentId }, { group: groupId });

  return Request.updateOne(
    { _id: requestId },
    { status: "approved", totalMembers }
  );
};

const declineRequest = async (requestId, totalMembers) => {
  return Request.updateOne(
    { _id: requestId },
    { status: "declined", totalMembers }
  );
};

const getUpdatedRequests = async (groupId) => {
  return Request.find({ group: groupId })
    .populate({
      path: "group",
      select: "teamMembers leader",
    })
    .populate({
      path: "createBy",
      select: "_id name studentId major",
      populate: {
        path: "account",
        select: "profilePicture",
      },
    });
};

const findRequestById = async (requestId) => {
  return Request.findOne({ _id: requestId }).populate({
    path: "group",
    select: "teamMembers",
  });
};

const findExistingRequest = async (studentId, groupId, actionType) => {
  return Request.findOne({
    createBy: studentId,
    group: groupId,
    actionType,
    status: "pending",
  });
};
const findExistingDeleteStudentRequest = async (
  groupId,
  actionType,
  studentDeleted
) => {
  return Request.findOne({
    group: groupId,
    actionType,
    status: "pending",
    studentDeleted: studentDeleted,
  });
};

const findGroupForLeaveRequest = async (groupId, studentId) => {
  return Group.findOne({
    _id: groupId,
    teamMembers: studentId,
  });
};

const createLeaveRequest = async ({ studentId, groupId, teamMembersCount }) => {
  return Request.create({
    typeRequest: "Student",
    createBy: studentId,
    actionType: "leave",
    group: groupId,
    status: "approved",
    totalMembers: teamMembersCount,
  });
};

const updateGroupMembers = async (groupId, studentId) => {
  return Group.updateOne(
    { _id: groupId },
    { $pull: { teamMembers: studentId } }
  );
};

const updateStudentGroup = async (studentId) => {
  return Student.updateOne({ _id: studentId }, { group: null });
};
const getRequestDeleteStudentFromGroup = async ({ groupId }) => {
  try {
    const result = await Request.find({
      typeRequest: "Student",
      actionType: "delete",
      group: groupId,
    })
      .populate({ path: "createBy", select: "studentId name major" })
      .sort({ createdAt: -1 });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const createDeleteStudentRequest = async ({
  studentId,
  studentDeleted,
  groupId,
  teamMembersCount,
}) => {
  return Request.create({
    typeRequest: "deleteFromGroup",
    createBy: studentId,
    actionType: "delete",
    group: groupId,
    status: "pending",
    totalMembers: teamMembersCount,
    studentDeleted: studentDeleted,
  });
};

export default {
  getAllRequest,
  createRequest,
  joinGroup,
  getRequestJoinByStudentId,
  deleteRequestJoinByStudentId,
  createLeaveClassRequest,
  declineLeaveRequest,
  approveLeaveRequest,
  cancelLeaveRequest,
  getPendingLeaveClassRequest,
  getProcessedLeaveClassRequest,
  getRequestById,
  getLeaveClassRequestOfStudent,
  // code sửa
  updateVote,
  approveJoinRequest,
  declineRequest,
  getUpdatedRequests,
  findRequestById,
  findExistingRequest,
  findGroupForLeaveRequest,
  createLeaveRequest,
  updateGroupMembers,
  updateStudentGroup,
  getRequestDeleteStudentFromGroup,
  createDeleteStudentRequest,
  findExistingDeleteStudentRequest,
  getRequestDeleteStudentFromGroupByGroupId,
};
