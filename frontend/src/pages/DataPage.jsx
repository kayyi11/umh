//frontend/src/pages/DataPage.jsx

import { useState } from "react";
import UploadSection from "../components/UploadSection";
import ProcessingTimeline from "../components/ProcessingTimeline";
import ExtractionSummary from "../components/ExtractionSummary";

export default function DataPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);

  const handleUploadComplete = (data) => {
    setIsProcessing(false);
    setExtractionResult(data);
  };

  return (
    <>
      {/* ... Header ... */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4">
          <UploadSection 
            onUploadStart={() => setIsProcessing(true)} 
            onUploadComplete={handleUploadComplete} 
          />
        </div>

        <div className="xl:col-span-8 flex flex-col h-full">
          <ProcessingTimeline isProcessing={isProcessing} />
          
          {/* Functional: Display real summary after upload */}
          <ExtractionSummary result={extractionResult} />
        </div>
      </div>
    </>
  );
}