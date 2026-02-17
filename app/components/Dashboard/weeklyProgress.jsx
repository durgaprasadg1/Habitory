import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";

export default function WeeklyProgress({ weeks }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-white">Weekly Progress</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {weeks.map((week, index) => (
          <Card key={index} className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">
                {week.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-2">
              <CircularProgress
                percentage={week.percentage || 0}
                size={90}
                strokeWidth={8}
                label={`${week.percentage || 0}%`}
                sublabel={week.days}
              />
              <p className="text-xs text-gray-400 ">
                {week.completed || 0} / {week.total || 0} completed
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
