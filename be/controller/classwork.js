import {
  ClassworkRepository,
  StudentRepository,
  SubmissionRepository,
} from "../repository/index.js";
import mongoose from "mongoose";
import moment from "moment";
const getClassWorkByStudent = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const userId = decodedToken.role.id;
    const classWork = await ClassworkRepository.getClassWorkByStudent({
      userId,
    });
    const classWorksList = await Promise.all(
      classWork.map(async (cw) => {
        if(cw.type === 'announcement'){
          return {
            ...cw
          }
        }
        const submissions = await SubmissionRepository.findSubmissionOfStudent(
          cw._id, userId
        );
        return {
          ...cw,
          mySubmission: submissions
        };
      })
    );
    return res.status(200).json({ data: classWorksList });
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
    const outcomesList = await ClassworkRepository.getOutcomes(
      student.classId,
      false
    );
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
        ...oc,
        groupSubmission: submission,
      };
    });
    return res.status(200).json({ data: modifiedOutcome });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOutcomesByTeacher = async (req, res) => {
  try {
    const classId = req.params.classId;
    const id = new mongoose.Types.ObjectId(classId);
    const outcomes = await ClassworkRepository.getOutcomes(id, true);
    return res.status(200).json({ data: outcomes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getClassWorkByTeacher = async (req, res) => {
  try {
    const classId = req.params.classId;
    const classworkList = await ClassworkRepository.getClassWorkByTeacher(
      classId
    );
    return res.status(200).json({ data: classworkList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const editClassWorkByTeacher = async (req, res) => {
  try {
    const { classWorkId, name, description } = req.body;
    const classworkList = await ClassworkRepository.editClassWorkByTeacher(
      classWorkId,
      name,
      description
    );
    return res.status(200).json({ data: classworkList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteClasswork = async (req, res) => {
  try {
    const { classId, classworkId } = req.body;
    if (!classId || !classworkId) {
      return res.status(400).json({ message: "Id is required" });
    }
    const deleteClasswork = await ClassworkRepository.deleteClasswork(
      classworkId,
      classId
    );
    return res.status(200).json({ data: deleteClasswork });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createClassWork = async (req, res) => {
  try {
    const { classId } = req.params;
    const { title, description, attachment, startDate, dueDate, type } =
      req.body;
    if (!title || !type) {
      return res.status(400).json({ error: "Bad request !" });
    }
    const classwork = await ClassworkRepository.createClassWork({
      title,
      description,
      attachment,
      startDate:
        startDate && type === "assignment" ? startDate : moment().toISOString(),
      dueDate,
      type,
      classId,
    });
    return res
      .status(200)
      .json({ data: classwork, message: `${type} created` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const upvoteAnnouncement = async (req, res) =>{
  try {
    const studentId = req.decodedToken.role.id;
    const {classWorkId} = req.params;
    if(!classWorkId){
      return res.status(400).json({error: "Bad request !"})
    }
    const result = await ClassworkRepository.upvoteAnnouncement({studentId, classWorkId});
    return res.status(201).json({data: result})
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default {
  getClassWorkByStudent,
  getClassWorkByTeacher,
  viewOutcomes,
  getOutcomesByTeacher,
  editClassWorkByTeacher,
  deleteClasswork,
  createClassWork,
  upvoteAnnouncement
};
