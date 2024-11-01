import Submission from "../model/Submisson.js";

const createSubmission = async ({
  studentId,
  attachment,
  groupId,
  classworkId,
}) => {
  try {
    const newSubmission = await Submission.create({
      student: studentId,
      attachment: attachment,
      group: groupId,
      classworkId: classworkId,
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
    }).populate({
      path: "student",
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
        $set: 
        { 
          grade: grade,
          passedCriteria: criteria
        }
      },
      { new: true } 
    ).populate("student").populate("group");    
    return updatedSubmission;
  } catch (error) {
    return new Error(error.message); 
  }
};

export default {
  createSubmission,
  getSubmissionsOfGroup,
  addGrade
};
