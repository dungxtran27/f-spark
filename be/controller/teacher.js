import account from "../repository/account.js";
import { AccountRepository, ClassRepository, TeacherRepository, TermRepository } from "../repository/index.js";
import mongoose from "mongoose";
const getTeacherByClassId = async (req, res) => {
  try {
    const classId = req.params.classId;
    // if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
    //   return res.status(400).json({
    //     error: "Invalid or missing classId. It must be a valid ObjectId.",
    //   });
    // }
    // const classExists = await ClassRepository.findClassById(
    //   new mongoose.Types.ObjectId(classId)
    // );
    // if (!classExists) {
    //   return res.status(404).json({ error: "Class not found" });
    // }
    // const teachers = await TeacherRepository.getTeacherByClassId(classId);
    // if (!teachers || teachers.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ error: "No teachers found for the specified class." });
    // }
    return res.status(201).json({ data: teachers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllAccTeacher = async (req, res) => {
  try {
    const { page, limit, searchText, status, term } = req.body;
    const activeTerm = await TermRepository.getActiveTerm();
    const teachers = await TeacherRepository.getAllAccTeacher(
      page,
      limit,
      searchText,
      status,
      term || activeTerm?._id,
    );
    return res.status(201).json({ data: teachers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getTeacherInfo = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const teacher = await TeacherRepository.getTeacherWithClasses(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const formattedData = {
      salutation: teacher.salutation,
      name: teacher.name,
      phoneNumber: teacher.phoneNumber,
      email: teacher.email,
      profilePicture: teacher.profilePicture,
      classes:
        Array.isArray(teacher.assignedClasses) &&
          teacher.assignedClasses.length > 0
          ? teacher.assignedClasses.map((assignedClass) => ({
            classCode: assignedClass.classCode,
            backgroundImage: assignedClass.backgroundImage,
            studentCount: assignedClass.studentCount || 0,
            groupCount: assignedClass.groupCount || 0,
          }))
          : [],
    };
    res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching teacher information:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getTotalTeachers = async (req, res) => {
  try {
    const { term } = req.body;
    // if (!termCode || typeof termCode !== "string") {
    //   return res.status(400).json({ error: "Invalid or missing termCode" });
    // }
    // const termExists = await TermRepository.findTermByCode(termCode);
    // if (!termExists) {
    //   return res.status(404).json({ error: "Term not found" });
    // }
    const result = await TeacherRepository.getTotalTeachers(term);
    res.status(200).json({
      data: result
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createTeacher = async (req,res) => {
  try {
    const {name, phoneNumber, email, profilePicture, salutation} = req.body;
    const newAccount = await AccountRepository.createAccount({email, profilePicture})
    const account = newAccount._id
    const teacher = await TeacherRepository.createTeacher({name, phoneNumber, account, salutation})
    res.status(200).json({
      data: teacher,
      message: 'Created Teacher'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default {
  getTeacherByClassId,
  getAllAccTeacher,
  getTeacherInfo,
  getTotalTeachers,
  createTeacher
};
