import mongoose from "mongoose";
import Mentor from "../model/Mentor.js";
import TagMajor from "../model/TagMajor.js";
import Group from "../model/Group.js";
import group from "./group.js";
const getAllMentors = async (tagIds, name, page, limit, order, term) => {
  try {
    const tagIdArray = Array.isArray(tagIds) ? tagIds : tagIds ? [tagIds] : [];
    const sortDirection = order === "down" ? 1 : -1;
    const mentors = await Mentor.aggregate([
      {
        $match: {
          // find by tagid and name
          $and: [
            ...(tagIdArray.length > 0
              ? [
                {
                  "tag.id": {
                    $all: tagIdArray.map(
                      (id) => new mongoose.Types.ObjectId(id)
                    ),
                  },
                },
              ]
              : []),
            ...(name
              ? [
                {
                  name: { $regex: name, $options: "i" },
                },
              ]
              : []),
            { isActive: true },
          ],
        },
      },
      {
        //populate tagid
        $lookup: {
          from: "TagMajors",
          localField: "tag.id",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $lookup: {
          //populate group
          from: "Groups",
          localField: "assignedGroup",
          foreignField: "_id",
          as: "groups",
        },
      },
      {
        $addFields: {
          // Process the groups by filtering and then mapping to choose specific fields
          groups: {
            $let: {
              vars: {
                filteredGroups: {
                  $filter: {
                    input: "$groups",
                    as: "group",
                    cond: {
                      $or: [
                        { $eq: [term, null] }, // Either term is null
                        { $eq: ["$$group.term", term] }, // Or group.term matches the specified term
                      ],
                    },
                  },
                },
              },
              in: {
                $map: {
                  input: "$$filteredGroups", // Operate on the filtered groups
                  as: "group",
                  in: {
                    _id: "$$group._id",
                    term: "$$group.term",
                    groupName: "$$group.GroupName",
                  },
                },
              },
            },
          },
          // Use the filtered groups to calculate the length
          assignedGroupLength: {
            $size: {
              $let: {
                vars: {
                  filteredGroups: {
                    $filter: {
                      input: "$groups",
                      as: "group",
                      cond: {
                        $or: [
                          { $eq: [term, null] },
                          { $eq: ["$$group.term", term] },
                        ],
                      },
                    },
                  },
                },
                in: "$$filteredGroups",
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phoneNumber: 1,
          profile: 1,
          profilePicture: 1,
          createdAt: 1,
          updatedAt: 1,
          tags: 1,
          groups: 1,
          assignedGroupLength: 1,
        },
      },
      {
        $sort: {
          assignedGroupLength: sortDirection,
        },
      },
      {
        $facet: {
          totalItems: [{ $count: "total" }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
    ]);

    const totalItems = mentors[0].totalItems[0]
      ? mentors[0].totalItems[0].total
      : 0;
    const maxPages = Math.ceil(totalItems / limit);
    const isLastPage = page >= maxPages;

    return {
      mentors: mentors[0].data,
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
    });
    if (!group) {
      throw new Error("Group not found ");
    }
    if (group.mentor) {
      if (group.mentor.toString() == mentorId.toString()) {
        throw new Error("Mentor already exists in the group ");
      }
      const updateOldMentor = await Mentor.findByIdAndUpdate(
        group.mentor.toString(),
        {
          $pull: { assignedGroup: groupId },
        },
        { new: true }
      );
    }

    const updateNewMentor = await Mentor.findByIdAndUpdate(
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

const getAllAccMentor = async (page, limit, searchText, status, tag) => {
  try {
    let filterCondition = { $and: [] };
    if (searchText) {
      filterCondition.$and.push({
        $or: [
          { name: { $regex: searchText, $options: "i" } },
          {
            email: {
              $regex: searchText.replace(/[.*+?^=!:${}()|\[\]\/\\-]/g, "\\$&"),
              $options: "i",
            },
          },
        ],
      });
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
        $lookup: {
          from: "TagMajors",
          localField: "tag.id",
          foreignField: "_id",
          as: "tagDetails",
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
        $match: filterCondition,
      },
      {
        $sort: { isActive: -1, name: 1 },
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
      assignedGroup: mentor.assignedGroup.map((group) => ({
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

const getTotalMentors = async (termCode) => {
  try {
    const filterCondition = {
      "assignedGroup": { $ne: [] },
    };

    const mentors = await Mentor.aggregate([
      {
        $lookup: {
          from: "Groups",
          localField: "assignedGroup",
          foreignField: "_id",
          as: "assignedGroups",
        },
      },
      {
        $lookup: {
          from: "Term",
          localField: "assignedGroups.term",
          foreignField: "_id",
          as: "assignedGroupTerm",
        },
      },
      {
        $unwind: {
          path: "$assignedGroupTerm",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          ...filterCondition,
          "assignedGroupTerm.termCode": termCode,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          assignedGroups: { $push: "$assignedGroups" },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          assignedGroups: 1,
        },
      },
    ]);
    return {
      totalMentor: mentors.length,
      mentors: mentors,
    };
  } catch (error) {
    throw new Error(`Failed to fetch mentor data: ${error.message}`);
  }
};




export default {
  getMentor,
  assignMentor,
  getAllMentors,
  getAllAccMentor,
  getMentorAssignedGroupInfo,
  getTotalMentors
};
