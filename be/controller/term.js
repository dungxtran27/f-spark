import moment from "moment";
import { OutcomeRepository, TermRepository } from "../repository/index.js";
import { DEADLINE_TYPES } from "../utils/const.js";

const getAllTerms = async (req, res) => {
  try {
    const terms = await TermNotification.getAllTerms();
    return res.status(200).json({ data: terms });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const createTerm = async (req, res) => {
  try {
    const { termCode, startTime, endTime } = req.body;
    const outcomes = await OutcomeRepository.getAllOutcome();
    const startOfTerm = moment(startTime).add(1, "month");
    const timeline = [
      {
        title: "Member Transfer",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: startTime,
        endDate: moment(startTime).add(14, "days"),
        type: DEADLINE_TYPES.MEMBERS_TRANSFER,
      },
      {
        title: "Sponsorship",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: moment(startTime).add(15, "days"),
        endDate: moment(startTime).add(1, "months"),
        type: DEADLINE_TYPES.SPONSOR_SHIP,
      },
      {
        title: "Dividing Classes",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: moment(startTime).add(15, "days"),
        endDate: moment(startTime).add(1, "months"),
        type: DEADLINE_TYPES.MEMBERS_TRANSFER,
      },
      {
        title: "Teacher Lock Group",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: startOfTerm,
        endDate: moment(startOfTerm).add(2, "weeks"),
        type: DEADLINE_TYPES.TEACHER_LOCK_GROUP,
      },
    ];

    outcomes.map((o) => {
      timeline.push({
        title: `Outcome ${o?.index}`,
        description: o?.description,
        startDate: moment(startOfTerm).add(2 * (o?.index - 1), "weeks"),
        endDate: moment(startOfTerm).add(2 * o?.index, "weeks"),
        type: DEADLINE_TYPES.OUTCOME,
        outcome: o?._id
      });
    });
    const termData = {
      termCode,
      startTime,
      endTime,
      timeLine: timeline,
    };
    const newTerm = await TermRepository.createTerms(termData);
    return res.status(201).json({ data: newTerm, message: "Term created" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getActiveTerm = async (req, res) => {
  try {
    const activeTerm = await TermRepository.getActiveTerm();
    return res.status(200).json({ data: activeTerm });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const getAllTermsToFilter = async (req, res) => {
  try {
    const terms = await TermRepository.getAllTerms();
    return res.status(200).json({ data: terms });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  createTerm,
  getAllTerms,
  getActiveTerm,
  getAllTermsToFilter
};
