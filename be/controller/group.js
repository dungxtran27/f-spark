import Student from "../model/Student.js";
import { GroupRepository, StudentRepository } from "../repository/index.js";
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
    const groupId = req.params.groupId;
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
    const { detail, bio, needs } = req.body;
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
}

const findAllStudentByGroupId = async (req, res) => {
  try {
    const classId = req.params.classId;
    const countStudent = await StudentRepository.getAllStudentByClassId(classId);
    const groupStundent = await GroupRepository.findAllStudentByGroupId(classId);
    const unGroupStudents = await StudentRepository.getAllStudentUngroupByClassId(classId);
    const studentData = {
      groupStundent,
      unGroupStudents,
      totalStundent: countStudent.length,
    }
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
}

const assignLeader = async (req, res) => {
  try {
    const { groupId, studentId } = req.body;
    const data = await GroupRepository.assignLeader(groupId, studentId);
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default {
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
  findAllStudentByGroupId,
  addStundentInGroup,
  assignLeader
};
