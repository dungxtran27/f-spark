import FundEstimation from "../model/FundEstimation.js";

const create = async (data) => {
  try {
    const result = await FundEstimation.create(data);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateRequest = async (requestIds, status, note) => {
  try {
    const result = await FundEstimation.updateMany(
      { _id: { $in: requestIds } },
      {
        $set: {
          status: status,
          note: note,
        },
      }
    );
    return result;
  } catch (error) {}
};
const findTermsRequest = async (startDate, endDate, status) => {
  try {
    const result = await FundEstimation.find({
      createdAt: {
        $gt: startDate,
        $lt: endDate,
      },
      status: status,
    }).populate({
      path: "group",
      select: "GroupName _id transactions",
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const findGroupRequest = async (groupId) => {
  try {
    const result = await FundEstimation.find({
      group: groupId,
    }).sort({
      createdAt: -1,
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  create,
  findTermsRequest,
  findGroupRequest,
  updateRequest,
};
