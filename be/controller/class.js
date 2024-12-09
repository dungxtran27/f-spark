import {
  AccountRepository,
  ClassRepository,
  ClassworkRepository,
  GroupRepository,
  StudentRepository,
  SubmissionRepository,
  TeacherRepository,
} from "../repository/index.js";

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
const getTeacherDashboardInfo = async (req, res) => {
  const teacherAccId = req.decodedToken.account;
  const teacher = await TeacherRepository.findByAccountId(teacherAccId);

  try {
    const classes = await ClassRepository.getClassNumberOfTeacher(
      teacher._id.toString()
    );
    const groupSponsor = await GroupRepository.findAllSponsorGroupsOfClasses(
      classes.map((c) => c._id)
    );
    const ungroupedStudent =
      await StudentRepository.getAllStudentUngroupByClassIds(
        classes.map((c) => c._id)
      );
    const latestAnnounce =
      await ClassworkRepository.getLatestAnnounceOfClassesByTeacher(
        classes.map((c) => c._id)
      );
    const latestAssignment =
      await ClassworkRepository.getLatestAssignmentOfClassesByTeacher(
        classes.map((c) => c._id)
      );
    const outcome = await ClassworkRepository.getOutcomesOfClasses(
      classes.map((c) => c._id)
    );
    return res.status(200).json({
      data: {
        outcome: outcome,
        class: classes,
        groupSponsor: groupSponsor,
        ungroupedStudent: ungroupedStudent,
        latestAnnounce: latestAnnounce,
        latestAssignment: latestAssignment,
      },
    });
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
    const { page, limit, classCode, teacherName, category, termCode } =
      req.body;
    const [data, dataMissStudent, dataFullStudent] = await Promise.all([
      ClassRepository.getAllClass(
        parseInt(page),
        parseInt(limit),
        classCode,
        teacherName,
        category,
        termCode
      ),
      ClassRepository.getAllClassMissStudent(),
      ClassRepository.getAllClassFullStudent(),
    ]);
    return res.status(200).json({
      data: data.classes,
      totalItems: data.totalItems,
      maxPages: data.maxPages,
      isLastPage: data.isLastPage,
      pageSize: data.pageSize,
      pageIndex: data.pageIndex,
      classMissStudent: dataMissStudent.length,
      classFullStudent: dataFullStudent.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const createClass = async (req, res) => {
  try {
    const { classCode, groupIds, studentIds } = req.body;
    if (!classCode) {
      return res.status(400).json({ message: "Class code is required." });
    }
    const newClass = await ClassRepository.createClass({ classCode });
    if (groupIds && Array.isArray(groupIds) && groupIds.length > 0) {
      const result = await GroupRepository.addGroupAndStudentsToClass(
        groupIds,
        newClass._id
      );
    }
    if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
      const updatedStudents =
        await StudentRepository.addManyStudentNoClassToClass(
          studentIds,
          newClass._id
        );
    }
    return res.status(201).json({
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error, could not create class." });
  }
};

const getClassDetail = async (req, res) => {
  try {
    const { classId } = req.params;
    const result = await ClassRepository.findClassById(classId);
    if (!result) {
      return res.status(404).json({ error: "Class Not found" });
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const assignTeacher = async (req, res) => {
  try {
    const { teacherId, classId } = req.body;
    if (!teacherId || !classId) {
      return res.status(400).json({ error: "TeacherId and classId are required" });
    }
    if (!isValidObjectId(teacherId) || !isValidObjectId(classId)) {
      return res.status(400).json({ error: "Invalid teacherId or classId format" });
    }
    const existClass = await ClassRepository.findClassById(classId);
    if (existClass?.teacher) {
      return res.status(400).json({ error: "This class already have a teacher !" })
    }
    const [updatedClass, updatedTeacher] = await Promise.all([
      ClassRepository.assignTeacher(classId, teacherId),
      TeacherRepository.assignClass(classId, teacherId)
    ]);
    return res.status(200).json({ message: "Assigned successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
export default {
  pinClasswork,
  getClassesOfTeacher,
  getAllClasses,
  getAllClass,
  getTeacherDashboardInfo,
  createClass,
  getClassDetail,
  assignTeacher
};
