import mongoose from "mongoose";
let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "habit-tracker",
    });

    isConnected = true;
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}
