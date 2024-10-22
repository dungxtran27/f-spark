import { ClassRepository } from "../repository/index.js";

const getClassesOfTeacher = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const classes = await ClassRepository.getClassesOfTeacher(decodedToken?.role?.id);
    return res.status(200).json(classes)
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
export default {
    getClassesOfTeacher
};
