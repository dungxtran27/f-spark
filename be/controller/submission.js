import { SubmissionRepository } from "../repository/index.js";
import mongoose from "mongoose";
const createSubmission = async (req, res) => {
  try {
    const { attachment, content} = req.body;
    if(attachment?.length === 0 && content?.length === 0){
      return res.status(400).json({error: 'please input attachment or content'})
    }
    const classworkId = req.query.classworkId;
    const studentId = req.decodedToken.role.id;
    
    const createSubmiss = await SubmissionRepository.createSubmission({
      groupId: req.groupId,
      studentId,
      classworkId,
      attachment,
      content
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
      .status(200)
      .json({ data: updateGrade, message: "Graded successfully !" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const getSubmissionsOfClassWork = async (req, res) =>{
  try {
    const decodedToken = req.decodedToken;
    const {classworkId} = req.params;
    const submissions = await SubmissionRepository.getSubmissionsOfClassWork(classworkId, decodedToken?.role?.id);
    return res.status(200).json({data: submissions})
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export const getSubmissionsByGroup = async (req, res) => {
  try {
    const { groupId } = req.body;  
    const submissions = await SubmissionRepository.getSubmissionsToTakeStatusOfTimeline(groupId);
    res.status(200).json({
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export default {
  createSubmission,
  addGrade,
  getSubmissionsOfClassWork,
  getSubmissionsByGroup
};
