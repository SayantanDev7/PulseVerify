// import { useState } from "react";
// import Topbar from "../components/layout/Topbar";
// import VideoCompare from "../components/detection/VideoCompare";
// import ParameterCard from "../components/detection/ParameterCard";

// /* ── Mock detection data ───────────────────────────────────────── */
// const detections = [
//   {
//     id: 1,
//     title: "IPL Final broadcast clip",
//     platform: "Telegram",
//     region: "South Asia",
//     country: "India",
//     city: "Mumbai",
//     similarity: 98,
//     level: "Critical",
//     time: "4 min ago",
//     coords: { x: 67, y: 42 },
//   },
//   {
//     id: 2,
//     title: "Match replay full stream",
//     platform: "YouTube",
//     region: "Southeast Asia",
//     country: "Indonesia",
//     city: "Jakarta",
//     similarity: 94,
//     level: "Critical",
//     time: "19 min ago",
//     coords: { x: 73, y: 50 },
//   },
//   {
//     id: 3,
//     title: "Official thumbnail repost",
//     platform: "Instagram",
//     region: "Middle East",
//     country: "UAE",
//     city: "Dubai",
//     similarity: 81,
//     level: "Medium",
//     time: "35 min ago",
//     coords: { x: 58, y: 40 },
//   },
//   {
//     id: 4,
//     title: "Training session clip",
//     platform: "Reddit",
//     region: "North America",
//     country: "USA",
//     city: "New York",
//     similarity: 76,
//     level: "Medium",
//     time: "1 hr ago",
//     coords: { x: 25, y: 35 },
//   },
//   {
//     id: 5,
//     title: "Trophy ceremony — cropped",
//     platform: "Twitter/X",
//     region: "Europe",
//     country: "UK",
//     city: "London",
//     similarity: 88,
//     level: "Critical",
//     time: "2 hr ago",
//     coords: { x: 48, y: 30 },
//   },
//   {
//     id: 6,
//     title: "Player interview segment",
//     platform: "Facebook",
//     region: "Africa",
//     country: "Nigeria",
//     city: "Lagos",
//     similarity: 72,
//     level: "Low",
//     time: "4 hr ago",
//     coords: { x: 47, y: 48 },
//   },
//   {
//     id: 7,
//     title: "Match highlights reel",
//     platform: "TikTok",
//     region: "East Asia",
//     country: "Japan",
//     city: "Tokyo",
//     similarity: 91,
//     level: "Critical",
//     time: "5 hr ago",
//     coords: { x: 82, y: 34 },
//   },
// ];

// const levelColors = {
//   Critical: {
//     dot: "bg-red-500",
//     text: "text-red-400",
//     badge: "bg-red-500/10 text-red-400 border-red-500/20",
//     ping: "bg-red-500",
//   },
//   Medium: {
//     dot: "bg-amber-400",
//     text: "text-amber-400",
//     badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
//     ping: "bg-amber-400",
//   },
//   Low: {
//     dot: "bg-blue-400",
//     text: "text-blue-400",
//     badge: "bg-blue-400/10 text-blue-400 border-blue-400/20",
//     ping: "bg-blue-400",
//   },
// };

// const platformIcons = {
//   Telegram: "📨",
//   YouTube: "▶️",
//   Instagram: "📷",
//   Reddit: "🔗",
//   "Twitter/X": "𝕏",
//   Facebook: "📘",
//   TikTok: "🎵",
// };

// /* ── Region summary ────────────────────────────────────────────── */
// const regionStats = [
//   { region: "South Asia", count: 42, pct: 33 },
//   { region: "Southeast Asia", count: 28, pct: 22 },
//   { region: "Europe", count: 24, pct: 19 },
//   { region: "North America", count: 18, pct: 14 },
//   { region: "Other", count: 16, pct: 12 },
// ];

// export default function DetectionMapPage() {
//   const [selected, setSelected] = useState(null);
//   const [showUpload, setShowUpload] = useState(false);

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white font-[Lexend,sans-serif]">
//       <Topbar onUploadClick={() => setShowUpload(true)} />

