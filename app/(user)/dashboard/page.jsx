"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "../../components/Dashboard/dashboardHeader";
import MonthlyGoalCard from "../../components/Dashboard/monthlyGoalCards";
import HabitsTable from "../../components/Dashboard/habitsTable";
import SummaryCard from "../../components/Dashboard/summaryCard";
import { AddHabitDialog } from "../../components/Dashboard/AddHabitDialog";
import { SetMonthlyGoalDialog } from "../../components/Dashboard/SetMonthlyGoalDialog";
import { CopyHabitsDialog } from "../../components/Dashboard/CopyHabitsDialog";
import { generateCalendarDays } from "@/lib/dashboard/calculations";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import Loader from "../../components/Home/Loader";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showCopyHabitsDialog, setShowCopyHabitsDialog] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(null);
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  const year = date.getFullYear();
  const month = date.getMonth();

  const isPastMonth = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    if (year < currentYear) return true;
    if (year === currentYear && month < currentMonth) return true;
    return false;
  };

  const isReadOnly = isPastMonth();

  useEffect(() => {
    async function checkHasSeen() {
      const res = await fetch("/api/user/check-has-seen", {
        method: "GET",
      });
      const data = await res.json();

      if (!data.hasSeenDialog) {
        setShowDialog(true);
      }
    }

    checkHasSeen();
  }, []);

  useEffect(() => {
    async function checkCopyHabits() {
      try {
        const res = await fetch("/api/user/check-copy-habits");
        if (res.ok) {
          const data = await res.json();
          if (data.shouldShow) {
            setShowCopyHabitsDialog(true);
          }
        }
      } catch (error) {
        console.error("Failed to check copy habits:", error);
      }
    }

    checkCopyHabits();
  }, []);

  const fetchData = async ({ silent, extraHabits } = {}) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?year=${year}&month=${month + 1}`);

      if (!res.ok) {
        toast.error("Something Went Wrong");
        return;
      }

      const jsonDataRaw = await res.json();
      // normalize server habits to ensure _id is string
      const jsonData = {
        ...jsonDataRaw,
        habits: Array.isArray(jsonDataRaw.habits)
          ? jsonDataRaw.habits.map((h) => ({ ...h, _id: String(h._id) }))
          : [],
      };

      // Merge server habits with any optimistic / extra habits provided
      const serverHabits = Array.isArray(jsonData.habits)
        ? [...jsonData.habits]
        : [];
      const mergedHabits = [...serverHabits];

      // extraHabits passed directly (ensures immediate merge right after POST)
      if (Array.isArray(extraHabits) && extraHabits.length) {
        extraHabits.forEach((r) => {
          if (!mergedHabits.find((h) => String(h._id) === String(r._id))) {
            mergedHabits.push(r);
          }
        });
      }

      // also merge any tracked recentlyAdded items
      (recentlyAdded || []).forEach((r) => {
        const rid = String(r._id);
        if (!mergedHabits.find((h) => String(h._id) === rid)) {
          mergedHabits.push({ ...r, _id: rid });
        }
      });

      // Drop recentlyAdded items that now appear on server
      const remainingRecent = (recentlyAdded || []).filter((r) => {
        const rid = String(r._id);
        return !serverHabits.find((h) => String(h._id) === rid);
      });
      setRecentlyAdded(remainingRecent);

      setData({ ...jsonData, habits: mergedHabits });
    } catch (error) {
      toast.error("Server Error");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const handleToggle = async (habitId, year, month, day) => {
    if (isReadOnly) {
      toast.error("Cannot edit past month data");
      return;
    }

    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    try {
      const res = await fetch("/api/habits/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, date: dateString }),
      });

      if (!res.ok) {
        toast.error("Failed to update habit");
        return;
      }

      const result = await res.json();

      setData((prevData) => {
        const logKey = `${habitId}-${day}`;
        const newHabitLogsMap = { ...prevData.habitLogsMap };

        if (result.completed === false) {
          delete newHabitLogsMap[logKey];
        } else {
          newHabitLogsMap[logKey] = true;
        }

        return {
          ...prevData,
          habitLogsMap: newHabitLogsMap,
        };
      });

      // Refresh derived data silently (use fetchData to preserve optimistic items)
      await fetchData({ silent: true });

      toast.success("Habit updated successfully");
    } catch {
      toast.error("Failed to update habit");
    }
  };

  const handleAddHabit = async (habitData) => {
    if (isReadOnly) {
      toast.error("Cannot add habits to past months");
      return;
    }
    // create optimistic habit locally with a temporary id
    const tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const optimistic = {
      _id: tempId,
      name: habitData.name,
      category: habitData.category || "",
      isGoalHabit: !!habitData.isGoalHabit,
    };

    // add optimistically
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        habits: [...(prev.habits || []), optimistic],
        monthlyGoal: optimistic.isGoalHabit
          ? {
              title: optimistic.name,
              description: prev.monthlyGoal?.description || "",
              habitId: optimistic._id,
            }
          : prev.monthlyGoal,
      };
    });

    setRecentlyAdded((s) => [...(s || []), optimistic]);

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...habitData, year, month: month + 1 }),
      });

      if (!res.ok) {
        // rollback optimistic add
        setData((prev) => ({
          ...prev,
          habits: (prev?.habits || []).filter((h) => h._id !== tempId),
        }));
        setRecentlyAdded((s) => (s || []).filter((h) => h._id !== tempId));
        toast.error("Failed to add habit");
        return;
      }

      const createdRaw = await res.json();
      const created = { ...createdRaw, _id: String(createdRaw._id) };

      // replace temporary id with real id in state
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          habits: (prev.habits || []).map((h) =>
            h._id === tempId ? created : h,
          ),
          monthlyGoal: created.isGoalHabit
            ? {
                title: created.name,
                description: prev.monthlyGoal?.description || "",
                habitId: created._id,
              }
            : prev.monthlyGoal,
        };
      });

      setRecentlyAdded((s) =>
        (s || []).map((h) => (h._id === tempId ? created : h)),
      );

      // silent refresh to sync derived data
      await fetchData({ silent: true, extraHabits: [created] });

      toast.success("Habit added successfully!");
    } catch (err) {
      // rollback optimistic add
      setData((prev) => ({
        ...prev,
        habits: (prev?.habits || []).filter((h) => h._id !== tempId),
      }));
      setRecentlyAdded((s) => (s || []).filter((h) => h._id !== tempId));
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
    } catch {
      toast.error("Failed to set goal");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
        <Loader />
      </div>
    );
  }

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

  const handleCloseThisDialogPermnently = async () => {
    try {
      setDialogLoading("dontshow");

      const res = await fetch("/api/user/check-has-seen", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        toast.error("Failed to close dialog permanently");
        return;
      }

      setShowDialog(false);
      toast.success("Will not show this notice again");
    } catch {
      toast.error("Failed to close dialog permanently");
    } finally {
      setDialogLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#1C1917] dark:text-white p-4 sm:p-6 space-y-6 pb-20 rounded-3xl">
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-[#1C1917] dark:text-white">
              Welcome to Habit Tracker!
            </h3>

            <p className="mt-2 text-sm text-[#A8A29E]">
              Start building your habits today with our simple and effective
              tracking system.
            </p>

            <Button
              disabled={dialogLoading !== null}
              className="mt-4 w-full bg-[#C08457] hover:opacity-90 rounded-xl text-white py-2 text-sm"
              onClick={() => {
                setDialogLoading("see");
                setShowDialog(false);
                router.push("/how-to-use");
              }}
            >
              {dialogLoading === "see" ? "Loading..." : "See how to use it"}
            </Button>

            <Button
              disabled={dialogLoading !== null}
              className="mt-4 w-full bg-[#C08457] hover:opacity-90 rounded-xl text-white py-2 text-sm"
              onClick={handleCloseThisDialogPermnently}
            >
              {dialogLoading === "dontshow"
                ? "Loading..."
                : "Don't show this again"}
            </Button>

            <Button
              disabled={dialogLoading !== null}
              className="mt-4 w-full bg-[#C08457] hover:opacity-90 rounded-xl text-white py-2 text-sm"
              onClick={() => {
                setDialogLoading("close");
                setShowDialog(false);
                setTimeout(() => setDialogLoading(null), 300);
              }}
            >
              {dialogLoading === "close" ? "Loading..." : "Close for now"}
            </Button>
          </div>
        </div>
      )}

      <DashboardHeader
        month={date.toLocaleString("default", { month: "long" })}
        year={year}
        onPrev={handlePrevMonth}
        onNext={() => setDate(new Date(year, month + 1))}
        subscription={data.subscription}
        onTipsUpdated={(silent) => fetchData({ silent })}
      />

      {isReadOnly && (
        <div className="bg-[#DC2626]/10 border border-[#DC2626]/40 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#DC2626]">
              Viewing Past Month (Read-Only)
            </h3>
            <p className="text-[#A8A29E] text-sm mt-1">
              This month has ended. You cannot edit or add habits for past
              months.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <h2 className="text-2xl font-bold">Your Habits</h2>

        {!isReadOnly && (
          <div className="flex gap-2">
            <SetMonthlyGoalDialog
              currentGoal={data.monthlyGoal}
              habits={data.habits}
              onSetGoal={handleSetGoal}
            />
            <AddHabitDialog onAddHabit={handleAddHabit} />
          </div>
        )}
      </div>

      <HabitsTable
        habits={data.habits}
        calendarDays={calendarDays}
        habitLogs={data.habitLogsMap || {}}
        onToggle={handleToggle}
        onUpdate={async (updated) => {
          // if updated is a function (legacy), just refetch
          if (typeof updated === "function") return fetchData();
          // updated is an updated habit object
          setData((prev) => {
            if (!prev) return prev;
            const newHabits = (prev.habits || []).map((h) =>
              String(h._id) === String(updated._id) ? { ...h, ...updated } : h,
            );
            return { ...prev, habits: newHabits };
          });
          // silently sync
          await fetchData({ silent: true });
        }}
        onDelete={async (habitId) => {
          // optimistic delete with rollback
          const prev = data.habits || [];
          setData((d) => ({
            ...d,
            habits: (d.habits || []).filter(
              (h) => String(h._id) !== String(habitId),
            ),
          }));
          setRecentlyAdded((s) =>
            (s || []).filter((h) => String(h._id) !== String(habitId)),
          );
          try {
            const res = await fetch(`/api/habits/${habitId}`, {
              method: "DELETE",
            });
            if (!res.ok) {
              setData((d) => ({ ...d, habits: prev }));
              toast.error("Failed to delete habit");
              return;
            }
            // success - refresh silently
            await fetchData({ silent: true });
            toast.success("Habit deleted");
          } catch (e) {
            setData((d) => ({ ...d, habits: prev }));
            toast.error("Failed to delete habit");
          }
        }}
        year={year}
        month={month}
        isReadOnly={isReadOnly}
      />

      <MonthlyGoalCard goal={data.monthlyGoal} />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Progress Overview</h3>

        <div className="grid grid-cols-2 gap-4">
          {(data.weeklyStats || []).map((week, index) => (
            <Card
              key={index}
              className="bg-[#E7E5E4] border border-[#A8A29E]/40"
            >
              <CardHeader>
                <CardTitle className="text-sm text-[#A8A29E]">
                  {week.label}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center space-y-3">
                <CircularProgress
                  percentage={week.percentage || 0}
                  size={90}
                  strokeWidth={8}
                  label={`${week.percentage || 0}%`}
                  sublabel={week.days}
                />
                <p className="text-xs text-[#A8A29E]">
                  {week.completed || 0} / {week.total || 0} completed
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <SummaryCard
          percentage={data.overallSummary?.percentage || 0}
          completed={data.overallSummary?.completed || 0}
          total={data.overallSummary?.total || 0}
        />
      </div>

      <CopyHabitsDialog
        open={showCopyHabitsDialog}
        onOpenChange={setShowCopyHabitsDialog}
        onCopyComplete={fetchData}
      />
    </div>
  );
}
