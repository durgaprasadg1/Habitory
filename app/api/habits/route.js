import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import Habit from "@/models/habit";
import Month from "@/models/month";
import HabitLog from "@/models/habitLog";
import mongoose from "mongoose";

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

    const habits = await Habit.find({
      userId: userId,
      monthId: monthDoc._id,
    }).sort({ createdAt: 1 });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const habitLogs = await HabitLog.find({
      userId: userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    return NextResponse.json({
      habits,
      habitLogs,
      monthlyGoal: {
        title: monthDoc.goalTitle,
        description: monthDoc.goalDescription,
        habitId: monthDoc.goalHabitId,
      },
    });
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

    const habit = await Habit.create({
      userId: userId,
      monthId: monthDoc._id,
      name,
      category: category || "",
      isGoalHabit: isGoalHabit || false,
      isEditable,
    });

    if (isGoalHabit) {
      monthDoc.goalHabitId = habit._id;
      if (!monthDoc.goalTitle) {
        monthDoc.goalTitle = name;
      }
      await monthDoc.save();
    }

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.log("Error creating habit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