//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {/* Header */}
//         <div className="animate-fade-in-up mb-8">
//           <h1 className="text-[28px] font-bold tracking-tight">
//             Detection Map
//           </h1>
//           <p className="text-[14px] text-zinc-500 mt-1">
//             Global view of unauthorized content propagation
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-5">
//           {/* ── Map area (2 cols) ─────────────────────────────── */}
//           <div className="lg:col-span-2 animate-fade-in-up stagger-1">
//             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative">
//               {/* SVG World Map (simplified) */}
//               <div className="relative w-full aspect-[2/1] bg-zinc-900 overflow-hidden p-4">
//                 {/* Grid overlay */}
//                 <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

//                 {/* Simple continent shapes */}
//                 <svg
//                   viewBox="0 0 100 60"
//                   className="w-full h-full"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   {/* Grid lines */}
//                   {[15, 30, 45].map((y) => (
//                     <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#27272a" strokeWidth="0.15" />
//                   ))}
//                   {[20, 40, 60, 80].map((x) => (
//                     <line key={`v${x}`} x1={x} y1="0" x2={x} y2="60" stroke="#27272a" strokeWidth="0.15" />
//                   ))}

//                   {/* Simplified continent outlines */}
//                   {/* North America */}
//                   <path
//                     d="M10 15 Q15 10 25 12 Q30 13 32 18 Q30 22 28 28 Q24 32 20 35 Q15 33 12 28 Q10 22 10 15Z"
//                     fill="#27272a"
//                     stroke="#3f3f46"
//                     strokeWidth="0.3"
//                   />
//                   {/* South America */}
//                   <path
//                     d="M22 36 Q26 34 28 38 Q30 42 29 48 Q27 53 24 54 Q21 52 20 46 Q20 40 22 36Z"
//                     fill="#27272a"
//                     stroke="#3f3f46"
//                     strokeWidth="0.3"
//                   />
//                   {/* Europe */}
//                   <path
//                     d="M44 14 Q48 12 52 14 Q54 16 52 20 Q50 22 46 22 Q44 20 44 14Z"
//                     fill="#27272a"
//                     stroke="#3f3f46"
//                     strokeWidth="0.3"
//                   />
//                   {/* Africa */}
//                   <path
//                     d="M44 24 Q48 22 52 24 Q55 28 54 36 Q52 44 48 46 Q44 44 43 36 Q43 28 44 24Z"
//                     fill="#27272a"
//                     stroke="#3f3f46"
//                     strokeWidth="0.3"
//                   />
//                   {/* Asia */}
//                   <path
//                     d="M54 10 Q60 8 70 10 Q78 12 84 16 Q86 20 82 26 Q76 30 68 32 Q62 30 56 26 Q54 20 54 10Z"
//                     fill="#27272a"
//                     stroke="#3f3f46"
//                     strokeWidth="0.3"
//                   />
//                   {/* Australia */}
//                   <path
//                     d="M76 42 Q80 40 84 42 Q86 45 84 48 Q80 50 76 48 Q74 46 76 42Z"
//                     fill="#27272a"
//                     stroke="#3f3f46"
//                     strokeWidth="0.3"
//                   />

//                   {/* Detection pins */}
//                   {detections.map((d) => {
//                     const cfg = levelColors[d.level];
//                     return (
//                       <g
//                         key={d.id}
//                         onClick={() => setSelected(d)}
//                         className="cursor-pointer"
//                       >
//                         {/* Ping animation ring */}
//                         <circle
//                           cx={d.coords.x}
//                           cy={d.coords.y}
//                           r="2.5"
//                           className={`${cfg.ping} opacity-30`}
//                           fill="currentColor"
//                         >
//                           <animate
//                             attributeName="r"
//                             values="1.5;3.5;1.5"
//                             dur="2.5s"
//                             repeatCount="indefinite"
//                           />
//                           <animate
//                             attributeName="opacity"
//                             values="0.4;0.1;0.4"
//                             dur="2.5s"
//                             repeatCount="indefinite"
//                           />
//                         </circle>
//                         {/* Solid dot */}
//                         <circle
//                           cx={d.coords.x}
//                           cy={d.coords.y}
//                           r="1.2"
//                           fill={
//                             d.level === "Critical"
//                               ? "#ef4444"
//                               : d.level === "Medium"
//                               ? "#fbbf24"
//                               : "#60a5fa"
//                           }
//                           stroke="#09090b"
//                           strokeWidth="0.3"
//                         />
//                       </g>
//                     );
//                   })}
//                 </svg>

