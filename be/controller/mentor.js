import { MentorRepository } from "../repository/index.js";

export const viewAllMentors = async (req, res) => {
    try {
      const mentors = await MentorRepository.getAllMentors();
      return res.status(200).json({ data: mentors });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };


export default {
    viewAllMentors
};
