import mongoose, { Schema } from "mongoose";
const TimelineSchema = new Schema(
  {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: true,
    },
    editAble: {
      type: Boolean,
    },
    // status: {
    //   type: String,
    //   required: false,
    // },
    type: {
      type: String,
      required: true,
      enum: ["isSponsorship", "lockgroup", "outcome1", "outcome2", "outcome3"],
    },
    classworkId: {
      type: Schema.Types.ObjectId,
      ref: "Classwork",
      required: true,
    },
  },
  { timestamps: true }
);

const customerPersona = new Schema({
  detail: {
    age: { type: Number, default: null },
    name: { type: String, default: null },
    jobTitle: { type: String, default: null },
    relationshipStatus: {
      type: String,
      enum: ["Độc thân", "Đã kết hôn", "Đã ly hôn", "Góa phụ"],
      default: "Độc thân",
    },
    address: { type: String, default: null },
    income: { type: Number, default: null },
    image: { type: String, default: null },
  },
  bio: { type: String, default: null },
  needs: [{ type: String, default: null }],
});

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
const TransactionSchema = new Schema(
  {
    title: {
      type: String,
    },
    fundUsed: {
      type: Number,
    },
    transactionDate: {
      type: Date,
    },
    evidence: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
const GroupSchema = new Schema(
  {
    GroupName: {
      type: String,
      required: true,
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: false,
    },
    GroupDescription: {
      type: String,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
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
    customerPersonas: [customerPersona],
    isSponsorship: {
      type: Boolean,
      default: false,
    },
    teamMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: false,
      },
    ],
    tag: [
      {
        type: Schema.Types.ObjectId,
        ref: "TagMajor",
      },
    ],
    leader: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: false,
    },
    groupImage: {
      type: String,
      required: false,
    },
    lock: {
      type: Boolean,
      required: false,
      default: false,
    },
    oldMark: {
      type: Number,
      required: false,
    },
    term: {
      type: Schema.Types.ObjectId,
      ref: "Term",
      require: true,
    },
    timeline: [TimelineSchema],
    term: {
      type: Schema.Types.ObjectId,
      ref: "Term",
      required: true,
    },
    transactions: {
      type: [TransactionSchema],
      default: [],
    },
  },
  { timestamps: true, collection: "Groups" }
);

const Group = mongoose.model("Group", GroupSchema);
export default Group;