//                 {/* Legend */}
//                 <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-zinc-950/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-zinc-800">
//                   {["Critical", "Medium", "Low"].map((level) => (
//                     <div key={level} className="flex items-center gap-1.5">
//                       <span className={`w-2 h-2 rounded-full ${levelColors[level].dot}`} />
//                       <span className="text-[10px] text-zinc-400 font-medium">{level}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Detection count */}
//                 <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-zinc-800">
//                   <span className="text-[22px] font-bold text-white">{detections.length}</span>
//                   <span className="text-[11px] text-zinc-500 ml-2">active detections</span>
//                 </div>
//               </div>

//               {/* Region breakdown bar */}
//               <div className="px-5 py-4 border-t border-zinc-800">
//                 <div className="flex items-center gap-1 mb-2">
//                   <span className="text-[12px] font-medium text-zinc-400">Distribution by region</span>
//                 </div>
//                 <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800 gap-0.5">
//                   {regionStats.map((r, i) => {
//                     const colors = ["bg-red-500", "bg-amber-400", "bg-blue-400", "bg-purple-400", "bg-zinc-600"];
//                     return (
//                       <div
//                         key={r.region}
//                         className={`${colors[i]} rounded-full transition-all duration-500`}
//                         style={{ width: `${r.pct}%` }}
//                         title={`${r.region}: ${r.pct}%`}
//                       />
//                     );
//                   })}
//                 </div>
//                 <div className="flex items-center gap-4 mt-2">
//                   {regionStats.map((r, i) => {
//                     const colors = ["text-red-400", "text-amber-400", "text-blue-400", "text-purple-400", "text-zinc-500"];
//                     return (
//                       <span key={r.region} className={`text-[10px] ${colors[i]} font-medium`}>
//                         {r.region} {r.pct}%
//                       </span>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── Sidebar — detection list (1 col) ─────────────── */}
//           <div className="animate-fade-in-up stagger-2 flex flex-col gap-4">
//             {/* Platform breakdown */}
//             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
//               <h3 className="text-[14px] font-semibold text-white mb-3">
//                 Platform breakdown
//               </h3>
//               <div className="flex flex-col gap-2">
//                 {Object.entries(
//                   detections.reduce((acc, d) => {
//                     acc[d.platform] = (acc[d.platform] || 0) + 1;
//                     return acc;
//                   }, {})
//                 )
//                   .sort(([, a], [, b]) => b - a)
//                   .map(([platform, count]) => (
//                     <div
//                       key={platform}
//                       className="flex items-center gap-3 px-3 py-2 bg-zinc-800/40 rounded-lg"
//                     >
//                       <span className="text-[14px]">{platformIcons[platform] || "🌐"}</span>
//                       <span className="flex-1 text-[12px] text-zinc-300 font-medium">{platform}</span>
//                       <span className="text-[12px] text-zinc-500 font-mono">{count}</span>
//                     </div>
//                   ))}
//               </div>
//             </div>

//             {/* Recent detections feed */}
//             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex-1">
//               <h3 className="text-[14px] font-semibold text-white mb-3">
//                 Recent detections
//               </h3>
//               <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
//                 {detections.map((d) => {
//                   const cfg = levelColors[d.level];
//                   const isSelected = selected?.id === d.id;
//                   return (
//                     <button
//                       key={d.id}
//                       onClick={() => setSelected(d)}
//                       className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
//                         isSelected
//                           ? "bg-zinc-800 border-zinc-600"
//                           : "bg-zinc-800/30 border-zinc-800 hover:bg-zinc-800/60 hover:border-zinc-700"
//                       }`}
//                     >
//                       {/* Level indicator */}
//                       <div className={`w-7 h-7 rounded-lg ${d.level === "Critical" ? "bg-red-500/10" : d.level === "Medium" ? "bg-amber-400/10" : "bg-blue-400/10"} flex items-center justify-center shrink-0`}>
//                         <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
//                       </div>

