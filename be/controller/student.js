import { StudentRepository } from "../repository/index.js"

const findStudentByGroupId = async (req, res) => {
    try {
        const account = req.decodedToken.account;

        const student = await StudentRepository.findStudentByAccountId(
            account
        );
        const classId = student.classId.toString();
        const students = await StudentRepository.findStudentByGroupId(
            classId
        );
        return res.status(200).json({ data: students });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getTeacherByStudentId = async (req, res) => {
    try {
        const decodedToken = req.decodedToken;
        console.log(decodedToken);
        
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
      return res.status(200).json({data:students});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

export default {
    getStudentsInSameGroup,
    getTeacherByStudentId,
    findStudentByGroupId
}