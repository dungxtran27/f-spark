import moment from "moment";
import mongoose from "mongoose";

import {
  FundEstimationRepository,
  StudentRepository,
  TermRepository,
} from "../repository/index.js";
import { DEADLINE_TYPES } from "../utils/const.js";
import { uploadImage } from "../utils/uploadImage.js";

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
const accountantUpdateRequest = async (req, res) => {
  try {
    const { file, status, requestId } = req.body;
    let evidence;
    if (file) {
      evidence = await uploadImage(file);
      if (!evidence) {
        throw new Error("Failed to upload image");
      }
    }

    const result = await FundEstimationRepository.accountantUpdateRequest(
      requestId,
      status,
      evidence,
      "phase1"
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
const getReturn = async (req, res) => {
  try {
    const { termId } = req.params;
    const term = await TermRepository.findById(termId);
    const request = await FundEstimationRepository.findTermsRequest(
      term?.startTime,
      term?.endTime,
      "received"
    );
    const approvedRequest = request?.filter((r) => r?.status === "received");
    return res.status(200).json({ data: approvedRequest });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateReturnStatus = async (req, res) => {
  try {
    let result = {};
    const { returnStatus, requestId } = req.body;
    if (returnStatus == "processed" || returnStatus == "sent") {
      const { evidence } = req.body;

      const evidenceImage = await uploadImage(evidence);
      if (!evidenceImage) {
        throw new Error("Failed to upload image");
      }
      result = await FundEstimationRepository.updateReturnStatuswithEvidence(
        requestId,
        returnStatus,
        evidenceImage,
        "phase2"
      );
    } else if (returnStatus == "processing") {
      result = FundEstimationRepository.updateReturnStatus(
        requestId,
        returnStatus
      );
    }
    return res
      .status(200)
      .json({ message: "Updated Successful", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateEvidenceStatus = async (req, res) => {
  try {
    const { evidenceImage, status, requestId } = req.body;

    const result = await FundEstimationRepository.updateEvidenceStatus({
      requestId,
      status,
      evidenceImage,
    });

    if (status == "approved") {
      await FundEstimationRepository.updateReturnStatus(requestId, "processed");
    }
    return res.status(200).json({ message: "Updated Successful" });
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
  getReturn,
  updateReturnStatus,
  updateEvidenceStatus,
  accountantUpdateRequest,
};
