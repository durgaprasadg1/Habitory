import crypto from "crypto";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import mongoose from "mongoose";
import User from "@/models/user";
import { getPlanConfig, PAID_PLAN_KEYS } from "@/lib/plan";
import { sendSubscriptionActivatedEmail } from "@/services/mailServices";
import { invalidateUserCache } from "@/lib/redis";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planKey,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification data" },
        { status: 400 },
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const paidPlanKey = String(
      order?.notes?.planKey || planKey || "",
    ).toLowerCase();

    if (!PAID_PLAN_KEYS.includes(paidPlanKey)) {
      return NextResponse.json(
        { success: false, error: "Invalid paid plan" },
        { status: 400 },
      );
    }

    const plan = getPlanConfig(paidPlanKey);
    if (Number(order.amount) !== Number(plan.price) * 100) {
      return NextResponse.json(
        { success: false, error: "Payment amount mismatch" },
        { status: 400 },
      );
    }

    await dbConnect();

    const session = await mongoose.startSession();
    let savedUser = null;
    try {
      await session.withTransaction(async () => {
        const user = await User.findOne({ clerkId: userId }).session(session);
        if (!user) {
          throw new Error("User not found");
        }

        const now = new Date();
        const planEndDate = new Date(
          now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
        );

        user.plan = paidPlanKey;
        user.planStatus = "active";
        user.planStartDate = now;
        user.planEndDate = planEndDate;
        user.razorpayLastPaymentId = razorpay_payment_id;
        user.razorpayLastOrderId = razorpay_order_id;
        user.aiTipAlerts = {
          cyclePlanEndDate: planEndDate,
          lowRequestsOneSent: false,
          expiry5DaysSent: false,
          expiry1DaySent: false,
        };

        user.paymentHistory = user.paymentHistory || [];
        user.paymentHistory.push({
          amount: plan.price,
          currency: order.currency || "INR",
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          createdAt: now,
        });

        savedUser = await user.save({ session });
      });
    } finally {
      session.endSession();
    }

    // Send activation email after transaction commit
    await invalidateUserCache(userId);

    await sendSubscriptionActivatedEmail(
      savedUser.email,
      savedUser.name,
      plan.name,
      savedUser.planEndDate,
    );

    return NextResponse.json({
      success: true,
      plan: paidPlanKey,
      planEndDate: savedUser?.planEndDate || null,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
