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
        const { page, limit, teacherName, email, status } = req.body;
        const teachers = await TeacherRepository.getAllAccTeacher(page, limit, teacherName, email, status);
        return res.status(201).json({ data: teachers });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export default {
    getTeacherByClassId,
    getAllAccTeacher
}