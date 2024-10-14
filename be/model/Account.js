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
  },
  { timestamps: true, collection: 'Account' }
);

const Account = mongoose.model('Account', AccountSchema);
export default Account;
