import mongoose from "mongoose";
import Student from "../model/Student.js";
import Class from "../model/Class.js";
import Teacher from "../model/Teacher.js";
import Mentor from "../model/Mentor.js";
import Term from "../model/Term.js";
import Group from "../model/Group.js";
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
      "_id name studentId account major"
    );
    // .populate({ path: "account", select: "profilePicture" });
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
const getAllStudentUngroupByClassIds = async (classIds) => {
  try {
    const students = await Student.find({
      classId: { $in: classIds },
      group: null,
    })
      .select("_id name gen major studentId account classId")
      .populate({
        path: "account",
        select: "profilePicture",
      })
      .populate({
        path: "classId",
        select: "classCode",
      });
    // Group students by classId
    const groupedStudents = students.reduce((acc, student) => {
      const classId = student.classId._id.toString();

      if (!acc[classId]) {
        acc[classId] = {
          class: student.classId,
          students: [],
        };
      }

      acc[classId].students.push(student);
      return acc;
    }, {});

    return {
      students: Object.values(groupedStudents),
      studentNumber: students.length,
    };
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
};
const getAllStudentsNoClass = async (
  page,
  limit,
  searchText,
  term,
  major
) => {
  try {
    const students = await Student.find()
      .populate({
        path: "account",
        select: "email",
      })
      .populate({
        path: "group",
        select: "GroupName _id",
      })
      .populate({
        path: "classId",
        select: "classCode",
      });
    const formattedStudents = students.map((student) => ({
      _id: student._id,
      name: student.name,
      studentId: student.studentId,
      major: student.major,
      email: student.account?.email,
      group: student.group,
      classId: student.classId?.classCode,
      updatedAt: student.updatedAt,
    }));
    let filterCondition = { $and: [] };
    if (searchText) {
      filterCondition.$and.push({
        $or: [
          { name: { $regex: searchText, $options: "i" } },
          { studentId: { $regex: searchText, $options: "i" } },
        ],
      });
    }
    if (term) {
      filterCondition.$and.push({
        term: new mongoose.Types.ObjectId(term),
      });
    }
    if (major && Array.isArray(major)) {
      filterCondition.$and.push({
        major: { $in: major },
      });
    } else if (major) {
      filterCondition.$and.push({
        major: { $regex: major, $options: "i" },
      });
    }
    if (filterCondition.$and.length === 0) {
      filterCondition = {};
    }
    const totalStudent = await Student.countDocuments({ ...filterCondition });

    const StudentNotHaveClass = await Student.aggregate([
      [
        {
          $match: {
            $and: [
              { classId: { $in: [null, undefined] } },
              { group: { $in: [null, undefined] } },
            ],
          },
        },
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
          $lookup: {
            from: "Classes",
            localField: "classId",
            foreignField: "_id",
            as: "classDetails",
          },
        },
        {
          $unwind: {
            path: "$classDetails",
            preserveNullAndEmptyArrays: true,
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
          $project: {
            name: 1,
            studentId: 1,
            gen: 1,
            major: 1,
            group: "$groupDetails.name",
            email: "$accountDetails.email",
            classId: "$classDetails.classCode",
            term: "$termDetails._id",
            termCode: "$termDetails.termCode",
            isActive: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $match: filterCondition, // Apply the search text filter to the data
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
        {
          $sort: {
            name: 1,
          },
        },
      ],
    ]);
    const totalItems = searchText
      ? StudentNotHaveClass.length
      : await Student.countDocuments(StudentNotHaveClass);
    const maxPages = Math.ceil(totalItems / limit);
    const isLastPage = page >= maxPages;

    const formattedStudentsNoClass = StudentNotHaveClass.map((student) => ({
      _id: student._id,
      name: student.name,
      studentId: student.studentId,
      major: student.major,
      email: student.account?.email,
      group: student.group?.GroupName,
      term: student._id,
      termCode: student.termCode,
      classId: student.classId?.classCode,
      updatedAt: student.updatedAt,
    }));
    const countStudentNotHaveClass = await Student.countDocuments(
      {
        classId: { $in: [null, undefined] },
        group: { $in: [null, undefined] }, ...filterCondition
      }
    );
    const uniqueMajors = await Student.distinct("major");
    return {
      students: formattedStudents,
      totalStudent,
      StudentNotHaveClass: formattedStudentsNoClass,
      countStudentNotHaveClass,
      uniqueMajors,
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
const addManyStudentNoClassToClass = async (studentIds, classId) => {
  try {
    const result = await Student.updateMany(
      {
        _id: { $in: studentIds },
        // classId: { $in: [null, undefined] },
      },
      {
        $set: { classId: classId },
      }
    );
    const updatedStudents = await Student.find({
      _id: { $in: studentIds },
      classId: classId,
    }).select("_id name gen major studentId account classId group");
    return updatedStudents;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllAccStudent = async (
  page,
  limit,
  searchText,
  classId,
  status,
  term
) => {
  try {
    let filterCondition = { $and: [] };

    if (searchText) {
      filterCondition.$and.push({
        $or: [
          { name: { $regex: searchText, $options: "i" } },
          {
            accountEmail: {
              $regex: searchText.replace(/[.*+?^=!:${}()|\[\]\/\\-]/g, "\\$&"),
              $options: "i",
            },
          },
          { studentId: { $regex: searchText, $options: "i" } },
        ],
      });
    }

    if (classId) {
      const classDoc = await Class.findOne({ classCode: classId });
      if (classDoc) {
        filterCondition.$and.push({
          classId: new mongoose.Types.ObjectId(classDoc._id),
        });
      }
    }
    if (status) {
      filterCondition.$and.push({ isActive: status });
    }
    if (term) {
      filterCondition.$and.push({
        term: new mongoose.Types.ObjectId(term),
      });
    }

    if (filterCondition.$and.length === 0) {
      filterCondition = {};
    }

    const totalItems = await Student.countDocuments(filterCondition);
    const maxPages = Math.ceil(totalItems / limit);

    const students = await Student.aggregate([
      // {
      //   $match: {
      //     term: new mongoose.Types.ObjectId(term),
      //   },
      // },
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
        $lookup: {
          from: "Classes",
          localField: "classId",
          foreignField: "_id",
          as: "classDetails",
        },
      },
      {
        $unwind: {
          path: "$classDetails",
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
          email: 1,
          major: 1,
          group: "$groupDetails.name",
          accountEmail: "$accountDetails.email",
          classId: "$classDetails.classCode",
          classDetail: "$classDetails",
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
      { $limit: limit },
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
const findStudentDetailByAccountId = async (accountId) => {
  try {
    const student = await Student.findOne({
      account: accountId,
    })
      .populate({
        path: "group",
        select: "_id GroupName",
      })
      .populate({
        path: "classId",
        select: "_id teacher classCode",
      });
    return student;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllStudentByGroupId = async (groupId) => {
  try {
    const students = await Student.find({ group: groupId }).select(
      "_id name studentId account"
    );
    return students;
  } catch (error) {
    throw new Error(error.message);
  }
};
const bulkCreateStudentsFromExcel = async (studentsData) => {
  try {
    const result = await Student.insertMany(studentsData, { ordered: false });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getTotalStudentsByTerm = async (term) => {
  try {
    const termObjectId = new mongoose.Types.ObjectId(term);
    const students = await Student.aggregate([
      {
        $lookup: {
          from: "Term",
          localField: "term",
          foreignField: "_id",
          as: "termDetails"
        }
      },
      {
        $unwind: "$termDetails"
      },
      {
        $match: { "termDetails._id": termObjectId },
      },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          totalStudentsNoClass: {
            $sum: { $cond: [{ $or: [{ $eq: ["$classId", null] }, { $not: ["$classId"] }] }, 1, 0] },
          },
          totalStudentsHaveClass: {
            $sum: { $cond: [{ $and: [{ $ne: ["$classId", null] }, { $not: [{ $not: ["$classId"] }] }] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalStudents: 1,
          totalStudentsNoClass: 1,
          totalStudentsHaveClass: 1,
        },
      },
    ]);

    return students[0] || { totalStudents: 0, totalStudentsNoClass: 0, totalStudentsHaveClass: 0 };
  } catch (error) {
    throw new Error(`Failed to fetch students: ${error.message}`);
  }
};
const findStudentsByIds = async (studentIds) => {
  return await Student.find({ '_id': { $in: studentIds } });
};



const findByStudentId = async (studentId) => {
  try {
    const result = await Student.findOne({
      studentId: studentId,
    }).populate({ path: "classId" });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findByStudentIdPopulated = async (studentId) => {
  try {
    const result = await Student.findById(studentId)
      .populate({ path: "classId" })
      .populate({ path: "group" });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateClass = async (studentId, classId) => {
  try {
    const result = await Student.findByIdAndUpdate(studentId, {
      $set: {
        classId: new mongoose.Types.ObjectId(classId),
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addStudent = async ({ name, studentId, email, group, major, gen, activeTerm }) => {
  try {
    const newStudent = new Student({
      name,
      studentId,
      email,
      group,
      major,
      gen,
      term: activeTerm,
    });
    const result = await newStudent.save();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkStudentExists = async ({ studentId, email }) => {
  try {
    const student = await Student.findOne({
      $or: [
        { studentId },
        { email }
      ]
    });
    return student ? true : false;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  findByStudentId,
  bulkCreateStudentsFromExcel,
  findStudentByAccountId,
  getStudentsByGroup,
  getTeacherByStudentId,
  getAllStudentByClassId,
  getAllStudentUngroupByClassId,
  findById,
  getAllStudentsNoClass,
  addManyStudentNoClassToClass,
  getAllAccStudent,
  getAllStudentUngroupByClassIds,
  findStudentDetailByAccountId,
  getAllStudentByGroupId,
  getTotalStudentsByTerm,
  findStudentsByIds,
  updateClass,
  findByStudentIdPopulated,
  addStudent,
  checkStudentExists
};
