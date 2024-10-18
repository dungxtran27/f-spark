import mongoose, { Schema } from "mongoose";

const TagMenjorSchema = new Schema(
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
  { timestamps: true, collection: 'TagMajors' }
);

const TagMajor = mongoose.model('TagMajor', TagMenjorSchema);
export default TagMajor;
