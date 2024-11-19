import { MentorRepository } from "../repository/index.js";
import mongoose from "mongoose";

export const viewAllMentors = async (req, res) => {
  try {
    const { tagIds, name, page, limit } = req.body;
    const mentorsData = await MentorRepository.getAllMentors(
      tagIds,
      name,
      parseInt(page),
      parseInt(limit)
    );
    return res.status(200).json({
      data: mentorsData.mentors,
      totalItems: mentorsData.totalItems,
      maxPages: mentorsData.maxPages,
      isLastPage: mentorsData.isLastPage,
      pageSize: mentorsData.pageSize,
      pageIndex: mentorsData.pageIndex,
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
    if (!groupId || !mentorId) {
      return res.status(500).json({ error: "Thiếu groupId hoặc mentorId" });
    }
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
    const { page, limit, mentorName, email, status, tag } = req.body;
    const mentors = await MentorRepository.getAllAccMentor(page, limit, mentorName, email, status, tag);
    return res.status(200).json({ data: mentors });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getMentorGroups = async (req, res) => {
  const  mentorId  = req.params.mentorId;
  try {
    const groupInfo = await MentorRepository.getMentorAssignedGroupInfo(mentorId);
    return res.status(200).json({data: groupInfo});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  getMentor,
  assignMentor,
  viewAllMentors,
  getAllAccMentor,
  getMentorGroups
};
