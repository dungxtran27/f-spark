import mongoose, { Schema, SchemaTypes } from "mongoose";
const ActionSchema = new Schema({
  action: {
    type: String,
    required: true,
  },
  target: {
    type: SchemaTypes.ObjectId,
  },
  targetType: {
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
    sender: {
      type: [SchemaTypes.ObjectId],
      default: null,
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
