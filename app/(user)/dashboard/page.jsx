"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "../../components/Dashboard/dashboardHeader";
import MonthlyGoalCard from "../../components/Dashboard/monthlyGoalCards";
import HabitsTable from "../../components/Dashboard/habitsTable";
import SummaryCard from "../../components/Dashboard/summaryCard";
import WeeklyProgress from "../../components/Dashboard/weeklyProgress";
import { AddHabitDialog } from "../../components/Dashboard/AddHabitDialog";
import { SetMonthlyGoalDialog } from "../../components/Dashboard/SetMonthlyGoalDialog";
import { generateCalendarDays } from "@/lib/dashboard/calculations";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(new Date());

  const year = date.getFullYear();
  const month = date.getMonth();

  // Check if the selected month is in the past
  const isPastMonth = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    if (year < currentYear) return true;
    if (year === currentYear && month < currentMonth) return true;
    return false;
  };

  const isReadOnly = isPastMonth();

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/dashboard?year=${year}&month=${month + 1}`);

      if (!res.ok) {
        toast.error("Something Went Wrong");
        console.log("Error in fetching habits:", res.status);
        return;
      }

      const jsonData = await res.json();
      setData(jsonData);
    } catch (error) {
      console.error("Fetch failed:", error);
      toast.error("Server Error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const handleToggle = async (habitId, date) => {
    if (isReadOnly) {
      toast.error("Cannot edit past month data");
      return;
    }

    try {
      const res = await fetch("/api/habits/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, date: date.toISOString() }),
      });

      if (!res.ok) {
        toast.error("Failed to update habit");
        return;
      }

      await fetchData();
      toast.success("Habit updated successfully");
    } catch (error) {
      console.error("Toggle failed:", error);
      toast.error("Failed to update habit");
    }
  };

  const handleAddHabit = async (habitData) => {
    if (isReadOnly) {
      toast.error("Cannot add habits to past months");
      return;
    }

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...habitData,
          year,
          month: month + 1,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to add habit");
        return;
      }

      await fetchData();
      toast.success("Habit added successfully!");
    } catch (error) {
      console.error("Add habit failed:", error);
      toast.error("Failed to add habit");
    }
  };

  const handleSetGoal = async (goalData) => {
    if (isReadOnly) {
      toast.error("Cannot set goals for past months");
      return;
    }

    try {
      const res = await fetch("/api/monthly-goal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...goalData,
          year,
          month: month + 1,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to set goal");
        return;
      }

      await fetchData();
      toast.success("Monthly goal set successfully!");
    } catch (error) {
      console.error("Set goal failed:", error);
      toast.error("Failed to set goal");
    }
  };

  if (!data) return null;

  const calendarDays = generateCalendarDays(year, month);

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    if (
      newDate.getFullYear() < currentYear ||
      (newDate.getFullYear() === currentYear &&
        newDate.getMonth() < currentMonth)
    ) {
      toast.error(
        "Cannot navigate to past months. View history for past data.",
      );
      return;
    }
    setDate(newDate);
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 space-y-4 sm:space-y-6 pb-20">
      <DashboardHeader
        month={date.toLocaleString("default", { month: "long" })}
        year={year}
        onPrev={handlePrevMonth}
        onNext={() => setDate(new Date(year, month + 1))}
      />

      {isReadOnly && (
        <div className="bg-orange-900/20 border border-orange-500/50 rounded-lg p-3 sm:p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-400 text-sm sm:text-base">
              Viewing Past Month (Read-Only)
            </h3>
            <p className="text-orange-300/80 text-xs sm:text-sm mt-1">
              This month has ended. You cannot edit or add habits for past
              months. Check the History page for detailed past month analytics.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:justify-between items-start sm:items-center">
        <h2 className="text-xl sm:text-2xl font-bold">Your Habits</h2>
        {!isReadOnly && (
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial">
              <SetMonthlyGoalDialog
                currentGoal={data.monthlyGoal}
                habits={data.habits}
                onSetGoal={handleSetGoal}
              />
            </div>
            <div className="flex-1 sm:flex-initial">
              <AddHabitDialog onAddHabit={handleAddHabit} />
            </div>
          </div>
        )}
      </div>

      <MonthlyGoalCard goal={data.monthlyGoal} />

      <div className="space-y-4">
        <SummaryCard
          percentage={data.overallSummary?.percentage || 0}
          completed={data.overallSummary?.completed || 0}
          total={data.overallSummary?.total || 0}
        />

        <WeeklyProgress weeks={data.weeklyStats || []} />
      </div>

      <HabitsTable
        habits={data.habits}
        calendarDays={calendarDays}
        habitLogs={data.habitLogsMap || {}}
        onToggle={handleToggle}
        onUpdate={fetchData}
        year={year}
        month={month}
        isReadOnly={isReadOnly}
      />
    </div>
  );
}
