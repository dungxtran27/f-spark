import mongoose, { Schema } from "mongoose";

const GradingCriteriaSchema = new Schema(
  {
    description: {
      type: String,
      required: false,
    },
  },
  { _id: true }
);

const ClassworkSchema = new Schema(
  {
    name: {
      type: String,
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    attachment: {
      type: [String],
      required: false,
    },
    startDate: {
      type: Date,
      required: false,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    type: {
      type: String,
      enum: ["assignment", "outcome", "announcement"],
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    GradingCriteria: [
      {
        type: GradingCriteriaSchema,
      },
    ],
    upVote: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: false,
      },
    ],
    outcome: {
      type: Schema.Types.ObjectId,
      ref: "Outcome",
    },
  },
  { timestamps: true, collection: "Classworks" }
);

const Classwork = mongoose.model("Classwork", ClassworkSchema);
export default Classwork;
