import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/layout/Topbar";
import UploadPortal from "../components/vault/UploadPortal";
import { assets as initialAssets } from "../features/assets/assetData";

const statusConfig = {
  Secure: {
    dot: "bg-green-500",
    badge: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  Scanning: {
    dot: "bg-amber-400 animate-pulse",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  Violated: {
    dot: "bg-red-500",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

const typeFilters = ["All", "video", "image"];
const statusFilters = ["All", "Secure", "Scanning", "Violated"];

export default function VaultPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [assets, setAssets] = useState(initialAssets);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = assets.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || a.type === typeFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const statCounts = {
    total: assets.length,
    secure: assets.filter((a) => a.status === "Secure").length,
    scanning: assets.filter((a) => a.status === "Scanning").length,
    violated: assets.filter((a) => a.status === "Violated").length,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-[Lexend,sans-serif]">
      <Topbar onUploadClick={() => setShowUpload(true)} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="animate-fade-in-up flex items-end justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">
              Asset Vault
            </h1>
            <p className="text-[14px] text-zinc-500 mt-1">
              All registered and monitored media assets
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white text-[13px] font-semibold rounded-xl shadow-md shadow-red-500/20 active:scale-95 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Upload asset
          </button>
        </div>

        {/* Stat pills */}
        <div className="animate-fade-in-up stagger-1 grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total assets", value: statCounts.total, color: "text-white" },
            { label: "Secure", value: statCounts.secure, color: "text-green-400" },
            { label: "Scanning", value: statCounts.scanning, color: "text-amber-400" },
            { label: "Violated", value: statCounts.violated, color: "text-red-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
            >
              <div className="text-[11px] text-zinc-500 font-medium mb-1">{s.label}</div>
              <div className={`text-[28px] font-bold leading-none ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="animate-fade-in-up stagger-2 flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="flex-1 min-w-[220px] relative">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets…"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[13px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            {typeFilters.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-150 ${
                  typeFilter === t
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t === "All" ? "All types" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-150 ${
                  statusFilter === s
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {s === "All" ? "All status" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Asset grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((a, i) => {
              const cfg = statusConfig[a.status];
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 250, damping: 25, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/50 transition-colors duration-300"
                >
                {/* Thumbnail */}
                <div className="relative h-44 bg-zinc-800 overflow-hidden">
                  <img
                    src={a.thumbnail}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-white rounded-lg uppercase">
                      {a.type}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-semibold backdrop-blur-sm ${cfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {a.status}
                    </span>
                  </div>

                  {/* Violation overlay */}
                  {a.violations > 0 && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-1 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 text-[10px] font-bold rounded-lg">
                        {a.violations} violations
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-[14px] font-semibold text-white truncate mb-1">
                    {a.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {a.pulseId}
                    </span>
                    <span className="text-[11px] text-zinc-600">
                      {a.uploadedAt}
                    </span>
                  </div>
                </div>
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
                <circle cx="11" cy="11" r="7" stroke="#71717a" strokeWidth="1.5" />
                <path d="M16 16l4.5 4.5" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[14px] font-medium text-zinc-400">No assets found</p>
            <p className="text-[12px] text-zinc-600 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </main>

      {/* Upload modal */}
      {showUpload && (
        <UploadPortal
          onClose={() => setShowUpload(false)}
          onUploaded={(asset) => {
            setAssets((prev) => [asset, ...prev]);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
}