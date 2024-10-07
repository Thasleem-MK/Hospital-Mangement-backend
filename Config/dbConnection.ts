import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    mongoose
      .connect(
        "mongodb+srv://hostahelthcare:bE9WczcmGBErcwp9@cluster0.jj4cq.mongodb.net/Hosta"
      )
      .then(() => console.log("Connected to Database"));
  } catch (error) {}
};
export default connectToDb;