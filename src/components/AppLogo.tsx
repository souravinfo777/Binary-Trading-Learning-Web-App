import React from "react";
import {
  BinaryTradingLearningIcon,
  BinaryTradingLearningLogo,
} from "./BinaryTradingLearningLogo";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function AppLogo({
  size = "md",
  className = "",
  showText = false,
}: AppLogoProps) {
  const dimensionClass =
    size === "sm" ? "w-9 h-9" : size === "lg" ? "w-12 h-12" : "w-10 h-10";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dark App Shield Container matching user's exact logo */}
      <div className={`relative ${dimensionClass} shrink-0 group select-none`}>
        {/* Subtle Ambient Emerald Glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-emerald-500/40 via-green-500/30 to-teal-500/20 blur-[3px] group-hover:blur-md opacity-85 group-hover:opacity-100 transition-all duration-300" />

        {/* Shield Container */}
        <div className="relative w-full h-full rounded-2xl bg-[#090D16] p-0.5 border border-emerald-500/50 group-hover:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] flex items-center justify-center overflow-hidden transition-all duration-300">
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
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2.5 h-0.5 bg-emerald-500 rounded-full" />
            <span className="text-[9.5px] font-bold text-slate-300 tracking-[0.2em] uppercase font-sans">
              LEARNING
            </span>
            <span className="w-2.5 h-0.5 bg-emerald-500 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}

export { BinaryTradingLearningLogo, BinaryTradingLearningIcon };
