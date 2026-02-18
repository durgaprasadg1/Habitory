import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp,  Target, Check, ChartSpline } from "lucide-react";

export default function OverviewCards({ overview, streaks }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#C08457]" />
              <span className="text-xl sm:text-3xl font-bold text-[#1C1917]">
                {overview.totalHabits}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A8A29E]">
              Total Habits
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#C08457]"  />
            
              <span className="text-xl sm:text-3xl font-bold text-[#1C1917]">
                {overview.percentage}%
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A8A29E]">
              Completion
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <ChartSpline className="w-4 h-4 sm:w-5 sm:h-5 text-[#C08457]" />
              <span className="text-xl sm:text-3xl font-bold text-[#1C1917]">
                {streaks.current}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A8A29E]">
              Current Streak
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#C08457]" />
              <span className="text-xl sm:text-3xl font-bold text-[#1C1917]">
                {streaks.longest}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A8A29E]">
              Best Streak
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
