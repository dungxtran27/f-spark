import mongoose, { Schema } from "mongoose";

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
    gradingCriteria: {
      type: [String],
      default: [],
    },
  },
  {
    collection: "Outcome",
  }
);
const Outcome = mongoose.model("Outcome", OutcomeSchema);
export default Outcome;
