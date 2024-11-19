import Class from "../model/Class.js";
import Mentor from "../model/Mentor.js";
import Student from "../model/Student.js";
import Teacher from "../model/Teacher.js";
import mongoose from "mongoose";

const getTeacherByClassId = async (classId) => {
  try {
    const classDoc = await Class.findById(classId);
    const classCode = classDoc.classCode;

    const teachers = await Teacher.find({
      "assignedClasses.classCode": classCode,
    }).populate({
      path: "account",
      select: "profilePicture",
    });

    const mentors = await Mentor.find({
      "assignedClasses.classCode": classCode,
    });

    const combinedResults = [
      ...teachers.map((teacher) => ({
        name: teacher.name,
        profilePicture: teacher.account ? teacher.account.profilePicture : null,
        role: "Teacher",
      })),
      ...mentors.map((mentor) => ({
        name: mentor.name,
        profilePicture: mentor.profilePicture ? mentor.profilePicture : null,
        role: "Mentor",
      })),
    ];
    return combinedResults;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findByAccountId = async (accountId) => {
  try {
    const teacher = await Teacher.findOne({
      account: accountId,
    }).populate("account", "-password");

    return teacher;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllAccTeacher = async (page, limit, teacherName, email, status) => {
  try {
    let filterCondition = { $and: [] };

    if (teacherName) {
      filterCondition.$and.push({ name: { $regex: teacherName, $options: "i" } });
    }

    if (email) {
      filterCondition.$and.push({ "accountDetails.email": { $regex: email, $options: "i" } });
    }
 
    if (status !== undefined) {
      filterCondition.$and.push({ "accountDetails.isActive": status });
    }

    if (filterCondition.$and.length === 0) {
      filterCondition = {};
    }

    const totalItems = await Teacher.countDocuments(filterCondition);
    const maxPages = Math.ceil(totalItems / limit);
    const teachers = await Teacher.aggregate([
      {
        $lookup: {
          from: "Accounts",
          localField: "account",
          foreignField: "_id",
          as: "accountDetails",
        },
      },
      {
        $unwind: {
          path: "$accountDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: filterCondition,
      },
      {
        $project: {
          name: 1,
          salutation: 1,
          phoneNumber: 1,
          email: "$accountDetails.email",
          isActive: "$accountDetails.isActive",
          assignedClasses: 1,
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
      { $limit: limit },
    ]);

    const isLastPage = page >= maxPages;

    return {
      teachers,
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

const getTeacherWithClasses = async (teacherId) => {
  try {
    const teacherData = await Teacher.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(teacherId) } },
      {
        $lookup: {
          from: "Accounts",
          localField: "account",
          foreignField: "_id",
          as: "account",
        },
      },
      { $unwind: "$account" },
      {
        $lookup: {
          from: "Classes",
          localField: "assignedClasses.id",
          foreignField: "_id",
          as: "assignedClasses",
        },
      },
      {
        $unwind: {
          path: "$assignedClasses",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Students",
          let: { classId: "$assignedClasses._id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$classId", "$$classId"] } } },
            { $count: "studentCount" },
          ],
          as: "studentData",
        },
      },
      {
        $lookup: {
          from: "Groups",
          let: { classId: "$assignedClasses._id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$class", "$$classId"] } } },
            { $count: "groupCount" },
          ],
          as: "groupData",
        },
      },
      {
        $addFields: {
          "assignedClasses.studentCount": {
            $arrayElemAt: ["$studentData.studentCount", 0],
          },
          "assignedClasses.groupCount": {
            $arrayElemAt: ["$groupData.groupCount", 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          salutation: { $first: "$salutation" },
          name: { $first: "$name" },
          phoneNumber: { $first: "$phoneNumber" },
          email: { $first: "$account.email" },
          profilePicture: { $first: "$account.profilePicture" },
          assignedClasses: { $push: "$assignedClasses" },
        },
      },
    ]);
    return teacherData.length > 0 ? teacherData[0] : null;
  } catch (error) {
    throw new Error(`Error fetching teacher info: ${error.message}`);
  }
}



export default {
  getTeacherByClassId,
  findByAccountId,
  getAllAccTeacher,
  getTeacherWithClasses
};
