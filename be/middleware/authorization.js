import { GroupRepository, StudentRepository } from "../repository/index.js";
import { ROLE_NAME } from "../utils/const.js";

const checkRole = (role) => (req, res, next) => {
  try {
    const { roles } = req.decodedToken.role;
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
        //the group id of the url and the group id of the student account don' t match        
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
export default {
  checkRole,
  checkGroupAccess,
};
