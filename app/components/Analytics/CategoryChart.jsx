import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = [
  "#C08457",
  "#A8A29E",
  "#1C1917",
  "#DC2626",
  "#C08457",
  "#A8A29E",
];

export default function CategoryChart({ categoryStats }) {
  const data = categoryStats.map((cat) => ({
    name: cat.category,
    value: cat.completed,
    percentage: cat.percentage,
  }));

  return (
    <Card className="bg-[#E7E5E4] border border-[#A8A29E]/40">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-[#1C1917]">
          Category Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
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
                wrapperStyle={{ fontSize: "11px", color: "#1C1917" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
