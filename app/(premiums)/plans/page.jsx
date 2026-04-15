"use client";

import PricingCard from "../../components/Plans/Plannning";
const plans = [
  {
    key: "silver",
    name: "Silver",
    price: 75,
    tips: "",
    features: [
      "3 AI tips ",
      "AI Monthly Habit Summary",
      "Basic Personalized Suggestions",
      "Expense Pattern Insights",
      "Email Support",
    ],
  },
  {
    key: "gold",
    name: "Gold",
    price: 125,
    tips: "",
    features: [
      "5 AI tips ",
      "AI Monthly Habit Summary",
      "Advanced Personalized Suggestions",
      "Advanced Progress Analytics",
      "Expense Trend Prediction",
      "Priority Support",
    ],
    recommended: true,
  },
  {
    key: "platinum",
    name: "Platinum",
    price: 199,
    tips: "",
    features: [
      "10 AI tips ",
      "AI Monthly Habit Summary",
      "Premium Financial Suggestions",
      "Advanced Progress Analytics",
      "Expense Trend Prediction",
      "Smart Budget Optimization",
      "Priority Support",
    ],
  },
];

export default function Planning() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#C08457]">Choose Your Plan</h2>
        <p className="text-gray-500 mt-2">
          Upgrade your habit intelligence with AI powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  );
}
