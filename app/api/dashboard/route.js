import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/connectDb";
import Habit from "@/models/habit";
import Month from "@/models/month";
import HabitLog from "@/models/habitLog";
import { syncUser } from "@/lib/syncUser";
import mongoose from "mongoose";

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

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear());
    const month = parseInt(
      searchParams.get("month") || new Date().getMonth() + 1,
    );

    await connectDB();

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

    const habits = await Habit.find({
      userId: userId,
      monthId: monthDoc._id,
    }).sort({ createdAt: 1 });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const habitLogs = await HabitLog.find({
      userId: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const habitLogsMap = {};
    habitLogs.forEach((log) => {
      const day = new Date(log.date).getDate();
      const key = `${log.habitId}-${day}`;
      habitLogsMap[key] = log.completed;
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const weeklyStats = calculateWeeklyStats(
      habits,
      habitLogs,
      year,
      month,
      daysInMonth,
    );

    const totalPossible = habits.length * daysInMonth;
    const completed = habitLogs.filter((log) => log.completed).length;
    const percentage =
      totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;

    return NextResponse.json({
      monthlyGoal: {
        title: monthDoc.goalTitle || "No Goal Set",
        description:
          monthDoc.goalDescription ||
          "Set a monthly goal to track your progress",
        habitId: monthDoc.goalHabitId,
      },
      habits: habits.map((h) => ({
        _id: h._id.toString(),
        name: h.name,
        category: h.category,
        isGoalHabit: h.isGoalHabit,
      })),
      habitLogsMap,
      weeklyStats,
      overallSummary: {
        percentage,
        completed,
        total: totalPossible,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function calculateWeeklyStats(habits, habitLogs, year, month, daysInMonth) {
  const weeks = [];
  const weekRanges = getWeekRanges(year, month, daysInMonth);

  weekRanges.forEach((range, index) => {
    const logsInWeek = habitLogs.filter((log) => {
      const day = new Date(log.date).getDate();
      return day >= range.start && day <= range.end && log.completed;
    });

    const totalPossible = habits.length * (range.end - range.start + 1);
    const completed = logsInWeek.length;
    const percentage =
      totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;

    weeks.push({
      label: `Week ${index + 1}`,
      days: `${range.start}-${range.end}`,
      percentage,
      completed,
      total: totalPossible,
    });
  });

  return weeks;
}

function getWeekRanges(year, month, daysInMonth) {
  const weeks = [];
  let currentDay = 1;

  while (currentDay <= daysInMonth) {
    const endDay = Math.min(currentDay + 6, daysInMonth);
    weeks.push({ start: currentDay, end: endDay });
    currentDay = endDay + 1;
  }

  while (weeks.length < 4) {
    weeks.push({ start: 0, end: 0 });
  }

  return weeks.slice(0, 4);
}
