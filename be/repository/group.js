import mongoose from "mongoose";
import Group from "../model/Group.js";
import Student from "../model/Student.js";
import student from "./student.js";
import Class from "../model/Class.js";

const createJourneyRow = async ({ groupId, name }) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          "customerJourneyMap.rows": {
            name: name,
          },
        },
      },
      {
        new: true,
      }
    );
    const newRow =
      updatedGroup.customerJourneyMap.rows[
        updatedGroup.customerJourneyMap.rows.length - 1
      ];
    return newRow;
  } catch (error) {
    return new Error(error.message);
  }
};
const createJourneyCol = async ({ groupId, name }) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          "customerJourneyMap.cols": {
            name: name,
          },
        },
      },
      {
        new: true,
      }
    );
    const newCol =
      updatedGroup.customerJourneyMap.cols[
        updatedGroup.customerJourneyMap.cols.length - 1
      ];
    return newCol;
  } catch (error) {
    return new Error(error.message);
  }
};
const createCellsOnUpdate = async ({ newCells, groupId }) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          "customerJourneyMap.cells": {
            $each: newCells,
          },
        },
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};

const findGroupById = async ({ groupId }) => {
  try {
    const existingGroup = await Group.findById(groupId)
      .populate({
        path: "teamMembers",
        select: "_id name gen major studentId account",
        populate: {
          path: "account",
          select: "profilePicture",
        },
      })
      .populate({
        path: "class",
        select: "teacher",
        populate: {
          path: "teacher",
          select: "_id name salutation phoneNumber account",
          populate: {
            path: "account",
            select: "profilePicture",
          },
        },
      })
      .populate({
        path: "mentor",
        select: "_id name email phoneNumber profile profilePicture",
      });
    return existingGroup;
  } catch (error) {
    return new Error(error.message);
  }
};

const deleteRow = async ({ rowId, groupId }) => {
  try {
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        "customerJourneyMap.rows._id": rowId,
      },
      {
        $pull: {
          "customerJourneyMap.rows": { _id: rowId },
          "customerJourneyMap.cells": { row: rowId },
        },
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};
const deleteCol = async ({ colId, groupId }) => {
  try {
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
      },
      {
        $pull: {
          "customerJourneyMap.cols": { _id: colId },
          "customerJourneyMap.cells": { col: colId },
        },
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};
const updateCellContent = async ({ cellId, content, groupId }) => {
  try {
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        "customerJourneyMap.cells._id": cellId,
      },
      {
        $set: {
          "customerJourneyMap.cells.$.content": content,
        },
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};
const updateColumn = async ({ colId, name, color, groupId }) => {
  try {
    const updates = {};
    if (name) {
      updates["customerJourneyMap.cols.$.name"] = name;
    }
    if (color) {
      updates["customerJourneyMap.cols.$.color"] = color;
    }
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        "customerJourneyMap.cols._id": colId,
      },
      {
        $set: updates,
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};
const updateRow = async ({ rowId, name, groupId }) => {
  try {
    const updates = {};
    if (name) {
      updates["customerJourneyMap.cols.$.name"] = name;
    }
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        "customerJourneyMap.rows._id": rowId,
      },
      {
        $set: {
          "customerJourneyMap.rows.$.name": name,
        },
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};
const updateCanvasCell = async ({ name, color, content, groupId }) => {
  try {
    const updates = {};
    if (content) {
      updates["businessModelCanvas.sections.$.content"] = content;
    }
    if (color) {
      updates["businessModelCanvas.sections.$.color"] = color;
    }
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        "businessModelCanvas.sections.name": name,
      },
      {
        $set: updates,
      },
      {
        new: true,
      }
    );

    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};

const addCustomerPersona = async ({ newPersona, groupId }) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          customerPersonas: newPersona,
        },
      },
      { new: true }
    );
    return updatedGroup;
  } catch (error) {
    throw new Error(error);
  }
};

const updateCustomerPersona = async ({
  groupId,
  personaId,
  updatedPersona,
}) => {
  try {
    const updateFields = {};
    if (updatedPersona.detail) {
      for (const [key, value] of Object.entries(updatedPersona.detail)) {
        updateFields[`customerPersonas.$.detail.${key}`] = value;
      }
    }
    if (updatedPersona.bio) {
      updateFields["customerPersonas.$.bio"] = updatedPersona.bio;
    }
    if (updatedPersona.needs) {
      updateFields["customerPersonas.$.needs"] = updatedPersona.needs;
    }

    const updatedGroup = await Group.findOneAndUpdate(
      { _id: groupId, "customerPersonas._id": personaId },
      {
        $set: updateFields,
      },
      { new: true }
    );

    return updatedGroup;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCustomerPersona = async ({ groupId, personaId }) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $pull: {
          customerPersonas: { _id: personaId },
        },
      },
      { new: true }
    );
    return updatedGroup;
  } catch (error) {
    throw new Error(error);
  }
};

