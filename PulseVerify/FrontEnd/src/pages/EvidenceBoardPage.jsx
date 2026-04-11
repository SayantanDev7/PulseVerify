import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/layout/Topbar";

/* ── Mock evidence data ────────────────────────────────────────── */
const evidenceCases = [
  {
    id: 1,
    originalTitle: "IPL 2025 Final Highlights",
    originalThumb:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=225&fit=crop",
    detectedTitle: "IPL Final highlights — Telegram",
    detectedThumb:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=225&fit=crop&q=60",
    platform: "Telegram",
    similarity: 98,
    level: "Critical",
    detectedAt: "2026-04-10 · 11:56 PM",
    pulseId: "PV-402-A91X",
    aiConfidence: 97.4,
    modifications: ["Re-encoded (H.264 → H.265)", "Watermark removed", "Cropped 5%"],
    sourceUrl: "t.me/sports_hq/4891",
    status: "open",
  },
  {
    id: 2,
    originalTitle: "Press Conference — Post Match",
    originalThumb:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop",
    detectedTitle: "Match replay — YouTube",
    detectedThumb:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop&q=60",
    platform: "YouTube",
    similarity: 94,
    level: "Critical",
    detectedAt: "2026-04-10 · 11:37 PM",
    pulseId: "PV-411-C33M",
    aiConfidence: 93.1,
    modifications: ["Mirrored horizontally", "Audio replaced", "Resolution downscaled"],
    sourceUrl: "youtube.com/watch?v=abc123",
    status: "open",
  },
  {
    id: 3,
    originalTitle: "Official Match Thumbnail Pack",
    originalThumb:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=225&fit=crop",
    detectedTitle: "Official thumbnail — Instagram",
    detectedThumb:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=225&fit=crop&q=60",
    platform: "Instagram",
    similarity: 81,
    level: "Medium",
    detectedAt: "2026-04-10 · 11:21 PM",
    pulseId: "PV-418-T55Z",
    aiConfidence: 80.2,
    modifications: ["Color grading changed", "Text overlay added", "Cropped 15%"],
    sourceUrl: "instagram.com/p/xyz789",
    status: "open",
  },
  {
    id: 4,
    originalTitle: "Training Session — Day 3",
    originalThumb:
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&h=225&fit=crop",
    detectedTitle: "Training session clip — Reddit",
    detectedThumb:
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&h=225&fit=crop&q=60",
    platform: "Reddit",
    similarity: 76,
    level: "Medium",
    detectedAt: "2026-04-10 · 10:56 PM",
    pulseId: "PV-430-R88B",
    aiConfidence: 75.8,
    modifications: ["Speed changed (1.25x)", "Intro/outro trimmed"],
    sourceUrl: "reddit.com/r/sports/comments/abc123",
    status: "resolved",
  },
  {
    id: 5,
    originalTitle: "Team Entrance — Opening Ceremony",
    originalThumb:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=225&fit=crop",
    detectedTitle: "Ceremony footage repost — TikTok",
    detectedThumb:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=225&fit=crop&q=60",
    platform: "TikTok",
    similarity: 89,
    level: "Critical",
    detectedAt: "2026-04-10 · 09:12 PM",
    pulseId: "PV-405-H72K",
    aiConfidence: 88.7,
    modifications: ["Vertical crop (16:9 → 9:16)", "Music overlay", "Logo blurred"],
    sourceUrl: "tiktok.com/@user/video/123",
    status: "takedown_sent",
  },
];

const levelConfig = {
  Critical: {
    dot: "bg-red-500",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    text: "text-red-400",
    bar: "bg-red-500",
  },
  Medium: {
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    text: "text-amber-400",
    bar: "bg-amber-400",
  },
};

