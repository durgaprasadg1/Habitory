import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/syncUser";
import { sendSignupEmail } from "../../../services/mailServices";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await syncUser(clerkUser);

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = clerkUser.firstName || "User";

    await sendSignupEmail(email, name);

    return NextResponse.json(
      { success: true, message: "Signup email sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in send-signup-email endpoint:", error);
    return NextResponse.json(
      { error: "Failed to send signup email" },
      { status: 500 }
    );
  }
}