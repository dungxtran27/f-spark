import { StudentRepository } from "../repository/index.js"


const getTeacherByStudentId = async (req, res) => {
    try {
        const decodedToken = req.decodedToken;
        const userId = decodedToken.role.id
        const student = await StudentRepository.getTeacherByStudentId(userId);
        return res.status(201).json({ data: student });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getStudentsInSameGroup = async (req, res) => {
    try {
        const decodedToken = req.decodedToken;
        const student = await StudentRepository.findStudentByAccountId(decodedToken.account);
        const students = await StudentRepository.getStudentsByGroup(student.group._id);
        return res.status(200).json({ data: students });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllStudentByClassId = async (req, res) => {
    try {
        const decodedToken = req.decodedToken;
        const student = await StudentRepository.findStudentByAccountId(decodedToken.account);
        const students = await StudentRepository.getAllStudentByClassId(student.classId);
        return res.status(200).json({ data: students });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const findAllStudentByGroupId = async (req, res) => {
    try {
        const classId = req.params.classId;
        const students = await StudentRepository.findAllStudentByGroupId(classId);
        return res.status(200).json({ data: students });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
    
export default {
    getStudentsInSameGroup,
    getTeacherByStudentId,
    findAllStudentByGroupId,
    getAllStudentByClassId
}