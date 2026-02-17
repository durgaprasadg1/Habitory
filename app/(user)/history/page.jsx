"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Loader from "@/app/components/Home/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  History,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

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
        }
      } else {
        console.error("Failed to fetch available months");
      }
    } catch (error) {
      console.error("Error fetching available months:", error);
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
        setMonthData(data.monthData);
      } else {
        console.error("Failed to fetch month history");
      }
    } catch (error) {
      console.error("Error fetching month history:", error);
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader size={48} />
      </div>
    );
  }

  if (availableMonths.length === 0) {
    return (
      <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <History className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              History
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-1">
              Your past month's habit tracking journey
            </p>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="py-12">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Past Month History Available
                </h3>
                <p className="text-gray-500">
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
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header with Month Selector */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <History className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                History
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mt-1">
                Your past month's habit tracking journey
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={
                  selectedMonth
                    ? `${selectedMonth.year}-${selectedMonth.month}`
                    : ""
                }
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-");
                  setSelectedMonth({
                    year: parseInt(year),
                    month: parseInt(month),
                  });
                }}
                className="w-full sm:w-auto bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {availableMonths.map((m, index) => (
                  <option key={index} value={`${m.year}-${m.month}`}>
                    {monthNames[m.month - 1]} {m.year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Month Data Display */}
        {loading && monthData === null ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={48} />
          </div>
        ) : monthData ? (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    {monthNames[monthData.month - 1]} {monthData.year}
                  </CardTitle>
                  <div className="flex gap-3 sm:gap-4">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white">
                        {monthData.percentage}%
                      </div>
                      <div className="text-xs text-gray-400">Completion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                        {monthData.totalHabits}
                      </div>
                      <div className="text-xs text-gray-400">Habits</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl sm:text-3xl font-bold ${monthData.percentage >= 50 ? "text-green-400" : "text-orange-400"}`}
                      >
                        {monthData.percentage >= 50 ? (
                          <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
                        ) : (
                          <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7" />
                        )}
                      </div>
                      <div className="text-xs text-gray-400">Trend</div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Monthly Goal if exists */}
                {monthData.monthlyGoal && (
                  <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-white">
                          {monthData.monthlyGoal.title}
                        </h4>
                        {monthData.monthlyGoal.description && (
                          <p className="text-xs text-gray-400 mt-1">
                            {monthData.monthlyGoal.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Productivity Line Chart */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Daily Productivity Trend
                  </h4>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthData.dailyData}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient
                            id="gradient-history"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8B5CF6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8B5CF6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="day"
                          stroke="#9CA3AF"
                          tick={{ fill: "#9CA3AF", fontSize: 10 }}
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          tick={{ fill: "#9CA3AF", fontSize: 10 }}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                          labelStyle={{ color: "#F9FAFB" }}
                          formatter={(value, name) => {
                            if (name === "percentage")
                              return [`${value}%`, "Completion"];
                            return [value, name];
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="percentage"
                          stroke="#8B5CF6"
                          fillOpacity={1}
                          fill="url(#gradient-history)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400">Completed</div>
                    <div className="text-lg sm:text-xl font-bold text-green-400">
                      {monthData.completed}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400">Total Possible</div>
                    <div className="text-lg sm:text-xl font-bold text-gray-300">
                      {monthData.totalPossible}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 col-span-2 sm:col-span-1">
                    <div className="text-xs text-gray-400">Days in Month</div>
                    <div className="text-lg sm:text-xl font-bold text-purple-400">
                      {monthData.daysInMonth}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
