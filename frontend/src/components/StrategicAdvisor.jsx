import { useState, useRef, useEffect } from "react";

export default function StrategicAdvisor() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your Strategic Advisor. Based on the current data, revenue is projected to grow. How can I help you optimize your operations today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // NEW: Track if AI is thinking

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Scroll when messages OR loading status change

  // UPDATED: Function to talk to the Backend
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { id: Date.now(), sender: "user", text: inputValue };
    
    // 1. Add user message to screen
    setMessages(prev => [...prev, userMessage]);
    const queryToSend = inputValue;
    setInputValue("");
    setIsLoading(true); // Start loading

    try {
      // 2. Send request to Flask Backend
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryToSend }),
      });

      const data = await response.json();

      // 3. Add AI response to screen
      if (data.status === "success") {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: "ai", text: data.output }
        ]);
      } else {
        throw new Error("Backend error");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: "Sorry, I'm having trouble connecting to the server. Please check if app.py is running." }
      ]);
    } finally {
      setIsLoading(false); // Stop loading
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
                className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-[#8B5CF6] text-white rounded-tr-none shadow-md"
                    : "bg-[#374151] text-slate-200 border border-[#7F92BB]/20 rounded-tl-none shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* NEW: Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#374151] text-slate-400 p-4 rounded-xl text-xs animate-pulse border border-[#7F92BB]/10">
                AI Agents are collaborating...
              </div>
            </div>
          )}
          
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