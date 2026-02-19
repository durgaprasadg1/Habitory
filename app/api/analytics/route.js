import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import Habit from "@/models/habit";
import Month from "@/models/month";
import HabitLog from "@/models/habitLog";
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

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear());
    const month = parseInt(
      searchParams.get("month") || new Date().getMonth() + 1,
    );

    await dbConnect();

    let monthDoc = await Month.findOne({ userId, year, month });

    if (!monthDoc) {
      monthDoc = await Month.create({ userId, year, month });
    }

    const habits = await Habit.find({
      userId,
      monthId: monthDoc._id,
    }).sort({ createdAt: 1 });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const habitLogs = await HabitLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const analytics = calculateAnalytics(
      habits,
      habitLogs,
      year,
      month,
      daysInMonth,
    );

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function calculateAnalytics(habits, habitLogs, year, month, daysInMonth) {
  const totalPossible = habits.length * daysInMonth;
  const completedLogs = habitLogs.filter((log) => log.completed);
  const completedCount = completedLogs.length;
  const overallPercentage =
    totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0;

  const habitStats = habits.map((habit) => {
    const habitLogCount = habitLogs.filter(
      (log) => log.habitId.toString() === habit._id.toString() && log.completed,
    ).length;
    const percentage =
      daysInMonth > 0 ? Math.round((habitLogCount / daysInMonth) * 100) : 0;

    return {
      habitId: habit._id,
      habitName: habit.name,
      category: habit.category,
      completed: habitLogCount,
      total: daysInMonth,
      percentage,
    };
  });
  const categoryMap = {};
  habits.forEach((habit) => {
    const category = habit.category || "Uncategorized";
    if (!categoryMap[category]) {
      categoryMap[category] = { completed: 0, total: 0, count: 0 };
    }
    categoryMap[category].count += 1;
    categoryMap[category].total += daysInMonth;
  });

  habitLogs.forEach((log) => {
    if (log.completed) {
      const habit = habits.find(
        (h) => h._id.toString() === log.habitId.toString(),
      );
      if (habit) {
        const category = habit.category || "Uncategorized";
        if (categoryMap[category]) {
          categoryMap[category].completed += 1;
        }
      }
    }
  });

  const categoryStats = Object.entries(categoryMap).map(
    ([category, stats]) => ({
      category,
      completed: stats.completed,
      total: stats.total,
      habitCount: stats.count,
      percentage:
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    }),
  );

  const dailyTrend = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dayLogs = habitLogs.filter((log) => {
      const logDay = new Date(log.date).getDate();
      return logDay === day && log.completed;
    });
    const dayTotal = habits.length;
    const dayCompleted = dayLogs.length;
    const dayPercentage =
      dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0;

    dailyTrend.push({
      day,
      completed: dayCompleted,
      total: dayTotal,
      percentage: dayPercentage,
    });
  }

  const weeklyStats = calculateWeeklyTrend(
    habitLogs,
    habits,
    year,
    month,
    daysInMonth,
  );

  const longestStreak = calculateLongestStreak(habitLogs, habits, daysInMonth);
  const currentStreak = calculateCurrentStreak(habitLogs, habits, daysInMonth);

  return {
    overview: {
      totalHabits: habits.length,
      totalPossible,
      completed: completedCount,
      percentage: overallPercentage,
      daysInMonth,
    },
    habitStats,
    categoryStats,
    dailyTrend,
    weeklyStats,

    streaks: {
      longest: longestStreak,
      current: currentStreak,
    },
  };
}

function calculateWeeklyTrend(habitLogs, habits, year, month, daysInMonth) {
  const weeks = [];
  let currentDay = 1;

  while (currentDay <= daysInMonth) {
    const endDay = Math.min(currentDay + 6, daysInMonth);

    const weekLogs = habitLogs.filter((log) => {
      const day = new Date(log.date).getDate();
      return day >= currentDay && day <= endDay && log.completed;
    });

    const weekTotal = habits.length * (endDay - currentDay + 1);
    const weekCompleted = weekLogs.length;
    const percentage =
      weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

    weeks.push({
      week: `Week ${weeks.length + 1}`,
      startDay: currentDay,
      endDay,
      completed: weekCompleted,
      total: weekTotal,
      percentage,
    });

    currentDay = endDay + 1;
  }

  return weeks;
}

function calculateLongestStreak(habitLogs, habits, daysInMonth) {
  if (habits.length === 0) return 0;

  let maxStreak = 0;
  let currentStreak = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dayLogs = habitLogs.filter((log) => {
      const logDay = new Date(log.date).getDate();
      return logDay === day && log.completed;
    });

    if (dayLogs.length > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

function calculateCurrentStreak(habitLogs, habits, daysInMonth) {
  if (habits.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const startDay = Math.min(currentDay, daysInMonth);

  for (let day = startDay; day >= 1; day--) {
    const dayLogs = habitLogs.filter((log) => {
      const logDay = new Date(log.date).getDate();
      return logDay === day && log.completed;
    });

    if (dayLogs.length > 0) {
      streak++;
    } else {
      if (day !== startDay || day !== currentDay) {
        break;
      }
    }
  }

  return streak;
}
