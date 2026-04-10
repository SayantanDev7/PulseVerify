import React from 'react'

const Topbar = () => {
  return (
    <div className="bg-white border-b border-gray-100 h-13 flex items-center gap-3 px-5">
          <div className="text-[14px] font-medium text-gray-900 flex flex-1 gap-5">
            <span>Dashboard</span>
            <span>AssetGrid</span>
            <span>Search</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span className="text-[11px] text-green-700 font-medium">Monitoring live</span>
          <button className="ml-2 px-3 py-1.5 text-[12px] bg-red-500 text-white rounded-lg border border-red-500">
            + Add asset
          </button>
        </div>
  )
}

export default Topbar