import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
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

    await dbConnect();

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

    monthDoc.goalTitle = goalTitle;
    monthDoc.goalDescription = goalDescription;
    monthDoc.goalHabitId = goalHabitId
      ? new mongoose.Types.ObjectId(goalHabitId)
      : null;

    if (goalHabitId) {
      await Habit.updateMany(
        {
          userId: userId,
          monthId: monthDoc._id,
        },
        { isGoalHabit: false },
      );

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
    console.log("Error updating monthly goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
