import mongoose, { Schema } from "mongoose";

const RequestSchema = new Schema(
    {
        typeRequest: {
            type: String,
            enum: ["FPT", "Student"],
            required: true
        },
        createBy: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: false,
        },
        actionType: {
            type: String,
            enum: ["join", "leave"],
            required: true,
        },
        title: {
            type: String,
            required: false
        },
        content: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum: ["pending", "approved", "declined"],
            default: "pending",
        },
        attachmentUrl: {
            type: String,
            required: false,
        },
        upVoteYes: [{
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: false,
        }],
        upVoteNo: [{
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: false,
        }],
        group:{
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: false,
        }
    },
    { timestamps: true, collection: "Requests" }
);

const Request = mongoose.model("Request", RequestSchema);
export default Request;
