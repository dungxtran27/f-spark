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
      class: classId,
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

const getClassWorkByTeacher = async ({ classId, type }) => {
  try {
    const classWorks = await ClassWork.find({
      class: classId,
      type: type,
    });
    const currentDate = new Date();

    const classWorkWithGrades = classWorks.map((classwork) => {
      const isActive =
        currentDate >= classwork.startDate && currentDate <= classwork.dueDate;
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
    return outcomeList;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  getClassWorkByStudent,
  getClassWorkByTeacher,
  getOutcomes,
};
