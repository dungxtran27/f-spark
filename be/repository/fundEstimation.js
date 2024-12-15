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
  } catch (error) {
    throw new Error(error.message);
  }
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
    })
      .populate({
        path: "group",
        select: "GroupName _id transactions",
      })
      .sort({
        createdAt: -1,
      });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateReturnStatus = async (requestId, returnStatus) => {
  try {
    const result = await FundEstimation.findByIdAndUpdate(
      requestId,
      {
        $set: {
          returnStatus: returnStatus,
        },
      },
      { new: true }
    ).populate({
      path: "group",
      select: "GroupName _id transactions",
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateReturnStatuswithEvidence = async (
  requestId,
  returnStatus,
  evidence,
  phase
) => {
  try {
    const eviData = { type: phase, image: evidence };
    const document = await FundEstimation.findById(requestId);
    if (!document) {
      throw new Error("Document not found");
    }

    const evidenceIndex = document.evidences.findIndex(
      (evi) => evi.type === phase
    );
    if (evidenceIndex !== -1) {
      document.evidences[evidenceIndex] = eviData;
    } else {
      document.evidences.push(eviData);
    }
    const result = await FundEstimation.findByIdAndUpdate(
      requestId,
      {
        $set: {
          returnStatus: returnStatus,
          evidences: document.evidences,
        },
      },
      { new: true }
    ).populate({
      path: "group",
      select: "GroupName _id transactions",
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const accountantUpdateRequest = async (requestId, status, evidence, phase) => {
  try {
    const eviData = { type: phase, image: evidence };
    const result = await FundEstimation.findByIdAndUpdate(requestId, {
      $set: {
        status: status,
        evidences: eviData,
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateEvidenceStatus = async ({ requestId, status, evidenceImage }) => {
  try {
    const result = await FundEstimation.findOneAndUpdate(
      { _id: requestId, "evidences.image": evidenceImage },
      { $set: { "evidences.$.status": status } },
      { new: true }
    );
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
  updateReturnStatus,
  accountantUpdateRequest,
  updateReturnStatuswithEvidence,
  updateEvidenceStatus,
};
