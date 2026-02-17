import mongoose from "mongoose";

// Clear cache to prevent type casting issues
if (mongoose.models.Month) {
  delete mongoose.models.Month;
}

const monthSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    year: { type: Number, required: true },
    month: { type: Number, required: true }, // 1-12

    goalTitle: { type: String },
    goalDescription: { type: String },

    goalHabitId: { type: mongoose.Schema.Types.ObjectId, ref: "Habit" },

    goalEditedOnce: { type: Boolean, default: false },
    goalLocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

monthSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

export default mongoose.models.Month || mongoose.model("Month", monthSchema);