//                       {/* Info */}
//                       <div className="flex-1 min-w-0">
//                         <div className="text-[12px] font-medium text-white truncate">
//                           {d.title}
//                         </div>
//                         <div className="text-[10px] text-zinc-500 mt-0.5">
//                           {d.platform} · {d.country} · {d.time}
//                         </div>
//                       </div>

//                       {/* Similarity */}
//                       <div className="shrink-0 text-right">
//                         <div className={`text-[12px] font-bold ${cfg.text}`}>
//                           {d.similarity}%
//                         </div>
//                         <div className="text-[9px] text-zinc-600">match</div>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── Selected detection detail panel ─────────────────── */}
//         {selected && (
//           <div className="animate-fade-in-up mt-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <h3 className="text-[18px] font-semibold text-white">
//                   {selected.title}
//                 </h3>
//                 <p className="text-[13px] text-zinc-500 mt-1">
//                   Detected on {selected.platform} · {selected.city}, {selected.country} · {selected.time}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setSelected(null)}
//                 className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
//               >
//                 <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
//                   <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//                 </svg>
//               </button>
//             </div>

//             <div className="grid md:grid-cols-4 gap-4 mt-5">
//               {[
//                 { label: "Similarity", value: `${selected.similarity}%`, color: levelColors[selected.level].text },
//                 { label: "Severity", value: selected.level, color: levelColors[selected.level].text },
//                 { label: "Platform", value: selected.platform, color: "text-zinc-300" },
//                 { label: "Region", value: selected.region, color: "text-zinc-300" },
//               ].map((item) => (
//                 <div key={item.label} className="bg-zinc-800/50 rounded-xl p-4">
//                   <div className="text-[11px] text-zinc-500 font-medium mb-1">{item.label}</div>
//                   <div className={`text-[20px] font-bold ${item.color}`}>{item.value}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex items-center gap-3 mt-5">
//               <button className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-[13px] font-semibold rounded-xl shadow-md shadow-red-500/20 active:scale-95 transition-all">
//                 Send takedown
//               </button>
//               <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[13px] font-medium rounded-xl transition-all">
//                 View evidence
//               </button>
//               <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[13px] font-medium rounded-xl transition-all">
//                 Dismiss
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


import { useState } from "react";
import Topbar from "../components/layout/Topbar";
// Commented out since we are building them directly into this page to prevent errors
// import VideoCompare from "../components/detection/VideoCompare";
// import ParameterCard from "../components/detection/ParameterCard";

/* ── Mock detection data ───────────────────────────────────────── */
const detections = [
  {
    id: 1,
    title: "IPL Final broadcast clip",
    platform: "Telegram",
    region: "South Asia",
    country: "India",
    city: "Mumbai",
    similarity: 98,
    level: "Critical",
    time: "4 min ago",
    coords: { x: 67, y: 42 },
  },
  {
    id: 2,
    title: "Match replay full stream",
    platform: "YouTube",
    region: "Southeast Asia",
    country: "Indonesia",
    city: "Jakarta",
    similarity: 94,
    level: "Critical",
    time: "19 min ago",
    coords: { x: 73, y: 50 },
  },
  {
    id: 3,
    title: "Official thumbnail repost",
    platform: "Instagram",
    region: "Middle East",
    country: "UAE",
    city: "Dubai",
    similarity: 81,
    level: "Medium",
    time: "35 min ago",
    coords: { x: 58, y: 40 },
  },
  {
    id: 4,
    title: "Training session clip",
    platform: "Reddit",
    region: "North America",
    country: "USA",
    city: "New York",
    similarity: 76,
    level: "Medium",
    time: "1 hr ago",
    coords: { x: 25, y: 35 },
  },
  {
    id: 5,
    title: "Trophy ceremony — cropped",
    platform: "Twitter/X",
    region: "Europe",
    country: "UK",
    city: "London",
    similarity: 88,
    level: "Critical",
    time: "2 hr ago",
    coords: { x: 48, y: 30 },
  },
  {
    id: 6,
    title: "Player interview segment",
    platform: "Facebook",
    region: "Africa",
    country: "Nigeria",
    city: "Lagos",
    similarity: 72,
    level: "Low",
    time: "4 hr ago",
    coords: { x: 47, y: 48 },
  },
  {
    id: 7,
    title: "Match highlights reel",
    platform: "TikTok",
    region: "East Asia",
    country: "Japan",
    city: "Tokyo",
    similarity: 91,
    level: "Critical",
    time: "5 hr ago",
    coords: { x: 82, y: 34 },
  },
];

