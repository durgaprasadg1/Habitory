import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

export default function HabitCalendar({
  habit,
  calendarDays,
  habitLogs,
  onToggle,
  year,
  month,
  isReadOnly = false,
}) {
  const [loadingDay, setLoadingDay] = useState(null);

  const handleToggle = async (habitId, date, day) => {
    setLoadingDay(day);
    try {
      await onToggle(habitId, date);
    } finally {
      setLoadingDay(null);
    }
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeks = [];
  let currentWeek = [];

  calendarDays.forEach((day, index) => {
    currentWeek.push(day);
    if ((index + 1) % 7 === 0 || index === calendarDays.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {daysOfWeek.map((dayName) => (
          <div
            key={dayName}
            className="text-center text-xs font-medium text-[#A8A29E]"
          >
            {dayName}
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1.5">
            {week.map((day, dayIndex) => (
              <div key={dayIndex} className="flex items-center justify-center">
                {day ? (
                  <button
                    onClick={() =>
                      !isReadOnly &&
                      handleToggle(habit._id, new Date(year, month, day), day)
                    }
                    disabled={isReadOnly || loadingDay === day}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 text-xs font-medium ${
                      habitLogs[`${habit._id}-${day}`]
                        ? "bg-[#C08457] border-[#C08457] text-white"
                        : "border-[#A8A29E]/60 text-[#1C1917] hover:border-[#C08457] hover:scale-105"
                    } ${
                      isReadOnly || loadingDay === day
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }`}
                  >
                    {loadingDay === day ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : habitLogs[`${habit._id}-${day}`] ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      day
                    )}
                  </button>
                ) : (
                  <div className="w-9 h-9" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
