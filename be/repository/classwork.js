import Class from "../model/Class.js";
import ClassWork from "../model/ClassWork.js";
import Student from "../model/Student.js";
import Submission from "../model/Submisson.js";
const getClassWorkByStudent = async ({ userId, type }) => {
  try {
    const user = await Student.findById(userId);
    const classId = user.classId;
    if (!user || !user.classId) {
      throw new Error("Student or class not found");
    }
    const classWorks = await ClassWork.find({
      classId: classId,
      type: type,
    });
    const submissions = await Submission.find({
      student: userId,
    }).select("classworkId grade");
    const submissionMap = new Map();
    submissions.forEach((submission) => {
      submissionMap.set(submission.classworkId.toString(), {
        grade: submission.grade,
        gradingCriteria: submission.gradingCriteria,
      });
    });
    const currentDate = new Date();

    const classWorkWithGrades = classWorks.map((classwork) => {
      const isActive =
        currentDate >= classwork.startDate && currentDate <= classwork.dueDate;
      const submissionData = submissionMap.get(classwork._id.toString()) || {
        grade: null,
        gradingCriteria: null,
      };
      return {
        _id: classwork._id,
        title: classwork.title,
        classworkName: classwork.name,
        description: classwork.description,
        type: classwork.type,
        gradingCriteria: classwork.GradingCriteria,
        startDate: classwork.startDate,
        dueDate: classwork.dueDate,
        attachment: classwork.attachment,
        isActive: isActive,
        grade:
          submissionData.grade && submissionData.grade.grade !== undefined
            ? submissionData.grade.grade
            : null,
        gradingCriteriaSubmission:
          submissionData.grade &&
            submissionData.grade.gradingCriteria !== undefined
            ? submissionData.grade.gradingCriteria
            : [],
      };
    });
    return classWorkWithGrades;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOutcomes = async (classId) => {
  try {
    const outcomeList = await ClassWork.find({
      type: "outcome",
      class: classId,
    });
    const outcomeWithSubmissions = await Promise.all(
      outcomeList.map(async (o) => {
        const submissions = await Submission.find({ classworkId: o._id }).populate({path: "group", select: "GroupName"});
        return {
          ...o._doc,
          submissions,
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
      type: { $in: ["announce", "assignment"] },
      classId: classId,
    }).select("_id name title description type classId upVote");

    const classworkList = await Promise.all(data.map(async (classWork) => {
      if (classWork.type === "assignment") {
        const submissions = await Submission.find({
          classworkId: classWork._id
        }).populate({
          path: 'student',
          select: '_id name gen major studentId account',
          populate: {
            path: 'account',
            select: 'profilePicture'
          }
        });
        return { ...classWork._doc, submissions: submissions };
      }
      return { ...classWork._doc, submissions: [] };
    }));

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
      { new: true },
    )
    if (!updatedData) {
      return new Error("ClassWork not found");
    }
    return updatedData;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createClassWork = async ({
  name, description, type, classId
}) => {
  try {
    const result = await ClassWork.create({
      name, description, type, classId
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
      const updatePinClasswork = await Class.findByIdAndUpdate(classId, { pin: null });
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
export default {
  getClassWorkByStudent,
  getOutcomes,
  getClassWorkByTeacher,
  editClassWorkByTeacher,
  deleteClasswork,
  createClassWork
};
