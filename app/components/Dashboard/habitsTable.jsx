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
    <div className="overflow-x-auto -mx-4 sm:mx-0 sm:px-0 rounded-xl border border-[#A8A29E]/30 bg-[#E7E5E4]">
      <table className="w-full min-w-max text-[#1C1917]">
        <thead>
          <tr className="border-b border-[#A8A29E]/40 bg-[#F8F5F2]">
            <th className="text-left py-3 px-4 sticky left-0 bg-[#F8F5F2] z-10 text-sm font-semibold min-w-[160px]">
              Habit
            </th>

            {!isReadOnly && (
              <th className="text-center py-3 px-2 w-16 text-xs font-semibold">
                Actions
              </th>
            )}

            {calendarDays.map((day, i) => (
              <th
                key={i}
                className={`text-center py-2 px-2 text-xs font-medium ${
                  isWeekBoundary(i)
                    ? "border-r-2 border-[#C08457]/40"
                    : ""
                }`}
              >
                {day || ""}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {habits.map((habit) => (
            <tr
              key={habit._id}
              className="border-b border-[#A8A29E]/30 hover:bg-[#F8F5F2] transition-colors"
            >
              <td className="py-3 px-4 sticky left-0 bg-[#E7E5E4] z-10 font-medium text-sm">
                <div className="truncate sm:whitespace-normal">
                  {habit.name}
                </div>
                {habit.category && (
                  <span className="ml-1 text-xs text-[#A8A29E]">
                    ({habit.category})
                  </span>
                )}
              </td>

              {!isReadOnly && (
                <td className="text-center py-3 px-2">
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
                  className={`text-center py-2 ${
                    isWeekBoundary(i)
                      ? "border-r-2 border-[#C08457]/40"
                      : ""
                  }`}
                >
                  {day && (
                    <button
                      onClick={() =>
                        !isReadOnly &&
                        onToggle(habit._id, new Date(year, month, day))
                      }
                      disabled={isReadOnly}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150 ${
                        habitLogs[`${habit._id}-${day}`]
                          ? "bg-[#C08457] border-[#C08457]"
                          : "border-[#A8A29E]/60 hover:border-[#C08457]"
                      } ${
                        isReadOnly
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                    >
                      {habitLogs[`${habit._id}-${day}`] && (
                        <Check className="w-3 h-3 text-white" />
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
