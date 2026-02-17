import { z } from "zod";


export const habitSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  monthId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(100, "Habit name must be less than 100 characters")
    .trim(),
  category: z
    .string()
    .max(50, "Category must be less than 50 characters")
    .trim()
    .optional(),
  isGoalHabit: z.boolean().default(false),
  isEditable: z.boolean().default(true),
});

export const createHabitSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(100, "Habit name must be less than 100 characters")
    .trim(),
  category: z
    .string()
    .max(50, "Category must be less than 50 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  isGoalHabit: z.boolean().optional().default(false),
  monthId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format")
    .optional(),
});

export const updateHabitSchema = z
  .object({
    name: z
      .string()
      .min(1, "Habit name is required")
      .max(100, "Habit name must be less than 100 characters")
      .trim()
      .optional(),
    category: z
      .string()
      .max(50, "Category must be less than 50 characters")
      .trim()
      .optional()
      .or(z.literal("")),
    isGoalHabit: z.boolean().optional(),
    isEditable: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const getHabitsQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
  monthId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format")
    .optional(),
  category: z.string().optional(),
  isGoalHabit: z.enum(["true", "false"]).optional(),
});

export const habitIdParamSchema = z.object({
  habitId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format"),
});

export const bulkDeleteHabitsSchema = z.object({
  habitIds: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format"))
    .min(1, "At least one habit ID is required"),
});


export function validateCreateHabit(data) {
  return createHabitSchema.safeParse(data);
}

export function validateUpdateHabit(data) {
  return updateHabitSchema.safeParse(data);
}

export function validateGetHabitsQuery(params) {
  return getHabitsQuerySchema.safeParse(params);
}

export function validateHabitId(id) {
  return habitIdParamSchema.safeParse({ habitId: id });
}

export function validateBulkDeleteHabits(data) {
  return bulkDeleteHabitsSchema.safeParse(data);
}
