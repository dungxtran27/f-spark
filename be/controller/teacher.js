import { TeacherRepository } from "../repository/index.js"
import mongoose from "mongoose";
const getTeacherByClassId = async (req, res) => {
    try {
        const classId = req.params.classId
        const teachers = await StudentRepository.getTeacherByClassId(classId);
        return res.status(201).json({ data: teachers });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getAllAccTeacher = async (req, res) => {
    try {
        const { page, limit, searchText, status } = req.body;
        const teachers = await TeacherRepository.getAllAccTeacher(page, limit, searchText, status);
        return res.status(201).json({ data: teachers });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
const getTeacherInfo = async (req, res) => {
    try {
      const  teacherId  = req.params.teacherId;
      const teacher = await TeacherRepository.getTeacherWithClasses(teacherId);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
        const formattedData = {
        salutation: teacher.salutation,
        name: teacher.name,
        phoneNumber: teacher.phoneNumber,
        email: teacher.email,
        classes: Array.isArray(teacher.assignedClasses) && teacher.assignedClasses.length > 0
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
  

export default {
    getTeacherByClassId,
    getAllAccTeacher,
    getTeacherInfo
}