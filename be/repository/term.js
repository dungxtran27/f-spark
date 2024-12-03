import moment from "moment";
import Term from "../model/Term.js";
import Class from "../model/Class.js";
import Student from "../model/Student.js";
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
    const currentTime = moment().toISOString()
    const activeTerm = await Term.findOne({
      startTime: { $lt: currentTime },
      endTime: { $gt: currentTime },
    });
    return activeTerm
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
    const teachers = await Student.find({ term: termCode });
    return teachers;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTotalMentorByTerm = async ({ termCode }) => {
  try {
    const mentors = await Student.find({ term: termCode });
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

export default {
  getAllTerms,
  createTerms,
  getActiveTerm,
  getFillterTerm,
  getTotalClassByTerm,
  getTotalStudentByTerm,
  getTotalTeacherByTerm,
  getTotalMentorByTerm,
  getLatestTerm,
  deleteTerm
};
