import { useState, useRef, useEffect } from "react";

export default function Reports() {
    // STATE MANAGEMENT
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi there! I'm ready to generate your custom report. What would you like to include today? (e.g., 'Draft a weekly revenue summary focusing on our recent price optimization')",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll for chat
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // HANDLERS
  const handleSend = () => {
    if (!inputValue.trim()) return;

    // 1. Add user message
    const newMessages = [
      ...messages,
      { id: Date.now(), sender: "user", text: inputValue },
    ];
    setMessages(newMessages);
    setInputValue("");
    setIsGenerating(true);

    // 2. Simulate AI Processing & Report Generation
    setTimeout(() => {
      // AI Chat Response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "I've analyzed the data based on your request. The customized report has been generated and formatted on the right. You can review it or ask me to make revisions.",
        },
      ]);

      // Populate the Document Preview with Mock Data
      setReportContent({
        title: "Weekly Optimization & Revenue Impact Report",
        date: "April 25, 2026",
        sections: [
          {
            heading: "1. Executive Summary",
            content:
              "This report outlines the financial impact of the recent RM0.50 price adjustment on the 'Chicken Rice' category. Overall profitability has shown a positive trend with minimal customer churn.",
          },
          {
            heading: "2. Revenue Highlights",
            content:
              "Total revenue for the week reached RM 5,230, marking an 8.4% increase compared to the previous period. The gross profit margin improved from 40.0% to 42.2%.",
          },
          {
            heading: "3. AI Strategic Recommendations",
            content:
              "Based on current elasticity metrics, maintaining the current pricing strategy is advised. Consider initiating a targeted promotional campaign next Friday to clear excess inventory in the 'Beverages' category.",
          },
        ],
      });
      setIsGenerating(false);
    }, 2000); // 2 seconds fake loading
  };

  return (
    <>
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-extrabold text-white">
          Report Generator
        </h1>
        <div className="flex items-center space-x-6">
          {/* Live Sync Indicator */}
          <div className="flex items-center space-x-2 text-sm text-[#34D399]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34D399]"></span>
            </span>
            <span>Live Sync</span>
          </div>
          <div className="text-sm text-slate-400">Last updated: 10s ago</div>
          {/* User Profile Bubble */}
          <div className="flex items-center space-x-3 bg-[#1F2937] px-3 py-1.5 rounded-full border border-[#7F92BB]/30">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              U
            </div>
            <span className="font-medium text-white text-sm pr-2">User</span>
          </div>
        </div>
      </header>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto min-h-[calc(100vh-180px)] pb-10">
        {/* ==========================================
            LEFT COLUMN: AI Chat Assistant
            ========================================== */}
        <div className="lg:col-span-4 bg-[#121826] rounded-xl border border-[#7F92BB]/30 shadow-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#7F92BB]/20 bg-[#1F2937]">
            <h2 className="text-sm font-bold text-white flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-[#8B5CF6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
              Report Assistant
            </h2>
          </div>

          <div className="flex-1 relative bg-[#0B1220]/50">
            <div className="absolute inset-0 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#8B5CF6] text-white rounded-tr-none shadow-md"
                        : "bg-[#1F2937] text-slate-200 border border-[#7F92BB]/20 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-[#1F2937] border border-[#7F92BB]/20 text-slate-400 p-3.5 rounded-xl rounded-tl-none text-sm flex items-center space-x-2">
                    <svg
                      className="animate-spin h-4 w-4 text-[#8B5CF6]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Drafting report structure...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#7F92BB]/20 bg-[#1F2937]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="E.g., Include top 3 selling items..."
                disabled={isGenerating}
                autoComplete="off"
                className="w-full bg-[#121826] border border-[#7F92BB]/40 rounded-lg py-2.5 pl-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6] disabled:opacity-50 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isGenerating || !inputValue.trim()}
                className="absolute right-1.5 p-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:bg-[#8B5CF6]/50 text-white rounded-md transition-colors"
              >
                <svg
                  className="w-4 h-4 transform rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT COLUMN: Document Preview Area
            ========================================== */}
        <div className="lg:col-span-8 bg-[#121826] rounded-xl border border-[#7F92BB]/30 shadow-xl flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="h-14 border-b border-[#7F92BB]/20 bg-[#1F2937] flex items-center justify-between px-6">
            <div className="text-sm font-semibold text-slate-300">
              Document Preview
            </div>
            <div className="flex space-x-3">
              <button
                disabled={!reportContent}
                className="flex items-center space-x-1.5 text-sm font-semibold bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-white py-1.5 px-3 rounded border border-[#7F92BB]/30 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  ></path>
                </svg>
                <span>Export PDF</span>
              </button>
              <button
                disabled={!reportContent}
                className="flex items-center space-x-1.5 text-sm font-semibold bg-[#2563EB] hover:bg-[#3B82F6] disabled:opacity-30 disabled:hover:bg-[#3B82F6] text-white py-1.5 px-3 rounded transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  ></path>
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Paper Area */}
          <div className="flex-1 bg-[#0B1220] p-8 overflow-y-auto flex justify-center">
            {reportContent ? (
              // Generated Report
              <div className="w-full max-w-2xl bg-[#1F2937] border border-[#7F92BB]/20 shadow-2xl rounded-sm p-10 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="border-b border-[#7F92BB]/20 pb-6 mb-6">
                  <h1 className="text-2xl font-extrabold text-white mb-2">
                    {reportContent.title}
                  </h1>
                  <p className="text-[#8B5CF6] font-medium text-sm">
                    Generated on: {reportContent.date}
                  </p>
                </div>

                <div className="space-y-8">
                  {reportContent.sections.map((sec, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-bold text-white mb-3">
                        {sec.heading}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-16 pt-6 border-t border-[#7F92BB]/20 flex justify-between items-center text-xs text-slate-500">
                  <span>Confidential - Internal Use Only</span>
                  <span>Generated by Z Intelligence</span>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-20 h-20 bg-[#1F2937] rounded-2xl flex items-center justify-center mb-6 border border-[#7F92BB]/30">
                  <svg
                    className="w-10 h-10 text-[#7F92BB]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  No Report Generated Yet
                </h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  Use the chat box on the left to instruct the AI. Your
                  generated document will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
