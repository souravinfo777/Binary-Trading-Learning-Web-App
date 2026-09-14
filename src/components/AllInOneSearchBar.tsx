import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  GlobalSearchItem,
  SearchCategory,
  searchGlobalTopics,
} from "../data/allSearchData";
import {
  Search,
  X,
  BookOpen,
  Zap,
  Layers,
  ArrowUpRight,
  Calculator,
  Compass,
  CornerDownLeft,
  Flame,
  MessageSquare,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Command,
} from "lucide-react";

interface AllInOneSearchBarProps {
  onNavigate: (item: GlobalSearchItem) => void;
  onAskMentor?: (prompt: string) => void;
}

export const AllInOneSearchBar: React.FC<AllInOneSearchBarProps> = ({
  onNavigate,
  onAskMentor,
}) => {
  const { isBn } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerInputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Global keyboard shortcut Ctrl+K or Cmd+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Query results from engine
  const results = useMemo(() => {
    return searchGlobalTopics(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(
        `[data-result-index="${selectedIndex}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  // Keyboard navigation within list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? Math.max(0, results.length - 1) : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (searchQuery.trim() && onAskMentor) {
        handleAskMentorQuery(searchQuery);
      }
    }
  };

  const handleSelect = (item: GlobalSearchItem) => {
    setIsOpen(false);
    setSearchQuery("");
    onNavigate(item);
  };

  const handleAskMentorQuery = (prompt: string) => {
    setIsOpen(false);
    if (onAskMentor) {
      onAskMentor(
        isBn
          ? `আমাকে "${prompt}" সম্পর্কে বিস্তারিত ট্রেডিং রুলস এবং মার্কেট মেকানিক্স বুঝিয়ে বলুন।`
          : `Explain the detailed trading rules, market mechanics, and order flow regarding: "${prompt}".`
      );
    }
  };

  const categoryFilters = [
    { id: "all", labelEn: "All Topics", labelBn: "সকল টপিক" },
    { id: "curriculum", labelEn: "Curriculum (30)", labelBn: "কারিকুলাম (৩০)" },
    { id: "sureshot", labelEn: "Sureshots (10)", labelBn: "শিওর শট (১০)" },
    { id: "supply_demand", labelEn: "Supply & Demand", labelBn: "সাপ্লাই ও ডিমান্ড" },
    { id: "star_pattern", labelEn: "Star Patterns", labelBn: "স্টার প্যাটার্নস" },
    { id: "gap_pattern", labelEn: "Gap Formations (9)", labelBn: "গ্যাপ ফরমেশন (৯)" },
    { id: "strat", labelEn: "The Strat", labelBn: "দ্য স্ট্র্যাট" },
    { id: "simulation", labelEn: "Practice Drills", labelBn: "প্র্যাকটিস ড্রিল" },
    { id: "math_risk", labelEn: "Math & Risk", labelBn: "ম্যাথ ও রিস্ক" },
  ];

  const getCategoryIcon = (category: SearchCategory) => {
    switch (category) {
      case "curriculum":
        return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case "sureshot":
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case "supply_demand":
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      case "star_pattern":
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case "gap_pattern":
        return <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />;
      case "strat":
        return <Flame className="w-3.5 h-3.5 text-yellow-400" />;
      case "simulation":
        return <Compass className="w-3.5 h-3.5 text-indigo-400" />;
      case "math_risk":
      case "calculator":
        return <Calculator className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const popularSearches = [
    { label: isBn ? "৫০% গোল্ডেন লেভেল" : "50% Golden Retest", query: "50%" },
    { label: isBn ? "মর্নিং ও ইভনিং স্টার" : "Morning / Evening Star", query: "star" },
    { label: isBn ? "গ্যাপ প্যাটার্নস (Gaps)" : "Gap Patterns", query: "gap" },
    { label: isBn ? "অর্ডার ব্লক ও FVG" : "Order Block & FVG", query: "fvg" },
    { label: isBn ? "ব্রেক-ইভেন ৫৪.০৫%" : "Break-Even Math", query: "break even" },
    { label: isBn ? "দ্য স্ট্র্যাট ২-১-২" : "The Strat 2-1-2", query: "2-1-2" },
    { label: isBn ? "সাপ্লাই ও ডিমান্ড জোন" : "Supply & Demand", query: "supply" },
    { label: isBn ? "মার্টিংগেল ধ্বংস" : "Martingale Ruin", query: "martingale" },
  ];

  return (
    <>
      {/* 1. Header Search Bar Trigger Input */}
      <div className="relative w-full">
        <button
          type="button"
          id="global-search-trigger"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between gap-2.5 px-3 py-1.5 bg-[#080C14] hover:bg-[#0E1522] border border-white/10 hover:border-cyan-500/50 rounded-xl text-left text-xs transition-all shadow-inner group cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400/60"
          title={isBn ? "যেকোনো টপিক সার্চ করুন (Ctrl+K)" : "Search any topic, pattern, chapter (Ctrl+K)"}
        >
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200 min-w-0">
            <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate text-slate-400 group-hover:text-slate-200">
              {isBn
                ? "টপিক, প্যাটার্ন, অধ্যায় খুঁজুন..."
                : "Search any topic, pattern, chapter..."}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white/5 border border-white/10 rounded">
              <span className="text-[9px]">⌘</span>K
            </kbd>
          </div>
        </button>
      </div>

      {/* 2. Full-Featured All-In-One Search Modal Palette */}
      {isOpen && (
        <div
          id="all-in-one-search-overlay"
          className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="w-full max-w-3xl bg-[#090E17] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Search Header Input */}
            <div className="p-4 border-b border-white/10 bg-[#0C121E]/90 flex items-center gap-3">
              <Search className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
              <input
                ref={inputRef}
                type="text"
                id="global-search-modal-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  isBn
                    ? "যেকোনো টপিক সার্চ করুন (যেমন: 50%, gap, star, break even, ch 10, sureshot)..."
                    : "Search any topic (e.g., 50%, gap, star, break even, ch 10, sureshot, strat)..."
                }
                className="flex-1 bg-transparent text-white text-sm sm:text-base font-medium placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 rounded-md text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Quick Filter Category Badges */}
            <div className="px-4 py-2.5 bg-[#070B13] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar md:custom-scrollbar text-xs touch-pan-x">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mr-1 shrink-0">
                {isBn ? "ফিল্টার:" : "FILTER:"}
              </span>
              {categoryFilters.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-cyan-500 text-black font-bold shadow-md shadow-cyan-950/80"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5"
                  }`}
                >
                  {isBn ? cat.labelBn : cat.labelEn}
                </button>
              ))}
            </div>

            {/* Live Results or Suggestions Area */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto no-scrollbar md:custom-scrollbar p-3 space-y-2 divide-y divide-white/5"
            >
              {/* Popular Institutional Quick Chips when search query is empty */}
              {!searchQuery.trim() && (
                <div className="p-2 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isBn
                        ? "জনপ্রিয় প্রাতিষ্ঠানিক টপিকসমূহ"
                        : "POPULAR INSTITUTIONAL TOPICS"}
                    </span>
                    <span>{isBn ? "ক্লিক করে খুঁজুন" : "Click to instant search"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSearchQuery(item.query)}
                        className="px-3 py-1.5 bg-[#0F172A] hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/50 rounded-xl text-xs text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Search className="w-3 h-3 text-cyan-400/80" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Result Count Banner */}
              <div className="px-2 pt-2 pb-1 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>
                  {isBn
                    ? `${results.length}টি বিষয় পাওয়া গেছে`
                    : `${results.length} topics matched`}
                </span>
                <span className="hidden sm:inline">
                  {isBn
                    ? "↑↓ তীর বাটন দিয়ে নেভিগেট করুন, Enter প্রেস করে ওপেন করুন"
                    : "Use ↑↓ arrows to navigate, Enter to open"}
                </span>
              </div>

              {/* Result Items */}
              {results.length > 0 ? (
                results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      data-result-index={idx}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`group p-3 rounded-xl transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-gradient-to-r from-cyan-950/60 via-[#0E1726] to-[#0A101D] border-cyan-500/60 shadow-lg shadow-cyan-950/40"
                          : "bg-transparent hover:bg-[#0D1422] border-transparent hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Icon Container */}
                          <div
                            className={`p-2 rounded-lg border shrink-0 mt-0.5 ${
                              isSelected
                                ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300"
                                : "bg-white/5 border-white/10 text-slate-400 group-hover:text-cyan-300"
                            }`}
                          >
                            {getCategoryIcon(item.category)}
                          </div>

                          <div className="min-w-0 space-y-1">
                            {/* Category Badge & Signal Pill */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                  item.badgeColor ||
                                  "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                                }`}
                              >
                                {item.badge || (isBn ? item.categoryLabelBn : item.categoryLabelEn)}
                              </span>

                              {item.signal && (
                                <span
                                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                                    item.signal === "CALL"
                                      ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/50"
                                      : item.signal === "PUT"
                                      ? "bg-rose-950/90 text-rose-300 border-rose-500/50"
                                      : "bg-cyan-950/90 text-cyan-300 border-cyan-500/50"
                                  }`}
                                >
                                  {item.signal === "CALL" ? (
                                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                                  ) : item.signal === "PUT" ? (
                                    <TrendingDown className="w-3 h-3 text-rose-400" />
                                  ) : null}
                                  {item.signal}
                                </span>
                              )}

                              {item.winRate && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                  {item.winRate}
                                </span>
                              )}
                            </div>

                            {/* Main Title */}
                            <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                              {isBn ? item.titleBn : item.titleEn}
                            </h4>

                            {/* Subtitle */}
                            <p className="text-xs text-cyan-400/90 font-medium">
                              {isBn ? item.subtitleBn : item.subtitleEn}
                            </p>

                            {/* Description snippet */}
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {isBn ? item.descriptionBn : item.descriptionEn}
                            </p>
                          </div>
                        </div>

                        {/* Direct Action Indicators */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0 self-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(item);
                            }}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-cyan-500 text-black font-bold shadow"
                                : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
                            }`}
                          >
                            <span>{isBn ? "দেখুন" : "Open"}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Ask Mentor Button */}
                          {item.target.actionPrompt && onAskMentor && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAskMentorQuery(item.target.actionPrompt!);
                              }}
                              className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 hover:underline cursor-pointer"
                              title={isBn ? "AI মেন্টরকে জিজ্ঞাসা করুন" : "Ask AI Mentor"}
                            >
                              <MessageSquare className="w-3 h-3 text-cyan-400" />
                              <span>{isBn ? "মেন্টরকে প্রশ্ন" : "Ask AI"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* No Results State with AI Mentor Assistant Fallback */
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">
                      {isBn ? "কোনো ফলাফল মেলেনি" : "No exact topic found"}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      {isBn
                        ? `"${searchQuery}" এর সাথে হুবহু মেলানো যায়নি। তবে আপনি আমাদের AI মেন্টরকে এই বিষয়ে সরাসরি প্রশ্ন করতে পারেন:`
                        : `No direct matching curriculum or playbook entries for "${searchQuery}". Ask our AI Mentor to explain it:`}
                    </p>
                  </div>

                  {onAskMentor && (
                    <button
                      type="button"
                      onClick={() => handleAskMentorQuery(searchQuery)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg shadow-cyan-950/80 cursor-pointer transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-black" />
                      <span>
                        {isBn
                          ? `AI মেন্টরকে "${searchQuery}" সম্পর্কে জিজ্ঞাসা করুন`
                          : `Ask AI Mentor about "${searchQuery}"`}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Navigation Helper */}
            <div className="p-3 bg-[#05080E] border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white">
                    ↓
                  </kbd>
                  <span>{isBn ? "নির্বাচন করুন" : "Select"}</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white">
                    Enter
                  </kbd>
                  <span>{isBn ? "ওপেন করুন" : "Open"}</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white">
                    ESC
                  </kbd>
                  <span>{isBn ? "বন্ধ করুন" : "Close"}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>{isBn ? "অল-ইন-ওয়ান ইনস্ট্যান্ট সার্চ" : "All-In-One Instant Search"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