const levelColors = {
  Critical: {
    dot: "bg-red-500",
    text: "text-red-400",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    ping: "bg-red-500",
  },
  Medium: {
    dot: "bg-amber-400",
    text: "text-amber-400",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    ping: "bg-amber-400",
  },
  Low: {
    dot: "bg-blue-400",
    text: "text-blue-400",
    badge: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    ping: "bg-blue-400",
  },
};

const platformIcons = {
  Telegram: "📨",
  YouTube: "▶️",
  Instagram: "📷",
  Reddit: "🔗",
  "Twitter/X": "𝕏",
  Facebook: "📘",
  TikTok: "🎵",
};

/* ── Region summary ────────────────────────────────────────────── */
const regionStats = [
  { region: "South Asia", count: 42, pct: 33 },
  { region: "Southeast Asia", count: 28, pct: 22 },
  { region: "Europe", count: 24, pct: 19 },
  { region: "North America", count: 18, pct: 14 },
  { region: "Other", count: 16, pct: 12 },
];

/* ── NEW: Gauge Parameters Data ────────────────────────────────── */
const analysisParams = [
  { label: "Visual Match", value: 98, color: "text-red-500", stroke: "#ef4444" },
  { label: "Audio Fingerprint", value: 85, color: "text-amber-500", stroke: "#f59e0b" },
  { label: "Watermark Detect", value: 100, color: "text-red-500", stroke: "#ef4444" },
  { label: "Framerate Sync", value: 72, color: "text-blue-400", stroke: "#60a5fa" },
];

