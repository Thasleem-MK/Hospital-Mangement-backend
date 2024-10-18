import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    mongoose
      .connect(process.env.MongoDB_String as string)
      .then(() => console.log("Connected to Database"));
  } catch (error) {}
};
export default connectToDb;
