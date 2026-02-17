import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/syncUser";

/**
 * Manual sync endpoint - fallback if webhook fails
 * Call this after user signs up or when needed
 */
export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get full user details from Clerk
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sync to MongoDB
    const mongoUser = await syncUser(clerkUser);

    return NextResponse.json({
      success: true,
      message: "User synced to MongoDB",
      user: mongoUser,
    });
  } catch (error) {
    console.error("Error in sync endpoint:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
