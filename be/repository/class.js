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
export default {
  pinClasswork,
  getClassesOfTeacher,
  findClassById,
  getAllClasses
};
