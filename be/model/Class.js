import mongoose, { Schema } from "mongoose";

const ClassSchema = new Schema(
  {
    classCode: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
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
    pin: {
      type: Schema.Types.ObjectId,
      ref: "Classwork",
      require: false
    }
  },
  { timestamps: true, collection: 'Classes' }
);

const Class = mongoose.model('Class', ClassSchema);
export default Class;
