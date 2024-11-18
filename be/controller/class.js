import { ClassRepository, GroupRepository } from "../repository/index.js";

const getClassesOfTeacher = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const classes = await ClassRepository.getClassesOfTeacher(
      decodedToken?.role?.id
    );
    return res.status(200).json(classes);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const pinClasswork = async (req, res) => {
  try {
    const { classId, classworkId } = req.body;
    if (!classId || !classworkId) {
      return res.status(400).json({ message: "Id is required" });
    }
    const pinClasswork = await ClassRepository.pinClasswork(
      classworkId,
      classId
    );
    return res.status(200).json({ data: pinClasswork });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await ClassRepository.getAllClasses();
    return res.status(200).json({ data: classes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getAllClass = async (req, res) => {
  try {
    const { page, limit, classCode, teacherName, category } = req.body;
    const data = await ClassRepository.getAllClass(
      parseInt(page),
      parseInt(limit), classCode, teacherName, category
    );
    return res.status(200).json({
      data: data.classes,
      totalItems: data.totalItems,
      maxPages: data.maxPages,
      isLastPage: data.isLastPage,
      pageSize: data.pageSize,
      pageIndex: data.pageIndex,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  pinClasswork,
  getClassesOfTeacher,
  getAllClasses,
  getAllClass
};
