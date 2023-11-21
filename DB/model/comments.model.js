import { model, Schema } from "mongoose";

const commSchema = new Schema(
  {
    commBody: {
      type: String,
      required: true,
    },
    commBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    }
  },
  {
    timestamps: true,
  }
);

const commentModel = model("Comment", commSchema);

export default commentModel;
