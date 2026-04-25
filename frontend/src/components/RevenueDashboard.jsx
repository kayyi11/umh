import { useState, useEffect } from "react";
import RevenueChart from "./RevenueChart";
import DetailedAnalysisModal from "./DetailedAnalysisModal"; // ✅ Fixed import typo

export default function RevenueDashboard() {
  const [activeTab, setActiveTab] = useState("insight");
  const [activeDimension, setActiveDimension] = useState("total"); 
  const [insightData, setInsightData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Fetch real data from Firebase via Backend
  useEffect(() => {
    const fetchInsightData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/insight-data?dimension=${activeDimension}`);
        const data = await response.json();
        setInsightData(data);
      } catch (err) {
        console.error("Error fetching insight data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsightData();
  }, [activeDimension]);

  const dimensions = [
    { id: "total", label: "Total Revenue" },
    { id: "category", label: "By Category" },
    { id: "platform", label: "By Platform" },
    { id: "campaign", label: "Campaign ROI" }
  ];

  const handleViewDetailedAnalysis = async () => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/detailed-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendation: insightData?.optimization?.title }),
      });
      const data = await response.json();
      setModalContent(data.report);
    } catch { // ✅ FIXED: Removed unused (error) variable to satisfy ESLint
      setModalContent("Error: Could not reach the Strategist Agent.");
    } finally {
      setIsModalLoading(false);
    }
  };

  if (isLoading && !insightData) return <div className="p-10 text-white animate-pulse text-center">Crunching Firebase data...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Primary Tab Navigation */}
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setActiveTab("insight")} className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "insight" ? "bg-[#8B5CF6] text-white shadow-lg" : "bg-transparent border border-[#7F92BB]/40 text-[#7F92BB]"}`}>Insight & Prediction</button>
        <button onClick={() => setActiveTab("optimize")} className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "optimize" ? "bg-[#8B5CF6] text-white shadow-lg" : "bg-transparent border border-[#7F92BB]/40 text-[#7F92BB]"}`}>Optimize</button>
      </div>

      <div className="flex-1 border border-[#7F92BB]/30 rounded-2xl p-6 bg-[#0B1220]/50 shadow-inner overflow-hidden flex flex-col">
        {activeTab === "insight" && (
          <div className="flex flex-col flex-1 animate-in fade-in duration-500">
            <div className="flex flex-wrap gap-3 mb-8">
              {dimensions.map((dim) => (
                <button 
                  key={dim.id} 
                  onClick={() => setActiveDimension(dim.id)}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${activeDimension === dim.id ? "bg-[#8B5CF6] text-white" : "bg-transparent border border-[#7F92BB]/30 text-slate-300 hover:bg-white/5"}`}
                >
                  {dim.label}
                </button>
              ))}
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Revenue Analytics: {dimensions.find(d => d.id === activeDimension).label}</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
              <div className="lg:col-span-2 bg-[#121826] p-6 rounded-xl border border-[#7F92BB]/20 shadow-inner flex flex-col relative">
                <div className="flex-1 w-full min-h-[220px]">
                  <RevenueChart 
                    data={insightData?.chartData} 
                    transitionDate={insightData?.todayDate} 
                    type={insightData?.type}
                  />
                </div>
              </div>

              <div className="bg-[#1F2937] p-6 rounded-xl border border-[#8B5CF6] flex flex-col">
                <h4 className="text-[#A855F7] font-bold text-lg mb-4">AI Explanation</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{insightData?.aiExplanation}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "optimize" && insightData?.optimization && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-[#0B1220] p-6 rounded-xl border border-[#7F92BB]/20 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-6">
                  {insightData.optimization.title} <span className="text-[#8B5CF6]">{insightData.optimization.adjustment}</span>
                </h3>
                <p className="text-sm text-slate-400 mb-2">Expected Profit Increase</p>
                <div className="text-4xl font-extrabold text-[#34D399] mb-4">
                  {insightData.optimization.profitGrowth}
                </div>
                <p className="text-sm text-slate-400">Confidence: <span className="text-[#34D399] font-medium">{insightData.optimization.confidence}</span></p>
              </div>
              <div className="flex items-center space-x-4 mt-8">
                <button className="flex-1 bg-[#7C3AED] hover:bg-[#8B5CF6] text-white py-2.5 rounded-lg text-sm font-semibold transition-all">Simulate Scenario</button>
                <button className="flex-1 border border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 py-2.5 rounded-lg text-sm font-semibold transition-all">Apply to Actions</button>
              </div>
            </div>

            <div className="bg-[#0B1220] p-6 rounded-xl border border-[#7F92BB]/20 overflow-hidden flex flex-col">
              <h3 className="text-lg font-bold text-white mb-2">Scenario Simulation</h3>
              <p className="text-sm text-slate-400 mb-6">Current vs Projected</p>
              <table className="w-full text-left text-sm">
                <tbody className="space-y-4 block">
                  {insightData.simulationMetrics.map((metric, i) => (
                    <tr key={i} className="flex items-center border-b border-[#7F92BB]/10 pb-3">
                      <td className="w-1/3 text-slate-300">{metric.label}</td>
                      <td className="w-1/4 text-center text-slate-300">RM {metric.current}</td>
                      <td className="w-1/4 text-center text-white font-medium">RM {metric.projected}</td>
                      <td className="w-auto text-right text-[#34D399] font-bold flex-1">↑ {metric.change}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#0B1220] p-6 rounded-xl border border-[#7F92BB]/20 flex flex-col justify-between relative overflow-hidden lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-4">Why this recommendation?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {insightData.optimization.reasoning}
              </p>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleViewDetailedAnalysis}
                  className="bg-[#1F2937] hover:bg-[#374151] border border-[#7F92BB]/30 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                >
                  View Detailed Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        <DetailedAnalysisModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          content={modalContent}
          isLoading={isModalLoading}
        />
      </div>
    </div>
  );
}