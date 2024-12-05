import moment from "moment";
import Term from "../model/Term.js";
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
export default {
  getAllTerms,
  createTerms,
  getActiveTerm,
  findById
};
