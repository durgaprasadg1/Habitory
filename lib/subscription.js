import { getPlanConfig, normalizePlanKey } from "@/lib/plan";

function getMonthKey(date = new Date()) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

function getTipUsageCountForMonth(user, date = new Date()) {
  const { year, month } = getMonthKey(date);
  const entry = (user?.aiTipsUsage || []).find(
    (item) => item.year === year && item.month === month,
  );
  return entry?.count || 0;
}

export function isSubscriptionActive(user, date = new Date()) {
  if (!user) return false;
  if (user.planStatus !== "active") return false;
  if (!user.planEndDate) return false;
  if (new Date(user.planEndDate).getTime() < date.getTime()) return false;
  return normalizePlanKey(user.plan) !== "free";
}

export function getSubscriptionSnapshot(user, date = new Date()) {
  const planKey = normalizePlanKey(user?.plan);
  const plan = getPlanConfig(planKey);
  const usedThisMonth = getTipUsageCountForMonth(user, date);
  const canUseByStatus = isSubscriptionActive(user, date);
  const maxMonthlyTips = plan.aiTipsPerMonth;
  const remainingTips = Math.max(maxMonthlyTips - usedThisMonth, 0);
  const canUseAITips = canUseByStatus && remainingTips > 0;

  const planEndDate = user?.planEndDate ? new Date(user.planEndDate) : null;
  let daysUntilExpiry = null;

  if (planEndDate) {
    const msLeft = planEndDate.getTime() - date.getTime();
    daysUntilExpiry = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  }

  return {
    planKey,
    planName: plan.name,
    planStatus: user?.planStatus || "inactive",
    isActive: canUseByStatus,
    canUseAITips,
    maxMonthlyTips,
    usedThisMonth,
    remainingTips,
    planEndDate,
    daysUntilExpiry,
  };
}

export function incrementAITipsUsage(user, date = new Date()) {
  const { year, month } = getMonthKey(date);
  if (!Array.isArray(user.aiTipsUsage)) {
    user.aiTipsUsage = [];
  }

  const existing = user.aiTipsUsage.find(
    (entry) => entry.year === year && entry.month === month,
  );

  if (existing) {
    existing.count += 1;
    existing.lastRequestedAt = date;
    return existing.count;
  }

  user.aiTipsUsage.push({
    year,
    month,
    count: 1,
    lastRequestedAt: date,
  });
  return 1;
}
