import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/connectDb";
import Month from "@/models/month";
import Habit from "@/models/habit";
import mongoose from "mongoose";

export async function PUT(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { year, month, goalTitle, goalDescription, goalHabitId } = body;

    if (!goalTitle) {
      return NextResponse.json(
        { error: "Goal title is required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Find or create month document
    let monthDoc = await Month.findOne({
      userId: userId,
      year,
      month,
    });

    if (!monthDoc) {
      monthDoc = await Month.create({
        userId: userId,
        year,
        month,
      });
    }

    // Update goal fields
    monthDoc.goalTitle = goalTitle;
    monthDoc.goalDescription = goalDescription;
    monthDoc.goalHabitId = goalHabitId
      ? new mongoose.Types.ObjectId(goalHabitId)
      : null;

    // If a habit is linked, update its isGoalHabit flag
    if (goalHabitId) {
      // First, remove isGoalHabit from all habits in this month
      await Habit.updateMany(
        {
          userId: userId,
          monthId: monthDoc._id,
        },
        { isGoalHabit: false },
      );

      // Then set the selected habit as goal habit
      await Habit.findByIdAndUpdate(goalHabitId, { isGoalHabit: true });
    }

    await monthDoc.save();

    return NextResponse.json({
      success: true,
      monthlyGoal: {
        title: monthDoc.goalTitle,
        description: monthDoc.goalDescription,
        habitId: monthDoc.goalHabitId,
      },
    });
  } catch (error) {
    console.error("Error updating monthly goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
