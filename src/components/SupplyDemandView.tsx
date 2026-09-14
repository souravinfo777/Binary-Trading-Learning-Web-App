import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { SUPPLY_DEMAND_PATTERNS, SDZonePattern } from "../data/supplyDemandData";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Compass,
  Filter,
  Flame,
  Layers,
  PlayCircle,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

interface SupplyDemandViewProps {
  onLaunchBlueprintDrill: (scenarioId: string) => void;
  initialPatternId?: string;
}

export const SupplyDemandView: React.FC<SupplyDemandViewProps> = ({
  onLaunchBlueprintDrill,
  initialPatternId,
}) => {
  const { isBn } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "sd" | "stars" | "reversal" | "continuation"
  >("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPatternId, setSelectedPatternId] = useState<string>(() => {
    if (initialPatternId) {
      const match = SUPPLY_DEMAND_PATTERNS.find((p) => p.id === initialPatternId);
      if (match) return match.id;
    }
    return SUPPLY_DEMAND_PATTERNS[0].id;
  });

  useEffect(() => {
    if (initialPatternId) {
      const match = SUPPLY_DEMAND_PATTERNS.find((p) => p.id === initialPatternId);
      if (match) {
        setSelectedPatternId(match.id);
        setCalcPattern(match.id);
        setSelectedCategory("all");
      }
    }
  }, [initialPatternId]);

  // Calculator state
  const [calcPattern, setCalcPattern] = useState<string>("sd_double_top");
  const [calcHigh, setCalcHigh] = useState<number>(1.0850);
  const [calcLow, setCalcLow] = useState<number>(1.0820);
  const [calcCurrent, setCalcCurrent] = useState<number>(1.0845);

  const selectedPattern =
    SUPPLY_DEMAND_PATTERNS.find((p) => p.id === selectedPatternId) ||
    SUPPLY_DEMAND_PATTERNS[0];

  const filteredPatterns = SUPPLY_DEMAND_PATTERNS.filter((pattern) => {
    if (selectedCategory === "sd" && pattern.category !== "Supply & Demand") {
      return false;
    }
    if (selectedCategory === "stars" && pattern.category !== "Star Candlesticks") {
      return false;
    }
    if (selectedCategory === "reversal" && pattern.type !== "Reversal") {
      return false;
    }
    if (selectedCategory === "continuation" && pattern.type !== "Continuation") {
      return false;
    }

    const query = searchQuery.toLowerCase().trim();
    if (query === "") return true;

    return (
      pattern.titleEn.toLowerCase().includes(query) ||
      pattern.titleBn.toLowerCase().includes(query) ||
      pattern.summaryEn.toLowerCase().includes(query) ||
      pattern.summaryBn.toLowerCase().includes(query) ||
      pattern.zoneType.toLowerCase().includes(query)
    );
  });

  // Calculate Zone Levels
  const zoneRange = Math.abs(calcHigh - calcLow);
  const midpoint50 = (calcHigh + calcLow) / 2;
  const isPutPattern = [
    "sd_double_top",
    "sd_flag_bearish",
    "sd_retest_bearish",
    "cs_evening_star",
  ].includes(calcPattern);

  const targetMosPrice = isPutPattern
    ? calcHigh - zoneRange * 0.25
    : calcLow + zoneRange * 0.25;

  const stopLossPrice = isPutPattern
    ? calcHigh + zoneRange * 0.15
    : calcLow - zoneRange * 0.15;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950/40 via-[#111827] to-cyan-950/40 rounded-xl border border-emerald-500/30 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>
                {isBn
                  ? "সাপ্লাই ও ডিমান্ড + ক্যান্ডেলস্টিক স্টার আর্কিটেকচার"
                  : "SUPPLY & DEMAND + CANDLESTICK STARS BIBLE"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 mt-1">
              {isBn
                ? "সাপ্লাই-ডিমান্ড জোন ও ৩-ক্যান্ডেল স্টার মাস্টারক্লাস"
                : "Supply & Demand Formations & Morning/Evening Star Rules"}
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              {isBn
                ? "ডাবল টপ, ডাবল বটম, ফ্ল্যাগ কন্টিনিউয়েশন, রিটেস্ট ডিমান্ড/সাপ্লাই বেস এবং মর্নিং স্টার ও ইভনিং স্টারের সম্পূর্ণ প্রাতিষ্ঠানিক এন্ট্রি ও স্টপ-লস নিয়মাবলী।"
                : "Double Tops/Bottoms at Supply/Demand, Bull/Bear Flag Channels, Deep Retest Mitigations, and 3-Candle Morning Star / Evening Star institutional entries."}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0B0F19] px-4 py-2.5 rounded-lg border border-emerald-500/30">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-gray-400 font-mono uppercase">
                {isBn ? "মোট প্যাটার্ন" : "Total Setups"}
              </div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                8 Master Formations
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-gray-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              id="filter-all-sd"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                selectedCategory === "all"
                  ? "bg-emerald-500 text-black shadow-md font-extrabold"
                  : "bg-gray-800/80 text-gray-400 hover:text-gray-200"
              }`}
            >
              {isBn ? "সকল (৮)" : "All (8)"}
            </button>
            <button
              type="button"
              id="filter-sd-only"
              onClick={() => setSelectedCategory("sd")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                selectedCategory === "sd"
                  ? "bg-emerald-500 text-black shadow-md font-extrabold"
                  : "bg-gray-800/80 text-gray-400 hover:text-gray-200"
              }`}
            >
              {isBn ? "সাপ্লাই ও ডিমান্ড (৬)" : "Supply & Demand (6)"}
            </button>
            <button
              type="button"
              id="filter-stars-only"
              onClick={() => setSelectedCategory("stars")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                selectedCategory === "stars"
                  ? "bg-amber-500 text-black shadow-md font-extrabold"
                  : "bg-gray-800/80 text-gray-400 hover:text-gray-200"
              }`}
            >
              {isBn ? "স্টার প্যাটার্নস (২)" : "Morning / Evening Stars (2)"}
            </button>
            <button
              type="button"
              id="filter-reversal-sd"
              onClick={() => setSelectedCategory("reversal")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                selectedCategory === "reversal"
                  ? "bg-cyan-500 text-black shadow-md font-extrabold"
                  : "bg-gray-800/80 text-gray-400 hover:text-gray-200"
              }`}
            >
              {isBn ? "রিভার্সালস" : "Reversals"}
            </button>
            <button
              type="button"
              id="filter-continuation-sd"
              onClick={() => setSelectedCategory("continuation")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                selectedCategory === "continuation"
                  ? "bg-indigo-500 text-white shadow-md font-extrabold"
                  : "bg-gray-800/80 text-gray-400 hover:text-gray-200"
              }`}
            >
              {isBn ? "কন্টিনিউয়েশন" : "Continuations"}
            </button>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-sd-patterns"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "প্যাটার্ন খুঁজুন..." : "Search pattern..."}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0B0F19] border border-gray-700 rounded-md text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left side Cards, Right side Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pattern Cards (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPatterns.map((pattern) => {
              const isSelected = pattern.id === selectedPatternId;
              const isCall = pattern.signal === "CALL";
              const isStar = pattern.category === "Star Candlesticks";

              return (
                <div
                  key={pattern.id}
                  id={`sd-card-${pattern.id}`}
                  onClick={() => {
                    setSelectedPatternId(pattern.id);
                    setCalcPattern(pattern.id);
                  }}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#131E2C] border-emerald-500 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50"
                      : "bg-[#111827] border-gray-800 hover:border-gray-700 hover:bg-[#151D2E]"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Category + Signal */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-bold">
                          #{pattern.number}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            isStar
                              ? "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                              : "bg-blue-950/60 text-blue-300 border border-blue-800/40"
                          }`}
                        >
                          {isStar ? "Star Reversal" : pattern.zoneType}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded flex items-center gap-1 ${
                          isCall
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-600/50"
                            : "bg-red-950/80 text-red-400 border border-red-600/50"
                        }`}
                      >
                        {isCall ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {pattern.signal}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-bold text-sm text-gray-100 group-hover:text-emerald-400">
                        {isBn ? pattern.titleBn : pattern.titleEn}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {isBn ? pattern.summaryBn : pattern.summaryEn}
                      </p>
                    </div>

                    {/* Mini SVG Diagram */}
                    <div className="h-32 w-full bg-[#0B0F19] rounded-lg border border-gray-800/80 relative overflow-hidden flex items-center justify-center p-2">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 200 100"
                        preserveAspectRatio="none"
                      >
                        {/* Zone Box */}
                        <rect
                          x="10"
                          y={pattern.diagramConfig.zoneTopPercent}
                          width="180"
                          height={pattern.diagramConfig.zoneHeightPercent}
                          fill={
                            pattern.diagramConfig.zoneType === "supply"
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(16, 185, 129, 0.15)"
                          }
                          stroke={
                            pattern.diagramConfig.zoneType === "supply"
                              ? "#EF4444"
                              : "#10B981"
                          }
                          strokeWidth="1"
                          strokeDasharray={
                            pattern.category === "Star Candlesticks"
                              ? "3,3"
                              : undefined
                          }
                          rx="4"
                        />
                        <text
                          x="100"
                          y={
                            pattern.diagramConfig.zoneTopPercent +
                            pattern.diagramConfig.zoneHeightPercent / 2 +
                            3
                          }
                          textAnchor="middle"
                          fill={
                            pattern.diagramConfig.zoneType === "supply"
                              ? "#EF4444"
                              : "#10B981"
                          }
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {pattern.diagramConfig.zoneLabel}
                        </text>

                        {/* Trend lines if any */}
                        {pattern.diagramConfig.trendLines?.map((tl, i) => (
                          <line
                            key={i}
                            x1={`${tl.x1}%`}
                            y1={`${tl.y1}%`}
                            x2={`${tl.x2}%`}
                            y2={`${tl.y2}%`}
                            stroke={tl.color}
                            strokeWidth="1.2"
                            strokeDasharray={
                              tl.style === "dashed" ? "3,3" : undefined
                            }
                          />
                        ))}

                        {/* Candles */}
                        {pattern.diagramConfig.candles.map((candle, idx) => {
                          const candleX =
                            20 +
                            (idx /
                              (pattern.diagramConfig.candles.length - 1 || 1)) *
                              160;
                          const isGreen = candle.color === "green";
                          const isRed = candle.color === "red";
                          const candleColor = isGreen ? "#10B981" : "#EF4444";

                          return (
                            <g key={candle.id}>
                              {/* Wick */}
                              <line
                                x1={candleX}
                                y1={candle.wickTop}
                                x2={candleX}
                                y2={candle.wickBottom}
                                stroke={candleColor}
                                strokeWidth="1"
                              />
                              {/* Body */}
                              <rect
                                x={candleX - 4}
                                y={candle.bodyY}
                                width="8"
                                height={Math.max(4, candle.bodyH)}
                                fill={candleColor}
                                rx="1"
                              />
                              {/* Trigger indicator */}
                              {candle.isTrigger && (
                                <circle
                                  cx={candleX}
                                  cy={
                                    isCall
                                      ? candle.wickBottom
                                      : candle.wickTop
                                  }
                                  r="4"
                                  fill="#F59E0B"
                                  opacity="0.9"
                                />
                              )}
                            </g>
                          );
                        })}
                      </svg>

                      {/* Circle Highlight Badge */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-gray-900/90 text-emerald-400 border border-emerald-500/30">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>{pattern.winRateEst}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs font-mono">
                    <span className="text-gray-400">
                      {isBn ? "এক্সপায়রি:" : "Expiry:"}{" "}
                      <strong className="text-gray-200">{pattern.expiry}</strong>
                    </span>
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        isSelected ? "text-emerald-400" : "text-gray-400"
                      }`}
                    >
                      <span>{isBn ? "বিস্তারিত" : "Inspect"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Blueprint & Rule Breakdown (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Selected Pattern Detailed Card */}
          <div className="p-5 bg-[#111827] rounded-xl border border-gray-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                  {selectedPattern.category}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  {selectedPattern.type}
                </span>
              </div>
              <span
                className={`text-xs font-mono font-extrabold px-3 py-1 rounded-md flex items-center gap-1 ${
                  selectedPattern.signal === "CALL"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-600/50"
                    : "bg-red-950 text-red-400 border border-red-600/50"
                }`}
              >
                {selectedPattern.signal === "CALL" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {selectedPattern.signal}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-100">
              {isBn ? selectedPattern.titleBn : selectedPattern.titleEn}
            </h3>

            {/* Step-by-Step Institutional Execution Rules */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {isBn
                    ? "স্ট্রাকচারাল রুলস ও কনফার্মেশন"
                    : "Structural Criteria & Rules"}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-300 leading-relaxed pl-1">
                {(isBn
                  ? selectedPattern.structureRulesBn
                  : selectedPattern.structureRulesEn
                ).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-mono font-bold">
                      {idx + 1}.
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Entry & Margin of Safety */}
            <div className="p-3.5 bg-[#0B0F19] rounded-lg border border-cyan-900/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
                <Target className="w-4 h-4" />
                <span>
                  {isBn
                    ? "মার্জিন অফ সেফটি (MOS) এন্ট্রি স্ট্র্যাটেজি"
                    : "MOS Entry Execution Strategy"}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {isBn
                  ? selectedPattern.entryStrategyBn
                  : selectedPattern.entryStrategyEn}
              </p>
              <div className="text-[11px] text-cyan-300 font-mono pt-1 border-t border-gray-800">
                <strong>{isBn ? "১৫ সেকেন্ড রুল:" : "15-Sec Rule:"}</strong>{" "}
                {isBn ? selectedPattern.mosRuleBn : selectedPattern.mosRuleEn}
              </div>
            </div>

            {/* Invalidation / Pitfall */}
            <div className="p-3 bg-red-950/20 rounded-lg border border-red-900/40 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-[11px] font-mono font-bold text-red-400 uppercase">
                  {isBn ? "ইনভ্যালিডেশন / স্টপ-লস ক্রাইটেরিয়া" : "Invalidation / Stop-Loss Boundary"}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {isBn
                    ? selectedPattern.invalidationBn
                    : selectedPattern.invalidationEn}
                </p>
              </div>
            </div>

            {/* Launch Drill Action */}
            <button
              type="button"
              id="btn-launch-sd-drill"
              onClick={() =>
                onLaunchBlueprintDrill(selectedPattern.linkedScenarioId)
              }
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              <span>
                {isBn
                  ? `সিমুলেটরে "${selectedPattern.titleEn}" ড্রিল রান করুন`
                  : `Launch Drill: "${selectedPattern.titleEn}"`}
              </span>
            </button>
          </div>

          {/* Interactive Zone & Retest MOS Quant Calculator */}
          <div className="p-5 bg-[#111827] rounded-xl border border-gray-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold font-mono text-gray-100 uppercase">
                  {isBn
                    ? "সাপ্লাই/ডিমান্ড ও স্টার কোয়ান্ট ক্যালকুলেটর"
                    : "Zone Retest & Star Quant Calculator"}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-gray-400">
                Binary + Forex
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-gray-400 block mb-1">
                  {isBn
                    ? isPutPattern
                      ? "সাপ্লাই জোন টপ (High)"
                      : "সুইং হাই (Peak)"
                    : isPutPattern
                    ? "Supply Top (High)"
                    : "Swing High"}
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={calcHigh}
                  onChange={(e) => setCalcHigh(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-[#0B0F19] border border-gray-700 rounded text-xs font-mono text-gray-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 block mb-1">
                  {isBn
                    ? !isPutPattern
                      ? "ডিমান্ড জোন বটম (Low)"
                      : "সুইং লো (Base)"
                    : !isPutPattern
                    ? "Demand Floor (Low)"
                    : "Swing Low"}
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={calcLow}
                  onChange={(e) => setCalcLow(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-[#0B0F19] border border-gray-700 rounded text-xs font-mono text-gray-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Quant Output Levels */}
            <div className="p-3.5 bg-[#0B0F19] rounded-lg border border-gray-800 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-800">
                <span className="text-gray-400">
                  {isBn ? "৫০% গোল্ডেন মিডপয়েন্ট:" : "50% Golden Midpoint:"}
                </span>
                <span className="font-bold text-amber-400">
                  {midpoint50.toFixed(5)}
                </span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-gray-800">
                <span className="text-gray-400">
                  {isBn ? "প্রিসিশন MOS এন্ট্রি প্রাইস:" : "Precision MOS Entry:"}
                </span>
                <span
                  className={`font-bold ${
                    isPutPattern ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {targetMosPrice.toFixed(5)}
                </span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-gray-800">
                <span className="text-gray-400">
                  {isBn ? "ইনভ্যালিডেশন / SL লেভেল:" : "Invalidation Level:"}
                </span>
                <span className="text-gray-300">
                  {stopLossPrice.toFixed(5)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-gray-400">
                  {isBn ? "অ্যালগরিদমিক সিগন্যাল:" : "Algorithmic Verdict:"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-extrabold text-[11px] ${
                    isPutPattern
                      ? "bg-red-950 text-red-400 border border-red-700"
                      : "bg-emerald-950 text-emerald-400 border border-emerald-700"
                  }`}
                >
                  {isPutPattern ? "EXECUTE PUT (MOS)" : "EXECUTE CALL (MOS)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
