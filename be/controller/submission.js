import { SubmissionRepository } from "../repository/index.js";
import mongoose from "mongoose";
const createSubmission = async (req, res) => {
  try {
    const { attachment } = req.body;
    const classworkId = req.query.classworkId;

    const studentId = req.decodedToken.role.id;
    const createSubmiss = await SubmissionRepository.createSubmission({
      groupId: req.groupId,
      studentId,
      classworkId,
      attachment,
    });

    
    return res
      .status(201)
      .json({ data: createSubmiss, message: "Submitted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addGrade = async (req,res) => {
  try {
    const { submissionId, grade, criteria } = req.body;
    const criteriaObjectIds = criteria.map((id) => new mongoose.Types.ObjectId(id));

    const updateGrade = await SubmissionRepository.addGrade({
      submissionId: new mongoose.Types.ObjectId(submissionId),
      grade,
      criteria: criteriaObjectIds,
    })
    return res
      .status(201)
      .json({ data: updateGrade, message: "Add grade successfully" });
  } catch (error) {
    
  }
}

export default {
  createSubmission,
  addGrade
};
