import {
  AccountRepository,
  ClassRepository,
  ClassworkRepository,
  GroupRepository,
  StudentRepository,
  SubmissionRepository,
  TeacherRepository,
} from "../repository/index.js";
import { DEADLINE_TYPES } from "../utils/const.js";
import teacher from "./teacher.js";

const getClassesOfTeacher = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const teacherId = decodedToken?.role?.id;
    const { termId } = req.body;
    const classes = await ClassRepository.getClassesOfTeacher({
      teacherId,
      termId,
    });
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
    const { newClass } = await ClassRepository.createClass({ classCode });
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
    const existClass = await ClassRepository.findClassById(classId);
    if (existClass?.teacher) {
      return res
        .status(400)
        .json({ error: "This class already have a teacher !" });
    }
    const [updatedClass, updatedTeacher] = await Promise.all([
      ClassRepository.assignTeacher(classId, teacherId),
      TeacherRepository.assignClass(classId, teacherId),
    ]);
    return res.status(200).json({ message: "Assigned successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const importClassData = async (req, res) => {
  try {
    const { studentData, classData } = req.body;
    if (classData && classData.length > 0) {
      for (const c of classData) {
        const existingClass = await ClassRepository.findByClassCode(c);
        if (!existingClass && c !== null) {
          const { classes, outcomesClasswork } =
            await ClassRepository.createClass({ classCode: c });
        }
      }
    }
    if (studentData && studentData.length > 0) {
      for (const s of studentData) {
        const existingStudent = await StudentRepository.findByStudentId(
          s?.studentId
        );
        if (!existingStudent) {
          return res.status(400).json({
            error:
              "Data contains unknown student. Create student at Account management",
          });
        }

        if (existingStudent?.classId?.classCode !== s?.classCode) {
          const classUpdate = await ClassRepository.findByClassCode(
            s?.classCode
          );
          if (classUpdate) {
            await StudentRepository.updateClass(
              existingStudent?._id,
              classUpdate?._id
            );
            if (existingStudent?.group) {
              const updatedGroup = await GroupRepository.updateClass(
                existingStudent?.group,
                classUpdate?._id
              );
              const classOutcomes = await ClassworkRepository.getOutcomes(
                classUpdate?._id,
                false
              );
              const updatedTimeline = updatedGroup?.timeline?.map((dl) => {
                if (dl?.type === DEADLINE_TYPES.OUTCOME) {
                  classOutcomes?.forEach((oc) => {
                    if (oc?.outcome.toString() === dl?.outcome.toString()) {
                      dl = {
                        ...dl.toObject(),
                        classworkId: oc?._id || null,
                      };
                    }
                  });
                }
                return dl;
              });
              await GroupRepository.updateGroupTimeLine(
                existingStudent?.group,
                updatedTimeline
              );
            }
          } else {
            await StudentRepository.updateClass(existingStudent?._id, null);
            if (existingStudent?.group) {
              await GroupRepository.updateClass(existingStudent?.group, null);
            }
          }
        }
      }
    }

    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  pinClasswork,
  getClassesOfTeacher,
  getAllClasses,
  getAllClass,
  getTeacherDashboardInfo,
  createClass,
  getClassDetail,
  assignTeacher,
  importClassData,
};
