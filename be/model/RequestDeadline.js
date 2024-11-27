import mongoose, { Schema, SchemaTypes } from "mongoose";

const RequestDeadlineSchema = new Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: false,
    },
    classworkId: {
      type: Schema.Types.ObjectId,
      ref: 'Classwork',
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: false,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    newDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true, collection: 'RequestDeadline' }
);

const RequestDeadline = mongoose.model('RequestDeadline', RequestDeadlineSchema);
export default RequestDeadline;
