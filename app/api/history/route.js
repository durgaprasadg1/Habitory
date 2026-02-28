import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
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

    const clerkUser = await currentUser();
    if (clerkUser) {
      await syncUser(clerkUser);
    }

    const { searchParams } = new URL(request.url);
    const requestedYear = searchParams.get("year");
    const requestedMonth = searchParams.get("month");
    await dbConnect();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const User = (await import("@/models/user")).default;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ availableMonths: [], monthData: null });
    }

    const userCreatedAt = new Date(user.createdAt);
    const userCreatedYear = userCreatedAt.getFullYear();
    const userCreatedMonth = userCreatedAt.getMonth() + 1;

    const pastMonths = await Month.find({
      userId,
      $and: [
        // Past months only (before current month)
        {
          $or: [
            { year: { $lt: currentYear } },
            { year: currentYear, month: { $lt: currentMonth } },
          ],
        },
        {
          $or: [
            { year: { $gt: userCreatedYear } },
            {
              $and: [
                { year: userCreatedYear },
                { month: { $gte: userCreatedMonth } },
              ],
            },
          ],
        },
      ],
    }).sort({ year: -1, month: -1 });

    console.log(`Found ${pastMonths.length} past months for user ${userId}`);
    console.log(
      `User created: ${userCreatedYear}-${userCreatedMonth}, Current: ${currentYear}-${currentMonth}`,
    );

    if (pastMonths.length === 0) {
      return NextResponse.json({ availableMonths: [], monthData: null });
    }

    if (!requestedYear || !requestedMonth) {
      const availableMonths = pastMonths.map((m) => ({
        year: m.year,
        month: m.month,
      }));
      return NextResponse.json({ availableMonths, monthData: null });
    }

    const year = parseInt(requestedYear);
    const month = parseInt(requestedMonth);

    // Check if requested month is before user account creation
    if (
      year < userCreatedYear ||
      (year === userCreatedYear && month < userCreatedMonth)
    ) {
      return NextResponse.json(
        { error: "Cannot access data before account creation" },
        { status: 403 },
      );
    }

    const monthDoc = pastMonths.find(
      (m) => m.year === year && m.month === month,
    );

    if (!monthDoc) {
      return NextResponse.json(
        { error: "Month not found or not a past month" },
        { status: 404 },
      );
    }

    const habits = await Habit.find({
      userId,
      monthId: monthDoc._id,
    });

    if (habits.length === 0) {
      // Month exists but no habits tracked
      return NextResponse.json({
        availableMonths: pastMonths.map((m) => ({
          year: m.year,
          month: m.month,
        })),
        monthData: {
          year: monthDoc.year,
          month: monthDoc.month,
          totalHabits: 0,
          totalPossible: 0,
          completed: 0,
          percentage: 0,
          daysInMonth: new Date(monthDoc.year, monthDoc.month, 0).getDate(),
          dailyData: [],
          monthlyGoal: monthDoc.monthlyGoal || null,
          message: "No habits were tracked for this month",
        },
      });
    }

    const startDate = new Date(monthDoc.year, monthDoc.month - 1, 1);
    const endDate = new Date(monthDoc.year, monthDoc.month, 0, 23, 59, 59);
    const daysInMonth = new Date(monthDoc.year, monthDoc.month, 0).getDate();

    const habitLogs = await HabitLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const dailyData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayLogs = habitLogs.filter((log) => {
        const logDay = new Date(log.date).getDate();
        return logDay === day && log.completed;
      });
      const dayTotal = habits.length;
      const dayCompleted = dayLogs.length;
      const percentage =
        habits.length > 0
          ? Math.round((dayLogs.length / habits.length) * 100)
          : 0;
      dailyData.push({
        day,
        percentage,
        completed: dayCompleted,
        total: dayTotal,
      });
    }

    const totalPossible = habits.length * daysInMonth;
    const completedCount = habitLogs.filter((log) => log.completed).length;
    const overallPercentage =
      totalPossible > 0
        ? Math.round((completedCount / totalPossible) * 100)
        : 0;

    const habitStats = habits.map((habit) => {
      const habitLogCount = habitLogs.filter(
        (log) =>
          log.habitId.toString() === habit._id.toString() && log.completed,
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

    // Calculate category stats
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
          stats.total > 0
            ? Math.round((stats.completed / stats.total) * 100)
            : 0,
      }),
    );

    // Calculate weekly stats
    const weeklyStats = [];
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

      weeklyStats.push({
        week: `Week ${weeklyStats.length + 1}`,
        startDay: currentDay,
        endDay,
        completed: weekCompleted,
        total: weekTotal,
        percentage,
      });
      currentDay = endDay + 1;
    }

    // Calculate streaks
    const longestStreak = calculateLongestStreak(
      habitLogs,
      habits,
      daysInMonth,
    );
    const currentStreak = calculateCurrentStreak(
      habitLogs,
      habits,
      daysInMonth,
    );

    const monthData = {
      year: monthDoc.year,
      month: monthDoc.month,
      totalHabits: habits.length,
      totalPossible,
      completed: completedCount,
      percentage: overallPercentage,
      daysInMonth,
      dailyData,
      habitStats,
      categoryStats,
      weeklyStats,
      streaks: {
        longest: longestStreak,
        current: currentStreak,
      },
      monthlyGoal: monthDoc.monthlyGoal || null,
    };

    const availableMonths = pastMonths.map((m) => ({
      year: m.year,
      month: m.month,
    }));

    return NextResponse.json({ availableMonths, monthData });
  } catch (error) {
    console.log("Error fetching history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
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

  for (let day = daysInMonth; day >= 1; day--) {
    const dayLogs = habitLogs.filter((log) => {
      const logDay = new Date(log.date).getDate();
      return logDay === day && log.completed;
    });

    if (dayLogs.length > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
