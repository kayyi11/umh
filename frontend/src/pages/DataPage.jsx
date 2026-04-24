//frontend/src/pages/DataPage.jsx

import { useState } from "react";
import UploadSection from "../components/UploadSection";
import ProcessingTimeline from "../components/ProcessingTimeline";
import ExtractionSummary from "../components/ExtractionSummary";

export default function DataPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-extrabold text-white">Data Extract</h1>
        <div className="flex items-center space-x-6 text-sm text-slate-400">
           <span>{isProcessing ? "AI Engine: Active" : "AI Engine: Idle"}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-3">
        <div className="xl:col-span-4">
          {/* Trigger processing on click */}
          <UploadSection onUploadStart={() => setIsProcessing(true)} />
        </div>

        <div className="xl:col-span-8 flex flex-col h-full">
          <ProcessingTimeline isProcessing={isProcessing} onComplete={() => setIsProcessing(false)} />
          {!isProcessing && <ExtractionSummary />}
        </div>
      </div>
    </>
  );
}