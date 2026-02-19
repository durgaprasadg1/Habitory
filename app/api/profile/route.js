import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import User from "@/models/user";
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

    await dbConnect();

    const user = await User.findOne({ clerkId: userId }).populate("habits");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalHabits = await Habit.countDocuments({ userId });
    const totalLogs = await HabitLog.countDocuments({ userId });
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const activeHabits = await Habit.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth },
    });
    const completedLogs = await HabitLog.countDocuments({
      userId,
      completed: true,
    });

    const allCompletedLogs = await HabitLog.find({
      userId,
      completed: true,
    }).sort({ date: -1 });

    let currentStreak = 0;
    if (allCompletedLogs.length > 0) {
      const uniqueDates = new Set();
      allCompletedLogs.forEach((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        uniqueDates.add(logDate.getTime());
      });

      const sortedDates = Array.from(uniqueDates)
        .sort((a, b) => b - a)
        .map((timestamp) => new Date(timestamp));

      if (sortedDates.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const mostRecentDate = sortedDates[0];

        if (
          mostRecentDate.getTime() === today.getTime() ||
          mostRecentDate.getTime() === yesterday.getTime()
        ) {
          currentStreak = 1;

          for (let i = 1; i < sortedDates.length; i++) {
            const currentDate = sortedDates[i];
            const prevDate = sortedDates[i - 1];

            const diffTime = prevDate.getTime() - currentDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      }
    }

    const profileData = {
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      stats: {
        totalHabits,
        activeHabits,
        totalLogs,
        completedLogs,
        currentStreak,
        completionRate:
          totalLogs > 0 ? ((completedLogs / totalLogs) * 100).toFixed(1) : 0,
      },
      habits: user.habits,
    };

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
