import React, { useState, useEffect, useMemo } from "react";
import {
  DailyChallengeRecord,
  DailyChallengeState,
  EvaluationResult,
  Scenario,
  StreakBadge,
  TenPointMatrix,
} from "../types";
import { STREAK_BADGES } from "../data/dailyBadges";
import {
  getDailyScenarioForDate,
  getTodayDateString,
  isDailyChallengeCompletedToday,
  loadDailyChallengeState,
  recordDailyChallengeCompletion,
  getTodayRecord,
} from "../utils/dailyChallengeEngine";
import { evaluateSubmission } from "../utils/evaluationEngine";
import { CandlestickChart } from "./CandlestickChart";
import { useLanguage } from "../context/LanguageContext";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  Info,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Unlock,
  XCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";

interface DailyTradingChallengeProps {
  onSwitchToSimulation?: (scenarioId: string) => void;
}

export const DailyTradingChallenge: React.FC<DailyTradingChallengeProps> = ({
  onSwitchToSimulation,
}) => {
  const { language, t, isBn, getLocalizedScenario, getTierName, getActionName } = useLanguage();
  const todayStr = useMemo(() => getTodayDateString(), []);
  const rawTodayScenario = useMemo(() => getDailyScenarioForDate(todayStr), [todayStr]);
  const todayScenario = useMemo(
    () => getLocalizedScenario(rawTodayScenario),
    [rawTodayScenario, getLocalizedScenario]
  );

  const [state, setState] = useState<DailyChallengeState>(() => loadDailyChallengeState());
  const [isMatrixExpanded, setIsMatrixExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<StreakBadge[]>([]);
  const [activeBadgeModal, setActiveBadgeModal] = useState<StreakBadge | null>(null);

  // Time until midnight UTC reset
  const [timeToReset, setTimeToReset] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeToReset(
        `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(
          seconds
        ).padStart(2, "0")}s`
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const isCompletedToday = isDailyChallengeCompletedToday(state);
  const todayRecord = getTodayRecord(state);

  // Submission Form State
  const [form, setForm] = useState<TenPointMatrix>({
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

  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isResolved, setIsResolved] = useState<boolean>(isCompletedToday);

  // If completed today previously, restore record state
  useEffect(() => {
    if (isCompletedToday && todayRecord && !evaluation) {
      setIsResolved(true);
      // Construct a minimal display evaluation from history record
      setEvaluation({
        grade: todayRecord.grade,
        verdict:
          todayRecord.grade >= 80
            ? "INSTITUTIONAL_APPROVAL"
            : todayRecord.grade >= 60
            ? "MARGINAL_EDGE"
            : "DISQUALIFIED",
        confluenceTier: todayRecord.tier,
        summary: isBn
          ? `আজকের ডেইলি ড্রিল সম্পন্ন হয়েছে। চূড়ান্ত স্কোর: ${todayRecord.grade.toLocaleString("bn-BD")}/১০০ (${getTierName(todayRecord.tier)})`
          : `Daily challenge completed for today. Score: ${todayRecord.grade}/100 (${todayRecord.tier})`,
        rubricBreakdown: {
          trend: { score: 10, max: 10, feedback: "Aligned with HTF structure." },
          structure: { score: 10, max: 10, feedback: "Valid structural context." },
          location: { score: 10, max: 10, feedback: "Key location identified." },
          keyLevel: { score: 10, max: 10, feedback: "Confluence with SnR line." },
          roundNumber: { score: 10, max: 10, feedback: "Psychological number respected." },
          liquidity: { score: 10, max: 10, feedback: "Liquidity pool sweep monitored." },
          fvgOb: { score: 10, max: 10, feedback: "Fair value imbalance evaluated." },
          momentum: { score: 10, max: 10, feedback: "Candle velocity measured." },
          reaction: { score: 10, max: 10, feedback: "Wick rejection behavior confirmed." },
          execution: { score: 10, max: 10, feedback: "Accurate trigger timing." },
        },
        blindSpots: [],
        institutionalTakeaway:
          todayScenario.resolution_next_candle.outcome_explanation,
        isWon: todayRecord.isWon,
        userAction: todayRecord.userAction,
        expectedAction: todayRecord.expectedAction,
        payoutEv: todayRecord.isWon ? 85 : -100,
      });
    }
  }, [isCompletedToday, todayRecord, isBn, todayScenario, evaluation]);

  const handleAutoFill = () => {
    const ideal = todayScenario.ideal_10_point_analysis;
    setForm({
      trend: ideal.trend,
      structure: ideal.structure,
      location: ideal.location,
      keyLevel: ideal.keyLevel,
      roundNumber: ideal.roundNumber,
      liquidity: ideal.liquidity,
      fvgOb: ideal.fvgOb,
      momentum: ideal.momentum,
      reaction: ideal.reaction,
      executionAction: todayScenario.expected_action,
      expiry: todayScenario.expected_expiry,
      invalidationCondition: "Opposite side candle break.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.executionAction) return;

    setIsSubmitting(true);
    try {
      const result = await evaluateSubmission(todayScenario, form);
      setEvaluation(result);
      setIsResolved(true);

      const isWon = result.userAction === todayScenario.expected_action;

      const record: DailyChallengeRecord = {
        date: todayStr,
        scenarioId: todayScenario.scenario_id,
        topic: todayScenario.topic,
        asset: todayScenario.market_context.asset,
        userAction: result.userAction,
        expectedAction: todayScenario.expected_action,
        grade: result.grade,
        tier: result.confluenceTier,
        isWon,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const { updatedState, newlyUnlocked } = recordDailyChallengeCompletion(state, record);
      setState(updatedState);
      if (newlyUnlocked.length > 0) {
        setNewlyUnlockedBadges(newlyUnlocked);
      }
    } catch (err) {
      console.error("Daily challenge submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper icon renderer for badges
  const renderBadgeIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case "Flame":
        return <Flame className={className} />;
      case "Award":
        return <Award className={className} />;
      case "ShieldCheck":
        return <ShieldCheck className={className} />;
      case "Crown":
        return <Crown className={className} />;
      case "Trophy":
        return <Trophy className={className} />;
      case "Target":
        return <Target className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "TrendingUp":
        return <TrendingUp className={className} />;
      case "Sparkles":
      default:
        return <Sparkles className={className} />;
    }
  };

  const getRarityBadgeStyle = (rarity: StreakBadge["rarity"]) => {
    switch (rarity) {
      case "Legendary":
        return "border-amber-500/80 bg-amber-950/40 text-amber-300 shadow-amber-900/30";
      case "Epic":
        return "border-purple-500/80 bg-purple-950/40 text-purple-300 shadow-purple-900/30";
      case "Rare":
        return "border-cyan-500/80 bg-cyan-950/40 text-cyan-300 shadow-cyan-900/30";
      case "Common":
      default:
        return "border-emerald-500/80 bg-emerald-950/40 text-emerald-300 shadow-emerald-900/30";
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Notification for newly unlocked badges */}
      {newlyUnlockedBadges.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-yellow-950/90 border-2 border-amber-400 p-4 rounded-xl shadow-2xl animate-bounce flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-black">
                  {isBn ? "নতুন ব্যাজ আনলকড!" : "NEW BADGE UNLOCKED!"}
                </span>
                <span className="text-xs font-mono text-amber-200">
                  {newlyUnlockedBadges.map((b) => (isBn ? b.titleBn : b.titleEn)).join(", ")}
                </span>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">
                {isBn
                  ? "অভিনন্দন! আপনার ধারাবাহিকতা এবং পারফরম্যান্সের জন্য নতুন ট্রেডিং ব্যাজ পুরস্কৃত করা হয়েছে।"
                  : "Congratulations! You have been rewarded with new streak achievement badges."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNewlyUnlockedBadges([])}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all cursor-pointer"
          >
            {isBn ? "ঠিক আছে" : "Dismiss"}
          </button>
        </div>
      )}

      {/* Hero Header & Streak Tracker Banner */}
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-6 relative z-10">
          {/* Main Title & Description */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-orange-950/80 text-orange-400 border border-orange-800/60 font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-inner shrink-0">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
                {isBn ? "দৈনিক ট্রেডিং চ্যালেঞ্জ" : "DAILY CHALLENGE"}
              </span>

              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 shrink-0">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                {todayStr}
              </span>

              {isCompletedToday ? (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  {isBn ? "সম্পন্ন" : "COMPLETED"}
                </span>
              ) : (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-amber-950/80 text-amber-300 border border-amber-700/60 font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 animate-pulse shrink-0">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  {isBn ? "ড্রিল প্রস্তুত!" : "DRILL READY"}
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-2xl font-black text-gray-100 tracking-tight leading-tight">
              {isBn ? "প্রতিদিন একটি নিখুঁত গ্রেডেড প্র্যাকটিস ড্রিল" : "One Random Graded Drill Every Single Day"}
            </h2>
            <p className="text-[11px] sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
              {isBn
                ? "ধারাবাহিক অনুশীলনই একজন প্রাতিষ্ঠানিক প্রফিটেবল ট্রেডার তৈরি করে। প্রতিদিনের একটি র্যান্ডম গ্রেডেড দৃশ্যকল্প সমাধান করে আপনার স্ট্রিক বজায় রাখুন এবং এক্সক্লুসিভ স্ট্রিক ব্যাজ আনলক করুন।"
                : "Consistent practice creates institutional edge. Complete today's randomized graded simulation scenario to advance your practice streak and unlock prestigious performance badges."}
            </p>
          </div>

          {/* Dynamic Streak Metrics Card (3-Column Grid on Mobile, Never Stacks into 3 Giant Rows!) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full lg:w-auto bg-[#07090E]/90 p-2 sm:p-3.5 rounded-xl border border-[#1F2937] shadow-inner font-mono">
            {/* Active Streak */}
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 p-1.5 sm:px-3 sm:py-2 bg-[#0F172A] rounded-lg border border-orange-500/30">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-md shadow-orange-950/50 shrink-0">
                <Flame className="w-3.5 h-3.5 sm:w-6 sm:h-6 fill-orange-400 animate-bounce" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-sans font-semibold truncate leading-tight">
                  {isBn ? "বর্তমান" : "ACTIVE"}
                </div>
                <div className="text-sm sm:text-xl font-black text-orange-400 flex items-center justify-center sm:justify-start gap-0.5 sm:gap-1 leading-tight">
                  <span>{state.currentStreak}</span>
                  <span className="text-[9px] sm:text-xs font-normal text-gray-400">
                    {isBn ? "দিন" : "d"}
                  </span>
                </div>
              </div>
            </div>

            {/* Best Streak */}
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 p-1.5 sm:px-3 sm:py-2 bg-[#0F172A] rounded-lg border border-cyan-500/30">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Trophy className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-sans font-semibold truncate leading-tight">
                  {isBn ? "সেরা" : "BEST"}
                </div>
                <div className="text-sm sm:text-xl font-black text-cyan-300 flex items-center justify-center sm:justify-start gap-0.5 sm:gap-1 leading-tight">
                  <span>{state.bestStreak}</span>
                  <span className="text-[9px] sm:text-xs font-normal text-gray-400">
                    {isBn ? "দিন" : "d"}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Completed */}
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 p-1.5 sm:px-3 sm:py-2 bg-[#0F172A] rounded-lg border border-emerald-500/30">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-sans font-semibold truncate leading-tight">
                  {isBn ? "সমাপ্ত" : "DONE"}
                </div>
                <div className="text-sm sm:text-xl font-black text-emerald-400 leading-tight">
                  {state.totalCompleted}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Countdown Bar */}
        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#1E293B] flex items-center justify-between gap-2 text-[10px] sm:text-xs font-mono text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{isBn ? "পরবর্তী রিসেট:" : "Next Reset:"}</span>
            <span className="text-cyan-300 font-bold bg-[#07090E] px-1.5 sm:px-2 py-0.5 rounded border border-cyan-900/50">
              {timeToReset}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-[11px]">
            <span className="text-gray-500">
              {isBn ? "ব্যাজ:" : "Badges:"}
            </span>
            <span className="text-amber-400 font-bold">
              {state.unlockedBadgeIds.length} / {STREAK_BADGES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left = Daily Drill & Chart, Right = Streak Badges & History */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Cols: Today's Graded Scenario Drill */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            {/* Scenario Header Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                    {todayScenario.scenario_id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50 font-mono">
                    {todayScenario.difficulty || "Advanced"}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {todayScenario.market_context.asset}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {todayScenario.topic}
                </h3>
              </div>

              {/* Confluence Pill Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-700 text-gray-200">
                  HTF: <strong className="text-cyan-400">{todayScenario.market_context.trend}</strong>
                </span>
                {todayScenario.market_context.round_numbers && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 flex items-center gap-1.5 font-bold">
                    <span>RN:</span>
                    <span className="text-white font-mono">◀ {todayScenario.market_context.round_numbers[0]}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Prompt Question Box */}
            <div className="bg-[#07090E] border-l-4 border-cyan-500 p-4 rounded-r-xl shadow-md">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                <Info className="w-4 h-4" />
                <span>{isBn ? "দৈনিক ড্রিল প্রম্পট" : "DAILY DRILL PROMPT"}</span>
              </div>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed font-sans font-medium">
                {todayScenario.prompt_question}
              </p>
            </div>

            {/* Interactive Candlestick Chart */}
            <div className="bg-[#07090E] rounded-xl border border-[#1F2937] p-2 overflow-hidden shadow-inner">
              <CandlestickChart
                scenario={todayScenario}
                isResolved={isResolved}
                userAction={form.executionAction || undefined}
              />
            </div>

            {/* Decision & Evaluation Section */}
            {!evaluation ? (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {/* 10-Point Analysis Matrix (Collapsible) */}
                <div className="bg-[#07090E] border border-[#1F2937] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsMatrixExpanded(!isMatrixExpanded)}
                    className="w-full flex items-center justify-between p-3.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-[#0D131F] hover:bg-[#111827] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span>
                        {isBn
                          ? "১০-পয়েন্ট ডিসিশন ম্যাট্রিক্স (ঐচ্ছিক বিস্তারিত অ্যানালাইসিস)"
                          : "10-Point Decision Matrix (Optional In-Depth Analysis)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAutoFill();
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-mono font-bold transition-colors"
                      >
                        {isBn ? "অটো-ফিল বেসলাইন" : "AUTO-FILL"}
                      </button>
                      {isMatrixExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {isMatrixExpanded && (
                    <div className="p-4 space-y-3 border-t border-[#1F2937] text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-400 font-mono mb-1">
                            1. Macro/Micro Trend
                          </label>
                          <input
                            type="text"
                            value={form.trend}
                            onChange={(e) => setForm({ ...form, trend: e.target.value })}
                            placeholder="e.g. Downtrend continuation"
                            className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-200 focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 font-mono mb-1">
                            2. Structural BOS / CHoCH
                          </label>
                          <input
                            type="text"
                            value={form.structure}
                            onChange={(e) => setForm({ ...form, structure: e.target.value })}
                            placeholder="e.g. Bearish BOS created below key level"
                            className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-200 focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 font-mono mb-1">
                            3. Location / Premium-Discount
                          </label>
                          <input
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            placeholder="e.g. Premium zone retest"
                            className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-200 focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 font-mono mb-1">
                            4. Key SnR / Level Flip
                          </label>
                          <input
                            type="text"
                            value={form.keyLevel}
                            onChange={(e) => setForm({ ...form, keyLevel: e.target.value })}
                            placeholder="e.g. Horizontal support turned resistance"
                            className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-200 focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 font-mono mb-1">
                            5. Round Number Magnetism
                          </label>
                          <input
                            type="text"
                            value={form.roundNumber}
                            onChange={(e) => setForm({ ...form, roundNumber: e.target.value })}
                            placeholder="e.g. Rejection from .50 round number"
                            className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-200 focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 font-mono mb-1">
                            6. Liquidity Sweep
                          </label>
                          <input
                            type="text"
                            value={form.liquidity}
                            onChange={(e) => setForm({ ...form, liquidity: e.target.value })}
                            placeholder="e.g. Buy-side liquidity cleared"
                            className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-gray-200 focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Big Action Selector Buttons */}
                <div className="space-y-2.5">
                  <div className="text-sm font-mono text-gray-300 uppercase font-bold flex items-center justify-between">
                    <span>
                      {isBn
                        ? "পরবর্তী ক্যান্ডেলের এক্সিকিউশন সিদ্ধান্ত নির্বাচন করুন:"
                        : "Select Next Candle Execution Action:"}
                    </span>
                    <span className="text-cyan-400 font-bold">
                      {isBn ? "মেয়াদ: ১ মিনিট (1M)" : "Expiry: 1M Contract"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                    <button
                      type="button"
                      id="daily-btn-call"
                      onClick={() => setForm({ ...form, executionAction: "CALL" })}
                      className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-lg sm:rounded-xl border transition-all cursor-pointer ${
                        form.executionAction === "CALL"
                          ? "bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-950/60 scale-[1.02]"
                          : "bg-[#07090E] border-gray-800 text-gray-300 hover:border-emerald-500/50 hover:text-emerald-200"
                      }`}
                    >
                      <div className="flex items-center gap-1 sm:gap-2 font-bold text-xs sm:text-lg text-emerald-400">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span>CALL</span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-300 mt-1 font-sans font-medium text-center line-clamp-1 sm:line-clamp-none">
                        {isBn ? "সবুজ ক্যান্ডেল" : "Bullish (Higher)"}
                      </span>
                    </button>

                    <button
                      type="button"
                      id="daily-btn-put"
                      onClick={() => setForm({ ...form, executionAction: "PUT" })}
                      className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-lg sm:rounded-xl border transition-all cursor-pointer ${
                        form.executionAction === "PUT"
                          ? "bg-rose-950/90 border-rose-400 text-rose-200 shadow-lg shadow-rose-950/60 scale-[1.02]"
                          : "bg-[#07090E] border-gray-800 text-gray-300 hover:border-rose-500/50 hover:text-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-1 sm:gap-2 font-bold text-xs sm:text-lg text-rose-400">
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span>PUT</span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-300 mt-1 font-sans font-medium text-center line-clamp-1 sm:line-clamp-none">
                        {isBn ? "লাল ক্যান্ডেল" : "Bearish (Lower)"}
                      </span>
                    </button>

                    <button
                      type="button"
                      id="daily-btn-no-trade"
                      onClick={() => setForm({ ...form, executionAction: "NO TRADE" })}
                      className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-lg sm:rounded-xl border transition-all cursor-pointer ${
                        form.executionAction === "NO TRADE"
                          ? "bg-amber-950/90 border-amber-400 text-amber-200 shadow-lg shadow-amber-950/60 scale-[1.02]"
                          : "bg-[#07090E] border-gray-800 text-gray-300 hover:border-amber-500/50 hover:text-amber-200"
                      }`}
                    >
                      <div className="flex items-center gap-1 sm:gap-2 font-bold text-xs sm:text-lg text-amber-400">
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span>NO TRADE</span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-300 mt-1 font-sans font-medium text-center line-clamp-1 sm:line-clamp-none">
                        {isBn ? "এভয়েড / নো এজ" : "Low Edge"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="submit-daily-challenge-btn"
                  disabled={!form.executionAction || isSubmitting}
                  className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold font-mono text-xs sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 sm:gap-2.5 shadow-xl transition-all ${
                    form.executionAction && !isSubmitting
                      ? "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-white shadow-orange-950/50 cursor-pointer scale-[1.01]"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>{isBn ? "অডিট মূল্যায়ন চলছে..." : "EVALUATING..."}</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-yellow-300 shrink-0" />
                      <span className="truncate">
                        {isBn
                          ? "চ্যালেঞ্জ সাবমিট করুন ও স্ট্রিক বাড়ান"
                          : "SUBMIT CHALLENGE & ADVANCE STREAK"}
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Resolution & Graded Audit Result Box */
              <div className="space-y-4 pt-2">
                <div
                  className={`p-4 sm:p-5 rounded-xl border-2 shadow-2xl space-y-4 ${
                    evaluation.isWon
                      ? "bg-gradient-to-br from-emerald-950/80 via-[#0B0F17] to-[#07090E] border-emerald-500/80 shadow-emerald-950/40"
                      : "bg-gradient-to-br from-rose-950/80 via-[#0B0F17] to-[#07090E] border-rose-500/80 shadow-rose-950/40"
                  }`}
                >
                  {/* Top Result Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-gray-800">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black shrink-0 ${
                          evaluation.isWon
                            ? "bg-emerald-500 text-black shadow-lg shadow-emerald-950"
                            : "bg-rose-500 text-white shadow-lg shadow-rose-950"
                        }`}
                      >
                        {evaluation.grade}%
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`px-2.5 py-1 rounded text-xs sm:text-sm font-bold font-mono ${
                              evaluation.confluenceTier === "A_PLUS"
                                ? "bg-amber-400 text-black font-extrabold"
                                : evaluation.confluenceTier === "A_TIER"
                                ? "bg-emerald-400 text-black font-extrabold"
                                : "bg-gray-700 text-white"
                            }`}
                          >
                            {getTierName(evaluation.confluenceTier)}
                          </span>
                          <span
                            className={`text-base sm:text-lg font-bold ${
                              evaluation.isWon ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {evaluation.isWon
                              ? isBn
                                ? "✓ লাভজনক ট্রেড (ITM প্রফিট +৮৫%)"
                                : "✓ IN-THE-MONEY WIN (+85% PAYOUT)"
                              : isBn
                              ? "✗ ভুল এন্ট্রি (OTM লস)"
                              : "✗ OUT-OF-THE-MONEY LOSS"}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-200 mt-1 font-mono">
                          {isBn ? "আপনার সিদ্ধান্ত:" : "Your Action:"}{" "}
                          <strong className="text-white text-base font-bold">{getActionName(evaluation.userAction)}</strong> |{" "}
                          {isBn ? "প্রত্যাশিত:" : "Expected:"}{" "}
                          <strong className="text-cyan-400 text-base font-bold">{getActionName(evaluation.expectedAction)}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Active Streak Count Up Alert */}
                    <div className="flex items-center gap-2.5 bg-[#07090E] px-3.5 py-2 rounded-xl border border-orange-500/40 shadow-md">
                      <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-bounce" />
                      <div className="text-sm font-mono">
                        <span className="text-gray-300 font-sans">
                          {isBn ? "স্ট্রিক চালু আছে:" : "Streak Secured:"}
                        </span>{" "}
                        <strong className="text-orange-400 text-base">
                          {isBn ? `${state.currentStreak.toLocaleString("bn-BD")} দিন` : `${state.currentStreak} Days`}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Algorithmic Next-Candle Outcome Explanation */}
                  <div className="bg-[#07090E] p-4 sm:p-5 rounded-xl border border-cyan-900/60 shadow-lg space-y-2">
                    <div className="text-sm sm:text-base font-mono text-cyan-300 font-bold uppercase flex items-center gap-2 tracking-wide">
                      <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{isBn ? "অ্যালগরিদমিক ফলাফল ও সমাধান" : "Algorithmic Order Flow Resolution"}</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-100 leading-relaxed font-sans font-medium">
                      {todayScenario.resolution_next_candle.outcome_explanation}
                    </p>
                  </div>

                  {/* Summary Note & Reset Countdown */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-mono text-gray-300 pt-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{isBn ? "আজকের ড্রিল সফলভাবে সম্পন্ন ও সেভ হয়েছে।" : "Today's drill score is recorded."}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSwitchToSimulation) {
                          onSwitchToSimulation(todayScenario.scenario_id);
                        }
                      }}
                      className="text-sm text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer transition-colors"
                    >
                      {isBn ? "চার্ট সিমুলেটরে আবার অ্যানালাইজ করুন →" : "Re-analyze in Full Simulator →"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Streak Badges Cabinet & History Archive */}
        <div className="xl:col-span-4 space-y-6">
          {/* Badges Cabinet */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold text-gray-100">
                  {isBn ? "স্ট্রিক ব্যাজ ও ট্রফি ক্যাবিনেট" : "Streak Badges & Trophies"}
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                {state.unlockedBadgeIds.length} / {STREAK_BADGES.length}
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              {isBn
                ? "ধারাবাহিক প্র্যাকটিস বজায় রেখে এবং উচ্চ গ্রেড অর্জন করে এক্সক্লুসিভ স্ট্রিক ট্রফি আনলক করুন।"
                : "Earn exclusive milestone trophies by maintaining uninterrupted streaks and achieving high institutional grades."}
            </p>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {STREAK_BADGES.map((badge) => {
                const isUnlocked = state.unlockedBadgeIds.includes(badge.id);
                const rarityStyle = getRarityBadgeStyle(badge.rarity);

                // Calculate progress
                let progressText = "";
                let progressPercent = 0;
                if (badge.category === "streak") {
                  progressPercent = Math.min(100, (state.currentStreak / badge.requirement) * 100);
                  progressText = `${Math.min(state.currentStreak, badge.requirement)} / ${badge.requirement} Days`;
                } else if (badge.category === "grade") {
                  const bestGrade = state.history.reduce((max, h) => Math.max(max, h.grade), 0);
                  progressPercent = Math.min(100, (bestGrade / badge.requirement) * 100);
                  progressText = `${bestGrade}% / ${badge.requirement}%`;
                } else if (badge.category === "win") {
                  let winStreak = 0;
                  for (const item of state.history) {
                    if (item.isWon) winStreak++;
                    else break;
                  }
                  progressPercent = Math.min(100, (winStreak / badge.requirement) * 100);
                  progressText = `${winStreak} / ${badge.requirement} Wins`;
                }

                return (
                  <div
                    key={badge.id}
                    onClick={() => setActiveBadgeModal(badge)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                      isUnlocked
                        ? `${rarityStyle} shadow-lg scale-[1.01]`
                        : "bg-[#07090E]/80 border-gray-800/80 text-gray-500 hover:border-gray-700"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isUnlocked
                          ? "bg-black/30 border border-current"
                          : "bg-gray-900 border border-gray-800 text-gray-600"
                      }`}
                    >
                      {renderBadgeIcon(badge.icon, "w-5 h-5")}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs font-bold truncate ${
                            isUnlocked ? "text-gray-100" : "text-gray-400"
                          }`}
                        >
                          {isBn ? badge.titleBn : badge.titleEn}
                        </h4>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            isUnlocked
                              ? "bg-black/40 text-current border border-current/30"
                              : "bg-gray-900 text-gray-600 border border-gray-800"
                          }`}
                        >
                          {badge.rarity}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        {isBn ? badge.descBn : badge.descEn}
                      </p>

                      {/* Progress Bar for Locked Badges */}
                      {!isUnlocked && (
                        <div className="space-y-0.5 pt-1">
                          <div className="flex items-center justify-between text-[9px] font-mono text-gray-500">
                            <span>{isBn ? "অগ্রগতি" : "Progress"}</span>
                            <span>{progressText}</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-600 rounded-full transition-all"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Challenge Archive Log */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs sm:text-sm font-bold text-gray-100">
                  {isBn ? "দৈনিক চ্যালেঞ্জ হিস্ট্রি" : "Daily Challenge History"}
                </h3>
              </div>
              <span className="text-xs font-mono text-gray-400">
                {state.history.length} {isBn ? "ড্রিল" : "Drills"}
              </span>
            </div>

            {state.history.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500 font-mono">
                {isBn
                  ? "এখনো কোনো দৈনিক চ্যালেঞ্জ সম্পন্ন হয়নি। আজই শুরু করুন!"
                  : "No daily challenges completed yet. Take today's drill to start!"}
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar md:custom-scrollbar md:pr-1">
                {state.history.slice(0, 10).map((item, idx) => (
                  <div
                    key={`${item.date}-${idx}`}
                    className="p-2.5 rounded-lg bg-[#07090E] border border-gray-800/80 flex items-center justify-between gap-2 text-xs font-mono"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-400 font-bold">{item.date}</span>
                        <span className="text-gray-500 text-[10px]">({item.asset})</span>
                      </div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[160px]">
                        {item.topic}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <span
                          className={`font-bold ${
                            item.isWon ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {item.grade}%
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            item.isWon
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : "bg-rose-950 text-rose-300 border border-rose-800"
                          }`}
                        >
                          {item.tier}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500">{item.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      {activeBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0F17] border-2 border-cyan-500/80 max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div
                className={`p-3.5 rounded-2xl border ${
                  state.unlockedBadgeIds.includes(activeBadgeModal.id)
                    ? getRarityBadgeStyle(activeBadgeModal.rarity)
                    : "bg-gray-900 border-gray-800 text-gray-600"
                }`}
              >
                {renderBadgeIcon(activeBadgeModal.icon, "w-10 h-10")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {activeBadgeModal.rarity}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-gray-900 text-gray-400">
                    {activeBadgeModal.category}
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-100 mt-1">
                  {isBn ? activeBadgeModal.titleBn : activeBadgeModal.titleEn}
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              {isBn ? activeBadgeModal.descBn : activeBadgeModal.descEn}
            </p>

            <div className="bg-[#07090E] p-3 rounded-xl border border-gray-800 text-xs font-mono flex items-center justify-between">
              <span className="text-gray-400">{isBn ? "স্ট্যাটাস:" : "Status:"}</span>
              {state.unlockedBadgeIds.includes(activeBadgeModal.id) ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5" />
                  {isBn ? "আনলকড (অর্জিত)" : "UNLOCKED (EARNED)"}
                </span>
              ) : (
                <span className="text-gray-500 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  {isBn ? "লকড (লক্ষে পৌঁছান)" : "LOCKED"}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveBadgeModal(null)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {isBn ? "বন্ধ করুন" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
