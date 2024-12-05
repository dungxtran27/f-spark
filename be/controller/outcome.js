import { OutcomeRepository } from "../repository/index.js";
import mongoose from "mongoose";

const getAllOutcome = async (req, res) => {
    try {
      const result = await OutcomeRepository.getOutcome()
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
const createOutcome = async (req, res) => {
    try {
      const {title, description, gradingCriteria} = req.body
      const result = await OutcomeRepository.createOutcome({title, description, gradingCriteria})
      return res.status(200).json({ data: result, message: 'Created Successful' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

const deleteOutcome = async (req, res) => {
    try {
      const outcomeId = req.params.outcomeId
      const result = await OutcomeRepository.deleteOutcome(new mongoose.Types.ObjectId(outcomeId))
      return res.status(200).json({ data: result, message: 'Delete Successful' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
};
export default {
    getAllOutcome,
    createOutcome,
    deleteOutcome
};
