import React, { useState, useEffect } from "react";
import { Chapter } from "../types";
import { CURRICULUM_CHAPTERS } from "../data/curriculum";
import { CHAPTER_VISUALS } from "../data/chapterVisuals";
import { ChapterVisualExample } from "./ChapterVisualExample";
import { ChapterThumbnailChart } from "./ChapterThumbnailChart";
import { useLanguage } from "../context/LanguageContext";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  GraduationCap,
  LayoutGrid,
  LayoutList,
  PlayCircle,
  Search,
  ShieldCheck,
  Zap,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CurriculumViewProps {
  onSelectScenarioForDrill: (chapterId: number) => void;
  completedChapters: number[];
  onMarkChapterCompleted: (chapterId: number) => void;
  initialChapterId?: number;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  onSelectScenarioForDrill,
  completedChapters,
  onMarkChapterCompleted,
  initialChapterId,
}) => {
  const { t, isBn, getLocalizedChapter, getCategoryName } = useLanguage();
  const [selectedChapterId, setSelectedChapterId] = useState<number>(
    initialChapterId || 1
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isMobileDirectoryOpen, setIsMobileDirectoryOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState<boolean>(true);

  useEffect(() => {
    if (initialChapterId) {
      setSelectedChapterId(initialChapterId);
      setSelectedCategory("All");
      setSearchQuery("");
    }
  }, [initialChapterId]);

  // Diagnostic Quiz state for currently viewed chapter
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const rawSelectedChapter =
    CURRICULUM_CHAPTERS.find((c) => c.id === selectedChapterId) ||
    CURRICULUM_CHAPTERS[0];
  const selectedChapter = getLocalizedChapter(rawSelectedChapter);

  const rawCategories = [
    "All",
    "Foundations & Math",
    "Candlestick Mechanics",
    "Structure & Levels",
    "Liquidity & Imbalance",
    "Running Candle & Traps",
    "Execution & Matrix",
    "Advanced Confluence & OTC",
    "Risk, Edge & Playbook",
  ];

  const localizedChapters: Chapter[] = CURRICULUM_CHAPTERS.map((c) =>
    getLocalizedChapter(c)
  );

  const filteredChapters = localizedChapters.filter((chap) => {
    const rawChap = CURRICULUM_CHAPTERS.find((c) => c.id === chap.id);
    const rawCategory = rawChap?.category || chap.category;

    const matchesSearch =
      chap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chap.coreThesis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `CH ${chap.id}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || rawCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAnswer = (qId: string, optIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleVerifyQuiz = (qId: string) => {
    setQuizSubmitted((prev) => ({ ...prev, [qId]: true }));
    onMarkChapterCompleted(selectedChapter.id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      {/* Mobile Quick Chapter Selector Header (Compact & thumb friendly) */}
      <div className="lg:hidden p-3.5 bg-[#060911] rounded-2xl border border-white/10 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/40 shrink-0">
            {isBn ? `অধ্যায় ${selectedChapter.id < 10 ? `০${selectedChapter.id}` : selectedChapter.id}` : `CH ${selectedChapter.id < 10 ? `0${selectedChapter.id}` : selectedChapter.id}`}
          </span>
          <span className="text-sm font-bold text-white truncate">
            {selectedChapter.title}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileDirectoryOpen(!isMobileDirectoryOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-semibold shrink-0 cursor-pointer shadow-sm glow-cyan"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isMobileDirectoryOpen ? (isBn ? "লুকান" : "Hide List") : (isBn ? "অধ্যায় তালিকা" : "All Chapters")}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMobileDirectoryOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Left Sidebar: 30-Chapter Master Directory */}
      <div className={`lg:col-span-4 xl:col-span-4 2xl:col-span-3 flex-col gap-2.5 sm:gap-3 ${isMobileDirectoryOpen ? "flex" : "hidden lg:flex"}`}>
        {/* Search & Category Filter */}
        <div className="p-3 sm:p-4 bg-[#060911] rounded-xl sm:rounded-2xl border border-white/10 space-y-2.5 sm:space-y-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5 truncate">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{t("curriculumTitle")}</span>
            </h3>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Compact / Detailed View Mode Switcher */}
              <button
                type="button"
                id="toggle-chapter-view-mode-btn"
                onClick={() => setIsCompactMode(!isCompactMode)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                  isCompactMode
                    ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900"
                    : "bg-[#000000] text-slate-300 border-white/10 hover:text-white"
                }`}
                title={isBn ? (isCompactMode ? "বিস্তারিত চার্ট ভিউ দেখুন" : "কম্প্যাক্ট তালিকা দেখুন") : (isCompactMode ? "Switch to Detailed" : "Switch to Compact")}
              >
                {isCompactMode ? (
                  <LayoutList className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                ) : (
                  <LayoutGrid className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
                <span className="text-[10px] font-semibold hidden xs:inline">
                  {isCompactMode ? (isBn ? "কম্প্যাক্ট" : "Compact") : (isBn ? "বিস্তারিত" : "Detailed")}
                </span>
              </button>

              <span className="text-[10px] sm:text-xs font-mono text-cyan-300 font-semibold px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40">
                {completedChapters.length}/30
              </span>
            </div>
          </div>

          {/* Search Input & Category Dropdown */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                id="search-curriculum-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchCurriculumPlaceholder")}
                className="w-full pl-8 sm:pl-9 pr-3 py-2 bg-[#000000] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-1">
              <select
                id="category-filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#000000] border border-white/10 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-medium"
              >
                {rawCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryName(cat)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chapters Scrollable List (Optimized for viewing 2-3 chapters per glance) */}
        <div className="flex flex-col gap-1.5 sm:gap-2 max-h-[380px] sm:max-h-[500px] lg:max-h-[680px] overflow-y-auto no-scrollbar md:custom-scrollbar md:pr-1">
          {filteredChapters.map((chap) => {
            const isSelected = chap.id === selectedChapterId;
            const isDone = completedChapters.includes(chap.id);

            return (
              <button
                key={chap.id}
                id={`chapter-nav-item-${chap.id}`}
                onClick={() => {
                  setSelectedChapterId(chap.id);
                  setIsMobileDirectoryOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex flex-col rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer ${
                  isCompactMode ? "p-2.5 sm:p-3 gap-1" : "p-3 sm:p-3.5 gap-2"
                } ${
                  isSelected
                    ? "bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-950/50 glow-cyan"
                    : "bg-[#060911] border-white/10 hover:bg-[#0c1220] text-slate-300"
                }`}
              >
                {/* Header Row: Chapter Badge + Category + Completion Status */}
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                    <span
                      className={`text-[10px] sm:text-xs font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded shrink-0 ${
                        isSelected
                          ? "bg-cyan-400 text-black font-extrabold"
                          : "bg-[#000000] text-cyan-300 border border-white/10"
                      }`}
                    >
                      {isBn ? `অধ্যায় ${chap.id < 10 ? `০${chap.id}` : chap.id}` : `CH ${chap.id < 10 ? `0${chap.id}` : chap.id}`}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 truncate font-mono">
                      {chap.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* OTC Strategy Badge in compact mode */}
                    {isCompactMode && CHAPTER_VISUALS[chap.id]?.pair && (
                      <span className="text-[9px] font-mono text-cyan-400/90 font-semibold px-1.5 py-0.5 rounded bg-black/60 border border-cyan-500/20 hidden xs:inline-block">
                        {CHAPTER_VISUALS[chap.id]?.pair.split(" ")[0]} 1M
                      </span>
                    )}
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronRight
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                          isSelected ? "text-cyan-400 translate-x-0.5" : ""
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* Title Row */}
                <h4
                  className={`text-xs sm:text-sm font-semibold leading-snug ${
                    isCompactMode ? "truncate line-clamp-1" : "line-clamp-2"
                  } ${isSelected ? "text-white font-bold" : "text-slate-200"}`}
                >
                  {chap.title}
                </h4>

                {/* Detailed View Only: Full Price Action Thumbnail */}
                {!isCompactMode && (
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <ChapterThumbnailChart
                      chapterId={chap.id}
                      width={92}
                      height={44}
                    />
                    <div className="flex flex-col flex-1 min-w-0 pr-1">
                      <span className="text-xs font-mono text-cyan-400 font-bold uppercase truncate">
                        {CHAPTER_VISUALS[chap.id]?.pair || "1M OTC"} • {CHAPTER_VISUALS[chap.id]?.timeframe || "1 MIN"}
                      </span>
                      <span className="text-xs text-slate-300 font-medium truncate">
                        {isBn ? CHAPTER_VISUALS[chap.id]?.titleBn : CHAPTER_VISUALS[chap.id]?.titleEn}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Main Panel: Chapter Content & Diagnostic Questions */}
      <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 flex flex-col gap-4">
        <div className="p-3.5 sm:p-7 bg-[#060911] rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl space-y-4 sm:space-y-6 backdrop-blur-md">
          {/* Chapter Header */}
          <div className="border-b border-white/10 pb-4 sm:pb-5 space-y-3 sm:space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-cyan-950/80 text-cyan-300 font-mono font-bold text-xs sm:text-sm border border-cyan-500/40">
                  {isBn ? `অধ্যায় ${selectedChapter.id < 10 ? `০${selectedChapter.id}` : selectedChapter.id}` : `CHAPTER ${selectedChapter.id < 10 ? `0${selectedChapter.id}` : selectedChapter.id}`}
                </span>
                <span className="text-xs sm:text-base text-slate-300 font-medium truncate">
                  {selectedChapter.category}
                </span>
              </div>

              {/* Action Button: Jump to Live Scenario Drill */}
              <button
                type="button"
                id="launch-scenario-drill-btn"
                onClick={() => onSelectScenarioForDrill(selectedChapter.id)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-base font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/30 border border-cyan-300 transition-all cursor-pointer glow-cyan"
              >
                <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t("launchChartDrill")}</span>
              </button>
            </div>

            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {selectedChapter.title}
            </h1>

            {/* Core Thesis Card */}
            <div className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-[#000000] border border-white/10 space-y-1 sm:space-y-1.5">
              <span className="font-bold text-cyan-400 block text-xs sm:text-sm uppercase tracking-wider font-mono">
                {t("coreThesis")}:
              </span>
              <p className="text-sm sm:text-lg text-slate-100 leading-relaxed font-normal">{selectedChapter.coreThesis}</p>
            </div>

            {/* Zero Hype Rule Banner */}
            <div className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 leading-relaxed flex items-start gap-2.5 sm:gap-3 shadow-inner">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold uppercase tracking-wider text-xs sm:text-sm text-amber-400 block mb-1 font-mono">
                  {t("zeroHypeAxiom")}:
                </span>
                <span className="text-sm sm:text-lg text-amber-100 leading-relaxed">{selectedChapter.zeroHypeRule}</span>
              </div>
            </div>
          </div>

          {/* Section: 1-Minute Candlestick Visual Example for this Chapter */}
          {CHAPTER_VISUALS[selectedChapter.id] && (
            <div className="space-y-2">
              <ChapterVisualExample visual={CHAPTER_VISUALS[selectedChapter.id]} />
            </div>
          )}

          {/* Section: Technical Theory */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>{t("technicalTheory")}</span>
            </h3>

            <div className="space-y-2.5">
              {selectedChapter.technicalTheory.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#000000] border border-white/10 text-base sm:text-lg text-slate-100 leading-relaxed flex items-start gap-3"
                >
                  <span className="text-cyan-400 font-mono font-bold mt-0.5 text-xs sm:text-sm px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 shrink-0">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Order Flow Mechanics & Why Sellers/Buyers Step In */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{t("orderFlowMechanics")}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedChapter.orderFlowMechanics.map((mech, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#000000] border border-white/10 space-y-2"
                >
                  <h4 className="text-base sm:text-lg font-bold text-cyan-300">
                    {mech.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    {mech.description}
                  </p>
                  <div className="pt-2 border-t border-white/10 text-sm text-slate-300">
                    <span className="text-amber-400 font-semibold">
                      {t("whyItOccurs")}:{" "}
                    </span>
                    {mech.whyItHappens}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Strict Rules & Invalidation Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2.5">
              <h4 className="text-sm sm:text-base font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t("strictRules")}</span>
              </h4>
              <ul className="space-y-2 text-sm sm:text-base text-slate-100">
                {selectedChapter.strictRules.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2.5">
              <h4 className="text-sm sm:text-base font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{t("invalidationConditions")}</span>
              </h4>
              <ul className="space-y-2 text-sm sm:text-base text-slate-100">
                {selectedChapter.invalidations.map((inv, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Interactive Diagnostic Questions / Comprehension Checkpoint */}
          {selectedChapter.diagnosticQuestions &&
            selectedChapter.diagnosticQuestions.length > 0 && (
              <div className="space-y-4 pt-5 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>{t("diagnosticCheckpoint")}</span>
                  </h3>
                  <span className="text-xs sm:text-sm text-slate-400">
                    {t("verifyComprehension")}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {selectedChapter.diagnosticQuestions.map((q, qIndex) => {
                    const selectedOpt = userAnswers[q.id];
                    const isSubmitted = quizSubmitted[q.id];
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="p-4 sm:p-5 rounded-xl bg-[#000000] border border-white/10 space-y-3"
                      >
                        <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                          Q{qIndex + 1}: {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => {
                            let optStyle =
                              "bg-[#060911] border-white/10 text-slate-200 hover:border-slate-500";
                            if (isSubmitted) {
                              if (oIdx === q.correctIndex) {
                                optStyle =
                                  "bg-emerald-950/70 border-emerald-400 text-emerald-200 font-bold glow-emerald";
                              } else if (
                                selectedOpt === oIdx &&
                                selectedOpt !== q.correctIndex
                              ) {
                                optStyle =
                                  "bg-rose-950/70 border-rose-400 text-rose-200 glow-rose";
                              }
                            } else if (selectedOpt === oIdx) {
                              optStyle =
                                "bg-cyan-950/80 border-cyan-400 text-cyan-200 font-semibold glow-cyan";
                            }

                            return (
                              <button
                                key={oIdx}
                                id={`quiz-opt-${q.id}-${oIdx}`}
                                disabled={isSubmitted}
                                onClick={() => handleSelectAnswer(q.id, oIdx)}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm sm:text-base transition-all cursor-pointer ${optStyle}`}
                              >
                                <span className="font-mono text-slate-400 mr-2 font-bold">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {!isSubmitted ? (
                          <button
                            type="button"
                            id={`verify-quiz-btn-${q.id}`}
                            disabled={selectedOpt === undefined}
                            onClick={() => handleVerifyQuiz(q.id)}
                            className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all ${
                              selectedOpt !== undefined
                                ? "bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold shadow-md border border-cyan-300 cursor-pointer glow-cyan"
                                : "bg-[#060911] text-slate-600 cursor-not-allowed border border-white/10"
                            }`}
                          >
                            {t("checkAnswer")}
                          </button>
                        ) : (
                          <div
                            className={`p-4 rounded-xl text-sm sm:text-base leading-relaxed ${
                              isCorrect
                                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/50 glow-emerald"
                                : "bg-rose-950/60 text-rose-300 border border-rose-500/50 glow-rose"
                            }`}
                          >
                            <span className="font-bold block mb-1">
                              {isCorrect
                                ? `✓ ${t("correctAssessment")}`
                                : `✗ ${t("inaccurateAssessment")}`}
                            </span>
                            <p className="text-slate-200">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Chapter Prev / Next Navigation Footer (Mobile & Desktop Friendly) */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 pt-4 sm:pt-5 border-t border-white/10 mt-2">
            <button
              type="button"
              disabled={selectedChapter.id <= 1}
              onClick={() => {
                setSelectedChapterId(selectedChapter.id - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-2 sm:py-2.5 min-h-[40px] rounded-xl bg-[#060911] hover:bg-[#0E1626] border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{isBn ? "পূর্ববর্তী অধ্যায়" : "Previous Chapter"}</span>
              <span className="sm:hidden">{isBn ? "পূর্ববর্তী" : "Prev"}</span>
            </button>

            <span className="text-xs sm:text-sm font-mono text-cyan-400 font-bold px-2.5 sm:px-3 py-1 rounded-lg bg-black border border-white/10 shrink-0">
              {selectedChapter.id} / 30
            </span>

            <button
              type="button"
              disabled={selectedChapter.id >= 30}
              onClick={() => {
                setSelectedChapterId(selectedChapter.id + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-2 sm:py-2.5 min-h-[40px] rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm glow-cyan"
            >
              <span className="hidden sm:inline">{isBn ? "পরবর্তী অধ্যায়" : "Next Chapter"}</span>
              <span className="sm:hidden">{isBn ? "পরবর্তী" : "Next"}</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
