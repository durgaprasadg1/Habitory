import { useState } from "react";
import { Check, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { EditHabitDialog } from "./EditHabitDialog";
import HabitCalendar from "./HabitCalendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HabitsTable({
  habits,
  calendarDays,
  habitLogs,
  onToggle,
  onUpdate,
  onDelete,
  year,
  month,
  isReadOnly = false,
}) {
  const [expandedHabits, setExpandedHabits] = useState(new Set());

  const toggleHabitCalendar = (habitId) => {
    setExpandedHabits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(habitId)) {
        newSet.delete(habitId);
      } else {
        newSet.add(habitId);
      }
      return newSet;
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {habits.map((habit) => {
        const idStr = String(habit._id);
        const isExpanded = expandedHabits.has(idStr);

        return (
          <div
            key={idStr}
            className="bg-[#E7E5E4] border border-[#A8A29E]/40 overflow-hidden rounded-sm p-3"
          >
            <CardHeader className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1C1917] text-sm">
                    {habit.name}
                  </h3>
                  {habit.category && (
                    <span className="text-xs text-[#A8A29E] block">
                      {habit.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleHabitCalendar(habit._id)}
                    className="h-8 w-8 p-0 text-[#C08457] hover:bg-[#C08457]/10"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                  </Button>

                  {!isReadOnly && (
                    <EditHabitDialog
                      habit={{ ...habit, _id: idStr }}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  )}
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="py-3 px-0">
                <HabitCalendar
                  habit={habit}
                  calendarDays={calendarDays}
                  habitLogs={habitLogs}
                  onToggle={onToggle}
                  year={year}
                  month={month}
                  isReadOnly={isReadOnly}
                />
              </CardContent>
            )}
          </div>
        );
      })}
    </div>
  );
}
