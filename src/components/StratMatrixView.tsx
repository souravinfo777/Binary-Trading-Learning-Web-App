import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  STRAT_CANDLE_DEFINITIONS,
  STRAT_SETUPS,
  STRAT_50_PERCENT_RULES,
  StratSetup,
  StratCandleVisual,
} from "../data/stratData";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Crosshair,
  Flame,
  Info,
  Layers,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

interface StratMatrixViewProps {
  onLaunchBlueprintDrill?: (scenarioId: string) => void;
}

export const StratMatrixView: React.FC<StratMatrixViewProps> = ({
  onLaunchBlueprintDrill,
}) => {
  const { isBn } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedSetup, setSelectedSetup] = useState<StratSetup | null>(
    STRAT_SETUPS[0]
  );

  // 50% Rule Calculator State
  const [calcHigh, setCalcHigh] = useState<number>(1.085);
  const [calcLow, setCalcLow] = useState<number>(1.081);
  const [calcDirection, setCalcDirection] = useState<"BULLISH" | "BEARISH">("BULLISH");

  const calcFiftyPercent = (calcHigh + calcLow) / 2;
  const calcTarget = calcDirection === "BULLISH" ? calcHigh : calcLow;
  const calcExit = calcDirection === "BULLISH" ? calcLow : calcHigh;

  const categories = [
    { id: "all", labelEn: "All Setups (15)", labelBn: "সকল স্ট্র্যাট সেটআপ (১৫)" },
    { id: "Continuation", labelEn: "Continuations", labelBn: "কন্টিনিউয়েশন" },
    { id: "Reversal", labelEn: "Reversals", labelBn: "রিভার্সাল সেটআপ" },
    { id: "PMG", labelEn: "PMG Machine Gun", labelBn: "PMG মেশিন গান" },
    { id: "1-Bar 50%", labelEn: "50% Retracement", labelBn: "৫০% রিট্রেসমেন্ট" },
  ];

  const filteredSetups = STRAT_SETUPS.filter((setup) => {
    if (activeCategory === "all") return true;
    return setup.category === activeCategory;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Master Golden Rule Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-950 via-gray-900 to-black p-5 sm:p-6 border-2 border-emerald-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{isBn ? "দ্য স্ট্র্যাট ইউনিভার্সাল এক্সিকিউশন রুল" : "THE STRAT UNIVERSAL PRICE ACTION SYSTEM"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>WICKS — </span>
              <span className="text-emerald-400 underline decoration-emerald-500/50 underline-offset-4">
                {isBn ? "ক্যান্ডেলের High বা Low উইকে এন্ট্রি, বডিতে নয়!" : "We enter on the candle's HIGH or LOW, NOT bodies"}
              </span>
            </h2>
            <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
              {isBn
                ? "দ্য স্ট্র্যাট (The Strat) মেথডোলজিতে কোনো অনুমান ছাড়া প্রতিটি ক্যান্ডেলকে ১ (ইনসাইড), ২ (ডিরেকশনাল) বা ৩ (আউটসাইড) হিসেবে শ্রেণিভুক্ত করা হয়। এন্ট্রি সর্বদা পূর্ববর্তী ক্যান্ডেলের উইক ব্রেকআউটে ট্রিগার হয়।"
                : "The Strat categorizes every single candle into 1 (Inside), 2 (Directional), or 3 (Outside). Actionable trades trigger the exact second price crosses the previous candle's wick extreme."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-lg bg-black/80 border border-yellow-500/40 text-yellow-300 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
              <span>1 = Inside Bar</span>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-black/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>2U = 2-Up / 2D = 2-Down</span>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-black/80 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400"></span>
              <span>3 = Outside Bar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strat The 3 Candle Types & 50% Rule Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* The 3 Candle Types Breakdown */}
        <div className="lg:col-span-2 bg-[#0B0F17] rounded-xl border border-[#1F2937] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-gray-100">
                {isBn ? "দ্য স্ট্র্যাট: ৩টি মৌলিক ক্যান্ডেল টাইপ" : "The 3 Strat Candle Types"}
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-400">
              {isBn ? "ক্যান্ডেলস্টিক মেকানিক্স" : "Universal Classification"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STRAT_CANDLE_DEFINITIONS.map((def) => (
              <div
                key={def.type}
                className="p-3.5 rounded-lg bg-black/60 border border-[#1F2937] hover:border-gray-600 transition-all flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                      style={{
                        backgroundColor: `${def.color}20`,
                        color: def.color,
                        border: `1px solid ${def.color}50`,
                      }}
                    >
                      {def.type}
                    </span>
                    <span className="text-xs font-bold text-gray-200">
                      {isBn ? def.nameBn : def.nameEn}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {isBn ? def.descriptionBn : def.descriptionEn}
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-800 text-[11px] font-mono text-gray-300">
                  <span className="text-cyan-400 font-bold">{isBn ? "নিয়ম: " : "Rule: "}</span>
                  {isBn ? def.ruleBn : def.ruleEn}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 50% Strat Rule Interactive Box */}
        <div className="bg-[#0B0F17] rounded-xl border border-[#1F2937] p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-yellow-400" />
                <h3 className="text-base font-bold text-gray-100">
                  {isBn ? "৫০% স্ট্র্যাট গোল্ডেন রুল" : "The 50% Strat Rules"}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-bold">
                1-2-3 FORMULA
              </span>
            </div>

            <div className="space-y-2.5">
              {STRAT_50_PERCENT_RULES.map((r) => (
                <div
                  key={r.step}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/40 border border-[#1F2937]"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                    {r.step}
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {isBn ? r.ruleBn : r.ruleEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isBn
                ? "৫০% রিট্রেসমেন্ট সম্পন্ন হলে রিভার্সাল ক্যান্ডেল শতভাগ উইনিং মোমেন্টাম পায়।"
                : "Once 50% retracement touches with rejection, target accuracy exceeds 90%."}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2 bg-[#0B0F17] p-1.5 rounded-xl border border-[#1F2937]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              id={`strat-tab-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-md border border-emerald-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              }`}
            >
              {isBn ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-gray-400">
          {isBn ? `প্রদর্শিত হচ্ছে: ${filteredSetups.length} টি সেটআপ` : `Showing ${filteredSetups.length} Setups`}
        </div>
      </div>

      {/* Strat Setups Grid (Matching User Uploaded Architecture) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSetups.map((setup) => {
          const isSelected = selectedSetup?.id === setup.id;
          const isBullish = setup.bias === "CALL";

          return (
            <div
              key={setup.id}
              id={`strat-card-${setup.id}`}
              onClick={() => setSelectedSetup(setup)}
              className={`cursor-pointer rounded-xl bg-black border transition-all overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "border-emerald-400 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-950/50"
                  : "border-[#1F2937] hover:border-gray-600 hover:bg-[#070A10]"
              }`}
            >
              {/* Card Header */}
              <div className="p-4 bg-[#0B0F17] border-b border-[#1F2937] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-white">
                      {setup.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isBullish
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                          : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {setup.bias}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-gray-300 mt-0.5">
                    {isBn ? setup.titleBn : setup.titleEn}
                  </h4>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">
                    {isBn ? "উইন রেট" : "Win Rate"}
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {setup.winRate}
                  </div>
                </div>
              </div>

              {/* Visual Strat SVG Canvas (Exact Replication of Visual Model) */}
              <div className="p-4 bg-black flex items-center justify-center relative min-h-[220px]">
                <StratCandleChart setup={setup} />
              </div>

              {/* Card Footer Key Wick Rules */}
              <div className="p-4 bg-[#090D14] border-t border-[#1F2937] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">{isBn ? "এন্ট্রি উইক:" : "Entry Wick:"}</span>
                  <span className="font-bold text-white">
                    {isBn ? setup.entryLevelBn : setup.entryLevelEn}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">{isBn ? "টার্গেট:" : "Target:"}</span>
                  <span className="font-bold text-emerald-400">
                    {isBn ? setup.targetLevelBn : setup.targetLevelEn}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">{isBn ? "স্টপ/এক্সিট:" : "Exit/Stop:"}</span>
                  <span className="font-bold text-rose-400">
                    {isBn ? setup.exitLevelBn : setup.exitLevelEn}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-cyan-400 font-mono">
                    {isBn ? "বিস্তারিত দেখুন →" : "View Blueprint →"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSetup(setup);
                    }}
                    className="px-2.5 py-1 rounded bg-gray-800 hover:bg-emerald-600 hover:text-white text-gray-300 text-[11px] font-mono font-bold transition-all"
                  >
                    {isBn ? "সিলেক্ট" : "Inspect"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Setup Detailed Modal / Drawer View */}
      {selectedSetup && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#0B0F17] border border-emerald-500/40 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                  {selectedSetup.code}
                </span>
                <span className="text-xs font-mono text-gray-400 uppercase">
                  {selectedSetup.category}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 ml-2">
                  Win Rate: {selectedSetup.winRate}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {isBn ? selectedSetup.titleBn : selectedSetup.titleEn}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 ${
                  selectedSetup.bias === "CALL"
                    ? "bg-emerald-600 text-white"
                    : "bg-rose-600 text-white"
                }`}
              >
                {selectedSetup.bias === "CALL" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>EXECUTE {selectedSetup.bias}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detailed Visual Graphic */}
            <div className="lg:col-span-1 bg-black rounded-xl border border-gray-800 p-4 flex flex-col items-center justify-center min-h-[260px]">
              <StratCandleChart setup={selectedSetup} isLarge />
            </div>

            {/* Trading Blueprint & Execution Rules */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-black/60 border border-gray-800 space-y-3">
                <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-2">
                  <Crosshair className="w-4 h-4" />
                  <span>{isBn ? "উইক এক্সিকিউশন সূত্র (Wick Trigger Rules)" : "Wick Execution Blueprint"}</span>
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed font-sans">
                  {isBn ? selectedSetup.descriptionBn : selectedSetup.descriptionEn}
                </p>
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                  <strong className="text-white">{isBn ? "গোল্ডেন ট্রিগার: " : "Golden Trigger: "}</strong>
                  {isBn ? selectedSetup.triggerWickRuleBn : selectedSetup.triggerWickRuleEn}
                </div>
              </div>

              {/* Levels Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-black/50 border border-emerald-500/30">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    {isBn ? "টার্গেট লেভেল" : "Target Level"}
                  </div>
                  <div className="text-xs font-bold text-white mt-1 font-mono">
                    {isBn ? selectedSetup.targetLevelBn : selectedSetup.targetLevelEn}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-black/50 border border-gray-700">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    {isBn ? "এন্ট্রি ট্রিগার (উইক)" : "Entry Trigger (Wick)"}
                  </div>
                  <div className="text-xs font-bold text-white mt-1 font-mono">
                    {isBn ? selectedSetup.entryLevelBn : selectedSetup.entryLevelEn}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-black/50 border border-rose-500/30">
                  <div className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                    {isBn ? "ইনভ্যালিডেশন / এক্সিট" : "Invalidation / Exit"}
                  </div>
                  <div className="text-xs font-bold text-white mt-1 font-mono">
                    {isBn ? selectedSetup.exitLevelBn : selectedSetup.exitLevelEn}
                  </div>
                </div>
              </div>

              {/* 50% Rule Application */}
              <div className="p-3.5 rounded-lg bg-yellow-950/20 border border-yellow-500/30 text-xs space-y-1">
                <span className="font-mono font-bold text-yellow-400 uppercase">
                  {isBn ? "৫০% রুল প্রয়োগ:" : "50% Rule Application:"}
                </span>
                <p className="text-gray-300">
                  {isBn ? selectedSetup.rule50PercentBn : selectedSetup.rule50PercentEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live 50% Retracement & Target Interactive Calculator */}
      <div className="bg-[#0B0F17] rounded-xl border border-[#1F2937] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isBn ? "লাইভ ৫০% রিট্রেসমেন্ট ও উইক টার্গেট ক্যালকুলেটর" : "Live 50% Retracement & Wick Target Engine"}
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {isBn ? "ক্যালকুলেট করুন ক্যান্ডেলের ৫০% ইকুইলিব্রিয়াম" : "Calculate Instant 50% Strat Equilibrium"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">
              {isBn ? "পূর্ববর্তী ক্যান্ডেল High প্রাইস" : "Previous Candle High"}
            </label>
            <input
              type="number"
              step="0.0001"
              value={calcHigh}
              onChange={(e) => setCalcHigh(parseFloat(e.target.value) || 0)}
              className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">
              {isBn ? "পূর্ববর্তী ক্যান্ডেল Low প্রাইস" : "Previous Candle Low"}
            </label>
            <input
              type="number"
              step="0.0001"
              value={calcLow}
              onChange={(e) => setCalcLow(parseFloat(e.target.value) || 0)}
              className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">
              {isBn ? "ট্রেড বায়াস / ডিরেকশন" : "Trade Direction"}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCalcDirection("BULLISH")}
                className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  calcDirection === "BULLISH"
                    ? "bg-emerald-600 text-white"
                    : "bg-black border border-gray-700 text-gray-400"
                }`}
              >
                CALL (2U)
              </button>
              <button
                type="button"
                onClick={() => setCalcDirection("BEARISH")}
                className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  calcDirection === "BEARISH"
                    ? "bg-rose-600 text-white"
                    : "bg-black border border-gray-700 text-gray-400"
                }`}
              >
                PUT (2D)
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black border border-yellow-500/40">
            <div className="text-[10px] font-mono text-yellow-400 uppercase font-bold">
              {isBn ? "৫০% রিট্রেসমেন্ট এন্ট্রি লেভেল" : "50% Retracement Line"}
            </div>
            <div className="text-base font-mono font-extrabold text-white mt-0.5">
              {calcFiftyPercent.toFixed(5)}
            </div>
          </div>
        </div>

        {/* Output Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-black/60 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">{isBn ? "টার্গেট (অন্য প্রান্ত):" : "Target (Other Side):"}</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {calcTarget.toFixed(5)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-black/60 border border-yellow-500/30 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">{isBn ? "৫০% ইকুইলিব্রিয়াম:" : "50% Entry Level:"}</span>
            <span className="text-xs font-mono font-bold text-yellow-400">
              {calcFiftyPercent.toFixed(5)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-black/60 border border-rose-500/30 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">{isBn ? "ইনভ্যালিডেশন (সুইপ সাইড):" : "Stop (Swept Side):"}</span>
            <span className="text-xs font-mono font-bold text-rose-400">
              {calcExit.toFixed(5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StratCandleChartProps {
  setup: StratSetup;
  isLarge?: boolean;
}

const StratCandleChart: React.FC<StratCandleChartProps> = ({
  setup,
  isLarge = false,
}) => {
  const width = isLarge ? 320 : 260;
  const height = isLarge ? 220 : 180;
  const paddingX = 35;
  const paddingY = 25;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const candleCount = setup.candles.length;
  const slotWidth = chartW / candleCount;
  const candleW = Math.min(32, slotWidth * 0.7);

  const getY = (val: number) => {
    // val is 0-100 where 100 is top high
    return height - paddingY - (val / 100) * chartH;
  };

  return (
    <div className="relative select-none">
      <svg width={width} height={height} className="overflow-visible">
        {/* Background Grid */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="#000000"
          rx="8"
        />

        {/* Key Level Overlay Lines (TARGET, ENTRY, EXIT) */}
        {/* Target Line */}
        {setup.keyLevels.targetY !== undefined && (
          <g>
            <line
              x1={paddingX - 10}
              y1={getY(100 - setup.keyLevels.targetY)}
              x2={width - 5}
              y2={getY(100 - setup.keyLevels.targetY)}
              stroke="#10B981"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
            <text
              x={width - 8}
              y={getY(100 - setup.keyLevels.targetY) - 4}
              textAnchor="end"
              fill="#10B981"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              TARGET
            </text>
          </g>
        )}

        {/* Entry Line */}
        {setup.keyLevels.entryY !== undefined && (
          <g>
            <line
              x1={paddingX - 10}
              y1={getY(100 - setup.keyLevels.entryY)}
              x2={width - 5}
              y2={getY(100 - setup.keyLevels.entryY)}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text
              x={width - 8}
              y={getY(100 - setup.keyLevels.entryY) - 4}
              textAnchor="end"
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              ENTRY
            </text>
          </g>
        )}

        {/* Exit Line */}
        {setup.keyLevels.exitY !== undefined && (
          <g>
            <line
              x1={paddingX - 10}
              y1={getY(100 - setup.keyLevels.exitY)}
              x2={width - 5}
              y2={getY(100 - setup.keyLevels.exitY)}
              stroke="#F43F5E"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
            <text
              x={width - 8}
              y={getY(100 - setup.keyLevels.exitY) + 11}
              textAnchor="end"
              fill="#F43F5E"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              EXIT
            </text>
          </g>
        )}

        {/* Render Candles */}
        {setup.candles.map((candle, idx) => {
          const cx = paddingX + idx * slotWidth + slotWidth / 2;
          const yHigh = getY(candle.high);
          const yLow = getY(candle.low);
          const yOpen = getY(candle.open);
          const yClose = getY(candle.close);

          const bodyTop = Math.min(yOpen, yClose);
          const bodyHeight = Math.max(4, Math.abs(yClose - yOpen));

          const candleColor =
            candle.color === "green"
              ? "#10B981"
              : candle.color === "red"
              ? "#F43F5E"
              : candle.color === "yellow"
              ? "#EAB308"
              : "#D946EF";

          return (
            <g key={`candle-${idx}`}>
              {/* Upper & Lower Wicks */}
              <line
                x1={cx}
                y1={yHigh}
                x2={cx}
                y2={yLow}
                stroke={candleColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Candle Body */}
              <rect
                x={cx - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={bodyHeight}
                fill={candleColor}
                rx="2"
              />

              {/* Label underneath (2, 1, 2U, 2D, 3, etc.) */}
              <text
                x={cx}
                y={height - 6}
                textAnchor="middle"
                fill={candleColor}
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {candle.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
