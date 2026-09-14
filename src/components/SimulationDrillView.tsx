import React, { useState } from "react";
import { EvaluationResult, Scenario, TenPointMatrix, UserStats } from "../types";
import { BUILTIN_SCENARIOS } from "../data/scenarios";
import { CandlestickChart } from "./CandlestickChart";
import { DecisionMatrixForm } from "./DecisionMatrixForm";
import { RiskOfficerReport } from "./RiskOfficerReport";
import { evaluateSubmission } from "../utils/evaluationEngine";
import { useLanguage } from "../context/LanguageContext";
import {
  Activity,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  HelpCircle,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

interface SimulationDrillViewProps {
  stats: UserStats;
  onRecordTrade: (evaluation: EvaluationResult, scenario: Scenario) => void;
  initialScenarioId?: string;
  onSwitchToCurriculum: () => void;
  onSwitchToDailyChallenge?: () => void;
}

export const SimulationDrillView: React.FC<SimulationDrillViewProps> = ({
  stats,
  onRecordTrade,
  initialScenarioId,
  onSwitchToCurriculum,
  onSwitchToDailyChallenge,
}) => {
  const { t, isBn, getLocalizedScenario } = useLanguage();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(() => {
    if (initialScenarioId) {
      const idx = BUILTIN_SCENARIOS.findIndex(
        (s) => s.scenario_id === initialScenarioId
      );
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [rawActiveScenario, setRawActiveScenario] = useState<Scenario>(
    BUILTIN_SCENARIOS[currentScenarioIndex] || BUILTIN_SCENARIOS[0]
  );

  const activeScenario = getLocalizedScenario(rawActiveScenario);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [evaluationResult, setEvaluationResult] =
    useState<EvaluationResult | null>(null);
  const [isGeneratingAiScenario, setIsGeneratingAiScenario] = useState(false);

  // Handle Scenario Change
  const handleSelectScenario = (index: number) => {
    setCurrentScenarioIndex(index);
    setRawActiveScenario(BUILTIN_SCENARIOS[index]);
    setIsResolved(false);
    setEvaluationResult(null);
  };

  // Submit 10-Point Analysis to Risk Officer
  const handleEvaluateSubmit = async (submission: TenPointMatrix) => {
    setIsSubmitting(true);
    try {
      const result = await evaluateSubmission(activeScenario, submission);
      setEvaluationResult(result);
      setIsResolved(true);
      onRecordTrade(result, activeScenario);
    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Re-drill current scenario
  const handleRetry = () => {
    setIsResolved(false);
    setEvaluationResult(null);
  };

  // Move to next scenario
  const handleNextScenario = () => {
    const nextIdx = (currentScenarioIndex + 1) % BUILTIN_SCENARIOS.length;
    handleSelectScenario(nextIdx);
  };

  // Generate Custom AI Scenario from Gemini Backend
  const handleGenerateCustomAiScenario = async () => {
    setIsGeneratingAiScenario(true);
    try {
      const res = await fetch("/api/mentor/generate-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter: activeScenario.chapter,
          difficulty: "Institutional",
        }),
      });

      if (res.ok) {
        const customScenario: Scenario = await res.json();
        setRawActiveScenario(customScenario);
        setIsResolved(false);
        setEvaluationResult(null);
      } else {
        throw new Error("Server scenario generator error");
      }
    } catch (err) {
      handleNextScenario();
    } finally {
      setIsGeneratingAiScenario(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Simulation Controls & Scenario Selector Bar */}
      <div className="p-3 sm:p-4 bg-[#060911] rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 backdrop-blur-md">
        {/* Left: Scenario Quick Switcher & Subject Title */}
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-mono text-xs sm:text-sm shadow-md shrink-0 mt-0.5 sm:mt-0">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#000000] text-cyan-400 border border-cyan-500/30 shrink-0">
                {t("scenarioCount")} {currentScenarioIndex + 1} / {BUILTIN_SCENARIOS.length}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-mono font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 shrink-0">
                {isBn ? `অধ্যায় ${activeScenario.chapter < 10 ? `০${activeScenario.chapter}` : activeScenario.chapter}` : `CH ${activeScenario.chapter < 10 ? `0${activeScenario.chapter}` : activeScenario.chapter}`}
              </span>
              {activeScenario.difficulty && (
                <span className="text-[10px] sm:text-xs font-mono px-1.5 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 hidden sm:inline-block">
                  {activeScenario.difficulty}
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide leading-snug break-words">
              {activeScenario.topic}
            </h2>
          </div>
        </div>

        {/* Center/Right: Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-end gap-2 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* Previous / Next buttons */}
            <div className="flex items-center bg-[#000000] rounded-lg sm:rounded-xl border border-white/10 p-0.5 sm:p-1 shadow-inner">
              <button
                type="button"
                id="prev-scenario-btn"
                onClick={() =>
                  handleSelectScenario(
                    (currentScenarioIndex - 1 + BUILTIN_SCENARIOS.length) %
                      BUILTIN_SCENARIOS.length
                  )
                }
                className="p-1.5 sm:p-2 text-slate-300 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                title={isBn ? "পূর্ববর্তী ড্রিল সিনারিও" : "Previous Drill Scenario"}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] sm:text-xs font-mono text-slate-200 font-bold px-2.5 sm:px-3 whitespace-nowrap">
                {currentScenarioIndex + 1} / {BUILTIN_SCENARIOS.length}
              </span>
              <button
                type="button"
                id="next-scenario-btn"
                onClick={handleNextScenario}
                className="p-1.5 sm:p-2 text-slate-300 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                title={isBn ? "পরবর্তী ড্রিল সিনারিও" : "Next Drill Scenario"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Daily Challenge Shortcut */}
            {onSwitchToDailyChallenge && (
              <button
                type="button"
                id="switch-to-daily-challenge-btn"
                onClick={onSwitchToDailyChallenge}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 transition-all shadow-md cursor-pointer glow-amber min-h-[38px] whitespace-nowrap"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 animate-pulse shrink-0" />
                <span>{isBn ? "দৈনিক ড্রিল" : "Daily Drill"}</span>
              </button>
            )}
          </div>

          {/* AI Generator Button */}
          <button
            type="button"
            id="generate-ai-scenario-btn"
            disabled={isGeneratingAiScenario}
            onClick={handleGenerateCustomAiScenario}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 transition-all shadow-md cursor-pointer glow-cyan min-h-[38px] w-full sm:w-auto"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
            <span>
              {isGeneratingAiScenario
                ? t("generatingScenario")
                : t("generateAiScenario")}
            </span>
          </button>
        </div>
      </div>

      {/* Main Simulation Layout: Left is Candlestick Terminal, Right is Context & Decision Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Area (7 Cols): The Chart Terminal & Prompt Question */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* The Live Interactive Candlestick Chart */}
          <CandlestickChart
            scenario={activeScenario}
            isResolved={isResolved}
            userAction={evaluationResult?.userAction}
          />

          {/* Market Context Breakdown & Prompt Question Card */}
          <div className="p-3.5 sm:p-5 bg-[#060911] rounded-xl sm:rounded-2xl border border-white/10 space-y-3 sm:space-y-4 shadow-2xl backdrop-blur-md">
            {/* Prompt Question */}
            <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-[#000000] border-l-4 border-cyan-400 border-r border-t border-b border-white/10 shadow-inner">
              <span className="font-bold uppercase tracking-wider text-[11px] sm:text-xs font-mono text-cyan-400 block mb-1.5">
                {t("promptQuestion")}:
              </span>
              <p className="font-medium text-white text-sm sm:text-base leading-relaxed">
                {activeScenario.prompt_question}
              </p>
            </div>

            {/* Context Matrix Pills */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3.5 text-xs font-mono">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#000000] border border-white/10 min-w-0">
                <span className="text-slate-400 block text-[10px] sm:text-xs font-semibold uppercase mb-0.5 sm:mb-1 truncate">
                  {t("bias")}
                </span>
                <span className="font-bold text-white text-[11px] sm:text-sm truncate block">
                  {activeScenario.market_context.higherTimeframeBias || (isBn ? "বিয়ারিশ" : "Bearish")}
                </span>
              </div>

              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#000000] border border-white/10 min-w-0">
                <span className="text-slate-400 block text-[10px] sm:text-xs font-semibold uppercase mb-0.5 sm:mb-1 truncate">
                  {t("keyLevels")}
                </span>
                <span className="font-bold text-white text-[11px] sm:text-sm truncate block">
                  {activeScenario.market_context.key_levels?.join(", ") ||
                    "Dynamic S/R"}
                </span>
              </div>

              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-emerald-950/20 border border-emerald-500/30 min-w-0">
                <span className="text-emerald-400/80 block text-[10px] sm:text-xs font-semibold uppercase mb-0.5 sm:mb-1 truncate">
                  {t("roundNumbers")}
                </span>
                <span className="font-bold text-white text-[11px] sm:text-sm font-mono flex items-center gap-1 truncate">
                  <span className="text-emerald-400 text-[10px]">◀</span>
                  <span className="truncate text-white">{activeScenario.market_context.round_numbers?.join(" • ") || ".00/.50"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area (5 Cols): The 10-Point Decision Matrix or Risk Officer Report */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {!isResolved ? (
            <DecisionMatrixForm
              scenario={activeScenario}
              onSubmit={handleEvaluateSubmit}
              isSubmitting={isSubmitting}
              isResolved={isResolved}
            />
          ) : evaluationResult ? (
            <RiskOfficerReport
              evaluation={evaluationResult}
              scenario={activeScenario}
              onRetry={handleRetry}
              onNextScenario={handleNextScenario}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
