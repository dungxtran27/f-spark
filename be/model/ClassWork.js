import mongoose, { Schema } from "mongoose";

const GradingCriteriaSchema = new Schema({
  description: {
    type: String,
    required: false,
  }
}, { _id: true });

const ClassworkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
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
    startDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['assignment', 'outcome', 'announce'],
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    GradingCriteria: [
      {
        type: GradingCriteriaSchema,
      },
    ],
    UpVote: [{
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: false,
    }]
  },
  { timestamps: true, collection: 'Classworks' }
);

const Classwork = mongoose.model('Classwork', ClassworkSchema);
export default Classwork;
