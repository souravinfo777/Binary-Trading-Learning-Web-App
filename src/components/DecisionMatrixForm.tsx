import React, { useState, useEffect } from "react";
import { Scenario, TenPointMatrix } from "../types";
import { useLanguage } from "../context/LanguageContext";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";

interface DecisionMatrixFormProps {
  scenario: Scenario;
  onSubmit: (submission: TenPointMatrix) => void;
  isSubmitting?: boolean;
  isResolved?: boolean;
}

export const DecisionMatrixForm: React.FC<DecisionMatrixFormProps> = ({
  scenario,
  onSubmit,
  isSubmitting = false,
  isResolved = false,
}) => {
  const { t, isBn, getMatrixField, getActionName } = useLanguage();
  const [matrix, setMatrix] = useState<TenPointMatrix>({
    trend: "",
    structure: "",
    location: "",
    keyLevel: "",
    roundNumber: "",
    liquidity: "",
    fvgOb: "",
    momentum: "",
    reaction: "",
    executionAction: "",
    expiry: "1M",
    invalidationCondition: "",
  });

  const [isExpanded, setIsExpanded] = useState(true);

  // Reset form when scenario changes
  useEffect(() => {
    setMatrix({
      trend: "",
      structure: "",
      location: "",
      keyLevel: "",
      roundNumber: "",
      liquidity: "",
      fvgOb: "",
      momentum: "",
      reaction: "",
      executionAction: "",
      expiry: scenario.expected_expiry || "1M",
      invalidationCondition: "",
    });
  }, [scenario.scenario_id]);

  const handleActionSelect = (action: "CALL" | "PUT" | "NO TRADE") => {
    if (isResolved) return;
    setMatrix((prev) => ({ ...prev, executionAction: action }));
  };

  const handleExpirySelect = (expiry: "1M" | "2M") => {
    if (isResolved) return;
    setMatrix((prev) => ({ ...prev, expiry }));
  };

  const handleQuickFillInstitutionalBaseline = () => {
    setMatrix({
      trend: scenario.ideal_10_point_analysis.trend,
      structure: scenario.ideal_10_point_analysis.structure,
      location: scenario.ideal_10_point_analysis.location,
      keyLevel: scenario.ideal_10_point_analysis.keyLevel,
      roundNumber: scenario.ideal_10_point_analysis.roundNumber,
      liquidity: scenario.ideal_10_point_analysis.liquidity,
      fvgOb: scenario.ideal_10_point_analysis.fvgOb,
      momentum: scenario.ideal_10_point_analysis.momentum,
      reaction: scenario.ideal_10_point_analysis.reaction,
      executionAction: scenario.expected_action,
      expiry: scenario.expected_expiry,
      invalidationCondition: isBn
        ? "পরবর্তী ক্যান্ডেল যদি কি-কাঠামোগত বাউন্ডারি লঙ্ঘন করে তবে বাতিল।"
        : "Invalidated if next candle violates key structural boundary.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matrix.executionAction) {
      alert(isBn ? "অনুগ্রহ করে পরবর্তী ক্যান্ডেলের জন্য ট্রেড অ্যাকশন (CALL / PUT / NO TRADE) নির্বাচন করুন।" : "Please select your execution action (CALL, PUT, or NO TRADE) for the next candle.");
      return;
    }
    onSubmit(matrix);
  };

  const fTrend = getMatrixField("trend");
  const fStructure = getMatrixField("structure");
  const fLocation = getMatrixField("location");
  const fKeyLevel = getMatrixField("keyLevel");
  const fRoundNumber = getMatrixField("roundNumber");
  const fLiquidity = getMatrixField("liquidity");
  const fFvgOb = getMatrixField("fvgOb");
  const fMomentum = getMatrixField("momentum");
  const fReaction = getMatrixField("reaction");
  const fInvalidation = getMatrixField("invalidationCondition");

  // Dynamic real-time Confluence meter
  const pointsFilled = [
    matrix.trend,
    matrix.structure,
    matrix.location,
    matrix.keyLevel,
    matrix.roundNumber,
    matrix.liquidity,
    matrix.fvgOb,
    matrix.momentum,
    matrix.reaction,
    matrix.invalidationCondition,
  ].filter((s) => s && s.trim().length > 0).length;

  const confluenceScore = pointsFilled * 10;
  const confluenceTier =
    confluenceScore >= 90
      ? "A+ BLUEPRINT"
      : confluenceScore >= 70
      ? "A-TIER INSTITUTIONAL"
      : confluenceScore >= 40
      ? "B-TIER SPECULATIVE"
      : "INSUFFICIENT CONFLUENCE";

  return (
    <form
      id="decision-matrix-form"
      onSubmit={handleSubmit}
      className="flex flex-col w-full bg-[#060911] rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md"
    >
      {/* Header with Live Confluence Meter */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 bg-[#000000] border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono text-xs shadow-inner">
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base sm:text-lg tracking-wide">
                {t("matrixTitle")}
              </h3>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {isBn ? "১০-পয়েন্ট অডিট" : "10-POINT AUDIT"}
              </span>
            </div>
            <p className="text-sm text-slate-300 font-medium">
              {t("matrixSubtitle")}
            </p>
          </div>
        </div>

        {/* Real-time Confluence Score Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm">
              <span className="text-slate-300">{isBn ? "কনফ্লুয়েন্স:" : "CONFLUENCE:"}</span>
              <span
                className={`font-extrabold ${
                  confluenceScore >= 80
                    ? "text-emerald-400"
                    : confluenceScore >= 50
                    ? "text-cyan-400"
                    : "text-amber-400"
                }`}
              >
                {confluenceScore}% ({pointsFilled}/10)
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              {isBn
                ? confluenceScore >= 90
                  ? "A+ ব্লুপ্রিন্ট"
                  : confluenceScore >= 70
                  ? "A-টায়ার প্রাতিষ্ঠানিক"
                  : confluenceScore >= 40
                  ? "B-টায়ার স্পেকুলেটিভ"
                  : "অপর্যাপ্ত কনফ্লুয়েন্স"
                : confluenceTier}
            </span>
          </div>

          {!isResolved && (
            <button
              type="button"
              id="quick-fill-btn"
              onClick={handleQuickFillInstitutionalBaseline}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-semibold bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 transition-all shadow-sm cursor-pointer glow-cyan shrink-0"
              title={
                isBn
                  ? "আদর্শ প্রাতিষ্ঠানিক রেফারেন্স নোট লোড করুন"
                  : "Load ideal institutional reference notes"
              }
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              <span>{t("autoFillBaseline")}</span>
            </button>
          )}

          <button
            type="button"
            id="toggle-matrix-expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 sm:p-2 text-slate-300 hover:text-white rounded-lg sm:rounded-xl bg-[#000000] border border-white/10 cursor-pointer hover:border-cyan-500/50 transition-colors shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar of Matrix Completion */}
      <div className="w-full bg-[#000000] h-1.5 border-b border-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${Math.max(5, confluenceScore)}%` }}
        />
      </div>

      {/* Main Execution Trigger Bar (Top Action Buttons) */}
      <div className="p-3 sm:p-4 bg-[#03060B] border-b border-white/10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3.5">
          {/* Expiry Selector */}
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-200 uppercase font-mono shrink-0">
              {t("expiryDuration")}:
            </span>
            <div className="flex items-center p-0.5 sm:p-1 bg-[#000000] rounded-lg sm:rounded-xl border border-white/10">
              <button
                type="button"
                id="select-expiry-1m-btn"
                disabled={isResolved}
                onClick={() => handleExpirySelect("1M")}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold font-mono rounded-md sm:rounded-lg transition-all cursor-pointer ${
                  matrix.expiry === "1M"
                    ? "bg-cyan-500 text-black font-extrabold shadow-md glow-cyan"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {t("oneMinute")} (60s)
              </button>
              <button
                type="button"
                id="select-expiry-2m-btn"
                disabled={isResolved}
                onClick={() => handleExpirySelect("2M")}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold font-mono rounded-md sm:rounded-lg transition-all cursor-pointer ${
                  matrix.expiry === "2M"
                    ? "bg-cyan-500 text-black font-extrabold shadow-md glow-cyan"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {t("twoMinutes")} (120s)
              </button>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full sm:max-w-md">
            <button
              type="button"
              id="action-call-btn"
              disabled={isResolved}
              onClick={() => handleActionSelect("CALL")}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-3.5 min-h-[44px] rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-base uppercase tracking-wide transition-all border cursor-pointer ${
                matrix.executionAction === "CALL"
                  ? "bg-emerald-500 text-black font-extrabold border-emerald-300 shadow-xl shadow-emerald-950/80 glow-emerald"
                  : "bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/60 border-emerald-500/40 hover:border-emerald-400"
              }`}
            >
              <ArrowUpCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">{t("actionCall")}</span>
            </button>

            <button
              type="button"
              id="action-put-btn"
              disabled={isResolved}
              onClick={() => handleActionSelect("PUT")}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-3.5 min-h-[44px] rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-base uppercase tracking-wide transition-all border cursor-pointer ${
                matrix.executionAction === "PUT"
                  ? "bg-rose-500 text-black font-extrabold border-rose-300 shadow-xl shadow-rose-950/80 glow-rose"
                  : "bg-rose-950/50 text-rose-300 hover:bg-rose-900/60 border-rose-500/40 hover:border-rose-400"
              }`}
            >
              <ArrowDownCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">{t("actionPut")}</span>
            </button>

            <button
              type="button"
              id="action-no-trade-btn"
              disabled={isResolved}
              onClick={() => handleActionSelect("NO TRADE")}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-3.5 min-h-[44px] rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-base uppercase tracking-wide transition-all border cursor-pointer ${
                matrix.executionAction === "NO TRADE"
                  ? "bg-amber-500 text-black font-extrabold border-amber-300 shadow-xl shadow-amber-950/80 glow-amber"
                  : "bg-amber-950/50 text-amber-300 hover:bg-amber-900/60 border-amber-500/40 hover:border-amber-400"
              }`}
            >
              <Lock className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">{t("actionNoTrade")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10-Point Checklist Fields */}
      {isExpanded && (
        <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Point 1: Trend */}
          <div className="border border-[#1F2937] p-3.5 rounded-xl bg-[#0A0A0B] focus-within:border-cyan-500 transition-colors space-y-1.5">
            <label className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-200">
              <span className="text-cyan-300 font-bold">{fTrend.title}</span>
              <span className="text-gray-400 font-mono text-xs sm:text-sm">15M / 1M</span>
            </label>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">{fTrend.subtitle}</p>
            <input
              type="text"
              id="input-point-1-trend"
              disabled={isResolved}
              value={matrix.trend}
              onChange={(e) =>
                setMatrix((prev) => ({ ...prev, trend: e.target.value }))
              }
              placeholder={fTrend.placeholder}
              className="w-full bg-transparent border-none text-sm sm:text-base pt-1 focus:ring-0 text-cyan-200 placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Point 2: Structure */}
          <div className="border border-[#1F2937] p-3.5 rounded-xl bg-[#0A0A0B] focus-within:border-cyan-500 transition-colors space-y-1.5">
            <label className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-200">
              <span className="text-cyan-300 font-bold">{fStructure.title}</span>
              <span className="text-gray-400 font-mono text-xs sm:text-sm">BOS/CHOCH</span>
            </label>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">{fStructure.subtitle}</p>
            <input
              type="text"
              id="input-point-2-structure"
              disabled={isResolved}
              value={matrix.structure}
              onChange={(e) =>
                setMatrix((prev) => ({ ...prev, structure: e.target.value }))
              }
              placeholder={fStructure.placeholder}
              className="w-full bg-transparent border-none text-sm sm:text-base pt-1 focus:ring-0 text-cyan-200 placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Point 3: Location */}
          <div className="border border-[#1F2937] p-3.5 rounded-xl bg-[#0A0A0B] focus-within:border-cyan-500 transition-colors space-y-1.5">
            <label className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-200">
              <span className="text-cyan-300 font-bold">{fLocation.title}</span>
              <span className="text-gray-400 font-mono text-xs sm:text-sm">Prem/Disc</span>
            </label>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">{fLocation.subtitle}</p>
            <input
              type="text"
              id="input-point-3-location"
              disabled={isResolved}
              value={matrix.location}
              onChange={(e) =>
                setMatrix((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder={fLocation.placeholder}
              className="w-full bg-transparent border-none text-sm sm:text-base pt-1 focus:ring-0 text-cyan-200 placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Point 4: Key Level */}
          <div className="border border-[#1F2937] p-3.5 rounded-xl bg-[#0A0A0B] focus-within:border-cyan-500 transition-colors space-y-1.5">
            <label className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-200">
              <span className="text-cyan-300 font-bold">{fKeyLevel.title}</span>
              <span className="text-gray-400 font-mono text-xs sm:text-sm">S/R Flip</span>
            </label>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">{fKeyLevel.subtitle}</p>
            <input
              type="text"
              id="input-point-4-keylevel"
              disabled={isResolved}
              value={matrix.keyLevel}
              onChange={(e) =>
                setMatrix((prev) => ({ ...prev, keyLevel: e.target.value }))
              }
              placeholder={fKeyLevel.placeholder}
              className="w-full bg-transparent border-none text-sm sm:text-base pt-1 focus:ring-0 text-cyan-200 placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Point 5: Round Number */}
          <div className="border border-[#1F2937] p-3.5 rounded-xl bg-[#0A0A0B] focus-within:border-cyan-500 transition-colors space-y-1.5">
            <label className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-200">
              <span className="text-cyan-300 font-bold">{fRoundNumber.title}</span>
              <span className="text-gray-400 font-mono text-xs sm:text-sm">.00 / .50</span>
            </label>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">{fRoundNumber.subtitle}</p>
            <input
              type="text"
              id="input-point-5-roundnumber"
              disabled={isResolved}
              value={matrix.roundNumber}
              onChange={(e) =>
                setMatrix((prev) => ({ ...prev, roundNumber: e.target.value }))
              }
              placeholder={fRoundNumber.placeholder}
              className="w-full bg-transparent border-none text-sm sm:text-base pt-1 focus:ring-0 text-cyan-200 placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Point 6: Liquidity */}
          <div className="border border-[#1F2937] p-3.5 rounded-xl bg-[#0A0A0B] focus-within:border-cyan-500 transition-colors space-y-1.5">
            <label className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-200">
              <span className="text-cyan-300 font-bold">{fLiquidity.title}</span>
              <span className="text-gray-400 font-mono text-xs sm:text-sm">BSL / SSL</span>
            </label>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">{fLiquidity.subtitle}</p>
            <input
              type="text"
              id="input-point-6-liquidity"
              disabled={isResolved}
              value={matrix.liquidity}
              onChange={(e) =>
                setMatrix((prev) => ({ ...prev, liquidity: e.target.value }))
              }
              placeholder={fLiquidity.placeholder}
              className="w-full bg-transparent border-none text-sm sm:text-base pt-1 focus:ring-0 text-cyan-200 placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Point 7: FVG / OB */}
          <div className="border border-[#1F2937] p-3.5 rounded-xl bg-[#0A0A0B] focus-within:border-cyan-500 transition-colors space-y-1.5">
            <label className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-200">
              <span className="text-cyan-300 font-bold">{fFvgOb.title}</span>
              <span className="text-gray-400 font-mono text-xs sm:text-sm">FVG / OB</span>
            </label>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">{fFvgOb.subtitle}</p>
            <input
              type="text"
              id="input-point-7-fvgob"
              disabled={isResolved}
              value={matrix.fvgOb}
              onChange={(e) =>
                setMatrix((prev) => ({ ...prev, fvgOb: e.target.value }))
              }
              placeholder={fFvgOb.placeholder}
              className="w-full bg-transparent border-none text-sm sm:text-base pt-1 focus:ring-0 text-cyan-200 placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Point 8: Momentum */}
          <div className="border border-[#1F2937] p-3.5 rounded-xl bg-[#0A0A0B] focus-within:border-cyan-500 transition-colors space-y-1.5">
            <label className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-200">
              <span className="text-cyan-300 font-bold">{fMomentum.title}</span>
              <span className="text-gray-400 font-mono text-xs sm:text-sm">Velocity</span>
            </label>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">{fMomentum.subtitle}</p>
            <input
              type="text"
              id="input-point-8-momentum"
              disabled={isResolved}
              value={matrix.momentum}
              onChange={(e) =>
                setMatrix((prev) => ({ ...prev, momentum: e.target.value }))
              }
              placeholder={fMomentum.placeholder}
              className="w-full bg-transparent border-none text-sm sm:text-base pt-1 focus:ring-0 text-cyan-200 placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Point 9: Reaction */}
          <div className="border border-[#1F2937] p-3.5 rounded-xl bg-[#0A0A0B] focus-within:border-cyan-500 transition-colors space-y-1.5">
            <label className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-200">
              <span className="text-cyan-300 font-bold">{fReaction.title}</span>
              <span className="text-gray-400 font-mono text-xs sm:text-sm">Wick %</span>
            </label>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">{fReaction.subtitle}</p>
            <input
              type="text"
              id="input-point-9-reaction"
              disabled={isResolved}
              value={matrix.reaction}
              onChange={(e) =>
                setMatrix((prev) => ({ ...prev, reaction: e.target.value }))
              }
              placeholder={fReaction.placeholder}
              className="w-full bg-transparent border-none text-sm sm:text-base pt-1 focus:ring-0 text-cyan-200 placeholder:text-gray-500 outline-none"
            />
          </div>

          {/* Point 10: Invalidation Condition */}
          <div className="border border-[#1F2937] p-3.5 rounded-xl bg-[#0A0A0B] focus-within:border-cyan-500 transition-colors space-y-1.5">
            <label className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-200">
              <span className="text-cyan-300 font-bold">{fInvalidation.title}</span>
              <span className="text-gray-400 font-mono text-xs sm:text-sm">SL Rule</span>
            </label>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">{fInvalidation.subtitle}</p>
            <input
              type="text"
              id="input-point-10-invalidation"
              disabled={isResolved}
              value={matrix.invalidationCondition}
              onChange={(e) =>
                setMatrix((prev) => ({
                  ...prev,
                  invalidationCondition: e.target.value,
                }))
              }
              placeholder={fInvalidation.placeholder}
              className="w-full bg-transparent border-none text-sm sm:text-base pt-1 focus:ring-0 text-cyan-200 placeholder:text-gray-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Footer Submit Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-4 bg-[#000000] border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-slate-200">
          <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{isBn ? "৮০%+ কনফ্লুয়েন্স স্কোর এ+ প্রাতিষ্ঠানিক এক্সিকিউশন নিশ্চিত করে।" : "80%+ confluence score unlocks high-probability A+ trade qualification."}</span>
        </div>

        {!isResolved ? (
          <button
            type="submit"
            id="submit-matrix-evaluation-btn"
            disabled={isSubmitting || !matrix.executionAction}
            className={`flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all border cursor-pointer ${
              !matrix.executionAction
                ? "bg-[#000000] text-slate-600 cursor-not-allowed border-white/10"
                : isSubmitting
                ? "bg-cyan-700 text-white animate-pulse border-cyan-500"
                : "bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold shadow-lg shadow-cyan-500/30 border-cyan-300 glow-cyan"
            }`}
          >
            {isSubmitting ? (
              <span>{t("evaluatingAudit")}</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>{t("submitToRiskOfficer")}</span>
              </>
            )}
          </button>
        ) : (
          <div className="text-sm sm:text-base font-mono font-bold text-emerald-400 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50">
            ✓ {isBn ? "অডিট সম্পন্ন" : "AUDIT RESOLVED"}
          </div>
        )}
      </div>
    </form>
  );
};
