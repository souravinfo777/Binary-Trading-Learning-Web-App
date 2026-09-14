import React from "react";

export type LogoVariant = "lb_apex" | "lb_shield" | "lb_minimal";

export interface LogoMeta {
  id: LogoVariant;
  name: string;
  nameBn: string;
  tagline: string;
  taglineBn: string;
  description: string;
  descriptionBn: string;
  primaryColor: string;
}

export const LOGO_VARIANTS: LogoMeta[] = [
  {
    id: "lb_apex",
    name: "LB APEX MONOGRAM",
    nameBn: "এলবি অ্যাপেক্স মনোগ্রাম",
    tagline: "INTERLOCKING L & B CANDLESTICK",
    taglineBn: "ক্যান্ডেলস্টিক ও ব্রেকআউট শেপ",
    description:
      "Capital 'L' and 'B' fused into institutional candlesticks and a golden breakout vector. Precision quantitative trading aesthetic.",
    descriptionBn:
      "ক্যাপিটাল 'L' ও 'B' অক্ষর দুটিকে ক্যান্ডেলস্টিক ও গোল্ডেন ব্রেকআউট ভেক্টরে রূপ দিয়ে তৈরি আকর্ষণীয় মনোগ্রাম।",
    primaryColor: "#06B6D4",
  },
  {
    id: "lb_shield",
    name: "CYBER SHIELD LB",
    nameBn: "সাইবার শিল্ড এলবি",
    tagline: "HEXAGONAL ALGO MATRIX",
    taglineBn: "হেক্সাগন টেক শিল্ড ও ক্যাপিটাল এলবি",
    description:
      "Geometric cyber hexagon shield containing bold capital 'L' and 'B' with algorithmic pulse lines and high-contrast institutional glow.",
    descriptionBn:
      "হেক্সাগন সাইবার শিল্ডের ভেতর বোল্ড ক্যাপিটাল 'L' এবং 'B' এর নিখুঁত ফিউশন, যাতে রয়েছে ওটিসি অ্যালগো পালস।",
    primaryColor: "#10B981",
  },
  {
    id: "lb_minimal",
    name: "MINIMALIST DUAL-CANDLE",
    nameBn: "মিনিমালিস্ট ডুয়াল-ক্যান্ডেল",
    tagline: "LUXURY GEOMETRIC WORDMARK",
    taglineBn: "লাক্সারি ক্যাপিটাল টেক্সট ও ক্যান্ডেল B",
    description:
      "Ultra-modern luxury wordmark featuring a stylized capital 'B' composed of bullish & bearish algorithmic candles with wide-spaced typography.",
    descriptionBn:
      "আধুনিক মিনিমালিস্ট আর্কিটেকচার—যেখানে ক্যাপিটাল 'B' তৈরি হয়েছে বুলিশ ও বেয়ারিশ ক্যান্ডেলস্টিকের সমন্বয়ে।",
    primaryColor: "#F59E0B",
  },
];

interface LearnBinaryLogoIconProps {
  variant?: LogoVariant;
  sizeClass?: string;
  className?: string;
}

/**
 * 1. LB APEX MONOGRAM SVG
 * Capital 'L' forms the structural foundation, while capital 'B' forms two momentum loops
 * with institutional candlestick wicks and a golden apex breakout pip.
 */
export function LbApexIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="apexGreen" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="apexCyan" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="60%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="apexGold" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <filter id="apexGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer subtle guide circle */}
      <circle cx="24" cy="24" r="21" stroke="#0ea5e9" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3" />

      {/* Capital "L" Structure: Vertical Candlestick Spine & Horizontal Base */}
      {/* Candlestick Wick on the L's spine */}
      <line x1="12" y1="6" x2="12" y2="42" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Bullish Solid Body on the L's spine */}
      <rect x="9.5" y="14" width="5" height="22" rx="1.5" fill="url(#apexGreen)" stroke="#6EE7B7" strokeWidth="1" filter="url(#apexGlow)" />
      {/* Base foot of the "L" */}
      <path d="M 9.5 39 L 28 39" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" filter="url(#apexGlow)" />

      {/* Capital "B" Upper Arc (Green Institutional Zone) */}
      <path
        d="M 14.5 13 H 26 C 31 13 34 16 34 20 C 34 23.5 31.5 25.5 27 25.5 H 14.5"
        stroke="url(#apexCyan)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#apexGlow)"
      />

      {/* Capital "B" Lower Arc (Expanding Algorithmic Curve) */}
      <path
        d="M 14.5 25.5 H 28 C 33.5 25.5 37 28.5 37 33 C 37 37 33 39 27 39 H 14.5"
        stroke="url(#apexGreen)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#apexGlow)"
      />

      {/* Dynamic Breakout Surge Vector across the B */}
      <path
        d="M 18 36 L 28 26 L 38 12"
        stroke="url(#apexGold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#apexGlow)"
      />

      {/* Apex Golden Target Pip */}
      <polygon
        points="38,8 42,12 38,16 34,12"
        fill="url(#apexGold)"
        stroke="#FFFBEB"
        strokeWidth="1"
        filter="url(#apexGlow)"
      />
      <circle cx="38" cy="12" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 2. CYBER SHIELD LB SVG
 * Hexagonal high-tech badge enclosing faceted capital "L" and "B" with binary pulse matrix
 */
export function LbShieldIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="neonFill" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Hexagonal Outer Tech Frame */}
      <polygon
        points="24,4 42,13 42,35 24,44 6,35 6,13"
        stroke="url(#shieldGrad)"
        strokeWidth="2.2"
        fill="#040914"
        fillOpacity="0.8"
        strokeLinejoin="round"
        filter="url(#shieldGlow)"
      />

      {/* Inner Concentric Hexagon Grid */}
      <polygon
        points="24,8 38,15 38,33 24,40 10,33 10,15"
        stroke="#1E293B"
        strokeWidth="1"
        strokeDasharray="2 2"
      />

      {/* Stylized Bold Capital "L" on Left */}
      <path
        d="M 14 15 V 33 H 23"
        stroke="#38BDF8"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#shieldGlow)"
      />

      {/* Stylized Bold Capital "B" on Right */}
      <path
        d="M 23 15 H 30 C 33.5 15 35 17 35 19.5 C 35 22 33 24 30 24 H 23"
        stroke="url(#neonFill)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#shieldGlow)"
      />
      <path
        d="M 23 24 H 31.5 C 35 24 36.5 26.5 36.5 29 C 36.5 31.8 34.5 33 30.5 33 H 23"
        stroke="url(#neonFill)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#shieldGlow)"
      />

      {/* Binary pulse dots in corners */}
      <circle cx="24" cy="4" r="1.5" fill="#38BDF8" />
      <circle cx="42" cy="13" r="1.5" fill="#34D399" />
      <circle cx="6" cy="13" r="1.5" fill="#38BDF8" />
      <circle cx="24" cy="44" r="1.5" fill="#34D399" />
    </svg>
  );
}

