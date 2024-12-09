import moment from "moment";
import mongoose from "mongoose";

import {
  FundEstimationRepository,
  StudentRepository,
  TermRepository,
} from "../repository/index.js";
import { DEADLINE_TYPES } from "../utils/const.js";

const createRequest = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const { items, accountName, bankCode, accountNumber, branch } = req.body;
    const sender = await StudentRepository.findById(decodedToken?.role?.id);
    if (!sender) {
      return res.status(403).json({ error: "Student not found" });
    }
    if (!sender?.group) {
      return res
        .status(403)
        .json({ error: "You are not in a sponsored group" });
    }
    const activeTerm = await TermRepository.getActiveTerm();
    const requestingSponsorShip = activeTerm?.timeLine?.find(
      (d) => d?.type === DEADLINE_TYPES.FUND_ESTIMATION
    );
    if (
      !(
        moment().isAfter(moment(requestingSponsorShip?.startDate)) &&
        moment().isBefore(moment(requestingSponsorShip?.endDate))
      )
    ) {
      return res.status(400).json({
        error:
          "Time for sponsorship request has either ended or not come yet. Please check the sylabus",
      });
    }
    const data = {
      group: sender?.group,
      sender: sender?._id,
      items: items,
      bankingInfo: {
        accountName,
        bankCode,
        accountNumber,
        branch,
      },
    };
    const result = await FundEstimationRepository.create(data);
    return res.status(201).json({
      data: result,
      message:
        "Requested successfully, please wait while we process your request",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getTermRequest = async (req, res) => {
  try {
    const { termId } = req.params;
    const term = await TermRepository.findById(termId);
    const request = await FundEstimationRepository.findTermsRequest(
      term?.startTime,
      term?.endTime,
      "pending"
    );
    return res.status(200).json({ data: request });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { status, requestIds, note } = req.body;
    const validStatuses = ["pending", "approved", "declined", "received"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status. It must be one of the following: pending, approved, declined, received." });
    }
    if (!Array.isArray(requestIds) || requestIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid requestIds. They must be an array of valid ObjectIds." });
    }
    const result = await FundEstimationRepository.updateRequest(
      requestIds,
      status,
      note
    );
    return res.status(200).json({ message: "Updated Successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getGroupRequest = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const sender = await StudentRepository.findById(decodedToken?.role?.id);
    if (!sender) {
      return res.status(403).json({ error: "Student not found" });
    }
    const result = await FundEstimationRepository.findGroupRequest(
      sender?.group
    );
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getDistribution = async (req, res) => {
  try {
    const { termId } = req.params;
    const term = await TermRepository.findById(termId);
    const request = await FundEstimationRepository.findTermsRequest(
      term?.startTime,
      term?.endTime,
      "approved"
    );
    const approvedRequest = request?.filter((r) => r?.status === "approved");
    return res.status(200).json({ data: approvedRequest });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export default {
  getGroupRequest,
  getTermRequest,
  createRequest,
  updateRequest,
  getDistribution,
};
