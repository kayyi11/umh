// frontend/src/pages/DataPage.jsx
import { useState } from "react";
import UploadSection from "../components/UploadSection";
import ProcessingTimeline from "../components/ProcessingTimeline";
import ExtractionSummary from "../components/ExtractionSummary";

export default function DataPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [extractedItems, setExtractedItems] = useState(null); // NEW: store extracted items for workspace merge

  const handleStart = (time) => {
    setStartTime(time);
    setIsProcessing(true);
    setSummaryData(null);
    setExtractedItems(null);
  };

  const handleComplete = (backendResponse) => {
    setIsProcessing(false);
    // backendResponse contains { summary, extractedItems }
    setSummaryData(backendResponse.summary);
    if (backendResponse.extractedItems) {
      // Store in sessionStorage so DataWorkspace can merge them
      const existing = JSON.parse(sessionStorage.getItem("uploadedItems") || "[]");
      const merged = [...existing, ...backendResponse.extractedItems];
      sessionStorage.setItem("uploadedItems", JSON.stringify(merged));
      setExtractedItems(backendResponse.extractedItems);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-extrabold text-white">Data Extract</h1>
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4">
          <UploadSection onUploadStart={handleStart} onUploadComplete={handleComplete} />
        </div>
        <div className="xl:col-span-8 flex flex-col space-y-6">
          <ProcessingTimeline isProcessing={isProcessing} startTime={startTime} />
          <ExtractionSummary data={summaryData} extractedItems={extractedItems} />
        </div>
      </div>
    </div>
  );
}