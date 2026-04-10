// import { Link } from "react-router-dom";
// import Topbar from "../components/layout/Topbar";

// const stats = [
//   {
//     label: "Violations detected",
//     value: "128",
//     hint: "↑ 12 in last hour",
//     hintColor: "text-red-600",
//   },
//   {
//     label: "Takedowns sent",
//     value: "94",
//     hint: "73% resolved",
//     hintColor: "text-green-700",
//   },
//   {
//     label: "Assets tracked",
//     value: "36",
//     hint: "Videos & images",
//     hintColor: "text-gray-400",
//   },
// ];

// const violations = [
//   { title: "IPL Final highlights — Telegram", meta: "4 min ago · Video", level: "Critical" },
//   { title: "Match replay — YouTube", meta: "19 min ago · Stream", level: "Critical" },
//   { title: "Official thumbnail — Instagram", meta: "35 min ago · Image", level: "Medium" },
// ];

// export default function DashboardPage() {

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-sans text-sm">
//       {/* Sidebar */}
//       <aside className="w-48 shrink-0 bg-white border-r border-gray-100 flex flex-col">
//         {/* Brand */}
//         <div className="flex items-center gap-2.5 px-4 py-5">
//           <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
//             <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
//               <path d="M8 1L2 3.8v3.7C2 11 4.8 13.6 8 14.2c3.2-.6 6-3.2 6-6.7V3.8L8 1z" />
//             </svg>
//           </div>
//           <div>
//             <div className="text-sm font-medium text-gray-900">ShieldSport</div>
//             <div className="text-[10px] text-gray-400">Hackathon 2026</div>
//           </div>
//         </div>


//         {/* User */}
//         <div className="mt-auto border-t border-gray-100 px-4 pt-3 pb-4">
//           <div className="flex items-center gap-2.5">
//             <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-[11px] font-medium shrink-0">
//               SR
//             </div>
//             <div>
//               <div className="text-[12px] font-medium text-gray-900">Admin Name</div>
//               <div className="text-[11px] text-gray-400">Admin</div>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Main */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Topbar */}
//         <Topbar/>

//         {/* Content */}
//         <div className="p-5 flex-1">
//           {/* Stats */}
//           <div className="grid grid-cols-3 gap-2.5 mb-3">
//             {stats.map((s) => (
//               <div
//                 key={s.label}
//                 className="bg-white border border-gray-100 rounded-xl p-4"
//               >
//                 <div className="text-[11px] text-gray-500 mb-1.5">{s.label}</div>
//                 <div className="text-2xl font-medium text-gray-900 leading-none">{s.value}</div>
//                 <div className={`text-[11px] mt-1.5 ${s.hintColor}`}>{s.hint}</div>
//               </div>
//             ))}
//           </div>

//           {/* Bottom row */}
//             {/* Recent violations */}
//             <div className="bg-white border border-gray-100 rounded-xl p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="text-[13px] font-medium text-gray-900">Recent violations</div>
//                 <div className="text-[11px] text-red-600 cursor-pointer">See all →</div>
//               </div>
//               <div className="flex flex-col gap-2">
//                 {violations.map((v, i) => (
//                   <div key={i} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-gray-50">
//                     <div
//                       className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
//                         v.level === "Critical" ? "bg-red-50" : "bg-amber-50"
//                       }`}
//                     >
//                       <span
//                         className={`w-2 h-2 rounded-full ${
//                           v.level === "Critical" ? "bg-red-500" : "bg-amber-500"
//                         }`}
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="text-[12px] font-medium text-gray-900 truncate">{v.title}</div>
//                       <div className="text-[11px] text-gray-400 mt-0.5">{v.meta}</div>
//                     </div>
//                     <span
//                       className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
//                         v.level === "Critical"
//                           ? "bg-red-50 text-red-700"
//                           : "bg-amber-50 text-amber-700"
//                       }`}
//                     >
//                       {v.level}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Registered assets */}
            
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import AssetGrid from "../components/vault/AssetGrid";
import UploadPortal from "../components/vault/UploadPortal";

