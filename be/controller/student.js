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


const getAllStudentUnGroupByClassId = async (req, res) => {
    try {
        const { classId } = req.params;
        if (!classId) {
            return res.status(400).json({ message: "Class ID is required" });
        }
        const students = await StudentRepository.getAllStudentUngroupByClassId(classId);
        return res.status(200).json({ data: students });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllAccStudent = async (req, res) => {
    try {
        const { page, limit, searchText, classId, status } = req.body;
        const students = await StudentRepository.getAllAccStudent(page, limit, searchText, classId, status);
        return res.status(200).json({ data: students });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllStudentsNoClass = async (req, res) => {
    try {
        const filters = req.body;
        const {
            students,
            totalStudent,
            StudentNotHaveClass,
            countStudentNotHaveClass,
            uniqueMajors
        } = await StudentRepository.getAllStudentsNoClass(filters);
        return res.status(200).json({
            data: {
                students,
                totalStudent,
                StudentNotHaveClass,
                countStudentNotHaveClass,
                uniqueMajors
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
            return res.status(400).json({ message: "Student IDs must be provided as an array." });
        }
        if (!classId) {
            return res.status(400).json({ message: "Class ID must be provided." });
        }
        const updatedStudents = await StudentRepository.addManyStudentNoClassToClass(studentIds, classId);
        return res.status(200).json({
            message: `${updatedStudents.length} student(s) have been successfully added to the class.`,
            data: updatedStudents,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export default {
    getStudentsInSameGroup,
    getTeacherByStudentId,
    getAllStudentByClassId,
    getAllStudentUnGroupByClassId,
    getAllStudentsNoClass,
    addManyStudentNoClassToClass,
    getAllAccStudent
}