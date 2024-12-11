import mongoose, { Schema, SchemaTypes } from "mongoose";
import Class from "./Class.js";
const ActionSchema = new Schema({
  action: {
    type: String,
    required: true,
  },
  alternateAction: {
    type: String,
  },
  target: {
    type: SchemaTypes.ObjectId,
  },
  actionType: {
    type: String,
  },
  priorVersion: {
    type: SchemaTypes.Mixed,
    default: null,
  },
  newVersion: {
    type: SchemaTypes.Mixed,
    default: null,
  },
  extraUrl: {
    type: String,
  },
});
const NotificationSchema = new Schema(
  {
    receivers: {
      type: [SchemaTypes.ObjectId],
      default: null,
    },
    class: {
      type: SchemaTypes.ObjectId,
      ref: "Class",
      default: null,
    },
    group: {
      type: SchemaTypes.ObjectId,
      default: null,
    },
    sender: {
      type: SchemaTypes.ObjectId,
      refPath: 'senderType',
      default: null,
    },
    senderType: { 
      type: String, 
      enum: ['Student', 'Teacher', 'System','Head Of Subject'],
      required: true 
    },
    type: {
      type: String,
      enum: ["Group", "Class", "System"],
    },
    action: {
      type: ActionSchema,
      required: true,
    },
  },
  { timestamps: true, collection: "Notification" }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
