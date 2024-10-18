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
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group', 
      // required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class', 
    },
  },
  { timestamps: true, collection: 'Students' }
);

const Student = model('Student', StudentSchema);
export default Student;
