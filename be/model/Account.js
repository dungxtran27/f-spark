import mongoose, { Schema } from "mongoose";

const AccountSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    active: {
      type: Schema.Types.Boolean,
      default: true,
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "Accounts" }
);

const Account = mongoose.model("Account", AccountSchema);
export default Account;
