import mongoose, { Schema } from "mongoose";
const ColSchema = new Schema({
  name: {
    type: String,
    default: "Default stage",
  },
  color: {
    type: String,
    default: "#86efac",
  },
});
const RowSchema = new Schema({
  name: {
    type: String,
    default: "Default Customer action",
  },
});
const CellSchema = new Schema({
  row: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  col: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    default: "default content",
  },
});
const CustomerJourneyMapSchema = new Schema({
  cols: {
    type: [ColSchema],
    default: [
      {
        name: "Default name",
        color: "#86efac",
      },
    ],
  },
  rows: {
    type: [RowSchema],
    default: [{ name: "Default Customer action" }],
  },
  cells: {
    type: [CellSchema],
    default: [],
  },
});
const CanvasCellsSchema = new Schema({
  color: {
    type: String,
    default: "#fb7185",
  },
  name: {
    type: String,
    default: "default name",
  },
  content: {
    type: String,
    default: "default content",
  },
});
const GroupSchema = new Schema(
  {
    GroupName: {
      type: String,
      required: true,
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    GroupDescription: {
      type: String,
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    customerJourneyMap: {
      type: CustomerJourneyMapSchema,
      default: {},
    },
    businessModelCanvas: {
      show: {
        type: Boolean,
        default: true,
      },
      sections: {
        type: [CanvasCellsSchema],
        default: [
          {
            color: "#93c5fd",
            name: "Key Partner",
            content: "",
          },
          {
            color: "#93c5fd",
            name: "Key Activities",
            content: "",
          },
          {
            color: "#fca5a5",
            name: "Value Proposition",
            content: "",
          },
          {
            color: "#93c5fd",
            name: "Key Resource",
            content: "",
          },
          {
            color: "#fcd34d",
            name: "Customer Relationships",
            content: "",
          },
          {
            color: "#fcd34d",
            name: "Customer Segments",
            content: "",
          },
          {
            color: "#fcd34d",
            name: "Channels",
            content: "",
          },
          {
            color: "#93c5fd",
            name: "Cost",
            content: "",
          },
          {
            color: "#86efac",
            name: "Revenue Streams",
            content: "",
          },
        ],
      },
    },
    customerPersonas: [
      {
        detail: {
          age: { type: Number, default: null },
          name: { type: String, default: null },
          jobTitle: { type: String, default: null },
          relationshipStatus: {
            type: String,
            enum: ['Độc thân', 'Đã kết hôn', 'Đã ly hôn', 'Góa phụ'],
            default: "Độc thân",
          },
          address: { type: String, default: null },
          income: { type: Number, default: null },
          image: { type: String, default: null },
        },
        bio: { type: String, default: null },
        needs: [{ type: String, default: null }],
      }
    ],
    isSponsorship: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
  { timestamps: true, collection: "Groups" }
);

const Group = mongoose.model("Group", GroupSchema);
export default Group;
