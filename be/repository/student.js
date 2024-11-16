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
const findById = async (studentId) =>{
  try {
    const student = await Student.findById(studentId);
    return student;
  } catch (error) {
    throw new Error(error.message);
  }
}
const getAllStudents = async ({ name, studentId, email, major }) => {
  try {
    const query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (studentId) {
      query.studentId = { $regex: studentId, $options: "i" };
    }
    if (email) {
      query["account.email"] = { $regex: email, $options: "i" };
    }
    if (major) {
      query.major = major;
    }
    const students = await Student.find(query)
      .populate({
        path: "account",
        select: "profilePicture email",
      })
      .populate({
        path: "classId",
        select: "classCode",
      })
      .populate({
        path: "group",
        select: "GroupName",
      });

    const totalStudent = await Student.countDocuments(students);
    const queryNotHaveClass = {
      ...query,
      $or: [{ classId: null }, { classId: undefined }],
    };
    const StudentNotHaveClass = await Student.find(queryNotHaveClass)
      .populate({
        path: "group",
        select: "GroupName",
      });
    const countStudentNotHaveClass = await Student.countDocuments({classId: null, class: undefined});
    return {
      students,
      totalStudent,
      StudentNotHaveClass,
      countStudentNotHaveClass,
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
  getAllStudents
};
