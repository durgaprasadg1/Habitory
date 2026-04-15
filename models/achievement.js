import mongoose from "mongoose";

// Clear cache to prevent type casting issues
if (mongoose.models.Achievement) {
  delete mongoose.models.Achievement;
}

const achievementSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, default: "🏆" },
    date: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ["milestone", "streak", "habit", "custom"],
      default: "custom",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Achievement ||
  mongoose.model("Achievement", achievementSchema);
