import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect("mongodb+srv://saja:SajaKha2001@atlascluster.5lummgr.mongodb.net/finalProject")
    .then(() => {
      console.log("db connection established");
    })
    .catch((error) => {
      console.log(`error to connect db : ${error}`);
    });
};

export default connectDB;
