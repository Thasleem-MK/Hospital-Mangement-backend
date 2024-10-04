import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    mongoose.connect("").then(() => console.log("Connected to Database"));
  } catch (error) {}
};
export default connectToDb;