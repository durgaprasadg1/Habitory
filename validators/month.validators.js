import { z } from "zod";

export const monthSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  year: z
    .number()
    .int("Year must be an integer")
    .min(2020, "Year must be 2020 or later")
    .max(2100, "Year must be 2100 or earlier"),
  month: z
    .number()
    .int("Month must be an integer")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
  goalTitle: z
    .string()
    .max(100, "Goal title must be less than 100 characters")
    .trim()
    .optional(),
  goalDescription: z
    .string()
    .max(500, "Goal description must be less than 500 characters")
    .trim()
    .optional(),
  goalHabitId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format")
    .optional()
    .nullable(),
  goalEditedOnce: z.boolean().default(false),
  goalLocked: z.boolean().default(false),
});

export const setMonthlyGoalSchema = z.object({
  year: z
    .number()
    .int("Year must be an integer")
    .min(2020, "Year must be 2020 or later")
    .max(2100, "Year must be 2100 or earlier")
    .optional(),
  month: z
    .number()
    .int("Month must be an integer")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12")
    .optional(),
  goalTitle: z
    .string()
    .min(1, "Goal title is required")
    .max(100, "Goal title must be less than 100 characters")
    .trim(),
  goalDescription: z
    .string()
    .max(500, "Goal description must be less than 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  goalHabitId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format")
    .optional()
    .nullable(),
});

export const getMonthQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
  year: z.coerce
    .number()
    .int("Year must be an integer")
    .min(2020, "Year must be 2020 or later")
    .max(2100, "Year must be 2100 or earlier")
    .optional(),
  month: z.coerce
    .number()
    .int("Month must be an integer")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12")
    .optional(),
});

export const currentMonthQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),
});

export const monthRangeQuerySchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    startYear: z.coerce.number().int().min(2020).max(2100),
    startMonth: z.coerce.number().int().min(1).max(12),
    endYear: z.coerce.number().int().min(2020).max(2100),
    endMonth: z.coerce.number().int().min(1).max(12),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startYear, data.startMonth - 1);
      const endDate = new Date(data.endYear, data.endMonth - 1);
      return startDate <= endDate;
    },
    { message: "Start date must be before or equal to end date" },
  );

export const updateMonthSchema = z
  .object({
    goalTitle: z
      .string()
      .max(100, "Goal title must be less than 100 characters")
      .trim()
      .optional(),
    goalDescription: z
      .string()
      .max(500, "Goal description must be less than 500 characters")
      .trim()
      .optional(),
    goalHabitId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format")
      .optional()
      .nullable(),
    goalEditedOnce: z.boolean().optional(),
    goalLocked: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export function validateSetMonthlyGoal(data) {
  return setMonthlyGoalSchema.safeParse(data);
}

export function validateGetMonthQuery(params) {
  return getMonthQuerySchema.safeParse(params);
}

export function validateCurrentMonthQuery(params) {
  return currentMonthQuerySchema.safeParse(params);
}

export function validateMonthRangeQuery(params) {
  return monthRangeQuerySchema.safeParse(params);
}

export function validateUpdateMonth(data) {
  return updateMonthSchema.safeParse(data);
}

export function canEditGoal(month) {
  if (!month) return { canEdit: true, reason: null };

  if (month.goalLocked) {
    return { canEdit: false, reason: "Goal is locked and cannot be edited" };
  }

  if (month.goalEditedOnce) {
    return { canEdit: false, reason: "Goal has already been edited once" };
  }

  return { canEdit: true, reason: null };
}
