import mongoose, { Schema } from "mongoose";

const GroupSchema = new Schema(
  {
    GroupName: {
      type: String,
      required: true,
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'Mentor', 
      required: true,
    },
    GroupDescription: {
      type: String,
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class', 
      required: true,
    },
    BusinessModalCanvas: {
      show: {
        type: Boolean,
        default: true,
      },
      section: {
        name: { type: String, required: true },
        color: { type: String, required: true },
        content: { type: String, required: true },
        icon: { type: String, required: false }, 
      },
    },
    CustomerPersonas: [
      {
        avatar: { type: String, required: true },
        name: { type: String, required: true },
        bio: { type: String, required: true },
        needs: [{ type: String, required: true }], 
      },
    ],
  },
  { timestamps: true, collection: 'Groups' }
);

const Group = mongoose.model('Group', GroupSchema);
export default Group;
