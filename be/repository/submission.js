import Submission from "../model/Submisson.js";

const createSubmission = async ({
  studentId,
  attachment,
  groupId,
  classworkId,
  content,
}) => {
  try {
    const newSubmission = await Submission.create({
      student: studentId,
      attachment: attachment,
      group: groupId,
      classworkId: classworkId,
      content: content,
    }).then((result) => result.populate("student"));

    return newSubmission;
  } catch (error) {
    return new Error(error.message);
  }
};
const getSubmissionsOfGroup = async (outcomeIds, groupId) => {
  try {
    const submissions = await Submission.find({
      classworkId: { $in: outcomeIds },
      group: groupId,
    })
      .populate({
        path: "student",
      })
      .populate({
        path: "group",
        select: "GroupName",
      });
    return submissions;
  } catch (error) {
    return new Error(error.message);
  }
};

const addGrade = async ({ submissionId, grade, criteria }) => {
  try {
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      {
        $set: {
          grade: grade,
          passedCriteria: criteria,
        },
      },
      { new: true }
    )
      .populate("student")
      .populate("group")
      .populate({
        path: "classworkId",
        select: "title _id classId",
      });
    return updatedSubmission;
  } catch (error) {
    return new Error(error.message);
  }
};
const findSubmissionOfStudent = async (classWorkId, studentId) => {
  try {
    const result = await Submission.findOne({
      classworkId: classWorkId.toString(),
      student: studentId,
    });
    return result;
  } catch (error) {
    return new Error(error.message);
  }
};
const getSubmissionsOfClassWork = async (classWorkId, studentId) => {
  try {
    const result = await Submission.find({
      classworkId: classWorkId,
      student: { $ne: studentId },
    }).populate({
      path: "student",
      populate: {
        path: "account",
      },
    });
    return result;
  } catch (error) {
    return new Error(error.message);
  }
};
const getSubmissionsByGroupId = async (groupId) => {
  try {
    const submissions = await Submission.find({ group: groupId })
      .populate({
        path: 'group',  // Populate the group field
        select: 'timeline',  // Select only the timeline field from the Group model
      })
      .populate('classworkId')  // Populating classworkId as before
      .exec();
    return submissions;
  } catch (error) {
    throw new Error("Error fetching submissions: " + error.message);
  }
};
const getSubmissionById = async (submissionId) => {
  try {
    const submission = await Submission.findById(submissionId);
    return submission;
  } catch (error) {
    throw new Error(error.message);
  }
}
export default {
  createSubmission,
  getSubmissionsOfGroup,
  addGrade,
  findSubmissionOfStudent,
  getSubmissionsOfClassWork,
  getSubmissionsByGroupId,
  getSubmissionById
};
