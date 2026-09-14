import React from "react";
import { EvaluationResult, Scenario } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { BN_SCENARIOS } from "../i18n/scenarios";
import {
  AlertTriangle,
  Award,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";

interface RiskOfficerReportProps {
  evaluation: EvaluationResult;
  scenario: Scenario;
  onNextScenario?: () => void;
  onRetry?: () => void;
}

export const RiskOfficerReport: React.FC<RiskOfficerReportProps> = ({
  evaluation,
  scenario,
  onNextScenario,
  onRetry,
}) => {
  const { t, isBn, getTierName, getActionName } = useLanguage();
  const isPass = evaluation.grade >= 75 && evaluation.isWon;

  const getLocalizedVerdict = (verdict: string) => {
    if (!isBn) return verdict;
    if (verdict.includes("A+") || verdict.includes("A_PLUS")) return "প্রাতিষ্ঠানিক অনুমোদন — এ+ নিখুঁত কনফ্লুয়েন্স";
    if (verdict.includes("HIGH PROBABILITY") || verdict.includes("APPROVED")) return "অনুমোদিত — উচ্চ সম্ভাবনাময় প্রাতিষ্ঠানিক ট্রেড";
    if (verdict.includes("MARGINAL")) return "সীমিত সেটআপ — কম ঝুঁকি নিয়ে সতর্কতা";
    if (verdict.includes("FOMO") || verdict.includes("REJECTION") || verdict.includes("DISQUALIFIED")) return "বাতিল — অতিরিক্ত ঝুঁকি ও নিয়মভঙ্গ (নো-ট্রেড)";
    return verdict;
  };

  const getLocalizedSummary = () => {
    if (!isBn) return evaluation.summary;
    const scoreStr = evaluation.grade.toLocaleString("bn-BD");
    if (evaluation.isWon) {
      return `রিস্ক অফিসার মূল্যায়ন: প্রাতিষ্ঠানিক অর্ডার ফ্লো ও অ্যালগরিদমিক নিয়মে নিখুঁত ট্রেড। মোট স্কোর: ${scoreStr}/১০০।`;
    }
    return `রিস্ক অফিসার মূল্যায়ন: প্রাতিষ্ঠানিক নিয়মাবলি লঙ্ঘন করে ভুল ডিরেকশনে ট্রেড নেওয়া হয়েছে। মোট স্কোর: ${scoreStr}/১০০।`;
  };

  const getLocalizedBlindSpot = (spot: string) => {
    if (!isBn) return spot;
    if (spot.includes("executed") && spot.includes("institutional market context")) {
      return `আপনি ${getActionName(evaluation.userAction)} নিয়েছেন, কিন্তু প্রাতিষ্ঠানিক অর্ডার ফ্লো অনুযায়ী সঠিক এন্ট্রি ছিল ${getActionName(evaluation.expectedAction)}।`;
    }
    if (spot.includes("round number") || spot.includes(".00 / .50")) {
      return "সাইকোলজিক্যাল .০০ বা .৫০ রাউন্ড নম্বরের কাছাকাছি রিজেকশন পরীক্ষা করা হয়নি।";
    }
    if (spot.includes("Liquidity sweep") || spot.includes("BSL or SSL")) {
      return "লিকুইডিটি সুইপ (BSL / SSL) হয়েছে কি না তা যাচাই করা এড়িয়ে যাওয়া হয়েছে।";
    }
    if (spot.includes("Running candle wick") || spot.includes("15-45")) {
      return "রানিং ক্যান্ডেলের উইক রিজেকশন (১৫-৪৫ সেকেন্ডের মধ্যে) নিশ্চিত করা হয়নি।";
    }
    if (spot.includes("Clean analysis across all 10")) {
      return "১০টি পয়েন্টেই খুব সুন্দর ও সুশৃঙ্খল বিশ্লেষণ করা হয়েছে। সবসময় ফিক্সড ১% রিস্ক মেনে চলুন।";
    }
    return spot;
  };

  const getLocalizedFeedback = (feedback: string) => {
    if (!isBn) return feedback;
    if (feedback.includes("Optimal direction") || feedback.includes("disciplined trigger")) {
      return "সঠিক ডিরেকশন ও সুশৃঙ্খল ট্রেড এন্ট্রি নেওয়া হয়েছে।";
    }
    if (feedback.includes("Flawed directional call")) {
      return `ভুল ডিরেকশন: আপনার সিদ্ধান্ত ছিল ${getActionName(evaluation.userAction)}, কিন্তু প্রাতিষ্ঠানিক নিয়ম চেয়েছিল ${getActionName(evaluation.expectedAction)}।`;
    }
    if (feedback.includes("Thorough analysis")) {
      return "উচ্চমানের ওটিসি অ্যালগরিদমিক বিশ্লেষণ সম্পন্ন হয়েছে।";
    }
    if (feedback.includes("Adequate identification")) {
      return "গুরুত্বপূর্ণ বিষয়গুলো চিহ্নিত করা হয়েছে।";
    }
    if (feedback.includes("Weak or missing")) {
      return "বিশ্লেষণ অসম্পূর্ণ অথবা দুর্বল যুক্তি দেওয়া হয়েছে।";
    }
    return feedback;
  };

  return (
    <div className="flex flex-col w-full bg-[#0A0A0B] rounded-xl border border-[#1F2937] shadow-xl overflow-hidden animate-in fade-in duration-200">
      {/* Top Banner */}
      <div
        className={`px-5 py-4 border-b border-[#1F2937] ${
          isPass ? "bg-emerald-950/40" : "bg-rose-950/40"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-2.5 rounded-lg ${
                isPass
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-700/80"
                  : "bg-rose-950/80 text-rose-400 border border-rose-700/80"
              }`}
            >
              {isPass ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-3 py-1 rounded text-xs sm:text-sm font-mono font-bold tracking-wider uppercase border ${
                    evaluation.confluenceTier === "A_PLUS"
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-600/80"
                      : evaluation.confluenceTier === "A_TIER"
                      ? "bg-cyan-950/80 text-cyan-300 border-cyan-600/80"
                      : evaluation.confluenceTier === "B_TIER"
                      ? "bg-amber-950/80 text-amber-300 border-amber-600/80"
                      : "bg-rose-950/80 text-rose-300 border-rose-600/80"
                  }`}
                >
                  {getTierName(evaluation.confluenceTier)}
                </span>
                <span className="text-xs sm:text-sm text-gray-300 font-mono">
                  {t("riskOfficerAudit")}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {getLocalizedVerdict(evaluation.verdict)}
              </h2>
              <p className="text-sm sm:text-base text-gray-200 mt-1 leading-relaxed">
                {getLocalizedSummary()}
              </p>
            </div>
          </div>

          {/* Grade Score Display */}
          <div className="flex items-center gap-3.5 bg-[#111827] px-4 py-2.5 rounded-lg border border-[#1F2937]">
            <div className="text-right">
              <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-300 font-mono font-semibold block">
                {t("confluenceScore")}
              </span>
              <span
                className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                  evaluation.grade >= 80
                    ? "text-emerald-400"
                    : evaluation.grade >= 60
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {evaluation.grade}%
              </span>
            </div>
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-lg font-mono border ${
                evaluation.grade >= 80
                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-500"
                  : evaluation.grade >= 60
                  ? "bg-amber-950/80 text-amber-400 border-amber-500"
                  : "bg-rose-950/80 text-rose-400 border-rose-500"
              }`}
            >
              {evaluation.grade >= 85
                ? "A+"
                : evaluation.grade >= 75
                ? "A"
                : evaluation.grade >= 60
                ? "B"
                : "F"}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: 10-Point Rubric Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-100 font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>{t("factorBreakdown")}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Object.entries(evaluation.rubricBreakdown || {}).map(
              ([key, factorVal]) => {
                const val = factorVal as { score: number; max: number; feedback: string };
                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937] flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm sm:text-base font-bold capitalize text-gray-100">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span
                        className={`text-sm sm:text-base font-mono font-bold ${
                          val.score >= 8
                            ? "text-emerald-400"
                            : val.score >= 6
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {val.score}/{val.max}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-[#0A0A0B] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          val.score >= 8
                            ? "bg-emerald-500"
                            : val.score >= 6
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${(val.score / val.max) * 100}%` }}
                      />
                    </div>

                    <p className="text-sm text-gray-200 leading-relaxed font-sans">
                      {getLocalizedFeedback(val.feedback)}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Right Column: Blind Spots & Institutional Takeaways */}
        <div className="space-y-4">
          {/* Blind Spots Callouts */}
          <div className="p-4 sm:p-5 rounded-xl bg-rose-950/20 border border-rose-800/60 space-y-2.5 shadow-md">
            <h4 className="text-sm sm:text-base font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2 font-mono">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{t("criticalBlindSpots")}</span>
            </h4>
            <ul className="space-y-2">
              {evaluation.blindSpots.map((spot, idx) => (
                <li
                  key={idx}
                  className="text-sm sm:text-base text-gray-100 leading-relaxed flex items-start gap-2.5 font-medium"
                >
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span>{getLocalizedBlindSpot(spot)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Resolution & Takeaway */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#111827] border border-cyan-900/60 space-y-2.5 shadow-md">
            <h4 className="text-sm sm:text-base font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>{t("algorithmicFlowResolution")}</span>
            </h4>
            <p className="text-sm sm:text-base text-gray-100 leading-relaxed font-medium">
              {isBn && scenario.scenario_id && BN_SCENARIOS[scenario.scenario_id]
                ? BN_SCENARIOS[scenario.scenario_id].resolution_outcome_explanation
                : evaluation.institutionalTakeaway}
            </p>
          </div>

          {/* Mathematical Expectancy (EV) Card */}
          <div className="p-4 rounded-xl bg-[#0A0A0B] border border-[#1F2937] text-sm sm:text-base font-mono space-y-2.5">
            <div className="flex justify-between text-gray-300">
              <span>{t("yourAction")}:</span>
              <span className="font-bold text-white">
                {getActionName(evaluation.userAction)}
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>{t("expectedAction")}:</span>
              <span className="font-bold text-emerald-400">
                {getActionName(evaluation.expectedAction)}
              </span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>{t("tradeEvOutput")}:</span>
              <span
                className={`font-bold ${
                  evaluation.isWon ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {evaluation.isWon
                  ? (isBn ? "+০.৮৫ এক্সপেক্টেড ভ্যালু (+EV)" : "+0.85 Positive EV")
                  : (isBn ? "-১.০০ ড্রডাউন (-EV)" : "-1.00 Loss Drawdown")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3.5 sm:px-5 sm:py-4 bg-[#0F172A] border-t border-[#1F2937]">
        <button
          type="button"
          id="retry-scenario-btn"
          onClick={onRetry}
          className="flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm sm:text-base font-semibold bg-[#0A0A0B] hover:bg-gray-800 text-gray-200 border border-[#1F2937] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t("reanalyzeScenario")}</span>
        </button>

        {onNextScenario && (
          <button
            type="button"
            id="next-drill-scenario-btn"
            onClick={onNextScenario}
            className="flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl text-sm sm:text-base font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/30 border border-cyan-400 transition-all cursor-pointer"
          >
            <span>{t("nextScenario")}</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
