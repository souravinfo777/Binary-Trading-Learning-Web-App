import React from "react";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function AppLogo({ size = "md", className = "", showText = false }: AppLogoProps) {
  const dimensionClass =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* High-Tech Algorithmic Quantum Logo Icon */}
      <div className={`relative ${dimensionClass} shrink-0 group select-none`}>
        {/* Ambient Neon Glow Aura */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-emerald-500/20 to-blue-600/30 rounded-xl blur-sm group-hover:blur-md opacity-80 group-hover:opacity-100 transition-all duration-300" />

        {/* Logo Container */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#0F172A] via-[#090D16] to-[#020408] p-1.5 border border-cyan-500/40 shadow-xl flex items-center justify-center overflow-hidden">
          {/* Subtle Grid Lines inside Icon */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.08)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none" />

          {/* SVG Quantitative Price Action Emblem */}
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-cyan-400 transform group-hover:scale-105 transition-transform duration-300"
          >
            <defs>
              <linearGradient id="logoBullish" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
              <linearGradient id="logoCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
              <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background geometric circuit ring */}
            <circle
              cx="18"
              cy="18"
              r="14"
              stroke="rgba(56, 189, 248, 0.2)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            {/* Institutional Left Wick & Candlestick (Bearish to Bullish transition) */}
            <line x1="10" y1="9" x2="10" y2="27" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
            <rect x="8" y="14" width="4" height="9" rx="1" fill="#334155" stroke="#64748B" strokeWidth="0.8" />

            {/* Institutional High Confluence Bullish Candlestick */}
            <line x1="18" y1="5" x2="18" y2="31" stroke="#34D399" strokeWidth="1.4" strokeLinecap="round" filter="url(#logoGlow)" />
            <rect x="15.5" y="10" width="5" height="15" rx="1.2" fill="url(#logoBullish)" stroke="#6EE7B7" strokeWidth="0.8" />

            {/* Breakout Dynamic Signal / Momentum Chevron Vector */}
            <path
              d="M10 24 L18 14 L26 8"
              stroke="url(#logoCyan)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#logoGlow)"
            />

            {/* Apex Quantum Target Diamond Node */}
            <polygon
              points="26,5 29,8 26,11 23,8"
              fill="url(#logoGold)"
              stroke="#FDE68A"
              strokeWidth="0.8"
              filter="url(#logoGlow)"
            />

            {/* Precision Micro Dot */}
            <circle cx="18" cy="14" r="1.5" fill="#FFFFFF" />
          </svg>

          {/* Micro High-Tech Corner Accents */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400/80" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-emerald-400/80" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-sm tracking-wide font-mono">
              QUANT<span className="text-cyan-400">OTC</span>
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800/60">
              PRO
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">ALGORITHMIC TERMINAL</span>
        </div>
      )}
    </div>
  );
}
