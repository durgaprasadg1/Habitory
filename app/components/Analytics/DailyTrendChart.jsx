import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function DailyTrendChart({ dailyTrend }) {
  return (
    <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-[#1C1917]">
          Daily Completion Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dailyTrend}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C08457" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C08457" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#A8A29E" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                stroke="#A8A29E"
                tick={{ fill: "#A8A29E", fontSize: 11 }}
                label={{
                  value: "Day of Month",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#A8A29E",
                  fontSize: 12,
                }}
              />
              <YAxis
                stroke="#A8A29E"
                tick={{ fill: "#A8A29E", fontSize: 11 }}
                label={{
                  value: "Completion %",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#A8A29E",
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#E7E5E4",
                  border: "1px solid #A8A29E",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#1C1917" }}
              />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#C08457"
                fillOpacity={1}
                fill="url(#colorPercentage)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
