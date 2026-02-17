import { Card, CardContent } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"

export default function SummaryCard({ percentage, completed, total }) {
  return (
    <Card className="bg-gray-900 border-gray-800">
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
  )
}
