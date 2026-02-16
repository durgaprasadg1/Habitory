const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  monthId: { type: mongoose.Schema.Types.ObjectId, ref: "Month", required: true },

  name: { type: String, required: true },
  category: { type: String },

  isGoalHabit: { type: Boolean, default: false },

  isEditable: { type: Boolean, default: true }, // becomes false after day 3

}, { timestamps: true });

export default mongoose.models.Habit || mongoose.model("Habit", habitSchema);
