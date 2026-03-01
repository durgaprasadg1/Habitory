import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/syncUser";
import { sendSigninEmail } from "../../../services/mailServices";

export async function POST() {
  try {
    const { userId } = await auth();
    console.log("Sending In email to ", userId)
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

    await sendSigninEmail(email, name);

    return NextResponse.json(
      { success: true, message: "Signin email sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in send-signin-email endpoint:", error);
    return NextResponse.json(
      { error: "Failed to send signin email" },
      { status: 500 }
    );
  }
}