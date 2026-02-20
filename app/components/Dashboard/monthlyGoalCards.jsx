import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function MonthlyGoalCard({ goal }) {
  return (
    <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-[#1C1917]">
          <Target className="w-4 h-4 text-[#C08457]" />
          Monthly Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        {goal ? (
          <>
            <h3 className="font-semibold text-[#1C1917]">
              {goal.title}
            </h3>
            <p className="text-sm text-[#A8A29E]">
              {goal.description}
            </p>
          </>
        ) : (
          <p className="text-sm text-[#A8A29E]">
            No goal set for this month.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
