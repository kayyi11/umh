import TrendWidget from "../components/TrendWidget";
import AlertCard from "../components/AlertCard";
import DecisionCard from "../components/DecisionCard";

export default function Dashboard() {
  // Dummy dynamic data for the charts
  const revenueData = [10, 15, 8, 20, 14, 25, 22, 30, 28];
  const costData = [20, 18, 22, 16, 25, 20, 28, 24, 26];

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-extrabold text-white">Dashboard</h1>
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

      {/* Top Section: Alerts & Primary CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#1F2937] p-8 rounded-xl shadow-lg border border-[#7F92BB]/40 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-white mb-6">
            Priority Alert Feed
          </h2>
          <div className="space-y-5">
            <AlertCard color="red" />
            <AlertCard color="yellow" />
          </div>
          <div className="mt-5 flex justify-end">
            <a
              href="#"
              className="text-[#7F92BB] hover:text-white font-medium text-sm transition"
            >
              View All Alerts
            </a>
          </div>
        </div>
        <DecisionCard />
      </div>

      {/* ==========================================
          Bottom Section ROW 1: Trend Widgets & AI Feed
          (Added mb-6 here to separate from the new row)
          ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <TrendWidget
          title="Revenue"
          value="RM 5,230"
          statusText="↑ 8.4% vs yesterday"
          statusType="up"
          chartType="revenue"
          data={revenueData}
        />
        <TrendWidget
          title="Cost"
          value="RM 3,100"
          statusText="↑ 6.7% vs yesterday"
          statusType="down"
          chartType="cost"
          data={costData}
        />
        <TrendWidget
          title="Inventory Health"
          value="78%"
          chartType="inventory"
        />

        {/* Live AI Processing Feed */}
        <div className="bg-[#1F2937] p-6 rounded-xl shadow-lg border border-[#7F92BB]/40 flex flex-col h-full min-h-[190px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Live AI Feed</h2>
            <div className="flex items-center space-x-1.5 text-[11px] text-[#34D399]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse"></span>
              <span>Analyzing sales...</span>
            </div>
          </div>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center space-x-4">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <div className="flex-1 h-2.5 bg-white/10 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================
          Bottom Section ROW 2: Additional Metrics
          ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-12">
        
        {/* Return Rate (Using costData to render the red chart) */}
        <TrendWidget
          title="Return Rate"
          value="RM 3,100"
          statusText="↑ 6.7% vs yesterday"
          statusType="down"
          chartType="cost"
          data={costData}
        />

        {/* Net Margin (Using revenueData to render the blue chart) */}
        <TrendWidget
          title="Net Margin"
          value="RM 5,230"
          statusText="↑ 8.4% vs yesterday"
          statusType="up"
          chartType="revenue"
          data={revenueData}
        />

        {/* Net profit (Using costData to render the red chart) */}
        <TrendWidget
          title="Net profit"
          value="RM 3,100"
          statusText="↑ 6.7% vs yesterday"
          statusType="down"
          chartType="cost"
          data={costData}
        />

        {/* Top Best Selling products list */}
        <div className="bg-[#1F2937] p-6 rounded-xl shadow-lg border border-[#7F92BB]/40 flex flex-col h-full min-h-[190px]">
          <h2 className="text-[13px] font-semibold text-slate-300 mb-5">Top Best Selling products</h2>
          
          <div className="flex-1 flex flex-col justify-center space-y-4">
             <div className="flex justify-between items-center border-b border-[#7F92BB]/10 pb-2">
                <span className="text-white text-sm font-medium">1. Hainanese Chicken Rice</span>
                <span className="text-[#34D399] font-bold text-sm">420 qty</span>
             </div>
             <div className="flex justify-between items-center border-b border-[#7F92BB]/10 pb-2">
                <span className="text-white text-sm font-medium">2. Roasted Chicken Rice</span>
                <span className="text-[#34D399] font-bold text-sm">385 qty</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-white text-sm font-medium">3. BBQ Pork Rice</span>
                <span className="text-[#34D399] font-bold text-sm">210 qty</span>
             </div>
          </div>
        </div>

      </div>
    </>
  );
}