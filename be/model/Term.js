import mongoose, { Schema } from "mongoose";
import { DEADLINE_TYPES } from "../utils/const.js";
import Outcome from "./Outcome.js";
const { DIVIDING_CLASSES, MEMBERS_TRANSFER, OUTCOME, SPONSOR_SHIP, START_TERM, TEACHER_LOCK_GROUP } =
  DEADLINE_TYPES;
const DeadlineSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  priorDeadline: {
    type: Schema.Types.ObjectId,
  },
  type: {
    type: String,
    required: true,
    enum: [MEMBERS_TRANSFER, DIVIDING_CLASSES, OUTCOME, SPONSOR_SHIP, START_TERM, TEACHER_LOCK_GROUP],
  },
  outcome:{
    type: Schema.Types.ObjectId,
    ref: "Outcome"
  }
});
const TermSchema = new Schema(
  {
    termCode: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    timeLine: {
      type: [DeadlineSchema],
      required: true,
    },
  },
  { timestamps: true, collection: "Term" }
);
const Term = mongoose.model("Term", TermSchema);
export default Term;
