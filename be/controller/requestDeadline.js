import { RequestDeadlineRepository, StudentRepository } from "../repository/index.js";

const createRequestDeadline = async (req, res) => {
    try {
        const {ClassworkId, ClassworkName, Reason, dueDate, newDate} = req.body;
        const studentId = req.decodedToken.account;
        const student = await StudentRepository.findStudentByAccountId(studentId)
        const teacherId = student.classId.teacher
        
        const GroupId = student.group._id
        const GroupName = student.group.GroupName
        const data = await RequestDeadlineRepository.createRequestDeadline({
            ClassworkId, ClassworkName, GroupId, GroupName, Reason, dueDate, newDate, teacherId
        })
        return res.status(200).json({ data: data, message: `Request created` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export default {
    createRequestDeadline,
};
