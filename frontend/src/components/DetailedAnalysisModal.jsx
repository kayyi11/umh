export default function DetailedAnalysisModal({ isOpen, onClose, content, isLoading, error, onRetry }) {
  if (!isOpen) return null;

  const errorMessage =
    error === "rate_limit"
      ? "GLM rate limit reached. Please wait a moment and try again."
      : error === "timeout"
      ? "The AI service took too long to respond. Please retry."
      : error || "AI service temporarily unavailable.";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#1F2937] border border-[#7F92BB]/30 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col min-h-[400px] max-h-[85vh]">

        {/* Header */}
        <div className="p-6 border-b border-[#7F92BB]/20 flex justify-between items-center bg-[#1F2937] rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">AI Strategic Deep-Dive</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto flex-1 bg-[#111827]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
              <p className="animate-pulse text-[#8B5CF6] font-medium">Strategist Agent is analyzing Firestore data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full py-20 space-y-5 text-center">
              <div className="text-3xl">⚠️</div>
              <p className="text-red-400 font-semibold">AI service temporarily unavailable.</p>
              <p className="text-slate-400 text-sm max-w-xs">{errorMessage}</p>
              <button
                onClick={onRetry}
                className="mt-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-200 prose prose-invert max-w-none">
              {content ? (
                <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
              ) : (
                <p className="text-center text-slate-500 py-10">No analysis was returned. Please try again.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#7F92BB]/20 flex justify-end bg-[#1F2937] rounded-b-2xl">
          <button
            onClick={onClose}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}