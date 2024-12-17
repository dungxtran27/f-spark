import mongoose from "mongoose";
import RequestDeadline from "../model/RequestDeadline.js";
import { REQUEST_DEADLINE_STATUS } from "../utils/const.js";
const createRequestDeadline = async ({ classworkId, groupId, reason, dueDate, newDate, teacherId, classId }) => {
  try {
    const result = await RequestDeadline.create({
      classworkId: classworkId,
      groupId: groupId,
      reason: reason,
      dueDate: dueDate,
      newDate: newDate,
      teacherId: teacherId,
      classId: classId
    })

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRequestDeadlineByTeacher = async ({ teacherId, classId, status, page }) => {
  try {
    const currentDate = new Date();
    const query = {
      teacherId: teacherId,
      classId: classId
    };
    if (status) {
      if (status === REQUEST_DEADLINE_STATUS.DEFAULT_STATUS) {
        query.status = REQUEST_DEADLINE_STATUS.DEFAULT_STATUS;
        query.newDate = { $gt: currentDate }
      } else {
        query.status = { $ne: REQUEST_DEADLINE_STATUS.DEFAULT_STATUS };
      }
    }
    const limit = 10;
    const skip = (page - 1) * limit;
    const requestDeadline = await RequestDeadline.find(query).populate({
      path: "groupId",
      select: "_id GroupName",
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "classworkId",
        select: "_id name",
      })
    const totalItems = await RequestDeadline.countDocuments(query);
    requestDeadline.totalItems = totalItems;
    return requestDeadline;
  } catch (error) {
    throw new Error(error.message);
  }
}

const updateStatusRequestDeadline = async ({ requestDeadlineId, status }) => {
  try {
    const updatedStatus = await RequestDeadline.findByIdAndUpdate(
      requestDeadlineId,
      { status },
      { new: true }
    )
    if (!updatedStatus) {
      return new Error("Request not found");
    }
    return updatedStatus;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getRequestDeadlineForDashBoard = async ({ teacherId, classId }) => {
  try {
    const query = {
      teacherId: teacherId,
      classId: classId
    };

    const requestDeadline = await RequestDeadline.find(query)
      .populate({
        path: "groupId",
        select: "_id GroupName",
      })
      .populate({
        path: "classworkId",
        select: "_id title",
      });

    const totalItems = await RequestDeadline.countDocuments(query);
    requestDeadline.totalItems = totalItems;
    return requestDeadline;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createRequestDeadline,
  getRequestDeadlineByTeacher,
  updateStatusRequestDeadline,
  getRequestDeadlineForDashBoard
};
