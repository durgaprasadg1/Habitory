import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";

export default function SummaryCard({ percentage, completed, total }) {
  return (
    <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
      <CardContent className="pt-6 flex justify-center">
        <CircularProgress
          percentage={percentage}
          size={90}
          strokeWidth={8}
          label="SUMMARY"
          sublabel={`${completed}/${total}`}
        />
      </CardContent>
    </Card>
  );
}
