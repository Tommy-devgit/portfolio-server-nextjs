import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("Warning: MONGO_URI is not set in environment (.env). Skipping MongoDB connection.");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Atlas connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

export default connectDB;
