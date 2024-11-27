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
const getAllStudentsNoClass = async (page, limit, searchText, termCode, major) => {
  try {
    const students = await Student.find()
      .populate({
        path: "account",
        select: "email",
      })
      .populate({
        path: "group",
        select: "GroupName",
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
      group: student.group?.GroupName,
      classId: student.classId?.classCode,
      updatedAt: student.updatedAt,
    }));
    const totalStudent = await Student.countDocuments(students);
    const queryNotHaveClass = {
      classId: { $in: [null, undefined] },
      group: { $in: [null, undefined] },

    };
    let filterCondition = { $and: [] };
    if (searchText) {
      filterCondition.$and.push({
        $or: [
          { name: { $regex: searchText, $options: "i" } },
          { studentId: { $regex: searchText, $options: "i" } },
        ],
      });
    }
    if (termCode) {
      filterCondition.$and.push({
        $or: [
          { termCode: { $regex: termCode, $options: "i" } },
        ],
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
    const StudentNotHaveClass = await Student.aggregate([
      [
        {
          $match: {
            $and: [
              { classId: { $in: [null, undefined] } },
              { group: { $in: [null, undefined] } },
            ]
          }
        },
        {
          $lookup: {
            from: "Accounts",
            localField: "account",
            foreignField: "_id",
            as: "accountDetails"
          }
        },
        {
          $unwind: {
            path: "$accountDetails",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "Groups",
            localField: "group",
            foreignField: "_id",
            as: "groupDetails"
          }
        },
        {
          $unwind: {
            path: "$groupDetails",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "Classes",
            localField: "classId",
            foreignField: "_id",
            as: "classDetails"
          }
        },
        {
          $unwind: {
            path: "$classDetails",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "Term",
            localField: "term",
            foreignField: "_id",
            as: "termDetails"
          }
        },
        {
          $unwind: {
            path: "$termDetails",
            preserveNullAndEmptyArrays: true
          }
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
            termId: "$termDetails._id",
            termCode: "$termDetails.termCode",
            isActive: 1,
            createdAt: 1,
            updatedAt: 1
          }
        },
        {
          $match: filterCondition // Apply the search text filter to the data
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
      ]
    ])
    const totalItems = searchText ? StudentNotHaveClass.length : await Student.countDocuments(StudentNotHaveClass);
    const maxPages = Math.ceil(totalItems / limit);
    const isLastPage = page >= maxPages;

    const formattedStudentsNoClass = StudentNotHaveClass.map((student) => ({
      _id: student._id,
      name: student.name,
      studentId: student.studentId,
      major: student.major,
      email: student.account?.email,
      group: student.group?.GroupName,
      termId: student._id,
      termCode: student.termCode,
      classId: student.classId?.classCode,
      updatedAt: student.updatedAt,
    }));
    const countStudentNotHaveClass = await Student.countDocuments(
      queryNotHaveClass
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
        classId: { $in: [null, undefined] },
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

const getAllAccStudent = async (page, limit, searchText, classId, status) => {
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
        $project: {
          name: 1,
          studentId: 1,
          gen: 1,
          email: 1,
          major: 1,
          group: "$groupDetails.name",
          accountEmail: "$accountDetails.email",
          classId: "$classDetails.classCode",
          isActive: 1,
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

const bulkCreateStudentsFromExcel = async (studentsData) => {
  try {
    const result = await Student.insertMany(studentsData, { ordered: false });
    return result
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
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
};
