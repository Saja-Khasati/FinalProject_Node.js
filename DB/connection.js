import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log("db connection established");
    })
    .catch((error) => {
      console.log(`error to connect db : ${error}`);
    });
};

export default connectDB;
