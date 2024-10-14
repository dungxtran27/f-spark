import mongoose, { Schema } from "mongoose";

const TeacherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    salutation: {
      type: String,
      required: true,
    },
    assignedClasses: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Class', 
          required: true,
        },
        classCode: {
          type: String,
          required: true,
        },
        backgroundImage: {
          type: String,
          required: false, 
        },
      },
    ],
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account', 
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: 'Teachers' }
);

const Teacher = mongoose.model('Teacher', TeacherSchema);
export default Teacher;
