import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Vault", to: "/vault" },
  { label: "Detection Map", to: "/detection-map" },
  { label: "Evidence", to: "/evidence" },
  { label: "Community", to: "/community" },
];

export default function Topbar({ onUploadClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 flex items-center gap-6 px-6 h-14 border-b transition-all duration-200 ${
        scrolled
          ? "bg-zinc-950/95 backdrop-blur border-zinc-800"
          : "bg-zinc-950 border-zinc-900"
      }`}
    >
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2.5 mr-4 group">
        <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/40 transition-shadow">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
            <path d="M8 1L2 3.8v3.7C2 11 4.8 13.6 8 14.2c3.2-.6 6-3.2 6-6.7V3.8L8 1z" />
          </svg>
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-white">
          PulseVerify
        </span>
      </NavLink>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[11px] font-medium text-green-400">Monitoring live</span>
        </div>

        {/* Upload button */}
        <button
          onClick={onUploadClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-500 hover:bg-red-400 active:scale-95 text-white text-[12px] font-semibold rounded-lg shadow-md shadow-red-500/20 transition-all duration-150"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add asset
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-semibold text-zinc-300 cursor-pointer hover:border-zinc-500 transition-colors">
          SR
        </div>
      </div>
    </header>
  );
}
