import { SubmissionRepository } from "../repository/index.js";

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

export default {
  createSubmission,
};
