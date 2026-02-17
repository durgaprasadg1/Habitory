import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/connectDb";
import HabitLog from "@/models/habitLog";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { habitId, date } = body;

    if (!habitId || !date) {
      return NextResponse.json(
        { error: "Habit ID and date are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const existingLog = await HabitLog.findOne({
      userId: userId,
      habitId: habitId,
      date: targetDate,
    });

    if (existingLog) {
      existingLog.completed = !existingLog.completed;
      await existingLog.save();
      return NextResponse.json(existingLog);
    } else {
      const newLog = await HabitLog.create({
        userId: userId,
        habitId: new mongoose.Types.ObjectId(habitId),
        date: targetDate,
        completed: true,
      });
      return NextResponse.json(newLog, { status: 201 });
    }
  } catch (error) {
    console.error("Error toggling habit log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
