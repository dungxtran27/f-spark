import mongoose, { Schema } from "mongoose";
const MentorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: false,
    },
    assignedClasses: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Class",
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
    assignedGroup: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: false,
      },
    ],
    tag: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "TagMajor",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    profilePicture: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: "Mentors" }
);

const Mentor = mongoose.model('Mentor', MentorSchema);
export default Mentor;
