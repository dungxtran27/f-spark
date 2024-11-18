import mongoose from "mongoose";
import Class from "../model/Class.js";
const getClassesOfTeacher = async (teacherId) => {
  try {
    const classes = await Class.aggregate([
      {
        $match: {
          teacher: new mongoose.Types.ObjectId(teacherId),
        },
      },
      {
        $lookup: {
          from: "Students",
          let: { classId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$classId", "$$classId"],
                  $eq: ["$group", null],
                },
              },
            },
          ],
          as: "ungroupedStudent",
        },
      },
      {
        $addFields: {
          ungroupedStudentCount: {
            $size: "$ungroupedStudent",
          },
        },
      },
      {
        $lookup: {
          from: "Students",
          localField: "_id",
          foreignField: "classId",
          as: "students",
        },
      },
      {
        $addFields: {
          totalStudents: { $size: "$students" },
        },
      },
      {
        $lookup: {
          from: "Groups",
          localField: "_id",
          foreignField: "class",
          as: "groups",
        },
      },
      {
        $addFields: {
          groupsCount: { $size: "$groups" },
        },
      },
      {
        $project: {
          students: 0,
          groups: 0,
          ungroupedStudent: 0,
        },
      },
    ]);
    return classes;
  } catch (error) {
    throw new Error(error.message);
  }
};

const pinClasswork = async (classworkId, classId) => {
  try {
    const classData = await Class.findById(classId).select("_id pin");
    if (!classData) {
      throw new Error("Class not found");
    }
    if (classData.pin && classData.pin.toString() === classworkId) {
      throw new Error("Classwork is already pinned");
    }
    const updatePinClass = await Class.findOneAndUpdate(
      { _id: classId },
      { pin: classworkId },
      { new: true }
    );
    return updatePinClass;
  } catch (error) {
    throw new Error(error.message);
  }
};
const findClassById = async (classId) => {
  try {
    const result = await Class.findById(classId).populate({
      path: "teacher",
      select: "_id name salutation account phoneNumber",
      populate: {
        path: "account",
        select: "profilePicture email",
      },
    });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllClasses = async () => {
  try {
    const classes = await Class.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "Groups",
          localField: "_id",
          foreignField: "class",
          as: "groups",
        },
      },
      {
        $addFields: {
          sponsorshipCount: {
            $size: {
              $filter: {
                input: "$groups",
                as: "group",
                cond: { $eq: ["$$group.isSponsorship", true] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "Teachers",
          localField: "teacher",
          foreignField: "_id",
          as: "teacherDetails",
        },
      },
      {
        $addFields: {
          teacher: { $arrayElemAt: ["$teacherDetails", 0] },
        },
      },
      {
        $addFields: {
          teacherId: "$teacher._id",
          teacherName: "$teacher.name",
        },
      },
      {
        $addFields: {
          groupCount: { $size: "$groups" },
        },
      },
      {
        $lookup: {
          from: "Students",
          localField: "_id",
          foreignField: "classId",
          as: "students",
        },
      },
      {
        $addFields: {
          studentCount: { $size: "$students" },
        },
      },
      {
        $project: {
          _id: 1,
          classCode: 1,
          isActive: 1,
          sponsorshipCount: 1,
          teacherId: 1,
          teacherName: 1,
          groupCount: 1,
          studentCount: 1,
        },
      },
    ]);
    return classes;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllClass = async (page, limit, classCode, teacherName, category) => {
  try {
    let filterCondition = {
      $and: []
    };

    if (classCode) {
      filterCondition.$and.push({ classCode: { $regex: classCode, $options: "i" } });
    }

    if (teacherName) {
      filterCondition.$and.push({ "teacherDetails.name": { $regex: teacherName, $options: "i" } });
    }

    if (category === 'full') {
      filterCondition.$and.push(
        { totalGroups: { $gte: 5 } },
        { totalStudents: { $gte: 10 } }
      );
    }

    if (category === 'miss') {
      filterCondition.$and.push(
        { totalStudents: { $lt: 10 } },
        { totalGroups: { $lte: 5 } }
      )
    };

    if (filterCondition.$and.length === 0) {
      filterCondition = {};
    }

    const totalItems = await Class.countDocuments();
    const maxPages = Math.ceil(totalItems / limit);

    const classes = await Class.aggregate([
      {
        $lookup: {
          from: "Teachers",
          localField: "teacher",
          foreignField: "_id",
          as: "teacherDetails",
        },
      },
      {
        $unwind: {
          path: "$teacherDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Groups",
          localField: "_id",
          foreignField: "class",
          as: "groups",
        },
      },
      {
        $unwind: {
          path: "$groups",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          classCode: { $first: "$classCode" },
          isActive: { $first: "$isActive" },
          teacherDetails: { $first: "$teacherDetails" },
          pinDetails: { $first: "$pinDetails" },
          groups: { $push: "$groups" },
        },
      },
      {
        $project: {
          classCode: 1,
          isActive: 1,
          teacherDetails: { name: 1, email: 1 },
          groups: { GroupName: 1, mentor: 1, isSponsorship: 1, teamMembers: 1 },
          totalGroups: { $size: "$groups" },
          totalStudents: {
            $sum: {
              $map: {
                input: "$groups",
                as: "group",
                in: { $size: "$$group.teamMembers" }
              }
            }
          }
        },
      },
      {
        $match: filterCondition,
      },
      {
        $sort: { classCode: 1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]
    );

    const isLastPage = page >= maxPages;
    return {
      classes,
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
export default {
  pinClasswork,
  getClassesOfTeacher,
  findClassById,
  getAllClasses,
  getAllClass,
};
