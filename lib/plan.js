export const PLANS = {
  free: {
    key: "free",
    name: "Free",
    price: 0,
    aiTipsPerMonth: 0,
    durationDays: 30,
  },
  silver: {
    key: "silver",
    name: "Silver",
    price: 75,
    aiTipsPerMonth: 3,
    durationDays: 30,
  },
  gold: {
    key: "gold",
    name: "Gold",
    price: 125,
    aiTipsPerMonth: 5,
    durationDays: 30,
  },
  platinum: {
    key: "platinum",
    name: "Platinum",
    price: 199,
    aiTipsPerMonth: 10,
    durationDays: 30,
  },
};

export const PAID_PLAN_KEYS = ["silver", "gold", "platinum"];

export function normalizePlanKey(planName = "") {
  const key = String(planName).trim().toLowerCase();
  return PLANS[key] ? key : "free";
}

export function getPlanConfig(planName = "free") {
  return PLANS[normalizePlanKey(planName)] || PLANS.free;
}
