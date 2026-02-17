import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/connectDb";
import Month from "@/models/month";
import Habit from "@/models/habit";
import HabitLog from "@/models/habitLog";
import { syncUser } from "@/lib/syncUser";

export async function GET(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user is synced
    const clerkUser = await currentUser();
    if (clerkUser) {
      await syncUser(clerkUser);
    }

    const { searchParams } = new URL(request.url);
    const requestedYear = searchParams.get("year");
    const requestedMonth = searchParams.get("month");

    await connectDB();

    // Get current month and year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Find all months before the current month
    const pastMonths = await Month.find({
      userId,
      $or: [
        { year: { $lt: currentYear } },
        { year: currentYear, month: { $lt: currentMonth } },
      ],
    }).sort({ year: -1, month: -1 });

    if (pastMonths.length === 0) {
      return NextResponse.json({ availableMonths: [], monthData: null });
    }

    // If no specific month requested, return available months list only
    if (!requestedYear || !requestedMonth) {
      const availableMonths = pastMonths.map((m) => ({
        year: m.year,
        month: m.month,
      }));
      return NextResponse.json({ availableMonths, monthData: null });
    }

    // Find the requested month
    const year = parseInt(requestedYear);
    const month = parseInt(requestedMonth);

    const monthDoc = pastMonths.find(
      (m) => m.year === year && m.month === month,
    );

    if (!monthDoc) {
      return NextResponse.json(
        { error: "Month not found or not a past month" },
        { status: 404 },
      );
    }

    // Get detailed data for the requested month
    const habits = await Habit.find({
      userId,
      monthId: monthDoc._id,
    });

    const startDate = new Date(monthDoc.year, monthDoc.month - 1, 1);
    const endDate = new Date(monthDoc.year, monthDoc.month, 0, 23, 59, 59);
    const daysInMonth = new Date(monthDoc.year, monthDoc.month, 0).getDate();

    const habitLogs = await HabitLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate daily completion
    const dailyData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayLogs = habitLogs.filter((log) => {
        const logDay = new Date(log.date).getDate();
        return logDay === day && log.completed;
      });
      const percentage =
        habits.length > 0
          ? Math.round((dayLogs.length / habits.length) * 100)
          : 0;
      dailyData.push({ day, percentage, completed: dayLogs.length });
    }

    const totalPossible = habits.length * daysInMonth;
    const completedCount = habitLogs.filter((log) => log.completed).length;
    const overallPercentage =
      totalPossible > 0
        ? Math.round((completedCount / totalPossible) * 100)
        : 0;

    const monthData = {
      year: monthDoc.year,
      month: monthDoc.month,
      totalHabits: habits.length,
      totalPossible,
      completed: completedCount,
      percentage: overallPercentage,
      daysInMonth,
      dailyData,
      monthlyGoal: monthDoc.monthlyGoal || null,
    };

    const availableMonths = pastMonths.map((m) => ({
      year: m.year,
      month: m.month,
    }));

    return NextResponse.json({ availableMonths, monthData });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