export default function DetectionMapPage() {
  const [selected, setSelected] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-[Lexend,sans-serif]">
      <Topbar onUploadClick={() => setShowUpload(true)} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <h1 className="text-[28px] font-bold tracking-tight">
            Detection Analysis
          </h1>
          <p className="text-[14px] text-zinc-500 mt-1">
            Real-time comparison and global view of unauthorized content
          </p>
        </div>

        {/* ── NEW: Side by Side Video Comparison ──────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6 animate-fade-in-up">
          {/* Original Video Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Original Source
              </h3>
              <span className="text-[12px] text-zinc-500 font-mono">Master Feed</span>
            </div>
            <div className="flex-1 aspect-video bg-black rounded-xl border border-zinc-800 relative flex items-center justify-center overflow-hidden">
              {/* Replace with actual <video> tag when you have the source */}
              <span className="text-zinc-600 font-medium">Original Stream</span>
            </div>
          </div>

          {/* Pirated Video Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Detected Piracy
              </h3>
              <span className="text-[12px] text-red-400/80 font-mono">ID: {selected ? selected.id : "Auto-scan"}</span>
            </div>
            <div className="flex-1 aspect-video bg-black rounded-xl border border-red-500/20 relative flex items-center justify-center overflow-hidden">
               {/* Replace with actual <video> tag when you have the source */}
               <span className="text-zinc-600 font-medium">Pirated Stream</span>
            </div>
          </div>
        </div>

        {/* ── NEW: Car Meter (Gauge) Parameters ──────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10 animate-fade-in-up stagger-1">
          {analysisParams.map((param, i) => {
            // Math for half-circle SVG gauge
            const radius = 40;
            const circumference = Math.PI * radius; 
            const offset = circumference - (param.value / 100) * circumference;

            return (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center relative">
                <h4 className="text-[12px] font-medium text-zinc-400 mb-4">{param.label}</h4>
                
                {/* SVG Car Meter / Gauge */}
                <div className="relative w-28 h-14">
                  <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                    {/* Background track */}
                    <path 
                      d="M 10 50 A 40 40 0 0 1 90 50" 
                      fill="none" 
                      stroke="#27272a" 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                    />
                    {/* Progress track */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke={param.stroke}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Percentage in center */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-1">
                    <span className={`text-[22px] font-bold ${param.color}`}>
                      {param.value}<span className="text-[12px]">%</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── EXISTING CODE (Map & Sidebar) - untouched ──────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Map area (2 cols) */}
          <div className="lg:col-span-2 animate-fade-in-up stagger-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative">
              {/* SVG World Map (simplified) */}
              <div className="relative w-full aspect-[2/1] bg-zinc-900 overflow-hidden p-4">
                {/* Grid overlay */}
                <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

                {/* Simple continent shapes */}
                <svg
                  viewBox="0 0 100 60"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Grid lines */}
                  {[15, 30, 45].map((y) => (
                    <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#27272a" strokeWidth="0.15" />
                  ))}
                  {[20, 40, 60, 80].map((x) => (
                    <line key={`v${x}`} x1={x} y1="0" x2={x} y2="60" stroke="#27272a" strokeWidth="0.15" />
                  ))}

                  {/* Simplified continent outlines */}
                  <path d="M10 15 Q15 10 25 12 Q30 13 32 18 Q30 22 28 28 Q24 32 20 35 Q15 33 12 28 Q10 22 10 15Z" fill="#27272a" stroke="#3f3f46" strokeWidth="0.3" />
                  <path d="M22 36 Q26 34 28 38 Q30 42 29 48 Q27 53 24 54 Q21 52 20 46 Q20 40 22 36Z" fill="#27272a" stroke="#3f3f46" strokeWidth="0.3" />
                  <path d="M44 14 Q48 12 52 14 Q54 16 52 20 Q50 22 46 22 Q44 20 44 14Z" fill="#27272a" stroke="#3f3f46" strokeWidth="0.3" />
                  <path d="M44 24 Q48 22 52 24 Q55 28 54 36 Q52 44 48 46 Q44 44 43 36 Q43 28 44 24Z" fill="#27272a" stroke="#3f3f46" strokeWidth="0.3" />
                  <path d="M54 10 Q60 8 70 10 Q78 12 84 16 Q86 20 82 26 Q76 30 68 32 Q62 30 56 26 Q54 20 54 10Z" fill="#27272a" stroke="#3f3f46" strokeWidth="0.3" />
                  <path d="M76 42 Q80 40 84 42 Q86 45 84 48 Q80 50 76 48 Q74 46 76 42Z" fill="#27272a" stroke="#3f3f46" strokeWidth="0.3" />

                  {/* Detection pins */}
                  {detections.map((d) => {
                    const cfg = levelColors[d.level];
                    return (
                      <g
                        key={d.id}
                        onClick={() => setSelected(d)}
                        className="cursor-pointer"
                      >
                        {/* Ping animation ring */}
                        <circle
                          cx={d.coords.x}
                          cy={d.coords.y}
                          r="2.5"
                          className={`${cfg.ping} opacity-30`}
                          fill="currentColor"
                        >
                          <animate attributeName="r" values="1.5;3.5;1.5" dur="2.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                        {/* Solid dot */}
                        <circle
                          cx={d.coords.x}
                          cy={d.coords.y}
                          r="1.2"
                          fill={d.level === "Critical" ? "#ef4444" : d.level === "Medium" ? "#fbbf24" : "#60a5fa"}
                          stroke="#09090b"
                          strokeWidth="0.3"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-zinc-950/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-zinc-800">
                  {["Critical", "Medium", "Low"].map((level) => (
                    <div key={level} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${levelColors[level].dot}`} />
                      <span className="text-[10px] text-zinc-400 font-medium">{level}</span>
                    </div>
                  ))}
                </div>

                {/* Detection count */}
                <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-zinc-800">
                  <span className="text-[22px] font-bold text-white">{detections.length}</span>
                  <span className="text-[11px] text-zinc-500 ml-2">active detections</span>
                </div>
              </div>

              {/* Region breakdown bar */}
              <div className="px-5 py-4 border-t border-zinc-800">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[12px] font-medium text-zinc-400">Distribution by region</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800 gap-0.5">
                  {regionStats.map((r, i) => {
                    const colors = ["bg-red-500", "bg-amber-400", "bg-blue-400", "bg-purple-400", "bg-zinc-600"];
                    return (
                      <div
                        key={r.region}
                        className={`${colors[i]} rounded-full transition-all duration-500`}
                        style={{ width: `${r.pct}%` }}
                        title={`${r.region}: ${r.pct}%`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  {regionStats.map((r, i) => {
                    const colors = ["text-red-400", "text-amber-400", "text-blue-400", "text-purple-400", "text-zinc-500"];
                    return (
                      <span key={r.region} className={`text-[10px] ${colors[i]} font-medium`}>
                        {r.region} {r.pct}%
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — detection list (1 col) */}
          <div className="animate-fade-in-up stagger-2 flex flex-col gap-4">
            {/* Platform breakdown */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-[14px] font-semibold text-white mb-3">
                Platform breakdown
              </h3>
              <div className="flex flex-col gap-2">
                {Object.entries(
                  detections.reduce((acc, d) => {
                    acc[d.platform] = (acc[d.platform] || 0) + 1;
                    return acc;
                  }, {})
                )
                  .sort(([, a], [, b]) => b - a)
                  .map(([platform, count]) => (
                    <div
                      key={platform}
                      className="flex items-center gap-3 px-3 py-2 bg-zinc-800/40 rounded-lg"
                    >
                      <span className="text-[14px]">{platformIcons[platform] || "🌐"}</span>
                      <span className="flex-1 text-[12px] text-zinc-300 font-medium">{platform}</span>
                      <span className="text-[12px] text-zinc-500 font-mono">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent detections feed */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex-1">
              <h3 className="text-[14px] font-semibold text-white mb-3">
                Recent detections
              </h3>
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                {detections.map((d) => {
                  const cfg = levelColors[d.level];
                  const isSelected = selected?.id === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setSelected(d)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? "bg-zinc-800 border-zinc-600"
                          : "bg-zinc-800/30 border-zinc-800 hover:bg-zinc-800/60 hover:border-zinc-700"
                      }`}
                    >
                      {/* Level indicator */}
                      <div className={`w-7 h-7 rounded-lg ${d.level === "Critical" ? "bg-red-500/10" : d.level === "Medium" ? "bg-amber-400/10" : "bg-blue-400/10"} flex items-center justify-center shrink-0`}>
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-white truncate">
                          {d.title}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          {d.platform} · {d.country} · {d.time}
                        </div>
                      </div>

                      {/* Similarity */}
                      <div className="shrink-0 text-right">
                        <div className={`text-[12px] font-bold ${cfg.text}`}>
                          {d.similarity}%
                        </div>
                        <div className="text-[9px] text-zinc-600">match</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected detection detail panel */}
        {selected && (
          <div className="animate-fade-in-up mt-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[18px] font-semibold text-white">
                  {selected.title}
                </h3>
                <p className="text-[13px] text-zinc-500 mt-1">
                  Detected on {selected.platform} · {selected.city}, {selected.country} · {selected.time}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-5">
              {[
                { label: "Similarity", value: `${selected.similarity}%`, color: levelColors[selected.level].text },
                { label: "Severity", value: selected.level, color: levelColors[selected.level].text },
                { label: "Platform", value: selected.platform, color: "text-zinc-300" },
                { label: "Region", value: selected.region, color: "text-zinc-300" },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="text-[11px] text-zinc-500 font-medium mb-1">{item.label}</div>
                  <div className={`text-[20px] font-bold ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-[13px] font-semibold rounded-xl shadow-md shadow-red-500/20 active:scale-95 transition-all">
                Send takedown
              </button>
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[13px] font-medium rounded-xl transition-all">
                View evidence
              </button>
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[13px] font-medium rounded-xl transition-all">
                Dismiss
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}