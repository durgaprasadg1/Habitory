import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/connectDb";
import User from "@/models/user";


export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: userId });

    if (user) {
      return NextResponse.json({
        success: true,
        message: "User found in MongoDB",
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "User not found in MongoDB. Webhook may not be configured.",
        clerkId: userId,
      });
    }
  } catch (error) {
    console.log("Error checking user:", error);
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 },
    );
  }
}
