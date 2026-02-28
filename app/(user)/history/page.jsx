"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Loader from "@/app/components/Home/Loader";
import OverviewCards from "@/app/components/Analytics/OverviewCards";
import HabitsChart from "@/app/components/Analytics/HabitsChart";
import CategoryChart from "@/app/components/Analytics/CategoryChart";
import DailyTrendChart from "@/app/components/Analytics/DailyTrendChart";
import WeeklyTrendChart from "@/app/components/Analytics/WeeklyTrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History, Calendar, Target } from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const { user } = useUser();
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthData, setMonthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAvailableMonths();
    }
  }, [user]);

  useEffect(() => {
    if (selectedMonth) {
      console.log(
        "Selected month , selected Year:",
        selectedMonth.year,
        selectedMonth.month,
      );
      fetchMonthHistory(selectedMonth.year, selectedMonth.month);
    }
  }, [selectedMonth]);

  const fetchAvailableMonths = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/history");
      if (response.ok) {
        const data = await response.json();
        setAvailableMonths(data.availableMonths || []);
        if (data.availableMonths && data.availableMonths.length > 0) {
          setSelectedMonth(data.availableMonths[0]);
        } else {
          toast.info(
            "No history data available yet. Start tracking habits to see your history!",
          );
        }
      } else {
        toast.error("Failed to load history data");
      }
    } catch (error) {
      console.error("Error fetching months:", error);
      toast.error("Error loading history");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthHistory = async (year, month) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/history?year=${year}&month=${month}`);
      if (response.ok) {
        const data = await response.json();
        console.log("data:", data.monthData);
        if (data.monthData) {
          setMonthData(data.monthData);
        } else {
          setMonthData(null);
          toast.info("No data available for this month");
        }
      } else if (response.status === 404) {
        setMonthData(null);
        toast.error("No data found for this month");
      } else if (response.status === 403) {
        setMonthData(null);
        toast.error("Cannot access data before account creation");
      } else {
        setMonthData(null);
        toast.error("Failed to load month data");
      }
    } catch (error) {
      console.error("Error fetching month history:", error);
      setMonthData(null);
      toast.error("Error loading month data");
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading && !availableMonths.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F5F2]">
        <Loader size={48} />
      </div>
    );
  }

  if (availableMonths.length === 0) {
    return (
      <div className="min-h-screen rounded-3xl bg-[#F8F5F2] text-[#1C1917] p-4 sm:p-6 lg:p-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <History className="w-6 h-6 sm:w-8 sm:h-8 text-[#C08457]" />
              History
            </h1>
            <p className="text-[#A8A29E] text-sm sm:text-base mt-1">
              Your past month's habit tracking journey
            </p>
          </div>
          <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
            <CardContent className="py-12">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-[#A8A29E] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1C1917] mb-2">
                  No Past Month History Available
                </h3>
                <p className="text-[#A8A29E]">
                  Start tracking your habits and come back next month to see
                  your history!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-3xl bg-[#F8F5F2] text-[#1C1917] p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <History className="w-6 h-6 sm:w-8 sm:h-8 text-[#C08457]" />
                History
              </h1>
              <p className="text-[#A8A29E] text-sm sm:text-base mt-1">
                Your past month's habit tracking journey
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <Select
                value={
                  selectedMonth
                    ? `${selectedMonth.year}-${selectedMonth.month}`
                    : ""
                }
                onValueChange={(value) => {
                  const [year, month] = value.split("-");
                  setSelectedMonth({
                    year: parseInt(year),
                    month: parseInt(month),
                  });
                }}
              >
                <SelectTrigger className="w-full sm:w-auto bg-white border-[#A8A29E]/50 text-[#1C1917] focus:ring-1 focus:ring-[#C08457] focus:border-[#C08457]">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#A8A29E]/50">
                  {availableMonths.map((m, index) => (
                    <SelectItem
                      key={index}
                      value={`${m.year}-${m.month}`}
                      className="text-[#1C1917]"
                    >
                      {monthNames[m.month - 1]} {m.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading && monthData === null ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={48} />
          </div>
        ) : monthData ? (
          <div className="space-y-6">
            {/* Monthly Goal Card */}
            {monthData.monthlyGoal && (
              <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg text-[#1C1917] flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#C08457]" />
                    Monthly Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-sm text-[#1C1917]">
                    {monthData.monthlyGoal.title}
                  </h4>
                  {monthData.monthlyGoal.description && (
                    <p className="text-xs text-[#A8A29E] mt-1">
                      {monthData.monthlyGoal.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {monthData.message && monthData.totalHabits === 0 ? (
              <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
                <CardContent className="py-12">
                  <div className="text-center">
                    <Calendar className="w-16 h-16 text-[#A8A29E] mx-auto mb-4 opacity-50" />
                    <p className="text-[#A8A29E] text-lg">
                      {monthData.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <OverviewCards
                  overview={{
                    totalHabits: monthData.totalHabits,
                    totalPossible: monthData.totalPossible,
                    completed: monthData.completed,
                    percentage: monthData.percentage,
                    daysInMonth: monthData.daysInMonth,
                  }}
                  streaks={monthData.streaks || { longest: 0, current: 0 }}
                />

                {/* Daily Trend Chart */}
                <DailyTrendChart dailyTrend={monthData.dailyData || []} />

                {/* Habit Performance and Category Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <HabitsChart habitStats={monthData.habitStats || []} />
                  <CategoryChart
                    categoryStats={monthData.categoryStats || []}
                  />
                </div>

                {/* Weekly Breakdown */}
                <WeeklyTrendChart weeklyStats={monthData.weeklyStats || []} />
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
