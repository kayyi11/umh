//frontend/src/components/ExtractionSummary.jsx

export default function ExtractionSummary() {
  return (
    <div className="bg-[#1F2937] p-8 rounded-xl shadow-lg border border-[#7F92BB]/40 mt-6">
      <h2 className="text-xl font-bold text-white mb-6">Extraction Summary</h2>
      
      <div className="flex items-center justify-between divide-x divide-[#7F92BB]/20">
        
        {/* Stat 1 */}
        <div className="flex flex-col items-center flex-1 px-4">
          <span className="text-[32px] font-bold text-white leading-none mb-2">12</span>
          <span className="text-xs text-slate-400 text-center">Items<br/>Detected</span>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col items-center flex-1 px-4">
          <span className="text-[32px] font-bold text-[#10B981] leading-none mb-2">10</span>
          <span className="text-xs text-slate-400 text-center">High<br/>Confidence</span>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col items-center flex-1 px-4">
          <span className="text-[32px] font-bold text-red-500 leading-none mb-2">2</span>
          <span className="text-xs text-slate-400 text-center">Low<br/>Confidence</span>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col items-center flex-1 px-4">
          <span className="text-[32px] font-bold text-[#10B981] leading-none mb-2">94%</span>
          <span className="text-xs text-slate-400 text-center">Overall<br/>Accuracy</span>
        </div>

      </div>
    </div>
  );
}