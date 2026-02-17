import mongoose from "mongoose";

// Clear cache to prevent type casting issues
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    profileImage: { type: String },
    password: { type: String },
    habits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Habit" }],
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
