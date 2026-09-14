import React, { useEffect, useRef, useState, useMemo } from "react";
import { Candle, MarketContext, Scenario } from "../types";
import { CandleHoverInspector } from "./CandleHoverInspector";
import { computeCandleMetrics } from "../utils/candleMetrics";
import {
  Activity,
  Eye,
  Maximize2,
  TrendingDown,
  TrendingUp,
  Volume2,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Crosshair,
} from "lucide-react";

interface CandlestickChartProps {
  scenario: Scenario;
  isResolved?: boolean;
  userAction?: "CALL" | "PUT" | "NO TRADE" | "";
  onCandleTickUpdate?: (tickSec: number, currentPrice: number) => void;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  scenario,
  isResolved = false,
  userAction,
  onCandleTickUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Indicators toggle
  const [showEMA, setShowEMA] = useState(true);
  const [showBollinger, setShowBollinger] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showFVG, setShowFVG] = useState(true);
  const [showRoundNumbers, setShowRoundNumbers] = useState(true);

  // Dynamic theme change listener
  const [themeTick, setThemeTick] = useState(0);
  useEffect(() => {
    const handleTheme = () => setThemeTick((v) => v + 1);
    window.addEventListener("otc-theme-changed", handleTheme);
    return () => window.removeEventListener("otc-theme-changed", handleTheme);
  }, []);

  // Dynamic responsive width tracking
  const [containerWidth, setContainerWidth] = useState<number>(800);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const measured = Math.floor(containerRef.current.clientWidth);
        if (measured > 0) {
          setContainerWidth(measured);
        }
      }
    };
    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0) {
            setContainerWidth(Math.floor(entry.contentRect.width));
          }
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateSize);
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Interactive crosshair
  const [hoverData, setHoverData] = useState<{
    candle: Candle | null;
    x: number;
    y: number;
    price: number;
  } | null>(null);

  // Live Tick Simulator state
  const [isSimulatingTicks, setIsSimulatingTicks] = useState(false);
  const [simTickSec, setSimTickSec] = useState(58);
  const [runningCandlePrice, setRunningCandlePrice] = useState<number | null>(null);

  // Candles to render (includes next candle only if resolved)
  const displayCandles = useMemo(() => {
    const list = scenario.candles.slice(0, scenario.pause_at_index);
    if (isResolved && scenario.resolution_next_candle) {
      list.push(scenario.resolution_next_candle);
    }
    return list;
  }, [scenario, isResolved]);

  // Tick simulation loop
  useEffect(() => {
    let timer: any;
    if (isSimulatingTicks && !isResolved) {
      const pauseCandle = scenario.candles[scenario.pause_at_index - 1];
      let sec = 0;
      setSimTickSec(0);

      timer = setInterval(() => {
        sec += 1;
        setSimTickSec(sec);

        // Simulate micro-tick price path within high/low of pause candle
        const progress = Math.min(sec / 60, 1);
        const spread = pauseCandle.high - pauseCandle.low;
        const randomNoise = (Math.random() - 0.48) * (spread * 0.15);
        const simulatedCurrent =
          pauseCandle.open + (pauseCandle.close - pauseCandle.open) * progress + randomNoise;

        setRunningCandlePrice(simulatedCurrent);
        if (onCandleTickUpdate) {
          onCandleTickUpdate(sec, simulatedCurrent);
        }

        if (sec >= 58) {
          setIsSimulatingTicks(false);
          setRunningCandlePrice(pauseCandle.close);
        }
      }, 250);
    } else {
      setSimTickSec(58);
      setRunningCandlePrice(null);
    }
    return () => clearInterval(timer);
  }, [isSimulatingTicks, scenario, isResolved]);

  // Main Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = containerWidth || containerRef.current.clientWidth || 800;
    const isMobile = width < 540;
    const height = isMobile ? (showRSI ? 380 : 330) : 460;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Dynamic Theme Tokens
    const rootStyles = getComputedStyle(document.documentElement);
    const themeBg = rootStyles.getPropertyValue("--theme-bg-primary").trim() || "#000000";
    const themeAccent = rootStyles.getPropertyValue("--theme-accent").trim() || "#38bdf8";
    const themeCard = rootStyles.getPropertyValue("--theme-bg-card").trim() || "#0d131f";
    const themeBorder = rootStyles.getPropertyValue("--theme-border").trim() || "#1F2937";

    // Background - True OLED Pitch Black or Theme Dark Void
    ctx.fillStyle = themeBg;
    ctx.fillRect(0, 0, width, height);

    // Padding & Area setup - generous rightPadding ensures price labels and round number badges never clip
    const topPadding = 45;
    const rightPadding = isMobile ? (width < 400 ? 84 : 90) : 104;
    const bottomPadding = showRSI ? 110 : 40;
    const leftPadding = isMobile ? 10 : 18;

    const chartWidth = width - leftPadding - rightPadding;
    const mainChartHeight = height - topPadding - bottomPadding;
    const rsiTop = height - 95;
    const rsiHeight = 65;

    // Price Bounds calculation
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    displayCandles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });

    // Factor in key levels & round numbers
    if (scenario.market_context.key_levels) {
      scenario.market_context.key_levels.forEach((lvl) => {
        if (lvl < minPrice) minPrice = lvl;
        if (lvl > maxPrice) maxPrice = lvl;
      });
    }

    // Add buffer
    const pricePadding = (maxPrice - minPrice) * 0.15 || 0.0005;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    // Helper functions
    const priceToY = (price: number) => {
      return topPadding + (1 - (price - minPrice) / priceRange) * mainChartHeight;
    };

    const yToPrice = (y: number) => {
      return minPrice + (1 - (y - topPadding) / mainChartHeight) * priceRange;
    };

    const candleCount = displayCandles.length + 2;
    const candleSlotWidth = chartWidth / candleCount;
    const candleBodyWidth = Math.max(candleSlotWidth * 0.65, 8);

    const candleToX = (index: number) => {
      return leftPadding + (index + 0.8) * candleSlotWidth;
    };

    // Draw Gridlines & Round Numbers
    ctx.strokeStyle = "#1F2937";
    ctx.lineWidth = 1;

    // Price Horizontal Gridlines
    const gridStep = priceRange / 6;
    for (let i = 0; i <= 6; i++) {
      const p = minPrice + i * gridStep;
      const y = priceToY(p);
      ctx.beginPath();
      ctx.moveTo(leftPadding, y);
      ctx.lineTo(width - rightPadding, y);
      ctx.stroke();

      // Right price axis label
      ctx.fillStyle = "#6B7280";
      ctx.font = isMobile ? "9.5px monospace" : "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(p.toFixed(5), width - rightPadding + 8, y + 4);
    }

    // Psychological Round Numbers (.00 / .50 / .000) - Background Line & Corridor
    if (showRoundNumbers && scenario.market_context.round_numbers) {
      scenario.market_context.round_numbers.forEach((rn) => {
        if (rn >= minPrice && rn <= maxPrice) {
          const y = priceToY(rn);

          // Ambient soft emerald highlight corridor
          ctx.save();
          ctx.fillStyle = "rgba(16, 185, 129, 0.08)";
          ctx.fillRect(leftPadding, y - 3, chartWidth, 6);

          // Vivid glowing green dashed line
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(leftPadding, y);
          ctx.lineTo(width - rightPadding, y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }
      });
    }

    // FVG Imbalance Zone Shading (Background)
    if (showFVG && scenario.market_context.fvg_zone) {
      const fvg = scenario.market_context.fvg_zone;
      const topY = priceToY(Math.max(fvg.top, fvg.bottom));
      const bottomY = priceToY(Math.min(fvg.top, fvg.bottom));
      const fvgH = bottomY - topY;

      ctx.fillStyle =
        fvg.type === "bearish"
          ? "rgba(239, 68, 68, 0.15)"
          : "rgba(34, 197, 94, 0.15)";
      ctx.fillRect(leftPadding, topY, chartWidth, fvgH);

      ctx.strokeStyle =
        fvg.type === "bearish"
          ? "rgba(239, 68, 68, 0.6)"
          : "rgba(34, 197, 94, 0.6)";
      ctx.lineWidth = 1;
      ctx.strokeRect(leftPadding, topY, chartWidth, fvgH);

      // Midpoint CE (Consequent Encroachment)
      const ceY = topY + fvgH / 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(leftPadding, ceY);
      ctx.lineTo(width - rightPadding, ceY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Order Block Zone Shading (Background)
    if (scenario.market_context.order_block) {
      const ob = scenario.market_context.order_block;
      const topY = priceToY(Math.max(ob.top, ob.bottom));
      const bottomY = priceToY(Math.min(ob.top, ob.bottom));
      const obH = bottomY - topY;

      ctx.fillStyle =
        ob.type === "bullish"
          ? "rgba(16, 185, 129, 0.2)"
          : "rgba(244, 63, 94, 0.2)";
      ctx.fillRect(leftPadding, topY, chartWidth, obH);

      ctx.strokeStyle =
        ob.type === "bullish" ? "#10b981" : "#f43f5e";
      ctx.lineWidth = 1;
      ctx.strokeRect(leftPadding, topY, chartWidth, obH);
    }

    // Liquidity Pool Lines (BSL / SSL) (Background)
    if (scenario.market_context.liquidity_pool) {
      const lp = scenario.market_context.liquidity_pool;
      const y = priceToY(lp.level);

      ctx.strokeStyle = lp.type === "BSL" ? "#fbbf24" : "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(leftPadding, y);
      ctx.lineTo(width - rightPadding, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Bollinger Bands (20, 2)
    if (showBollinger && displayCandles.length >= 3) {
      const closes = displayCandles.map((c) => c.close);
      const sma = closes.reduce((a, b) => a + b, 0) / closes.length;
      const variance =
        closes.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / closes.length;
      const stdDev = Math.sqrt(variance);

      const upperBand = sma + stdDev * 1.8;
      const lowerBand = sma - stdDev * 1.8;

      ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      const upperY = priceToY(upperBand);
      const lowerY = priceToY(lowerBand);

      ctx.beginPath();
      ctx.moveTo(leftPadding, upperY);
      ctx.lineTo(width - rightPadding, upperY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(leftPadding, lowerY);
      ctx.lineTo(width - rightPadding, lowerY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw EMA 20 approximation curve
    if (showEMA && displayCandles.length >= 2) {
      ctx.strokeStyle = "#eab308"; // Gold EMA
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      displayCandles.forEach((c, idx) => {
        const x = candleToX(idx);
        const y = priceToY(c.close * 0.9999 + c.open * 0.0001); // smooth
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draw Candlesticks & Volume Proxy Bars
    displayCandles.forEach((c, idx) => {
      const isPauseCandle = idx === scenario.pause_at_index - 1;
      const isNextCandle = idx === scenario.pause_at_index;

      const isGreen = c.close >= c.open;
      const color = isGreen ? "#22c55e" : "#ef4444";
      const wickColor = isGreen ? "#4ade80" : "#f87171";

      const x = candleToX(idx);
      const openY = priceToY(c.open);
      const closeY = priceToY(c.close);
      const highY = priceToY(c.high);
      const lowY = priceToY(c.low);

      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

      // Volume Proxy Bar at bottom
      const volH = Math.min((c.volume_proxy || 100) * 0.12, 35);
      ctx.fillStyle = isGreen
        ? "rgba(34, 197, 94, 0.25)"
        : "rgba(239, 68, 68, 0.25)";
      ctx.fillRect(
        x - candleBodyWidth / 2,
        mainChartHeight + topPadding - volH,
        candleBodyWidth,
        volH
      );

      // Candlestick Wick (Shadow)
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Candlestick Body
      ctx.fillStyle = color;
      ctx.fillRect(
        x - candleBodyWidth / 2,
        bodyTop,
        candleBodyWidth,
        bodyHeight
      );

      // Border outline for clarity
      ctx.strokeStyle = isGreen ? "#15803d" : "#b91c1c";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        x - candleBodyWidth / 2,
        bodyTop,
        candleBodyWidth,
        bodyHeight
      );

      // Candle Number Index Label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`C${c.index}`, x, mainChartHeight + topPadding + 14);

      // Pause Point Decision Candle Highlight (Drawn in foreground pass below)
    });

    // ==========================================
    // FOREGROUND TOOLTIPS & BADGES (ALWAYS IN FRONT OF CANDLES)
    // ==========================================

    // 1. FVG Imbalance Tooltip Badge (Foreground - In Front of Candles)
    if (showFVG && scenario.market_context.fvg_zone) {
      const fvg = scenario.market_context.fvg_zone;
      const topY = priceToY(Math.max(fvg.top, fvg.bottom));
      const fvgLabel = `FVG Imbalance (${fvg.type.toUpperCase()}) | CE: ${((fvg.top + fvg.bottom) / 2).toFixed(5)}`;
      ctx.font = "bold 10px Inter, sans-serif";
      const fvgTextWidth = ctx.measureText(fvgLabel).width;
      const fvgBadgeY = topY - 18 > topPadding ? topY - 18 : topY + 4;
      
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 6;
      ctx.fillStyle = "#000000";
      ctx.fillRect(leftPadding + 8, fvgBadgeY, fvgTextWidth + 14, 18);
      ctx.strokeStyle = fvg.type === "bearish" ? "#ef4444" : "#22c55e";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(leftPadding + 8, fvgBadgeY, fvgTextWidth + 14, 18);
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(fvgLabel, leftPadding + 15, fvgBadgeY + 13);
    }

    // 2. Order Block Tooltip Badge (Foreground - In Front of Candles)
    if (scenario.market_context.order_block) {
      const ob = scenario.market_context.order_block;
      const topY = priceToY(Math.max(ob.top, ob.bottom));
      const obLabel = `ORDER BLOCK (${ob.type.toUpperCase()})`;
      ctx.font = "bold 10px Inter, sans-serif";
      const obTextWidth = ctx.measureText(obLabel).width;
      const obBadgeY = topY - 18 > topPadding ? topY - 18 : topY + 4;

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 6;
      ctx.fillStyle = "#000000";
      ctx.fillRect(leftPadding + 8, obBadgeY, obTextWidth + 14, 18);
      ctx.strokeStyle = ob.type === "bullish" ? "#10b981" : "#f43f5e";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(leftPadding + 8, obBadgeY, obTextWidth + 14, 18);
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(obLabel, leftPadding + 15, obBadgeY + 13);
    }

    // 3. Liquidity Pool Tooltip Badge (Foreground - In Front of Candles)
    if (scenario.market_context.liquidity_pool) {
      const lp = scenario.market_context.liquidity_pool;
      const y = priceToY(lp.level);
      const lpLabel = `💧 ${lp.type === "BSL" ? "Buy-Side" : "Sell-Side"} Liquidity (${lp.level.toFixed(5)}) ${
        lp.swept ? "[SWEPT]" : ""
      }`;
      ctx.font = "bold 10px Inter, sans-serif";
      const lpTextWidth = ctx.measureText(lpLabel).width;
      const lpBadgeY = y - 18 > topPadding ? y - 18 : y + 4;

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 6;
      ctx.fillStyle = "#000000";
      ctx.fillRect(leftPadding + 8, lpBadgeY, lpTextWidth + 14, 18);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(leftPadding + 8, lpBadgeY, lpTextWidth + 14, 18);
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(lpLabel, leftPadding + 15, lpBadgeY + 13);
    }

    // 4. Decision Candle & Resolution Markers (Foreground)
    displayCandles.forEach((c, idx) => {
      const isPauseCandle = idx === scenario.pause_at_index - 1;
      const isNextCandle = idx === scenario.pause_at_index;
      const x = candleToX(idx);
      const highY = priceToY(c.high);
      const lowY = priceToY(c.low);

      if (isPauseCandle && !isResolved) {
        ctx.strokeStyle = themeAccent;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 2]);
        ctx.strokeRect(
          x - candleBodyWidth / 2 - 4,
          highY - 8,
          candleBodyWidth + 8,
          lowY - highY + 16
        );
        ctx.setLineDash([]);

        // Decision Marker Tag
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.85)";
        ctx.shadowBlur = 6;
        ctx.fillStyle = themeAccent;
        ctx.fillRect(x - 55, highY - 32, 110, 20);
        ctx.restore();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`DECISION CANDLE #${c.index}`, x, highY - 18);
      }

      if (isNextCandle && isResolved) {
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          x - candleBodyWidth / 2 - 4,
          highY - 8,
          candleBodyWidth + 8,
          lowY - highY + 16
        );

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.85)";
        ctx.shadowBlur = 6;
        ctx.fillStyle = "#7e22ce";
        ctx.fillRect(x - 55, highY - 32, 110, 20);
        ctx.restore();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`RESOLUTION RESULT`, x, highY - 18);
      }
    });

    // 5. Psychological Round Numbers Arrow Callout Badges (Foreground with Pure WHITE text)
    if (showRoundNumbers && scenario.market_context.round_numbers) {
      scenario.market_context.round_numbers.forEach((rn) => {
        if (rn >= minPrice && rn <= maxPrice) {
          const y = priceToY(rn);
          const priceText = rn > 50 ? rn.toFixed(3) : rn.toFixed(5);

          ctx.save();
          const fontSize = isMobile ? 11 : 12;
          ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
          ctx.textBaseline = "middle";

          const textMetrics = ctx.measureText(priceText);
          const textWidth = textMetrics.width;

          const arrowLength = isMobile ? 4 : 5;
          const tipX = width - rightPadding;
          const bodyX = tipX + arrowLength;
          const badgePadLeft = isMobile ? 14 : 16;
          const badgePadRight = isMobile ? 6 : 8;
          const idealBadgeW = textWidth + badgePadLeft + badgePadRight;
          const maxBadgeW = Math.max(10, (width - 3) - bodyX);
          const badgeW = Math.min(idealBadgeW, maxBadgeW);
          const bodyRight = bodyX + badgeW;
          const badgeH = isMobile ? 20 : 22;
          const badgeTop = y - badgeH / 2;
          const radius = 4;

          // Shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Arrow Callout Shape
          ctx.beginPath();
          ctx.moveTo(tipX, y);
          ctx.lineTo(bodyX, badgeTop);
          ctx.lineTo(bodyRight - radius, badgeTop);
          ctx.quadraticCurveTo(bodyRight, badgeTop, bodyRight, badgeTop + radius);
          ctx.lineTo(bodyRight, badgeTop + badgeH - radius);
          ctx.quadraticCurveTo(bodyRight, badgeTop + badgeH, bodyRight - radius, badgeTop + badgeH);
          ctx.lineTo(bodyX, badgeTop + badgeH);
          ctx.closePath();

          // High-contrast deep emerald background
          ctx.fillStyle = "#022c22";
          ctx.fill();

          // Vivid neon green border
          ctx.strokeStyle = "#22c55e";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;

          // Green Arrow pointer indicator icon
          ctx.fillStyle = "#22c55e";
          ctx.font = `bold ${isMobile ? 9.5 : 10.5}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "left";
          ctx.fillText("◀", bodyX + 3.5, y);

          // PURE WHITE PRICE TEXT (CHANGED FROM GREEN TO CRISP WHITE)
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
          ctx.fillText(priceText, bodyX + badgePadLeft, y);

          ctx.restore();
        }
      });
    }

    // Draw Mini-RSI Subchart (14)
    if (showRSI) {
      // Subchart frame
      ctx.fillStyle = themeCard;
      ctx.fillRect(leftPadding, rsiTop, chartWidth, rsiHeight);
      ctx.strokeStyle = themeBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(leftPadding, rsiTop, chartWidth, rsiHeight);

      // Overbought 70 & Oversold 30 lines
      const y70 = rsiTop + rsiHeight * 0.3;
      const y30 = rsiTop + rsiHeight * 0.7;
      const y50 = rsiTop + rsiHeight * 0.5;

      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.beginPath();
      ctx.moveTo(leftPadding, y70);
      ctx.lineTo(width - rightPadding, y70);
      ctx.stroke();

      ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
      ctx.beginPath();
      ctx.moveTo(leftPadding, y30);
      ctx.lineTo(width - rightPadding, y30);
      ctx.stroke();

      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
      ctx.beginPath();
      ctx.moveTo(leftPadding, y50);
      ctx.lineTo(width - rightPadding, y50);
      ctx.stroke();

      // RSI Label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("RSI (14 Filter)", leftPadding + 6, rsiTop + 14);

      // Simulated RSI curve connecting candles
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      displayCandles.forEach((c, idx) => {
        const x = candleToX(idx);
        const rsiVal = 30 + ((c.close - minPrice) / priceRange) * 40; // synthetic bounded RSI
        const y = rsiTop + rsiHeight * (1 - rsiVal / 100);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Crosshair overlay if hovered
    if (hoverData && hoverData.x >= leftPadding && hoverData.x <= width - rightPadding) {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(hoverData.x, topPadding);
      ctx.lineTo(hoverData.x, mainChartHeight + topPadding);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(leftPadding, hoverData.y);
      ctx.lineTo(width - rightPadding, hoverData.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Y-Axis Price Badge
      if (hoverData.y >= topPadding && hoverData.y <= mainChartHeight + topPadding) {
        const crosshairW = Math.min(isMobile ? 68 : 76, width - (width - rightPadding + 2) - 3);
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(width - rightPadding + 2, hoverData.y - 10, crosshairW, 20);
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${isMobile ? 10 : 11}px 'JetBrains Mono', monospace`;
        ctx.textAlign = "left";
        ctx.fillText(hoverData.price.toFixed(5), width - rightPadding + 6, hoverData.y + 4);
      }

      // If hovering over a candle, draw candle highlight beam
      if (hoverData.candle) {
        const cX = candleToX(hoverData.candle.index - 1);
        ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
        ctx.fillRect(
          cX - candleSlotWidth / 2,
          topPadding,
          candleSlotWidth,
          mainChartHeight
        );
      }
    }
  }, [
    displayCandles,
    scenario,
    isResolved,
    showEMA,
    showBollinger,
    showRSI,
    showFVG,
    showRoundNumbers,
    hoverData,
    containerWidth,
    themeTick,
  ]);

  // Unified Coordinate Hover Tracker (Mouse & Touch)
  const updateHoverAtCoords = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.clientWidth;
    const isMobile = width < 540;
    const height = isMobile ? (showRSI ? 380 : 330) : 460;
    const leftPadding = isMobile ? 12 : 20;
    const rightPadding = isMobile ? 65 : 94;
    const topPadding = 45;
    const bottomPadding = showRSI ? 110 : 40;
    const mainChartHeight = height - topPadding - bottomPadding;

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    displayCandles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });
    const pricePadding = (maxPrice - minPrice) * 0.15 || 0.0005;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    const price = minPrice + (1 - (y - topPadding) / mainChartHeight) * priceRange;

    // Find nearest candle
    const chartWidth = width - leftPadding - rightPadding;
    const candleCount = displayCandles.length + 2;
    const candleSlotWidth = chartWidth / candleCount;
    const candleIdx = Math.floor((x - leftPadding) / candleSlotWidth);
    const candle = displayCandles[candleIdx] || null;

    setHoverData({ x, y, price, candle });
  };

  // Handle Mouse Move for Crosshair
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    updateHoverAtCoords(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    updateHoverAtCoords(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col w-full bg-[#000000] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
    >
      {/* Chart Top Header & Toolbar - High Density */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2.5 bg-[#060911] border-b border-white/10 text-xs">
        {/* Asset & Trend Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#000000] border border-cyan-500/40 shadow-inner">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white font-mono text-xs tracking-wide">
              {scenario.market_context.asset}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold ${
              scenario.market_context.trend === "Uptrend"
                ? "bg-emerald-950/70 text-emerald-400 border border-emerald-500/50 glow-emerald"
                : scenario.market_context.trend === "Downtrend"
                ? "bg-rose-950/70 text-rose-400 border border-rose-500/50 glow-rose"
                : "bg-amber-950/70 text-amber-400 border border-amber-500/50 glow-amber"
            }`}
          >
            {scenario.market_context.trend === "Uptrend" ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : scenario.market_context.trend === "Downtrend" ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Activity className="w-3.5 h-3.5" />
            )}
            <span>{scenario.market_context.trend.toUpperCase()}</span>
          </div>

          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#000000] text-cyan-400 font-mono text-[10px] border border-cyan-700/50">
            TF: 1M (60s)
          </span>

          <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 font-mono text-[10px] border border-emerald-700/50">
            PAYOUT 85%
          </span>
        </div>

        {/* Indicator & Annotation Toggles - Mobile Horizontally Scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
          <button
            id="toggle-fvg-btn"
            onClick={() => setShowFVG(!showFVG)}
            className={`px-2 py-1 rounded-md text-[11px] font-mono font-semibold transition-all border cursor-pointer shrink-0 ${
              showFVG
                ? "bg-cyan-950 text-cyan-300 border-cyan-400/80 shadow-sm shadow-cyan-950 glow-cyan"
                : "bg-[#000000] text-slate-400 border-white/10 hover:text-white"
            }`}
            title="Toggle Fair Value Gap Shading"
          >
            FVG
          </button>
          <button
            id="toggle-rn-btn"
            onClick={() => setShowRoundNumbers(!showRoundNumbers)}
            className={`px-2 py-1 rounded-md text-[11px] font-mono font-semibold transition-all border cursor-pointer shrink-0 ${
              showRoundNumbers
                ? "bg-emerald-950 text-emerald-300 border-emerald-400/80 shadow-sm shadow-emerald-950 glow-emerald"
                : "bg-[#000000] text-slate-400 border-white/10 hover:text-white"
            }`}
            title="Toggle .00 / .50 Round Numbers"
          >
            .00_RN
          </button>
          <button
            id="toggle-ema-btn"
            onClick={() => setShowEMA(!showEMA)}
            className={`px-2 py-1 rounded-md text-[11px] font-mono font-semibold transition-all border cursor-pointer shrink-0 ${
              showEMA
                ? "bg-amber-950 text-amber-300 border-amber-400/80 shadow-sm shadow-amber-950 glow-amber"
                : "bg-[#000000] text-slate-400 border-white/10 hover:text-white"
            }`}
            title="Toggle EMA 20 Dynamic Support"
          >
            EMA20
          </button>
          <button
            id="toggle-bollinger-btn"
            onClick={() => setShowBollinger(!showBollinger)}
            className={`px-2 py-1 rounded-md text-[11px] font-mono font-semibold transition-all border cursor-pointer shrink-0 ${
              showBollinger
                ? "bg-slate-800 text-white border-slate-400"
                : "bg-[#000000] text-slate-400 border-white/10 hover:text-white"
            }`}
            title="Toggle Bollinger Bands (20,2)"
          >
            BB(20,2)
          </button>
          <button
            id="toggle-rsi-btn"
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2 py-1 rounded-md text-[11px] font-mono font-semibold transition-all border cursor-pointer shrink-0 ${
              showRSI
                ? "bg-purple-950 text-purple-300 border-purple-400/80 shadow-sm shadow-purple-950"
                : "bg-[#000000] text-slate-400 border-white/10 hover:text-white"
            }`}
            title="Toggle RSI 14 Filter Panel"
          >
            RSI14
          </button>

          {/* Tick Simulation Button */}
          {!isResolved && (
            <button
              id="simulate-ticks-btn"
              onClick={() => setIsSimulatingTicks(!isSimulatingTicks)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-all border cursor-pointer shrink-0 ${
                isSimulatingTicks
                  ? "bg-emerald-500 text-black border-emerald-300 font-extrabold animate-pulse glow-emerald"
                  : "bg-emerald-950/80 text-emerald-400 hover:text-emerald-200 border-emerald-500/50 hover:border-emerald-400"
              }`}
            >
              {isSimulatingTicks ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>REPLAY ({simTickSec}s)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>SIMULATE_TICK</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="relative w-full bg-[#000000]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setHoverData(null)}
          className="cursor-crosshair w-full block touch-none"
        />

        {/* OHLC Bar Info Card Overlay */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-3.5 z-10 flex flex-wrap items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-1 sm:py-1.5 bg-[#04060B]/95 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/15 text-[10px] sm:text-[11px] font-mono text-slate-300 pointer-events-none shadow-2xl max-w-[calc(100%-12px)] sm:max-w-[calc(100%-180px)]">
          {hoverData?.candle ? (
            (() => {
              const candleIdx = hoverData.candle.index;
              const prev = candleIdx > 1 && candleIdx - 2 < displayCandles.length ? displayCandles[candleIdx - 2] : undefined;
              const m = computeCandleMetrics(
                hoverData.candle.open,
                hoverData.candle.high,
                hoverData.candle.low,
                hoverData.candle.close,
                prev?.high,
                prev?.low
              );
              return (
                <>
                  <span className="font-extrabold text-cyan-400">
                    C#{hoverData.candle.index}
                  </span>
                  {m.stratType && (
                    <span
                      className="px-1 py-0.2 rounded font-extrabold text-[9px] sm:text-[10px]"
                      style={{
                        backgroundColor: `${m.stratColor}25`,
                        color: m.stratColor,
                        border: `1px solid ${m.stratColor}60`,
                      }}
                    >
                      {m.stratType}
                    </span>
                  )}
                  <span>O:<strong className="text-white ml-0.5">{m.open.toFixed(4)}</strong></span>
                  <span>H:<strong className="text-emerald-400 ml-0.5">{m.high.toFixed(4)}</strong></span>
                  <span>L:<strong className="text-rose-400 ml-0.5">{m.low.toFixed(4)}</strong></span>
                  <span>C:<strong className={`ml-0.5 ${m.isBullish ? "text-emerald-300" : "text-rose-300"}`}>{m.close.toFixed(4)}</strong></span>
                  <span
                    className={`px-1 py-0.2 rounded font-bold ${
                      m.isBullish
                        ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/50"
                        : "bg-rose-950/80 text-rose-400 border border-rose-500/50"
                    }`}
                  >
                    {m.deltaPips >= 0 ? `+${m.deltaPips.toFixed(1)}` : m.deltaPips.toFixed(1)}
                  </span>
                  <span className="hidden xl:inline-block text-slate-400">
                    Range: <strong className="text-white">{m.totalRangePips.toFixed(1)} pts</strong> (Body: {m.bodySizePips.toFixed(1)} pts | {(m.bodyRatio * 100).toFixed(0)}%)
                  </span>
                  <span className="hidden 2xl:inline-block px-1.5 py-0.2 rounded bg-black border border-white/15 text-slate-300 text-[10px]">
                    {m.patternType}
                  </span>
                  {m.fiftyPercentLevel && (
                    <span className="hidden lg:inline-block text-yellow-400 text-[10px] font-bold">
                      50%: {m.fiftyPercentLevel.toFixed(5)}
                    </span>
                  )}
                </>
              );
            })()
          ) : (
            <>
              <span className="text-cyan-400 font-semibold font-mono flex items-center gap-1.5">
                <Crosshair className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-cyan-400 shrink-0" />
                <span className="hidden sm:inline">[CROSSHAIR ACTIVE] Hover over any candle for precision quantitative OHLC & metrics</span>
                <span className="sm:hidden text-[10px]">Tap any candle for OHLC & metrics</span>
              </span>
              {isSimulatingTicks && (
                <span className="text-emerald-400 font-bold animate-pulse font-mono ml-1 text-[10px]">
                  ⏱ {simTickSec}s
                </span>
              )}
            </>
          )}
        </div>

        {/* Live Candle Countdown Timer Badge */}
        <div className="absolute top-2.5 right-20 z-10 hidden sm:flex items-center gap-2 px-3 py-1 bg-[#04060B]/95 backdrop-blur-md rounded-xl border border-cyan-500/40 text-[11px] font-mono shadow-2xl">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </div>
          <span className="text-slate-400">EXPIRY CLOSE:</span>
          <span className="font-bold text-cyan-300">
            00:{String(Math.max(0, 60 - simTickSec)).padStart(2, "0")}
          </span>
        </div>

        {/* Resolution Banner on Chart */}
        {isResolved && (
          <div className="absolute top-12 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#04060B]/95 border border-purple-500/70 shadow-2xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-purple-300">
              RESOLUTION_REVEALED
            </span>
            <span className="text-xs font-mono text-white">
              C#{scenario.resolution_next_candle.index} @{" "}
              {scenario.resolution_next_candle.close.toFixed(5)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

