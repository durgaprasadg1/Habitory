import User from "../models/user";
import { sendSigninEmail, sendSignupEmail } from "../services/mailServices";
import { dbConnect } from "./connectDb";



export async function syncUser(clerkUser) {
  try {
    await dbConnect();

    const primaryEmail =
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      clerkUser.primaryEmailAddress?.emailAddress ||
      "";

    const fullName =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      "User";

    let existing = await User.findOne({ clerkId: clerkUser.id });

    if (!existing && primaryEmail) {
      existing = await User.findOne({ email: primaryEmail });

      if (existing) {
        existing.clerkId = clerkUser.id;
        await existing.save();
      }
    }

    if (existing) {
      await sendSigninEmail(existing.email, existing.name);
      console.log("Signin email sent");
      return existing;
    }
    else{
        const newUser = await User.create({
        clerkId: clerkUser.id,
        email: primaryEmail,
        name: fullName,
        profileImage: clerkUser.imageUrl || "",
      });

      await sendSignupEmail(newUser.email, newUser.name);
      console.log("Signup email sent");

      return newUser;
    }

    

  } catch (error) {
    console.error("Error syncing user:", error);
    return null;
  }
}
