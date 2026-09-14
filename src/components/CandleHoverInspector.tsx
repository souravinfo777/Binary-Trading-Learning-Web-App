import React from "react";
import { computeCandleMetrics, CandleMetrics } from "../utils/candleMetrics";
import { useLanguage } from "../context/LanguageContext";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  ShieldCheck,
  Target,
  Sparkles,
  X,
} from "lucide-react";

interface CandleHoverInspectorProps {
  candle: {
    index: number;
    open: number;
    high: number;
    low: number;
    close: number;
    time?: string;
    labelEn?: string;
    labelBn?: string;
    reasonEn?: string;
    reasonBn?: string;
    isKeyAction?: boolean;
    actionType?: "CALL" | "PUT" | "NO_TRADE" | string;
  };
  prevCandle?: {
    high: number;
    low: number;
  };
  compact?: boolean;
  positionStyle?: React.CSSProperties;
  className?: string;
  onClose?: () => void;
}

export const CandleHoverInspector: React.FC<CandleHoverInspectorProps> = ({
  candle,
  prevCandle,
  compact = false,
  positionStyle,
  className = "",
  onClose,
}) => {
  const { isBn } = useLanguage();
  const metrics: CandleMetrics = computeCandleMetrics(
    candle.open,
    candle.high,
    candle.low,
    candle.close,
    prevCandle?.high,
    prevCandle?.low
  );

  const isGreen = metrics.isBullish;
  const isDoji = metrics.isDoji;

  return (
    <div
      style={positionStyle}
      className={`bg-[#070B14]/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl shadow-2xl p-3 text-xs font-mono select-none z-30 transition-all ${
        compact ? "min-w-[240px] max-w-[280px]" : "min-w-[300px] max-w-[360px]"
      } ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#1E293B]">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/60 text-[10px]">
            C#{candle.index}
          </span>
          {candle.time && (
            <span className="text-gray-400 text-[10px]">{candle.time}</span>
          )}
          {candle.isKeyAction && (
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                candle.actionType === "CALL"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-700/60"
                  : candle.actionType === "PUT"
                  ? "bg-rose-950 text-rose-300 border border-rose-700/60"
                  : "bg-amber-950 text-amber-300 border border-amber-700/60"
              }`}
            >
              {candle.actionType || "KEY_ACTION"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-bold">
            {isGreen ? (
              <span className="flex items-center gap-0.5 text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{metrics.deltaPips.toFixed(1)} pts</span>
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-rose-400">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{metrics.deltaPips.toFixed(1)} pts</span>
              </span>
            )}
          </div>
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors ml-1"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Pattern Title & Strat Classification Tag */}
      <div className="mb-2.5 space-y-1.5">
        <div className="px-2 py-1 rounded bg-[#0D1527] border border-[#1E293B] flex items-center justify-between">
          <span className="text-gray-300 font-bold text-[10.5px] truncate">
            {isBn ? metrics.patternTypeBn : metrics.patternType}
          </span>
          <span
            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
              metrics.bias === "BULLISH"
                ? "text-emerald-400 bg-emerald-950/60"
                : metrics.bias === "BEARISH"
                ? "text-rose-400 bg-rose-950/60"
                : "text-amber-400 bg-amber-950/60"
            }`}
          >
            {metrics.bias}
          </span>
        </div>

        {/* The Strat Bar Classification & 50% Midpoint */}
        {metrics.stratType && (
          <div className="px-2 py-1 rounded bg-black/80 border border-gray-800 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span
                className="px-1.5 py-0.2 rounded font-extrabold text-[9px]"
                style={{
                  backgroundColor: `${metrics.stratColor}25`,
                  color: metrics.stratColor,
                  border: `1px solid ${metrics.stratColor}60`,
                }}
              >
                THE STRAT: {metrics.stratType}
              </span>
              <span className="text-gray-300 font-medium">
                {isBn ? metrics.stratNameBn : metrics.stratNameEn}
              </span>
            </div>
            {metrics.fiftyPercentLevel && (
              <span className="text-yellow-400 font-bold" title="50% Strat Midpoint Level">
                50%: {metrics.fiftyPercentLevel.toFixed(5)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quantitative OHLC 4-Column Box */}
      <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#05070D] rounded-lg border border-[#1E293B] mb-2.5">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-400 font-sans font-semibold">OPEN</span>
          <span className="text-[10.5px] text-gray-100 font-bold">{metrics.open.toFixed(5)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-emerald-400 font-sans font-semibold">HIGH</span>
          <span className="text-[10.5px] text-emerald-300 font-bold">{metrics.high.toFixed(5)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-rose-400 font-sans font-semibold">LOW</span>
          <span className="text-[10.5px] text-rose-300 font-bold">{metrics.low.toFixed(5)}</span>
        </div>
        <div className="flex flex-col">
          <span
            className={`text-[9px] font-sans font-semibold ${
              isGreen ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            CLOSE
          </span>
          <span
            className={`text-[10.5px] font-bold ${
              isGreen ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {metrics.close.toFixed(5)}
          </span>
        </div>
      </div>

      {/* Quantitative Price Action Metrics Grid */}
      <div className="space-y-1.5 text-[10px] text-gray-300 mb-2.5">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">{isBn ? "টোটাল বার রেঞ্জ:" : "Total Bar Range:"}</span>
          <span className="text-gray-200 font-bold">
            {metrics.totalRangePips.toFixed(1)} pts ({(metrics.totalRange).toFixed(5)})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">{isBn ? "ক্যান্ডেল বডি:" : "Candle Body Size:"}</span>
          <span
            className={`font-bold ${isGreen ? "text-emerald-400" : "text-rose-400"}`}
          >
            {metrics.bodySizePips.toFixed(1)} pts ({(metrics.bodyRatio * 100).toFixed(0)}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">{isBn ? "আপার উইক (সেলার্স):" : "Upper Wick (Rejection):"}</span>
          <span className="text-gray-200 font-bold">
            {metrics.upperWickPips.toFixed(1)} pts ({(metrics.upperWickRatio * 100).toFixed(0)}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">{isBn ? "লোয়ার উইক (বায়ার্স):" : "Lower Wick (Rejection):"}</span>
          <span className="text-gray-200 font-bold">
            {metrics.lowerWickPips.toFixed(1)} pts ({(metrics.lowerWickRatio * 100).toFixed(0)}%)
          </span>
        </div>
      </div>

      {/* Visual Proportion Bar (Lower Wick | Body | Upper Wick) */}
      <div className="space-y-1 mb-2.5">
        <div className="flex items-center justify-between text-[8.5px] text-gray-400 font-sans">
          <span>{isBn ? "লোয়ার উইক" : "Lower Wick"}</span>
          <span>{isBn ? "বডি" : "Body"}</span>
          <span>{isBn ? "আপার উইক" : "Upper Wick"}</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden bg-gray-900 flex border border-gray-800">
          <div
            style={{ width: `${Math.max(2, metrics.lowerWickRatio * 100)}%` }}
            className="h-full bg-cyan-600"
            title={`Lower Wick: ${(metrics.lowerWickRatio * 100).toFixed(0)}%`}
          />
          <div
            style={{ width: `${Math.max(4, metrics.bodyRatio * 100)}%` }}
            className={`h-full ${isGreen ? "bg-emerald-500" : "bg-rose-500"}`}
            title={`Body: ${(metrics.bodyRatio * 100).toFixed(0)}%`}
          />
          <div
            style={{ width: `${Math.max(2, metrics.upperWickRatio * 100)}%` }}
            className="h-full bg-amber-600"
            title={`Upper Wick: ${(metrics.upperWickRatio * 100).toFixed(0)}%`}
          />
        </div>
      </div>

      {/* Margin of Safety Recommendation for 60s Binary Options */}
      <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/40 flex items-start gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-[9.5px] leading-tight">
          <span className="text-cyan-300 font-bold block mb-0.5">
            {isBn ? "মার্জিন অফ সেফটি এন্ট্রি জোন:" : "60s Margin of Safety Zone:"}
          </span>
          <span className="text-gray-300 font-mono">
            {isBn ? metrics.marginOfSafetyZoneBn : metrics.marginOfSafetyZone}
          </span>
        </div>
      </div>

      {/* Order Flow / Chapter Context Note if present */}
      {(candle.labelEn || candle.reasonEn) && (
        <div className="mt-2 pt-2 border-t border-[#1E293B] text-[9.5px]">
          <span className="text-cyan-400 font-bold block">
            {isBn ? (candle.labelBn || candle.labelEn) : candle.labelEn}
          </span>
          <p className="text-gray-400 mt-0.5 line-clamp-2">
            {isBn ? (candle.reasonBn || candle.reasonEn) : candle.reasonEn}
          </p>
        </div>
      )}
    </div>
  );
};
