import React from 'react'

const AssetGrid = () => {
    const assets = [
  { name: "IPL 2026 Final broadcast", meta: "Video · Active monitoring", status: "warn" },
  { name: "Match thumbnail pack", meta: "40 images · All clear", status: "safe" },
  { name: "Logo & branding kit", meta: "12 assets · Protected", status: "safe" },
];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[13px] font-medium text-gray-900">Registered assets</div>
                <div className="text-[11px] text-red-600 cursor-pointer">Open vault →</div>
              </div>
              <div className="flex flex-col gap-2">
                {assets.map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="#9ca3af">
                        <path d="M8 1L2 3.8v3.7C2 11 4.8 13.6 8 14.2c3.2-.6 6-3.2 6-6.7V3.8L8 1z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-gray-900 truncate">{a.name}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{a.meta}</div>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        a.status === "safe" ? "bg-green-500" : "bg-amber-400"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
  )
}

export default AssetGrid