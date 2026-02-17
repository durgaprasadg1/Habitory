import { z } from "zod";
export const habitLogSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  habitId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format"),
  date: z.coerce.date(),
  completed: z.boolean().default(false),
});

export const createHabitLogSchema = z.object({
  habitId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format"),
  date: z
    .string()
    .datetime({
      offset: true,
      message: "Invalid date format. Use ISO 8601 format",
    })
    .or(z.coerce.date())
    .transform((val) => new Date(val)),
  completed: z.boolean().default(false),
});

export const updateHabitLogSchema = z.object({
  completed: z.boolean(),
  date: z
    .string()
    .datetime({ offset: true, message: "Invalid date format" })
    .or(z.coerce.date())
    .transform((val) => new Date(val))
    .optional(),
});

export const bulkHabitLogSchema = z.object({
  logs: z
    .array(
      z.object({
        habitId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format"),
        date: z
          .string()
          .datetime({ offset: true })
          .or(z.coerce.date())
          .transform((val) => new Date(val)),
        completed: z.boolean(),
      }),
    )
    .min(1, "At least one log entry is required"),
});

export const getHabitLogsQuerySchema = z
  .object({
    userId: z.string().min(1, "User ID is required").optional(),
    habitId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format")
      .optional(),
    startDate: z
      .string()
      .datetime({ offset: true })
      .or(z.coerce.date())
      .transform((val) => new Date(val))
      .optional(),
    endDate: z
      .string()
      .datetime({ offset: true })
      .or(z.coerce.date())
      .transform((val) => new Date(val))
      .optional(),
    completed: z.enum(["true", "false"]).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    { message: "Start date must be before or equal to end date" },
  );

export const dateRangeQuerySchema = z
  .object({
    startDate: z
      .string()
      .datetime({ offset: true })
      .or(z.coerce.date())
      .transform((val) => new Date(val)),
    endDate: z
      .string()
      .datetime({ offset: true })
      .or(z.coerce.date())
      .transform((val) => new Date(val)),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Start date must be before or equal to end date",
  });

export const toggleHabitCompletionSchema = z.object({
  habitId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format"),
  date: z
    .string()
    .datetime({ offset: true })
    .or(z.coerce.date())
    .transform((val) => new Date(val))
    .optional()
    .default(() => new Date()),
});

export function validateCreateHabitLog(data) {
  return createHabitLogSchema.safeParse(data);
}
export function validateUpdateHabitLog(data) {
  return updateHabitLogSchema.safeParse(data);
}

export function validateBulkHabitLogs(data) {
  return bulkHabitLogSchema.safeParse(data);
}

export function validateGetHabitLogsQuery(params) {
  return getHabitLogsQuerySchema.safeParse(params);
}

export function validateDateRange(data) {
  return dateRangeQuerySchema.safeParse(data);
}

export function validateToggleCompletion(data) {
  return toggleHabitCompletionSchema.safeParse(data);
}
