import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDb";
import User from "@/models/user";

export async function POST(req) {
  // Get the Svix headers for verification
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is not set");
    return new Response(
      "Error: Please add WEBHOOK_SECRET from Clerk Dashboard to .env",
      {
        status: 500,
      },
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  await connectDB();

  try {
    switch (eventType) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;
      case "user.updated":
        await handleUserUpdated(evt.data);
        break;
      case "user.deleted":
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function handleUserCreated(data) {
  const { id, email_addresses, first_name, last_name, image_url } = data;

  const existingUser = await User.findOne({ clerkId: id });

  if (!existingUser) {
    const newUser = await User.create({
      clerkId: id,
      email: email_addresses[0]?.email_address || "",
      name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
      profileImage: image_url || "",
    });
    console.log("✅ New user created in MongoDB:", newUser.email);
  } else {
    console.log("User already exists in MongoDB:", existingUser.email);
  }
}

async function handleUserUpdated(data) {
  const { id, email_addresses, first_name, last_name, image_url } = data;

  const updatedUser = await User.findOneAndUpdate(
    { clerkId: id },
    {
      email: email_addresses[0]?.email_address || "",
      name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
      profileImage: image_url || "",
    },
    { new: true, upsert: true },
  );

  console.log("✅ User updated in MongoDB:", updatedUser.email);
}

async function handleUserDeleted(data) {
  const { id } = data;

  const deletedUser = await User.findOneAndDelete({ clerkId: id });

  if (deletedUser) {
    console.log("✅ User deleted from MongoDB:", deletedUser.email);
  } else {
    console.log("User not found in MongoDB for deletion:", id);
  }
}
