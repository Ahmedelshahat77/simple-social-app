import mongoose from "mongoose";

export const connectionDB = async () => {
  mongoose.set("strictQuery", false);
  return await mongoose
    .connect("mongodb://127.0.0.1:27017/exam")
    .then((res) => console.log("DB Conection success"))
    .catch((err) => {
      console.log({ massage: "conection failed", error: err });
    });
};
