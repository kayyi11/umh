//frontend/src/components/EditableDataTable.jsx

import { useState, useEffect } from "react";

export default function EditableDataTable() {
  const [data, setData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/data/table")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  const handlePriceChange = (id, val) => {
    setData(prev => prev.map(row => row.id === id ? { ...row, price: val } : row));
  };

  const handleSave = async (id, price) => {
    setIsSaving(true);
    try {
      await fetch("http://localhost:5000/api/data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price }),
      });
      alert("Database updated!");
    } finally { setIsSaving(false); }
  };

  if (loading) return <div className="p-10 text-slate-500 animate-pulse">Fetching records...</div>;

  return (
    <div className="bg-[#1F2937] rounded-xl border border-[#7F92BB]/40 shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="text-slate-400 text-xs uppercase bg-[#0B1220]/30">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Unit Price (RM)</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((row) => (
              <tr key={row.id} className="border-b border-[#7F92BB]/10 hover:bg-white/5">
                <td className="px-6 py-4 text-white font-medium">{row.item}</td>
                <td className="px-6 py-4 text-slate-400">{row.cat}</td>
                <td className="px-6 py-4 text-center">
                  <input 
                    type="number" 
                    value={row.price} 
                    onChange={(e) => handlePriceChange(row.id, e.target.value)}
                    className="bg-[#0B1220] border border-[#7F92BB]/30 rounded px-2 py-1 w-20 text-white text-center outline-none"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleSave(row.id, row.price)}
                    className="text-[#3B82F6] text-xs font-bold hover:underline"
                  >
                    {isSaving ? "..." : "SAVE"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}