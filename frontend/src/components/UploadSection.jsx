//frontend/src/components/UploadSection.jsx

import { useRef } from "react";

export default function UploadSection({ onUploadStart, onUploadComplete }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    onUploadStart(); // Start the timeline animation

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      // Artificial delay to let user see the AI Processing Log animation
      setTimeout(() => {
        onUploadComplete(data);
      }, 5000); 

    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="bg-[#1F2937] p-8 rounded-xl shadow-lg border border-[#7F92BB]/40 flex flex-col h-full">
      <h2 className="text-xl font-bold text-white mb-6">Upload Data</h2>
      
      {/* Hidden Inputs */}
      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'receipt')} accept="image/*" />

      <div className="flex flex-col space-y-4 flex-1">
        <button onClick={() => fileInputRef.current.click()} className="flex items-center p-4 rounded-xl border border-[#7F92BB]/30 hover:bg-white/5 transition-all text-left">
          <div className="mr-4 text-2xl">📸</div>
          <div>
            <h3 className="font-bold text-white text-base">Snap Receipt</h3>
            <p className="text-xs text-slate-400 mt-0.5">Use camera or upload photo</p>
          </div>
        </button>

        <button onClick={() => fileInputRef.current.click()} className="flex items-center p-4 rounded-xl border border-[#7F92BB]/30 hover:bg-white/5 transition-all text-left">
          <div className="mr-4 text-2xl">📄</div>
          <div>
            <h3 className="font-bold text-white text-base">Upload PDF</h3>
            <p className="text-xs text-slate-400 mt-0.5">Upload invoice or document</p>
          </div>
        </button>

        <button onClick={() => fileInputRef.current.click()} className="flex items-center p-4 rounded-xl border border-[#7F92BB]/30 hover:bg-white/5 transition-all text-left">
          <div className="mr-4 text-2xl">🎤</div>
          <div>
            <h3 className="font-bold text-white text-base">Voice Note</h3>
            <p className="text-xs text-slate-400 mt-0.5">Upload .m4a or .mp3 data</p>
          </div>
        </button>

        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFileChange({ target: { files: e.dataTransfer.files } }, 'drop'); }}
          className="mt-4 flex-1 border-2 border-dashed border-[#7F92BB]/30 rounded-xl flex items-center justify-center p-6 hover:border-[#3B82F6]/50 cursor-pointer"
        >
          <span className="font-bold text-white text-center">Drag and drop files here</span>
        </div>
      </div>
    </div>
  );
}