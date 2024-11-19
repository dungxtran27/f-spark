import mongoose from "mongoose";
import Mentor from "../model/Mentor.js";
import TagMajor from "../model/TagMajor.js";
import Group from "../model/Group.js";

const getAllMentors = async (tagIds, name, page, limit) => {
  try {
    const tagIdArray = Array.isArray(tagIds) ? tagIds : tagIds ? [tagIds] : [];
    const searchConditions = [];
    if (tagIdArray.length > 0) {
      searchConditions.push({
        "tag.id": {
          $in: tagIdArray.map((id) => new mongoose.Types.ObjectId(id)),
        },
      });
    }

    if (name) {
      searchConditions.push({
        name: { $regex: name, $options: "i" },
      });
    }

    const matchCondition =
      searchConditions.length > 0 ? { $or: searchConditions } : {};

    const totalItems = await Mentor.countDocuments(matchCondition);
    const maxPages = Math.ceil(totalItems / limit);

    const mentors = await Mentor.aggregate([
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: "TagMajors",
          localField: "tag.id",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phoneNumber: 1,
          profile: 1,
          assignedClasses: 1,
          profilePicture: 1,
          createdAt: 1,
          updatedAt: 1,
          tags: 1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      { $limit: limit },
    ]);
    const isLastPage = page >= maxPages;
    return {
      mentors,
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

const getMentor = async () => {
  try {
    const result = await Mentor.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "TagMajors",
          localField: "tag.id",
          foreignField: "_id",
          as: "tagMajors",
        },
      },
      { $unwind: "$tagMajors" },
      {
        $group: {
          _id: "$tagMajors._id",
          tagName: { $first: "$tagMajors.name" },
          mentors: {
            $push: {
              _id: "$_id",
              name: "$name",
              email: "$email",
              phoneNumber: "$phoneNumber",
              profile: "$profile",
              assignedClasses: "$assignedClasses",
              profilePicture: "$profilePicture",
              isActive: "$isActive",
            },
          },
        },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const assignMentor = async ({ groupId, mentorId }) => {
  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      throw new Error("Mentor not found ");
    }
    const group = await Group.findOne({
      _id: groupId,
      mentor: mentorId,
    });

    if (group) {
      throw new Error("Mentor already exists in the group ");
    }
    const updateMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      {
        $addToSet: { assignedGroup: groupId },
      },
      { new: true }
    );

    const updateGroup = await Group.findByIdAndUpdate(
      groupId,
      { mentor: mentorId },
      { new: true }
    )
      .select(
        "GroupName GroupDescription isSponsorship mentor teamMembers tag leader groupImage"
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
      message: "Mentor assigned successfully",
      group: updateGroup,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllAccMentor = async (page, limit, mentorName, email, status, tag) => {
  try {
    let filterCondition = { $and: [] };

    if (mentorName) {
      filterCondition.$and.push({ name: { $regex: mentorName, $options: "i" } });
    }

    if (email) {
      filterCondition.$and.push({ email: { $regex: email, $options: "i" } });
    }

    if (status !== undefined) {
      filterCondition.$and.push({ isActive: status });
    }

    if (tag) {
      if (Array.isArray(tag)) {
        filterCondition.$and.push({
          "tag.name": { $in: tag },
        });
      } else {
        filterCondition.$and.push({
          "tag.name": tag,
        });
      }
    }

    if (filterCondition.$and.length === 0) {
      filterCondition = {};
    }

    const totalItems = await Mentor.countDocuments(filterCondition);
    const maxPages = Math.ceil(totalItems / limit);

    const mentors = await Mentor.aggregate([
      {
        $match: filterCondition,
      },
      {
        $lookup: {
          from: "TagMajors",
          localField: "tag.id",
          foreignField: "_id",
          as: "tagDetails",
        },
      },
      {
        $unwind: {
          path: "$tagDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phoneNumber: 1,
          profile: 1,
          profilePicture: 1,
          isActive: 1,
          assignedClasses: 1,
          assignedGroup: 1,
          tag: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: { isActive: -1, name: 1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      { $limit: Math.min(limit, totalItems - (page - 1) * limit) },
    ]);

    const isLastPage = page >= maxPages;

    return {
      mentors,
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
const getMentorAssignedGroupInfo = async (mentorId) => {
  try {
    const mentor = await Mentor.findById(mentorId)
      .select("name email phoneNumber profile tag profilePicture isActive") 
      .populate({
        path: "assignedGroup",
        select: "GroupName GroupDescription teamMembers class", 
        populate: {
          path: "class",
          select: "classCode",
        },
      })
      .lean(); 
    if (!mentor) {
      throw new Error("Mentor not found");
    }
    return {
      name: mentor.name,
      email: mentor.email,
      phoneNumber: mentor.phoneNumber,
      profile: mentor.profile,
      tag: mentor.tag,
      profilePicture: mentor.profilePicture,
      isActive: mentor.isActive,
      assignedGroup: mentor.assignedGroup.map(group => ({
        GroupName: group.GroupName,
        GroupDescription: group.GroupDescription,
        teamMembersCount: group.teamMembers.length,
        classCode: group.class ? group.class.classCode : null, 
      })),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  getMentor,
  assignMentor,
  getAllMentors,
  getAllAccMentor,
  getMentorAssignedGroupInfo
};
