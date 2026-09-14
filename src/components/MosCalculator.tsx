import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Calculator, Sparkles, ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";

interface PresetData {
  nameEn: string;
  nameBn: string;
  prevOpen: number;
  prevHigh: number;
  prevLow: number;
  prevClose: number;
  currOpen: number;
  currClose: number;
  direction: "CALL" | "PUT";
}

const PRESETS: PresetData[] = [
  {
    nameEn: "EUR/USD Strong Breakout Candle (50% Retest)",
    nameBn: "EUR/USD স্ট্রং ব্রেকআউট ক্যান্ডেল (৫০% রিটেস্ট)",
    prevOpen: 1.08450,
    prevHigh: 1.08570,
    prevLow: 1.08440,
    prevClose: 1.08550,
    currOpen: 1.08550,
    currClose: 1.08560,
    direction: "CALL",
  },
  {
    nameEn: "GBP/USD Valid Engulfing (130% Ratio)",
    nameBn: "GBP/USD ভ্যালিড এনগালফিং (১৩০% অনুপাত)",
    prevOpen: 1.27400,
    prevHigh: 1.27430,
    prevLow: 1.27360,
    prevClose: 1.27370,
    currOpen: 1.27370,
    currClose: 1.27440,
    direction: "CALL",
  },
  {
    nameEn: "USD/JPY Exhaustion Climax Trap (320% Giant)",
    nameBn: "USD/JPY একজশন ক্লাইম্যাক্স ট্র্যাপ (৩২০% বিশাল)",
    prevOpen: 154.500,
    prevHigh: 154.550,
    prevLow: 154.480,
    prevClose: 154.540,
    currOpen: 154.540,
    currClose: 154.800,
    direction: "PUT",
  },
  {
    nameEn: "AUD/CAD Bearish Dark Cloud (50% Penetration)",
    nameBn: "AUD/CAD বেয়ারিশ ডার্ক ক্লাউড (৫০% পেনিট্রেশন)",
    prevOpen: 0.89100,
    prevHigh: 0.89250,
    prevLow: 0.89090,
    prevClose: 0.89230,
    currOpen: 0.89240,
    currClose: 0.89150,
    direction: "PUT",
  },
];

