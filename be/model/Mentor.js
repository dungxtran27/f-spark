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
  },
  { timestamps: true, collection: 'Mentors' }
);

const Mentor = mongoose.model('Mentor', MentorSchema);
export default Mentor;
