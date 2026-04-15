import { z } from "zod";

export const userSchema = z.object({
  clerkId: z.string().min(1, "Clerk ID is required"),
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  profileImage: z
    .string()
    .url("Invalid profile image URL")
    .optional()
    .nullable(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

export const createUserSchema = z.object({
  clerkId: z.string().min(1, "Clerk ID is required"),
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  profileImage: z
    .string()
    .url("Invalid profile image URL")
    .optional()
    .nullable(),
});

export const updateUserSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email format")
      .toLowerCase()
      .trim()
      .optional(),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters")
      .trim()
      .optional(),
    profileImage: z
      .string()
      .url("Invalid profile image URL")
      .optional()
      .nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const getUserQuerySchema = z.object({
  clerkId: z.string().min(1, "Clerk ID is required").optional(),
  email: z.string().email("Invalid email format").optional(),
});

export const clerkWebhookEventSchema = z.object({
  type: z.enum(["user.created", "user.updated", "user.deleted"]),
  data: z.object({
    id: z.string(),
    email_addresses: z
      .array(
        z.object({
          email_address: z.string().email(),
          id: z.string(),
        }),
      )
      .optional(),
    first_name: z.string().optional().nullable(),
    last_name: z.string().optional().nullable(),
    image_url: z.string().optional().nullable(),
    username: z.string().optional().nullable(),
  }),
});

export const syncUserSchema = z.object({
  clerkId: z.string().min(1, "Clerk ID is required"),
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  name: z.string().min(1, "Name is required").max(100).trim(),
  profileImage: z.string().url().optional().nullable(),
});


export function validateCreateUser(data) {
  return createUserSchema.safeParse(data);
}

export function validateUpdateUser(data) {
  return updateUserSchema.safeParse(data);
}

export function validateGetUserQuery(params) {
  return getUserQuerySchema.safeParse(params);
}

export function validateClerkWebhookEvent(event) {
  return clerkWebhookEventSchema.safeParse(event);
}

export function validateSyncUser(data) {
  return syncUserSchema.safeParse(data);
}

export function extractUserDataFromClerkEvent(event) {
  const validation = validateClerkWebhookEvent(event);

  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const { data } = validation.data;
  const email = data.email_addresses?.[0]?.email_address;
  const name =
    [data.first_name, data.last_name].filter(Boolean).join(" ") ||
    data.username ||
    "User";

  return {
    success: true,
    user: {
      clerkId: data.id,
      email: email || "",
      name,
      profileImage: data.image_url || null,
    },
  };
}
