import mongoose, { Schema } from "mongoose";
import Student from "./Student.js";
import TimeBlock from "./TimeBlock.js";
const TaskSchema = new Schema(
  {
    taskType: {
      type: String,
      required: true,
      enum: ["Class work", "Group task"],
    },
    taskName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    attachment: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Done", "Need Review"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["High", "Normal", "Low"],
      default: "Normal",
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    classwork: {
      type: Schema.Types.ObjectId,
      ref: "Classwork",
    },
    timeblock: {
      type: Schema.Types.ObjectId,
      ref: "TimeBlock",
    },
    dueDate: {
      type: Date,
    },
    parentTask: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    childTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true, collection: "Tasks" }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
