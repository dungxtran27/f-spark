import mongoose from "mongoose";
import Group from "../model/Group.js";
import Student from "../model/Student.js";
import student from "./student.js";
import Class from "../model/Class.js";
import { StudentRepository } from "./index.js";
import { query } from "express";

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
          select: "profilePicture _id",
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
      .populate("tag")
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
      // teamMembers: studentId,
    });
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.teamMembers.includes(studentId)) {
      throw new Error("Student already in group");
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
const createGroup = async (groupName, classID, GroupDescription, termId) => {
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
      term: termId,
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
      throw new Error("Group not found");
    }
    if (groupfound?.lock == true) {
      throw new Error("Group is locked");
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
const findAllSponsorGroupsOfClasses = async (classIds) => {
  try {
    const data = await Group.find({
      class: { $in: classIds },
      isSponsorship: true,
    })
      .select(
        "GroupName GroupDescription isSponsorship mentor class teamMembers tag leader groupImage lock"
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
      })
      .populate({
        path: "class",
        select: "classCode",
      });
    // Group data by classId
    const groupedData = data.reduce((acc, group) => {
      const classId = group.class._id.toString();

      if (!acc[classId]) {
        acc[classId] = {
          class: group.class,
          groupData: [],
        };
      }

      acc[classId].groupData.push(group);
      return acc;
    }, {});

    return { groups: Object.values(groupedData), groupNumber: data.length };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getGroupsByClassId = async (classId) => {
  try {
    const groups = await Group.find({ class: classId })
      .select("GroupName GroupDescription timeline isSponsorship")
      .lean();
    return groups;
  } catch (error) {
    throw error;
  }
};
const editTimelineForManyGroups = async (groupIds, type, updateData) => {
  try {
    const groups = await Group.find({
      _id: { $in: groupIds },
      "timeline.type": type,
      "timeline.editAble": true,
    });
    const updateResult = await Group.updateMany(
      { _id: { $in: groupIds }, "timeline.type": type },
      {
        $set: {
          "timeline.$[timelineItem].title": updateData.title,
          "timeline.$[timelineItem].description": updateData.description,
          "timeline.$[timelineItem].endDate": updateData.endDate,
        },
      },
      {
        arrayFilters: [{ "timelineItem.type": type }],
        new: true,
      }
    );
    return await Group.find({
      _id: { $in: groupIds },
      "timeline.type": type,
    }).populate({
      path: "timeline",
      match: { type },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findAllGroups = async (page, limit, searchText) => {
  try {
    let filterCondition = { $and: [] };
    if (searchText) {
      filterCondition.$and.push({
        $or: [
          { GroupName: { $regex: searchText, $options: "i" } },
          { "leader.name": { $regex: searchText, $options: "i" } },
          { "leader.studentId": { $regex: searchText, $options: "i" } },
        ],
      });
    }

    if (filterCondition.$and.length === 0) {
      filterCondition = {};
    }

    const groups = await Group.aggregate([
      {
        $lookup: {
          from: "Students",
          localField: "teamMembers",
          foreignField: "_id",
          as: "teamMembers",
        },
      },
      {
        $lookup: {
          from: "Students",
          localField: "leader",
          foreignField: "_id",
          as: "leader",
        },
      },
      {
        $lookup: {
          from: "TagMajors",
          localField: "tag",
          foreignField: "_id",
          as: "tag",
        },
      },
      {
        $unwind: {
          path: "$leader",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          GroupName: 1,
          leader: {
            name: "$leader.name",
            studentId: "$leader.studentId",
          },
          tag: "$tag.name",
          teamMembers: "$teamMembers.major",
          isSponsorship: 1,
        },
      },
      {
        $match: filterCondition,
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $sort: {
          GroupName: 1,
        },
      },
    ]);

    const totalItems = searchText
      ? groups.length
      : await Group.countDocuments();
    const maxPages = Math.ceil(totalItems / limit);
    const isLastPage = page >= maxPages;

    return {
      groups,
      totalItems,
      maxPages,
      isLastPage,
      pageSize: limit,
      pageIndex: page,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllGroupsNoClass = async (
  GroupName,
  tag,
  page = 1,
  limit = 10,
  term
) => {
  try {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(limit) || limit <= 0) limit = 10;
    const matchStage = [];
    const tagIdArray = Array.isArray(tag) ? tag : tag ? [tag] : [];
    if (tagIdArray.length > 0) {
      matchStage.push({
        tag: {
          $in: tagIdArray.map((id) => new mongoose.Types.ObjectId(id)),
        },
      });
    }
    if (GroupName) {
      matchStage.push({
        GroupName: { $regex: GroupName, $options: "i" },
      });
    }
    let filterCondition = { $and: [] };

    if (term) {
      filterCondition.$and.push({
        term: new mongoose.Types.ObjectId(term),
      });
    }
    if (filterCondition.$and.length === 0) {
      filterCondition = {};
    }
    const matchCondition = matchStage.length > 0 ? { $or: matchStage } : {};
    const totalItems = await Group.countDocuments({
      class: { $in: [null, undefined] },
      ...matchCondition,
      ...filterCondition
    });
    const maxPages = Math.ceil(totalItems / limit);
    const GroupNotHaveClass = await Group.aggregate([
      {
        $match: {
          $and: [{ class: { $in: [null, undefined] } }, matchCondition],
        },
      },
      { $unwind: { path: "$tag", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "TagMajors",
          localField: "tag",
          foreignField: "_id",
          as: "tag",
        },
      },
      {
        $lookup: {
          from: "Students",
          localField: "teamMembers",
          foreignField: "_id",
          as: "teamMembers",
        },
      },
      {
        $lookup: {
          from: "Term",
          localField: "term",
          foreignField: "_id",
          as: "termDetails",
        },
      },
      {
        $unwind: {
          path: "$termDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          GroupName: { $first: "$GroupName" },
          term: { $first: "$term" },
          termDetails: { $first: "$termDetails" },
          termCode: {
            $first: "$termDetails.termCode",
          },
          isSponsorship: { $first: "$isSponsorship" },
          tag: { $push: { $arrayElemAt: ["$tag", 0] } },
          teamMembers: { $first: "$teamMembers" },
        },
      },
      {
        $project: {
          GroupName: 1,
          leader: 1,
          "tag.name": 1,
          "tag._id": 1,
          isSponsorship: 1,
          teamMembers: {
            _id: 1,
            name: 1,
            studentId: 1,
          },
          term: 1,
          termCode: 1,
          teamMemberCount: { $size: "$teamMembers" },
          class: 1,
        },
      },
      {
        $match: filterCondition,
      },
      {
        $sort: {
          teamMemberCount: 1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);
    const GroupNotHaveClass1 = await Group.find({
      class: { $in: [null, undefined] },
    });
    const isLastPage = page >= maxPages;
    const group = await Group.find()
      .select("GroupName leader tag teamMembers isSponsorship term class")
      .populate({
        path: "teamMembers",
        select: "name",
      })
      .populate({
        path: "tag",
        select: "name",
      })
      .lean();
    const totalGroup = await Group.countDocuments({
      ...filterCondition,
    });
    const countGroupNotHaveClass = await Group.countDocuments({
      class: { $in: [null, undefined] }, ...filterCondition
    });
    return {
      group,
      totalGroup,
      GroupNotHaveClass,
      GroupNotHaveClass1,
      countGroupNotHaveClass,
      totalItems,
      maxPages,
      isLastPage,
      pageSize: limit,
      pageIndex: page,
    };
  } catch (error) {
    throw new Error("Error fetching groups: " + error.message);
  }
};
const addGroupAndStudentsToClass = async (groupIds, classId) => {
  try {
    if (!Array.isArray(groupIds) || groupIds.length === 0) {
      throw new Error("Group IDs must be provided as an array.");
    }
    const updatedGroups = await Group.updateMany(
      { _id: { $in: groupIds }, class: { $in: [null, undefined] } },
      { $set: { class: classId } }
    );
    const groups = await Group.find({ _id: { $in: groupIds } }).populate(
      "teamMembers"
    );
    const studentIds = groups.reduce((acc, group) => {
      return acc.concat(group.teamMembers.map((member) => member._id));
    }, []);
    const updatedStudents =
      await StudentRepository.addManyStudentNoClassToClass(studentIds, classId);
    return {
      groups: groups,
      students: updatedStudents,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const findAllGroupsOfTeacherbyClassIds = async (
  classIds,
  tagIds,
  mentorStatus
) => {
  try {
    const classes = await Class.find({ _id: { $in: classIds } }).select(
      "classCode"
    );
    const groupQuery = {
      class: { $in: classIds },
    };
    if (tagIds !== null && tagIds !== undefined && tagIds.length > 0) {
      groupQuery.tag = { $all: tagIds };
    }

    if (mentorStatus === "no") {
      groupQuery.mentor = null;
    }
    if (mentorStatus === "yes") {
      groupQuery.mentor = { $ne: null };
    }

    const groups = await Group.find(groupQuery)
      .select("GroupName isSponsorship mentor class tag")
      .populate({
        path: "tag",
        select: "name",
      })
      .populate({
        path: "mentor",
        select: "name profilePicture",
      });

    const result = classes.reduce((acc, classInfo) => {
      const matchingGroups = groups.filter((group) =>
        group.class._id.equals(classInfo._id)
      );
      acc[classInfo._id] = {
        classId: classInfo._id,
        classCode: classInfo.classCode,
        groups: matchingGroups,
      };
      return acc;
    }, {});

    return Object.values(result);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateTimelineForGroup = async ({ groupId, classworkId, newDate }) => {
  try {
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: groupId, "timeline.classworkId": classworkId },
      { $set: { "timeline.$.endDate": newDate } },
      { new: true }
    );

    const updatedTimeline = updatedGroup.timeline.find(
      (timeline) => timeline?.classworkId?.toString() == classworkId
    );
    return updatedTimeline;
  } catch (error) {
    throw new Error(error.message);
  }
};
const createGroupsFromExcel = async (groupData) => {
  try {
    const result = await Group.insertMany(groupData, { ordered: false });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getGroupsOfTerm = async (termId) => {
  try {
    const result = await Group.find({ term: termId });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateMember = async (groupId, studentIds) => {
  try {
    const result = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          teamMembers: { $each: studentIds },
        },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTimelineClassworkOfGroup = async ({ groupId, classworkId }) => {
  try {
    const group = await Group.findOne(
      { _id: groupId, "timeline.classworkId": classworkId },
      { "timeline.$": 1 }
    );
    return group.timeline[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMemberOfGroupByGroupId = async (groupId) => {
  try {
    const group = await Group.findById(groupId);
    return group.teamMembers;
  } catch (error) {
    throw error;
  }
};

const addTransaction = async (groupId, transactionData) => {
  try {
    const result = await Group.findByIdAndUpdate(groupId, {
      $push: {
        transactions: transactionData,
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateGallery = async (groupId, images) => {
  try {
    const result = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          gallery: { $each: images },
        },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteImageFromGallery = async (groupId, imageLink) => {
  try {
    const result = await Group.findByIdAndUpdate(
      groupId,
      {
        $pull: {
          gallery: imageLink,
        },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getGallery = async (groupId) => {
  try {
    const result = await Group.findById(groupId).select("gallery");
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getGroupByTermCode = async (termId) => {
  try {
    const groups = Group.find({
      term: termId,
    });
    return groups;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getGroupByClassId = async (classId) => {
  try {
    const groups = Group.find({
      class: classId,
    });
    return groups;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getGroupStatistic = async ({
  page,
  limit,
  groupId,
  classId,
  term,
  status,
}) => {
  try {
    const filters = {};
    if (groupId) filters._id = groupId;
    if (classId) filters.class = classId;
    if (term) filters.term = term;
    if (status) filters.sponsorStatus = status;

    const skip = (page - 1) * limit;

    const sortingOrder = {
      pending: 1,
      sponsored: 2,
      normal: 3,
    };

    const groups = await Group.find(filters)
      .populate("class", "classCode")
      .populate("term", "termCode")
      .populate("mentor", "name")
      .exec();

    groups.sort(
      (a, b) => sortingOrder[a.sponsorStatus] - sortingOrder[b.sponsorStatus]
    );

    const paginatedGroups = groups.slice(skip, skip + limit);

    const totalItems = groups.length;
    const maxPages = Math.ceil(totalItems / limit);
    const isLastPage = page >= maxPages;

    return {
      groups: paginatedGroups,
      totalItems,
      maxPages,
      isLastPage,
      pageSize: limit,
      pageIndex: page,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateGroupSponsorStatus = async ({ groupId, status }) => {
  try {
    let isSponsorship = "";
    if (status == "sponsored") {
      isSponsorship = true;
    } else {
      isSponsorship = false;
    }
    const updateStatus = await Group.findByIdAndUpdate(groupId, {
      sponsorStatus: status,
      isSponsorship: isSponsorship,
    }, { new: true });
    return updateStatus;
  } catch (error) {
    throw new Error(error.message);
  }
};
const findbyId = async (groupId) => {
  try {
    const group = await Group.findById(groupId);
    return group;
  } catch (error) {
    throw new Error("Group not found");
  }
}
const getGroupCountsByTerm = async (term) => {
  try {
    const sponsorStatusCounts = await Group.aggregate([
      {
        $match: {
          term,
          sponsorStatus: { $in: ["pending", "sponsored"] },
        },
      },
      {
        $group: {
          _id: "$sponsorStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalGroups = await Group.countDocuments({ term });
    const response = sponsorStatusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return {
      pending: response.pending || 0,
      sponsored: response.sponsored || 0,
      total: totalGroups,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateGroupInfo = async ({ groupId, name, description, tags }) => {
  try {
    const updateData = {};

    if (name) updateData.GroupName = name;
    if (description) updateData.GroupDescription = description;
    if (tags) updateData.tag = tags;

    const updatedGroup = await Group.findByIdAndUpdate(groupId, updateData, {
      new: true,
    });

    return updatedGroup;
  } catch (error) {
    return new Error(error.message);
  }
};
const getTransactionByTransactionId = async (groupId, transactionId) => {
  try {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found.");
    }

    const transaction = group.transactions.find(
      (transaction) => transaction._id.toString() === transactionId
    );

    if (!transaction) {
      throw new Error("Transaction not found.");
    }

    return transaction;
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteTransaction = async (groupId, transactionId) => {
  try {
    const result = await Group.findByIdAndUpdate(groupId, {
      $pull: {
        transactions: { _id: transactionId },
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const verifyTransaction = async (groupId, transactionId, status) => {
  try {
    const result = await Group.findOneAndUpdate(
      { _id: groupId, "transactions._id": transactionId },
      { $set: { "transactions.$.status": status } },
      { new: true }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getGroupById = async (groupId) => {
  try {
    const result = await Group.findById(groupId)
      .populate('tag class leader term mentor')
      .populate({
        path: 'class',
        populate: {
          path: 'teacher',
          model: 'Teacher',
          populate: {
            path: 'account',
            model: 'Account',
          },
        },
      })
      .populate({
        path: 'teamMembers',
        populate: {
          path: 'account',
          model: 'Account',
        },
      });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const findGroupByOldMark = async () => {
  try {
    const result = await Group.find({ oldMark: { $gte: 8 } });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateClass = async (groupId, classId) => {
  try {
    const result = await Group.findByIdAndUpdate(groupId, {
      $set: { class: new mongoose.Types.ObjectId(classId) },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateGroupTimeLine = async (groupId, timeLine) => {
  try {
    const result = await Group.findByIdAndUpdate(
      groupId,
      {
        $set: {
          timeline: timeLine,
        },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  updateGroupTimeLine,
  updateMember,
  getGroupsOfTerm,
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
  findAllGroups,
  createGroup,
  deleteStudentFromGroup,
  ungroup,
  lockOrUnlockGroup,
  findAllSponsorGroupsOfClasses,
  getGroupsByClassId,
  editTimelineForManyGroups,
  getAllGroupsNoClass,
  addGroupAndStudentsToClass,
  findAllGroupsOfTeacherbyClassIds,
  updateTimelineForGroup,
  getTimelineClassworkOfGroup,
  createGroupsFromExcel,
  getMemberOfGroupByGroupId,
  addTransaction,
  updateGallery,
  deleteImageFromGallery,
  getGallery,
  getGroupByTermCode,
  getGroupByClassId,
  getGroupStatistic,
  updateGroupSponsorStatus,
  findbyId,
  updateGroupInfo,
  deleteTransaction,
  getTransactionByTransactionId,
  verifyTransaction,
  getGroupCountsByTerm,
  getGroupById,
  findGroupByOldMark,
  updateClass,
};
