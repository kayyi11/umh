// frontend/src/components/ProcessingTimeline.jsx
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

const STEPS = [
  "Reading file data...",
  "Extracting text via Z.AI GLM...",
  "Identifying items and prices...",
  "Matching with Business Context...",
  "Finalizing structured data...",
];

export default function ProcessingTimeline({ isProcessing, startTime }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [prevIsProcessing, setPrevIsProcessing] = useState(isProcessing);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-GB", { hour12: false });

  // Derive log timestamps from startTime without side effects
  const logs = useMemo(() => {
    if (!startTime) return [];
    return STEPS.map((msg, index) => ({
      msg,
      time: formatTime(new Date(startTime.getTime() + index * 1000)),
    }));
  }, [startTime]);

  // Reset state when a new upload starts
  if (isProcessing !== prevIsProcessing) {
    setPrevIsProcessing(isProcessing);
    if (isProcessing) {
      setCurrentStep(0);
    }
  }

  // Advance through log steps every second while processing
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const isFinished = !isProcessing && currentStep === STEPS.length - 1 && startTime !== null;
  
  const hasStarted = currentStep >= 0 || isFinished;

  return (
    <div className="bg-[#1F2937] p-8 rounded-xl border border-[#7F92BB]/40 shadow-lg min-h-[360px] flex flex-col transition-all">
      <h2 className="text-xl font-bold text-white mb-8">AI Real-Time Processing Log</h2>

      <div className="space-y-6 relative flex-1">
        {/* Vertical connecting line */}
        {hasStarted && (
          <div className="absolute left-[52px] top-2 bottom-2 w-px bg-slate-700" />
        )}

        {!hasStarted && (
          <p className="text-slate-500 text-sm italic text-center mt-16">
            Upload a file to begin AI extraction...
          </p>
        )}

        {hasStarted &&
          logs.map((log, index) => (
            <div key={index} className="flex items-center space-x-6 relative">
              {/* Timestamp */}
              <span
                className={`text-xs font-mono w-16 transition-opacity duration-300 ${
                  index <= currentStep
                    ? "text-slate-400 opacity-100"
                    : "text-transparent opacity-0"
                }`}
              >
                {log.time}
              </span>

              {/* Indicator dot */}
              <div
                className={`w-6 h-6 rounded-full border-4 border-[#1F2937] z-10 transition-all duration-500 flex-shrink-0 ${
                  index <= currentStep
                    ? "bg-[#10B981] shadow-[0_0_8px_#10B981]"
                    : "bg-slate-700"
                }`}
              />

              {/* Step message */}
              <span
                className={`text-sm transition-all duration-500 ${
                  index <= currentStep
                    ? "text-slate-200"
                    : "text-slate-500 opacity-40"
                }`}
              >
                {log.msg}
                {index === currentStep && index < STEPS.length - 1 && (
                  <span className="ml-2 animate-pulse text-[#8B5CF6]">...</span>
                )}
              </span>
            </div>
          ))}
      </div>

      {/* Completion alert — only shown after backend finishes AND all steps played */}
      {isFinished && (
        <div className="mt-6 p-5 rounded-xl border border-[#4F46E5]/50 bg-[#4F46E5]/10 flex items-center justify-between animate-in zoom-in duration-300">
          <div className="flex items-center space-x-4">
            <div className="text-[#FBBF24] text-xl">⚠️</div>
            <div>
              <h4 className="text-white font-bold text-sm">Extraction Complete</h4>
              <p className="text-slate-400 text-xs">Data is ready for review in workspace</p>
            </div>
          </div>
          <Link
            to="/data/workspace"
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg active:scale-95"
          >
            Review Now
          </Link>
        </div>
      )}
    </div>
  );
}