/**
 * 3. MINIMALIST DUAL-CANDLE SVG
 * Clean luxury financial emblem: Capital 'B' formed with green & red candles, framed by minimalist 'L' bracket
 */
export function LbMinimalIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="minBullish" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="minGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
        <filter id="minGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Subtle outer rounded diamond frame */}
      <rect
        x="24"
        y="4"
        width="28"
        height="28"
        rx="6"
        transform="rotate(45 24 4)"
        stroke="#334155"
        strokeWidth="1"
        fill="#020617"
        fillOpacity="0.75"
      />

      {/* Bracket "L" in sleek slate & cyan */}
      <path
        d="M 12 12 V 36 H 24"
        stroke="#64748B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2" fill="#38BDF8" filter="url(#minGlow)" />

      {/* Candlestick Spine for "B" */}
      <line x1="22" y1="10" x2="22" y2="38" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
      <rect
        x="19.5"
        y="16"
        width="5"
        height="18"
        rx="1.5"
        fill="url(#minBullish)"
        stroke="#6EE7B7"
        strokeWidth="0.8"
        filter="url(#minGlow)"
      />

      {/* Dual Loops of Capital "B" - Modern Mathematical Arcs */}
      <path
        d="M 24.5 16 H 31 C 35.5 16 38 18.5 38 22 C 38 25.5 35.5 27 31 27 H 24.5"
        stroke="url(#minGold)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#minGlow)"
      />
      <path
        d="M 24.5 27 H 32.5 C 37 27 39.5 29.5 39.5 33.5 C 39.5 37 36.5 39 31.5 39 H 24.5"
        stroke="#38BDF8"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#minGlow)"
      />

      {/* Center Pivot Point */}
      <circle cx="24.5" cy="27" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Universal Learn Binary Icon by Variant
 */
export function LearnBinaryIcon({
  variant = "lb_apex",
  className = "w-full h-full",
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  switch (variant) {
    case "lb_shield":
      return <LbShieldIcon className={className} />;
    case "lb_minimal":
      return <LbMinimalIcon className={className} />;
    case "lb_apex":
    default:
      return <LbApexIcon className={className} />;
  }
}

/**
 * Full "LEARN BINARY" Logo with Capital Text
 */
export function LearnBinaryFullLogo({
  variant = "lb_apex",
  size = "md",
  showSubtitle = true,
  onClick,
}: {
  variant?: LogoVariant;
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
  onClick?: () => void;
}) {
  const iconSize =
    size === "sm"
      ? "w-8 h-8"
      : size === "md"
      ? "w-10 h-10"
      : size === "lg"
      ? "w-13 h-13"
      : "w-16 h-16";

  const textSize =
    size === "sm"
      ? "text-xs"
      : size === "md"
      ? "text-sm"
      : size === "lg"
      ? "text-base"
      : "text-lg";

  const subTextSize =
    size === "sm"
      ? "text-[8px]"
      : size === "md"
      ? "text-[9.5px]"
      : size === "lg"
      ? "text-[11px]"
      : "text-[12px]";

  const meta = LOGO_VARIANTS.find((m) => m.id === variant) || LOGO_VARIANTS[0];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 select-none ${
        onClick ? "cursor-pointer group hover:opacity-95 transition-opacity" : ""
      }`}
    >
      {/* Icon with Glowing Ambient Plate */}
      <div className={`relative ${iconSize} shrink-0`}>
        <div
          className="absolute -inset-0.5 rounded-xl blur-[3px] opacity-75 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(135deg, ${meta.primaryColor}55, #000000)` }}
        />
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#0B111E] to-[#020408] p-1 border border-slate-700/60 shadow-lg flex items-center justify-center">
          <LearnBinaryIcon variant={variant} />
        </div>
      </div>

      {/* Capital Text "LEARN BINARY" Typography */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-[0.14em] uppercase text-white ${textSize} font-mono flex items-center`}
          >
            LEARN
            <span
              className="ml-1.5"
              style={{
                color: meta.primaryColor,
                textShadow: `0 0 12px ${meta.primaryColor}66`,
              }}
            >
              BINARY
            </span>
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-700/50 uppercase">
            PRO
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-mono text-slate-400 tracking-[0.16em] uppercase font-semibold mt-1 ${subTextSize}`}
          >
            {meta.tagline}
          </span>
        )}
      </div>
    </div>
  );
}
