import {
  ClassworkRepository,
  NotificationRepository,
  StudentRepository,
  SubmissionRepository,
  TeacherRepository,
} from "../repository/index.js";
import mongoose from "mongoose";
import { CLASS_NOTIFICATION_ACTION_TYPE } from "../utils/const.js";
import { userSocketMap, io } from "../index.js";
import { uploadFile } from "../utils/uploadFile.js";
const createSubmission = async (req, res) => {
  try {
    const { attachment, content, fileName } = req.body;
    if (attachment?.length === 0 && content?.length === 0) {
      return res
        .status(400)
        .json({ error: "please input attachment or content" });
    }
    const classworkId = req.query.classworkId;
    const studentId = req.decodedToken.role.id;
    const attatchementLink = await uploadFile(attachment, fileName);

    if (!attatchementLink)
      return res.status(400).json({ error: "Upload failed. please try again" });
    const createSubmiss = await SubmissionRepository.createSubmission({
      groupId: req.groupId,
      studentId,
      classworkId,
      attachment: attatchementLink,
      content,
    });

    const classwork = await ClassworkRepository.getClassworkByClassworkId(
      new mongoose.Types.ObjectId(classworkId)
    );
    const student = await StudentRepository.findStudentByAccountId(
      new mongoose.Types.ObjectId(req.decodedToken.account)
    );
    const teacher = await TeacherRepository.getTeacherAccountByClassId(
      new mongoose.Types.ObjectId(student.classId)
    );

    if (createSubmiss) {
      const notificationData = {
        class: student.classId,
        sender: studentId,
        receivers: [teacher._id],
        senderType: "Student",
        type: "Class",
        action: {
          action: `Created new Submission`,
          target: classworkId,
          actionType: CLASS_NOTIFICATION_ACTION_TYPE.CREATE_SUBMISSION,
          newVersion: classwork,
          priorVersion: createSubmiss,
          extraUrl: `/class/${student.classId}`,
        },
      };
      await NotificationRepository.createNotification({
        data: notificationData,
      });
      const socketIds = userSocketMap[teacher?.account.toString()];
      if (socketIds) {
        io.to(socketIds).emit(
          "newNotification",
          `Assignment ${classwork?.title} has a new submission`
        );
      }
    }

    return res
      .status(201)
      .json({ data: createSubmiss, message: "Submitted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addGrade = async (req, res) => {
  try {
    const { submissionId, grade, criteria } = req.body;
    const criteriaObjectIds = criteria.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    // if (!grade || grade <= 1 || grade >= 10) {
    //   return res.status(400).json({
    //     error: "Grade must be between 1 and 10.",
    //   });
    // }
    // if (!submissionId || !mongoose.Types.ObjectId.isValid(submissionId)) {
    //   return res.status(400).json({
    //     error: "Invalid or missing submission ID.",
    //   });
    // }
    // const submission = await SubmissionRepository.getSubmissionById(
    //   new mongoose.Types.ObjectId(submissionId)
    // );
    // if (!submission) {
    //   return res.status(404).json({
    //     error: "Submission not found.",
    //   });
    // }
    const updateGrade = await SubmissionRepository.addGrade({
      submissionId: new mongoose.Types.ObjectId(submissionId),
      grade,
      criteria: criteriaObjectIds,
    });
    if (updateGrade) {
      const notificationData = {
        group: updateGrade?.group,
        sender: req.decodedToken.role.id,
        class: updateGrade?.classworkId?.classId,
        senderType: "Teacher",
        type: "Class",
        action: {
          action: `Graded your Submission on`,
          target: updateGrade?.classworkId,
          actionType: CLASS_NOTIFICATION_ACTION_TYPE.GRADE_OUTCOME_SUBMISSION,
          newVersion: updateGrade,
          extraUrl: `/class?outcome=${updateGrade?.classworkId?._id}`,
        },
      };
      await NotificationRepository.createNotification({
        data: notificationData,
      });
      const studentsOfGroup = await StudentRepository.getStudentsByGroup(
        updateGrade?.group
      );
      studentsOfGroup.forEach((s) => {
        const socketIds = userSocketMap[s?.account?.toString()];
        if (socketIds) {
          io.to(socketIds).emit(
            "newNotification",
            `Your Submission on ${updateGrade?.classworkId?.title} has been graded`
          );
        }
      });
    }
    return res
      .status(200)
      .json({ data: updateGrade, message: "Graded successfully !" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getSubmissionsOfClassWork = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const { classworkId } = req.params;
    // if (!classworkId || !mongoose.Types.ObjectId.isValid(classworkId)) {
    //   return res.status(400).json({
    //     error: "Invalid or missing classworkId. It must be a valid ObjectId.",
    //   });
    // }
    // const classworkExists = await ClassworkRepository.getClassworkByClassworkId(
    //   new mongoose.Types.ObjectId(classworkId)
    // );
    // if (!classworkExists) {
    //   return res.status(404).json({ error: "Classwork not found" });
    // }
    const submissions = await SubmissionRepository.getSubmissionsOfClassWork(
      classworkId,
      decodedToken?.role?.id
    );
    return res.status(200).json({ data: submissions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getSubmissionsByGroup = async (req, res) => {
  try {
    const { groupId } = req.query;
    if (!groupId) {
      return res.status(400).json({ message: "groupId is required" });
    }
    const submissions = await SubmissionRepository.getSubmissionsByGroupId(
      groupId
    );
    return res.status(200).json({ data: submissions || [] });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred: " + error.message });
  }
};

export default {
  createSubmission,
  addGrade,
  getSubmissionsOfClassWork,
  getSubmissionsByGroup,
};
