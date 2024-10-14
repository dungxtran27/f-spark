import mongoose, { Schema } from "mongoose";

const TimeBlockSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group', 
      required: true,
    },
  },
  { timestamps: true, collection: 'TimeBlocks' }
);

const TimeBlock = mongoose.model('TimeBlock', TimeBlockSchema);
export default TimeBlock;
