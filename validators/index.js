
export * from "./habit.validators.js";
export * from "./habitLog.validators.js";
export * from "./month.validators.js";
export * from "./user.validators.js";
export * from "./analytics.validators.js";

export {
  validateCreateHabit,
  validateUpdateHabit,
  validateGetHabitsQuery,
  validateHabitId,
  validateBulkDeleteHabits,
} from "./habit.validators.js";

export {
  validateCreateHabitLog,
  validateUpdateHabitLog,
  validateBulkHabitLogs,
  validateGetHabitLogsQuery,
  validateDateRange,
  validateToggleCompletion,
} from "./habitLog.validators.js";

export {
  // Month validators
  validateSetMonthlyGoal,
  validateGetMonthQuery,
  validateCurrentMonthQuery,
  validateMonthRangeQuery,
  validateUpdateMonth,
  canEditGoal,
} from "./month.validators.js";

export {
  validateCreateUser,
  validateUpdateUser,
  validateGetUserQuery,
  validateClerkWebhookEvent,
  validateSyncUser,
  extractUserDataFromClerkEvent,
} from "./user.validators.js";

export {
  validateAnalyticsQuery,
  validateWeeklyAnalyticsQuery,
  validateMonthlyAnalyticsQuery,
  validateDailyAnalyticsQuery,
  validateCategoryAnalyticsQuery,
  validateHabitPerformanceQuery,
  validateStreakQuery,
  validateComparisonAnalyticsQuery,
  validateDashboardSummaryQuery,
  validateHistoryQuery,
} from "./analytics.validators.js";
