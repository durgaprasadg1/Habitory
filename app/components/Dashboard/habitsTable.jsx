import { Check } from "lucide-react";
import { EditHabitDialog } from "./EditHabitDialog";

export default function HabitsTable({
  habits,
  calendarDays,
  habitLogs,
  onToggle,
  onUpdate,
  year,
  month,
  isReadOnly = false,
}) {
  const isWeekBoundary = (index) => {
    return (index + 1) % 7 === 0 && index < calendarDays.length - 1;
  };

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0  sm:px-0">
      <table className="w-full min-w-max">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 sticky left-0 bg-gray-950 z-10 text-sm sm:text-base w-50">
              Habit
            </th>
            {!isReadOnly && (
              <th className="text-center py-2 sm:py-3 px-1 sm:px-2 w-12 sm:w-16 text-xs sm:text-sm">
                Actions
              </th>
            )}
            {calendarDays.map((day, i) => (
              <th
                key={i}
                className={`text-center py-1 sm:py-2 px-1 sm:px-2 text-xs ${
                  isWeekBoundary(i) ? "border-r-2 border-indigo-600" : ""
                }`}
              >
                {day || ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit._id} className="border-b border-gray-800">
              <td className="py-2 sm:py-3 px-2 sm:px-4 sticky left-0 bg-gray-950 z-10 font-medium text-sm sm:text-base">
                <div className="max-w-30 sm:max-w-none truncate sm:whitespace-normal">
                  {habit.name}
                </div>
                {habit.category && (
                  <span className="ml-1 sm:ml-2 text-xs text-gray-500">
                    ({habit.category})
                  </span>
                )}
              </td>
              {!isReadOnly && (
                <td className="text-center py-2 sm:py-3 px-1 sm:px-2">
                  <EditHabitDialog
                    habit={habit}
                    onUpdate={onUpdate}
                    onDelete={onUpdate}
                  />
                </td>
              )}
              {calendarDays.map((day, i) => (
                <td
                  key={i}
                  className={`text-center py-1 sm:py-2 ${
                    isWeekBoundary(i) ? "border-r-2 border-indigo-600" : ""
                  }`}
                >
                  {day && (
                    <button
                      onClick={() =>
                        !isReadOnly &&
                        onToggle(habit._id, new Date(year, month, day))
                      }
                      disabled={isReadOnly}
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded border flex items-center justify-center transition-colors ${
                        habitLogs[`${habit._id}-${day}`]
                          ? "bg-indigo-600 border-indigo-500"
                          : "border-gray-700 hover:border-gray-500"
                      } ${
                        isReadOnly
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                    >
                      {habitLogs[`${habit._id}-${day}`] && (
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white gap-2" />
                      )}
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
