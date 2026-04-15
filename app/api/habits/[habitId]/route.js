import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import Habit from "@/models/habit";
import HabitLog from "@/models/habitLog";
import Month from "@/models/month";
import mongoose from "mongoose";
import {
  buildUserCacheKey,
  getJsonCache,
  invalidateUserCache,
  setJsonCache,
  deleteCacheKeys,
} from "@/lib/redis";

const HABIT_DETAIL_CACHE_TTL_SECONDS = 300;

export async function GET(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { habitId } = await params;
    const cacheKey = buildUserCacheKey(userId, "habit", habitId);
    const cachedData = await getJsonCache(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    await dbConnect();

    const habitDoc = await Habit.findById(habitId);

    if (!habitDoc) {
      console.log(`Habit not found for id=${habitId} user=${userId}`);
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (habitDoc.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const habit = {
      _id: habitDoc._id.toString(),
      name: habitDoc.name,
      category: habitDoc.category,
      isGoalHabit: !!habitDoc.isGoalHabit,
      isEditable: !!habitDoc.isEditable,
      createdAt: habitDoc.createdAt,
    };

    await setJsonCache(cacheKey, habit, HABIT_DETAIL_CACHE_TTL_SECONDS);
    return NextResponse.json(habit);
  } catch (error) {
    console.log("Error fetching habit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { habitId } = await params;
    const body = await request.json();
    const { name, category, isGoalHabit } = body;

    await dbConnect();

    const habit = await Habit.findById(habitId);

    if (!habit) {
      console.log(`Habit not found when updating id=${habitId} user=${userId}`);
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (name !== undefined) habit.name = name;
    if (category !== undefined) habit.category = category;
    if (isGoalHabit !== undefined) habit.isGoalHabit = isGoalHabit;

    await habit.save();
    // invalidate and delete specific cache keys for the related month
    try {
      await invalidateUserCache(userId);
      if (habit.monthId) {
        const monthDoc = await Month.findById(habit.monthId);
        if (monthDoc) {
          const dashboardKey = buildUserCacheKey(
            userId,
            "dashboard",
            monthDoc.year,
            monthDoc.month,
          );
          const habitsKey = buildUserCacheKey(
            userId,
            "habits",
            monthDoc.year,
            monthDoc.month,
          );
          await deleteCacheKeys([dashboardKey, habitsKey]);
        }
      }
    } catch (e) {
      console.error("Cache invalidation failed:", e?.message || e);
    }

    const serialized = {
      _id: habit._id.toString(),
      name: habit.name,
      category: habit.category,
      isGoalHabit: !!habit.isGoalHabit,
      isEditable: !!habit.isEditable,
      createdAt: habit.createdAt,
    };

    return NextResponse.json({
      success: true,
      habit: serialized,
      message: "Habit updated successfully",
    });
  } catch (error) {
    console.log("Error updating habit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  return PUT(request, { params });
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { habitId } = await params;

    await dbConnect();

    const habit = await Habit.findById(habitId);

    if (!habit) {
      console.log(`DELETE: Habit not found for id=${habitId} user=${userId}`);
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== userId) {
      console.log(
        `DELETE: Unauthorized - habit.userId=${habit.userId} request.userId=${userId} habitId=${habitId}`,
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await HabitLog.deleteMany({
      habitId: new mongoose.Types.ObjectId(habitId),
    });

    await Habit.findByIdAndDelete(habitId);
    // invalidate caches and delete specific keys
    try {
      await invalidateUserCache(userId);
      if (habit.monthId) {
        const monthDoc = await Month.findById(habit.monthId);
        if (monthDoc) {
          const dashboardKey = buildUserCacheKey(
            userId,
            "dashboard",
            monthDoc.year,
            monthDoc.month,
          );
          const habitsKey = buildUserCacheKey(
            userId,
            "habits",
            monthDoc.year,
            monthDoc.month,
          );
          await deleteCacheKeys([dashboardKey, habitsKey]);
        }
      }
    } catch (e) {
      console.error("Cache invalidation failed:", e?.message || e);
    }

    return NextResponse.json({
      success: true,
      message: "Habit and all associated logs deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting habit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
