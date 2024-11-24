import mongoose, { Schema } from "mongoose";

const GradingCriteriaSchema = new Schema({
  description: {
    type: String,
    required: false,
  }
}, { _id: true });
const OutcomeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    // gradingCriteria: {
    //   type: [String],
    //   default: [],
    // },
    GradingCriteria: [
      {
        type: GradingCriteriaSchema,
      },
    ],
  },
  {
    collection: "Outcome",
  }
);
const Outcome = mongoose.model("Outcome", OutcomeSchema);
export default Outcome;
