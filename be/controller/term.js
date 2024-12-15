import moment from "moment";
import { OutcomeRepository, TermRepository } from "../repository/index.js";
import { DEADLINE_TYPES } from "../utils/const.js";
import mongoose from "mongoose";
const getAllTerms = async (req, res) => {
  try {
    const terms = await TermRepository.getAllTerms();
    return res.status(200).json({ data: terms });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createTerm = async (req, res) => {
  try {
    const { termCode, startTime, endTime } = req.body;
    const outcomes = await OutcomeRepository.getAllOutcome();
    const latestTerm = await TermRepository.getLatestTerm();

    if (latestTerm && moment(startTime).isBefore(latestTerm.endTime)) {
      return res.status(400).json({ error: "The new term cannot begin before the old term ends" });
    }

    const startOfTerm = moment(startTime).add(30, "days");
    const timeline = [
      {
        title: "Create Student Account",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: startTime,
        endDate: moment(startTime).add(7, "days"),
        type: DEADLINE_TYPES.STUDENT_ACCOUNT_CREATE,
        deadLineFor: ['ADMIN']
      },
      {
        title: "Member Transfer",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: moment(startTime).add(8, "days"),
        endDate: moment(startTime).add(15, "days"),
        type: DEADLINE_TYPES.MEMBERS_TRANSFER,
        deadLineFor: ['STUDENT']
      },
      {
        title: "Sponsorship Vote",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: moment(startTime).add(16, "days"),
        endDate: moment(startTime).add(20, "days"),
        type: DEADLINE_TYPES.SPONSOR_SHIP_VOTE,
        deadLineFor: ['STUDENT']
      },
      {
        title: "Sponsorship Finalized",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: moment(startTime).add(20, "days"),
        endDate: moment(startTime).add(23, "days"),
        type: DEADLINE_TYPES.SPONSORSHIP_FINALIZED,
        deadLineFor: ['HOS', 'STUDENT']
      },
      {
        title: "Dividing Classes",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: moment(startTime).add(16, "days"),
        endDate: moment(startTime).add(30, "days"),
        type: DEADLINE_TYPES.DIVIDING_CLASSES,
        deadLineFor: ['ADMIN', 'STUDENT']
      },
      {
        title: "Fund estimation",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: moment(startTime).add(23, "days"),
        endDate: moment(startTime).add(30, "days"),
        type: DEADLINE_TYPES.FUND_ESTIMATION,
        deadLineFor: ['ACCOUNTANT', 'STUDENT']
      },
      {
        title: "Teacher Lock Group",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: startOfTerm,
        endDate: moment(startOfTerm).add(2, "weeks"),
        type: DEADLINE_TYPES.TEACHER_LOCK_GROUP,
        deadLineFor: ['TEACHER']
      },
      {
        title: "Fund Distribution",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: startOfTerm,
        endDate: moment(startOfTerm).add(2, "weeks"),
        type: DEADLINE_TYPES.FUND_DISTRIBUTION,
        deadLineFor: ['ACCOUNTANT', 'STUDENT']
      },
      {
        title: "Fund Return",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum lacinia ullamcorper. Curabitur ex sem, pharetra in pellentesque at, tempor eu est. ",
        startDate: endTime,
        endDate: moment(endTime).add(2, "weeks"),
        type: DEADLINE_TYPES.FUND_RETURN,
        deadLineFor: ['ACCOUNTANT', 'STUDENT']
      },
    ];

    outcomes.sort((a, b) => a.index - b.index).forEach((o) => {
      timeline.push({
        title: `Outcome ${o?.index}`,
        description: o?.description,
        startDate: moment(startOfTerm).add(4 * (o?.index - 1), "weeks"),
        endDate: moment(startOfTerm).add(4 * o?.index, "weeks"),
        type: DEADLINE_TYPES.OUTCOME,
        outcome: o?._id,
        deadLineFor: ['TEACHER', 'STUDENT']
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

const getFillterTerm = async (req, res) => {
  try {
    const { termCode } = req.body;
    const [terms, classes, students, teachers, mentors] = await Promise.all([
      TermRepository.getFillterTerm({ termCode }),
      TermRepository.getTotalClassByTerm({ termCode }),
      TermRepository.getTotalStudentByTerm({ termCode }),
      TermRepository.getTotalTeacherByTerm({ termCode }),
      TermRepository.getTotalMentorByTerm({ termCode }),
    ]);
    return res.status(200).json({
      data: terms,
      totalClasses: classes.length,
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalMentors: mentors.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteTermIncoming = async (req, res) => {
  try {
    const { termCode } = req.query;
    // if (!termCode || typeof termCode !== "string") {
    //   return res.status(400).json({ error: "Invalid or missing termCode" });
    // }
    // const termExists = await TermRepository.findTermByCode(termCode);
    // if (!termExists) {
    //   return res.status(404).json({ error: "Term not found" });
    // }
    await TermRepository.deleteTerm({ termCode });
    return res.status(200).json({ message: "The term has been successfully deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getTimelineOfTerm = async (req, res) => {
  try {
    const termId = req.params.termId;
    // if (!termId || !mongoose.Types.ObjectId.isValid(termId)) {
    //   return res.status(400).json({
    //     error: "Invalid or missing termId. It must be a valid ObjectId.",
    //   });
    // }
    // const termExists = await TermRepository.findById(
    //   new mongoose.Types.ObjectId(termId)
    // );
    // if (!termExists) {
    //   return res.status(404).json({ error: "Term not found" });
    // }
    const term = await TermRepository.getTimelineOfTerm(new mongoose.Types.ObjectId(termId));
    // if (!term || !term.timeline || term.timeline.length === 0) {
    //   return res.status(404).json({
    //     error: "No timeline data found for the specified term.",
    //   });
    // }
    return res.status(200).json({ data: term });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
const createTimelineOfTerm = async (req, res) => {
  try {
    const { title, type, description, startDate, endDate, termId } = req.body;
    const termObjectId = new mongoose.Types.ObjectId(termId)
    const result = await TermRepository.createTimelineOfTerm({ title, type, description, startDate, endDate, termObjectId })
    return res.status(201).json({ data: result, message: "Create Timeline Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const deleteTimelineOfTerm = async (req, res) => {
  try {
    const { timelineId, termId } = req.body;

    const tId = new mongoose.Types.ObjectId(timelineId)
    const termObjectId = new mongoose.Types.ObjectId(termId)
    const result = await TermRepository.deleteTimelineOfTerm({ tId, termObjectId })
    return res.status(201).json({ data: result, message: "Delete Timeline Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const updateTimelineOfTerm = async (req, res) => {
  try {
    const { title, type, description, startDate, endDate, termId, timelineId } = req.body;
    const termObjectId = new mongoose.Types.ObjectId(termId)
    const tId = new mongoose.Types.ObjectId(timelineId)
    const result = await TermRepository.updateTimelineOfTerm({ title, type, description, startDate, endDate, termObjectId, tId })
    return res.status(201).json({ data: result, message: "Update Timeline Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default {
  createTerm,
  getAllTerms,
  getActiveTerm,
  getAllTermsToFilter,
  getFillterTerm,
  deleteTermIncoming,
  getTimelineOfTerm,
  createTimelineOfTerm,
  deleteTimelineOfTerm,
  updateTimelineOfTerm
};
