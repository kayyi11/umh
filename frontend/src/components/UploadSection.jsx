// frontend/src/components/UploadSection.jsx
import { useRef, useState } from "react";

export default function UploadSection({ onUploadStart, onUploadComplete }) {
  const dropRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = async (file, type) => {
    if (!file || isUploading) return;

    setUploadError(null);
    setIsUploading(true);

    const startTime = new Date();
    onUploadStart(startTime);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    // The AI call (Claude API) can take 5–15s.
    // Strategy: fire the backend call and the 5s UI timer IN PARALLEL.
    // We wait for BOTH to finish before calling onUploadComplete, so the
    // summary always reflects the real backend result — never stale data.
    const backendPromise = fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.json();
    });

    // Minimum display time so the timeline animation always plays fully (5s)
    const minDisplayPromise = new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      // Wait for BOTH: real data + minimum animation time
      const [data] = await Promise.all([backendPromise, minDisplayPromise]);
      onUploadComplete(data);
    } catch (err) {
      console.error("Upload Error:", err);
      setUploadError("Extraction failed. Check backend connection or API key.");
      // Still complete so the UI doesn't hang forever
      await minDisplayPromise.catch(() => {});
      onUploadComplete({
        summary: { itemsDetected: 0, highConfidence: 0, lowConfidence: 0, overallAccuracy: 0 },
        extractedItems: [],
        error: err.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const openFileBrowser = (accept, type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (e) => handleFileChange(e.target.files[0], type);
    input.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    // Detect type from mime
    let type = "drop";
    if (file.type.startsWith("image/")) type = "receipt";
    else if (file.type === "application/pdf") type = "pdf";
    else if (file.type.startsWith("audio/")) type = "voice";
    handleFileChange(file, type);
  };

  return (
    <div className="bg-[#1F2937] p-8 rounded-xl shadow-lg border border-[#7F92BB]/40 flex flex-col h-full">
      <h2 className="text-xl font-bold text-white mb-6">Upload Data</h2>

      {/* Error banner */}
      {uploadError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          ⚠️ {uploadError}
        </div>
      )}

      <div className="flex flex-col space-y-4 flex-1">

        {/* Snap Receipt */}
        <button
          onClick={() => openFileBrowser("image/*", "receipt")}
          disabled={isUploading}
          className="flex items-center p-4 rounded-xl border border-[#7F92BB]/30 hover:bg-white/5 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div className="mr-4 text-2xl">📸</div>
          <div>
            <h3 className="font-bold text-white text-base">Snap Receipt</h3>
            <p className="text-xs text-slate-400 mt-0.5">Accepts PNG, JPG, JPEG</p>
          </div>
        </button>

        {/* Upload PDF */}
        <button
          onClick={() => openFileBrowser(".pdf,application/pdf", "pdf")}
          disabled={isUploading}
          className="flex items-center p-4 rounded-xl border border-[#7F92BB]/30 hover:bg-white/5 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div className="mr-4 text-2xl">📄</div>
          <div>
            <h3 className="font-bold text-white text-base">Upload PDF</h3>
            <p className="text-xs text-slate-400 mt-0.5">Extract data from PDF invoices</p>
          </div>
        </button>

        {/* Voice Note */}
        <button
          onClick={() => openFileBrowser("audio/*,.m4a,.mp3,.wav", "voice")}
          disabled={isUploading}
          className="flex items-center p-4 rounded-xl border border-[#7F92BB]/30 hover:bg-white/5 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div className="mr-4 text-2xl">🎤</div>
          <div>
            <h3 className="font-bold text-white text-base">Voice Note</h3>
            <p className="text-xs text-slate-400 mt-0.5">Upload voice recordings (m4a/mp3)</p>
          </div>
        </button>

        {/* Drag & Drop Zone */}
        <div
          ref={dropRef}
          onDragOver={(e) => {
            if (isUploading) return;
            e.preventDefault();
            dropRef.current.classList.add("border-[#3B82F6]/70", "bg-white/5");
          }}
          onDragLeave={() => {
            dropRef.current.classList.remove("border-[#3B82F6]/70", "bg-white/5");
          }}
          onDrop={(e) => {
            dropRef.current.classList.remove("border-[#3B82F6]/70", "bg-white/5");
            if (!isUploading) handleDrop(e);
          }}
          onClick={() => { if (!isUploading) openFileBrowser("*/*", "drop"); }}
          className={`mt-4 flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all ${
            isUploading
              ? "border-[#7F92BB]/20 cursor-not-allowed opacity-50"
              : "border-[#7F92BB]/30 hover:border-[#3B82F6]/50 cursor-pointer"
          }`}
        >
          {isUploading ? (
            <>
              <div className="w-6 h-6 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-slate-400 text-sm">AI extracting data...</span>
            </>
          ) : (
            <span className="font-bold text-white">Drag and drop ANY file here</span>
          )}
        </div>

      </div>
    </div>
  );
}