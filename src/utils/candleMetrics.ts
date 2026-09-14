export type StratBarType = "1" | "2U" | "2D" | "3";

export interface CandleMetrics {
  open: number;
  high: number;
  low: number;
  close: number;
  isBullish: boolean;
  isDoji: boolean;
  delta: number;
  deltaPips: number;
  deltaPercent: number;
  totalRange: number;
  totalRangePips: number;
  bodySize: number;
  bodySizePips: number;
  bodyRatio: number; // 0 to 1
  upperWick: number;
  upperWickPips: number;
  upperWickRatio: number; // 0 to 1
  lowerWick: number;
  lowerWickPips: number;
  lowerWickRatio: number; // 0 to 1
  patternType: string;
  patternTypeBn: string;
  bias: "BULLISH" | "BEARISH" | "NEUTRAL";
  rejectionSide: "UPPER" | "LOWER" | "BOTH" | "NONE";
  rejectionStrength: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  marginOfSafetyZone: string;
  marginOfSafetyZoneBn: string;
  stratType?: StratBarType;
  stratNameEn?: string;
  stratNameBn?: string;
  stratColor?: string;
  fiftyPercentLevel?: number;
}

export function computeStratClassification(
  high: number,
  low: number,
  prevHigh?: number,
  prevLow?: number
): {
  stratType: StratBarType;
  stratNameEn: string;
  stratNameBn: string;
  color: string;
  fiftyPercentLevel: number;
} {
  const fiftyPercentLevel = (high + low) / 2;
  if (prevHigh === undefined || prevLow === undefined) {
    return {
      stratType: "2U",
      stratNameEn: "Type 2U (Up)",
      stratNameBn: "টাইপ ২U (ডিরেকশনাল)",
      color: "#10B981",
      fiftyPercentLevel,
    };
  }

  const breaksHigh = high > prevHigh + 0.00001;
  const breaksLow = low < prevLow - 0.00001;

  if (breaksHigh && breaksLow) {
    return {
      stratType: "3",
      stratNameEn: "Type 3: Outside Bar (Sweep)",
      stratNameBn: "টাইপ ৩: আউটসাইড বার (ব্রডেনিং)",
      color: "#D946EF",
      fiftyPercentLevel,
    };
  } else if (!breaksHigh && !breaksLow) {
    return {
      stratType: "1",
      stratNameEn: "Type 1: Inside Bar (Coil)",
      stratNameBn: "টাইপ ১: ইনসাইড বার (কনসলিডেশন)",
      color: "#EAB308",
      fiftyPercentLevel,
    };
  } else if (breaksHigh && !breaksLow) {
    return {
      stratType: "2U",
      stratNameEn: "Type 2U: Directional Up",
      stratNameBn: "টাইপ ২U: ডিরেকশনাল আপ",
      color: "#10B981",
      fiftyPercentLevel,
    };
  } else {
    return {
      stratType: "2D",
      stratNameEn: "Type 2D: Directional Down",
      stratNameBn: "টাইপ ২D: ডিরেকশনাল ডাউন",
      color: "#F43F5E",
      fiftyPercentLevel,
    };
  }
}

