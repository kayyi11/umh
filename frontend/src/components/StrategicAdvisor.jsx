//frontend/src/components/StrategicAdvisor.jsx

import { useState, useRef, useEffect } from "react";

const PHASE_DEFS = [
  { key: "detect", icon: "🔍", label: "Detect", desc: "Scanning inventory & risk flags" },
  { key: "think",  icon: "🧠", label: "Think",  desc: "Analyzing trends & strategy" },
  { key: "act",    icon: "⚡", label: "Act",    desc: "Drafting structured response" },
];

function ThinkingBubble({ phases }) {
  return (
    <div className="flex justify-start">
      <div className="bg-[#374151] border border-[#7F92BB]/20 rounded-xl rounded-tl-none p-4 text-sm max-w-[85%] shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#A78BFA] animate-pulse" />
          <span className="text-[#A78BFA] text-xs font-semibold tracking-wide">Agent is working...</span>
        </div>
        <div className="space-y-2">
          {PHASE_DEFS.map(({ key, icon, label, desc }) => {
            const phaseIdx   = phases.indexOf(key);
            const isReceived = phaseIdx >= 0;
            const isCurrent  = isReceived && phaseIdx === phases.length - 1;
            const isDone     = isReceived && phaseIdx < phases.length - 1;
            return (
              <div
                key={key}
                className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${isReceived ? "opacity-100" : "opacity-25"}`}
              >
                <span className="w-5 text-center shrink-0">
                  {isDone ? (
                    <span className="text-green-400">✓</span>
                  ) : isCurrent ? (
                    <span className="inline-block animate-spin text-[#A78BFA]">↻</span>
                  ) : (
                    <span className="text-slate-500">{icon}</span>
                  )}
                </span>
                <span className={`font-semibold ${isCurrent ? "text-[#A78BFA]" : isDone ? "text-green-400" : "text-slate-500"}`}>
                  {label}:
                </span>
                <span className={`${isCurrent ? "text-slate-200 animate-pulse" : isDone ? "text-slate-300" : "text-slate-500"}`}>
                  {desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatAiText(text) {
  return text
    .replace(/#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, ''))
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function AiMessage({ text }) {
  const lines = formatAiText(text).split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />;
        if (line.startsWith('•')) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-[#A78BFA] mt-0.5 shrink-0">•</span>
              <span>{line.slice(1).trim()}</span>
            </div>
          );
        }
        if (line.trim() === 'Do you need further clarification?') {
          return (
            <p key={i} className="text-[#A78BFA] text-xs mt-2 italic">
              {line.trim()}
            </p>
          );
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

export default function StrategicAdvisor() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "I have all I need, how can I help you optimize your operations today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingPhases, setThinkingPhases] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, thinkingPhases]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { id: Date.now(), sender: "user", text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const queryToSend = inputValue;
    setInputValue("");
    setIsLoading(true);
    setThinkingPhases([]);

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToSend }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let event;
          try { event = JSON.parse(line.slice(6)); } catch { continue; }

          if (event.type === "detect") {
            setThinkingPhases(["detect"]);
          } else if (event.type === "think") {
            setThinkingPhases(["detect", "think"]);
          } else if (event.type === "act") {
            setThinkingPhases(["detect", "think", "act"]);
          } else if (event.type === "done") {
            setIsLoading(false);
            setThinkingPhases([]);
            setMessages(prev => [
              ...prev,
              { id: Date.now() + 1, sender: "ai", text: event.output, thoughts: event.thoughts },
            ]);
          } else if (event.type === "error") {
            setIsLoading(false);
            setThinkingPhases([]);
            setMessages(prev => [
              ...prev,
              { id: Date.now() + 1, sender: "ai", text: `Error: ${event.content}` },
            ]);
          }
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      setIsLoading(false);
      setThinkingPhases([]);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: "Cannot reach the server. Make sure Flask is running on port 5000." },
      ]);
    }
  };

  return (
    <div className="bg-[#1F2937] rounded-xl border border-[#7F92BB]/30 shadow-xl flex flex-col h-full overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-[#7F92BB]/20 bg-[#1F2937] z-10 relative">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Strategic Advisor
        </h2>
      </div>

      {/* Chat History Container */}
      <div className="flex-1 relative min-h-[300px]">
        <div className="absolute inset-0 p-6 overflow-y-auto space-y-4 scroll-smooth">
        {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#8B5CF6] text-white rounded-tr-none shadow-md whitespace-pre-wrap"
                    : "bg-[#374151] text-slate-200 border border-[#7F92BB]/20 rounded-tl-none shadow-sm"
                }`}
              >
                {/* Render thoughts in a distinct, muted block */}
                {msg.sender === "ai" && msg.thoughts && (
                  <div className="mb-3 p-3 bg-[#1F2937] border border-[#7F92BB]/30 rounded-lg text-xs text-slate-400 font-mono overflow-x-auto">
                    <div className="text-[#A78BFA] font-bold mb-1 flex items-center gap-2">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                       Agent Thought Process
                    </div>
                    {msg.thoughts}
                  </div>
                )}
                
                {msg.sender === "ai" ? <AiMessage text={msg.text} /> : msg.text}
              </div>
            </div>
          ))}

          {isLoading && <ThinkingBubble phases={thinkingPhases} />}
          
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-[#7F92BB]/20 bg-[#1F2937] relative z-10">
        <div className="relative flex items-center">
          <input
            type="text"
            disabled={isLoading} // Disable input while AI thinks
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isLoading ? "Please wait..." : "Ask anything..."}
            className={`w-full bg-[#374151] border border-[#7F92BB]/30 rounded-xl py-3.5 pl-4 pr-14 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`absolute right-2 p-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg transition-colors active:scale-95 ${isLoading ? 'opacity-50' : ''}`}
          >
            <svg className="w-4 h-4 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}