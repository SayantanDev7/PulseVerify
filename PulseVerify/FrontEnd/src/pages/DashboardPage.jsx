
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    setViolations((v) => v.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-[Lexend,sans-serif]">
      <Topbar onUploadClick={() => setShowUpload(true)} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[28px] font-bold tracking-tight text-white">
            Command Center
          </h1>
          <p className="text-[14px] text-zinc-500 mt-1">
            Real-time protection overview — {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {initialStats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors duration-200 group cursor-default"
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
            </motion.div>
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
              <AnimatePresence mode="popLayout">
                {violations.map((v) => {
                  const cfg = levelConfig[v.level];
                  return (
                    <motion.div
                      key={v.id}
                      layout
                      initial={{ opacity: 0, x: -40, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 60, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`group flex items-center gap-3 px-3 py-3 rounded-xl border border-zinc-700/50 bg-zinc-800/40 ${cfg.ring} hover:bg-zinc-800 transition-colors duration-200`}
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {violations.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#22c55e" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <p className="text-[13px] font-medium text-zinc-400">No violations right now</p>
                  <p className="text-[12px] text-zinc-600 mt-1">All assets are secure</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Asset grid — 2 cols */}
          <div className="col-span-2">
            <AssetGrid onAssetClick={(a) => console.log("Selected:", a)} />
          </div>
        </div>

        {/* ── Community Shield — Top Protectors ──────────────── */}
        <div className="mt-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[16px]">🛡️</span>
              <div>
                <h2 className="text-[15px] font-semibold text-white">Community Shield — Top Protectors</h2>
                <p className="text-[12px] text-zinc-500 mt-0.5">Fans helping fight piracy this week</p>
              </div>
            </div>
            <Link to="/community" className="text-[12px] text-red-400 hover:text-red-300 font-medium transition-colors">
              Join community →
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: "Arjun M.", badge: "🏆", points: 4820, verified: 39 },
              { name: "Sarah C.", badge: "🛡️", points: 3950, verified: 31 },
              { name: "Raj P.", badge: "🛡️", points: 3210, verified: 27 },
              { name: "Maria S.", badge: "⚡", points: 2780, verified: 22 },
              { name: "Jake T.", badge: "⚡", points: 2340, verified: 19 },
            ].map((u, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/30 hover:bg-zinc-800/70 transition-colors">
                <span className={`text-[14px] font-bold ${i === 0 ? "text-amber-400" : i === 1 ? "text-zinc-300" : "text-zinc-500"}`}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] font-medium text-white truncate">{u.name}</span>
                    <span className="text-[12px]">{u.badge}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">{u.verified} verified</div>
                </div>
                <span className="text-[12px] font-bold text-amber-400">{u.points.toLocaleString()}</span>
              </div>
            ))}
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
