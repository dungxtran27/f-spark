import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
    {
        content: {
            type: String,
            required: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
            required: false,
        },
        classWork: {
            type: Schema.Types.ObjectId,
            ref: 'Classwork',
            required: false,
        },
        parent_comment: {
            type: Schema.Types.ObjectId
        },
    },
    { timestamps: true, collection: 'Comments' }
);

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
