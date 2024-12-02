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
    const terms = await Term.findOne({ termCode: termCode });
    return terms;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  getAllTerms,
  createTerms,
  getActiveTerm,
  getFillterTerm
};
