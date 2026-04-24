//frontend/src/components/DataStats.jsx

import { useState, useEffect } from "react";

export default function DataStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/data/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-20 flex items-center justify-center text-slate-500">Updating statistics...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-[#1F2937] p-6 rounded-xl border border-[#7F92BB]/40 shadow-lg hover:border-[#3B82F6]/50 transition-all cursor-pointer group">
          <h3 className="text-slate-200 font-bold mb-8">{stat.title}</h3>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold text-white">{stat.records}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Records</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.confidence}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Confidence</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}