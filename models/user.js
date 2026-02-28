import mongoose from "mongoose";

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
    hasSeenDialog: { type: Boolean, default: false },
    lastHabitsCopyAskedYear: { type: Number },
    lastHabitsCopyAskedMonth: { type: Number },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
