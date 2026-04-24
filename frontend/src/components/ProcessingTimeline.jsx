// frontend/src/components/ProcessingTimeline.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProcessingTimeline({ isProcessing, onComplete }) {
  const [logs, setLogs] = useState([
    { id: 1, time: "04:28:12", msg: "Reading image...", status: "pending" },
    { id: 2, time: "04:28:14", msg: "Extracting text...", status: "pending" },
    { id: 3, time: "04:28:17", msg: "Identifying items...", status: "pending" },
    { id: 4, time: "04:28:21", msg: "Finalizing data...", status: "pending" },
  ]);

  useEffect(() => {
    if (isProcessing) {
      let currentIdx = 0;
      const interval = setInterval(() => {
        setLogs(prev => prev.map((log, i) => i === currentIdx ? { ...log, status: "done" } : log));
        currentIdx++;
        
        // Use logs.length to determine when to stop
        if (currentIdx >= logs.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, 1200); 
      
      return () => clearInterval(interval);
    }
  }, [isProcessing, onComplete, logs.length]); // ✅ Added missing dependencies

  return (
    <div className="bg-[#1F2937] p-8 rounded-xl shadow-lg border border-[#7F92BB]/40 flex flex-col">
      <h2 className="text-xl font-bold text-white mb-8">AI Processing Log</h2>
      <div className="relative pl-3 flex-1 mb-6">
        <div className="absolute left-[17px] top-2 bottom-4 w-px bg-[#7F92BB]/30"></div>
        <div className="space-y-5">
          {logs.map((log) => (
            <div key={log.id} className="relative flex items-center space-x-6">
              <span className="text-xs text-slate-400 font-mono w-16">{log.time}</span>
              <div className={`relative z-10 w-3 h-3 rounded-full border-2 border-[#1F2937] ${log.status === "done" ? "bg-[#10B981]" : "bg-slate-500"}`}></div>
              <span className={`text-sm ${log.status === "done" ? "text-slate-300" : "text-slate-500"}`}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
      {!isProcessing && logs[3].status === "done" && (
        <div className="mt-4 p-5 rounded-xl bg-[#4F46E5]/10 flex items-center justify-between animate-in zoom-in duration-300">
          <div className="text-white text-sm font-bold">Extraction Complete! 2 fields need review.</div>
          <Link to="/data/workspace" className="bg-[#4F46E5] text-white px-5 py-2 rounded-lg text-sm font-semibold">Review Now</Link>
        </div>
      )}
    </div>
  );
}