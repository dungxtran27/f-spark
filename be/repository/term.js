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

const getTimelineOfTerm = async (termId) => {
  try {
    const term = await Term.findById(termId)
    return term.timeLine
  } catch (error) {
    throw new Error(error.message);
  }
};
const createTimelineOfTerm = async ({title, type, description, startDate, endDate, termObjectId}) => {
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
const deleteTimelineOfTerm = async ({tId, termObjectId}) => {
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

const updateTimelineOfTerm = async ({title, type, description, startDate, endDate, termObjectId, tId}) => {
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
export default {
  getAllTerms,
  createTerms,
  getActiveTerm,
  getTimelineOfTerm,
  createTimelineOfTerm,
  deleteTimelineOfTerm,
  updateTimelineOfTerm
};
