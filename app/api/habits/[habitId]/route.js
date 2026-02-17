import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/connectDb";
import Habit from "@/models/habit";
import HabitLog from "@/models/habitLog";
import mongoose from "mongoose";


export async function GET(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { habitId } = await params;

    await connectDB();

    const habit = await Habit.findById(habitId);

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error fetching habit:", error);
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

    await connectDB();

    const habit = await Habit.findById(habitId);

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (name !== undefined) habit.name = name;
    if (category !== undefined) habit.category = category;
    if (isGoalHabit !== undefined) habit.isGoalHabit = isGoalHabit;

    await habit.save();

    return NextResponse.json({
      success: true,
      habit,
      message: "Habit updated successfully",
    });
  } catch (error) {
    console.error("Error updating habit:", error);
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

    await connectDB();

    const habit = await Habit.findById(habitId);

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await HabitLog.deleteMany({
      habitId: new mongoose.Types.ObjectId(habitId),
    });

    await Habit.findByIdAndDelete(habitId);

    return NextResponse.json({
      success: true,
      message: "Habit and all associated logs deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
