const habitLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  habitId: { type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true },

  date: { type: Date, required: true },

  completed: { type: Boolean, default: false },

}, { timestamps: true });

habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

export default mongoose.models.HabitLog || mongoose.model("HabitLog", habitLogSchema);
