import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({ month, year, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center  ">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          className="text-[#1C1917] hover:bg-[#E7E5E4]"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center min-w-40">
          <h2 className="text-xl font-bold text-[#C08457]">
            {month} {"  "}{year}
          </h2>
         
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="text-[#1C1917] hover:bg-[#E7E5E4]"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
