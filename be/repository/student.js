import mongoose from 'mongoose';
import Student from "../model/Student.js";
import Class from "../model/Class.js";
import Teacher from "../model/Teacher.js";
import Mentor from "../model/Mentor.js";
const findStudentByAccountId = async (accountId) => {
  try {
    const student = await Student.findOne({
      account: accountId,
    }).populate('account', '-password');
    return student;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findStudentByGroupId = async (classId) => {
  try {
    const students = await Student.find({ classId: classId }).select('_id name studentId gen major group').populate('group', 'GroupName');
    console.log(students);

    const groupedStudents = students.reduce((acc, student) => {
      const groupName = student.group.GroupName;
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      const { group, ...studentWithoutGroup } = student._doc;
      acc[groupName].push(studentWithoutGroup);
      return acc;
    }, {});
    return groupedStudents;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getTeacherByStudentId = async (userId) => {
  try {
    const user = await Student.findById(userId)
    const classId = user.classId;
    const classDoc = await Class.findById(classId);
    const classCode = classDoc.classCode;
    console.log("Class Code:", classCode);

    const teachers = await Teacher.find({
      'assignedClasses.classCode': classCode,
    }).populate({
      path: 'account',
      select: 'profilePicture'
    });

    const mentors = await Mentor.find({
      'assignedClasses.classCode': classCode,
    });

    const combinedResults = [
      ...teachers.map(teacher => ({
        name: teacher.name,
        profilePicture: teacher.account ? teacher.account.profilePicture : null,
        role: 'Teacher',
      })),
      ...mentors.map(mentor => ({
        name: mentor.name,
        profilePicture: mentor.profilePicture ? mentor.profilePicture : null,
        role: 'Mentor',
      })),
    ];
    return combinedResults;
  } catch (error) {
    throw new Error(error.message);
  }
}
const getStudentsByGroup = async (groupId) => {
  try {
    const students = await Student.find({ group: groupId }).select('_id name studentId ');
    return students;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  findStudentByAccountId,
  getStudentsByGroup,
  getTeacherByStudentId,
  getStudentsByGroup,
  findStudentByGroupId
};
