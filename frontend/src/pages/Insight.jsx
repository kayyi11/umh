//frontend/src/pages/Insight.jsx

import StrategicAdvisor from "../components/StrategicAdvisor";
import RevenueDashboard from "../components/RevenueDashboard";

export default function Insight() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-extrabold text-white">Insight</h1>
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-auto min-h-[calc(100vh-180px)]">
        
        {/* Left Column: Strategic Advisor Chat */}
        <div className="xl:col-span-4 h-full min-h-[650px]">
          <StrategicAdvisor />
        </div>

        {/* Right Column: Insight Dashboard */}
        <div className="xl:col-span-8 h-full">
          <RevenueDashboard />
        </div>

      </div>
      <div className="h-5 w-full flex-shrink-0"></div>
    </>
  );
}
