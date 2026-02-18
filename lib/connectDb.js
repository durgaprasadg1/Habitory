import mongoose from "mongoose";
import { setServers } from "node:dns/promises"; //bhai inke Bina Kaam nhi Hota 
setServers(["1.1.1.1", "8.8.8.8"]);  // dns set karta hai 
let isConnected = false;

export async function dbConnect() {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    console.log("MongoDB already connected");
    return;
  }

  const uri = process.env.DB || "mongodb://127.0.0.1:27017/habitory";

  if (!uri) {
    throw new Error("MongoDB URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri, {
      dbName: "habitory",
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    isConnected = true;
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB Connected Successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Connection Error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB Disconnected");
      isConnected = false;
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    isConnected = false;
    throw error;
  }
}
