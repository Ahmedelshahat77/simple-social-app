// import { boolean } from "joi";
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["female", "male"],
    },
    profile_pic: String,
    publicId: String,
    confirmed: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);

export default userModel;
