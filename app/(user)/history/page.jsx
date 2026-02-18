"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Loader from "@/app/components/Home/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  History,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
} from "lucide-react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
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
      }
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
      }
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
            <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle className="text-lg sm:text-xl text-[#1C1917] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#C08457]" />
                    {monthNames[monthData.month - 1]} {monthData.year}
                  </CardTitle>
                  <div className="flex gap-3 sm:gap-4">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
                        {monthData.percentage}%
                      </div>
                      <div className="text-xs text-[#A8A29E]">Completion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-[#C08457]">
                        {monthData.totalHabits}
                      </div>
                      <div className="text-xs text-[#A8A29E]">Habits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-[#C08457]">
                        {monthData.percentage >= 50 ? (
                          <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
                        ) : (
                          <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7" />
                        )}
                      </div>
                      <div className="text-xs text-[#A8A29E]">Trend</div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {monthData.monthlyGoal && (
                  <div className="mb-4 p-3 bg-[#F8F5F2] rounded-lg border border-[#A8A29E]/40">
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-[#C08457] mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm text-[#1C1917]">
                          {monthData.monthlyGoal.title}
                        </h4>
                        {monthData.monthlyGoal.description && (
                          <p className="text-xs text-[#A8A29E] mt-1">
                            {monthData.monthlyGoal.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-[#A8A29E] mb-3">
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
                              stopColor="#C08457"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="#C08457"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#A8A29E" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="day"
                          stroke="#A8A29E"
                          tick={{ fill: "#A8A29E", fontSize: 10 }}
                        />
                        <YAxis
                          stroke="#A8A29E"
                          tick={{ fill: "#A8A29E", fontSize: 10 }}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#E7E5E4",
                            border: "1px solid #A8A29E",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                          labelStyle={{ color: "#1C1917" }}
                          formatter={(value, name) => {
                            if (name === "percentage")
                              return [`${value}%`, "Completion"];
                            return [value, name];
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="percentage"
                          stroke="#C08457"
                          fillOpacity={1}
                          fill="url(#gradient-history)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-[#F8F5F2] rounded-lg p-3 border border-[#A8A29E]/40">
                    <div className="text-xs text-[#A8A29E]">Completed</div>
                    <div className="text-lg sm:text-xl font-bold text-[#C08457]">
                      {monthData.completed}
                    </div>
                  </div>
                  <div className="bg-[#F8F5F2] rounded-lg p-3 border border-[#A8A29E]/40">
                    <div className="text-xs text-[#A8A29E]">Total Possible</div>
                    <div className="text-lg sm:text-xl font-bold text-[#1C1917]">
                      {monthData.totalPossible}
                    </div>
                  </div>
                  <div className="bg-[#F8F5F2] rounded-lg p-3 border border-[#A8A29E]/40 col-span-2 sm:col-span-1">
                    <div className="text-xs text-[#A8A29E]">Days in Month</div>
                    <div className="text-lg sm:text-xl font-bold text-[#C08457]">
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
