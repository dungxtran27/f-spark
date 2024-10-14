import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    attachment: {
      type: String, 
      required: false, 
    },
    status: {
      type: String,
      enum: ['pending', 'in progress', 'done'],
      default: 'pending', 
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    classwork: {
      type: Schema.Types.ObjectId,
      ref: 'Classwork', 
      required: true,
    },
    timeblock: {
      type: Schema.Types.ObjectId,
      ref: 'Timeblock', 
      required: true,
    },
  },
  { timestamps: true, collection: 'Tasks' }
);

const Task = mongoose.model('Task', TaskSchema);
export default Task;
