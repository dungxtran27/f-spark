import {
  ClassworkRepository,
  StudentRepository,
  SubmissionRepository,
} from "../repository/index.js";
import mongoose from "mongoose";
const getClassWorkByStudent = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const userId = decodedToken.role.id;
    const type = req.params.type;
    const classWork = await ClassworkRepository.getClassWorkByStudent({
      userId,
      type,
    });
    return res.status(201).json({ data: classWork });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getClassWorkByTeacher = async (req, res) => {
  try {
    const classId = req.params.classId;
    const type = req.params.type;
    const classWork = await ClassworkRepository.getClassWorkByTeacher({
      classId,
      type,
    });
    return res.status(201).json({ data: classWork });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const viewOutcomes = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const student = await StudentRepository.findStudentByAccountId(
      decodedToken.account
    );
    if (!student) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const outcomesList = await ClassworkRepository.getOutcomes(student.classId);
    const outcomeIds = outcomesList.map((outcome) => outcome._id);
    const submissions = await SubmissionRepository.getSubmissionsOfGroup(
      outcomeIds,
      student.group
    );
    console.log(student.group);
    console.log(outcomeIds);
    
    const modifiedOutcome = outcomesList.map((oc) => {
      const submission = submissions.find(
        (s) => s.classworkId.toString() === oc._id.toString()
      );
      return {
        ...oc._doc, // Spread the properties of oc
        groupSubmission: submission, // Add groupSubmission attribute
      };
    });
    return res.status(200).json({ outcomesList: modifiedOutcome });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOutcomesByTeacher = async (req,res) => {
  try {
    const classId = req.params.classId;
    const id  = new mongoose.Types.ObjectId(classId)
    const outcomes = await ClassworkRepository.getOutcomes(
      id
    )
    return res.status(200).json({ data: outcomes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const viewOutcomeOfClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const outcomesList = await ClassworkRepository.getOutcomes(classId);
    const outcomeIds = outcomesList.map((outcome) => outcome._id);
    const submissions = await SubmissionRepository.getSubmissionsOfClass(
      outcomeIds,
    );
    
    const modifiedOutcome = outcomesList.map((oc) => {
      const submissionsForOutcome = submissions.filter(
        (s) => s.classworkId.toString() === oc._id.toString()
      );
      return {
        ...oc._doc, // Spread the properties of oc
        submissions: submissionsForOutcome , // Add groupSubmission attribute
      };
    });
    return res.status(200).json({ outcomesList: modifiedOutcome });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  getClassWorkByStudent,
  getClassWorkByTeacher,
  viewOutcomes,
  getOutcomesByTeacher,
  viewOutcomeOfClass
};
