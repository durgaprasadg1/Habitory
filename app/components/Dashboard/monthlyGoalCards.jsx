import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

export default function MonthlyGoalCard({ goal }) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="w-4 h-4 text-indigo-400" />
         <p className="text-white">Monthly Goal</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {goal ? (
          <>
            <h3 className="font-semibold text-white">{goal.title}</h3>
            <p className="text-sm text-gray-400">
              {goal.description}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">
            No goal set for this month.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
