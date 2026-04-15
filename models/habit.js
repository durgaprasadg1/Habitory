import mongoose from "mongoose";

// Clear cache to prevent type casting issues
if (mongoose.models.Habit) {
  delete mongoose.models.Habit;
}

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    monthId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Month",
      required: true,
    },

    name: { type: String, required: true },
    category: { type: String },

    isGoalHabit: { type: Boolean, default: false },

    isEditable: { type: Boolean, default: true }, // becomes false after day 3
  },
  { timestamps: true },
);

export default mongoose.models.Habit || mongoose.model("Habit", habitSchema);
