import Classwork from "../model/ClassWork.js";
import Group from "../model/Group.js";
import Submission from "../model/Submisson.js";
import mongoose from "mongoose";

const createSubmission = async ({
  studentId,
  attachment,
  groupId,
  classworkId,
  content
}) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newSubmission = await Submission.create([{
      student: studentId,
      attachment,
      group: groupId,
      classworkId,
      content
    }], { session });

    const populatedSubmission = await newSubmission[0].populate("student");
    await updateTimelineStatusIfNeeded(groupId, {
      createdAt: populatedSubmission.createdAt,
      grade: populatedSubmission.grade
    }, session);

    // Commit the transaction if all goes well
    await session.commitTransaction();
    return populatedSubmission; // Return the populated submission

  } catch (error) {
    await session.abortTransaction(); // Rollback the transaction if an error occurs
    console.error("Error creating submission:", error);
    throw new Error(error.message);
  } finally {
    session.endSession(); // End the session after the transaction
  }
};

const updateTimelineStatusIfNeeded = async (groupId, submissionData, session) => {
  try {
    // Fetch the group and use the session to ensure the operation is part of the transaction
    const group = await Group.findById(groupId).session(session).select("timeline");
    if (!group) {
      throw new Error("Group not found");
    }
    const { grade, createdAt } = submissionData;
    const createdAtDate = new Date(createdAt);
    let timelineUpdated = false; 
    const classwork = await Classwork.findById(submissionData.classworkId).select("type");
    if (classwork && classwork.type !== 'outcome') {
      return; 
    }
    group.timeline.forEach(item => {
      const endDate = new Date(item.endDate);

      if (grade && createdAtDate < endDate && item.status !== "finish") {
        item.status = "finish";
        timelineUpdated = true;
      } 
      else if (!grade && createdAtDate < endDate && item.status !== "waiting grade") {
        item.status = "waiting grade";
        timelineUpdated = true;
      }
      else if (createdAtDate > endDate && item.status !== "overdue") {
        item.status = "overdue";
        timelineUpdated = true;
      }
    });
    if (timelineUpdated) {
      await group.save({ session });
    }
  } catch (error) {
    console.error("Error updating timeline:", error);
    throw new Error(error.message);
  }
};

// Add grade to a submission and update timeline status if needed
const addGrade = async ({ submissionId, grade, criteria }) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updatedSubmission = await Submission.findById(submissionId)
      .session(session)
      .populate("student")
      .populate("group");

    if (!updatedSubmission) throw new Error("Submission not found");

    // Check if the grade or criteria has changed
    let gradeUpdated = false;
    let criteriaUpdated = false;

    if (updatedSubmission.grade !== grade) {
      updatedSubmission.grade = grade;
      gradeUpdated = true;
    }

    if (updatedSubmission.passedCriteria !== criteria) {
      updatedSubmission.passedCriteria = criteria;
      criteriaUpdated = true;
    }

    // Save the updated submission if there are changes
    if (gradeUpdated || criteriaUpdated) {
      await updatedSubmission.save({ session });
    }

    // If the grade was updated, update the timeline status for the group
    if (gradeUpdated) {
      await updateTimelineStatusIfNeeded(updatedSubmission.group._id, {
        grade: updatedSubmission.grade
      }, session);
    }

    await session.commitTransaction();
    return updatedSubmission;

  } catch (error) {
    await session.abortTransaction();
    console.error("Error updating grade:", error);
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};
const getSubmissionsOfGroup = async (outcomeIds, groupId) => {
  try {
    const submissions = await Submission.find({
      classworkId: { $in: outcomeIds },
      group: groupId,
    }).populate({
      path: "student",
    }).populate({
      path: "group",
      select: "GroupName"
    })
    ;
    return submissions;
  } catch (error) {
    return new Error(error.message);
  }
};

// const addGrade = async ({ submissionId, grade, criteria }) => {
//   try {
//     const updatedSubmission = await Submission.findByIdAndUpdate(
//       submissionId,
//       {
//         $set: {
//           grade: grade,
//           passedCriteria: criteria,
//         },
//       },
//       { new: true }
//     )
//       .populate("student")
//       .populate("group");
//     return updatedSubmission;
//   } catch (error) {
//     return new Error(error.message);
//   }
// };
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
      path: 'student',
      populate: {
        path: 'account',
      },
    });
    return result;
  } catch (error) {
    return new Error(error.message);
  }
};


 const getSubmissionsToTakeStatusOfTimeline = async (groupId) => {
  try {
    const group = await Group.findById(groupId).select('timeline')   
    if (!group) {
      throw new Error("Group not found");
    }
    const submissions = await Submission.find({ group: groupId })
      .select('grade createdAt')
      .populate({
        path: 'classworkId',
        select: 'endDate id' 
      });
    return submissions.map(submission => ({
      id: submission._id,
      grade: submission.grade,
      createdAt: submission.createdAt,
      timeline: group.timeline,
    }));

  } catch (error) {
    throw new Error(`Error fetching submissions: ${error.message}`);
  }
};
export default {
  createSubmission,
  getSubmissionsOfGroup,
  addGrade,
  findSubmissionOfStudent,
  getSubmissionsOfClassWork,
  getSubmissionsToTakeStatusOfTimeline
};
