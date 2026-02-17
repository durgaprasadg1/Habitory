import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Calendar } from "lucide-react";

export default function OverviewCards({ overview, streaks }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Habits */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-xl sm:text-3xl font-bold text-white">
                {overview.totalHabits}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Total Habits</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-xl sm:text-3xl font-bold text-white">
                {overview.percentage}%
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Completion</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              <span className="text-xl sm:text-3xl font-bold text-white">
                {streaks.current}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Current Streak</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-xl sm:text-3xl font-bold text-white">
                {streaks.longest}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Best Streak</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
