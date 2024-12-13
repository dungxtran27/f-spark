import { GroupRepository, MentorRepository, TermRepository } from "../repository/index.js";
import mongoose from "mongoose";

export const viewAllMentors = async (req, res) => {
  try {
    const { tagIds, name, page, limit, order } = req.body;
    let { term } = req.body;
    const currentTerm = await TermRepository.getActiveTerm();
    if (term == "curr") {
      term = currentTerm._id;
    } else term = null;
    const mentorsData = await MentorRepository.getAllMentors(
      tagIds,
      name,
      parseInt(page),
      parseInt(limit),
      order,
      term
    );
    return res.status(200).json({
      totalItems: mentorsData.totalItems,
      maxPages: mentorsData.maxPages,
      isLastPage: mentorsData.isLastPage,
      pageSize: mentorsData.pageSize,
      pageIndex: mentorsData.pageIndex,
      data: mentorsData.mentors,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMentor = async (req, res) => {
  try {
    const mentors = await MentorRepository.getMentor();
    return res.status(200).json({ data: mentors });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const assignMentor = async (req, res) => {
  try {
    const { mentorId, groupId } = req.body;
    if (!mentorId || !groupId) {
      return res.status(400).json({ error: "mentorId and groupId are required" });
    }
    // const mentorExists = await MentorRepository.getMentor(mentorId);
    // if (!mentorExists) {
    //   return res.status(404).json({ error: "Mentor not found" });
    // }
    // const groupExists = await GroupRepository.findbyId(groupId);
    // if (!groupExists) {
    //   return res.status(404).json({ error: "Group not found" });
    // }
    // if (!mongoose.Types.ObjectId.isValid(mentorId)) {
    //   return res.status(400).json({ error: "Invalid mentorId" });
    // }

    // if (!mongoose.Types.ObjectId.isValid(groupId)) {
    //   return res.status(400).json({ error: "Invalid groupId" });
    // }
    // if (groupExists.mentor) {
    //   return res.status(400).json({ error: "Group already has a mentor" });
    // }
    const updateMentor = await MentorRepository.assignMentor({
      mentorId: new mongoose.Types.ObjectId(mentorId),
      groupId: new mongoose.Types.ObjectId(groupId),
    });
    return res
      .status(200)
      .json({ data: updateMentor, message: "Assign success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllAccMentor = async (req, res) => {
  try {
    const { page, limit, searchText, status, tag } = req.body;
    const mentors = await MentorRepository.getAllAccMentor(
      page,
      limit,
      searchText,
      status,
      tag
    );
    return res.status(200).json({ data: mentors });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getMentorGroups = async (req, res) => {
  const mentorId = req.params.mentorId;
  // if (!mentorId) {
  //   return res.status(400).json({ error: "mentorId is required" });
  // }
  // if (!mongoose.Types.ObjectId.isValid(mentorId)) {
  //   return res.status(400).json({ error: "Invalid mentorId" });
  // }
  try {
    const mentorExists = await MentorRepository.getMentor(mentorId);
    // if (!mentorExists) {
    //   return res.status(404).json({ error: "Mentor not found" });
    // }
    const groupInfo = await MentorRepository.getMentorAssignedGroupInfo(
      mentorId
    );
    // if (!groupInfo.assignedGroup || groupInfo.assignedGroup.length === 0) {
    //   return res.status(404).json({ error: "No groups found for this mentor" });
    // }
    return res.status(200).json({ data: groupInfo });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getTotalMentors = async (req, res) => {
  try {
    const { termCode } = req.body;
    // if (!termCode) {
    //   return res.status(400).json({ error: "termCode is required" });
    // }
    // const termCodeRegex = /^[A-Za-z]{2}\d{2}$/;
    // if (!termCodeRegex.test(termCode)) {
    //   return res.status(400).json({ error: "Invalid termCode format, expected like 'SU24'" });
    // }
    // const termExists = await TermRepository.findTermByCode(termCode);
    // if (!termExists) {
    //   return res.status(404).json({ error: `Term code not found` });
    // }
    const result = await MentorRepository.getTotalMentors(termCode);
    res.status(200).json({
      data: result
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  getMentor,
  assignMentor,
  viewAllMentors,
  getAllAccMentor,
  getMentorGroups,
  getTotalMentors
};
