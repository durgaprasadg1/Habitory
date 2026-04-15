import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import User from "@/models/user";
import { syncUser } from "@/lib/syncUser";

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

    await dbConnect();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    await User.findOneAndUpdate(
      { clerkId: userId },
      {
        lastHabitsCopyAskedYear: currentYear,
        lastHabitsCopyAskedMonth: currentMonth,
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking habits asked:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
