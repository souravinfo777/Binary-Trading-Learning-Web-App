import React, { useState, useRef } from "react";
import { ChapterVisualModel } from "../data/chapterVisuals";
import { useLanguage } from "../context/LanguageContext";
import { CandleHoverInspector } from "./CandleHoverInspector";
import { computeCandleMetrics } from "../utils/candleMetrics";
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  Crosshair,
  Eye,
  Info,
  Layers,
  Lock,
  Play,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

interface ChapterVisualExampleProps {
  visual: ChapterVisualModel;
}

export const ChapterVisualExample: React.FC<ChapterVisualExampleProps> = ({
  visual,
}) => {
  const { isBn } = useLanguage();
  const [selectedCandleIdx, setSelectedCandleIdx] = useState<number>(
    visual.candles.find((c) => c.isKeyAction)?.index || visual.candles[0]?.index || 1
  );
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [hoveredCandleIdx, setHoveredCandleIdx] = useState<number | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<number>(0);
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);

  const minPrice = Math.min(
    ...visual.candles.map((c) => c.low),
    ...(visual.annotations.map((a) => a.price || a.priceBottom || 999999).filter(p => p < 999999))
  );
  const maxPrice = Math.max(
    ...visual.candles.map((c) => c.high),
    ...(visual.annotations.map((a) => a.price || a.priceTop || 0).filter(p => p > 0))
  );

  const pricePadding = (maxPrice - minPrice) * 0.15 || 0.001;
  const chartMin = minPrice - pricePadding;
  const chartMax = maxPrice + pricePadding;
  const priceRange = chartMax - chartMin || 0.001;

  const svgWidth = 640;
  const svgHeight = 240;
  const padLeft = 45;
  const padRight = 75;
  const padTop = 25;
  const padBottom = 35;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const getY = (price: number) => {
    return padTop + plotHeight * (1 - (price - chartMin) / priceRange);
  };

  const candleSpacing = plotWidth / visual.candles.length;

  const selectedCandle =
    visual.candles.find((c) => c.index === selectedCandleIdx) ||
    visual.candles[0];

  const activeCandle =
    (hoveredCandleIdx !== null
      ? visual.candles.find((c) => c.index === hoveredCandleIdx)
      : null) || selectedCandle;

  return (
    <div className="flex flex-col bg-[#07090E] rounded-xl border border-[#1E293B] overflow-hidden shadow-2xl space-y-0">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3.5 bg-[#0B0F17] border-b border-[#1E293B]">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-700/50 shadow-inner shrink-0">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-gray-100 text-xs sm:text-base tracking-wide font-mono flex items-center gap-1.5 truncate">
                <span>{isBn ? "১-মিনিট ক্যান্ডেলস্টিক এক্সাম্পল" : "1M CANDLESTICK EXAMPLE"}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] sm:text-xs bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold shrink-0">
                  60s TF
                </span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 font-medium truncate">
              {isBn ? visual.titleBn : visual.titleEn}
            </p>
          </div>
        </div>

        {/* Expected Action Chip */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-[#0F172A] border border-[#1E293B] text-[11px] sm:text-sm font-mono font-medium">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            <span className="text-gray-200">{visual.pair}</span>
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-sm font-mono font-bold shadow-md ${
              visual.tradeType === "CALL"
                ? "bg-emerald-950 text-emerald-300 border border-emerald-500/60 glow-emerald"
                : visual.tradeType === "PUT"
                ? "bg-rose-950 text-rose-300 border border-rose-500/60 glow-rose"
                : "bg-amber-950 text-amber-300 border border-amber-500/60 glow-amber"
            }`}
          >
            {visual.tradeType === "CALL" ? (
              <ArrowUpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : visual.tradeType === "PUT" ? (
              <ArrowDownCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
            <span>
              {isBn
                ? visual.tradeType === "CALL"
                  ? "কল (CALL)"
                  : visual.tradeType === "PUT"
                  ? "পুট (PUT)"
                  : "নো ট্রেড"
                : `${visual.tradeType}`}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart Stage */}
      <div ref={chartWrapperRef} className="relative w-full bg-[#05070D] p-1.5 sm:p-4 border-b border-[#1E293B]">
        <div className="w-full overflow-x-auto no-scrollbar md:custom-scrollbar touch-pan-x relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            onMouseLeave={() => setHoveredCandleIdx(null)}
            className="w-full h-auto select-none block min-w-[340px] sm:min-w-0"
          >
            {/* Background Grid Lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
              const y = padTop + plotHeight * ratio;
              const price = chartMax - ratio * priceRange;
              return (
                <g key={idx}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke="#1E293B"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={svgWidth - padRight + 6}
                    y={y + 3}
                    fill="#64748B"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {price.toFixed(4)}
                  </text>
                </g>
              );
            })}

            {/* Render Annotation Zones Shading (Background Layer) */}
            {visual.annotations.map((ann, idx) => {
              if (ann.type === "zone" && ann.priceTop && ann.priceBottom) {
                const yTop = getY(ann.priceTop);
                const yBottom = getY(ann.priceBottom);
                const height = Math.abs(yBottom - yTop);
                const colorHex =
                  ann.color === "cyan"
                    ? "#06B6D4"
                    : ann.color === "emerald"
                    ? "#10B981"
                    : ann.color === "rose"
                    ? "#F43F5E"
                    : "#F59E0B";

                return (
                  <rect
                    key={`zone-bg-${idx}`}
                    x={padLeft}
                    y={Math.min(yTop, yBottom)}
                    width={plotWidth}
                    height={Math.max(4, height)}
                    fill={colorHex}
                    fillOpacity="0.16"
                    stroke={colorHex}
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                );
              }
              if (ann.type === "line" && ann.price) {
                const y = getY(ann.price);
                const colorHex =
                  ann.color === "cyan"
                    ? "#06B6D4"
                    : ann.color === "emerald"
                    ? "#10B981"
                    : ann.color === "rose"
                    ? "#F43F5E"
                    : "#F59E0B";

                return (
                  <line
                    key={`line-${idx}`}
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke={colorHex}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                );
              }
              return null;
            })}

            {/* Render 1-Minute Candlesticks */}
            {visual.candles.map((candle, idx) => {
              const cx = padLeft + idx * candleSpacing + candleSpacing / 2;
              const yOpen = getY(candle.open);
              const yClose = getY(candle.close);
              const yHigh = getY(candle.high);
              const yLow = getY(candle.low);

              const isBullish = candle.close >= candle.open;
              const isSelected = candle.index === selectedCandleIdx;
              const isHovered = candle.index === hoveredCandleIdx;
              const isKeyAction = candle.isKeyAction;

              const candleColor = isBullish ? "#10B981" : "#F43F5E";
              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));
              const candleWidth = Math.min(36, candleSpacing * 0.65);

              return (
                <g
                  key={candle.index}
                  className="cursor-pointer transition-transform group/candle"
                  onMouseEnter={() => setHoveredCandleIdx(candle.index)}
                  onClick={() => {
                    setSelectedCandleIdx(candle.index);
                    setIsInspectorOpen(true);
                  }}
                >
                  {/* Active or Hover highlight pillar */}
                  {(isSelected || isHovered) && (
                    <rect
                      x={cx - candleSpacing / 2 + 2}
                      y={padTop}
                      width={candleSpacing - 4}
                      height={plotHeight}
                      fill={isHovered ? "#38BDF8" : "#06B6D4"}
                      fillOpacity={isHovered ? "0.14" : "0.08"}
                      stroke={isHovered ? "#38BDF8" : "#06B6D4"}
                      strokeWidth={isHovered ? "1.5" : "1"}
                      strokeDasharray="2 2"
                      rx="4"
                    />
                  )}

                  {/* High - Low Wick */}
                  <line
                    x1={cx}
                    y1={yHigh}
                    x2={cx}
                    y2={yLow}
                    stroke={candleColor}
                    strokeWidth={isSelected || isHovered ? "2.2" : "1.5"}
                  />

                  {/* Candle Body */}
                  <rect
                    x={cx - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={candleColor}
                    stroke={isSelected || isHovered ? "#38BDF8" : candleColor}
                    strokeWidth={isSelected || isHovered ? "2" : "1"}
                    rx="1.5"
                    className="filter drop-shadow-md"
                  />

                  {/* Key Action Glowing Beacon / Callout */}
                  {isKeyAction && (
                    <g>
                      <circle
                        cx={cx}
                        y={isBullish ? yLow + 12 : yHigh - 12}
                        r="4"
                        fill={isBullish ? "#10B981" : "#F43F5E"}
                        className="animate-ping"
                        opacity="0.75"
                      />
                      <rect
                        x={cx - 30}
                        y={isBullish ? yLow + 8 : yHigh - 22}
                        width="60"
                        height="16"
                        rx="4"
                        fill="#000000"
                        stroke={isBullish ? "#10B981" : "#F43F5E"}
                        strokeWidth="1.5"
                      />
                      <text
                        x={cx}
                        y={isBullish ? yLow + 20 : yHigh - 10}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {candle.actionType || "ENTRY"}
                      </text>
                    </g>
                  )}

                  {/* 1-Minute Number & Timestamp Label below candle */}
                  <text
                    x={cx}
                    y={svgHeight - 18}
                    textAnchor="middle"
                    fill={isSelected || isHovered ? "#38BDF8" : "#94A3B8"}
                    fontSize="9"
                    fontWeight={isSelected || isHovered ? "bold" : "normal"}
                    fontFamily="monospace"
                  >
                    C#{candle.index}
                  </text>
                  <text
                    x={cx}
                    y={svgHeight - 7}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {candle.time}
                  </text>
                </g>
              );
            })}

            {/* Render Annotation Badges & Text Labels OVERLAY (Top Layer - White text above zones) */}
            {visual.annotations.map((ann, idx) => {
              if (ann.type === "zone" && ann.priceTop && ann.priceBottom) {
                const yTop = getY(ann.priceTop);
                const yBottom = getY(ann.priceBottom);
                const zoneMinY = Math.min(yTop, yBottom);
                const colorHex =
                  ann.color === "cyan"
                    ? "#06B6D4"
                    : ann.color === "emerald"
                    ? "#10B981"
                    : ann.color === "rose"
                    ? "#F43F5E"
                    : "#F59E0B";

                const textLabel = isBn ? ann.labelBn : ann.labelEn;
                const approxWidth = Math.min(svgWidth - padRight - padLeft - 20, Math.max(160, textLabel.length * 9.2 + 28));
                // Position tag above zone top edge; if too close to SVG top, position just below top edge
                const badgeY = zoneMinY > padTop + 22 ? zoneMinY - 20 : zoneMinY + 4;

                return (
                  <g key={`zone-label-${idx}`} className="pointer-events-none select-none">
                    <rect
                      x={padLeft + 8}
                      y={badgeY}
                      width={approxWidth}
                      height={19}
                      rx="4"
                      fill="#000000"
                      stroke={colorHex}
                      strokeWidth="1.5"
                      fillOpacity="0.96"
                    />
                    <text
                      x={padLeft + 16}
                      y={badgeY + 13}
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {textLabel}
                    </text>
                  </g>
                );
              }
              if (ann.type === "line" && ann.price) {
                const y = getY(ann.price);
                const colorHex =
                  ann.color === "cyan"
                    ? "#06B6D4"
                    : ann.color === "emerald"
                    ? "#10B981"
                    : ann.color === "rose"
                    ? "#F43F5E"
                    : "#F59E0B";

                const textLabel = isBn ? ann.labelBn : ann.labelEn;
                const approxWidth = Math.min(svgWidth - padRight - padLeft - 20, Math.max(140, textLabel.length * 8.5 + 24));

                return (
                  <g key={`line-label-${idx}`} className="pointer-events-none select-none">
                    <rect
                      x={svgWidth - padRight - approxWidth - 10}
                      y={y - 20 > padTop ? y - 20 : y + 4}
                      width={approxWidth}
                      height={19}
                      rx="4"
                      fill="#000000"
                      stroke={colorHex}
                      strokeWidth="1.5"
                      fillOpacity="0.96"
                    />
                    <text
                      x={svgWidth - padRight - approxWidth / 2 - 10}
                      y={y - 20 > padTop ? y - 6 : y + 18}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {textLabel}
                    </text>
                  </g>
                );
              }
              return null;
            })}

            {/* Hover/Active Crosshair Tracking & Floating Candle Tooltip (Top Layer - Always in front of candles) */}
            {activeCandle && (
              (() => {
                const candleIdxInArray = visual.candles.findIndex((c) => c.index === activeCandle.index);
                const cx = padLeft + candleIdxInArray * candleSpacing + candleSpacing / 2;
                const cy = getY(activeCandle.close);
                const isBull = activeCandle.close >= activeCandle.open;
                const highY = getY(activeCandle.high);
                const tipY = Math.max(padTop + 24, highY - 10);

                return (
                  <g className="pointer-events-none select-none">
                    {/* Vertical Crosshair */}
                    <line
                      x1={cx}
                      y1={padTop}
                      x2={cx}
                      y2={padTop + plotHeight}
                      stroke="#06B6D4"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      strokeOpacity="0.45"
                    />
                    {/* Horizontal Crosshair */}
                    <line
                      x1={padLeft}
                      y1={cy}
                      x2={svgWidth - padRight}
                      y2={cy}
                      stroke="#06B6D4"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      strokeOpacity="0.45"
                    />
                    {/* Y-Axis Price Tag */}
                    <rect
                      x={svgWidth - padRight + 2}
                      y={cy - 8}
                      width="50"
                      height="16"
                      rx="2"
                      fill="#0891B2"
                    />
                    <text
                      x={svgWidth - padRight + 27}
                      y={cy + 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {activeCandle.close.toFixed(4)}
                    </text>

                    {/* Floating Candle Tooltip Badge directly above active candle */}
                    <g transform={`translate(${Math.max(padLeft + 60, Math.min(svgWidth - padRight - 60, cx))}, ${tipY})`}>
                      <rect
                        x="-58"
                        y="-22"
                        width="116"
                        height="20"
                        rx="4"
                        fill="#050811"
                        stroke="#06B6D4"
                        strokeWidth="1.5"
                      />
                      <polygon
                        points="-4,-2 4,-2 0,2"
                        fill="#06B6D4"
                      />
                      <text
                        x="0"
                        y="-8"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        C#{activeCandle.index} {activeCandle.close.toFixed(4)} {isBull ? "▲" : "▼"}
                      </text>
                    </g>
                  </g>
                );
              })()
            )}
          </svg>

          {/* Clicked Candle Detailed Modal Inspector (Only appears on click) */}
          {isInspectorOpen && selectedCandle && (
            <div
              className="absolute inset-0 z-40 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
              onClick={() => setIsInspectorOpen(false)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <CandleHoverInspector
                  candle={selectedCandle}
                  onClose={() => setIsInspectorOpen(false)}
                  className="shadow-2xl border-cyan-400/60 ring-2 ring-cyan-500/20 max-w-[340px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Selected / Hovered Candle Telemetry HUD Bar */}
        {(() => {
          const m = computeCandleMetrics(
            activeCandle.open,
            activeCandle.high,
            activeCandle.low,
            activeCandle.close
          );
          return (
            <div className="mt-3 flex flex-col gap-2.5 p-3.5 bg-[#0B0F17] rounded-xl border border-[#1E293B] text-sm font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/60 text-xs sm:text-sm">
                    {isBn ? `ক্যান্ডেল #${activeCandle.index}` : `Candle #${activeCandle.index}`}
                  </span>
                  <span className="text-gray-300 text-xs sm:text-sm font-sans">
                    {activeCandle.time} ({isBn ? "৬০ সেকেন্ড" : "60s Bar"})
                  </span>
                  <span className="text-cyan-400 font-bold text-xs sm:text-sm">
                    {isBn ? m.patternTypeBn : m.patternType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-xs sm:text-sm font-bold ${
                      m.isBullish
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                        : "bg-rose-950 text-rose-300 border border-rose-800/60"
                    }`}
                  >
                    Δ {m.deltaPips >= 0 ? `+${m.deltaPips.toFixed(1)}` : m.deltaPips.toFixed(1)} pts ({(m.deltaPercent).toFixed(2)}%)
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCandleIdx(activeCandle.index);
                      setIsInspectorOpen(true);
                    }}
                    className="px-2.5 py-1 rounded text-xs sm:text-sm bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 transition-colors flex items-center gap-1 font-mono font-semibold cursor-pointer"
                    title={isBn ? "বিস্তারিত কার্ড দেখুন" : "View Breakdown Card"}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isBn ? "বিস্তারিত কার্ড" : "Card"}</span>
                  </button>
                </div>
              </div>

              {/* 4-Column OHLC + Quantitative Wick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1 text-xs">
                <div className="bg-[#05070D] p-2.5 rounded-lg border border-[#1E293B]">
                  <span className="text-xs text-gray-400 block font-sans font-semibold">OPEN</span>
                  <span className="font-bold text-gray-100 text-xs sm:text-sm">{m.open.toFixed(5)}</span>
                </div>
                <div className="bg-[#05070D] p-2.5 rounded-lg border border-[#1E293B]">
                  <span className="text-xs text-emerald-400 block font-sans font-semibold">HIGH</span>
                  <span className="font-bold text-emerald-300 text-xs sm:text-sm">{m.high.toFixed(5)}</span>
                </div>
                <div className="bg-[#05070D] p-2.5 rounded-lg border border-[#1E293B]">
                  <span className="text-xs text-rose-400 block font-sans font-semibold">LOW</span>
                  <span className="font-bold text-rose-300 text-xs sm:text-sm">{m.low.toFixed(5)}</span>
                </div>
                <div className="bg-[#05070D] p-2.5 rounded-lg border border-[#1E293B]">
                  <span className="text-xs text-cyan-400 block font-sans font-semibold">CLOSE</span>
                  <span className="font-bold text-cyan-300 text-xs sm:text-sm">{m.close.toFixed(5)}</span>
                </div>
                <div className="bg-[#05070D] p-2.5 rounded-lg border border-[#1E293B]">
                  <span className="text-xs text-amber-400 block font-sans font-semibold">{isBn ? "আপার উইক" : "UPPER WICK"}</span>
                  <span className="font-bold text-gray-200 text-xs sm:text-sm">{m.upperWickPips.toFixed(1)} pts ({((m.upperWickRatio)*100).toFixed(0)}%)</span>
                </div>
                <div className="bg-[#05070D] p-2.5 rounded-lg border border-[#1E293B]">
                  <span className="text-xs text-cyan-400 block font-sans font-semibold">{isBn ? "লোয়ার উইক" : "LOWER WICK"}</span>
                  <span className="font-bold text-gray-200 text-xs sm:text-sm">{m.lowerWickPips.toFixed(1)} pts ({((m.lowerWickRatio)*100).toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Step-by-Step Educational Breakdown Grid */}
      <div className="p-4 sm:p-5 bg-[#090D16] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-cyan-300 font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              {isBn
                ? "১-মিনিট ক্যান্ডেল বাই ক্যান্ডেল প্রাতিষ্ঠানিক ব্যাখ্যা"
                : "1-Minute Candle-by-Candle Institutional Mechanics"}
            </span>
          </h4>
          <span className="text-xs sm:text-sm font-mono text-gray-300">
            {isBn ? "ক্লিক করে প্রতিটি ১-মিনিট ক্যান্ডেল দেখুন" : "Click candle on chart to inspect"}
          </span>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {visual.steps.map((step, idx) => {
            const isTarget = step.candleIndex === selectedCandleIdx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedCandleIdx(step.candleIndex)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isTarget
                    ? "bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/40"
                    : "bg-[#0B0F17] border-[#1E293B] hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs sm:text-sm font-mono font-bold px-2.5 py-0.5 rounded ${
                      isTarget
                        ? "bg-cyan-500 text-slate-950"
                        : "bg-[#07090E] text-cyan-400 border border-cyan-900/60"
                    }`}
                  >
                    {step.candleName}
                  </span>
                  <span className="text-xs font-mono text-gray-400">60s CYCLE</span>
                </div>

                <p className="text-sm sm:text-base text-gray-100 font-medium leading-relaxed mb-2.5">
                  {isBn ? step.whatHappenedBn : step.whatHappenedEn}
                </p>

                <div className="pt-2.5 border-t border-[#1E293B] text-xs sm:text-sm text-gray-300 leading-relaxed">
                  <span className="text-amber-400 font-semibold">
                    {isBn ? "কেন এটি ঘটল: " : "Order Flow Reason: "}
                  </span>
                  {isBn ? step.orderFlowReasonBn : step.orderFlowReasonEn}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Key Execution Axioms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {/* Execution Key Rule */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
            <div>
              <span className="font-bold uppercase tracking-wider text-xs sm:text-sm text-emerald-400 block mb-1 font-mono">
                {isBn ? "এক্সিকিউশন চাবিকাঠি ও এজ (Execution Edge):" : "Execution Edge & Axiom:"}
              </span>
              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                {isBn ? visual.executionKeyBn : visual.executionKeyEn}
              </p>
            </div>
          </div>

          {/* Safety Margin Tip */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
            <div>
              <span className="font-bold uppercase tracking-wider text-xs sm:text-sm text-cyan-400 block mb-1 font-mono">
                {isBn ? "সেফটি মার্জিন ও টাইমিং টিপ (Margin of Safety):" : "Margin of Safety & Timing Tip:"}
              </span>
              <p className="text-sm sm:text-base text-cyan-100 leading-relaxed">
                {isBn ? visual.safetyMarginTipBn : visual.safetyMarginTipEn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
