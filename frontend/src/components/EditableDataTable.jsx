// frontend/src/components/EditableDataTable.jsx
import { useState, useEffect } from "react";

const CATEGORIES = [
  "Fashion", "Electronics", "Beauty", "Home Living",
  "Sports", "Food & Beverage", "Health", "General",
];

// FIXED: Defined outside of the render function to prevent re-creation/cascading renders
const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field) return <span className="opacity-30"> ↕</span>;
  return sortDir === "asc" ? " ↑" : " ↓";
};

export default function EditableDataTable() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    fetch("http://localhost:5000/api/data/table")
      .then((res) => res.json())
      .then((firestoreData) => {
        const uploadedRaw = sessionStorage.getItem("uploadedItems");
        const uploadedItems = uploadedRaw ? JSON.parse(uploadedRaw) : [];

        const uploadedRows = uploadedItems.map((item, idx) => ({
          id: `upload_${Date.now()}_${idx}`,
          item: item.name || "Unknown Item",
          category: item.category || "General",
          unitPrice: parseFloat(item.price) || 0,
          totalSales: parseInt(item.quantity) || 0,
          source: "Uploaded",
          confidence: item.confidence || 75,
          status: "Review Needed",
          isUploaded: true,
        }));

        const firestoreMap = {};
        firestoreData.forEach((row) => {
          firestoreMap[row.item?.toLowerCase()] = row;
        });

        const mergedUploads = uploadedRows.filter((ur) => {
          const key = ur.item.toLowerCase();
          if (firestoreMap[key]) {
            firestoreMap[key].unitPrice = ur.unitPrice || firestoreMap[key].unitPrice;
            firestoreMap[key].confidence = Math.max(
              firestoreMap[key].confidence,
              ur.confidence
            );
            firestoreMap[key].source = "Receipt/History + Upload";
            return false;
          }
          return true;
        });

        const finalData = [...Object.values(firestoreMap), ...mergedUploads];
        setTableData(finalData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load table data:", err);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id, field, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const saveRow = async (id) => {
    const row = tableData.find((r) => r.id === id);
    setSavingId(id);
    try {
      await fetch("http://localhost:5000/api/data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          price: row.unitPrice,
          category: row.category,
          item: row.item,
          quantity: row.totalSales,
        }),
      });
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSavingId(null);
    }
  };

  const deleteRow = (id) => {
    setTableData((prev) => prev.filter((r) => r.id !== id));
  };

  const filteredData = tableData
    .filter((row) => {
      if (filter !== "All" && row.category !== filter) return false;
      if (
        search &&
        !row.item?.toLowerCase().includes(search.toLowerCase()) &&
        !row.category?.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center text-slate-500 animate-pulse">
        Syncing Unified Workspace...
      </div>
    );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0B1220] border border-[#7F92BB]/30 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#3B82F6] w-48"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#0B1220] border border-[#7F92BB]/30 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#3B82F6]"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <span className="text-slate-400 text-sm ml-auto">
          {filteredData.length} record{filteredData.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="bg-[#1F2937]/50 rounded-xl border border-[#7F92BB]/20 shadow-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-wider bg-[#0B1220]/50">
                <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => toggleSort("item")}>
                  Item <SortIcon field="item" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => toggleSort("category")}>
                  Category <SortIcon field="category" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => toggleSort("totalSales")}>
                  Quantity <SortIcon field="totalSales" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-white" onClick={() => toggleSort("unitPrice")}>
                  Unit Price (RM) <SortIcon field="unitPrice" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => toggleSort("totalSales")}>
                  Total (RM) <SortIcon field="totalSales" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => toggleSort("confidence")}>
                  Confidence <SortIcon field="confidence" sortField={sortField} sortDir={sortDir} />
                </th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 italic">
                    No records match your search or filter.
                  </td>
                </tr>
              )}
              {filteredData.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-[#7F92BB]/10 hover:bg-white/5 transition-colors ${
                    row.isUploaded ? "bg-[#4F46E5]/5" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={row.item}
                      onChange={(e) => handleEdit(row.id, "item", e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-[#7F92BB]/30 focus:border-[#3B82F6] text-white font-medium outline-none w-full transition-colors"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={row.category}
                      onChange={(e) => handleEdit(row.id, "category", e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-[#7F92BB]/30 focus:border-[#3B82F6] text-slate-400 outline-none cursor-pointer transition-colors"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#1F2937]">{c}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      value={row.totalSales}
                      onChange={(e) =>
                        handleEdit(row.id, "totalSales", parseInt(e.target.value) || 0)
                      }
                      className="bg-[#0B1220] border border-[#7F92BB]/30 rounded px-2 py-1 w-16 text-white text-center outline-none focus:border-[#3B82F6]"
                    />
                    <span className="text-slate-400 ml-1 text-xs">units</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.unitPrice}
                      onChange={(e) =>
                        handleEdit(row.id, "unitPrice", parseFloat(e.target.value) || 0)
                      }
                      className="bg-[#0B1220] border border-[#7F92BB]/30 rounded px-2 py-1 w-24 text-white text-center outline-none focus:border-[#3B82F6]"
                    />
                  </td>
                  <td className="px-6 py-4 text-white font-mono">
                    {(row.unitPrice * row.totalSales).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {row.isUploaded ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#4F46E5]/20 text-[#818CF8] font-semibold">
                        Uploaded
                      </span>
                    ) : (
                      row.source
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        row.confidence > 80
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {row.confidence}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => saveRow(row.id)}
                      disabled={savingId === row.id}
                      className={`text-xs font-bold transition-colors ${
                        savedId === row.id
                          ? "text-green-400"
                          : "text-[#3B82F6] hover:brightness-125"
                      }`}
                    >
                      {savingId === row.id
                        ? "SAVING..."
                        : savedId === row.id
                        ? "✓ SAVED"
                        : "SAVE"}
                    </button>
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="text-xs font-bold text-red-400 hover:brightness-125 transition-colors"
                    >
                      DEL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}