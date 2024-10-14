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

export default {
    getTeacherByClassId
}