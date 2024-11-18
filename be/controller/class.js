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

export default {
  pinClasswork,
  getClassesOfTeacher,
  getTeacherDashboardInfo,
};
