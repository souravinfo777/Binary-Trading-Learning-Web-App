import React, { useState, useEffect } from "react";
import {
  LearnBinaryIcon,
  LogoVariant,
  LOGO_VARIANTS,
} from "./LearnBinaryLogo";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  variant?: LogoVariant;
  onClick?: () => void;
}

export function AppLogo({
  size = "md",
  className = "",
  showText = false,
  variant: propVariant,
  onClick,
}: AppLogoProps) {
  const [selectedVariant, setSelectedVariant] = useState<LogoVariant>(() => {
    if (propVariant) return propVariant;
    try {
      const saved = localStorage.getItem("learn_binary_active_logo") as LogoVariant;
      if (saved && ["lb_apex", "lb_shield", "lb_minimal"].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "lb_apex";
  });

  useEffect(() => {
    if (propVariant) {
      setSelectedVariant(propVariant);
      return;
    }

    const handler = () => {
      try {
        const saved = localStorage.getItem("learn_binary_active_logo") as LogoVariant;
        if (saved && ["lb_apex", "lb_shield", "lb_minimal"].includes(saved)) {
          setSelectedVariant(saved);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("storage", handler);
    window.addEventListener("learn_binary_logo_changed", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("learn_binary_logo_changed", handler);
    };
  }, [propVariant]);

  const activeVariant = propVariant || selectedVariant;
  const meta = LOGO_VARIANTS.find((m) => m.id === activeVariant) || LOGO_VARIANTS[0];

  const dimensionClass =
    size === "sm" ? "w-9 h-9" : size === "lg" ? "w-12 h-12" : "w-10 h-10";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 ${className} ${
        onClick ? "cursor-pointer group select-none" : ""
      }`}
      title={onClick ? "Click to view 3 LEARN BINARY logo options" : "LEARN BINARY"}
    >
      {/* High-Tech Algorithmic Quantum Logo Icon */}
      <div className={`relative ${dimensionClass} shrink-0 group select-none`}>
        {/* Ambient Neon Glow Aura */}
        <div
          className="absolute -inset-0.5 rounded-xl blur-[3px] group-hover:blur-md opacity-85 group-hover:opacity-100 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${meta.primaryColor}77, #10B98155, #0284C777)`,
          }}
        />

        {/* Logo Shield Container */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#0e1726] via-[#070b14] to-[#020408] p-1 border border-cyan-500/50 group-hover:border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] flex items-center justify-center overflow-hidden transition-all duration-300">
          {/* Subtle Radial Glow in Center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${meta.primaryColor}28, transparent 70%)`,
            }}
          />

          {/* Render Active Vector Shape */}
          <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-300">
            <LearnBinaryIcon variant={activeVariant} />
          </div>

          {/* Micro Corner Tech Brackets */}
          <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-cyan-400/90 rounded-tl-sm" />
          <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-emerald-400/90 rounded-br-sm" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-sm tracking-wider font-mono">
              LEARN<span style={{ color: meta.primaryColor }}>BINARY</span>
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800/60">
              PRO
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">
            {meta.tagline}
          </span>
        </div>
      )}
    </div>
  );
}
