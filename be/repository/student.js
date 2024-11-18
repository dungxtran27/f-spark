import mongoose from "mongoose";
import Student from "../model/Student.js";
import Class from "../model/Class.js";
import Teacher from "../model/Teacher.js";
import Mentor from "../model/Mentor.js";
const findStudentByAccountId = async (accountId) => {
  try {
    const student = await Student.findOne({
      account: accountId,
    }).populate("account", "-password");
    return student;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTeacherByStudentId = async (userId) => {
  try {
    const user = await Student.findById(userId);
    const classId = user.classId;
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
const getStudentsByGroup = async (groupId) => {
  try {
    const students = await Student.find({ group: groupId }).select(
      "_id name studentId account"
    );
    return students;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllStudentByClassId = async (classId) => {
  try {
    const students = await Student.find({ classId: classId }).select(
      "_id name studentId account"
    );
    return students;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllStudentUngroupByClassId = async (classId) => {
  try {
    const students = await Student.find({
      classId: classId,
      group: null,
    })
      .select("_id name gen major studentId account")
      .populate({
        path: "account",
        select: "profilePicture",
      });
    return students;
  } catch (error) {
    throw new Error(error.message);
  }
};
const findById = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    return student;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getAllAccStudent = async (page, limit, studentName, mssv, classId, status) => {
  try {
    let filterCondition = { $and: [] };

    if (studentName) {
      filterCondition.$and.push({ name: { $regex: studentName, $options: "i" } });
    }

    if (mssv) {
      filterCondition.$and.push({ studentId: { $regex: mssv, $options: "i" } });
    }

    if (classId) {
      filterCondition.$and.push({ group: mongoose.Types.ObjectId(classId) });
    }

    if (status !== undefined) {
      filterCondition.$and.push({ isActive: status });
    }

    if (filterCondition.$and.length === 0) {
      filterCondition = {};
    }

    const totalItems = await Student.countDocuments(filterCondition);
    const maxPages = Math.ceil(totalItems / limit);

    const students = await Student.aggregate([
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
        $lookup: {
          from: "Groups",
          localField: "group",
          foreignField: "_id",
          as: "groupDetails",
        },
      },
      {
        $unwind: {
          path: "$groupDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: filterCondition,
      },
      {
        $project: {
          name: 1,
          studentId: 1,
          gen: 1,
          major: 1,
          group: "$groupDetails.name",
          accountEmail: "$accountDetails.email",
          isActive: 1,
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
      {
        $limit: limit,
      },
    ]);

    const isLastPage = page >= maxPages;

    return {
      students,
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
  findStudentByAccountId,
  getStudentsByGroup,
  getTeacherByStudentId,
  getStudentsByGroup,
  getAllStudentByClassId,
  getAllStudentUngroupByClassId,
  findById,
  getAllAccStudent,
};
