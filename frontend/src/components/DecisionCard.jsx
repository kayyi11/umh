import { useNavigate } from "react-router-dom";

export default function DecisionCard({ optimization = null }) {
  const navigate = useNavigate();

  const title = optimization?.title ?? "Increase";
  const adjustment = optimization?.adjustment ?? "chicken rice price by RM0.50";
  const profitGrowth = optimization?.profitGrowth ?? "+8%";

  return (
    <div className="bg-[#1F2937] p-8 rounded-xl shadow-lg border border-[#7F92BB]/40 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-white mb-6">
          Decision of the Day
        </h2>

        <div className="flex items-start justify-between mb-2">
          <h3 className="text-[26px] font-bold max-w-sm leading-snug tracking-tight">
            <span className="text-[#3B82F6]">{title}</span>{" "}
            <span className="text-white">{adjustment}</span>
          </h3>
          <div
            className="text-slate-500 font-bold text-2xl tracking-widest cursor-pointer hover:text-slate-300 transition-colors"
            title="More options"
          >
            ...
          </div>
        </div>

        <div className="mb-6 mt-4">
          <span className="inline-flex items-center rounded-md bg-[#064E3B] px-3 py-1.5 text-sm font-semibold text-[#34D399]">
            {profitGrowth} Profit Increase
          </span>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        {/* 🚀 Simplified CTA Button Feedback 🚀 
            1. 'group' class coordinates hover states with child elements.
            2. transition-all handles standard feedback duration/ease.
            3. hover:bg-[#3B82F6]: Simple background color change on hover (removed float/glow).
            4. active:scale-95: Simulates physical button press sensation.
        */}
        <button
          onClick={() => navigate("/insight")}
          className="group flex items-center justify-center space-x-3 bg-[#2563EB] text-white rounded-xl px-10 py-4 text-lg font-bold transition-all duration-300 ease-out hover:bg-[#3B82F6] active:scale-95"
        >
          <span>Simulate Impact</span>
          <span className="text-3xl transition-transform duration-300 ease-out group-hover:translate-x-2">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
