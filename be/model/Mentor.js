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
    profilePicture: {
      type: String,
      required: false, 
    }
  },
  { timestamps: true, collection: 'Mentors' }
);

const Mentor = mongoose.model('Mentor', MentorSchema);
export default Mentor;
