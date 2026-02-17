import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardHeader({
  month,
  year,
  onPrev,
  onNext,
}) {
  return (
    <div className="flex items-center justify-between">
     
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onPrev}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center min-w-40">
          <h2 className="text-xl font-bold text-indigo-400">
            {month}
          </h2>
          <p className="text-sm text-gray-400">{year}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onNext}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
