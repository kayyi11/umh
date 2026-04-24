//frontend/src/components/RevenueChart.jsx

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from "recharts";

// ✅ Move this outside
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
              {entry.name === "actual" ? "Actual" : "Forecast"}: RM {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data, transitionDate, type = "line" }) {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-slate-500">No data found in Firestore.</div>;
  }

  // ✅ Time Series View (Line Chart)
  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#7F92BB" opacity={0.15} vertical={false} />
          <XAxis dataKey="date" stroke="#7F92BB" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} dy={10} />
          <YAxis stroke="#7F92BB" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickFormatter={(v) => `RM ${v / 1000}k`} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={transitionDate} stroke="#A855F7" strokeOpacity={0.4} />
          <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="forecast" stroke="#A855F7" strokeWidth={3} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // ✅ Categorical View (Bar Chart) - e.g. for Platforms/Categories
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#7F92BB" opacity={0.1} vertical={false} />
        <XAxis dataKey="name" stroke="#7F92BB" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} />
        <YAxis stroke="#7F92BB" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} />
        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1F2937', borderRadius: '12px', border: 'none'}} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8B5CF6" : "#3B82F6"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}