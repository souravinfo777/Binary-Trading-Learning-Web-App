import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Sparkles,
  User,
  Zap,
  RotateCcw,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface MentorChatDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  currentChapterId?: number;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export const MentorChatDrawer: React.FC<MentorChatDrawerProps> = ({
  isOpen,
  onToggle,
  currentChapterId = 1,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const { t, isBn } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: isBn
        ? "নমস্কার / সালাম। আমি আপনার ওটিসি কোয়ান্ট প্রাইস অ্যাকশন ও অ্যালগরিদমিক ট্রেডিং মেন্টর। মার্কেট মেকানিক্স, অর্ডার ব্লক, এফভিজি (FVG), সাইকোলজিক্যাল রাউন্ড নম্বর বা ম্যাথমেটিক্যাল এক্সপেক্ট্যান্সি সম্পর্কে যে কোনো প্রশ্ন করুন। নো হাইপ, শতভাগ ডিসিপ্লিন।"
        : "Greetings. I am your OTC Quantitative Price Action Engine & Algorithmic Trading Mentor. Ask me any question on market mechanics, order blocks, FVG imbalances, psychological round numbers, or mathematical expectancy. Zero hype. Strict probabilistic discipline.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (externalPrompt) {
      handleSend(externalPrompt);
      if (onClearExternalPrompt) {
        onClearExternalPrompt();
      }
    }
  }, [externalPrompt]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/mentor/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: messageText,
          chapterContext: currentChapterId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: Message = {
          role: "assistant",
          content: data.reply || (isBn ? "বিশ্লেষণ সম্পন্ন।" : "Analysis complete."),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error("Failed response from server");
      }
    } catch (err) {
      // High-quality deterministic fallback response
      const fallbackMsg: Message = {
        role: "assistant",
        content: isBn
          ? `**প্রাতিষ্ঠানিক ঝুঁকি নির্দেশিকা (Institutional Directive):**\nবাইনারি ও ওটিসি অপশনে প্রতিটি সেটআপ সম্পূর্ণ সম্ভাব্যতামূলক (probabilistic)। সর্বদা ৪টি ফ্যাক্টর যাচাই করুন:\n১) হায়ার টাইমফ্রেম ট্রেন্ড (15M/5M),\n২) লিকুইডিটি সুইপ (BSL/SSL),\n৩) .00 / .50 রাউন্ড নম্বরের প্রতিক্রিয়া,\n৪) রানিং ক্যান্ডেল ১৫-৪৫ সেকেন্ডে প্রত্যাখান (rejection)।\nকখনই প্রতি ট্রেডে ১% এর বেশি ঝুঁকি নেবেন না।`
          : `**Institutional Risk Directive:**\nIn binary & OTC options, every setup is strictly probabilistic. Ensure you verify: 1) Higher Timeframe 15M/5M Trend, 2) Liquidity Sweep (BSL/SSL), 3) Key .00 / .50 Round Number reaction, and 4) Running candle rejection between seconds 15-45. Never risk more than 1% per contract.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = isBn
    ? [
        "মার্টিনগেল কেন অ্যাকাউন্টের নিশ্চিত ধ্বংস ডেকে আনে?",
        "৩-ক্যান্ডেল বিয়ারিশ FVG মেকানিজম কীভাবে কাজ করে?",
        "OTC অ্যালগরিদম কীভাবে .00 লেভেলে ব্রেকআউট ট্র্যাপ তৈরি করে?",
        "ব্লুপ্রিন্ট সেটআপ ১ এর প্রধান এন্ট্রি শর্ত কী?",
      ]
    : [
        "Why does Martingale mathematically guarantee bankruptcy?",
        "Explain the 3-Candle Bearish FVG mechanism.",
        "How does the OTC algorithm trap breakout traders at .00 levels?",
        "What are the 3 entry triggers for Blueprint Setup 1?",
      ];

  return (
    <div
      className={`fixed transition-all duration-200 ${
        isOpen
          ? "inset-x-0 bottom-16 md:bottom-0 md:inset-auto md:right-4 md:w-[480px] h-[80vh] md:h-[560px] z-50"
          : "hidden md:block bottom-0 right-4 w-[480px] h-12 z-40"
      }`}
    >
      <div
        className={`flex flex-col h-full bg-[#111827] shadow-2xl overflow-hidden transition-all ${
          isOpen
            ? "rounded-t-2xl border-t border-x border-cyan-500/40"
            : "rounded-t-xl border-x border-t border-[#1F2937]"
        }`}
      >
        {/* Header Bar */}
        <div
          onClick={onToggle}
          className="flex items-center justify-between px-3.5 py-2.5 md:px-4 md:py-3 bg-[#0F172A] border-b border-[#1F2937] cursor-pointer select-none gap-3"
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative">
              <div className="p-1.5 rounded-lg bg-cyan-950/70 text-cyan-400 border border-cyan-700/60 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0F172A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-gray-100 tracking-wider font-mono">
                  {t("mentorTitle")}
                </h4>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-xs font-mono font-bold border border-cyan-800/60">
                  {t("activeStatus")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            {isOpen ? (
              <span className="flex items-center gap-1 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-700/40">
                <ChevronDown className="w-4 h-4" />
                <span className="sm:hidden">Close</span>
              </span>
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Chat Body */}
        {isOpen && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#0A0A0B]">
            {/* Quick Prompt Pills */}
            <div className="p-2.5 bg-[#111827] border-b border-[#1F2937] overflow-x-auto no-scrollbar flex items-center gap-2 touch-pan-x">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  id={`quick-prompt-${idx}`}
                  onClick={() => handleSend(qp)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#0A0A0B] hover:bg-gray-800 text-gray-300 border border-[#1F2937] text-xs font-medium transition-colors cursor-pointer"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto no-scrollbar md:custom-scrollbar space-y-3.5 text-xs sm:text-sm"
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="p-2 rounded-lg bg-cyan-950/70 text-cyan-400 h-fit mt-0.5 border border-cyan-800/60 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] p-3.5 rounded-xl leading-relaxed border ${
                      m.role === "user"
                        ? "bg-cyan-600 border-cyan-400 text-white rounded-br-none shadow-md"
                        : "bg-[#111827] border-[#1F2937] text-gray-200 rounded-bl-none shadow-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    <span className="text-xs opacity-60 block mt-2 text-right font-mono">
                      {m.timestamp}
                    </span>
                  </div>

                  {m.role === "user" && (
                    <div className="p-2 rounded-lg bg-[#111827] text-gray-300 h-fit mt-0.5 border border-[#1F2937] shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="p-2 rounded-lg bg-cyan-950/70 text-cyan-400 h-fit mt-0.5 border border-cyan-800/60 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-lg bg-[#111827] border border-[#1F2937] text-gray-300 flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{isBn ? "প্রাতিষ্ঠানিক অর্ডার ফ্লো বিশ্লেষণ করা হচ্ছে..." : "Analyzing institutional order flow..."}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-[#111827] border-t border-[#1F2937]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  id="mentor-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("askMentorPlaceholder")}
                  className="flex-1 px-3.5 py-2.5 bg-[#0A0A0B] border border-[#1F2937] rounded-lg text-xs sm:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  id="send-mentor-chat-btn"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-[#0A0A0B] disabled:text-gray-600 text-white border border-cyan-400 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
