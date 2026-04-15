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

export default function HabitsChart({ habitStats }) {
  const displayHabits = habitStats.slice(0, 10);

  return (
    <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-[#1C1917]">
          Habit Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayHabits}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid stroke="#A8A29E" strokeDasharray="3 3" />
              <XAxis
                dataKey="habitName"
                stroke="#A8A29E"
                tick={{ fill: "#A8A29E", fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
                wrapperStyle={{ fontSize: "12px", color: "#1C1917" }}
                iconType="circle"
              />
              <Bar
                dataKey="completed"
                fill="#C08457"
                name="Completed"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="total"
                fill="#A8A29E"
                name="Total Days"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
