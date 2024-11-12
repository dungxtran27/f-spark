import submission from "../controller/submission.js";
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
    await updateTimelineStatusIfNeeded(groupId, classworkId, {
      createdAt: populatedSubmission.createdAt,
      grade: populatedSubmission.grade,
    }, session);

    await session.commitTransaction();
    return populatedSubmission;

  } catch (error) {
    await session.abortTransaction();
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};

const updateTimelineStatusIfNeeded = async (groupId, classworkId, submissionData, session) => {
  try {
    const { grade } = submissionData;
    const classWorkId = new mongoose.Types.ObjectId(classworkId);

    const group = await Group.findOne(
      {
        _id: groupId,
        "timeline.classworkId": classWorkId 
      },
      {
        timeline: { $elemMatch: { classworkId: classWorkId } }  
      }
    ).session(session);

    if (!group || !group.timeline.length) {
      throw new Error("Group or timeline entry not found");
    }

    const timelineEntry = group.timeline[0]; 
    const endDate = new Date(timelineEntry.endDate);
    const createdAtDate = new Date(timelineEntry.updatedAt); 

    // Determine new status based on conditions
    let newStatus = null;
    if (grade !== null && grade !== undefined && createdAtDate < endDate) {
      newStatus = "finish";
    } else if ((grade === null || grade === undefined) && createdAtDate < endDate) {
      newStatus = "waiting grade";
    } else if (createdAtDate > endDate) {
      newStatus = "overdue";
    }

    if (newStatus) {
      await Group.updateOne(
        { _id: groupId, "timeline.classworkId": classWorkId },
        { $set: { "timeline.$.status": newStatus } },
        { session }
      );
    }
  } catch (error) {
    console.error("Error updating timeline:", error);
    throw new Error(error.message);
  }
};



const addGrade = async ({ submissionId, grade, criteria }) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updatedSubmission = await Submission.findById(submissionId)
      .session(session)
      .populate("student")
      .populate("group");

    if (!updatedSubmission) throw new Error("Submission not found");
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

    if (gradeUpdated || criteriaUpdated) {
      await updatedSubmission.save({ session });
    }
    if (gradeUpdated) {
      await updateTimelineStatusIfNeeded(updatedSubmission.group._id, updatedSubmission.classworkId, {
        grade: updatedSubmission.grade,
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
  getSubmissionsToTakeStatusOfTimeline,
  updateTimelineStatusIfNeeded
};
