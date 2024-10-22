import mongoose, { Schema } from "mongoose";
const ClassInfo = new Schema({
  schedule: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
  },
  _id: false,
});
const ClassSchema = new Schema(
  {
    classCode: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    backgroundImage: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    classInfo: {
      type: ClassInfo,
    },
    pin: {
      type: Schema.Types.ObjectId,
      ref: "Classwork",
      require: false
    }
  },
  { timestamps: true, collection: "Classes" }
);

const Class = mongoose.model("Class", ClassSchema);
export default Class;
