import mongoose, { Schema } from "mongoose";

const SubmissionSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student', 
      required: true,
    },
    attachment: {
      type: String,
      required: true,
    },
    grade: [
      {
        criteriaName: {
          type: String,
          required: true,
        },
        weight: {
          type: Number,
          required: true,
          min: 0,
          max: 100, 
        },
        grade: {
          type: Number,
          required: true, 
        },
      },
    ],
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group', 
      required: true,
    },
    classworkId: {
      type: Schema.Types.ObjectId,
      ref: 'Classwork',
      required: true,
    },
  },
  { timestamps: true, collection: 'Submissions' }
);

const Submission = mongoose.model('Submission', SubmissionSchema);
export default Submission;