const findAllGroupsOfClass = async (classId) => {
  try {
    const data = await Group.find({
      class: classId,
    })
      .select(
        "GroupName GroupDescription isSponsorship mentor teamMembers tag leader groupImage lock"
      )
      .populate({
        path: "teamMembers",
        select: "_id name gen major studentId account",
        populate: {
          path: "account",
          select: "profilePicture",
        },
      })
      .populate({
        path: "tag",
        select: "name ",
      })
      .populate({
        path: "mentor",
        select: "name profilePicture",
      });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addStundentInGroup = async (groupId, studentId) => {
  try {
    const group = await Group.findOne({
      _id: groupId,
      teamMembers: studentId,
    });

    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    if (group) {
      throw new Error("Student already exists in the group");
    }
    if (group?.lock) {
      throw new Error("Group is locked");
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $push: { teamMembers: studentId } },
      { new: true }
    )
      .select(
        "GroupName GroupDescription isSponsorship mentor teamMembers tag leader groupImage lock"
      )
      .populate({
        path: "teamMembers",
        select: "_id name gen major studentId account",
        populate: {
          path: "account",
          select: "profilePicture",
        },
      })
      .populate({
        path: "tag",
        select: "name ",
      })
      .populate({
        path: "mentor",
        select: "name profilePicture",
      });

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { group: groupId },
      { new: true }
    );

    return {
      message: "Student add successfully",
      group: updatedGroup,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const assignLeader = async (groupId, studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    const group = await Group.findOne({
      _id: groupId,
      teamMembers: studentId,
    });

    if (!group) {
      throw new Error("Student is not exists in the group");
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $set: { leader: studentId } },
      { new: true }
    )
      .select(
        "GroupName GroupDescription isSponsorship mentor teamMembers tag leader groupImage lock"
      )
      .populate({
        path: "teamMembers",
        select: "_id name gen major studentId account",
        populate: {
          path: "account",
          select: "profilePicture",
        },
      })
      .populate({
        path: "tag",
        select: "name ",
      })
      .populate({
        path: "mentor",
        select: "name profilePicture",
      });
    return {
      message: "Student assign successfully",
      group: updatedGroup,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const createGroup = async (groupName, classID, GroupDescription) => {
  try {
    const classfound = await Class.findById(classID);
    if (!classfound) {
      throw new Error("Class not found");
    }

    const newGroup = await Group.create({
      GroupName: groupName,
      GroupDescription: GroupDescription,
      class: classID,
      leader: null,
      mentor: null,
    });
    return {
      message: "Create new group successfully",
      group: newGroup,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteStudentFromGroup = async (groupId, studentId) => {
  try {
    const stdfound = await Student.findById(studentId);
    if (!stdfound) {
      throw new Error("student not found");
    }
    const updatestd = await Student.findByIdAndUpdate(
      studentId,
      { $set: { group: null } },
      { new: true }
    );
    const groupfound = await Group.findById(groupId);
    if (!groupfound) {
      throw new Error("group not found");
    }
    const updateteamMember = groupfound.teamMembers.filter(
      (memberId) => memberId.toString() !== studentId.toString()
    );
    const updategroup = await Group.findByIdAndUpdate(
      groupId,
      { $set: { teamMembers: updateteamMember } },
      { new: true }
    )
      .select(
        "GroupName GroupDescription isSponsorship mentor teamMembers tag leader groupImage lock"
      )
      .populate({
        path: "teamMembers",
        select: "_id name gen major studentId account",
        populate: {
          path: "account",
          select: "profilePicture",
        },
      })
      .populate({
        path: "tag",
        select: "name ",
      })
      .populate({
        path: "mentor",
        select: "name profilePicture",
      });

    return {
      message: `Remove  ${stdfound.name}  from group ${groupfound.GroupName} success successfully`,
      group: updategroup,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const ungroup = async (groupId) => {
  try {
    const groupfound = await Group.findById(groupId);
    if (!groupfound) {
      throw new Error("group not found");
    }
    if (groupfound.oldMark || groupfound.isSponsorship) {
      throw new Error(`Cannot delete this group`);
    }
    const teamMembers = groupfound.teamMembers;

    for (const studentId of teamMembers) {
      const student = await Student.findByIdAndUpdate(
        studentId,
        { $set: { group: null } },
        { new: true }
      );
      if (!student) {
        console.error(`Student with ID ${studentId} not found.`);
      }
    }

    const updategroup = await Group.findByIdAndDelete(groupId);
    return {
      message: `Delete group ${groupfound.GroupName} success successfully`,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const lockOrUnlockGroup = async (groupId) => {
  try {
    const groupfound = await Group.findById(groupId);
    if (!groupfound) {
      throw new Error("group not found");
    }
    if (!("lock" in groupfound)) {
      groupfound.lock = true;
      const updategroup = await Group.save();
      return {
        message: `locked group ${groupfound.GroupName}`,
        group: updategroup,
      };
    }

    const newLock = !groupfound.lock;
    const updategroup = await Group.findByIdAndUpdate(
      groupId,
      { $set: { lock: newLock } },
      { new: true }
    )
      .select(
        "GroupName GroupDescription isSponsorship mentor teamMembers tag leader groupImage lock"
      )
      .populate({
        path: "teamMembers",
        select: "_id name gen major studentId account",
        populate: {
          path: "account",
          select: "profilePicture",
        },
      })
      .populate({
        path: "tag",
        select: "name ",
      })
      .populate({
        path: "mentor",
        select: "name profilePicture",
      });

    const message = newLock
      ? `locked group ${groupfound.GroupName}`
      : `unlocked group ${groupfound.GroupName}`;
    return { message: message, group: updategroup };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getGroupsByClassId = async (classId) => {
  try {
    const groups = await Group.find({ class: classId })
      .select('GroupName GroupDescription timeline') 
      .lean(); 
    return groups; 
  } catch (error) {
    console.error('Error fetching groups by class:', error.message);
    throw error;
  }
};
const editTimelineForManyGroups = async (groupIds, type, updateData) => {
  try {
    const groups = await Group.find({
      _id: { $in: groupIds },
      "timeline.type": type,
      "timeline.editAble": true
    });
    const updateResult = await Group.updateMany(
      { _id: { $in: groupIds }, "timeline.type": type },
      {
        $set: {
          "timeline.$[timelineItem].title": updateData.title,
          "timeline.$[timelineItem].description": updateData.description,
          "timeline.$[timelineItem].endDate": updateData.endDate,
        }
      },
      {
        arrayFilters: [{ "timelineItem.type": type }],
        new: true
      }
    );

    return await Group.find({
      _id: { $in: groupIds },
      "timeline.type": type
    }).populate({
      path: "timeline",
      match: { type }
    });

  } catch (error) {
    throw new Error(error.message);
  }
};



const updateTimelineStatusIfNeeded = async (groupId, submissionData, session) => {
  // Lấy `timeline` của `Group`
  const group = await Group.findById(groupId).session(session).select("timeline");
  if (!group) throw new Error("Group not found");
  const { grade, createdAt } = submissionData;
  const createdAtDate = new Date(createdAt);
  let timelineUpdated = false; // Flag to check if any update is needed

  // Duyệt qua từng mục trong `timeline` và cập nhật `status` dựa trên điều kiện
  group.timeline.forEach(item => {
    const endDate = new Date(item.endDate);

    // Check if the status needs to be updated
    if (grade && createdAtDate < endDate && item.status !== "finish") {
      item.status = "finish";
      timelineUpdated = true;
    } else if (!grade && createdAtDate < endDate && item.status !== "waiting grade") {
      item.status = "waiting grade";
      timelineUpdated = true;
    } else if (createdAtDate > endDate && item.status !== "overdue") {
      item.status = "overdue";
      timelineUpdated = true;
    }
  });

  // Only save changes if the timeline was updated
  if (timelineUpdated) {
    await group.save({ session });
  }
};

export default {
  createCellsOnUpdate,
  createJourneyRow,
  findGroupById,
  createJourneyCol,
  deleteRow,
  deleteCol,
  updateCellContent,
  updateColumn,
  updateRow,
  updateCanvasCell,
  addCustomerPersona,
  updateCustomerPersona,
  deleteCustomerPersona,
  findAllGroupsOfClass,
  addStundentInGroup,
  assignLeader,
  createGroup,
  deleteStudentFromGroup,
  ungroup,
  lockOrUnlockGroup,
  getGroupsByClassId,
  editTimelineForManyGroups,
  updateTimelineStatusIfNeeded
};
