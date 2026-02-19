import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import Achievement from "@/models/achievement";
import { syncUser } from "@/lib/syncUser";

// GET - Fetch all achievements for the user
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

    const achievements = await Achievement.find({ userId }).sort({ date: -1 });

    return NextResponse.json({ achievements }, { status: 200 });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

// POST - Create a new achievement
export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (clerkUser) {
      await syncUser(clerkUser);
    }

    const body = await request.json();
    const { title, description, icon, category, date } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await dbConnect();

    const achievement = await Achievement.create({
      userId,
      title: title.trim(),
      description: description?.trim() || "",
      icon: icon || "🏆",
      category: category || "custom",
      date: date ? new Date(date) : new Date(),
    });

    return NextResponse.json(
      { achievement, message: "Achievement created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

// PUT - Update an achievement
export async function PUT(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, icon, category, date } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Achievement ID is required" },
        { status: 400 },
      );
    }

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await dbConnect();

    const achievement = await Achievement.findOne({ _id: id, userId });

    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 },
      );
    }

    achievement.title = title.trim();
    achievement.description = description?.trim() || "";
    achievement.icon = icon || "🏆";
    achievement.category = category || "custom";
    if (date) achievement.date = new Date(date);

    await achievement.save();

    return NextResponse.json(
      { achievement, message: "Achievement updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating achievement:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

// DELETE - Delete an achievement
export async function DELETE(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Achievement ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const achievement = await Achievement.findOneAndDelete({ _id: id, userId });

    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Achievement deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
