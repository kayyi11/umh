// frontend/src/components/ExtractionSummary.jsx
export default function ExtractionSummary({ data, extractedItems }) {
  const stats = [
    {
      label: "Items Detected",
      value: data?.itemsDetected ?? 0,
      color: "text-white",
    },
    {
      label: "High Confidence",
      value: data?.highConfidence ?? 0,
      color: "text-[#10B981]",
    },
    {
      label: "Low Confidence",
      value: data?.lowConfidence ?? 0,
      color: "text-red-500",
    },
    {
      label: "Overall Accuracy",
      value: data ? `${data.overallAccuracy}%` : "0%",
      color: data?.overallAccuracy > 0 ? "text-[#10B981]" : "text-red-500",
    },
  ];

  return (
    <div className="bg-[#1F2937] p-8 rounded-xl border border-[#7F92BB]/40 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">Extraction Summary</h2>

      {/* Stats row */}
      <div className="flex items-center justify-between divide-x divide-[#7F92BB]/20">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center flex-1 px-4">
            <span className={`text-[32px] font-bold leading-none mb-2 ${stat.color}`}>
              {stat.value}
            </span>
            <span className="text-xs text-slate-400 text-center uppercase tracking-tight">
              {stat.label.split(" ").map((word, idx) => (
                <span key={idx}>
                  {word}
                  <br />
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>

      {/* Error state: extraction ran but found 0 items */}
      {data && data.itemsDetected === 0 && (
        <div className="mt-6 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs">
          ⚠️ No items were detected in the uploaded file. Try a clearer receipt image or a text-based PDF invoice.
        </div>
      )}

      {/* Extracted items list */}
      {extractedItems && extractedItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Extracted Items
          </h3>
          <div className="overflow-x-auto rounded-lg border border-[#7F92BB]/20">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 text-[11px] uppercase tracking-wider bg-[#0B1220]/50">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Price (RM)</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-center">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {extractedItems.map((item, i) => (
                  <tr
                    key={i}
                    className="border-t border-[#7F92BB]/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-slate-400">{item.category}</td>
                    <td className="px-4 py-3 text-white text-right font-mono">
                      {parseFloat(item.price || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-center">
                      {item.quantity ?? 1}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (item.confidence ?? 0) >= 80
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {item.confidence ?? "?"}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state before any upload */}
      {!data && (
        <p className="text-slate-500 text-sm italic text-center mt-6">
          No extraction data yet. Upload a file to begin.
        </p>
      )}
    </div>
  );
}