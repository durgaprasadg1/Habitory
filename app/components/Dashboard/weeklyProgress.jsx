import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";

export default function WeeklyProgress({ weeks }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[#1C1917]">Weekly Progress</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {weeks.map((week, index) => (
          <Card
            key={index}
            className="bg-[#E7E5E4] border border-[#A8A29E]/40 hover:shadow-sm transition-shadow"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#A8A29E]">
                {week.label}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center space-y-3">
              <CircularProgress
                percentage={week.percentage || 0}
                size={90}
                strokeWidth={8}
                label={`${week.percentage || 0}%`}
                sublabel={week.days}
              />

              <p className="text-xs text-[#A8A29E]">
                {week.completed || 0} / {week.total || 0} completed
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
