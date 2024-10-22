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
    const modifiedOutcome = outcomesList.map((oc) => {
      const submission = submissions.find(
        (s) => s.classworkId.toString() === oc._id.toString()
      );
      return {
        ...oc._doc,
        groupSubmission: submission,
      };
    });
    return res.status(200).json({ outcomesList: modifiedOutcome });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOutcomesByTeacher = async (req, res) => {
  try {
    const classId = req.params.classId;
    const id = new mongoose.Types.ObjectId(classId)
    const outcomes = await ClassworkRepository.getOutcomes(
      id
    )
    return res.status(200).json({ data: outcomes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const getClassWorkByTeacher = async (req, res) => {
  try {
    const classId = req.params.classId;
    const classworkList = await ClassworkRepository.getClassWorkByTeacher(
      classId
    )
    return res.status(200).json({ data: classworkList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const editClassWorkByTeacher = async (req, res) => {
  try {
    const { classWorkId, name, description } = req.body;
    const classworkList = await ClassworkRepository.editClassWorkByTeacher(classWorkId, name, description);
    return res.status(200).json({ data: classworkList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
const deleteClasswork = async (req, res) => {
  try {
    const { classId, classworkId } = req.body;
    if (!classId || !classworkId) {
      return res.status(400).json({ message: "Id is required" });
    }
    const deleteClasswork = await ClassworkRepository.deleteClasswork(classworkId, classId);
    return res.status(200).json({ data: deleteClasswork });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createClassWork = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      classId
    } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const classworkData = {
      name,
      description,
      type,
      classId
    };
    const newClasswork = await ClassworkRepository.createClassWork(classworkData);
    return res.status(201).json({
      data: newClasswork,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};


export default {
  getClassWorkByStudent,
  getClassWorkByTeacher,
  viewOutcomes,
  getOutcomesByTeacher,
  getClassWorkByTeacher,
  editClassWorkByTeacher,
  deleteClasswork,
  createClassWork
};
