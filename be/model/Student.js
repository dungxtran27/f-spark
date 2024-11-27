import mongoose, { model, Schema } from "mongoose";
import Account from "./Account.js";
const StudentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    gen: {
      type: Number,
      required: true,
    },
    major: {
      type: String,
      enum: ["SE", "HS", "GD", "IB"],
      required: true
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      default: null
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    term: {
      type: Schema.Types.ObjectId,
      ref: 'Term'
    },
    email: {
      type: String,
      required: true
    }
  },
  { timestamps: true, collection: 'Students' }
);

const Student = model('Student', StudentSchema);
export default Student;
