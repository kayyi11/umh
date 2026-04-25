// src/pages/Settings.jsx
import { useState } from "react";

export default function Settings() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Toggle States for the Notifications Tab
  const [toggles, setToggles] = useState({
    critical: true,
    daily: false,
    security: true,
  });

  // Personalization States
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("purple");

  // Simulated save action
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("System settings updated successfully!");
    }, 1000);
  };

  return (
    <>
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-extrabold text-white">Settings</h1>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm text-[#34D399]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34D399]"></span>
            </span>
            <span>Live Sync</span>
          </div>
          <div className="text-sm text-slate-400">Last updated: 10s ago</div>

          <div className="flex items-center space-x-3 bg-[#1F2937] px-3 py-1.5 rounded-full border border-[#7F92BB]/30">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              U
            </div>
            <span className="font-medium text-white text-sm pr-2">User</span>
          </div>
        </div>
      </header>

      {/* ==========================================
          MAIN LAYOUT: Horizontal Tabs + Content Box
          ========================================== */}
      <div className="flex flex-col h-auto min-h-[calc(100vh-160px)] pb-10">
        {/* Horizontal Settings Navigation */}
        <div className="flex space-x-6 border-b border-[#7F92BB]/20 mb-6 overflow-x-auto scrollbar-hide">
          {[
            {
              id: "profile",
              label: "Account Profile",
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
            },
            {
              id: "appearance",
              label: "Personalization",
              icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
            },
            {
              id: "ai",
              label: "AI Engine Config",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
            },
            {
              id: "integration",
              label: "Data Integrations",
              icon: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2",
            },
            {
              id: "notifications",
              label: "Alerts & Webhooks",
              icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 border-b-2 text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#8B5CF6] text-[#8B5CF6]" // Active Tab (Bottom Border)
                  : "border-transparent text-slate-400 hover:text-white hover:border-[#7F92BB]/50" // Inactive Tab
              }`}
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
                  d={tab.icon}
                ></path>
              </svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-[#121826] rounded-xl border border-[#7F92BB]/30 shadow-xl overflow-hidden flex flex-col flex-1">
          {/* -----------------------------------
              TAB 1: Account Profile
              ----------------------------------- */}
          {activeTab === "profile" && (
            <div className="p-8 animate-in fade-in duration-300 max-w-4xl">
              <h2 className="text-xl font-bold text-white mb-6">
                Account Profile
              </h2>

              <div className="flex items-center space-x-5 mb-8">
                <div className="w-20 h-20 bg-[#1F2937] border border-[#7F92BB]/30 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                  U
                </div>
                <div>
                  <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-[#7F92BB]/30 transition-all mb-1">
                    Change Avatar
                  </button>
                  <p className="text-xs text-slate-500">
                    JPG, GIF or PNG. Max size of 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="System"
                    className="w-full bg-[#1F2937] border border-[#7F92BB]/40 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="User"
                    className="w-full bg-[#1F2937] border border-[#7F92BB]/40 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@z-intelligence.io"
                    className="w-full bg-[#1F2937] border border-[#7F92BB]/40 rounded-lg px-4 py-2.5 text-slate-400 text-sm focus:outline-none focus:border-[#8B5CF6] cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Contact IT support to change your registered email address.
                  </p>
                </div>
              </div>

              <hr className="border-[#7F92BB]/20 my-6" />

              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Change Password
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-[#1F2937] border border-[#7F92BB]/40 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      className="w-full bg-[#1F2937] border border-[#7F92BB]/40 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------
              TAB 2: Personalization
              ----------------------------------- */}
          {activeTab === "appearance" && (
            <div className="p-8 animate-in fade-in duration-300 max-w-4xl">
              <h2 className="text-xl font-bold text-white mb-6">
                Appearance & Personalization
              </h2>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Interface Theme
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-3 transition-all ${theme === "dark" ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-[#7F92BB]/20 bg-[#1F2937] hover:border-[#7F92BB]/50"}`}
                  >
                    <div className="w-full h-16 bg-[#0B1220] rounded border border-[#7F92BB]/30 flex items-center justify-center">
                      <div className="w-1/2 h-2/3 bg-[#1F2937] rounded-sm mr-2"></div>
                      <div className="w-1/4 h-2/3 bg-[#8B5CF6] rounded-sm"></div>
                    </div>
                    <span className="text-white text-sm font-bold">
                      Dark Mode
                    </span>
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-3 transition-all ${theme === "light" ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : "border-[#7F92BB]/20 bg-[#1F2937] hover:border-[#7F92BB]/50"}`}
                  >
                    <div className="w-full h-16 bg-slate-100 rounded border border-slate-300 flex items-center justify-center">
                      <div className="w-1/2 h-2/3 bg-white border border-slate-200 rounded-sm mr-2"></div>
                      <div className="w-1/4 h-2/3 bg-blue-500 rounded-sm"></div>
                    </div>
                    <span className="text-slate-400 text-sm font-bold">
                      Light Mode
                    </span>
                  </button>
                </div>
              </div>

              <hr className="border-[#7F92BB]/20 my-6" />

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Brand Accent Color
                </label>
                <p className="text-xs text-slate-500 mb-4">
                  Choose the primary color used for active states, buttons, and
                  highlights.
                </p>
                <div className="flex space-x-4">
                  {[
                    {
                      id: "purple",
                      bg: "bg-[#8B5CF6]",
                      ring: "ring-[#8B5CF6]",
                    },
                    { id: "blue", bg: "bg-[#3B82F6]", ring: "ring-[#3B82F6]" },
                    {
                      id: "emerald",
                      bg: "bg-[#10B981]",
                      ring: "ring-[#10B981]",
                    },
                    { id: "rose", bg: "bg-[#F43F5E]", ring: "ring-[#F43F5E]" },
                    { id: "amber", bg: "bg-[#F59E0B]", ring: "ring-[#F59E0B]" },
                  ].map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setAccent(color.id)}
                      className={`w-10 h-10 rounded-full ${color.bg} transition-all duration-200 flex items-center justify-center ${accent === color.id ? `ring-4 ring-offset-2 ring-offset-[#121826] ${color.ring}` : "hover:scale-110"}`}
                    >
                      {accent === color.id && (
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------
              TAB 3: AI Engine Config
              ----------------------------------- */}
          {activeTab === "ai" && (
            <div className="p-8 animate-in fade-in duration-300 max-w-4xl">
              <h2 className="text-xl font-bold text-white mb-6">
                Core Engine Parameters
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Base AI Model
                  </label>
                  <select className="w-full bg-[#1F2937] border border-[#7F92BB]/40 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8B5CF6] appearance-none cursor-pointer">
                    <option>Zai Cognitive Core v3.0 (Recommended)</option>
                    <option>Zai Fast-Inference Model (Low Latency)</option>
                    <option>External Multimodal API Processing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    System Automation Threshold
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-slate-500">
                      Manual Review
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      defaultValue="80"
                      className="flex-1 h-2 bg-[#1F2937] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                    />
                    <span className="text-xs font-bold text-[#8B5CF6]">
                      Fully Autonomous
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Global System Prompt (Instructions)
                  </label>
                  <textarea
                    className="w-full bg-[#1F2937] border border-[#7F92BB]/40 rounded-lg px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-[#8B5CF6] h-24 resize-none leading-relaxed"
                    defaultValue="You are the core logic engine powered by Zai. Your primary directive is to process incoming data streams, detect anomalies, generate strategic insights, and optimize the overarching workflow."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------
              TAB 4: Data Integrations
              ----------------------------------- */}
          {activeTab === "integration" && (
            <div className="p-8 animate-in fade-in duration-300 max-w-4xl">
              <h2 className="text-xl font-bold text-white mb-6">
                Data Source Integrations
              </h2>
              <div className="space-y-4">
                {[
                  {
                    name: "Main Database Cluster (SQL/NoSQL)",
                    status: "Connected",
                    sync: "Latency: 12ms | Syncing live",
                    color: "text-[#34D399]",
                  },
                  {
                    name: "Cloud Storage Bucket (AWS/GCP)",
                    status: "Connected",
                    sync: "Last sync: 2 hours ago",
                    color: "text-[#34D399]",
                  },
                  {
                    name: "Third-party Analytics API",
                    status: "Warning",
                    sync: "API Token expiring in 3 days",
                    color: "text-[#F59E0B]",
                  },
                  {
                    name: "Communication Gateway (Email/SMS)",
                    status: "Disconnected",
                    sync: "Click to configure Webhooks",
                    color: "text-slate-500",
                  },
                ].map((sys, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-[#1F2937] border border-[#7F92BB]/20 rounded-xl hover:bg-[#1F2937]/80 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-[#7F92BB]/10 shadow-sm">
                        <svg
                          className="w-5 h-5 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">
                          {sys.name}
                        </div>
                        <div className={`text-xs ${sys.color} mt-0.5`}>
                          {sys.sync}
                        </div>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${sys.status === "Connected" ? "border-[#34D399]/30 text-[#34D399] bg-[#34D399]/10 hover:bg-[#34D399]/20" : sys.status === "Warning" ? "border-[#F59E0B]/30 text-[#F59E0B] bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20" : "border-[#7F92BB]/30 text-slate-300 hover:bg-white/5"}`}
                    >
                      {sys.status === "Connected"
                        ? "Manage"
                        : sys.status === "Warning"
                          ? "Fix Token"
                          : "Configure"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -----------------------------------
              TAB 5: Alerts & Webhooks
              ----------------------------------- */}
          {activeTab === "notifications" && (
            <div className="p-8 animate-in fade-in duration-300 max-w-4xl">
              <h2 className="text-xl font-bold text-white mb-6">
                Alerts & Webhooks
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Global Webhook Endpoint
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      defaultValue="https://api.z-intelligence.com/webhook/v1/receive"
                      className="flex-1 bg-[#1F2937] border border-[#7F92BB]/40 rounded-lg px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                    <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-semibold border border-[#7F92BB]/30 transition-all">
                      Test Payload
                    </button>
                  </div>
                </div>

                <hr className="border-[#7F92BB]/20 my-4" />

                <div className="space-y-5">
                  {[
                    {
                      id: "critical",
                      title: "Critical System Errors",
                      desc: "Get notified immediately when the AI engine or database fails.",
                    },
                    {
                      id: "security",
                      title: "Security & Access Alerts",
                      desc: "Triggers when unknown IPs attempt to access the dashboard.",
                    },
                    {
                      id: "daily",
                      title: "Daily AI Rollup Digest",
                      desc: "Receive an automated summary of yesterday's strategic decisions.",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-medium text-sm">
                          {item.title}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setToggles({
                            ...toggles,
                            [item.id]: !toggles[item.id],
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${toggles[item.id] ? "bg-[#8B5CF6]" : "bg-[#1F2937] border border-[#7F92BB]/30"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${toggles[item.id] ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              STICKY FOOTER
              ========================================== */}
          <div className="p-6 border-t border-[#7F92BB]/20 bg-[#1F2937] flex justify-end mt-auto">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center space-x-2 active:scale-95"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
