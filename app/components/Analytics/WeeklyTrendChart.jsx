import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function WeeklyTrendChart({ weeklyStats }) {
  return (
    <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-[#1C1917] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#C08457]" />
          Weekly Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyStats}
              margin={{ top: 5, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid stroke="#A8A29E" strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                stroke="#A8A29E"
                tick={{ fill: "#A8A29E", fontSize: 11 }}
                label={{
                  value: "",
                  position: "insideBottom",
                  offset: -15,
                  fill: "#A8A29E",
                  fontSize: 12,
                }}
              />
              <YAxis
                stroke="#A8A29E"
                tick={{ fill: "#A8A29E", fontSize: 11 }}
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
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "10px", color: "#1C1917" }}
              />
              <Bar
                dataKey="completed"
                fill="#C08457"
                name="Completed"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="total"
                fill="#A8A29E"
                name="Total"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
