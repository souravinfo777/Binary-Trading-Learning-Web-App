import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  GAP_PATTERNS,
  GapPattern,
  computeGapAnalysis,
} from "../data/gapPatternsData";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  Crosshair,
  Filter,
  Flame,
  Info,
  Layers,
  Percent,
  PlayCircle,
  Search,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

interface GapPatternsViewProps {
  onLaunchBlueprintDrill?: (scenarioId?: string) => void;
  initialPatternId?: string;
}

export const GapPatternsView: React.FC<GapPatternsViewProps> = ({
  onLaunchBlueprintDrill,
  initialPatternId,
}) => {
  const { isBn } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPattern, setSelectedPattern] = useState<GapPattern | null>(() => {
    if (initialPatternId) {
      const match = GAP_PATTERNS.find((p) => p.id === initialPatternId);
      if (match) return match;
    }
    return GAP_PATTERNS[0];
  });

  useEffect(() => {
    if (initialPatternId) {
      const match = GAP_PATTERNS.find((p) => p.id === initialPatternId);
      if (match) {
        setSelectedPattern(match);
        setActiveCategory("all");
      }
    }
  }, [initialPatternId]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Interactive Gap Calculator State
  const [calcC1Close, setCalcC1Close] = useState<number>(1.0825);
  const [calcC1High, setCalcC1High] = useState<number>(1.0832);
  const [calcC1Low, setCalcC1Low] = useState<number>(1.082);
  const [calcC2Open, setCalcC2Open] = useState<number>(1.084);
  const [calcC2High, setCalcC2High] = useState<number>(1.0848);
  const [calcC2Low, setCalcC2Low] = useState<number>(1.0835);

  const gapAnalysis = computeGapAnalysis(
    calcC1Close,
    calcC1High,
    calcC1Low,
    calcC2Open,
    calcC2High,
    calcC2Low
  );

  const categories = [
    { id: "all", labelEn: "All 9 Gap Patterns", labelBn: "সকল ৯টি গ্যাপ প্যাটার্ন" },
    { id: "Reversal Gaps", labelEn: "Reversal Gaps", labelBn: "রিভার্সাল গ্যাপস" },
    { id: "Continuation Gaps", labelEn: "Continuations", labelBn: "কন্টিনিউয়েশন গ্যাপস" },
    { id: "Liquidity Run Gaps", labelEn: "Liquidity Runs", labelBn: "লিকুইডিটি রান গ্যাপস" },
    { id: "Weekend / Session Gaps", labelEn: "Weekend & Session", labelBn: "উইকেন্ড ও সেশন" },
    { id: "Gap Fill Mitigation", labelEn: "100% Gap Fill", labelBn: "১০০% গ্যাপ ফিল্ড" },
  ];

  const filteredPatterns = GAP_PATTERNS.filter((pattern) => {
    const matchesCategory =
      activeCategory === "all" || pattern.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      pattern.titleEn.toLowerCase().includes(query) ||
      pattern.titleBn.toLowerCase().includes(query) ||
      pattern.summaryEn.toLowerCase().includes(query) ||
      pattern.summaryBn.toLowerCase().includes(query) ||
      pattern.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Master Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#020617] p-5 sm:p-7 border-2 border-amber-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{isBn ? "প্রাইজ অ্যাকশন ও OTC গ্যাপ এনসাইক্লোপিডিয়া" : "GAP PATTERNS TO KNOW • MASTERCLASS"}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isBn ? (
                <>
                  <span className="text-amber-400">গ্যাপ প্যাটার্নস গাইড:</span> রিভার্সাল, লিকুইডিটি রান ও ১০০% গ্যাপ ফিল
                </>
              ) : (
                <>
                  <span className="text-amber-400">Gap Patterns To Know:</span> Reversals, Liquidity Runs & 100% Gap Fills
                </>
              )}
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {isBn
                ? "বাইনারি ও ফরেক্স মার্কেটে গ্যাপ কখনোই দৈবক্রমে তৈরি হয় না। এটি প্রাতিষ্ঠানিক অর্ডার ব্লক (OB), সাপ্লাই/ডিমান্ড ইমব্যালেন্স ও লিকুইডিটি ট্র্যাপের স্পষ্ট প্রমাণ। ৯টি সুনির্দিষ্ট গ্যাপ ফর্মেশন এবং ৫০% ও ১০০% রিটেস্ট সূত্রের সম্পূর্ণ অ্যানালাইসিস।"
                : "Gaps in binary and financial markets are never random—they represent aggressive institutional order flow, supply/demand imbalances, and liquidity sweeps. Master all 9 essential formations with quantifiable 50% & 100% gap mitigation rules."}
            </p>
          </div>

          {/* Quick Stat Pill Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
            <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30 text-center">
              <span className="text-amber-400 text-xs font-mono font-bold block">PATTERNS</span>
              <span className="text-xl font-extrabold text-white font-mono">9 Formations</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-center">
              <span className="text-emerald-400 text-xs font-mono font-bold block">AVG WIN-RATE</span>
              <span className="text-xl font-extrabold text-emerald-300 font-mono">89% - 94%</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-cyan-500/30 text-center col-span-2 sm:col-span-1">
              <span className="text-cyan-400 text-xs font-mono font-bold block">EXECUTION</span>
              <span className="text-xl font-extrabold text-cyan-300 font-mono">MOS Retest</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-[#111827] rounded-xl border border-[#1F2937]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20 font-extrabold"
                  : "bg-[#090D16] text-gray-400 hover:text-gray-200 border border-[#1F2937]"
              }`}
            >
              {isBn ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? "গ্যাপ প্যাটার্ন খুঁজুন..." : "Search gap patterns..."}
            className="w-full bg-[#090D16] border border-[#1F2937] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      {/* 9-Card Visual Grid Recreating the Cheatsheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatterns.map((pattern) => {
          const isSelected = selectedPattern?.id === pattern.id;
          const isCall = pattern.action === "CALL";

          return (
            <div
              key={pattern.id}
              id={`gap-card-${pattern.id}`}
              onClick={() => setSelectedPattern(pattern)}
              className={`cursor-pointer rounded-xl border-2 transition-all p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden bg-[#0A0F1D] hover:border-amber-500/60 shadow-lg ${
                isSelected
                  ? "border-amber-400 ring-2 ring-amber-400/20 shadow-amber-500/10"
                  : "border-[#1F2937]"
              }`}
            >
              {/* Card Top Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/70 border border-gray-700 text-gray-300">
                  #{pattern.number} • {pattern.category}
                </span>

                <span
                  className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded flex items-center gap-1 ${
                    isCall
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  }`}
                >
                  {isCall ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {pattern.action} ({pattern.winRateEst})
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-extrabold text-white mb-2 leading-snug">
                {isBn ? pattern.titleBn : pattern.titleEn}
              </h3>

              {/* Visual Candle Diagram Schematic */}
              <div className="my-3 p-3.5 rounded-lg bg-[#04060B] border border-gray-800/80 relative min-h-[170px] flex items-center justify-center">
                {/* Zone Indicator (Supply / Demand / Liquidity / Fakeout) */}
                {pattern.diagram.zoneType && (
                  <div
                    className={`absolute left-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider text-center border ${
                      pattern.diagram.zonePosition === "TOP"
                        ? "top-1.5"
                        : pattern.diagram.zonePosition === "BOTTOM"
                        ? "bottom-1.5"
                        : "top-1/2 -translate-y-1/2"
                    } ${
                      pattern.diagram.zoneType === "SUPPLY"
                        ? "bg-rose-950/40 border-rose-600/40 text-rose-300"
                        : pattern.diagram.zoneType === "DEMAND"
                        ? "bg-emerald-950/40 border-emerald-600/40 text-emerald-300"
                        : pattern.diagram.zoneType === "FAKEOUT"
                        ? "bg-purple-950/40 border-purple-500/40 text-purple-300"
                        : "bg-cyan-950/40 border-cyan-500/40 text-cyan-300"
                    }`}
                  >
                    {pattern.diagram.zoneType} ZONE
                  </div>
                )}

                {/* Candles Row with Vertical Gap Offsets */}
                <div className="flex items-end justify-center gap-3 sm:gap-4 w-full h-[120px] pt-4 pb-2">
                  {pattern.diagram.candles.map((c, idx) => {
                    const isGreen = c.color === "green";
                    const isKey = c.isKeyAction;

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center relative group"
                        style={{
                          transform: c.offsetY
                            ? `translateY(${c.offsetY}px)`
                            : "none",
                        }}
                      >
                        {/* Upper Wick */}
                        <div
                          className={`w-[2px] ${
                            isGreen ? "bg-emerald-400" : "bg-rose-500"
                          }`}
                          style={{ height: `${c.upperWick * 1.2}px` }}
                        />

                        {/* Candle Body */}
                        <div
                          className={`w-5 sm:w-6 rounded-sm flex items-center justify-center font-mono text-[8px] font-bold transition-all relative ${
                            isGreen
                              ? "bg-gradient-to-t from-emerald-600 to-emerald-400 text-emerald-950 border border-emerald-300/40"
                              : "bg-gradient-to-t from-rose-700 to-rose-500 text-rose-100 border border-rose-400/40"
                          } ${isKey ? "ring-2 ring-yellow-400 animate-pulse shadow-lg" : ""}`}
                          style={{ height: `${c.bodyHeight * 0.75}px` }}
                        >
                          {c.label}

                          {/* Key Action Entry Tag */}
                          {c.badge && (
                            <span
                              className={`absolute -top-6 whitespace-nowrap px-1.5 py-0.2 rounded font-mono text-[8px] font-extrabold uppercase shadow-md ${
                                isCall
                                  ? "bg-emerald-500 text-black"
                                  : "bg-rose-500 text-white"
                              }`}
                            >
                              {c.badge}
                            </span>
                          )}
                        </div>

                        {/* Lower Wick */}
                        <div
                          className={`w-[2px] ${
                            isGreen ? "bg-emerald-400" : "bg-rose-500"
                          }`}
                          style={{ height: `${c.lowerWick * 1.2}px` }}
                        />

                        {/* Candle Annotation */}
                        <span className="text-[8px] font-mono text-gray-400 mt-0.5 truncate max-w-[45px] text-center">
                          {isBn && c.annotationBn ? c.annotationBn : c.annotation}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Gap Bracket Annotation */}
                {pattern.diagram.gapPosition && (
                  <div className="absolute top-2 right-2.5 flex items-center gap-1 text-[9px] font-mono font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/40">
                    <Zap className="w-2.5 h-2.5" />
                    <span>{pattern.diagram.gapPosition.label}</span>
                  </div>
                )}
              </div>

              {/* Summary text */}
              <p className="text-xs text-gray-300 line-clamp-2 mb-3">
                {isBn ? pattern.summaryBn : pattern.summaryEn}
              </p>

              {/* Golden Rule Highlight */}
              <div className="p-2 rounded bg-amber-950/20 border border-amber-500/30 text-[11px] font-mono text-amber-300 mb-3 flex items-start gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">
                  {isBn ? pattern.coreRuleBn : pattern.coreRuleEn}
                </span>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs font-mono">
                <span className="text-gray-400">
                  {isBn ? "মেয়াদ: " : "Expiry: "}
                  <strong className="text-white">{pattern.expiry}</strong>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPattern(pattern);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  <span>{isBn ? "বিস্তারিত বিশ্লেষণ" : "Deep Analysis"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED PATTERN DEEP-DIVE MODAL / EXPANDED SECTION */}
      {selectedPattern && (
        <div className="p-6 rounded-2xl bg-[#0F172A] border-2 border-amber-500/60 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-700">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
                <Award className="w-4 h-4" />
                <span>
                  {isBn ? `প্যাটার্ন #${selectedPattern.number} মাস্টারক্লাস` : `Pattern #${selectedPattern.number} Masterclass`}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {isBn ? selectedPattern.titleBn : selectedPattern.titleEn}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-lg font-mono text-xs font-extrabold flex items-center gap-1.5 ${
                  selectedPattern.action === "CALL"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                }`}
              >
                {selectedPattern.action === "CALL" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                ACTION: {selectedPattern.action} ({selectedPattern.winRateEst})
              </span>

              {onLaunchBlueprintDrill && (
                <button
                  type="button"
                  onClick={() => onLaunchBlueprintDrill()}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-extrabold flex items-center gap-1.5 shadow-md"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>{isBn ? "প্র্যাকটিস ড্রিল" : "Practice Drill"}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Logic & Step-by-Step Execution */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#090D16] border border-gray-800 space-y-2">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isBn ? "স্মার্ট মানি ও প্রাতিষ্ঠানিক লজিক" : "Institutional Market Logic"}</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {isBn ? selectedPattern.marketLogicBn : selectedPattern.marketLogicEn}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D16] border border-gray-800 space-y-2">
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isBn ? "ধাপে ধাপে ট্রেড এক্সিকিউশন" : "Step-by-Step Execution Checklist"}</span>
                </h4>
                <ul className="space-y-2 text-xs text-gray-300">
                  {(isBn
                    ? selectedPattern.executionStepsBn
                    : selectedPattern.executionStepsEn
                  ).map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 font-mono text-[9px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: OTC Nuance & Invalidation */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{isBn ? "OTC বাইনারি অ্যালগরিদম রহস্য" : "OTC Algorithmic Secret"}</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {isBn ? selectedPattern.otcNuanceBn : selectedPattern.otcNuanceEn}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
                <h4 className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isBn ? "সেটআপ বাতিল বা ইনভ্যালিডেশন শর্ত" : "Invalidation & Trade Cancellation"}</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {isBn ? selectedPattern.invalidationBn : selectedPattern.invalidationEn}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D16] border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold block">
                    {isBn ? "গোল্ডেন মার্জিন অফ সেফটি রুল" : "Golden Margin of Safety Rule"}
                  </span>
                  <span className="text-xs text-gray-300">
                    {isBn ? "প্রথম ১৫ সেকেন্ডে গ্যাপ টাচ = নিরাপদ এন্ট্রি" : "Touch gap boundary within 01-15s = High Win-rate"}
                  </span>
                </div>
                <span className="px-3 py-1 rounded bg-cyan-500 text-black font-mono text-xs font-extrabold">
                  01-15s MOS
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE GAP QUANT & MARGIN OF SAFETY CALCULATOR */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-gray-950 via-[#0B1120] to-black border-2 border-cyan-500/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isBn ? "ইন্টারেক্টিভ গ্যাপ ও ৫০% রিটেস্ট কোয়ান্ট ক্যালকুলেটর" : "Interactive Gap & 50% Retest Quant Engine"}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                {isBn ? "প্রি-গ্যাপ ও পোস্ট-গ্যাপ প্রাইস দিয়ে ৫০% ও ১০০% লেভেল বের করুন" : "Calculate precise 50% & 100% gap mitigation coordinates"}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold self-start sm:self-auto">
            ALGO VERDICT: {gapAnalysis.recommendedAction}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Column 1: Candle 1 (Pre-Gap) */}
          <div className="p-4 rounded-xl bg-[#080D1A] border border-gray-800 space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase block">
              {isBn ? "ক্যান্ডেল ১ (প্রি-গ্যাপ ক্যান্ডেল)" : "Candle 1 (Pre-Gap Close)"}
            </span>
            <div className="space-y-2 font-mono text-xs">
              <div>
                <label className="text-gray-400 block mb-1">C1 Close Price:</label>
                <input
                  type="number"
                  step="0.0001"
                  value={calcC1Close}
                  onChange={(e) => setCalcC1Close(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 block mb-1">C1 High:</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={calcC1High}
                    onChange={(e) => setCalcC1High(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">C1 Low:</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={calcC1Low}
                    onChange={(e) => setCalcC1Low(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inputs Column 2: Candle 2 (Post-Gap Open) */}
          <div className="p-4 rounded-xl bg-[#080D1A] border border-gray-800 space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase block">
              {isBn ? "ক্যান্ডেল ২ (পোস্ট-গ্যাপ ওপেনিং)" : "Candle 2 (Post-Gap Open)"}
            </span>
            <div className="space-y-2 font-mono text-xs">
              <div>
                <label className="text-gray-400 block mb-1">C2 Open Price:</label>
                <input
                  type="number"
                  step="0.0001"
                  value={calcC2Open}
                  onChange={(e) => setCalcC2Open(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 block mb-1">C2 High:</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={calcC2High}
                    onChange={(e) => setCalcC2High(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">C2 Low:</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={calcC2Low}
                    onChange={(e) => setCalcC2Low(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-gray-700 rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Output Quant Results */}
          <div className="p-4 rounded-xl bg-black/70 border border-cyan-500/40 flex flex-col justify-between space-y-3 font-mono">
            <span className="text-xs font-bold text-emerald-400 uppercase block">
              {isBn ? "কোয়ান্ট আউটপুট ও এক্সিকিউশন ট্রিগার" : "Quant Output & Trade Triggers"}
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Gap Type:</span>
                <span className="text-white font-bold">{gapAnalysis.gapType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">Gap Height:</span>
                <span className="text-amber-400 font-bold">{gapAnalysis.gapSize.toFixed(5)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">50% Midpoint Retest:</span>
                <span className="text-cyan-300 font-extrabold">{gapAnalysis.fiftyPercentLevel.toFixed(5)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-400">100% Full Mitigation:</span>
                <span className="text-emerald-400 font-extrabold">{gapAnalysis.fullMitigationLevel.toFixed(5)}</span>
              </div>
            </div>

            <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/40 text-[11px] text-cyan-200">
              <strong>MOS Rule:</strong> {isBn ? gapAnalysis.mosRuleBn : gapAnalysis.mosRule}
            </div>
          </div>
        </div>
      </div>

      {/* OTC VS REAL MARKET GAP DYNAMICS MASTERCLASS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#090D16] border border-gray-800 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>{isBn ? "OTC বাইনারি বনাম রিয়েল ফরেক্স গ্যাপের পার্থক্য ও রুলস" : "OTC Binary vs Real Market Gap Mechanics"}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-300">
          <div className="p-4 rounded-xl bg-black/50 border border-gray-800 space-y-2">
            <h4 className="font-bold text-amber-300 font-mono">1. The 15-Second Gap Retest Rule</h4>
            <p className="leading-relaxed">
              {isBn
                ? "বাইনারি মার্কেটে গ্যাপ ওপেন হলে ক্যান্ডেলের প্রথম ১৫ সেকেন্ডের মধ্যে প্রাইস ৫০% বা ১০০% গ্যাপ পূরণ করতে নিচের দিকে বা উপরে রিটেস্ট দিলে ৮০%+ ক্ষেত্রে সেখান থেকেই বাউন্স করে গ্রিন/রেড ক্লোজ হয়।"
                : "When a candle opens with a gap, if it retraces to touch the 50% or 100% gap baseline within the first 15 seconds, it bounces back with high frequency (>80%) creating a winning MOS trade."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-gray-800 space-y-2">
            <h4 className="font-bold text-amber-300 font-mono">2. Fakeout Gap Above SNR Traps</h4>
            <p className="leading-relaxed">
              {isBn
                ? "রেজিস্ট্যান্সের ঠিক উপরে গ্যাপ-আপ ওপেন হলে কখনোই সাথে সাথে CALL নিবেন না। এটি প্রায়ই ব্রোকার অ্যালগরিদমের তৈরি ফেক-আউট যাতে ট্রেডাররা ট্র্যাপ হয় এবং পরবর্তী ক্যান্ডেল সরাসরি নিচে ডাম্প করে।"
                : "Never blindly enter CALL on a gap-up that opens right above strong resistance. Institutional algorithms engineer this fakeout to trap breakout buyers before dumping price back down."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
