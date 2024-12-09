import moment from "moment";
import Term from "../model/Term.js";
import Class from "../model/Class.js";
import Student from "../model/Student.js";
import Teacher from "../model/Teacher.js";
import Mentor from "../model/Mentor.js";
import Group from "../model/Group.js";
const getAllTerms = async () => {
  try {
    const terms = await Term.find({});
    return terms;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createTerms = async (data) => {
  try {
    const newTerm = await Term.create({
      termCode: data?.termCode,
      startTime: data?.startTime,
      endTime: data?.endTime,
      timeLine: data?.timeLine,
    });
    return newTerm;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getActiveTerm = async () => {
  try {
    const currentTime = moment().toISOString();
    const activeTerm = await Term.findOne({
      startTime: { $lt: currentTime },
      endTime: { $gt: currentTime },
    });
    return activeTerm;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findById = async (termId) => {
  try {
    const term = await Term.findById(termId);
    return term;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFillterTerm = async ({ termCode }) => {
  try {
    const terms = await Term.findOne({ _id: termCode });
    return terms;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTimelineOfTerm = async (termId) => {
  try {
    const term = await Term.findById(termId)
    return term.timeLine
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTotalClassByTerm = async ({ termCode }) => {
  try {
    const classes = await Class.find({ term: termCode });
    return classes;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTotalStudentByTerm = async ({ termCode }) => {
  try {
    const students = await Student.find({ term: termCode });
    return students;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTotalTeacherByTerm = async ({ termCode }) => {
  try {
    const classes = await Class.find({ term: termCode }).populate('teacher');
    const teachers = classes
      .map(classItem => classItem.teacher)
      .filter(teacher => teacher !== null);
    return teachers;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTotalMentorByTerm = async ({ termCode }) => {
  try {
    const groups = await Group.find({ term: termCode }).populate('mentor');
    const mentors = groups
      .map(group => group.mentor)
      .filter(mentor => mentor !== null);
    return mentors;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getLatestTerm = async () => {
  return Term.findOne().sort({ endTime: -1 }).exec();
};

const deleteTerm = async ({ termCode }) => {
  return Term.deleteOne({ _id: termCode });
};

const createTimelineOfTerm = async ({ title, type, description, startDate, endDate, termObjectId }) => {
  try {
    const newDeadline = {
      title,
      description,
      startDate,
      endDate,
      type,
    };

    const termUpdate = await Term.findByIdAndUpdate(
      termObjectId,
      {
        $push: { timeLine: newDeadline },
      },
      { new: true }
    )
    return termUpdate;
  } catch (error) {
    return new Error(error);
  }
}
const deleteTimelineOfTerm = async ({ tId, termObjectId }) => {
  try {
    const termUpdate = await Term.findByIdAndUpdate(
      termObjectId,
      {
        $pull: { timeLine: { _id: tId } },
      },
      { new: true }
    )
    return termUpdate;
  } catch (error) {
    return new Error(error);
  }
}

const updateTimelineOfTerm = async ({ title, type, description, startDate, endDate, termObjectId, tId }) => {
  try {
    const updatedTimeline = {
      title,
      description,
      startDate,
      endDate,
      type,
    };

    const termUpdate = await Term.findOneAndUpdate(
      { _id: termObjectId, "timeLine._id": tId },
      {
        $set: {
          "timeLine.$": updatedTimeline,
        },
      },
      { new: true }
    )
    return termUpdate;
  } catch (error) {
    return new Error(error);
  }
}
const findTermByCode = async (termCode) => {
  try {
    return await Term.findOne({ termCode }); 
  } catch (error) {
    throw new Error("Error while finding term by code: " + error.message);
  }
};
export default {
  getAllTerms,
  createTerms,
  getActiveTerm,
  findById,
  getFillterTerm,
  getTotalClassByTerm,
  getTotalStudentByTerm,
  getTotalTeacherByTerm,
  getTotalMentorByTerm,
  getLatestTerm,
  deleteTerm,
  getTimelineOfTerm,
  createTimelineOfTerm,
  deleteTimelineOfTerm,
  updateTimelineOfTerm,
  findTermByCode
};
