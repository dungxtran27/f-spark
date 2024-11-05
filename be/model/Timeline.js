  import mongoose, { Schema } from "mongoose";

  const TimelineSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: false,
      },
      startDate:{
          type: Date,
          required: true
      },
      endDate:{
          type:Date,
          required:true
      },
      classId:[{
        type: Schema.Types.ObjectId,
        ref: "Class",
        require: false
      }],
      editAble:{
        type: Boolean
      }
    },
    { timestamps: true, collection: 'Timelines' }
  );

  const Timeline = mongoose.model('Timeline', TimelineSchema);
  export default Timeline;
