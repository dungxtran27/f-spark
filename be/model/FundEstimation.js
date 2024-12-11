import mongoose, { Schema } from "mongoose";
const FundingItemSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
  },
  { _id: false }
);
const BankingInfoSchema = new Schema(
  {
    accountName: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
    },
  },
  { _id: false }
);
const FundEstimationSchema = new Schema(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined", "received"],
      default: "pending",
    },
    returnStatus: {
      type: String,
      enum: ["pending", "processing", "processed"],
      default: "pending",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    items: {
      type: [FundingItemSchema],
      default: [],
    },
    bankingInfo: {
      type: BankingInfoSchema,
      required: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);
const FundEstimation = mongoose.model("FundEstimation", FundEstimationSchema);
export default FundEstimation;
