import mongoose, { Schema } from "mongoose";

const ClassworkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
      required: false, 
    },
    dueDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['assignment', 'outcome'],
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    GradingCriteria: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: false, 
        },
        weight: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
      },
    ],
  },
  { timestamps: true, collection: 'Classworks' }
);

const Classwork = mongoose.model('Classwork', ClassworkSchema);
export default Classwork;
