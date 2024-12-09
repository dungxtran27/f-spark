import mongoose from "mongoose";
import Class from "../model/Class.js";
import ClassWork from "../model/ClassWork.js";
import Student from "../model/Student.js";
import Submission from "../model/Submisson.js";
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
      class: classId,
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
export default {
  getClassWorkByStudent,
  getOutcomes,
  getClassWorkByTeacher,
  editClassWorkByTeacher,
  deleteClasswork,
  createClassWork,
  upvoteAnnouncement,
};
