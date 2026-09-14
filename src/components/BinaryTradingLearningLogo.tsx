import React from "react";

interface BinaryTradingLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showFullText?: boolean;
}

/**
 * High-fidelity Vector Recreation of the "BINARY TRADING LEARNING" Emblem
 * Features:
 * - Open book with white layered pages & vibrant green spine
 * - 6 Institutional Candlesticks (Green, Green, Red pullback, Green, Green, Green)
 * - Dynamic upward trending green breakout arrow
 * - "BINARY TRADING" and "— LEARNING —" typography
 */
export function BinaryTradingLearningIcon({
  className = "w-full h-full",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Vibrant Emerald & Mint Gradients */}
        <linearGradient id="btlGreenGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="60%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        <linearGradient id="btlArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#4ADE80" />
        </linearGradient>

        <linearGradient id="btlRedGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="60%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#F87171" />
        </linearGradient>

        <filter id="btlGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ========================================================
          CANDLESTICKS (Emerging Upwards Out of Book)
          Sequence: Green, Green, Red, Green, Green, Green
          ======================================================== */}
      {/* Candle 1 (Green - Small) */}
      <line x1="26" y1="34" x2="26" y2="46" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="23.5" y="37" width="5" height="6.5" rx="0.8" fill="url(#btlGreenGrad)" stroke="#4ADE80" strokeWidth="0.5" />

      {/* Candle 2 (Green - Medium) */}
      <line x1="34" y1="27" x2="34" y2="47" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="31.5" y="30" width="5" height="12" rx="0.8" fill="url(#btlGreenGrad)" stroke="#4ADE80" strokeWidth="0.5" />

      {/* Candle 3 (Red - Pullback) */}
      <line x1="42" y1="28" x2="42" y2="48" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="39.5" y="31" width="5" height="12" rx="0.8" fill="url(#btlRedGrad)" stroke="#FCA5A5" strokeWidth="0.5" />

      {/* Candle 4 (Green - Higher) */}
      <line x1="50" y1="22" x2="50" y2="45" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="47.5" y="25" width="5" height="15" rx="0.8" fill="url(#btlGreenGrad)" stroke="#4ADE80" strokeWidth="0.5" />

      {/* Candle 5 (Green - High Impulsive) */}
      <line x1="58" y1="18" x2="58" y2="42" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="55.5" y="21" width="5" height="15" rx="0.8" fill="url(#btlGreenGrad)" stroke="#4ADE80" strokeWidth="0.5" />

      {/* Candle 6 (Green - Peak Confluence) */}
      <line x1="66" y1="14" x2="66" y2="39" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="63.5" y="17" width="5" height="14" rx="0.8" fill="url(#btlGreenGrad)" stroke="#4ADE80" strokeWidth="0.5" />

      {/* ========================================================
          DYNAMIC UPWARD BREAKOUT ARROW
          ======================================================== */}
      {/* Curved Arrow Body sweeping across candlesticks */}
      <path
        d="M 46 48 C 52 44, 62 36, 73 24 L 79 17"
        stroke="url(#btlArrowGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#btlGlow)"
      />
      {/* Arrowhead */}
      <path
        d="M 72 13 L 83 15 L 77 26 Z"
        fill="#22C55E"
        stroke="#86EFAC"
        strokeWidth="0.8"
        strokeLinejoin="round"
        filter="url(#btlGlow)"
      />

      {/* ========================================================
          OPEN BOOK (BASE)
          White Pages + Deep Green Lower Spine
          ======================================================== */}
      {/* Open Book Pages Left Wing (White Layers) */}
      <path
        d="M 12 59 L 48 50 L 48 64 L 14 69 Z"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="0.6"
      />
      {/* Left Wing Interior Page Line */}
      <path
        d="M 17 55 L 48 50 L 48 57 L 15 63 Z"
        fill="#F8FAFC"
      />
      <line x1="17" y1="55" x2="48" y2="50" stroke="#0F172A" strokeWidth="0.8" />
      <line x1="15" y1="62" x2="48" y2="57" stroke="#334155" strokeWidth="0.7" />

      {/* Open Book Pages Right Wing (White Layers) */}
      <path
        d="M 88 59 L 52 50 L 52 64 L 86 69 Z"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="0.6"
      />
      {/* Right Wing Interior Page Line */}
      <path
        d="M 83 55 L 52 50 L 52 57 L 85 63 Z"
        fill="#F8FAFC"
      />
      <line x1="83" y1="55" x2="52" y2="50" stroke="#0F172A" strokeWidth="0.8" />
      <line x1="85" y1="62" x2="52" y2="57" stroke="#334155" strokeWidth="0.7" />

      {/* Book Center Binding Notch (Dark Spine V) */}
      <polygon points="48,50 52,50 50,65" fill="#090E17" />

      {/* Book Bottom Green Spine / Cover Curved Foundation */}
      <path
        d="M 11 60 C 26 62, 42 66, 50 69 C 58 66, 74 62, 89 60 C 85 67, 72 70, 50 72 C 28 70, 15 67, 11 60 Z"
        fill="#10B981"
        stroke="#34D399"
        strokeWidth="0.8"
        filter="url(#btlGlow)"
      />

      {/* Bottom Center Spine Node */}
      <circle cx="50" cy="70" r="1.5" fill="#FFFFFF" />

      {/* ========================================================
          TYPOGRAPHY (INSIDE EMBLEM)
          "BINARY TRADING" and "— LEARNING —"
          ======================================================== */}
      {/* "BINARY" in White */}
      <text
        x="10"
        y="83"
        fill="#FFFFFF"
        fontSize="12.5"
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="0.05em"
      >
        BINARY
      </text>

      {/* "TRADING" in Vibrant Green */}
      <text
        x="53"
        y="83"
        fill="#22C55E"
        fontSize="12.5"
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="0.05em"
      >
        TRADING
      </text>

      {/* Subtitle: "— LEARNING —" */}
      {/* Left green line */}
      <line x1="12" y1="91.5" x2="26" y2="91.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
      {/* Text "LEARNING" */}
      <text
        x="50"
        y="94"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="7.5"
        fontWeight="800"
        fontFamily="sans-serif"
        letterSpacing="0.22em"
      >
        LEARNING
      </text>
      {/* Right green line */}
      <line x1="74" y1="91.5" x2="88" y2="91.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Complete Logo Box / App Emblem
 */
export function BinaryTradingLearningLogo({
  size = "md",
  className = "",
  showText = false,
}: BinaryTradingLogoProps) {
  const dimensionClass =
    size === "sm"
      ? "w-9 h-9"
      : size === "lg"
      ? "w-13 h-13"
      : size === "xl"
      ? "w-16 h-16"
      : "w-10 h-10";

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Rounded Dark Shield Container matching the user's reference image */}
      <div className={`relative ${dimensionClass} shrink-0 group`}>
        {/* Subtle Ambient Green Glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-emerald-500/40 via-green-500/30 to-teal-500/20 blur-[3px] opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Shield Outer Background */}
        <div className="relative w-full h-full rounded-2xl bg-[#090D16] p-0.5 border border-emerald-500/40 shadow-xl flex items-center justify-center overflow-hidden">
          <BinaryTradingLearningIcon className="w-full h-full transform group-hover:scale-102 transition-transform duration-200" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1 leading-none">
            <span className="font-black text-white text-sm sm:text-base font-sans tracking-wide">
              BINARY
            </span>
            <span className="font-black text-emerald-400 text-sm sm:text-base font-sans tracking-wide">
              TRADING
            </span>
            <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 uppercase">
              PRO
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase font-sans">
              LEARNING
            </span>
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}
