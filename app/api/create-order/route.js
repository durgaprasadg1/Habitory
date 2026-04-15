import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPlanConfig, PAID_PLAN_KEYS } from "@/lib/plan";

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
    const planKey = body.planKey;
    const normalizedPlanKey = String(planKey || "").toLowerCase();

    if (!PAID_PLAN_KEYS.includes(normalizedPlanKey)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = getPlanConfig(normalizedPlanKey);

    let amountToUse = plan.price * 100;
    

    const order = await razorpay.orders.create({
      amount: amountToUse,
      currency: "INR",
      notes: {
        planKey: normalizedPlanKey,
        clerkId: userId,
      },
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      planKey: normalizedPlanKey,
      planName: plan.name,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
