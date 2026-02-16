import User from "../models/user"

export async function syncUser(clerkUser) {
  const existing = await User.findOne({ clerkId: clerkUser.id })

  if (!existing) {
    await User.create({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: clerkUser.firstName || "",
    })
  }
}
