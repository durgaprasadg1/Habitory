import User from "../models/user";
import { connectDB } from "./connectDb";


export async function syncUser(clerkUser) {
  try {
    await connectDB();

    const existing = await User.findOne({ clerkId: clerkUser.id });

    if (!existing) {
      const newUser = await User.create({
        clerkId: clerkUser.id,
        email:
          clerkUser.emailAddresses?.[0]?.emailAddress ||
          clerkUser.primaryEmailAddress?.emailAddress ||
          "",
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          "User",
        profileImage: clerkUser.imageUrl || "",
      });
      console.log("User synced to MongoDB:", newUser.email);
      return newUser;
    }

    return existing;
  } catch (error) {
    console.error("Error syncing user:", error);
    return null;
  }
}


export async function getOrCreateUser(userId) {
  try {
    await connectDB();

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
        email: `user_${userId}@placeholder.com`,
        name: "User",
      });
      console.log("Created placeholder user for:", userId);
    }

    return user;
  } catch (error) {
    console.error("Error getting/creating user:", error);
    return null;
  }
}
