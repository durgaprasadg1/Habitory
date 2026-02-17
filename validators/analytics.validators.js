import { z } from "zod";


export const analyticsQuerySchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
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

export const weeklyAnalyticsQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  weekOffset: z.coerce
    .number()
    .int("Week offset must be an integer")
    .min(-52, "Week offset cannot be less than -52")
    .max(0, "Week offset cannot be positive")
    .default(0)
    .optional(),
});

export const monthlyAnalyticsQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  year: z.coerce
    .number()
    .int("Year must be an integer")
    .min(2020, "Year must be 2020 or later")
    .max(2100, "Year must be 2100 or earlier"),
  month: z.coerce
    .number()
    .int("Month must be an integer")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
});

export const dailyAnalyticsQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  date: z
    .string()
    .datetime({ offset: true })
    .or(z.coerce.date())
    .transform((val) => new Date(val))
    .optional()
    .default(() => new Date()),
});

export const categoryAnalyticsQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  category: z.string().optional(),
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
});

export const habitPerformanceQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  habitId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format")
    .optional(),
  period: z.enum(["week", "month", "year", "all"]).default("month"),
});

export const streakQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  habitId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format"),
});

export const comparisonAnalyticsQuerySchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    period1Start: z
      .string()
      .datetime({ offset: true })
      .or(z.coerce.date())
      .transform((val) => new Date(val)),
    period1End: z
      .string()
      .datetime({ offset: true })
      .or(z.coerce.date())
      .transform((val) => new Date(val)),
    period2Start: z
      .string()
      .datetime({ offset: true })
      .or(z.coerce.date())
      .transform((val) => new Date(val)),
    period2End: z
      .string()
      .datetime({ offset: true })
      .or(z.coerce.date())
      .transform((val) => new Date(val)),
  })
  .refine(
    (data) =>
      data.period1Start <= data.period1End &&
      data.period2Start <= data.period2End,
    {
      message:
        "Each period's start date must be before or equal to its end date",
    },
  );

export const dashboardSummaryQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  includeWeekly: z.enum(["true", "false"]).optional().default("true"),
  includeMonthly: z.enum(["true", "false"]).optional().default("true"),
  includeCategories: z.enum(["true", "false"]).optional().default("true"),
});

export const historyQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .default(1)
    .optional(),
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(30)
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
  habitId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID format")
    .optional(),
});

export function validateAnalyticsQuery(params) {
  return analyticsQuerySchema.safeParse(params);
}

export function validateWeeklyAnalyticsQuery(params) {
  return weeklyAnalyticsQuerySchema.safeParse(params);
}
export function validateMonthlyAnalyticsQuery(params) {
  return monthlyAnalyticsQuerySchema.safeParse(params);
}

export function validateDailyAnalyticsQuery(params) {
  return dailyAnalyticsQuerySchema.safeParse(params);
}

export function validateCategoryAnalyticsQuery(params) {
  return categoryAnalyticsQuerySchema.safeParse(params);
}

export function validateHabitPerformanceQuery(params) {
  return habitPerformanceQuerySchema.safeParse(params);
}

export function validateStreakQuery(params) {
  return streakQuerySchema.safeParse(params);
}


export function validateComparisonAnalyticsQuery(params) {
  return comparisonAnalyticsQuerySchema.safeParse(params);
}


export function validateDashboardSummaryQuery(params) {
  return dashboardSummaryQuerySchema.safeParse(params);
}

export function validateHistoryQuery(params) {
  return historyQuerySchema.safeParse(params);
}
