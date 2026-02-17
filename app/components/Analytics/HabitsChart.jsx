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
  // Limit to top 10 habits for mobile view
  const displayHabits = habitStats.slice(0, 10);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-white">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="habitName"
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#F9FAFB" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
              <Bar
                dataKey="completed"
                fill="#8B5CF6"
                name="Completed"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="total"
                fill="#4B5563"
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
