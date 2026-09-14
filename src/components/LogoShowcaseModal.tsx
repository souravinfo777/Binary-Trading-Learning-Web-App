import React from "react";
import { X, Check, Sparkles, Smartphone, Monitor } from "lucide-react";
import {
  LOGO_VARIANTS,
  LogoVariant,
  LearnBinaryIcon,
  LearnBinaryFullLogo,
} from "./LearnBinaryLogo";
import { useLanguage } from "../context/LanguageContext";

interface LogoShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeVariant: LogoVariant;
  onSelectVariant: (variant: LogoVariant) => void;
}

export function LogoShowcaseModal({
  isOpen,
  onClose,
  activeVariant,
  onSelectVariant,
}: LogoShowcaseModalProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#080D1A] border border-cyan-500/40 rounded-2xl shadow-2xl p-4 sm:p-6 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-10">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{isBn ? "লোগো ডিজাইন গ্যালারি" : "BRAND IDENTITY SHOWCASE"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wider uppercase text-white">
            {isBn ? "LEARN BINARY এর ৩টি ক্যাপিটাল টেক্সট লোগো" : "3 'LEARN BINARY' CAPITAL LOGO DESIGNS"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isBn
              ? "নিচে আপনার পছন্দের লোগোটি নির্বাচন করুন। ক্লিক করলেই তাৎক্ষণিকভাবে সম্পূর্ণ অ্যাপে আপডেট হয়ে যাবে।"
              : "Compare the 3 distinct capital-text based shapes below. Select your favorite to instantly set it as the active app logo."}
          </p>
        </div>

        {/* 3 Logo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6">
          {LOGO_VARIANTS.map((variant, idx) => {
            const isSelected = activeVariant === variant.id;

            return (
              <div
                key={variant.id}
                onClick={() => onSelectVariant(variant.id)}
                className={`relative flex flex-col justify-between rounded-xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-b from-[#0F1D36] to-[#080E1D] border-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400"
                    : "bg-[#0B111E] hover:bg-[#0E1729] border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Active Selection Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-mono font-black shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>{isBn ? "অ্যাক্টিভ" : "ACTIVE"}</span>
                  </div>
                )}

                {/* Option Number */}
                <span className="text-[10px] font-mono font-bold text-slate-500 mb-3 block">
                  OPTION 0{idx + 1}
                </span>

                {/* Big Center Display Canvas */}
                <div className="w-full py-6 flex flex-col items-center justify-center bg-[#050811] rounded-xl border border-slate-800/80 mb-4 shadow-inner">
                  {/* Large Icon Shape */}
                  <div className="w-20 h-20 sm:w-22 sm:h-22 relative mb-3">
                    <div
                      className="absolute -inset-1 rounded-2xl blur-sm opacity-60"
                      style={{ background: variant.primaryColor }}
                    />
                    <div className="relative w-full h-full rounded-2xl bg-[#080E1D] p-2 border border-slate-700 shadow-xl flex items-center justify-center">
                      <LearnBinaryIcon variant={variant.id} />
                    </div>
                  </div>

                  {/* Capital Text Wordmark */}
                  <div className="flex items-center gap-1.5 font-mono font-black text-sm sm:text-base tracking-[0.15em] uppercase">
                    <span className="text-white">LEARN</span>
                    <span style={{ color: variant.primaryColor }}>BINARY</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase mt-0.5">
                    {variant.tagline}
                  </span>
                </div>

                {/* Information & Concept Details */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-mono font-bold text-white text-sm sm:text-base">
                    {isBn ? variant.nameBn : variant.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isBn ? variant.descriptionBn : variant.description}
                  </p>
                </div>

                {/* Live Preview Modes: Mobile & Desktop Mini Indicators */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Smartphone className="w-3.5 h-3.5" />
                      {isBn ? "মোবাইল ভিউ:" : "Mobile View:"}
                    </span>
                    <div className="w-6 h-6 rounded bg-[#080E1D] p-0.5 border border-slate-700 shrink-0">
                      <LearnBinaryIcon variant={variant.id} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Monitor className="w-3.5 h-3.5" />
                      {isBn ? "ডেস্কটপ ভিউ:" : "Desktop View:"}
                    </span>
                    <span className="font-bold text-slate-300 text-[10px]">
                      ICON + TEXT
                    </span>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVariant(variant.id);
                  }}
                  className={`mt-4 w-full py-2.5 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      {isBn ? "নির্বাচিত আছে" : "CURRENT LOGO"}
                    </>
                  ) : (
                    <>{isBn ? "এটি ব্যবহার করুন" : "USE THIS LOGO"}</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Live Header Simulation Card */}
        <div className="p-4 rounded-xl bg-[#050811] border border-cyan-500/30">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-2 font-bold">
            {isBn ? "লাইভ অ্যাপ হেডার প্রিভিউ:" : "LIVE APP HEADER PREVIEW:"}
          </span>
          <div className="flex items-center justify-between bg-[#080E1A] p-3 rounded-lg border border-slate-800">
            <LearnBinaryFullLogo
              variant={activeVariant}
              size="md"
              showSubtitle={true}
            />
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
              OTC LIVE 60s
            </span>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            {isBn ? "সম্পন্ন" : "DONE"}
          </button>
        </div>
      </div>
    </div>
  );
}
