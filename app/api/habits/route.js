import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import Habit from "@/models/habit";
import Month from "@/models/month";
import HabitLog from "@/models/habitLog";
import mongoose from "mongoose";
import {
  buildUserCacheKey,
  getJsonCache,
  invalidateUserCache,
  setJsonCache,
} from "@/lib/redis";
import { deleteCacheKeys } from "@/lib/redis";

const HABITS_CACHE_TTL_SECONDS = 300;

export async function GET(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear());
    const month = parseInt(
      searchParams.get("month") || new Date().getMonth() + 1,
    );
    const cacheKey = buildUserCacheKey(userId, "habits", year, month);
    const cachedData = await getJsonCache(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData);
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

    const habitsDocs = await Habit.find({
      userId: userId,
      monthId: monthDoc._id,
    }).sort({ createdAt: 1 });
    const habits = habitsDocs.map((h) => ({
      _id: h._id.toString(),
      name: h.name,
      category: h.category,
      isGoalHabit: !!h.isGoalHabit,
      isEditable: !!h.isEditable,
      createdAt: h.createdAt,
    }));

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const habitLogsDocs = await HabitLog.find({
      userId: userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    const habitLogs = habitLogsDocs.map((l) => ({
      _id: l._id.toString(),
      habitId: l.habitId.toString(),
      date: l.date,
      completed: !!l.completed,
    }));

    const responsePayload = {
      habits,
      habitLogs,
      monthlyGoal: {
        title: monthDoc.goalTitle,
        description: monthDoc.goalDescription,
        habitId: monthDoc.goalHabitId ? String(monthDoc.goalHabitId) : null,
      },
    };

    await setJsonCache(cacheKey, responsePayload, HABITS_CACHE_TTL_SECONDS);

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.log("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, isGoalHabit, year, month } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Habit name is required" },
        { status: 400 },
      );
    }

    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || new Date().getMonth() + 1;

    await dbConnect();

    let monthDoc = await Month.findOne({
      userId: userId,
      year: currentYear,
      month: currentMonth,
    });

    if (!monthDoc) {
      monthDoc = await Month.create({
        userId: userId,
        year: currentYear,
        month: currentMonth,
      });
    }

    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === currentYear &&
      today.getMonth() + 1 === currentMonth;
    const dayOfMonth = today.getDate();
    const isEditable = !isCurrentMonth || dayOfMonth <= 3;

    const habitDoc = await Habit.create({
      userId: userId,
      monthId: monthDoc._id,
      name,
      category: category || "",
      isGoalHabit: isGoalHabit || false,
      isEditable,
    });

    if (isGoalHabit) {
      monthDoc.goalHabitId = habitDoc._id;
      if (!monthDoc.goalTitle) {
        monthDoc.goalTitle = name;
      }
      await monthDoc.save();
    }

    // Try to invalidate user cache and also delete specific month/dashboard keys
    try {
      await invalidateUserCache(userId);
      const dashboardKey = buildUserCacheKey(
        userId,
        "dashboard",
        currentYear,
        currentMonth,
      );
      const habitsKey = buildUserCacheKey(
        userId,
        "habits",
        currentYear,
        currentMonth,
      );
      await deleteCacheKeys([dashboardKey, habitsKey]);
    } catch (e) {
      console.error("Cache invalidation failed:", e?.message || e);
    }

    const habit = {
      _id: habitDoc._id.toString(),
      name: habitDoc.name,
      category: habitDoc.category,
      isGoalHabit: !!habitDoc.isGoalHabit,
      isEditable: !!habitDoc.isEditable,
      createdAt: habitDoc.createdAt,
    };

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.log("Error creating habit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
