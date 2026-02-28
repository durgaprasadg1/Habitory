import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import User from "@/models/user";
import Month from "@/models/month";
import Habit from "@/models/habit";
import { syncUser } from "@/lib/syncUser";

export async function GET(request) {
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

    // Get user document
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ shouldShow: false });
    }

    // Check if we've already asked the user for this month
    const lastAskedYear = user.lastHabitsCopyAskedYear;
    const lastAskedMonth = user.lastHabitsCopyAskedMonth;

    if (lastAskedYear === currentYear && lastAskedMonth === currentMonth) {
      return NextResponse.json({ shouldShow: false });
    }

    // Calculate previous month
    let previousYear = currentYear;
    let previousMonth = currentMonth - 1;
    if (previousMonth < 1) {
      previousMonth = 12;
      previousYear -= 1;
    }

    // Check if previous month exists and has habits
    const previousMonthDoc = await Month.findOne({
      userId,
      year: previousYear,
      month: previousMonth,
    });

    if (!previousMonthDoc) {
      return NextResponse.json({ shouldShow: false });
    }

    const previousHabits = await Habit.find({
      userId,
      monthId: previousMonthDoc._id,
    });

    if (previousHabits.length === 0) {
      return NextResponse.json({ shouldShow: false });
    }

    // Check if current month already has habits
    const currentMonthDoc = await Month.findOne({
      userId,
      year: currentYear,
      month: currentMonth,
    });

    if (currentMonthDoc) {
      const currentHabits = await Habit.find({
        userId,
        monthId: currentMonthDoc._id,
      });

      if (currentHabits.length > 0) {
        return NextResponse.json({ shouldShow: false });
      }
    }

    // Show the dialog
    return NextResponse.json({ shouldShow: true });
  } catch (error) {
    console.error("Error checking copy habits:", error);
    return NextResponse.json({ shouldShow: false }, { status: 500 });
  }
}
