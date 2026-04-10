// import { useState } from "react";

// export default function UploadPortal() {
//   const [selectedFile, setSelectedFile] = useState(null);

//   function handleFileChange(event) {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//   }

//   return (
//     <div className="p-6 bg-zinc-900  border border-zinc-800">
      
//       <h2 className="text-xl font-semibold text-white mb-4">
//         Upload Official Asset
//       </h2>

//       <label
//         htmlFor="fileUpload"
//         className="inline-block px-5 py-3 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition"
//       >
//         Browse File
//       </label>

//       <input
//         id="fileUpload"
//         type="file"
//         onChange={handleFileChange}
//         className="hidden"
//       />

//       {selectedFile && (
//         <p className="mt-3 text-sm text-zinc-300">
//           Selected file: {selectedFile.name}
//         </p>
//       )}

//     </div>
//   );
// }

import { useState, useRef, useCallback } from "react";

const ACCEPTED = ["video/mp4", "video/mov", "video/avi", "image/jpeg", "image/png", "image/webp"];

export default function UploadPortal({ onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | uploading | fingerprinting | done | error
  const inputRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setPhase("error");
      return;
    }
    setFile(f);
    setPhase("idle");
    setProgress(0);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const simulateUpload = () => {
    if (!file) return;
    setPhase("uploading");
    setProgress(0);

    // Simulate upload progress
    let p = 0;
    const uploadInterval = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(uploadInterval);
        setProgress(100);
        setPhase("fingerprinting");

        // Simulate fingerprinting
        setTimeout(() => {
          setPhase("done");
          onUploaded?.({
            id: Date.now(),
            title: file.name.replace(/\.[^.]+$/, ""),
            type: file.type.startsWith("video") ? "video" : "image",
            thumbnail: URL.createObjectURL(file),
            pulseId: `PV-${Math.floor(Math.random() * 900 + 100)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
            status: "Scanning",
            violations: 0,
            uploadedAt: new Date().toISOString().slice(0, 10),
          });
        }, 2000);
      } else {
        setProgress(Math.round(p));
      }
    }, 120);
  };

  const reset = () => {
    setFile(null);
    setPhase("idle");
    setProgress(0);
  };

  const phaseLabel = {
    uploading: "Uploading to Cloud Storage…",
    fingerprinting: "Generating Pulse ID fingerprint…",
    done: "Asset registered successfully",
    error: "Unsupported file type",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-[16px] font-semibold text-white">Upload official asset</h2>
            <p className="text-[12px] text-zinc-500 mt-0.5">MP4, MOV, JPG, PNG, WebP — max 500MB</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors text-zinc-400 hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Drop zone */}
          {phase === "idle" && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 py-10 ${
                dragging
                  ? "border-red-500 bg-red-500/5"
                  : file
                  ? "border-zinc-600 bg-zinc-800/50"
                  : "border-zinc-700 hover:border-zinc-500 bg-zinc-800/30 hover:bg-zinc-800/50"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={ACCEPTED.join(",")}
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {file ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M5 3h10l4 4v14H5V3z" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round" />
                      <path d="M14 3v5h5" stroke="#22c55e" strokeWidth="1.5" />
                      <path d="M9 12h6M9 16h4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-medium text-white">{file.name}</p>
                    <p className="text-[12px] text-zinc-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="text-[11px] text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 16V8M8 12l4-4 4 4" stroke="#71717a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20 16.5A4 4 0 0016 8h-.5A7 7 0 104 15.5" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-medium text-zinc-300">
                      {dragging ? "Drop to upload" : "Drag & drop your file here"}
                    </p>
                    <p className="text-[12px] text-zinc-600 mt-1">or click to browse</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Progress state */}
          {(phase === "uploading" || phase === "fingerprinting") && (
            <div className="rounded-xl bg-zinc-800/50 border border-zinc-700 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-700 shrink-0 overflow-hidden">
                  {file?.type.startsWith("image") ? (
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="#71717a">
                        <path d="M11 8L5 4.5v7L11 8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">{file?.name}</p>
                  <p className="text-[12px] text-zinc-500">{phaseLabel[phase]}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-200"
                    style={{ width: phase === "fingerprinting" ? "100%" : `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-600">
                  <span>{phase === "fingerprinting" ? "Generating pHash…" : `${progress}%`}</span>
                  {phase === "uploading" && <span>{(file?.size / 1024 / 1024).toFixed(1)} MB</span>}
                </div>
              </div>

              {phase === "fingerprinting" && (
                <div className="flex items-center gap-2 text-[12px] text-amber-400 bg-amber-400/5 border border-amber-400/15 rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  Building perceptual fingerprint with pHash algorithm
                </div>
              )}
            </div>
          )}

          {/* Done */}
          {phase === "done" && (
            <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-6 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white">Asset registered</p>
                <p className="text-[12px] text-zinc-500 mt-1">Certificate of Authenticity issued. Scanning starts now.</p>
              </div>
              <button
                onClick={onClose}
                className="mt-1 px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[13px] font-medium rounded-lg transition-colors"
              >
                Back to dashboard
              </button>
            </div>
          )}

          {/* Error */}
          {phase === "error" && (
            <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4 text-[13px] text-red-400">
              Unsupported file type. Please upload MP4, MOV, JPG, PNG or WebP.
              <button onClick={reset} className="ml-2 underline text-zinc-400 hover:text-white">Try again</button>
            </div>
          )}

          {/* Footer actions */}
          {phase === "idle" && (
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={onClose}
                className="px-4 py-2 text-[13px] text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={simulateUpload}
                disabled={!file}
                className="px-5 py-2 bg-red-500 hover:bg-red-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-lg shadow-md shadow-red-500/20 active:scale-95 transition-all"
              >
                Upload & fingerprint
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
