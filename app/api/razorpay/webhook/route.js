import crypto from "crypto";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/connectDb";
import User from "@/models/user";
import Razorpay from "razorpay";
import { getPlanConfig, PAID_PLAN_KEYS } from "@/lib/plan";
import { sendSubscriptionActivatedEmail } from "@/services/mailServices";
import mongoose from "mongoose";
import { invalidateUserCache } from "@/lib/redis";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      console.error("Missing RAZORPAY_WEBHOOK_SECRET env");
      return NextResponse.json(
        { error: "Webhook misconfigured" },
        { status: 500 },
      );
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== signature) {
      console.warn("Invalid webhook signature", { expected, signature });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      let order;
      try {
        order = await razorpay.orders.fetch(payment.order_id);
      } catch (e) {
        console.error("Failed to fetch order for webhook:", e);
      }

      const planKey = order?.notes?.planKey || null;
      const clerkId = order?.notes?.clerkId || null;

      if (!planKey) {
        console.warn("Webhook: no planKey in order notes", {
          orderId: payment.order_id,
        });
      }

      await dbConnect();

      let user = null;
      if (clerkId) {
        user = await User.findOne({ clerkId });
      }

      if (!user) {
        user = await User.findOne({ razorpayLastOrderId: payment.order_id });
      }

      if (!user) {
        console.warn("Webhook: no matching user for payment", {
          orderId: payment.order_id,
        });
      } else {
        const session = await mongoose.startSession();
        let savedUser = null;
        try {
          await session.withTransaction(async () => {
            const now = new Date();
            if (
              planKey &&
              PAID_PLAN_KEYS.includes(String(planKey).toLowerCase())
            ) {
              const plan = getPlanConfig(String(planKey).toLowerCase());
              const planEndDate = new Date(
                now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
              );

              user.plan = String(planKey).toLowerCase();
              user.planStatus = "active";
              user.planStartDate = now;
              user.planEndDate = planEndDate;
            } else {
              user.planStatus = user.planStatus || "active";
            }

            user.razorpayLastPaymentId = payment.id;
            user.razorpayLastOrderId = payment.order_id;

            user.paymentHistory = user.paymentHistory || [];
            user.paymentHistory.push({
              amount: (payment.amount || payment.authorized_amount || 0) / 100,
              currency: payment.currency || "INR",
              razorpayPaymentId: payment.id,
              razorpayOrderId: payment.order_id,
              createdAt: now,
            });

            savedUser = await user.save({ session });
          });
        } finally {
          session.endSession();
        }

        if (planKey && PAID_PLAN_KEYS.includes(String(planKey).toLowerCase())) {
          try {
            await sendSubscriptionActivatedEmail(
              savedUser.email,
              savedUser.name,
              getPlanConfig(savedUser.plan).name,
              savedUser.planEndDate,
            );
          } catch (e) {
            console.error("Failed to send subscription email from webhook:", e);
          }
        }

        await invalidateUserCache(user.clerkId);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
