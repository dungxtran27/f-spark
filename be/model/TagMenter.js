import mongoose, { Schema } from "mongoose";

const TagMentorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, collection: 'TagMentors' }
);

const TagMentor = mongoose.model('TagMentor', TagMentorSchema);
export default TagMentor;
