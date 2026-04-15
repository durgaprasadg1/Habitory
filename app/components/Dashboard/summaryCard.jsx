import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Target } from "lucide-react";

export default function SummaryCard({ percentage, completed, total }) {
  return (
    <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-[#A8A29E] flex items-center gap-2">
          <Target className="w-4 h-4 text-[#C08457]" />
          Monthly Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <CircularProgress
          percentage={percentage}
          size={90}
          strokeWidth={8}
          label={`${percentage}%`}
          sublabel={`${completed}/${total} completed`}
        />
      </CardContent>
    </Card>
  );
}
