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
    console.log(error);
    
    throw new Error(error.message)
  }
};
export default {
  getClassesOfTeacher,
};
