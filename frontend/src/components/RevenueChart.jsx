import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ✅ 1. Move CustomTooltip OUTSIDE of the RevenueChart component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1F2937] border border-[#7F92BB]/30 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 text-xs mb-2 font-bold">{label}</p>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 text-sm font-semibold"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span style={{ color: entry.color }}>
              {entry.name === "actual" ? "Actual" : "Forecast"}: RM{" "}
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const data = [
    { date: "14 Apr", actual: 2800 },
    { date: "15 Apr", actual: 2500 },
    { date: "16 Apr", actual: 2900 },
    { date: "17 Apr", actual: 4800 },
    { date: "18 Apr", actual: 4100 },
    { date: "19 Apr", actual: 4500 },
    { date: "20 Apr", actual: 4982 },
    { date: "21 Apr", actual: 3800, forecast: 3800 }, // The transition point (Today)
    { date: "22 Apr", forecast: 4200 },
    { date: "23 Apr", forecast: 4100 },
    { date: "24 Apr", forecast: 4700 },
    { date: "25 Apr", forecast: 5100 },
    { date: "26 Apr", forecast: 4800 },
    { date: "27 Apr", forecast: 5230 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#7F92BB"
          opacity={0.15}
          vertical={false}
        />

        <XAxis
          dataKey="date"
          stroke="#7F92BB"
          tick={{ fill: "#94A3B8", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#7F92BB"
          tick={{ fill: "#94A3B8", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `RM ${value / 1000}k`}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#8B5CF6", strokeWidth: 1, strokeDasharray: "4 4" }}
        />

        <ReferenceLine x="21 Apr" stroke="#A855F7" strokeOpacity={0.4} />

        <Line
          type="monotone"
          dataKey="actual"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#fff", stroke: "#3B82F6", strokeWidth: 2 }}
        />

        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#A855F7"
          strokeWidth={3}
          strokeDasharray="5 5"
          dot={{ r: 4, fill: "#A855F7", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#fff", stroke: "#A855F7", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}