
import { MentorRepository } from "../repository/index.js";
import mongoose from 'mongoose';


export const viewAllMentors = async (req, res) => {
    try {
      const mentors = await MentorRepository.getAllMentors();
      return res.status(200).json({ data: mentors });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };


const getMentor = async (req,res) => {
    try {
        const mentors = await MentorRepository.getMentor()
        return res.status(200).json({ data: mentors });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
const assignMentor = async (req,res) => {
    try {
        const {mentorId, groupId} = req.body;
        if (!groupId || !mentorId) {
            return res.status(500).json({ error: 'Thiếu groupId hoặc mentorId' });
          }
        const updateMentor = await MentorRepository.assignMentor({
            mentorId: new mongoose.Types.ObjectId(mentorId),
            groupId: new mongoose.Types.ObjectId(groupId)
        })
        return res.status(200).json({ data: updateMentor });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export default {
    getMentor,
    assignMentor,
    viewAllMentors
};