const statusConfig = {
  open: { label: "Open", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  takedown_sent: { label: "Takedown sent", color: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  resolved: { label: "Resolved", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  dismissed: { label: "Dismissed", color: "bg-zinc-700/50 text-zinc-400 border-zinc-600" },
};

const filterOptions = ["All", "open", "takedown_sent", "resolved"];

export default function EvidenceBoardPage() {
  const [cases, setCases] = useState(evidenceCases);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showUpload, setShowUpload] = useState(false);

  const filtered = filter === "All" ? cases : cases.filter((c) => c.status === filter);

  const handleAction = (id, action) => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: action } : c))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-[Lexend,sans-serif]">
      <Topbar onUploadClick={() => setShowUpload(true)} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="animate-fade-in-up flex items-end justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">
              Evidence Board
            </h1>
            <p className="text-[14px] text-zinc-500 mt-1">
              Review and act on detected content violations
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] font-semibold rounded-lg">
              {cases.filter((c) => c.status === "open").length} open
            </span>
            <span className="px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[12px] font-semibold rounded-lg">
              {cases.filter((c) => c.status === "takedown_sent").length} pending
            </span>
            <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[12px] font-semibold rounded-lg">
              {cases.filter((c) => c.status === "resolved").length} resolved
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="animate-fade-in-up stagger-1 flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit mb-6">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[12px] font-medium rounded-lg transition-all duration-150 ${
                filter === f
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f === "All"
                ? "All cases"
                : f === "takedown_sent"
                ? "Takedown sent"
                : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Evidence cards */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => {
              const cfg = levelConfig[c.level];
              const sCfg = statusConfig[c.status];
              const isExpanded = expanded === c.id;

              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28, delay: i * 0.06 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors duration-300"
                >
                {/* Main row */}
                <div
                  className="flex items-center gap-5 p-5 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : c.id)}
                >
                  {/* Side-by-side thumbnails */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
                      <img
                        src={c.originalThumb}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 8H12M10 5l3 3-3 3" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 border border-red-500/30">
                      <img
                        src={c.detectedThumb}
                        alt="Detected"
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-semibold text-white truncate">
                        {c.detectedTitle}
                      </h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sCfg.color}`}>
                        {sCfg.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-zinc-500">
                      Original: {c.originalTitle} · <span className="font-mono text-zinc-600">{c.pulseId}</span>
                    </p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      {c.platform} · {c.detectedAt}
                    </p>
                  </div>

                  {/* Similarity gauge */}
                  <div className="shrink-0 text-center w-20">
                    <div className={`text-[24px] font-bold ${cfg.text}`}>
                      {c.similarity}%
                    </div>
                    <div className="text-[10px] text-zinc-600 font-medium">similarity</div>
                    <div className="w-full mt-1.5 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
                        style={{ width: `${c.similarity}%` }}
                      />
                    </div>
                  </div>

                  {/* Severity badge */}
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${cfg.badge} shrink-0`}>
                    {c.level}
                  </span>

                  {/* Chevron */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`text-zinc-500 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Expandable detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-zinc-800 px-5 py-5 bg-zinc-900/50">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* AI Report */}
                      <div className="md:col-span-2">
                        <h4 className="text-[13px] font-semibold text-white mb-3 flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2a7 7 0 017 7v1a7 7 0 01-14 0V9a7 7 0 017-7z" stroke="#ef4444" strokeWidth="1.5" />
                            <circle cx="12" cy="10" r="2" fill="#ef4444" />
                          </svg>
                          AI Analysis Report
                        </h4>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-zinc-800/50 rounded-xl p-3">
                            <div className="text-[10px] text-zinc-500 font-medium mb-1">AI Confidence</div>
                            <div className="text-[20px] font-bold text-white">{c.aiConfidence}%</div>
                          </div>
                          <div className="bg-zinc-800/50 rounded-xl p-3">
                            <div className="text-[10px] text-zinc-500 font-medium mb-1">Source URL</div>
                            <div className="text-[12px] text-red-400 font-mono truncate">{c.sourceUrl}</div>
                          </div>
                        </div>

                        <h5 className="text-[12px] font-medium text-zinc-400 mb-2">
                          Detected modifications
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {c.modifications.map((mod) => (
                            <span
                              key={mod}
                              className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-[11px] text-zinc-400"
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div>
                        <h4 className="text-[13px] font-semibold text-white mb-3">
                          Quick actions
                        </h4>
                        <div className="flex flex-col gap-2">
                          {c.status === "open" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(c.id, "takedown_sent");
                                }}
                                className="w-full py-2.5 bg-red-500 hover:bg-red-400 text-white text-[13px] font-semibold rounded-xl shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                                Send takedown notice
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(c.id, "dismissed");
                                }}
                                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[13px] font-medium rounded-xl transition-all"
                              >
                                Dismiss case
                              </button>
                            </>
                          )}
                          {c.status === "takedown_sent" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(c.id, "resolved");
                              }}
                              className="w-full py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-[13px] font-semibold rounded-xl transition-all"
                            >
                              Mark as resolved
                            </button>
                          )}
                          {c.status === "resolved" && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-green-500/5 border border-green-500/20 rounded-xl">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className="text-[12px] text-green-400 font-medium">
                                This case has been resolved
                              </span>
                            </div>
                          )}
                          {c.status === "dismissed" && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl">
                              <span className="text-[12px] text-zinc-500 font-medium">
                                Case dismissed
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#22c55e" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="text-[14px] font-medium text-zinc-400">No cases match this filter</p>
            <p className="text-[12px] text-zinc-600 mt-1">Try switching to "All cases"</p>
          </div>
        )}
      </main>
    </div>
  );
}
