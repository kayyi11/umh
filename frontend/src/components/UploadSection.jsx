// frontend/src/components/UploadSection.jsx

export default function UploadSection({ onUploadStart, onUploadComplete }) {
  
  const handleFileChange = async (file, type) => {
    if (!file) return;

    onUploadStart(); // Triggers the "AI Processing Log" animation

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      // Delay for 5 seconds to show the AI progress logs to the user
      setTimeout(() => {
        onUploadComplete(data);
      }, 5000); 

    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  // ✅ Functional Helper: Opens file browser with specific filters
  const openFileBrowser = (accept, type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = (e) => handleFileChange(e.target.files[0], type);
    input.click();
  };

  return (
    <div className="bg-[#1F2937] p-8 rounded-xl shadow-lg border border-[#7F92BB]/40 flex flex-col h-full">
      <h2 className="text-xl font-bold text-white mb-6">Upload Data</h2>

      <div className="flex flex-col space-y-4 flex-1">
        {/* 1. Snap Receipt - Only Images */}
        <button 
          onClick={() => openFileBrowser("image/*", "receipt")}
          className="flex items-center p-4 rounded-xl border border-[#7F92BB]/30 hover:bg-white/5 transition-all text-left group"
        >
          <div className="mr-4 text-2xl">📸</div>
          <div>
            <h3 className="font-bold text-white text-base">Snap Receipt</h3>
            <p className="text-xs text-slate-400 mt-0.5">Accepts PNG, JPG, JPEG</p>
          </div>
        </button>

        {/* 2. Upload PDF - Only PDFs */}
        <button 
          onClick={() => openFileBrowser(".pdf,application/pdf", "pdf")}
          className="flex items-center p-4 rounded-xl border border-[#7F92BB]/30 hover:bg-white/5 transition-all text-left group"
        >
          <div className="mr-4 text-2xl">📄</div>
          <div>
            <h3 className="font-bold text-white text-base">Upload PDF</h3>
            <p className="text-xs text-slate-400 mt-0.5">Extract data from PDF invoices</p>
          </div>
        </button>

        {/* 3. Voice Note - Only Audio (m4a, mp3, wav) */}
        <button 
          onClick={() => openFileBrowser("audio/*,.m4a,.mp3,.wav", "voice")}
          className="flex items-center p-4 rounded-xl border border-[#7F92BB]/30 hover:bg-white/5 transition-all text-left group"
        >
          <div className="mr-4 text-2xl">🎤</div>
          <div>
            <h3 className="font-bold text-white text-base">Voice Note</h3>
            <p className="text-xs text-slate-400 mt-0.5">Upload voice recordings (m4a/mp3)</p>
          </div>
        </button>

        {/* 4. Drag & Drop - Any file type */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileChange(e.dataTransfer.files[0], 'drop');
          }}
          onClick={() => openFileBrowser("*/*", "drop")} // Acts as "Browse All"
          className="mt-4 flex-1 border-2 border-dashed border-[#7F92BB]/30 rounded-xl flex items-center justify-center p-6 hover:border-[#3B82F6]/50 cursor-pointer text-center"
        >
          <span className="font-bold text-white">Drag and drop ANY file here</span>
        </div>
      </div>
    </div>
  );
}