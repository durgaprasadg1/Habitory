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
    plan: {
      type: String,
      enum: ["free", "silver", "gold", "platinum"],
      default: "free",
    },
    planStatus: {
      type: String,
      enum: ["inactive", "active", "cancelled", "expired", "trial"],
      default: "inactive",
    },
    planStartDate: { type: Date },
    planEndDate: { type: Date },

    razorpayCustomerId: { type: String },
    razorpaySubscriptionId: { type: String },
    razorpayLastPaymentId: { type: String },
    razorpayLastOrderId: { type: String },

    paymentHistory: [
      {
        amount: { type: Number },
        currency: { type: String, default: "INR" },
        razorpayPaymentId: { type: String },
        razorpayOrderId: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    aiTipsUsage: [
      {
        year: { type: Number, required: true },
        month: { type: Number, required: true },
        count: { type: Number, default: 0 },
        lastRequestedAt: { type: Date },
      },
    ],

    aiTipAlerts: {
      cyclePlanEndDate: { type: Date },
      lowRequestsOneSent: { type: Boolean, default: false },
      expiry5DaysSent: { type: Boolean, default: false },
      expiry1DaySent: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
