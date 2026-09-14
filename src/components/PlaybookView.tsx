import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { SURESHOT_PATTERNS, SureshotPattern } from "../data/sureshotPatterns";
import { SureshotCard } from "./SureshotCard";
import { MosCalculator } from "./MosCalculator";
import { StratMatrixView } from "./StratMatrixView";
import { GapPatternsView } from "./GapPatternsView";
import { SupplyDemandView } from "./SupplyDemandView";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  Filter,
  Flame,
  Layers,
  PlayCircle,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

interface PlaybookViewProps {
  onLaunchBlueprintDrill: (scenarioId: string) => void;
  initialSubTab?: "sureshots" | "strat" | "gaps" | "supply_demand" | "calculator" | "blueprints";
  initialPatternId?: string;
}

export const PlaybookView: React.FC<PlaybookViewProps> = ({
  onLaunchBlueprintDrill,
  initialSubTab,
  initialPatternId,
}) => {
  const { t, isBn } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<
    "sureshots" | "strat" | "gaps" | "supply_demand" | "calculator" | "blueprints"
  >(initialSubTab || "sureshots");

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (initialPatternId && activeSubTab === "sureshots") {
      setSelectedCategory("all");
      setSearchQuery("");
      // Scroll to pattern if available
      setTimeout(() => {
        const el = document.getElementById(`sureshot-card-${initialPatternId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [initialPatternId, activeSubTab]);

  const categories = [
    { id: "all", labelEn: "All Sureshots (10)", labelBn: "সকল শিওর শট (১০)" },
    { id: "50% Golden Level", labelEn: "50% Golden Level", labelBn: "৫০% গোল্ডেন লেভেল" },
    { id: "Engulfing & Piercing", labelEn: "Engulfing & Piercing", labelBn: "এনগালফিং ও পিয়ার্সিং" },
    { id: "Gap & Overlap SNR", labelEn: "Gap & Overlap SNR", labelBn: "গ্যাপ ও ওভারল্যাপ SNR" },
    { id: "Wicks & Rejections", labelEn: "Wicks & Rejections", labelBn: "উইক ও রিজেকশন" },
    { id: "OTC Mechanics", labelEn: "OTC Mechanics", labelBn: "OTC অ্যালগরিদম" },
  ];

  const filteredPatterns = SURESHOT_PATTERNS.filter((pattern) => {
    const matchesCategory =
      selectedCategory === "all" || pattern.category === selectedCategory;
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
    <div className="flex flex-col gap-5 w-full">
      {/* Playbook Header */}
      <div className="p-5 sm:p-6 bg-[#111827] rounded-xl border border-[#1F2937] shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>{isBn ? "বাইনারি ও OTC শিওর শট স্ট্র্যাটেজি প্লেবুক" : "BINARY & OTC SURESHOT PLAYBOOK BIBLE"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100 mt-1">
              {isBn ? "ক্যান্ডেলস্টিক প্যাটার্নস গাইড ও শিওর শট ট্রেডিং মেথডোলজি" : "Candlestick Patterns Guide & Sureshot Trading Engine"}
            </h1>
          </div>

          {/* Sub-tab Navigation (Touch-scrollable on mobile) */}
          <div className="flex items-center gap-1.5 bg-[#090D16] p-1.5 rounded-xl border border-[#1F2937] overflow-x-auto no-scrollbar w-full sm:w-auto max-w-full touch-pan-x">
            <button
              type="button"
              id="subtab-sureshots"
              onClick={() => setActiveSubTab("sureshots")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all shrink-0 whitespace-nowrap ${
                activeSubTab === "sureshots"
                  ? "bg-cyan-600 text-white shadow-md border border-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isBn ? "শিওর শট প্যাটার্নস" : "Sureshot Bible"}</span>
            </button>

            <button
              type="button"
              id="subtab-strat"
              onClick={() => setActiveSubTab("strat")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all shrink-0 whitespace-nowrap ${
                activeSubTab === "strat"
                  ? "bg-emerald-600 text-white shadow-md border border-emerald-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-yellow-400" />
              <span>{isBn ? "দ্য স্ট্র্যাট ও উইক এন্ট্রি (Strat)" : "The Strat Matrix"}</span>
            </button>

            <button
              type="button"
              id="subtab-gaps"
              onClick={() => setActiveSubTab("gaps")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all shrink-0 whitespace-nowrap ${
                activeSubTab === "gaps"
                  ? "bg-amber-500 text-black shadow-md border border-amber-300 font-extrabold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? "গ্যাপ প্যাটার্নস (Gaps)" : "Gap Patterns (9)"}</span>
            </button>

            <button
              type="button"
              id="subtab-supply-demand"
              onClick={() => setActiveSubTab("supply_demand")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all shrink-0 whitespace-nowrap ${
                activeSubTab === "supply_demand"
                  ? "bg-emerald-500 text-black shadow-md border border-emerald-300 font-extrabold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isBn ? "সাপ্লাই-ডিমান্ড ও স্টার (S&D)" : "Supply/Demand & Stars (8)"}</span>
            </button>

            <button
              type="button"
              id="subtab-calculator"
              onClick={() => setActiveSubTab("calculator")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all shrink-0 whitespace-nowrap ${
                activeSubTab === "calculator"
                  ? "bg-cyan-600 text-white shadow-md border border-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{isBn ? "৫০% লেভেল ও MOS ক্যালকুলেটর" : "50% & MOS Calc"}</span>
            </button>

            <button
              type="button"
              id="subtab-blueprints"
              onClick={() => setActiveSubTab("blueprints")}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all shrink-0 whitespace-nowrap ${
                activeSubTab === "blueprints"
                  ? "bg-cyan-600 text-white shadow-md border border-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isBn ? "A+ ব্লুপ্রিন্টস" : "A+ Blueprints"}</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 max-w-5xl leading-relaxed">
          {isBn
            ? "বাইনারি ও OTC মার্কেটে ধারাবাহিক সাফল্যের মূল ভিত্তি হলো ৫০% ক্যান্ডেল বডি রিটেস্ট, মার্জিন অফ সেফটি (MOS) এক্সিকিউশন, ভ্যালিড এনগালফিং সাইজ ক্যালকুলেশন (৫১-১৪৯%) এবং গ্যাপ লেভেল ডায়নামিক্স।"
            : "Precision price action methodologies grounded in the 50% candle body retest, Margin of Safety (MOS) 10-second timing, 51%-149% valid engulfing ratios, and OTC Gap dynamics."}
        </p>
      </div>

      {/* SUB-TAB 1: SURESHOT CANDLESTICK BIBLE */}
      {activeSubTab === "sureshots" && (
        <div className="space-y-4 sm:space-y-5">
          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 sm:p-4 bg-[#111827] rounded-xl border border-[#1F2937]">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none touch-pan-x">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-xs"
                      : "bg-[#090D16] text-gray-400 hover:text-gray-200 border border-[#1F2937]"
                  }`}
                >
                  {isBn ? cat.labelBn : cat.labelEn}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-auto md:min-w-[240px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? "প্যাটার্ন খুঁজুন..." : "Search sureshots..."}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#090D16] border border-[#1F2937] text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Sureshot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-5">
            {filteredPatterns.map((pattern) => (
              <div key={pattern.id} id={`sureshot-card-${pattern.id}`}>
                <SureshotCard
                  pattern={pattern}
                  onLaunchDrill={onLaunchBlueprintDrill}
                />
              </div>
            ))}
          </div>

          {filteredPatterns.length === 0 && (
            <div className="p-8 text-center bg-[#111827] rounded-xl border border-[#1F2937] text-gray-400 space-y-2">
              <p className="text-sm font-mono">
                {isBn ? "কোনো প্যাটার্ন পাওয়া যায়নি।" : "No sureshot patterns match your search filter."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-xs text-cyan-400 underline font-mono cursor-pointer"
              >
                {isBn ? "সব ফিল্টার রিসেট করুন" : "Reset all filters"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB: THE STRAT MATRIX & WICK RULES */}
      {activeSubTab === "strat" && (
        <StratMatrixView onLaunchBlueprintDrill={onLaunchBlueprintDrill} />
      )}

      {/* SUB-TAB: GAP PATTERNS TO KNOW (9 FORMATIONS) */}
      {activeSubTab === "gaps" && (
        <GapPatternsView
          onLaunchBlueprintDrill={onLaunchBlueprintDrill}
          initialPatternId={initialPatternId}
        />
      )}

      {/* SUB-TAB: SUPPLY & DEMAND + CANDLESTICK STARS (8 FORMATIONS) */}
      {activeSubTab === "supply_demand" && (
        <SupplyDemandView
          onLaunchBlueprintDrill={onLaunchBlueprintDrill}
          initialPatternId={initialPatternId}
        />
      )}

      {/* SUB-TAB 2: INTERACTIVE 50% & MOS QUANT CALCULATOR */}
      {activeSubTab === "calculator" && <MosCalculator />}

      {/* SUB-TAB 3: INSTITUTIONAL A+ BLUEPRINTS */}
      {activeSubTab === "blueprints" && (
        <div className="space-y-4 sm:space-y-5">
          {/* 3 A+ Blueprint Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {/* Setup 1: Sweep + .00 Level + Rejection Wick */}
            <div className="p-3.5 sm:p-5 bg-[#111827] rounded-xl border border-[#1F2937] space-y-4 shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-cyan-950/70 text-cyan-300 font-mono font-bold text-xs border border-cyan-700/60">
                    {isBn ? "ব্লুপ্রিন্ট সেটআপ ১" : "BLUEPRINT SETUP 1"}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {isBn ? "১ মিনিট মেয়াদ" : "1M EXPIRY"}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-100 leading-snug">
                  {t("setup1Title")}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {t("setup1Desc")}
                </p>

                {/* Confluence Criteria List */}
                <div className="space-y-2 pt-3 border-t border-[#1F2937]">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block font-mono">
                    {isBn ? "প্রয়োজনীয় কনফ্লুয়েন্স চেকলিস্ট:" : "Required Confluence Checklist:"}
                  </span>
                  <ul className="text-xs sm:text-sm space-y-1.5 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "প্রধান .০০ বা .৫০ রাউন্ড নাম্বার লেভেল সুইপ" : "Major .00 or .50 round number sweep"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "৬০%+ রিজেকশন উইক এবং লেভেলের ভেতরে ক্লোজ" : "60%+ rejection wick & Close-Back-Inside"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "হায়ার টাইমফ্রেমের সাপ্লাই/ডিমান্ড জোনে স্পর্শ" : "HTF Supply / Demand zone tap"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "বুল/বেয়ার ট্র্যাপ ক্লিয়ারেন্স এবং ভলিউম শোষণ" : "Trapped breakout liquidity absorbed"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                id="launch-blueprint-1-btn"
                onClick={() => onLaunchBlueprintDrill("OTC_CH29_001")}
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-3 sm:mt-4 min-h-[44px] rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md border border-cyan-400 transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{t("drillSetup1")}</span>
              </button>
            </div>

            {/* Setup 2: Trend Continuation Order Block + FVG Retest */}
            <div className="p-3.5 sm:p-5 bg-[#111827] rounded-xl border border-[#1F2937] space-y-4 shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-emerald-950/70 text-emerald-300 font-mono font-bold text-xs border border-emerald-700/60">
                    {isBn ? "ব্লুপ্রিন্ট সেটআপ ২" : "BLUEPRINT SETUP 2"}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {isBn ? "১/২ মিনিট মেয়াদ" : "1M/2M EXPIRY"}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-100 leading-snug">
                  {t("setup2Title")}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {t("setup2Desc")}
                </p>

                {/* Confluence Criteria List */}
                <div className="space-y-2 pt-3 border-t border-[#1F2937]">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                    {isBn ? "প্রয়োজনীয় কনফ্লুয়েন্স চেকলিস্ট:" : "Required Confluence Checklist:"}
                  </span>
                  <ul className="text-xs sm:text-sm space-y-1.5 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "পরিষ্কার কাঠামোগত ট্রেন্ড ও ব্রেক অফ স্ট্রাকচার (BOS)" : "Clear structural trend & BOS"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "FVG-এর ৫০% কনসিকুয়েন্ট এনক্রোচমেন্ট (CE) রিটেস্ট" : "Mitigation into 50% CE of the FVG"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "জোনে পৌঁছানোর সময় পুলব্যাক ক্যান্ডেলের গতি হ্রাস" : "Decelerating pullback candles"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "তাজা অর্ডার ব্লক স্পর্শ ও রেসপনসিভ বাউন্স" : "Responsive rejection wick on tap"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                id="launch-blueprint-2-btn"
                onClick={() => onLaunchBlueprintDrill("OTC_CH10_001")}
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-3 sm:mt-4 min-h-[44px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md border border-emerald-400 transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{t("drillSetup2")}</span>
              </button>
            </div>

            {/* Setup 3: Algorithmic Trap Breakout Failure */}
            <div className="p-3.5 sm:p-5 bg-[#111827] rounded-xl border border-[#1F2937] space-y-4 shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-purple-950/70 text-purple-300 font-mono font-bold text-xs border border-purple-700/60">
                    {isBn ? "ব্লুপ্রিন্ট সেটআপ ৩" : "BLUEPRINT SETUP 3"}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {isBn ? "১ মিনিট মেয়াদ" : "1M EXPIRY"}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-100 leading-snug">
                  {t("setup3Title")}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {t("setup3Desc")}
                </p>

                {/* Confluence Criteria List */}
                <div className="space-y-2 pt-3 border-t border-[#1F2937]">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block font-mono">
                    {isBn ? "প্রয়োজনীয় কনফ্লুয়েন্স চেকলিস্ট:" : "Required Confluence Checklist:"}
                  </span>
                  <ul className="text-xs sm:text-sm space-y-1.5 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "ভলিউম বা ফলো-থ্রু ছাড়া ফলস ব্রেকআউট ক্যান্ডেল" : "Breakout candle closed without volume expansion"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "পরবর্তী ক্যান্ডেলেই তীব্র বিপরীত এনগালফিং রিঅ্যাকশন" : "Immediate engulfing reaction in opposite direction"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "হায়ার টাইমফ্রেমের শক্তিশালী দিকনির্দেশনার সাথে মিল" : "HTF directional bias alignment"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{isBn ? "ফাঁদে পড়া ট্রেডারদের লিকুইডেশন দ্রুত গতি তৈরি করে" : "Trapped liquidation creates aggressive momentum"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                id="launch-blueprint-3-btn"
                onClick={() => onLaunchBlueprintDrill("OTC_CH14_001")}
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-3 sm:mt-4 min-h-[44px] rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md border border-purple-400 transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{t("drillSetup3")}</span>
              </button>
            </div>
          </div>

          {/* Disqualification Filters & No-Trade Matrix */}
          <div className="p-5 sm:p-6 bg-[#111827] rounded-xl border border-[#1F2937] space-y-4 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-100 font-mono">
                {t("disqualificationTitle")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-800/40 space-y-2">
                <span className="text-sm font-bold text-rose-300 block">
                  {t("filter1Title")}
                </span>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {t("filter1Desc")}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-800/40 space-y-2">
                <span className="text-sm font-bold text-rose-300 block">
                  {t("filter2Title")}
                </span>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {t("filter2Desc")}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-800/40 space-y-2">
                <span className="text-sm font-bold text-rose-300 block">
                  {t("filter3Title")}
                </span>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {t("filter3Desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
