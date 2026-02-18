"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import OverviewCards from "@/app/components/Analytics/OverviewCards";
import HabitsChart from "@/app/components/Analytics/HabitsChart";
import CategoryChart from "@/app/components/Analytics/CategoryChart";
import DailyTrendChart from "@/app/components/Analytics/DailyTrendChart";
import WeeklyTrendChart from "@/app/components/Analytics/WeeklyTrendChart";
import Loader from "@/app/components/Home/Loader";
import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics?month=${selectedDate.month}&year=${selectedDate.year}`,
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        console.log("Failed to fetch analytics");
      }
    } catch (error) {
      console.log("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, selectedDate]);

  const handleMonthChange = (increment) => {
    setSelectedDate((prev) => {
      let newMonth = prev.month + increment;
      let newYear = prev.year;

      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }

      return { month: newMonth, year: newYear };
    });
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F5F2]">
        <Loader size={48} />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F5F2] ">
        <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40 p-6">
          <p className="text-[#A8A29E]">
            No analytics data available
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#1C1917] p-4 sm:p-6 lg:p-8 rounded-3xl">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-[#C08457]" />
              Analytics
            </h1>
            <p className="text-[#A8A29E] text-sm sm:text-base mt-1">
              Insights into your habit performance
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#E7E5E4] rounded-lg p-2 border border-[#A8A29E]/40">
            <button
              onClick={() => handleMonthChange(-1)}
              className="px-3 py-1 hover:bg-[#A8A29E]/20 rounded transition-colors"
            >
              ←
            </button>

            <div className="flex items-center gap-2 px-3">
              <Calendar className="w-4 h-4 text-[#C08457]" />
              <span className="font-medium text-sm sm:text-base">
                {monthNames[selectedDate.month - 1]} {selectedDate.year}
              </span>
            </div>

            <button
              onClick={() => handleMonthChange(1)}
              className="px-3 py-1 hover:bg-[#A8A29E]/20 rounded transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <OverviewCards
          overview={analytics.overview}
          streaks={analytics.streaks}
        />

        <DailyTrendChart dailyTrend={analytics.dailyTrend} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HabitsChart habitStats={analytics.habitStats} />
          <CategoryChart categoryStats={analytics.categoryStats} />
        </div>

        <WeeklyTrendChart weeklyStats={analytics.weeklyStats} />
      </div>
    </div>
  );
}
