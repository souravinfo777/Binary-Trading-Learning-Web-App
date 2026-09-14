import React from "react";
import { CHAPTER_VISUALS, ChapterVisualModel } from "../data/chapterVisuals";

interface ChapterThumbnailChartProps {
  chapterId: number;
  width?: number;
  height?: number;
  className?: string;
  showPatternBadge?: boolean;
}

export const ChapterThumbnailChart: React.FC<ChapterThumbnailChartProps> = ({
  chapterId,
  width = 110,
  height = 54,
  className = "",
  showPatternBadge = false,
}) => {
  const visual: ChapterVisualModel | undefined = CHAPTER_VISUALS[chapterId];

  if (!visual || !visual.candles || visual.candles.length === 0) {
    return (
      <div
        style={{ width, height }}
        className={`bg-[#05070D] rounded border border-[#1E293B] flex items-center justify-center text-[9px] font-mono text-gray-500 ${className}`}
      >
        <span>1M CHART</span>
      </div>
    );
  }

  const { candles, annotations, tradeType } = visual;

  // Compute price bounds
  const minPrice = Math.min(
    ...candles.map((c) => c.low),
    ...(annotations.map((a) => a.price || a.priceBottom || 999999).filter((p) => p < 999999))
  );
  const maxPrice = Math.max(
    ...candles.map((c) => c.high),
    ...(annotations.map((a) => a.price || a.priceTop || 0).filter((p) => p > 0))
  );

  const pricePadding = (maxPrice - minPrice) * 0.15 || 0.001;
  const chartMin = minPrice - pricePadding;
  const chartMax = maxPrice + pricePadding;
  const priceRange = chartMax - chartMin || 0.001;

  const padLeft = 6;
  const padRight = 6;
  const padTop = 6;
  const padBottom = 6;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const getY = (price: number) => {
    return padTop + plotHeight * (1 - (price - chartMin) / priceRange);
  };

  const candleSpacing = plotWidth / candles.length;

  // Extract key action pattern name
  const keyCandle = candles.find((c) => c.isKeyAction) || candles[candles.length - 1];

  return (
    <div className={`relative flex flex-col shrink-0 ${className}`}>
      <div
        style={{ width, height }}
        className="relative bg-[#05070D] rounded-md border border-[#1E293B] group-hover:border-cyan-500/50 transition-colors overflow-hidden shadow-inner group/thumb select-none"
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
        >
          {/* Subtle Grid horizontal line */}
          <line
            x1={padLeft}
            y1={padTop + plotHeight * 0.5}
            x2={width - padRight}
            y2={padTop + plotHeight * 0.5}
            stroke="#1E293B"
            strokeDasharray="2 2"
            strokeWidth="0.8"
          />

          {/* Zones or S/R Lines */}
          {annotations.map((ann, idx) => {
            if (ann.type === "zone" && ann.priceTop && ann.priceBottom) {
              const yTop = getY(ann.priceTop);
              const yBottom = getY(ann.priceBottom);
              const h = Math.abs(yBottom - yTop);
              const colorHex = ann.color === "cyan" ? "#06B6D4" : ann.color === "emerald" ? "#10B981" : "#F43F5E";
              return (
                <rect
                  key={`zone-${idx}`}
                  x={padLeft}
                  y={Math.min(yTop, yBottom)}
                  width={plotWidth}
                  height={Math.max(2, h)}
                  fill={colorHex}
                  fillOpacity="0.25"
                  stroke={colorHex}
                  strokeWidth="0.5"
                />
              );
            }
            if (ann.type === "line" && ann.price) {
              const y = getY(ann.price);
              const colorHex = ann.color === "emerald" ? "#10B981" : ann.color === "rose" ? "#F43F5E" : "#06B6D4";
              return (
                <line
                  key={`line-${idx}`}
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke={colorHex}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              );
            }
            return null;
          })}

          {/* 1-Minute Candlesticks */}
          {candles.map((candle, idx) => {
            const cx = padLeft + idx * candleSpacing + candleSpacing / 2;
            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);
            const yHigh = getY(candle.high);
            const yLow = getY(candle.low);

            const isBullish = candle.close >= candle.open;
            const candleColor = isBullish ? "#10B981" : "#F43F5E";
            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
            const candleWidth = Math.min(8, candleSpacing * 0.65);

            return (
              <g key={candle.index}>
                {/* Wick */}
                <line
                  x1={cx}
                  y1={yHigh}
                  x2={cx}
                  y2={yLow}
                  stroke={candleColor}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={cx - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={candleColor}
                  rx="0.8"
                />

                {/* Key Action Marker on Key Candle */}
                {candle.isKeyAction && (
                  <circle
                    cx={cx}
                    y={isBullish ? yLow + 3 : yHigh - 3}
                    r="2.5"
                    fill={isBullish ? "#34D399" : candle.actionType === "NO_TRADE" ? "#F59E0B" : "#FB7185"}
                    stroke="#05070D"
                    strokeWidth="0.8"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Trade Type Micro-Badge at Top Right */}
        <div className="absolute top-1 right-1 pointer-events-none">
          <span
            className={`px-1 py-0.2 rounded text-[8px] font-mono font-bold leading-tight ${
              tradeType === "CALL"
                ? "bg-emerald-950/90 text-emerald-300 border border-emerald-700/60"
                : tradeType === "PUT"
                ? "bg-rose-950/90 text-rose-300 border border-rose-700/60"
                : "bg-amber-950/90 text-amber-300 border border-amber-700/60"
            }`}
          >
            {tradeType === "CALL" ? "▲ CALL" : tradeType === "PUT" ? "▼ PUT" : "● WAIT"}
          </span>
        </div>

        {/* 1M indicator at bottom left */}
        <div className="absolute bottom-0.5 left-1 pointer-events-none">
          <span className="text-[7.5px] font-mono text-gray-500 font-bold">1M</span>
        </div>
      </div>

      {/* Optional Pattern Subtext */}
      {showPatternBadge && keyCandle && (
        <span className="mt-1 text-[9px] font-mono text-gray-400 truncate max-w-[110px] text-center">
          {keyCandle.labelEn.split(" ")[0]}
        </span>
      )}
    </div>
  );
};