export const MosCalculator: React.FC = () => {
  const { isBn } = useLanguage();

  const [prevOpen, setPrevOpen] = useState(1.08450);
  const [prevHigh, setPrevHigh] = useState(1.08570);
  const [prevLow, setPrevLow] = useState(1.08440);
  const [prevClose, setPrevClose] = useState(1.08550);
  const [currOpen, setCurrOpen] = useState(1.08550);
  const [currClose, setCurrClose] = useState(1.08560);
  const [tradeDirection, setTradeDirection] = useState<"CALL" | "PUT">("CALL");

  const loadPreset = (preset: PresetData) => {
    setPrevOpen(preset.prevOpen);
    setPrevHigh(preset.prevHigh);
    setPrevLow(preset.prevLow);
    setPrevClose(preset.prevClose);
    setCurrOpen(preset.currOpen);
    setCurrClose(preset.currClose);
    setTradeDirection(preset.direction);
  };

  // Calculations
  const prevBody = Math.abs(prevClose - prevOpen);
  const prevRange = Math.max(0.00001, prevHigh - prevLow);
  const prevIsBullish = prevClose >= prevOpen;

  const golden50Level = (prevOpen + prevClose) / 2;
  const golden50Pips = (golden50Level * 10000).toFixed(1);

  const currBody = Math.abs(currClose - currOpen);
  const engulfingRatio = prevBody > 0 ? (currBody / prevBody) * 100 : 100;

  // Margin of Safety calculation
  const mosBufferPips = Math.abs(currOpen - golden50Level) * 10000;

  // Engulfing status
  let engulfingStatus: "optimal" | "weak" | "exhaustion" = "optimal";
  if (engulfingRatio < 51) {
    engulfingStatus = "weak";
  } else if (engulfingRatio > 200) {
    engulfingStatus = "exhaustion";
  }

  // Visual SVG coordinates
  const minPrice = Math.min(prevLow, prevOpen, prevClose, currOpen, currClose, golden50Level) - 0.0001;
  const maxPrice = Math.max(prevHigh, prevOpen, prevClose, currOpen, currClose, golden50Level) + 0.0001;
  const priceRange = Math.max(0.0002, maxPrice - minPrice);

  const getY = (price: number) => {
    return 190 - ((price - minPrice) / priceRange) * 160;
  };

  const c1OpenY = getY(prevOpen);
  const c1CloseY = getY(prevClose);
  const c1HighY = getY(prevHigh);
  const c1LowY = getY(prevLow);
  const c1TopY = Math.min(c1OpenY, c1CloseY);
  const c1Height = Math.max(4, Math.abs(c1CloseY - c1OpenY));

  const c2OpenY = getY(currOpen);
  const c2CloseY = getY(currClose);
  const c2TopY = Math.min(c2OpenY, c2CloseY);
  const c2Height = Math.max(4, Math.abs(c2CloseY - c2OpenY));

  const golden50Y = getY(golden50Level);

  return (
    <div className="p-5 sm:p-6 bg-[#0E131F] rounded-xl border border-[#1E293B] shadow-xl space-y-6 text-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>{isBn ? "ইন্টারেক্টিভ ক্যালকুলেটর" : "INTERACTIVE QUANT CALCULATOR"}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-100 mt-1">
            {isBn ? "৫০% গোল্ডেন লেভেল ও মার্জিন অফ সেফটি (MOS) ক্যালকুলেটর" : "50% Golden Level & Margin of Safety (MOS) Engine"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isBn
              ? "পূর্ববর্তী ক্যান্ডেলের ৫০% মিডপয়েন্ট এবং সঠিক এন্ট্রি সেফটি বাফার গণনা করুন"
              : "Compute prior candle equilibrium, valid engulfing ratio (51-149%), and flat Doji protection"}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(p)}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-[#1A2234] hover:bg-cyan-900/60 border border-[#2D3748] hover:border-cyan-500/60 text-gray-300 hover:text-cyan-200 transition-colors"
            >
              {isBn ? p.nameBn.split("(")[0] : p.nameEn.split("(")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs vs Visual Diagram vs Math Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form (4 cols) */}
        <div className="lg:col-span-4 space-y-4 p-4 rounded-lg bg-[#070A12] border border-[#1E293B]">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            {isBn ? "১. ক্যান্ডেল ডাটা ইনপুট" : "1. CANDLESTICK DATA INPUT"}
          </span>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-gray-400 block mb-1">{isBn ? "পূর্ববর্তী ওপেন" : "Prev Open"}</label>
              <input
                type="number"
                step="0.0001"
                value={prevOpen}
                onChange={(e) => setPrevOpen(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded bg-[#111827] border border-[#2A374A] text-cyan-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">{isBn ? "পূর্ববর্তী ক্লোজ" : "Prev Close"}</label>
              <input
                type="number"
                step="0.0001"
                value={prevClose}
                onChange={(e) => setPrevClose(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded bg-[#111827] border border-[#2A374A] text-cyan-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">{isBn ? "পূর্ববর্তী হাই" : "Prev High"}</label>
              <input
                type="number"
                step="0.0001"
                value={prevHigh}
                onChange={(e) => setPrevHigh(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded bg-[#111827] border border-[#2A374A] text-gray-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">{isBn ? "পূর্ববর্তী লো" : "Prev Low"}</label>
              <input
                type="number"
                step="0.0001"
                value={prevLow}
                onChange={(e) => setPrevLow(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded bg-[#111827] border border-[#2A374A] text-gray-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E293B]">
            <span className="text-xs font-mono font-bold text-gray-300 block mb-2">
              {isBn ? "চলতি ক্যান্ডেল প্যারামিটার" : "Running Candle Parameters"}
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-gray-400 block mb-1">{isBn ? "চলতি ওপেন" : "Curr Open"}</label>
                <input
                  type="number"
                  step="0.0001"
                  value={currOpen}
                  onChange={(e) => setCurrOpen(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded bg-[#111827] border border-[#2A374A] text-emerald-300 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">{isBn ? "চলতি ক্লোজ" : "Curr Close"}</label>
                <input
                  type="number"
                  step="0.0001"
                  value={currClose}
                  onChange={(e) => setCurrClose(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded bg-[#111827] border border-[#2A374A] text-emerald-300 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setTradeDirection("CALL")}
              className={`flex-1 py-1.5 rounded text-xs font-bold font-mono transition-all ${
                tradeDirection === "CALL"
                  ? "bg-emerald-600 text-white shadow-md border border-emerald-400"
                  : "bg-[#111827] text-gray-400 hover:text-gray-200 border border-[#2A374A]"
              }`}
            >
              CALL ↑
            </button>
            <button
              type="button"
              onClick={() => setTradeDirection("PUT")}
              className={`flex-1 py-1.5 rounded text-xs font-bold font-mono transition-all ${
                tradeDirection === "PUT"
                  ? "bg-rose-600 text-white shadow-md border border-rose-400"
                  : "bg-[#111827] text-gray-400 hover:text-gray-200 border border-[#2A374A]"
              }`}
            >
              PUT ↓
            </button>
          </div>
        </div>

        {/* Center: Live Interactive SVG Visualizer (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-lg bg-[#05070D] border border-[#1E293B] flex flex-col items-center justify-between min-h-[300px]">
          <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 border-b border-[#1E293B] pb-2">
            <span>{isBn ? "ভিজ্যুয়াল ক্যান্ডেলস্টিক ম্যাপ" : "VISUAL CANDLESTICK MAP"}</span>
            <span className="text-amber-400 font-bold">50% Line = {golden50Level.toFixed(5)}</span>
          </div>

          <div className="w-full my-auto flex items-center justify-center">
            <svg viewBox="0 0 280 200" className="w-full max-w-[260px] h-[190px] select-none">
              {/* Grid lines */}
              <line x1="20" y1="30" x2="260" y2="30" stroke="#1E293B" strokeDasharray="3,3" />
              <line x1="20" y1="110" x2="260" y2="110" stroke="#1E293B" strokeDasharray="3,3" />
              <line x1="20" y1="180" x2="260" y2="180" stroke="#1E293B" strokeDasharray="3,3" />

              {/* 50% Golden Line */}
              <line
                x1="30"
                y1={golden50Y}
                x2="250"
                y2={golden50Y}
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <text x="252" y={golden50Y + 3} fill="#F59E0B" fontSize="9" fontFamily="monospace" textAnchor="start">
                50%
              </text>

              {/* Candle 1 (Prev) */}
              <g className="transition-all duration-200">
                {/* Wicks */}
                <line x1="90" y1={c1HighY} x2="90" y2={c1LowY} stroke={prevIsBullish ? "#10B981" : "#F43F5E"} strokeWidth="2" />
                {/* Body */}
                <rect
                  x="72"
                  y={c1TopY}
                  width="36"
                  height={c1Height}
                  fill={prevIsBullish ? "#10B981" : "#F43F5E"}
                  rx="2"
                  stroke={prevIsBullish ? "#059669" : "#E11D48"}
                />
                <text x="90" y="195" fill="#9CA3AF" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  C1 (Prev)
                </text>
              </g>

              {/* Candle 2 (Running / Target) */}
              <g className="transition-all duration-200">
                {/* Wicks */}
                <line x1="180" y1={Math.min(c2TopY - 10, golden50Y)} x2="180" y2={c2TopY + c2Height + 10} stroke="#06B6D4" strokeWidth="2" />
                {/* Body */}
                <rect
                  x="162"
                  y={c2TopY}
                  width="36"
                  height={c2Height}
                  fill="#06B6D4"
                  fillOpacity="0.85"
                  rx="2"
                  stroke="#22D3EE"
                />
                {/* MOS Entry Dot */}
                <circle cx="180" cy={golden50Y} r="4" fill="#F59E0B" stroke="#000" strokeWidth="1" />
                <text x="180" y="195" fill="#22D3EE" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  C2 (MOS)
                </text>
              </g>
            </svg>
          </div>

          <div className="w-full text-center text-[10px] font-mono text-gray-400 bg-[#0E131F] py-1 rounded border border-[#1E293B]">
            <span className="text-amber-400 font-bold">● {isBn ? "হলুদ ডট = মার্জিন অফ সেফটি এন্ট্রি পয়েন্ট" : "Yellow Dot = Optimal MOS Retest Point"}</span>
          </div>
        </div>

        {/* Right: Mathematical Metrics & Verification (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            {isBn ? "২. কোয়ান্ট রেজাল্ট ও অ্যানালাইসিস" : "2. QUANT EVALUATION & METRICS"}
          </span>

          {/* 50% Golden Level Card */}
          <div className="p-3.5 rounded-lg bg-[#0E1726] border border-cyan-800/40 space-y-1.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 font-bold">
                {isBn ? "৫০% গোল্ডেন মিডপয়েন্ট লেভেল" : "50% Golden Midpoint Level"}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold">
                {golden50Level.toFixed(5)}
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {isBn
                ? `পূর্ববর্তী ক্যান্ডেলের মোট বডি রেঞ্জ ${(prevBody * 10000).toFixed(1)} পয়েন্ট। এই লেভেলটি অ্যালগরিদমিক রিটেস্টের প্রধান সাপোর্ট।`
                : `Prior candle body span is ${(prevBody * 10000).toFixed(1)} pts. The 50% line acts as strong dynamic retest support.`}
            </p>
          </div>

          {/* Engulfing Ratio Badge */}
          <div className={`p-3.5 rounded-lg border space-y-1.5 shadow-md ${
            engulfingStatus === "optimal"
              ? "bg-emerald-950/30 border-emerald-700/60 text-emerald-200"
              : engulfingStatus === "exhaustion"
              ? "bg-rose-950/30 border-rose-700/60 text-rose-200"
              : "bg-amber-950/30 border-amber-700/60 text-amber-200"
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold">
                {isBn ? "এনগালফিং অনুপাত (Engulfing Ratio)" : "Engulfing Ratio"}
              </span>
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-black/40">
                {engulfingRatio.toFixed(1)}%
              </span>
            </div>

            <div className="text-xs leading-relaxed">
              {engulfingStatus === "optimal" && (
                <div className="flex items-start gap-1.5 text-emerald-300">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>
                    {isBn
                      ? "A+ গোল্ডেন জোন (৫১% - ১৪৯%): নিখুঁত মোমেন্টাম কন্টিনিউয়েশন সংকেত।"
                      : "A+ Golden Range (51% - 149%): Ideal momentum continuation signal."}
                  </span>
                </div>
              )}
              {engulfingStatus === "exhaustion" && (
                <div className="flex items-start gap-1.5 text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>
                    {isBn
                      ? "সতর্কতা (>২০০%): একজশন ক্লাইম্যাক্স ট্র্যাপ! কন্টিনিউয়েশন বাদ দিয়ে রিভার্সাল খুঁজুন।"
                      : "DANGER (>200%): Exhaustion Climax Trap! High risk of immediate reversal."}
                  </span>
                </div>
              )}
              {engulfingStatus === "weak" && (
                <div className="flex items-start gap-1.5 text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>
                    {isBn
                      ? "দুর্বল বডি (<৫১%): অসম্পূর্ণ এনগালফিং বা ইনডিসিশন।"
                      : "Weak Body (<51%): Incomplete engulfing or range indecision."}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Margin of Safety (MOS) Edge Box */}
          <div className="p-3.5 rounded-lg bg-[#0F1420] border border-[#243044] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-200">
              <span>{isBn ? "মার্জিন অফ সেফটি বাফার" : "Margin of Safety Buffer"}</span>
              <span className="text-amber-400">+{mosBufferPips.toFixed(1)} Pts</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {isBn
                ? `০০:০০ ওপেন প্রাইসের বদলে ৫০% লেভেলে (${golden50Level.toFixed(5)}) এন্ট্রি নিলে আপনার ট্রেড ফ্ল্যাট ডোজি হলেও উইন (ITM) হবে।`
                : `Entering at the 50% line (${golden50Level.toFixed(5)}) instead of raw 00:00 open protects against flat Doji losses and provides a +${mosBufferPips.toFixed(1)} pt safety edge.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
