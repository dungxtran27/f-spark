import mongoose from "mongoose";
import Class from "../model/Class.js";
import teacher from "./teacher.js";
import Term from "../model/Term.js";
import Classwork from "../model/ClassWork.js";
import { TermRepository } from "./index.js";
import Outcome from "../model/Outcome.js";
import Group from "../model/Group.js";
const getClassesOfTeacher = async ({ teacherId, termId }) => {
  try {
    const classes = await Class.aggregate([
      {
        $match: {
          teacher: new mongoose.Types.ObjectId(teacherId),
          term: new mongoose.Types.ObjectId(termId),
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
                  $and: [
                    {
                      $eq: ["$classId", "$$classId"],
                    },
                    {
                      $or: [
                        { $eq: ["$group", null] },
                        { $not: { $gt: [{ $type: "$group" }, "missing"] } },
                      ],
                    },
                  ],
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
const getClassNumberOfTeacher = async (teacherId) => {
  try {
    const classes = await Class.find({ teacher: teacherId });
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
const getAllClass = async (
  page,
  limit,
  classCode,
  teacherName,
  category,
  termCode
) => {
  try {
    let filterCondition = {
      $and: [],
    };

    if (classCode) {
      filterCondition.$and.push({
        classCode: { $regex: classCode, $options: "i" },
      });
    }

    if (teacherName) {
      filterCondition.$and.push({
        "teacherDetails.name": { $regex: teacherName, $options: "i" },
      });
    }

    if (category === "full") {
      filterCondition.$and.push(
        { totalGroups: { $gte: 5 } },
        { totalStudents: { $gte: 30 } }
      );
    }

    if (category === "miss") {
      filterCondition.$and.push({
        $or: [{ totalGroups: { $lt: 5 } }, { totalStudents: { $lt: 30 } }],
      });
    }
    if (termCode) {
      filterCondition.$and.push({
        $or: [{ termCode: { $regex: termCode, $options: "i" } }],
      });
    }
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
        $group: {
          _id: "$_id",
          classCode: { $first: "$classCode" },
          isActive: { $first: "$isActive" },
          teacherDetails: { $first: "$teacherDetails" },
          pinDetails: { $first: "$pinDetails" },
          groups: { $push: "$groups" },
          students: { $push: "$students" },
          totalStudents: { $first: "$totalStudents" },
          term: { $first: "$term" },
          termDetails: { $first: "$termDetails" },
          termCode: {
            $first: "$termDetails.termCode",
          },
        },
      },
      {
        $project: {
          classCode: 1,
          isActive: 1,
          term: 1,
          termCode: 1,
          teacherDetails: { name: 1, email: 1 },
          groups: { GroupName: 1, mentor: 1, isSponsorship: 1, teamMembers: 1 },
          totalGroups: { $size: "$groups" },
          totalStudents: 1,
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
    ]);

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

const getAllClassMissStudent = async () => {
  try {
    const filterCondition = {
      $and: [
        { $or: [{ totalGroups: { $lt: 5 } }, { totalStudents: { $lt: 30 } }] },
      ],
    };
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
        $group: {
          _id: "$_id",
          classCode: { $first: "$classCode" },
          isActive: { $first: "$isActive" },
          teacherDetails: { $first: "$teacherDetails" },
          pinDetails: { $first: "$pinDetails" },
          groups: { $push: "$groups" },
          students: { $push: "$students" },
          totalStudents: { $first: "$totalStudents" },
        },
      },
      {
        $project: {
          classCode: 1,
          isActive: 1,
          teacherDetails: { name: 1, email: 1 },
          groups: { GroupName: 1, mentor: 1, isSponsorship: 1, teamMembers: 1 },
          totalGroups: { $size: "$groups" },
          totalStudents: 1,
        },
      },
      {
        $match: filterCondition,
      },
    ]);
    return classes;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllClassFullStudent = async () => {
  try {
    const filterCondition = {
      $and: [{ totalGroups: { $gte: 5 } }, { totalStudents: { $gte: 30 } }],
    };
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
        $group: {
          _id: "$_id",
          classCode: { $first: "$classCode" },
          isActive: { $first: "$isActive" },
          teacherDetails: { $first: "$teacherDetails" },
          pinDetails: { $first: "$pinDetails" },
          groups: { $push: "$groups" },
          students: { $push: "$students" },
          totalStudents: { $first: "$totalStudents" },
        },
      },
      {
        $project: {
          classCode: 1,
          isActive: 1,
          teacherDetails: { name: 1, email: 1 },
          groups: { GroupName: 1, mentor: 1, isSponsorship: 1, teamMembers: 1 },
          totalGroups: { $size: "$groups" },
          totalStudents: 1,
        },
      },
      {
        $match: filterCondition,
      },
    ]);
    return classes;
  } catch (error) {
    throw new Error(error.message);
  }
};
const createClass = async ({
  classCode,
  teacher = null,
  backgroundImage = "https://blogs.windows.com/wp-content/uploads/prod/sites/2/2021/10/Windows-11-Bloom-Screensaver-Dark-scaled.jpg", // Default background image
  classInfo = null,
  isActive = true,
}) => {
  try {
    const matchingTerm = await TermRepository.getActiveTerm();
    if (!matchingTerm) {
      throw new Error("No matching term found for the current date.");
    }
    const result = await Class.create({
      classCode,
      teacher,
      backgroundImage,
      classInfo,
      isActive,
      term: matchingTerm._id,
    });
    const outcomeDeadlines =
      matchingTerm.timeLine?.filter(
        (deadline) => deadline.type === "outcome"
      ) || [];
    let outcomeOfClass = []
    for (const deadline of outcomeDeadlines) {
      const outcome = await Outcome.findById(deadline.outcome);
      const newClasswork = await Classwork.create({
        name: deadline.title || null,
        description: deadline.description || null,
        startDate: deadline.startDate || null,
        dueDate: deadline.endDate || null,
        GradingCriteria: outcome?.GradingCriteria || [],
        type: "outcome",
        classId: result._id,
        outcome: outcome?._id
      });
      outcomeOfClass.push(newClasswork)
    }
    return {newClass: result._doc, outcomesClasswork: outcomeOfClass};
  } catch (error) {
    throw new Error(error.message);
  }
};

const getClassByTermCode = async (termId) => {
  try {
    const groups = await Class.find({
      term: termId
    })
    return groups;
  } catch (error) {
    throw new Error(error.message);
  }
}

const findByClassCode = async (classCode) =>{
  try {
    const existingClass = await Class.findOne({
      classCode: classCode
    })
    return existingClass
  } catch (error) {
    throw new Error(error.message);
  }
}

const assignTeacher = async (classId, teacherId) => {
  try {
    const result = await Class?.findByIdAndUpdate(classId, {
      $set: {
        teacher: new mongoose.Types.ObjectId(teacherId),
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  findByClassCode,
  pinClasswork,
  getClassesOfTeacher,
  findClassById,
  getAllClasses,
  getAllClass,
  getClassNumberOfTeacher,
  getAllClassMissStudent,
  getAllClassFullStudent,
  createClass,
  getClassByTermCode,
  assignTeacher
};
