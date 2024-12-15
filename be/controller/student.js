import {
  GroupRepository,
  StudentRepository,
  TermRepository,
} from "../repository/index.js";
import xlsx from "xlsx";
const getTeacherByStudentId = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const userId = decodedToken.role.id;
    const student = await StudentRepository.getTeacherByStudentId(userId);
    return res.status(201).json({ data: student });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getStudentsInSameGroup = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const student = await StudentRepository.findStudentByAccountId(
      decodedToken.account
    );
    const students = await StudentRepository.getStudentsByGroup(
      student.group._id
    );
    return res.status(200).json({ data: students });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllStudentByClassId = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const student = await StudentRepository.findStudentByAccountId(
      decodedToken.account
    );
    const students = await StudentRepository.getAllStudentByClassId(
      student.classId
    );
    return res.status(200).json({ data: students });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllStudentUnGroupByClassId = async (req, res) => {
  try {
    const { classId } = req.params;
    if (!classId) {
      return res.status(400).json({ message: "Class ID is required" });
    }
    const students = await StudentRepository.getAllStudentUngroupByClassId(
      classId
    );
    return res.status(200).json({ data: students });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllAccStudent = async (req, res) => {
  try {
    const { page, limit, searchText, classId, status, term } = req.body;
    const students = await StudentRepository.getAllAccStudent(
      page,
      limit,
      searchText,
      classId,
      status,
      term
    );
    return res.status(200).json({ data: students });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllStudentsNoClass = async (req, res) => {
  try {
    const { page, limit, searchText, termCode, major } = req.body;
    const {
      students,
      totalStudent,
      StudentNotHaveClass,
      countStudentNotHaveClass,
      uniqueMajors,
    } = await StudentRepository.getAllStudentsNoClass(
      page,
      limit,
      searchText,
      termCode,
      major
    );
    return res.status(200).json({
      data: {
        students,
        totalStudent,
        StudentNotHaveClass,
        countStudentNotHaveClass,
        uniqueMajors,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const addManyStudentNoClassToClass = async (req, res) => {
  try {
    const { studentIds, classId } = req.body;
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Student IDs must be provided as an array." });
    }
    if (!classId) {
      return res.status(400).json({ message: "Class ID must be provided." });
    }
    // const classExists = await ClassRepository.findClassById(classId);
    // if (!classExists) {
    //   return res.status(404).json({ message: `Class not found.` });
    // }
    // const students = await StudentRepository.findStudentsByIds(studentIds);
    // if (students.length !== studentIds.length) {
    //   const missingStudents = studentIds.filter(id => !students.some(student => student._id.toString() === id));
    //   return res.status(404).json({ message: `Students with IDs ${missingStudents.join(", ")} not found.` });
    // }
    // const studentsAlreadyInClass = students.filter(student => student.classId);
    // if (studentsAlreadyInClass.length > 0) {
    //   const studentNames = studentsAlreadyInClass.map(student => student.name);
    //   return res.status(400).json({
    //     message: `The following students are already assigned to a class: ${studentNames.join(", ")}`
    //   });
    // }
    const updatedStudents =
      await StudentRepository.addManyStudentNoClassToClass(studentIds, classId);
    return res.status(200).json({
      message: `${updatedStudents.length} student(s) have been successfully added to the class.`,
      data: updatedStudents,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const importStudent = async (req, res) => {
  try {
    const workbook = xlsx.read(req?.file?.buffer, { type: "buffer" });
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    const activeTerm = await TermRepository.getActiveTerm();
    if (!activeTerm) {
      return res.status(400).json({ error: "No Active Term" });
    }
    const groupSet = [];
    data?.map((g) => {
      if (!groupSet.find((gs) => gs?.GroupName === g["Tên dự án"])) {
        groupSet.push({
          GroupName: g["Tên dự án"],
          oldMark: g["Mark"],
          term: activeTerm._id,
          timeline: activeTerm.timeLine
            .filter((d) => d?.deadLineFor?.includes("STUDENT"))
            .map(({ deadLineFor, ...rest }) => rest),
        });
      }
    });
    const newGroups = await GroupRepository.createGroupsFromExcel(groupSet);
    const newStudentsExcel = data?.map((g) => {
      return {
        name: g?.FullName,
        studentId: g?.RollNumber,
        gen: g?.RollNumber?.slice(2, 4),
        major: g?.Major,
        group:
          newGroups.find((ng) => ng?.GroupName === g["Tên dự án"])?._id || null,
        term: activeTerm._id,
        email: g?.Email,
      };
    });
    const newStudents = await StudentRepository.bulkCreateStudentsFromExcel(
      newStudentsExcel
    );
    const groupedStudents = newStudents.reduce((acc, s) => {
      if (s?.group != null) {
        if (!acc[s.group]) {
          acc[s.group] = [];
        }

        acc[s.group].push(s);
      }
      return acc;
    }, {});

    for (let key in groupedStudents) {
      const studentIds = groupedStudents[key].map((student) => student._id);
      await GroupRepository.updateMember(key, studentIds);
    }
    return res.status(201).json({
      message: `Imported data successfully, ${newStudents?.length} has been added to term ${activeTerm?.termCode}`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getTotalStudentsByTerm = async (req, res) => {
  try {
    const { term } = req.body;
    const students = await StudentRepository.getTotalStudentsByTerm(term);
    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found for the given termCode" });
    }

    return res.status(200).json({
      data: students
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// const findById = async (studentId) => {
//   try {
//     const student = await StudentRepository.findById(studentId);
//     return student
//   } catch (error) {
//     throw new Error("Student not found");
//   }
// };


const getGroupAndClassInfo = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const student = await StudentRepository.findByStudentIdPopulated(
      decodedToken?.role?.id
    );
    return res.status(200).json({ data: student });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  getStudentsInSameGroup,
  getTeacherByStudentId,
  getAllStudentByClassId,
  getAllStudentUnGroupByClassId,
  getAllStudentsNoClass,
  addManyStudentNoClassToClass,
  getAllAccStudent,
  importStudent,
  getTotalStudentsByTerm,
  // findById
  getGroupAndClassInfo,
};