export function computeCandleMetrics(
  open: number,
  high: number,
  low: number,
  close: number,
  prevHigh?: number,
  prevLow?: number
): CandleMetrics {
  const isBullish = close >= open;
  const totalRange = Math.max(high - low, 0.00001);
  const bodySize = Math.abs(close - open);
  const upperWick = Math.max(0, high - Math.max(open, close));
  const lowerWick = Math.max(0, Math.min(open, close) - low);

  // Multiplier for pips: standard 5-decimal forex is 10000, 2-decimal like JPY/Crypto is 100
  const pipMultiplier = open > 50 ? 100 : 10000;

  const delta = close - open;
  const deltaPips = delta * pipMultiplier;
  const deltaPercent = open !== 0 ? (delta / open) * 100 : 0;

  const totalRangePips = totalRange * pipMultiplier;
  const bodySizePips = bodySize * pipMultiplier;
  const upperWickPips = upperWick * pipMultiplier;
  const lowerWickPips = lowerWick * pipMultiplier;

  const bodyRatio = bodySize / totalRange;
  const upperWickRatio = upperWick / totalRange;
  const lowerWickRatio = lowerWick / totalRange;

  const isDoji = bodyRatio < 0.12;

  // Determine Rejection
  let rejectionSide: "UPPER" | "LOWER" | "BOTH" | "NONE" = "NONE";
  let rejectionStrength: "HIGH" | "MEDIUM" | "LOW" | "NONE" = "NONE";

  if (upperWickRatio > 0.5) {
    rejectionSide = "UPPER";
    rejectionStrength = upperWickRatio > 0.65 ? "HIGH" : "MEDIUM";
  } else if (lowerWickRatio > 0.5) {
    rejectionSide = "LOWER";
    rejectionStrength = lowerWickRatio > 0.65 ? "HIGH" : "MEDIUM";
  } else if (upperWickRatio > 0.3 && lowerWickRatio > 0.3) {
    rejectionSide = "BOTH";
    rejectionStrength = "MEDIUM";
  } else if (upperWickRatio > 0.3) {
    rejectionSide = "UPPER";
    rejectionStrength = "LOW";
  } else if (lowerWickRatio > 0.3) {
    rejectionSide = "LOWER";
    rejectionStrength = "LOW";
  }

  // Determine Pattern Classification
  let patternType = "Standard Candle";
  let patternTypeBn = "স্ট্যান্ডার্ড ক্যান্ডেল";
  let bias: "BULLISH" | "BEARISH" | "NEUTRAL" = isBullish ? "BULLISH" : "BEARISH";

  if (isDoji) {
    if (upperWickRatio > 0.6) {
      patternType = "Gravestone Doji (Bearish Rejection)";
      patternTypeBn = "গ্রেভস্টোন ডোজি (বেয়ারিশ রিজেকশন)";
      bias = "BEARISH";
    } else if (lowerWickRatio > 0.6) {
      patternType = "Dragonfly Doji (Bullish Rejection)";
      patternTypeBn = "ড্রাগনফ্লাই ডোজি (বুলিশ রিজেকশন)";
      bias = "BULLISH";
    } else {
      patternType = "Neutral Doji (Balance/Indecision)";
      patternTypeBn = "নিউট্রাল ডোজি (অনিশ্চয়তা / ইনডিসিশন)";
      bias = "NEUTRAL";
    }
  } else if (lowerWickRatio >= 0.55 && bodyRatio <= 0.38) {
    patternType = "Bullish Hammer / Long Lower Wick Pin Bar";
    patternTypeBn = "বুলিশ হ্যামার / লং লোয়ার উইক পিন বার";
    bias = "BULLISH";
  } else if (upperWickRatio >= 0.55 && bodyRatio <= 0.38) {
    patternType = "Shooting Star / Long Upper Wick Pin Bar";
    patternTypeBn = "শুটিং স্টার / লং আপার উইক পিন বার";
    bias = "BEARISH";
  } else if (bodyRatio >= 0.8) {
    patternType = isBullish
      ? "Bullish Marubozu (Strong Momentum Bar)"
      : "Bearish Marubozu (Heavy Selling Pressure)";
    patternTypeBn = isBullish
      ? "বুলিশ মারুবোজু (তীব্র মোমেন্টাম বার)"
      : "বেয়ারিশ মারুবোজু (ভারী সেলিং প্রেশার)";
    bias = isBullish ? "BULLISH" : "BEARISH";
  } else if (bodyRatio >= 0.55) {
    patternType = isBullish ? "Bullish Expansion Body" : "Bearish Expansion Body";
    patternTypeBn = isBullish ? "বুলিশ এক্সপ্যানশন বডি" : "বেয়ারিশ এক্সপ্যানশন বডি";
    bias = isBullish ? "BULLISH" : "BEARISH";
  } else if (upperWickRatio > 0.4) {
    patternType = "Inverted Hammer / Upper Wick Pressure";
    patternTypeBn = "ইনভার্টেড হ্যামার / আপার উইক প্রেশার";
    bias = "BEARISH";
  } else if (lowerWickRatio > 0.4) {
    patternType = "Hanging Man / Lower Wick Retest";
    patternTypeBn = "হ্যাংগিং ম্যান / লোয়ার উইক রিটেস্ট";
    bias = "BULLISH";
  }

  // Margin of Safety Zone
  let marginOfSafetyZone = "Enter near the opening price level";
  let marginOfSafetyZoneBn = "ওপেনিং প্রাইসের কাছাকাছি এন্ট্রি নিন";
  if (lowerWickRatio > 0.3) {
    marginOfSafetyZone = `Lower wick pullback: ${(low + lowerWick * 0.5).toFixed(5)}`;
    marginOfSafetyZoneBn = `লোয়ার উইক পুলব্যাক: ${(low + lowerWick * 0.5).toFixed(5)}`;
  } else if (upperWickRatio > 0.3) {
    marginOfSafetyZone = `Upper wick pullback: ${(high - upperWick * 0.5).toFixed(5)}`;
    marginOfSafetyZoneBn = `আপার উইক পুলব্যাক: ${(high - upperWick * 0.5).toFixed(5)}`;
  }

  const strat = computeStratClassification(high, low, prevHigh, prevLow);

  return {
    open,
    high,
    low,
    close,
    isBullish,
    isDoji,
    delta,
    deltaPips,
    deltaPercent,
    totalRange,
    totalRangePips,
    bodySize,
    bodySizePips,
    bodyRatio,
    upperWick,
    upperWickPips,
    upperWickRatio,
    lowerWick,
    lowerWickPips,
    lowerWickRatio,
    patternType,
    patternTypeBn,
    bias,
    rejectionSide,
    rejectionStrength,
    marginOfSafetyZone,
    marginOfSafetyZoneBn,
    stratType: strat.stratType,
    stratNameEn: strat.stratNameEn,
    stratNameBn: strat.stratNameBn,
    stratColor: strat.color,
    fiftyPercentLevel: strat.fiftyPercentLevel,
  };
}
