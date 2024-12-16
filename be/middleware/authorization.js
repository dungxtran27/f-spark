import {
  ClassRepository,
  GroupRepository,
  StudentRepository,
} from "../repository/index.js";
import { ROLE_NAME } from "../utils/const.js";

const checkRole = (roles) => (req, res, next) => {
  try {
    const { role } = req.decodedToken.role;
    if (roles !== role) {
      return res.status(403).json({ error: "Unauthorized !" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const checkGroupAccess = async (req, res, next) => {
  try {
    const { account, role } = req.decodedToken;
    switch (role.role) {
      case ROLE_NAME.student:
        const student = await StudentRepository.findStudentByAccountId(account);
        if (!student) {
          return res.status(403).json({ error: "Unauthorized !" });
        }
        const groupOfStudent = await GroupRepository.findGroupById({
          groupId: student.group,
        });
        if (!groupOfStudent) {
          return res.status(403).json({
            error:
              "Unauthorized ! The student is not assigned to any active group",
          });
        }
        //the group id of the url and the group id of the student account don't match
        if (req.query.groupId !== groupOfStudent._id.toString()) {
          return res.status(403).json({ error: "Unauthorized !" });
        }
        req.groupId = groupOfStudent._id;
        break;
      case ROLE_NAME.teacher:
        break;
      default:
        return res.status(403).json({ error: "Unauthorized !" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const checkTeacherClassAccess = async (req, res, next) => {
  try {
    const { classId } = req.params;
    if (!classId) {
      return res.status(400).json({ error: "Bad request !" });
    }
    const classRes = await ClassRepository.findClassById(classId);

    if (!classRes) {
      return res.status(404).json({ error: "Class not found !" });
    }
    if (classRes.teacher._id.toString() !== req.decodedToken.role.id) {
      return res.status(403).json({ error: "Unauthorized !" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  checkRole,
  checkGroupAccess,
  checkTeacherClassAccess,
};
