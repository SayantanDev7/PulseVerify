import { Link } from "react-router-dom";
import Topbar from "../components/layout/Topbar";

const stats = [
  {
    label: "Violations detected",
    value: "128",
    hint: "↑ 12 in last hour",
    hintColor: "text-red-600",
  },
  {
    label: "Takedowns sent",
    value: "94",
    hint: "73% resolved",
    hintColor: "text-green-700",
  },
  {
    label: "Assets tracked",
    value: "36",
    hint: "Videos & images",
    hintColor: "text-gray-400",
  },
];

const violations = [
  { title: "IPL Final highlights — Telegram", meta: "4 min ago · Video", level: "Critical" },
  { title: "Match replay — YouTube", meta: "19 min ago · Stream", level: "Critical" },
  { title: "Official thumbnail — Instagram", meta: "35 min ago · Image", level: "Medium" },
];

export default function DashboardPage() {

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-sm">
      {/* Sidebar */}
      <aside className="w-48 shrink-0 bg-white border-r border-gray-100 flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 py-5">
          <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
              <path d="M8 1L2 3.8v3.7C2 11 4.8 13.6 8 14.2c3.2-.6 6-3.2 6-6.7V3.8L8 1z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">ShieldSport</div>
            <div className="text-[10px] text-gray-400">Hackathon 2026</div>
          </div>
        </div>


        {/* User */}
        <div className="mt-auto border-t border-gray-100 px-4 pt-3 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-[11px] font-medium shrink-0">
              SR
            </div>
            <div>
              <div className="text-[12px] font-medium text-gray-900">Admin Name</div>
              <div className="text-[11px] text-gray-400">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar/>

        {/* Content */}
        <div className="p-5 flex-1">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-100 rounded-xl p-4"
              >
                <div className="text-[11px] text-gray-500 mb-1.5">{s.label}</div>
                <div className="text-2xl font-medium text-gray-900 leading-none">{s.value}</div>
                <div className={`text-[11px] mt-1.5 ${s.hintColor}`}>{s.hint}</div>
              </div>
            ))}
          </div>

          {/* Bottom row */}
            {/* Recent violations */}
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[13px] font-medium text-gray-900">Recent violations</div>
                <div className="text-[11px] text-red-600 cursor-pointer">See all →</div>
              </div>
              <div className="flex flex-col gap-2">
                {violations.map((v, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-gray-50">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        v.level === "Critical" ? "bg-red-50" : "bg-amber-50"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          v.level === "Critical" ? "bg-red-500" : "bg-amber-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-gray-900 truncate">{v.title}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{v.meta}</div>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                        v.level === "Critical"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {v.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Registered assets */}
            
        </div>
      </div>
    </div>
  );
}