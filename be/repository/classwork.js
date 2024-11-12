import mongoose from "mongoose";
import Class from "../model/Class.js";
import ClassWork from "../model/ClassWork.js";
import Student from "../model/Student.js";
import Submission from "../model/Submisson.js";
import { GroupRepository } from "./index.js";
import Group from "../model/Group.js";
const getClassWorkByStudent = async ({ userId }) => {
  try {
    const user = await Student.findById(userId);
    const classId = user.classId;
    if (!user || !user.classId) {
      throw new Error("Student or class not found");
    }
    const classWorks = await ClassWork.find({
      classId: classId,
    }).lean();
    return classWorks;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOutcomes = async (classId, isTeacher) => {
  try {
    const outcomeList = await ClassWork.find({
      type: "outcome",
      classId: classId,
    }).lean();
    if (isTeacher) {
      const outcomeWithSubmissions = await Promise.all(
        outcomeList.map(async (o) => {
          const submissions = await Submission.find({
            classworkId: o._id,
          }).populate({ path: "group", select: "GroupName" });
          return {
            ...o,
            submissions,
          };
        })
      );
      return outcomeWithSubmissions;
    }
    return outcomeList;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getOutcomesOfClasses = async (classIds) => {
  try {
    // Fetch outcomes with their classId
    const outcomeList = await ClassWork.aggregate([
      {
        $match: {
          type: "outcome",
          classId: { $in: classIds },
        },
      },
      {
        $group: {
          _id: "$classId",
          outcomes: { $push: "$$ROOT" },
        },
      },
    ]);
    // Fetch submissions for each group of outcomes
    const outcomeWithSubmissions = await Promise.all(
      outcomeList.map(async ({ _id: classId, outcomes }) => {
        const submissionIds = outcomes.map((o) => o._id);
        const submissions = await Submission.find({
          classworkId: { $in: submissionIds },
        }).populate({ path: "group", select: "GroupName" });
        const groupOfClass = await Group.find({ class: classId });
        const classname = await Class.findById(classId);
        return {
          classId,
          classname: classname.classCode,
          groupNumber: groupOfClass.length,
          outcomes: outcomes.map((o) => ({
            ...o,
            submissions: submissions.filter(
              (s) => s.classworkId.toString() === o._id.toString()
            ),
          })),
        };
      })
    );

    return outcomeWithSubmissions;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getClassWorkByTeacher = async (classId) => {
  try {
    const data = await ClassWork.find({
      type: { $in: ["announcement", "assignment"] },
      classId: classId,
    }).sort({ createdAt: -1 });

    const classworkList = await Promise.all(
      data.map(async (classWork) => {
        if (classWork.type === "assignment") {
          const submissions = await Submission.find({
            classworkId: classWork._id,
          }).populate({
            path: "student",
            select: "_id name gen major studentId account",
            populate: {
              path: "account",
              select: "profilePicture",
            },
          });
          return { ...classWork._doc, submissions: submissions };
        }
        return { ...classWork._doc, submissions: [] };
      })
    );

    return classworkList;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getLatestAnnounceOfClassesByTeacher = async (classIds) => {
  try {
    const data = await ClassWork.aggregate([
      {
        $match: {
          type: "announcement",
          classId: { $in: classIds },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$classId",
          firstAnnouncement: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "Classes", // Replace "Class" with your actual collection name
          localField: "_id",
          foreignField: "_id",
          as: "classInfo",
        },
      },
      {
        $unwind: "$classInfo",
      },
      {
        $project: {
          _id: 0,
          classId: "$classInfo._id", // Access the populated classId
          className: "$classInfo.classCode", // Access other fields from the Class collection
          firstAnnouncement: 1,
        },
      },
    ]);

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getLatestAssignmentOfClassesByTeacher = async (classIds) => {
  try {
    const data = await ClassWork.aggregate([
      {
        $match: {
          type: "assignment",
          classId: { $in: classIds },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$classId",
          latestAssignment: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "Classes", // Replace "Class" with your actual collection name
          localField: "_id",
          foreignField: "_id",
          as: "classInfo",
        },
      },
      {
        $unwind: "$classInfo",
      },
      {
        $project: {
          _id: 0,
          classId: "$classInfo._id", // Access the populated classId
          className: "$classInfo.classCode", // Access other fields from the Class collection
          latestAssignment: 1,
        },
      },
    ]);

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
const editClassWorkByTeacher = async (classWorkId, name, description) => {
  try {
    const updatedData = await ClassWork.findByIdAndUpdate(
      classWorkId,
      { name, description },
      { new: true }
    );
    if (!updatedData) {
      return new Error("ClassWork not found");
    }
    return updatedData;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createClassWork = async ({
  title,
  description,
  attachment,
  startDate,
  dueDate,
  type,
  classId,
}) => {
  try {
    const result = await ClassWork.create({
      title,
      description,
      attachment,
      startDate,
      dueDate,
      type,
      classId,
    });
    return result._doc;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteClasswork = async (classworkId, classId) => {
  try {
    const classToUpdate = await Class.findById(classId);
    if (!classToUpdate) {
      throw new Error("Class not found");
    }
    if (classToUpdate.pin && classToUpdate.pin.toString() === classworkId) {
      const updatePinClasswork = await Class.findByIdAndUpdate(classId, {
        pin: null,
      });
    }
    const deletedClasswork = await ClassWork.findByIdAndDelete(classworkId);
    if (!deletedClasswork) {
      throw new Error("Classwork not found");
    }
    return deleteClasswork;
  } catch (error) {
    throw new Error(error.message);
  }
};
const upvoteAnnouncement = async ({ studentId, classWorkId }) => {
  try {
    const result = await ClassWork.findByIdAndUpdate(
      classWorkId,
      { $push: { upVote: new mongoose.Types.ObjectId(studentId) } },
      { new: true }
    );
    return result;
  } catch (error) {
    throw new Error("Classwork not found");
  }
};

const getUngradedOutcomesCount = async (classId) => {
  try {
    const outcomes = await ClassWork.find({ classId, type: "outcome" }).select(
      "_id name"
    );
    const outcomeIds = outcomes.map((outcome) => outcome._id);
    const ungradedCount = await Submission.countDocuments({
      classworkId: { $in: outcomeIds },
      grade: null,
    });
    return ungradedCount;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getLatestAnnouncementUpvotes = async (classId) => {
  try {
    const latestAnnouncement = await ClassWork.findOne({
      classId,
      type: "announcement",
    }).sort({ createdAt: -1 });
    return latestAnnouncement.upVote.length;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getLatestAssignmentSubmissionsCount = async (classId) => {
  try {
    const latestAssignment = await ClassWork.findOne({
      classId,
      type: "assignment",
    }).sort({ createdAt: -1 });

    return latestAssignment
      ? await Submission.countDocuments({ classworkId: latestAssignment._id })
      : 0;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  getClassWorkByStudent,
  getOutcomes,
  getClassWorkByTeacher,
  editClassWorkByTeacher,
  deleteClasswork,
  createClassWork,
  upvoteAnnouncement,
  getUngradedOutcomesCount,
  getLatestAnnouncementUpvotes,
  getLatestAssignmentSubmissionsCount,
  getLatestAnnounceOfClassesByTeacher,
  getLatestAssignmentOfClassesByTeacher,
  getOutcomesOfClasses,
};
