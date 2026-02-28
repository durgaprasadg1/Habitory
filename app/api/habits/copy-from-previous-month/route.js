import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import Habit from "@/models/habit";
import Month from "@/models/month";
import User from "@/models/user";
import { syncUser } from "@/lib/syncUser";

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (clerkUser) {
      await syncUser(clerkUser);
    }

    await dbConnect();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Calculate previous month
    let previousYear = currentYear;
    let previousMonth = currentMonth - 1;
    if (previousMonth < 1) {
      previousMonth = 12;
      previousYear -= 1;
    }

    // Find or create current month document
    let currentMonthDoc = await Month.findOne({
      userId,
      year: currentYear,
      month: currentMonth,
    });

    if (!currentMonthDoc) {
      currentMonthDoc = await Month.create({
        userId,
        year: currentYear,
        month: currentMonth,
      });
    }

    // Find previous month document
    const previousMonthDoc = await Month.findOne({
      userId,
      year: previousYear,
      month: previousMonth,
    });

    if (!previousMonthDoc) {
      return NextResponse.json(
        { error: "No habits found in previous month" },
        { status: 404 },
      );
    }

    // Check if current month already has habits
    const existingHabits = await Habit.find({
      userId,
      monthId: currentMonthDoc._id,
    });

    if (existingHabits.length > 0) {
      return NextResponse.json(
        { error: "Current month already has habits" },
        { status: 400 },
      );
    }

    // Get habits from previous month
    const previousHabits = await Habit.find({
      userId,
      monthId: previousMonthDoc._id,
    });

    if (previousHabits.length === 0) {
      return NextResponse.json(
        { error: "No habits found in previous month" },
        { status: 404 },
      );
    }

    // Copy habits to current month
    const newHabits = previousHabits.map((habit) => ({
      userId,
      monthId: currentMonthDoc._id,
      name: habit.name,
      category: habit.category,
      isGoalHabit: false, // Don't copy goal habit status
    }));

    await Habit.insertMany(newHabits);

    // Mark that user has been asked about copying habits for this month
    await User.findOneAndUpdate(
      { clerkId: userId },
      {
        lastHabitsCopyAskedYear: currentYear,
        lastHabitsCopyAskedMonth: currentMonth,
      },
    );

    return NextResponse.json({
      message: `Successfully copied ${newHabits.length} habits from previous month`,
      copiedCount: newHabits.length,
    });
  } catch (error) {
    console.error("Error copying habits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