const initialStats = [
  {
    label: "Violations detected",
    value: 128,
    hint: "↑ 12 in last hour",
    hintColor: "text-red-400",
    accent: "text-red-400",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Takedowns sent",
    value: 94,
    hint: "73% resolved",
    hintColor: "text-green-400",
    accent: "text-green-400",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Assets tracked",
    value: 36,
    hint: "Videos & images",
    hintColor: "text-zinc-500",
    accent: "text-zinc-300",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const initialViolations = [
  {
    id: 1,
    title: "IPL Final highlights — Telegram",
    meta: "4 min ago · Video",
    level: "Critical",
    platform: "Telegram",
    similarity: 98,
  },
  {
    id: 2,
    title: "Match replay — YouTube",
    meta: "19 min ago · Stream",
    level: "Critical",
    platform: "YouTube",
    similarity: 94,
  },
  {
    id: 3,
    title: "Official thumbnail — Instagram",
    meta: "35 min ago · Image",
    level: "Medium",
    platform: "Instagram",
    similarity: 81,
  },
  {
    id: 4,
    title: "Training session clip — Reddit",
    meta: "1 hr ago · Video",
    level: "Medium",
    platform: "Reddit",
    similarity: 76,
  },
];

const levelConfig = {
  Critical: {
    dot: "bg-red-500",
    bg: "bg-red-500/10",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    ring: "hover:border-red-500/30",
  },
  Medium: {
    dot: "bg-amber-400",
    bg: "bg-amber-400/10",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    ring: "hover:border-amber-400/30",
  },
};

function AnimatedNumber({ target }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{display}</>;
}

export default function DashboardPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [violations, setViolations] = useState(initialViolations);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [dismissed, setDismissed] = useState(new Set());

  const handleDismiss = (id) => {
    setDismissed((prev) => new Set([...prev, id]));
    setTimeout(() => setViolations((v) => v.filter((x) => x.id !== id)), 400);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-[Lexend,sans-serif]">
      <Topbar onUploadClick={() => setShowUpload(true)} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold tracking-tight text-white">
            Command Center
          </h1>
          <p className="text-[14px] text-zinc-500 mt-1">
            Real-time protection overview — {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {initialStats.map((s, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-[12px] text-zinc-500 font-medium leading-tight">{s.label}</div>
                <div className={`${s.accent} opacity-50 group-hover:opacity-80 transition-opacity`}>
                  {s.icon}
                </div>
              </div>
              <div className={`text-[36px] font-bold leading-none tracking-tight ${s.accent}`}>
                <AnimatedNumber target={s.value} />
              </div>
              <div className={`text-[12px] mt-2 font-medium ${s.hintColor}`}>{s.hint}</div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-5 gap-4">
          {/* Violation feed — 3 cols */}
          <div className="col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[15px] font-semibold text-white">Live violation feed</h2>
                <p className="text-[12px] text-zinc-500 mt-0.5">Unauthorized use detected in real time</p>
              </div>
              <Link
                to="/vault"
                className="text-[12px] text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Evidence board →
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {violations.map((v) => {
                const cfg = levelConfig[v.level];
                const isDismissed = dismissed.has(v.id);
                return (
                  <div
                    key={v.id}
                    className={`group flex items-center gap-3 px-3 py-3 rounded-xl border border-zinc-700/50 bg-zinc-800/40 ${cfg.ring} hover:bg-zinc-800 transition-all duration-200 ${isDismissed ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                    style={{ transition: "opacity 0.3s, transform 0.3s" }}
                  >
                    {/* Level dot */}
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-white truncate">{v.title}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{v.meta}</div>
                    </div>

                    {/* Similarity score */}
                    <div className="text-right shrink-0">
                      <div className="text-[13px] font-bold text-white">{v.similarity}%</div>
                      <div className="text-[10px] text-zinc-600">match</div>
                    </div>

                    {/* Badge */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${cfg.badge}`}>
                      {v.level}
                    </span>

                    {/* Dismiss */}
                    <button
                      onClick={() => handleDismiss(v.id)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center shrink-0 transition-all"
                    >
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                );
              })}

              {violations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#22c55e" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <p className="text-[13px] font-medium text-zinc-400">No violations right now</p>
                  <p className="text-[12px] text-zinc-600 mt-1">All assets are secure</p>
                </div>
              )}
            </div>
          </div>

          {/* Asset grid — 2 cols */}
          <div className="col-span-2">
            <AssetGrid onAssetClick={(a) => console.log("Selected:", a)} />
          </div>
        </div>
      </main>

      {/* Upload modal */}
      {showUpload && (
        <UploadPortal
          onClose={() => setShowUpload(false)}
          onUploaded={(asset) => {
            console.log("New asset:", asset);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
}
