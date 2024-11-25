import mongoose from "mongoose";
import RequestDeadline from "../model/RequestDeadline.js";

const createRequestDeadline = async ({ClassworkId, ClassworkName, GroupId, GroupName, Reason, dueDate, newDate, teacherId}) => {
  try {        
    const result = await RequestDeadline.create({
        ClassworkId: ClassworkId,
        ClassworkName: ClassworkName,
        GroupId: GroupId,
        GroupName: GroupName,
        Reason: Reason,
        dueDate: dueDate,
        newDate: newDate,
        TeacherId: teacherId
    })
    
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
    createRequestDeadline
};
