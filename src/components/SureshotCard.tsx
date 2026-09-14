import React from "react";
import { SureshotPattern } from "../data/sureshotPatterns";
import { useLanguage } from "../context/LanguageContext";
import { CheckCircle2, AlertTriangle, ArrowRight, PlayCircle, ShieldCheck, Zap } from "lucide-react";

interface SureshotCardProps {
  pattern: SureshotPattern;
  onLaunchDrill?: (scenarioId: string) => void;
}

export const SureshotCard: React.FC<SureshotCardProps> = ({
  pattern,
  onLaunchDrill,
}) => {
  const { isBn } = useLanguage();

  const title = isBn ? pattern.titleBn : pattern.titleEn;
  const category = isBn ? pattern.categoryBn : pattern.category;
  const summary = isBn ? pattern.summaryBn : pattern.summaryEn;
  const goldenRule = isBn ? pattern.goldenRuleBn : pattern.goldenRuleEn;
  const criteria = isBn ? pattern.criteriaBn : pattern.criteriaEn;
  const pitfall = isBn ? pattern.pitfallBn : pattern.pitfallEn;
  const mosGuideline = isBn ? pattern.mosGuidelineBn : pattern.mosGuidelineEn;

  return (
    <div className="p-3.5 sm:p-5 bg-[#111827] rounded-xl border border-[#1F2937] hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 font-mono font-bold text-xs border border-cyan-800/60">
              {isBn ? `শিওর শট #${pattern.number}` : `SURESHOT #${pattern.number}`}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1F2937] text-gray-300 font-mono text-[11px]">
              {category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-700/50">
              {pattern.winRateEst}
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 font-mono text-[11px] font-bold border border-purple-700/50">
              {pattern.expiry}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-100 leading-snug">
          {title}
        </h3>

        {/* Candlestick Schematic Mini Visualizer */}
        <div className="p-3 bg-[#080B11] rounded-lg border border-[#1F2937] flex flex-col items-center justify-center">
          <div className="flex items-end justify-center gap-6 h-28 w-full max-w-[280px] relative px-4 py-2">
            {/* Optional SNR Level Line */}
            {pattern.diagram.snrPositionPercent !== undefined && (
              <div
                className="absolute left-2 right-2 border-t-2 border-dashed border-amber-400/80 z-0 flex items-center justify-between"
                style={{ bottom: `${pattern.diagram.snrPositionPercent}%` }}
              >
                <span className="text-[9px] font-mono text-amber-300 bg-[#080B11]/90 px-1 -mt-2.5">
                  {pattern.diagram.snrLevelType || "KEY SNR"}
                </span>
              </div>
            )}

            {pattern.diagram.candles.map((c, idx) => (
              <div key={idx} className="flex flex-col items-center z-10">
                {/* Upper Wick */}
                <div
                  className="w-0.5 bg-gray-400"
                  style={{ height: `${c.upperWick * 0.7}px` }}
                />
                {/* Candle Body */}
                <div
                  className={`w-6 sm:w-7 rounded-xs flex items-center justify-center text-[9px] font-mono font-bold transition-transform ${
                    c.color === "green"
                      ? "bg-emerald-500 border border-emerald-300 text-black shadow-xs shadow-emerald-500/30"
                      : c.color === "red"
                      ? "bg-rose-500 border border-rose-300 text-white shadow-xs shadow-rose-500/30"
                      : "bg-gray-400 text-black"
                  } ${c.isKeyAction ? "ring-2 ring-amber-400 scale-105" : ""}`}
                  style={{ height: `${Math.max(12, c.bodyHeight * 0.7)}px` }}
                >
                  {c.label.split(" ")[0]}
                </div>
                {/* Lower Wick */}
                <div
                  className="w-0.5 bg-gray-400"
                  style={{ height: `${c.lowerWick * 0.7}px` }}
                />
                {/* Annotation */}
                {(c.annotation || c.annotationBn) && (
                  <span className="text-[9px] font-mono text-gray-300 mt-1 text-center whitespace-nowrap">
                    {isBn && c.annotationBn ? c.annotationBn : c.annotation}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          {summary}
        </p>

        {/* The Golden Rule Box */}
        <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>{isBn ? "গোল্ডেন এক্সিকিউশন রুল:" : "THE GOLDEN EXECUTION RULE:"}</span>
          </div>
          <p className="text-xs text-cyan-200 leading-relaxed font-medium">
            {goldenRule}
          </p>
        </div>

        {/* Confluence Checklist */}
        <div className="space-y-1.5 pt-2 border-t border-[#1F2937]">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block font-mono">
            {isBn ? "প্রয়োজনীয় শর্তাবলী (Criteria):" : "Confluence Criteria:"}
          </span>
          <ul className="text-xs space-y-1 text-gray-300">
            {criteria.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Margin of Safety & Pitfall */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
          <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-800/30 space-y-1">
            <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBn ? "মার্জিন অফ সেফটি গাইডলাইন" : "MOS Guideline"}</span>
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              {mosGuideline}
            </p>
          </div>

          <div className="p-2.5 rounded bg-rose-950/20 border border-rose-800/30 space-y-1">
            <div className="flex items-center gap-1 text-rose-400 font-bold font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isBn ? "রিটেইল ট্র্যাপ বা ভুল" : "Retail Pitfall"}</span>
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              {pitfall}
            </p>
          </div>
        </div>
      </div>

      {/* Action Drill Launcher if available */}
      {pattern.linkedScenarioId && onLaunchDrill && (
        <button
          type="button"
          onClick={() => onLaunchDrill(pattern.linkedScenarioId!)}
          className="w-full flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md border border-cyan-400 transition-all cursor-pointer"
        >
          <PlayCircle className="w-4 h-4" />
          <span>{isBn ? "এই প্যাটার্নের চার্ট সিমুলেশন প্র্যাকটিস করুন" : "Launch Chart Drill for this Pattern"}</span>
        </button>
      )}
    </div>
  );
};
