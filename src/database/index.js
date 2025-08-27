import mongoose from "mongoose";


let isConnected = false; // global flag to avoid reconnects
const connectToDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ecommerce", // optional, if you want to lock to specific DB
    });
    isConnected = true;
    console.log("✅ MongoDB connected in Next.js");
  } catch (err) {
    console.error("❌ MongoDB connection error in Next.js:", err.message);
  }
};

export default connectToDB;