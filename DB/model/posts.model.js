import { model, Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    onlyMe: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalLikes: {
      type: Number,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    }
  },
  {
    timestamps: true,
  }
);

const postModel = model("Post", postSchema);

export default postModel;
