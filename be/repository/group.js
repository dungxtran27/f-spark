import mongoose from "mongoose";
import Group from "../model/Group.js";
import Student from "../model/Student.js";
import student from "./student.js";

const createJourneyRow = async ({ groupId, name }) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          "customerJourneyMap.rows": {
            name: name,
          },
        },
      },
      {
        new: true,
      }
    );
    const newRow =
      updatedGroup.customerJourneyMap.rows[
      updatedGroup.customerJourneyMap.rows.length - 1
      ];
    return newRow;
  } catch (error) {
    return new Error(error.message);
  }
};
const createJourneyCol = async ({ groupId, name }) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          "customerJourneyMap.cols": {
            name: name,
          },
        },
      },
      {
        new: true,
      }
    );
    const newCol =
      updatedGroup.customerJourneyMap.cols[
      updatedGroup.customerJourneyMap.cols.length - 1
      ];
    return newCol;
  } catch (error) {
    return new Error(error.message);
  }
};
const createCellsOnUpdate = async ({ newCells, groupId }) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          "customerJourneyMap.cells": {
            $each: newCells,
          },
        },
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};

const findGroupById = async ({ groupId }) => {
  try {
    const existingGroup = await Group.findById(groupId);
    return existingGroup;
  } catch (error) {
    return new Error(error.message);
  }
};
const deleteRow = async ({ rowId, groupId }) => {
  try {
    // const convertedRowId = new mongoose.Types.ObjectId(rowId);

    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        "customerJourneyMap.rows._id": rowId,
      },
      {
        $pull: {
          "customerJourneyMap.rows": { _id: rowId },
          "customerJourneyMap.cells": { row: rowId },
        },
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};
const deleteCol = async ({ colId, groupId }) => {
  try {
    // const convertedRowId = new mongoose.Types.ObjectId(rowId);

    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
      },
      {
        $pull: {
          "customerJourneyMap.cols": { _id: colId },
          "customerJourneyMap.cells": { col: colId },
        },
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};
const updateCellContent = async ({ cellId, content, groupId }) => {
  try {
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        "customerJourneyMap.cells._id": cellId,
      },
      {
        $set: {
          "customerJourneyMap.cells.$.content": content, // Update the content of the matched cell
        },
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};
const updateColumn = async ({ colId, name, color, groupId }) => {
  try {
    const updates = {};
    if (name) {
      updates["customerJourneyMap.cols.$.name"] = name;
    }
    if (color) {
      updates["customerJourneyMap.cols.$.color"] = color;
    }
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        "customerJourneyMap.cols._id": colId,
      },
      {
        $set: updates,
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};
const updateRow = async ({ rowId, name, groupId }) => {
  try {
    const updates = {};
    if (name) {
      updates["customerJourneyMap.cols.$.name"] = name;
    }
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        "customerJourneyMap.rows._id": rowId,
      },
      {
        $set: {
          "customerJourneyMap.rows.$.name": name,
        },
      },
      {
        new: true,
      }
    );
    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};
const updateCanvasCell = async ({ name, color, content, groupId }) => {
  try {
    const updates = {};
    if (content) {
      updates["businessModelCanvas.sections.$.content"] = content;
    }
    if (color) {
      updates["businessModelCanvas.sections.$.color"] = color;
    }
    const updatedGroup = await Group.findOneAndUpdate(
      {
        _id: groupId,
        "businessModelCanvas.sections.name": name,
      },
      {
        $set: updates,
      },
      {
        new: true,
      }
    );

    return updatedGroup;
  } catch (error) {
    return new Error(error);
  }
};

const addCustomerPersona = async ({ newPersona, groupId }) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          customerPersonas: newPersona,
        },
      },
      { new: true }
    );
    return updatedGroup;
  } catch (error) {
    throw new Error(error);
  }
};

const updateCustomerPersona = async ({ groupId, personaId, updatedPersona }) => {
  try {
    const updateFields = {};
    if (updatedPersona.detail) {
      for (const [key, value] of Object.entries(updatedPersona.detail)) {
        updateFields[`customerPersonas.$.detail.${key}`] = value;
      }
    }
    if (updatedPersona.bio) {
      updateFields["customerPersonas.$.bio"] = updatedPersona.bio;
    }
    if (updatedPersona.needs) {
      updateFields["customerPersonas.$.needs"] = updatedPersona.needs;
    }

    const updatedGroup = await Group.findOneAndUpdate(
      { _id: groupId, "customerPersonas._id": personaId },
      {
        $set: updateFields,
      },
      { new: true }
    );

    return updatedGroup;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCustomerPersona = async ({ groupId, personaId }) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        $pull: {
          customerPersonas: { _id: personaId },
        },
      },
      { new: true }
    );
    return updatedGroup;
  } catch (error) {
    throw new Error(error);
  }
};

const findAllGroupsOfClass = async (classId) => {
  try {
    const data = await Group.find({
      class: classId
    }).select('GroupName GroupDescription isSponsorship mentor teamMembers tag leader groupImage').populate({
      path: 'teamMembers',
      select: '_id name gen major studentId account',
      populate: {
        path: 'account',
        select: 'profilePicture'
      }
    }).populate({
      path: 'tag',
      select: 'name '
    }).populate({
      path: 'mentor',
      select: 'name profilePicture'
    })
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

const addStundentInGroup = async (groupId, studentId) => {
  try {
    const group = await Group.findOne({
      _id: groupId,
      teamMembers: studentId
    });

    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found")
    }

    if (group) {
      throw new Error("Student already exists in the group")
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $push: { teamMembers: studentId } },
      { new: true }
    );

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { group: groupId },
      { new: true }
    );

    return {
      message: "Student add successfully",
      group: updatedGroup
    };

  } catch (error) {
    throw new Error(error.message);
  }
}

const assignLeader = async (groupId, studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found")
    }

    const group = await Group.findOne({
      _id: groupId,
      teamMembers: studentId
    });

    if (!group) {
      throw new Error("Student is not exists in the group")
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $set: { leader: studentId } },
      { new: true }
    );
    return {
      message: "Student assign successfully",
      group: updatedGroup
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export default {
  createCellsOnUpdate,
  createJourneyRow,
  findGroupById,
  createJourneyCol,
  deleteRow,
  deleteCol,
  updateCellContent,
  updateColumn,
  updateRow,
  updateCanvasCell,
  addCustomerPersona,
  updateCustomerPersona,
  deleteCustomerPersona,
  findAllGroupsOfClass,
  addStundentInGroup,
  findAllStudentByGroupId,
  addStundentInGroup,
  assignLeader
};
