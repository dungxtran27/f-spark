import mongoose, { Schema, SchemaTypes } from "mongoose";

const RequestDeadlineSchema = new Schema(
  {
    TeacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: false,
    },
    ClassworkId: {
      type: Schema.Types.ObjectId,
      ref: 'Classwork',
      required: false,
    },
    ClassworkName: {
      type: String,
      required: false,
    },
    GroupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: false,
    },
    GroupName: {
      type: String,
      required: false,
    },
    Reason: {
      type: String,
      required: false,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    newDate: {
      type: Date,
      required: false,
    } 
  },
  { timestamps: true, collection: 'RequestDeadline' }
);

const RequestDeadline = mongoose.model('RequestDeadline', RequestDeadlineSchema);
export default RequestDeadline;
