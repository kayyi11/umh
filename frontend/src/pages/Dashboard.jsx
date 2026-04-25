import { useState, useEffect } from "react";
import TrendWidget from "../components/TrendWidget";
import AlertCard from "../components/AlertCard";
import DecisionCard from "../components/DecisionCard";
import { fetchMetrics } from "../services/api";

function getTimeAgo(date) {
  if (!date) return "10s ago";
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 30) return "Just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

function safeFixed(val, digits = 2) {
  return typeof val === "number" && isFinite(val) ? val.toFixed(digits) : "—";
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [timeAgo, setTimeAgo] = useState("10s ago");

  // Initial fetch
  useEffect(() => {
    fetchMetrics()
      .then((data) => {
        setMetrics(data);
        setLastUpdatedAt(data.computed_at ? new Date(data.computed_at) : null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch metrics:", err);
        setLoading(false);
      });
  }, []);

  // Refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetrics()
        .then((data) => {
          setMetrics(data);
          setLastUpdatedAt(data.computed_at ? new Date(data.computed_at) : null);
        })
        .catch((err) => console.error("Refresh failed:", err));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update "time ago" string every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(lastUpdatedAt));
    }, 10000);
    setTimeAgo(getTimeAgo(lastUpdatedAt));
    return () => clearInterval(interval);
  }, [lastUpdatedAt]);

  // ── Derived values (safe when metrics is null) ─────────────────────────────

  const revenueData = metrics?.daily_revenue?.map((d) => d.revenue) ?? [10, 15, 8, 20, 14, 25, 22, 30, 28];
  const costData = [20, 18, 22, 16, 25, 20, 28, 24, 26];

  // Revenue widget
  const revenueValue = metrics
    ? "RM " + safeFixed(metrics.this_week_revenue)
    : "RM 5,230";
  const wowChange = metrics?.wow_revenue_change ?? null;
  const revenueStatusText =
    wowChange !== null
      ? (wowChange >= 0 ? "↑ " : "↓ ") + safeFixed(Math.abs(wowChange), 1) + "% vs last week"
      : "↑ 8.4% vs last week";
  const revenueStatusType = wowChange !== null ? (wowChange >= 0 ? "up" : "down") : "up";

  // Cost widget
  const costValue = metrics
    ? "RM " + safeFixed(metrics.this_week_cogs)
    : "RM 3,100";

  // Inventory health widget
  const alerts = metrics?.inventory_alerts ?? [];
  const healthyCount = alerts.filter((i) => i.alert === "Healthy").length;
  const totalCount = alerts.length;
  const healthPct = totalCount > 0 ? Math.round((healthyCount / totalCount) * 100) : 0;
  const inventoryValue = metrics ? healthPct + "%" : "78%";

  // Return Rate widget
  const returnRateValue = metrics
    ? safeFixed(metrics.return_rate_percent, 1) + "%"
    : "RM 3,100";

  // Net Margin widget
  const netMargin = metrics?.net_margin_percent ?? null;
  const netMarginValue = metrics ? safeFixed(netMargin, 1) + "%" : "RM 5,230";
  const netMarginStatusType =
    netMargin !== null ? (netMargin >= 15 ? "up" : "down") : "up";
  const netMarginStatusText =
    netMargin !== null
      ? safeFixed(netMargin, 1) + "% Target: 15%"
      : "↑ 8.4% Target: 15%";

  // Net Profit widget
  const netProfitValue = metrics
    ? "RM " + safeFixed(metrics.net_profit)
    : "RM 3,100";

  // Priority alerts
  const p1p2Alerts = metrics
    ? metrics.inventory_alerts.filter((i) => i.alert === "P1" || i.alert === "P2")
    : null;

  // Top products
  const top3 = metrics?.top_3_products ?? [];
  const productRevenue = metrics?.product_revenue ?? {};

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
          <div className="text-sm text-slate-400">Last updated: {timeAgo}</div>
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
            {p1p2Alerts === null ? (
              // Loading — show existing placeholder bars
              <>
                <AlertCard color="red" />
                <AlertCard color="yellow" />
              </>
            ) : p1p2Alerts.length === 0 ? (
              <AlertCard color="green" message="✓ All inventory levels healthy" />
            ) : (
              p1p2Alerts.map((alert) => (
                <AlertCard
                  key={alert.listing_id}
                  color={alert.alert === "P1" ? "red" : "yellow"}
                  message={
                    alert.alert === "P1"
                      ? `⚠ ${alert.product_name} on ${alert.listing_id} — only ${alert.stock} units left`
                      : `⚠ ${alert.product_name} on ${alert.listing_id} — ${alert.stock} units, monitor closely`
                  }
                />
              ))
            )}
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
          value={revenueValue}
          statusText={revenueStatusText}
          statusType={revenueStatusType}
          chartType="revenue"
          data={revenueData}
        />
        <TrendWidget
          title="Cost"
          value={costValue}
          chartType="cost"
          data={costData}
        />
        <TrendWidget
          title="Inventory Health"
          value={inventoryValue}
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

        {/* Return Rate */}
        <TrendWidget
          title="Return Rate"
          value={returnRateValue}
          chartType="cost"
          data={costData}
        />

        {/* Net Margin */}
        <TrendWidget
          title="Net Margin"
          value={netMarginValue}
          statusText={netMarginStatusText}
          statusType={netMarginStatusType}
          chartType="revenue"
          data={revenueData}
        />

        {/* Net Profit */}
        <TrendWidget
          title="Net profit"
          value={netProfitValue}
          statusText={revenueStatusText}
          statusType={revenueStatusType}
          chartType="cost"
          data={revenueData}
        />

        {/* Top Best Selling products list */}
        <div className="bg-[#1F2937] p-6 rounded-xl shadow-lg border border-[#7F92BB]/40 flex flex-col h-full min-h-[190px]">
          <h2 className="text-[13px] font-semibold text-slate-300 mb-5">Top Best Selling products</h2>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            {metrics === null ? (
              // Loading — keep original placeholder rows
              <>
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
              </>
            ) : (
              top3.map((name, idx) => {
                const rev = productRevenue[name];
                const revStr =
                  typeof rev === "number" && isFinite(rev)
                    ? "RM " + rev.toFixed(2)
                    : "—";
                const isLast = idx === top3.length - 1;
                return (
                  <div
                    key={name}
                    className={`flex justify-between items-center pb-2 ${
                      isLast ? "" : "border-b border-[#7F92BB]/10"
                    }`}
                  >
                    <span className="text-white text-sm font-medium">
                      {idx + 1}. {name}
                    </span>
                    <span className="text-[#34D399] font-bold text-sm">{revStr}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </>
  );
}
