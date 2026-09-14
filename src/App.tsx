import React, { useState, useEffect } from "react";
import { EvaluationResult, Scenario, UserStats } from "./types";
import { CurriculumView } from "./components/CurriculumView";
import { SimulationDrillView } from "./components/SimulationDrillView";
import { DailyTradingChallenge } from "./components/DailyTradingChallenge";
import { MathRiskView } from "./components/MathRiskView";
import { PlaybookView } from "./components/PlaybookView";
import { MentorChatDrawer } from "./components/MentorChatDrawer";
import { AppLogo } from "./components/AppLogo";
import { AllInOneSearchBar } from "./components/AllInOneSearchBar";
import { ThemeSettingsModal } from "./components/ThemeSettingsModal";
import {
  BlackTheme,
  BLACK_THEMES,
  getInitialBlackTheme,
  applyThemeToDocument,
} from "./theme/themes";
import { GlobalSearchItem } from "./data/allSearchData";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  Calculator,
  Crown,
  Flame,
  Globe,
  Layers,
  Maximize2,
  Minimize2,
  MessageSquare,
  Palette,
  Radio,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

function MainAppContent() {
  const { language, setLanguage, toggleLanguage, t, isBn } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    "curriculum" | "simulation" | "daily-challenge" | "math-risk" | "playbook"
  >("simulation");

  // Selected scenario ID for targeted drill from curriculum or playbook
  const [drillScenarioId, setDrillScenarioId] = useState<string | undefined>(
    undefined
  );

  // Selected chapter for curriculum targeted navigation
  const [selectedChapterId, setSelectedChapterId] = useState<number | undefined>(
    undefined
  );

  // Sub-tab and pattern ID for playbook navigation
  const [playbookSubTab, setPlaybookSubTab] = useState<
    "sureshots" | "strat" | "gaps" | "supply_demand" | "calculator" | "blueprints" | undefined
  >(undefined);
  const [playbookPatternId, setPlaybookPatternId] = useState<string | undefined>(
    undefined
  );

  // Persistent User Stats
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem("otc_mentor_stats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      completedChapters: [1],
      totalSimulations: 0,
      simulationsWon: 0,
      averageGrade: 0,
      simulatedBalance: 1000,
      tradeLog: [],
    };
  });

  // Mentor Chat Drawer state & external prompt
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mentorExternalPrompt, setMentorExternalPrompt] = useState<string | undefined>(
    undefined
  );

  // Full-width panoramic view state
  const [isFullWidth, setIsFullWidth] = useState<boolean>(() => {
    const saved = localStorage.getItem("otc_full_width_layout");
    return saved !== null ? saved === "true" : true;
  });

  const handleToggleFullWidth = () => {
    setIsFullWidth((prev) => {
      const next = !prev;
      localStorage.setItem("otc_full_width_layout", String(next));
      return next;
    });
  };

  // Persistent 10 Black Themes Engine
  const [activeTheme, setActiveTheme] = useState<BlackTheme>(() =>
    getInitialBlackTheme()
  );
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  useEffect(() => {
    applyThemeToDocument(activeTheme);
  }, [activeTheme]);

  // Save stats to localStorage on change
  useEffect(() => {
    localStorage.setItem("otc_mentor_stats", JSON.stringify(stats));
  }, [stats]);

  // Handler for trade completion in simulation mode
  const handleRecordTrade = (
    evaluation: EvaluationResult,
    scenario: Scenario
  ) => {
    setStats((prev) => {
      const newTotal = prev.totalSimulations + 1;
      const isWon = evaluation.isWon;
      const newWon = prev.simulationsWon + (isWon ? 1 : 0);
      const newAvg =
        (prev.averageGrade * prev.totalSimulations + evaluation.grade) /
        newTotal;

      // 1% fixed risk compounding math
      const riskAmount = prev.simulatedBalance * 0.01;
      const balanceChange = isWon ? riskAmount * 0.85 : -riskAmount;
      const newBalance = Math.max(10, prev.simulatedBalance + balanceChange);

      const logItem = {
        id: `LOG_${Date.now()}`,
        scenarioId: scenario.scenario_id,
        chapter: scenario.chapter,
        topic: scenario.topic,
        action: evaluation.userAction,
        isWon,
        grade: evaluation.grade,
        tier: evaluation.confluenceTier,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      return {
        ...prev,
        totalSimulations: newTotal,
        simulationsWon: newWon,
        averageGrade: Math.round(newAvg),
        simulatedBalance: Math.round(newBalance * 100) / 100,
        tradeLog: [logItem, ...prev.tradeLog].slice(0, 50),
      };
    });
  };

  const handleMarkChapterCompleted = (chapterId: number) => {
    setStats((prev) => {
      if (prev.completedChapters.includes(chapterId)) return prev;
      return {
        ...prev,
        completedChapters: [...prev.completedChapters, chapterId],
      };
    });
  };

  const handleLaunchScenarioFromCurriculum = (chapterId: number) => {
    if (chapterId === 10) setDrillScenarioId("OTC_CH10_001");
    else if (chapterId === 8) setDrillScenarioId("OTC_CH08_001");
    else if (chapterId === 9) setDrillScenarioId("OTC_CH09_001");
    else if (chapterId === 15) setDrillScenarioId("OTC_CH15_001");
    else if (chapterId === 11) setDrillScenarioId("OTC_CH11_001");
    else if (chapterId === 14) setDrillScenarioId("OTC_CH14_001");
    else if (chapterId === 22) setDrillScenarioId("OTC_CH22_001");
    else if (chapterId === 29 || chapterId === 30)
      setDrillScenarioId("OTC_CH29_001");
    else setDrillScenarioId("OTC_CH10_001");

    setActiveTab("simulation");
  };

  const handleLaunchBlueprintFromPlaybook = (scenarioId: string) => {
    setDrillScenarioId(scenarioId);
    setActiveTab("simulation");
  };

  const handleSearchNavigate = (item: GlobalSearchItem) => {
    const { target } = item;
    if (target.tab === "curriculum") {
      if (target.chapterId) {
        setSelectedChapterId(target.chapterId);
      }
      setActiveTab("curriculum");
    } else if (target.tab === "playbook") {
      if (target.subTab) {
        setPlaybookSubTab(target.subTab);
      }
      if (target.patternId) {
        setPlaybookPatternId(target.patternId);
      }
      setActiveTab("playbook");
    } else if (target.tab === "simulation") {
      if (target.scenarioId) {
        setDrillScenarioId(target.scenarioId);
      }
      setActiveTab("simulation");
    } else if (target.tab === "daily-challenge") {
      setActiveTab("daily-challenge");
    } else if (target.tab === "math-risk") {
      setActiveTab("math-risk");
    }
  };

  const handleAskMentorFromSearch = (prompt: string) => {
    setMentorExternalPrompt(prompt);
    setIsChatOpen(true);
  };

  const winRatePercent =
    stats.totalSimulations > 0
      ? ((stats.simulationsWon / stats.totalSimulations) * 100).toFixed(1)
      : "0.0";

  const currentStreak = localStorage.getItem("otc_daily_challenge_state")
    ? JSON.parse(localStorage.getItem("otc_daily_challenge_state") || "{}").currentStreak || 0
    : 0;

  const rankLabel =
    stats.completedChapters.length >= 20
      ? t("rankSeniorQuant")
      : stats.completedChapters.length >= 10
      ? t("rankLevel3Analyst")
      : t("rankProbationary");

  return (
    <div
      style={{
        backgroundColor: activeTheme.bgPrimary,
      }}
      className="min-h-screen text-[#E2E8F0] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-100 bg-dot-grid-subtle transition-colors duration-300"
    >
      {/* Top Main Navigation Header */}
      <header
        style={{
          backgroundColor: `${activeTheme.bgSurface}fa`,
          borderColor: activeTheme.borderColor,
        }}
        className="sticky top-0 z-30 backdrop-blur-md border-b px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xl transition-colors duration-300"
      >
        <div className={`mx-auto flex flex-col gap-2 transition-all duration-200 ${isFullWidth ? "w-full max-w-[1920px]" : "max-w-7xl"}`}>
          {/* Top Row: Brand Logo, Desktop Search Bar, and Unified Action Controls */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Logo & Title (Clean Logo-only on mobile, full branding on desktop) */}
            <div className="flex items-center gap-2.5 shrink-0">
              <AppLogo size="sm" className="sm:hidden" />
              <AppLogo size="md" className="hidden sm:flex" />

              <div className="hidden sm:block min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm lg:text-base font-black text-white tracking-wide leading-tight truncate font-sans uppercase">
                    <span>BINARY </span>
                    <span className="text-emerald-400">TRADING</span>
                  </h1>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    PRO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-0.5 bg-emerald-500 rounded-full" />
                  <p className="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase font-sans">
                    {isBn ? "লার্নিং একাডেমি" : "LEARNING"}
                  </p>
                  <span className="w-2 h-0.5 bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Center on Desktop: Search Bar */}
            <div className="hidden lg:block lg:flex-1 lg:max-w-md mx-3">
              <AllInOneSearchBar
                onNavigate={handleSearchNavigate}
                onAskMentor={handleAskMentorFromSearch}
              />
            </div>

            {/* Right: Actions (Desktop Stats, Language Switcher, AI Mentor Quick Button) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Desktop Only: Balance Pill */}
              <div className="hidden lg:flex items-center gap-2 bg-[#080C14] px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow-inner font-mono text-xs">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">{t("balance")}:</span>
                <span className="text-emerald-400 font-bold text-xs sm:text-sm">
                  ${stats.simulatedBalance.toFixed(2)}
                </span>
              </div>

              {/* Desktop Only: Streak Pill */}
              <button
                type="button"
                onClick={() => setActiveTab("daily-challenge")}
                className="hidden lg:flex items-center gap-1.5 bg-[#080C14] hover:bg-[#0E1626] px-3 py-1.5 rounded-xl border border-amber-500/30 transition-all cursor-pointer group shadow-inner font-mono text-xs"
                title={isBn ? "দৈনিক চ্যালেঞ্জ স্ট্রিক দেখুন" : "View Daily Challenge Streak"}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse group-hover:scale-110 transition-transform" />
                <span className="text-slate-400 text-[10px] uppercase font-semibold">{isBn ? "স্ট্রিক" : "STREAK"}:</span>
                <span className="text-amber-400 font-bold">{currentStreak}d</span>
              </button>

              {/* Language Switcher */}
              <div className="flex items-center bg-[#080C14] p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-white/10 shadow-inner">
                <Globe className="w-3.5 h-3.5 text-cyan-400 ml-1.5 mr-1 hidden sm:inline-block" />
                <button
                  type="button"
                  id="lang-btn-en"
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-cyan-500 text-black font-extrabold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  id="lang-btn-bn"
                  onClick={() => setLanguage("bn")}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                    language === "bn"
                      ? "bg-cyan-500 text-black font-extrabold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  বাং
                </button>
              </div>

              {/* Full Width Panoramic View Toggle Button */}
              <button
                type="button"
                id="toggle-full-width-btn"
                onClick={handleToggleFullWidth}
                className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#080C14] hover:bg-[#0E1626] text-slate-300 hover:text-white border border-white/10 transition-all font-mono text-xs cursor-pointer shadow-inner"
                title={
                  isFullWidth
                    ? isBn
                      ? "কমপ্যাক্ট লেআউটে পরিবর্তন করুন (Standard 1280px)"
                      : "Switch to Centered Standard View"
                    : isBn
                    ? "ফুল উইডথ প্যানোরামিক মোড চালু করুন (Full Width)"
                    : "Switch to Full-Width Panoramic View"
                }
              >
                {isFullWidth ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="hidden xl:inline text-[11px] font-semibold text-slate-300">
                      {isBn ? "কমপ্যাক্ট" : "Standard"}
                    </span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="hidden xl:inline text-[11px] font-semibold text-slate-300">
                      {isBn ? "ফুল উইডথ" : "Full Width"}
                    </span>
                  </>
                )}
              </button>

              {/* 10 Black Themes & Display Settings Button */}
              <button
                type="button"
                id="toggle-theme-modal-btn"
                onClick={() => setIsThemeModalOpen(true)}
                style={{
                  borderColor: activeTheme.borderColor,
                }}
                className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#080C14] hover:bg-[#0E1626] text-slate-300 hover:text-white border transition-all font-mono text-xs cursor-pointer shadow-inner group"
                title={
                  isBn
                    ? "১০টি ব্ল্যাক থিম ও ডিসপ্লে সেটিংস"
                    : "10 Black Themes & Display Settings"
                }
              >
                <Palette
                  className="w-3.5 h-3.5 transition-transform group-hover:rotate-12 shrink-0"
                  style={{ color: activeTheme.accentColor }}
                />
                <span
                  style={{ backgroundColor: activeTheme.accentColor }}
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                />
                <span className="hidden md:inline text-[11px] font-semibold text-slate-300">
                  {isBn ? "থিম" : "Theme"}
                </span>
              </button>

              {/* AI Mentor Quick Button (Always in top bar, no dangling row!) */}
              <button
                type="button"
                id="toggle-mentor-chat-top-btn"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-950/90 to-blue-950/90 hover:from-cyan-900 hover:to-blue-900 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-all shadow-md cursor-pointer whitespace-nowrap glow-cyan"
                title={t("aiMentor")}
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="hidden sm:inline text-xs">{t("aiMentor")}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              </button>
            </div>
          </div>

          {/* Search Bar on Mobile & Tablet */}
          <div className="block lg:hidden w-full">
            <AllInOneSearchBar
              onNavigate={handleSearchNavigate}
              onAskMentor={handleAskMentorFromSearch}
            />
          </div>

          {/* Mobile Quick Performance & Status Ribbon */}
          <div className="flex lg:hidden items-center justify-between gap-1.5 font-mono text-[11px] overflow-x-auto no-scrollbar py-0.5 border-t border-white/5 pt-1.5">
            {/* Balance */}
            <div className="flex items-center gap-1 bg-[#080C14] px-2 py-0.5 rounded-md border border-emerald-500/30 shrink-0">
              <span className="text-slate-400 text-[9px] uppercase">{t("balance")}:</span>
              <span className="text-emerald-400 font-bold">${stats.simulatedBalance.toFixed(0)}</span>
            </div>

            {/* Streak */}
            <button
              type="button"
              onClick={() => setActiveTab("daily-challenge")}
              className="flex items-center gap-1 bg-[#080C14] px-2 py-0.5 rounded-md border border-amber-500/30 text-amber-400 font-bold shrink-0 cursor-pointer"
            >
              <Flame className="w-3 h-3 fill-amber-400 animate-pulse" />
              <span className="text-slate-400 text-[9px]">{isBn ? "স্ট্রিক" : "STREAK"}:</span>
              <span>{currentStreak}d</span>
            </button>

            {/* Accuracy */}
            <div className="flex items-center gap-1 bg-[#080C14] px-2 py-0.5 rounded-md border border-white/10 shrink-0">
              <span className="text-slate-400 text-[9px]">{t("accuracy")}:</span>
              <span className="text-white font-bold">{winRatePercent}%</span>
            </div>

            {/* Rank */}
            <div className="flex items-center gap-1 bg-[#080C14] px-2 py-0.5 rounded-md border border-white/10 text-cyan-400 font-bold shrink-0">
              <span className="text-slate-400 text-[9px]">{t("userRank")}:</span>
              <span className="truncate max-w-[85px]">{rankLabel}</span>
            </div>

            {/* Mobile Theme Quick Selector */}
            <button
              type="button"
              id="mobile-theme-quick-btn"
              onClick={() => setIsThemeModalOpen(true)}
              style={{
                borderColor: activeTheme.borderColor,
              }}
              className="flex items-center gap-1 bg-[#080C14] hover:bg-[#0E1626] px-2 py-0.5 rounded-md border shrink-0 cursor-pointer"
              title={isBn ? "১০টি ব্ল্যাক থিম সেটিংস" : "10 Black Themes"}
            >
              <Palette
                className="w-3 h-3 shrink-0"
                style={{ color: activeTheme.accentColor }}
              />
              <span
                style={{ backgroundColor: activeTheme.accentColor }}
                className="w-1.5 h-1.5 rounded-full shrink-0"
              />
              <span className="text-slate-300 text-[9px] font-mono font-bold truncate max-w-[60px]">
                {isBn ? activeTheme.nameBn.split(" ")[0] : activeTheme.nameEn.split(" ")[0]}
              </span>
            </button>
          </div>

          {/* Primary Navigation Tabs Row (Desktop & Tablet; Mobile uses bottom navigation bar) */}
          <div className="hidden md:flex items-center justify-between gap-2 pt-1.5 border-t border-white/10">
            {/* Horizontal Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full py-0.5">
              <button
                type="button"
                id="nav-tab-simulation"
                onClick={() => setActiveTab("simulation")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === "simulation"
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-bold shadow-lg shadow-cyan-950/80 border border-cyan-400/50 glow-cyan"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent font-medium"
                }`}
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span className="hidden sm:inline">{t("tabSimulation")}</span>
                <span className="sm:hidden">{isBn ? "চার্ট ড্রিল" : "Sim Drill"}</span>
              </button>

              <button
                type="button"
                id="nav-tab-daily-challenge"
                onClick={() => setActiveTab("daily-challenge")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === "daily-challenge"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold shadow-lg shadow-amber-950/80 border border-amber-400/60 glow-amber"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent font-medium"
                }`}
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span className="hidden sm:inline">{t("tabDailyChallenge")}</span>
                <span className="sm:hidden">{isBn ? "দৈনিক ড্রিল" : "Daily Drill"}</span>
                <span
                  className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    activeTab === "daily-challenge"
                      ? "bg-black/80 text-amber-300 border border-amber-400/40"
                      : "bg-amber-950 text-amber-300 border border-amber-700/60"
                  }`}
                >
                  DAILY
                </span>
              </button>

              <button
                type="button"
                id="nav-tab-curriculum"
                onClick={() => setActiveTab("curriculum")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === "curriculum"
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-bold shadow-lg shadow-cyan-950/80 border border-cyan-400/50 glow-cyan"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent font-medium"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span className="hidden sm:inline">{t("tabCurriculum")}</span>
                <span className="sm:hidden">{isBn ? "কারিকুলাম" : "Curriculum"}</span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-black text-cyan-300 font-mono font-bold border border-white/10">
                  {stats.completedChapters.length}/30
                </span>
              </button>

              <button
                type="button"
                id="nav-tab-playbook"
                onClick={() => setActiveTab("playbook")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === "playbook"
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-bold shadow-lg shadow-cyan-950/80 border border-cyan-400/50 glow-cyan"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent font-medium"
                }`}
              >
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span className="hidden sm:inline">{t("tabPlaybook")}</span>
                <span className="sm:hidden">{isBn ? "প্লেবুক" : "Playbook"}</span>
              </button>

              <button
                type="button"
                id="nav-tab-math-risk"
                onClick={() => setActiveTab("math-risk")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === "math-risk"
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-bold shadow-lg shadow-cyan-950/80 border border-cyan-400/50 glow-cyan"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent font-medium"
                }`}
              >
                <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                <span className="hidden sm:inline">{t("tabMathRisk")}</span>
                <span className="sm:hidden">{isBn ? "ম্যাথ ও রিস্ক" : "Math/Risk"}</span>
              </button>
            </div>

            {/* Desktop Only: Trader Rank & Win Rate Accuracy Chips */}
            <div className="hidden lg:flex items-center gap-2 shrink-0 text-xs font-mono">
              {/* Trader Rank Chip */}
              <div className="flex items-center gap-1.5 bg-[#080C14] px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-400 text-[11px] shadow-sm">
                <span className="text-slate-500 uppercase">{t("userRank")}:</span>
                <span className="text-cyan-400 font-bold">{rankLabel}</span>
              </div>

              {/* Win Rate Accuracy Chip */}
              <div className="flex items-center gap-1.5 bg-[#080C14] px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-400 text-[11px] shadow-sm">
                <span className="text-slate-500 uppercase">{t("accuracy")}:</span>
                <span className="text-white font-bold">
                  {winRatePercent}%{" "}
                  <span className="text-slate-500">
                    ({stats.simulationsWon}/{stats.totalSimulations})
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Body View Router */}
      <main className={`flex-1 transition-all duration-200 p-2 sm:p-4 lg:p-6 pb-24 md:pb-16 overflow-x-hidden w-full ${isFullWidth ? "max-w-[1920px] mx-auto" : "max-w-7xl mx-auto"}`}>
        {activeTab === "simulation" && (
          <SimulationDrillView
            stats={stats}
            onRecordTrade={handleRecordTrade}
            initialScenarioId={drillScenarioId}
            onSwitchToCurriculum={() => setActiveTab("curriculum")}
            onSwitchToDailyChallenge={() => setActiveTab("daily-challenge")}
          />
        )}

        {activeTab === "daily-challenge" && (
          <DailyTradingChallenge
            onSwitchToSimulation={(scenarioId) => {
              setDrillScenarioId(scenarioId);
              setActiveTab("simulation");
            }}
          />
        )}

        {activeTab === "curriculum" && (
          <CurriculumView
            onSelectScenarioForDrill={handleLaunchScenarioFromCurriculum}
            completedChapters={stats.completedChapters}
            onMarkChapterCompleted={handleMarkChapterCompleted}
            initialChapterId={selectedChapterId}
          />
        )}

        {activeTab === "playbook" && (
          <PlaybookView
            onLaunchBlueprintDrill={handleLaunchBlueprintFromPlaybook}
            initialSubTab={playbookSubTab}
            initialPatternId={playbookPatternId}
          />
        )}

        {activeTab === "math-risk" && <MathRiskView stats={stats} />}
      </main>

      {/* Desktop Sticky High Density Terminal Status Footer */}
      <footer className="hidden md:block fixed bottom-0 left-0 right-0 z-20 h-7 bg-[#0B0F17]/95 backdrop-blur-md border-t border-[#1E293B] px-3 sm:px-4 select-none">
        <div className={`w-full mx-auto h-full flex items-center justify-between text-xs font-mono ${isFullWidth ? "max-w-[1920px]" : "max-w-7xl"}`}>
          <div className="flex items-center gap-3 sm:gap-4 text-gray-400">
            <span className="font-semibold text-gray-300">ID: {drillScenarioId || "OTC_CH10_001"}</span>
            <span className="text-cyan-800">|</span>
            <span>{t("timeframe")}</span>
            <span className="text-cyan-800 hidden sm:inline">|</span>
            <span className="hidden sm:inline">{t("footerConfluence")}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <span className="text-gray-300">
              {t("serverStatus")}: <span className="text-green-400 animate-pulse font-bold">{t("opSync")}</span>
            </span>
            <span className="text-gray-400 hidden sm:inline">
              {t("riskProtocol")}: <span className="text-cyan-400 font-bold">{t("fixedRiskModel")}</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Dedicated Bottom Navigation Bar (Touch-friendly 44px+ targets) */}
      <nav
        style={{
          backgroundColor: `${activeTheme.bgSurface}fa`,
          borderColor: activeTheme.borderColor,
        }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 backdrop-blur-xl border-t px-1 py-1.5 flex items-center justify-around shadow-2xl safe-area-inset-bottom transition-colors duration-300"
      >
        <button
          type="button"
          onClick={() => setActiveTab("simulation")}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "simulation"
              ? "text-cyan-400 bg-cyan-950/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Zap className={`w-5 h-5 ${activeTab === "simulation" ? "text-cyan-400" : "text-slate-400"}`} />
          <span className="text-[10px] font-bold font-mono tracking-tight mt-0.5">
            {isBn ? "ড্রিল" : "Drill"}
          </span>
          {activeTab === "simulation" && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("daily-challenge")}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === "daily-challenge"
              ? "text-amber-400 bg-amber-950/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Flame className={`w-5 h-5 ${activeTab === "daily-challenge" ? "text-amber-400 fill-amber-400 animate-pulse" : "text-slate-400"}`} />
            <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span className="text-[10px] font-bold font-mono tracking-tight mt-0.5">
            {isBn ? "দৈনিক" : "Daily"}
          </span>
          {activeTab === "daily-challenge" && (
            <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("curriculum")}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "curriculum"
              ? "text-cyan-400 bg-cyan-950/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === "curriculum" ? "text-cyan-400" : "text-slate-400"}`} />
          <span className="text-[10px] font-bold font-mono tracking-tight mt-0.5">
            {isBn ? "অধ্যায়" : "Chapters"}
          </span>
          {activeTab === "curriculum" && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("playbook")}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "playbook"
              ? "text-cyan-400 bg-cyan-950/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Award className={`w-5 h-5 ${activeTab === "playbook" ? "text-cyan-400" : "text-slate-400"}`} />
          <span className="text-[10px] font-bold font-mono tracking-tight mt-0.5">
            {isBn ? "প্লেবুক" : "Playbook"}
          </span>
          {activeTab === "playbook" && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("math-risk")}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer ${
            activeTab === "math-risk"
              ? "text-cyan-400 bg-cyan-950/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Calculator className={`w-5 h-5 ${activeTab === "math-risk" ? "text-cyan-400" : "text-slate-400"}`} />
          <span className="text-[10px] font-bold font-mono tracking-tight mt-0.5">
            {isBn ? "রিস্ক" : "Math"}
          </span>
          {activeTab === "math-risk" && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />
          )}
        </button>
      </nav>

      {/* Bottom Floating AI Mentor Chat Assistant */}
      <MentorChatDrawer
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        externalPrompt={mentorExternalPrompt}
        onClearExternalPrompt={() => setMentorExternalPrompt(undefined)}
      />

      {/* 10 Black Themes & Display Settings Modal */}
      <ThemeSettingsModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        activeTheme={activeTheme}
        onSelectTheme={(theme) => setActiveTheme(theme)}
        isBn={isBn}
      />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}

export default App;
