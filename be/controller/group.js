import group from "../repository/group.js";
import {
  ClassRepository,
  GroupRepository,
  NotificationRepository,
  StudentRepository,
  TermRepository,
} from "../repository/index.js";
import { uploadImage } from "../utils/uploadImage.js";
import mongoose from "mongoose";
import { CLASS_NOTIFICATION_ACTION_TYPE } from "../utils/const.js";
import { io, userSocketMap } from "../index.js";
const createJourneyRow = async (req, res) => {
  try {
    const { rowName } = req.body;
    const existingGroup = await GroupRepository.findGroupById({
      groupId: req.groupId,
    });
    if (!existingGroup) {
      return res.status(401).json({ error: "Group not found" });
    }

    const newRow = await GroupRepository.createJourneyRow({
      groupId: existingGroup._id,
      name: rowName,
    });
    const newCells = existingGroup.customerJourneyMap.cols.map((column) => ({
      row: newRow._id,
      col: column._id,
    }));
    const updatedGroup = await GroupRepository.createCellsOnUpdate({
      newCells,
      groupId: existingGroup._id,
    });
    if (updatedGroup) {
      return res.status(201).json({ data: updatedGroup });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const createJourneyCol = async (req, res) => {
  try {
    const { colName, color } = req.body;
    const existingGroup = await GroupRepository.findGroupById({
      groupId: req.groupId,
    });
    if (!existingGroup) {
      return res.status(401).json({ error: "Group not found" });
    }

    const newCol = await GroupRepository.createJourneyCol({
      groupId: existingGroup._id,
      name: colName,
      color,
    });
    const newCells = existingGroup.customerJourneyMap.rows.map((row) => ({
      row: row._id,
      col: newCol._id,
    }));
    const updatedGroup = await GroupRepository.createCellsOnUpdate({
      newCells,
      groupId: existingGroup._id,
    });
    if (updatedGroup) {
      return res.status(201).json({ data: updatedGroup });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const findGroupById = async (req, res) => {
  try {
    const groupId = req.groupId;
    if (!groupId) {
      return res.status(400).json({ error: "Bad request" });
    }
    const existingGroup = await GroupRepository.findGroupById({ groupId });
    if (!existingGroup) {
      return res.status(400).json({ error: "Group not found!" });
    }
    return res.status(200).json({ data: existingGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteRow = async (req, res) => {
  try {
    const { rowId } = req.query;
    const updatedGroup = await GroupRepository.deleteRow({
      rowId,
      groupId: req.groupId,
    });
    return res.status(200).json({ data: updatedGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteCol = async (req, res) => {
  try {
    const { colId } = req.query;
    const updatedGroup = await GroupRepository.deleteCol({
      colId,
      groupId: req.groupId,
    });
    return res.status(200).json({ data: updatedGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateCellContent = async (req, res) => {
  try {
    const { cellId, content } = req.body;
    const updatedGroup = await GroupRepository.updateCellContent({
      cellId,
      content,
      groupId: req.groupId,
    });
    return res.status(200).json({ data: updatedGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateColumn = async (req, res) => {
  try {
    const { name, colId, color } = req.body;
    if (name.trim().length === 0) {
      return res.status(400).json({ error: "Invalid column name" });
    }
    const updatedGroup = await GroupRepository.updateColumn({
      colId,
      name,
      color,
      groupId: req.groupId,
    });
    return res.status(200).json({ data: updatedGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateRow = async (req, res) => {
  try {
    const { name, rowId } = req.body;
    if (name.trim().length === 0) {
      return res.status(400).json({ error: "Invalid row name" });
    }
    const updatedGroup = await GroupRepository.updateRow({
      rowId,
      name,
      groupId: req.groupId,
    });
    return res.status(200).json({ data: updatedGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateCanvasCell = async (req, res) => {
  try {
    const { name, color, content } = req.body;
    const updatedGroup = await GroupRepository.updateCanvasCell({
      color,
      content,
      name,
      groupId: req.groupId,
    });
    return res.status(200).json({ data: updatedGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addCustomerPersona = async (req, res) => {
  try {
    const { detail, bio, needs } = req.body;
    const newPersona = { detail, bio, needs };
    const updatedGroup = await GroupRepository.addCustomerPersona({
      groupId: req.groupId,
      newPersona,
    });
    return res.status(200).json({ data: updatedGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateCustomerPersona = async (req, res) => {
  try {
    const { personaId } = req.query;
    let { detail, bio, needs } = req.body;
    if (typeof detail === "string") {
      detail = JSON.parse(detail);
    }
    if (typeof needs === "string") {
      try {
        while (typeof needs === "string") {
          needs = JSON.parse(needs);
        }
      } catch (error) {
        return res
          .status(400)
          .json({ error: "Invalid format for needs field" });
      }
    }

    const updatedPersona = { detail, bio, needs };

    const updatedGroup = await GroupRepository.updateCustomerPersona({
      groupId: req.groupId,
      personaId,
      updatedPersona,
    });

    return res.status(200).json({ data: updatedGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteCustomerPersona = async (req, res) => {
  try {
    const { groupId, personaId } = req.query;
    const updatedGroup = await GroupRepository.deleteCustomerPersona({
      groupId,
      personaId,
    });
    return res.status(200).json({ data: updatedGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const findAllStudentByGroup = async (req, res) => {
  try {
    const classId = req.params.classId;
    const [countStudent, groupStudent, unGroupStudents] = await Promise.all([
      StudentRepository.getAllStudentByClassId(classId),
      GroupRepository.findAllGroupsOfClass(classId),
      StudentRepository.getAllStudentUngroupByClassId(classId),
    ]);
    const studentData = {
      groupStudent,
      unGroupStudents,
      totalStudent: countStudent.length,
    };
    return res.status(200).json({ data: studentData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getClassTeacherAndgroupInfo = async (req, res) => {
  try {
    const classId = req.params.classId;
    const [countStudent, groupStudent, unGroupStudents, classInfo] =
      await Promise.all([
        StudentRepository.getAllStudentByClassId(classId),
        GroupRepository.findAllGroupsOfClass(classId),
        StudentRepository.getAllStudentUngroupByClassId(classId),
        ClassRepository.findClassById(classId),
      ]);

    const studentData = {
      teacher: classInfo.teacher,
      groupStudent,
      unGroupStudents,
      totalStudent: countStudent.length,
    };
    return res.status(200).json({ data: studentData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addStundentInGroup = async (req, res) => {
  try {
    const { groupId, studentId } = req.body;
    const data = await GroupRepository.addStundentInGroup(groupId, studentId);
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createGroup = async (req, res) => {
  try {
    const { classId, groupName, groupDescription } = req.body;
    if (!classId || !groupName || !groupDescription) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields" });
    }
    const currTerm = await TermRepository.getActiveTerm();
    const termId = currTerm._id;
    const data = await GroupRepository.createGroup(
      groupName,
      classId,
      groupDescription,
      termId
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const assignLeader = async (req, res) => {
  try {
    const { groupId, studentId } = req.body;
    const data = await GroupRepository.assignLeader(groupId, studentId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteStudentFromGroup = async (req, res) => {
  try {
    const { groupId, studentId } = req.body;
    const data = await GroupRepository.deleteStudentFromGroup(
      groupId,
      studentId
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const ungroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const data = await GroupRepository.ungroup(groupId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const lockOrUnlockGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const data = await GroupRepository.lockOrUnlockGroup(groupId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getAllGroupByClassId = async (req, res) => {
  try {
    const { classId } = req.params;
    const groups = await GroupRepository.getGroupsByClassId(classId);
    const mappedGroups = await Promise.all(
      groups.map(async (g) => {
        const members = await StudentRepository.getStudentsByGroup(g._id);
        const majors = [...new Set(members?.map((m) => m.major))];
        return { ...g, members, majors: majors };
      })
    );
    res.status(200).json({ data: mappedGroups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const editTimelineForManyGroups = async (req, res) => {
  try {
    const { groupIds, type, updateData, editAble } = req.body;
    if (!groupIds || !type || !updateData || editAble === undefined) {
      return res.status(400).json({
        message:
          "Group IDs, timeline type, editAble, and new timeline data are required",
      });
    }
    if (editAble === false) {
      return res
        .status(403)
        .json({ message: "Cannot edit because editAble is set to false" });
    }
    const updatedGroups = await GroupRepository.editTimelineForManyGroups(
      groupIds,
      type,
      updateData,
      editAble
    );
    const formattedData = updatedGroups
      .map((group) => {
        return group.timeline
          .filter((timeline) => timeline.type === type)
          .map((timeline) => ({
            _id: timeline._id,
            title: timeline.title,
            description: timeline.description,
            startDate: timeline.startDate,
            endDate: timeline.endDate,
            editAble: timeline.editAble,
            status: timeline.status,
            updatedAt: timeline.updatedAt,
            type: timeline.type,
          }));
      })
      .flat();
    res.status(200).json({
      message: "Update outcome successfully",
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllGroupsNoClass = async (req, res) => {
  try {
    const { GroupName, tag, page, limit, termCode } = req.body;
    const pageIndex = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const {
      group,
      totalGroup,
      GroupNotHaveClass,
      GroupNotHaveClass1,
      countGroupNotHaveClass,
      totalItems,
      maxPages,
    } = await GroupRepository.getAllGroupsNoClass(
      GroupName,
      tag,
      parseInt(page),
      parseInt(limit),
      termCode
    );
    const mappedNoClassGroups = await Promise.all(
      GroupNotHaveClass1.map(async (g) => {
        const members = await StudentRepository.getStudentsByGroup(g._id);
        const majors = [...new Set(members?.map((m) => m.major))];
        return { ...g._doc, members, majors: majors };
      })
    );
    const isLastPage = pageIndex >= maxPages;
    return res.status(200).json({
      data: {
        group,
        totalGroup,
        GroupNotHaveClass,
        mappedNoClassGroups,
        countGroupNotHaveClass,
        totalItems: totalItems,
        maxPages: maxPages,
        isLastPage: isLastPage,
        pageSize: pageSize,
        pageIndex: pageIndex,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const addGroupToClass = async (req, res) => {
  try {
    const { groupIds, classId } = req.body;
    if (!classId) {
      return res.status(400).json({ message: "Class ID must be provided." });
    }
    if (!Array.isArray(groupIds) || groupIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Group IDs must be provided as an array." });
    }
    const result = await GroupRepository.addGroupAndStudentsToClass(
      groupIds,
      classId
    );
    return res.status(200).json({
      message: `${result.groups.length} group(s)have been successfully added to the class.`,
      data: { groups: result.groups, students: result.students },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getAllGroupsOfTeacherbyClassIds = async (req, res) => {
  try {
    const { tagIds, mentorStatus } = req.body;
    const decodedToken = req.decodedToken;
    const classes = await ClassRepository.getClassesOfTeacher(
      decodedToken?.role?.id
    );
    const classIds = classes.map((c) => c._id);
    const groups = await GroupRepository.findAllGroupsOfTeacherbyClassIds(
      classIds,
      tagIds,
      mentorStatus
    );
    res.status(200).json({ data: groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGroupClassByTermCode = async (req, res) => {
  try {
    const termId = req.params.termId;
    const classes = await ClassRepository.getClassByTermCode(
      new mongoose.Types.ObjectId(termId)
    );
    const groups = await GroupRepository.getGroupByTermCode(
      new mongoose.Types.ObjectId(termId)
    );

    return res.status(200).json({ class: classes, group: groups });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getGroupByClassId = async (req, res) => {
  try {
    const classId = req.params.classId;
    const groups = await GroupRepository.getGroupByClassId(
      new mongoose.Types.ObjectId(classId)
    );
    return res.status(200).json({ data: groups });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getGroupStatistic = async (req, res) => {
  try {
    let { page, limit, groupId, classId, term, status } = req.body;
    if (classId) {
      classId = new mongoose.Types.ObjectId(classId);
    }
    if (groupId) {
      groupId = new mongoose.Types.ObjectId(groupId);
    }
    const groups = await GroupRepository.getGroupStatistic({
      page,
      limit,
      groupId,
      classId,
      term: new mongoose.Types.ObjectId(term),
      status
      }
    );
    const statistic = await GroupRepository.getGroupCountsByTerm(new mongoose.Types.ObjectId(term))
    console.log(statistic);

    return res.status(200).json({ data: groups, statistic: statistic });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGroupsOfTerm = async (req, res) => {
  try {
    const { termId } = req.params;
    const result = await GroupRepository.getGroupsOfTerm(termId);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addTransaction = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const { title, fundUsed, transactionDate, evidence } = req.body;
    const student = await StudentRepository.findById(decodedToken?.role?.id);
    if (!student) {
      return res.status(403).json({ error: "Invalid Student Credential" });
    }
    const result = await GroupRepository.addTransaction(student?.group, {
      title,
      fundUsed,
      transactionDate,
      evidence,
    });
    return res
      .status(201)
      .json({ data: result, message: "Transaction created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const addImageToGroupGallery = async (req, res) => {
  try {
    const files = req.files;
    const decodedToken = req.decodedToken;
    console.log(decodedToken);
    const student = await StudentRepository.findById(decodedToken?.role.id);
    console.log(student);

    // const group= await GroupRepository.findGroupById
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const cloudImageLinks = await Promise.all(
      files.map(async (file) => {
        const cloudImageLink = await uploadImage(file);
        if (!cloudImageLink) {
          throw new Error("Failed to upload image");
        }
        return cloudImageLink;
      })
    );
    const updategallery = await GroupRepository.updateGallery(
      student.group,
      cloudImageLinks
    );

    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getGallery = async (req, res) => {
  try {
    const { groupId } = req.params;
    if (!groupId) {
      return res.status(400).json({ error: "Bad request" });
    }
    const gallery = await GroupRepository.getGallery(groupId);

    return res.status(200).json({ data: gallery });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const deleteImageFromGallery = async (req, res) => {
  try {
    const { groupId, imageLink } = req.body;
    if (!groupId || !imageLink) {
      return res.status(400).json({ error: "Bad request" });
    }
    const gallery = await GroupRepository.deleteImageFromGallery(
      groupId,
      imageLink
    );

    return res.status(200).json({ message: "Delete Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateGroupSponsorStatus = async (req, res) => {
  try {
    const { groupId, statusBoolean } = req.body;
    let status = "";
    let message = "";
    if (statusBoolean) {
      status = "sponsored";
      message = "Accepted successfully";
    } else {
      status = "normal";
      message = "Rejected successfully";
    }
    const members = await GroupRepository.getMemberOfGroupByGroupId(
      new mongoose.Types.ObjectId(groupId)
    );
    const groupUpdate = await GroupRepository.updateGroupSponsorStatus({
      groupId,
      status,
    });
    if (groupUpdate) {
      const notificationData = {
        class: groupUpdate.class,
        receivers: members,
        sender: req.decodedToken.role.id,
        group: groupId,
        senderType: "Head Of Subject",
        type: "Group",
        action: {
          action: `request for funding`,
          target: groupId,
          newVersion: groupUpdate,
          actionType: CLASS_NOTIFICATION_ACTION_TYPE.RESPONSE_REQUEST_SPONSOR,
          //extraUrl: `/class/${groupUpdate.class}`
        },
      };

      await NotificationRepository.createNotification({
        data: notificationData,
      });
      const studentsOfGroup = await StudentRepository.getAllStudentByGroupId(
        new mongoose.Types.ObjectId(groupId)
      );

      studentsOfGroup.forEach((s) => {
        const socketIds = userSocketMap[s?.account?.toString()];
        if (socketIds) {
          io.to(socketIds).emit(
            "newNotification",
            `Your request sponsor has been ${
              statusBoolean ? "accepted" : "rejected"
            }.`
          );
        }
      });
    }

    return res.status(200).json({ data: groupUpdate, message: message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  getGroupsOfTerm,
  createJourneyRow,
  createJourneyCol,
  findGroupById,
  deleteRow,
  deleteCol,
  updateCellContent,
  updateColumn,
  updateRow,
  updateCanvasCell,
  addCustomerPersona,
  updateCustomerPersona,
  deleteCustomerPersona,
  findAllStudentByGroup,
  addStundentInGroup,
  assignLeader,
  getClassTeacherAndgroupInfo,
  createGroup,
  deleteStudentFromGroup,
  ungroup,
  lockOrUnlockGroup,
  getAllGroupByClassId,
  editTimelineForManyGroups,
  getAllGroupsNoClass,
  addGroupToClass,
  getAllGroupsOfTeacherbyClassIds,
  addTransaction,
  addImageToGroupGallery,
  getGallery,
  deleteImageFromGallery,
  getGroupClassByTermCode,
  getGroupByClassId,
  getGroupStatistic,
  updateGroupSponsorStatus,
};
