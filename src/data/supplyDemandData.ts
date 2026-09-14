export interface SDZonePattern {
  id: string;
  number: number;
  titleEn: string;
  titleBn: string;
  category: "Supply & Demand" | "Star Candlesticks";
  type: "Reversal" | "Continuation";
  signal: "CALL" | "PUT";
  winRateEst: string;
  expiry: "1M" | "2M" | "5M";
  zoneType: "Supply Zone" | "Demand Zone" | "Star Cluster";
  summaryEn: string;
  summaryBn: string;
  structureRulesEn: string[];
  structureRulesBn: string[];
  entryStrategyEn: string;
  entryStrategyBn: string;
  invalidationEn: string;
  invalidationBn: string;
  mosRuleEn: string;
  mosRuleBn: string;
  linkedScenarioId: string;
  diagramConfig: {
    zoneTopPercent: number; // percentage from top (0-100)
    zoneHeightPercent: number;
    zoneLabel: string;
    zoneType: "supply" | "demand";
    trendLines?: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      style?: "solid" | "dashed";
    }[];
    candles: {
      id: string;
      label?: string;
      color: "green" | "red" | "doji";
      bodyY: number; // 0-100 from top
      bodyH: number; // height
      wickTop: number;
      wickBottom: number;
      isTrigger?: boolean;
      annotation?: string;
      annotationBn?: string;
    }[];
  };
}

export const SUPPLY_DEMAND_PATTERNS: SDZonePattern[] = [
  {
    id: "sd_double_top",
    number: 1,
    titleEn: "Double Top at Supply Zone",
    titleBn: "সাপ্লাই জোনে ডাবল টপ রিভার্সাল",
    category: "Supply & Demand",
    type: "Reversal",
    signal: "PUT",
    winRateEst: "86% - 91%",
    expiry: "1M",
    zoneType: "Supply Zone",
    summaryEn: "Price rallies strongly into an overhead Supply Zone (Order Block), pauses, retraces down, then makes a second test of the supply barrier. Exhaustion and rejection at the second peak confirm heavy institutional selling.",
    summaryBn: "মার্কেট ঊর্ধ্বমুখী হয়ে পূর্ববর্তী সাপ্লাই জোনে (অর্ডার ব্লক) পৌঁছায়, কিছুটা নিচে নেমে দ্বিতীয়বার ওই সাপ্লাই লেভেল টেস্ট করে। দ্বিতীয় চূড়ায় রিজেকশন দেখা দিলে ব্যাংক ও স্মার্ট মানির ভারী সেল অর্ডারে তীব্র ডাউনট্রেন্ড শুরু হয়।",
    structureRulesEn: [
      "Peak 1 creates the benchmark Supply Zone with long upper wicks or solid red rejection.",
      "Interim pullback forms a neckline before buyers make a second assault.",
      "Peak 2 touches the Supply Zone without making a decisive close above it (Liquidity Sweep).",
      "Immediate red reversal candle forms at Peak 2, confirming supply absorption.",
    ],
    structureRulesBn: [
      "১ম চূড়াটি আপার উইক বা লাল ক্যান্ডেলের মাধ্যমে প্রাথমিক সাপ্লাই জোন তৈরি করে।",
      "মাঝখানের পুলব্যাক একটি নেকলাইন সৃষ্টি করে এবং বায়াররা ২য় বার উপরে ওঠার চেষ্টা করে।",
      "২য় চূড়াটি সাপ্লাই জোনের ভেতরে স্পর্শ করে কিন্তু উপরে ব্রেকআউট ক্লোজ দিতে ব্যর্থ হয়।",
      "২য় চূড়ায় সাথে সাথে লাল রিভার্সাল ক্যান্ডেল তৈরি হয়ে সেলারদের আধিপত্য নিশ্চিত করে।",
    ],
    entryStrategyEn: "Execute PUT as soon as the second peak touches the Supply Zone ceiling (MOS) or upon close of the confirmation red candle.",
    entryStrategyBn: "২য় পিক যখন সাপ্লাই জোনে স্পর্শ করে তখন মার্জিন অফ সেফটি সহ অথবা লাল রিভার্সাল ক্যান্ডেল ক্লোজে PUT ট্রেড নিন।",
    invalidationEn: "A full solid green candle body close clearly above the Supply Zone box invalidates the setup.",
    invalidationBn: "সাপ্লাই জোনের উপরে সম্পূর্ণ গ্রিন ক্যান্ডেল বডি ক্লোজ দিলে সেটআপ বাতিল।",
    mosRuleEn: "Wait for price to push into the upper 50% of the Supply Zone box in the first 15s before pressing PUT.",
    mosRuleBn: "প্রথম ১৫ সেকেন্ডে সাপ্লাই জোনের ওপরের ৫০% অংশে প্রাইস রিটেস্ট দিলে সেরা MOS এন্ট্রি পাওয়া যায়।",
    linkedScenarioId: "OTC_SURESHOT_50_RETEST",
    diagramConfig: {
      zoneTopPercent: 12,
      zoneHeightPercent: 14,
      zoneLabel: "SUPPLY",
      zoneType: "supply",
      candles: [
        { id: "c1", color: "green", bodyY: 48, bodyH: 26, wickTop: 44, wickBottom: 76 },
        { id: "c2", color: "green", bodyY: 26, bodyH: 22, wickTop: 22, wickBottom: 50 },
        { id: "c3", color: "red", bodyY: 15, bodyH: 15, wickTop: 12, wickBottom: 33, label: "Top 1" },
        { id: "c4", color: "red", bodyY: 30, bodyH: 20, wickTop: 28, wickBottom: 52 },
        { id: "c5", color: "red", bodyY: 48, bodyH: 22, wickTop: 46, wickBottom: 74 },
        { id: "c6", color: "green", bodyY: 52, bodyH: 18, wickTop: 48, wickBottom: 72 },
        { id: "c7", color: "green", bodyY: 34, bodyH: 18, wickTop: 30, wickBottom: 54 },
        { id: "c8", color: "green", bodyY: 18, bodyH: 16, wickTop: 13, wickBottom: 36, label: "Top 2" },
        { id: "c9", color: "red", bodyY: 22, bodyH: 22, wickTop: 16, wickBottom: 46, isTrigger: true, annotation: "PUT Entry", annotationBn: "PUT এন্ট্রি" },
        { id: "c10", color: "red", bodyY: 44, bodyH: 26, wickTop: 42, wickBottom: 72 },
        { id: "c11", color: "red", bodyY: 68, bodyH: 24, wickTop: 66, wickBottom: 94 },
      ],
    },
  },
  {
    id: "sd_double_bottom",
    number: 2,
    titleEn: "Double Bottom at Demand Zone",
    titleBn: "ডিমান্ড জোনে ডাবল বটম রিভার্সাল",
    category: "Supply & Demand",
    type: "Reversal",
    signal: "CALL",
    winRateEst: "87% - 92%",
    expiry: "1M",
    zoneType: "Demand Zone",
    summaryEn: "Price plummets into an established Demand Zone (Buyer Order Block), bounces upward, and then conducts a second liquidity retest of the demand floor. Strong buyer absorption creates a massive bullish rocket.",
    summaryBn: "প্রাইস দ্রুত নেমে এসে পূর্ববর্তী ডিমান্ড জোনে (বায়ার অর্ডার ব্লক) সাপোর্ট পায়, কিছুটা রিবাউন্ড করে আবার ডিমান্ড ফ্লোর রিটেস্ট করে। বায়ারদের শক্তিশালী বাই প্রেসারে চার্টে তীব্র ঊর্ধ্বমুখী রকেট শুরু হয়।",
    structureRulesEn: [
      "Bottom 1 establishes the Demand Zone with long lower wicks or instant buying reaction.",
      "Interim bounce creates a swing high neckline.",
      "Bottom 2 taps into the Demand Zone, collecting sell-side liquidity without closing below.",
      "A strong green expansion candle immediately initiates from the Demand floor.",
    ],
    structureRulesBn: [
      "১ম বটমটি লোয়ার উইক বা গ্রিন ক্যান্ডেলের মাধ্যমে ডিমান্ড জোনের সীমানা নির্ধারণ করে।",
      "মাঝখানের বাউন্স একটি অন্তর্বর্তীকালীন নেকলাইন তৈরি করে।",
      "২য় বটমটি ডিমান্ড জোনের ভেতরে প্রবেশ করে লিকুইডিটি সংগ্রহ করে কিন্তু নিচে ব্রেকডাউন দেয় না।",
      "ডিমান্ড ফ্লোর থেকে তীব্র গতিতে গ্রিন ক্যান্ডেল তৈরি হয়ে আপট্রেন্ড নিশ্চিত করে।",
    ],
    entryStrategyEn: "Execute CALL immediately when Bottom 2 dips into the Demand Zone floor (MOS) or on close of the first green engulfing bar.",
    entryStrategyBn: "২য় বটমে প্রাইস যখন ডিমান্ড জোনের নিচে স্পর্শ করে তখন MOS সহ অথবা প্রথম শক্তিশালী গ্রিন ক্যান্ডেলের শুরুতে CALL নিন।",
    invalidationEn: "A decisive solid red candle close below the Demand Zone invalidates the bullish thesis.",
    invalidationBn: "ডিমান্ড জোনের নিচে স্পষ্ট রেড ক্যান্ডেল বডি ক্লোজ দিলে সেটআপ বাতিল।",
    mosRuleEn: "Enter CALL on a dip into the lowest 30% of the Demand Zone for maximum win buffer.",
    mosRuleBn: "ডিমান্ড জোনের নিচের ৩০% অংশে ডিপ দিলে মার্জিন অফ সেফটি সহ নিখুঁত CALL এন্ট্রি হয়।",
    linkedScenarioId: "OTC_SURESHOT_50_RETEST",
    diagramConfig: {
      zoneTopPercent: 78,
      zoneHeightPercent: 14,
      zoneLabel: "DEMAND",
      zoneType: "demand",
      candles: [
        { id: "c1", color: "red", bodyY: 18, bodyH: 26, wickTop: 14, wickBottom: 46 },
        { id: "c2", color: "red", bodyY: 42, bodyH: 24, wickTop: 40, wickBottom: 68 },
        { id: "c3", color: "red", bodyY: 66, bodyH: 18, wickTop: 64, wickBottom: 88, label: "Bottom 1" },
        { id: "c4", color: "green", bodyY: 52, bodyH: 20, wickTop: 50, wickBottom: 74 },
        { id: "c5", color: "green", bodyY: 28, bodyH: 24, wickTop: 24, wickBottom: 54 },
        { id: "c6", color: "red", bodyY: 34, bodyH: 20, wickTop: 30, wickBottom: 56 },
        { id: "c7", color: "red", bodyY: 54, bodyH: 20, wickTop: 52, wickBottom: 76 },
        { id: "c8", color: "red", bodyY: 72, bodyH: 16, wickTop: 70, wickBottom: 90, label: "Bottom 2" },
        { id: "c9", color: "green", bodyY: 62, bodyH: 22, wickTop: 58, wickBottom: 85, isTrigger: true, annotation: "CALL Entry", annotationBn: "CALL এন্ট্রি" },
        { id: "c10", color: "green", bodyY: 38, bodyH: 24, wickTop: 34, wickBottom: 64 },
        { id: "c11", color: "green", bodyY: 10, bodyH: 28, wickTop: 6, wickBottom: 40 },
      ],
    },
  },
  {
    id: "sd_flag_bullish",
    number: 3,
    titleEn: "Flag Continuation Bullish into Demand",
    titleBn: "ডিমান্ড বেস থেকে বুলিশ ফ্ল্যাগ কন্টিনিউয়েশন",
    category: "Supply & Demand",
    type: "Continuation",
    signal: "CALL",
    winRateEst: "85% - 89%",
    expiry: "1M",
    zoneType: "Demand Zone",
    summaryEn: "An explosive impulsive rally (Flagpole) creates an origin Demand base. Price consolidates within a downward-sloping parallel channel (Flag) directly into the Demand zone before blasting off into a secondary expansion wave.",
    summaryBn: "একটি শক্তিশালী ইমপালসিভ র‍্যালি (ফ্ল্যাগপোল) এর মাধ্যমে মূল ডিমান্ড বেস তৈরি হয়। এরপর প্রাইস নিচের দিকে ঢালু একটি চ্যানেলে (ফ্ল্যাগ) কনসোলিডেশন করে সোজা আদি ডিমান্ড জোনে নামে এবং সেখান থেকে রকেট গতিতে ২য় বুলিশ ওয়েভ শুরু করে।",
    structureRulesEn: [
      "Impulsive green pole launches off the origin Demand base.",
      "Orderly corrective pullback forms parallel descending channel lines (Flag).",
      "The lower edge of the flag terminates precisely on top of the origin Demand Zone.",
      "A sudden high-volume breakout green candle pierces the upper channel line.",
    ],
    structureRulesBn: [
      "মূল ডিমান্ড জোন থেকে একটি খাড়া গ্রিন ক্যান্ডেল র‍্যালি (পোল) তৈরি হয়।",
      "পরবর্তীতে নিচের দিকে সমান্তরাল চ্যানেলে সুশৃঙ্খল রিট্রেসমেন্ট (ফ্ল্যাগ) ঘটে।",
      "ফ্ল্যাগের নিচের প্রান্ত ঠিক মূল ডিমান্ড জোনে এসে ঠেকে এবং সাপোর্ট নেয়।",
      "একটি বড় গ্রিন ক্যান্ডেল ওপরের চ্যানেল লাইন ভেঙে ব্রেকআউট দেয়।",
    ],
    entryStrategyEn: "Execute CALL on the touch of the Demand Zone at the channel bottom, or on the breakout close above the upper flag trendline.",
    entryStrategyBn: "ফ্ল্যাগের নিচে ডিমান্ড জোনে টাচ করলে MOS সহ অথবা ওপরের চ্যানেল ব্রেকআউট ক্লোজে CALL ট্রেড প্লেস করুন।",
    invalidationEn: "Price breaking and closing below the origin Demand base negates the flag formation.",
    invalidationBn: "ডিমান্ড জোনের নিচে বডি ক্লোজ দিলে ফ্ল্যাগ প্যাটার্ন বাতিল গণ্য হবে।",
    mosRuleEn: "Enter CALL when the candle wicks into the upper boundary of the Demand box inside the channel.",
    mosRuleBn: "চ্যানেলের ভেতরে ডিমান্ড জোনের উপরিভাগে ক্যান্ডেল উইক টেস্ট করলে দারুণ MOS পাওয়া যায়।",
    linkedScenarioId: "OTC_SURESHOT_MOMENTUM_CONT",
    diagramConfig: {
      zoneTopPercent: 78,
      zoneHeightPercent: 14,
      zoneLabel: "DEMAND",
      zoneType: "demand",
      trendLines: [
        { x1: 28, y1: 24, x2: 78, y2: 66, color: "#9CA3AF", style: "dashed" },
        { x1: 36, y1: 42, x2: 86, y2: 84, color: "#9CA3AF", style: "dashed" },
      ],
      candles: [
        { id: "c1", color: "green", bodyY: 76, bodyH: 14, wickTop: 74, wickBottom: 90 },
        { id: "c2", color: "green", bodyY: 52, bodyH: 24, wickTop: 48, wickBottom: 78 },
        { id: "c3", color: "green", bodyY: 26, bodyH: 26, wickTop: 22, wickBottom: 54, label: "Pole Peak" },
        { id: "c4", color: "red", bodyY: 34, bodyH: 14, wickTop: 30, wickBottom: 50 },
        { id: "c5", color: "green", bodyY: 38, bodyH: 12, wickTop: 36, wickBottom: 52 },
        { id: "c6", color: "red", bodyY: 48, bodyH: 16, wickTop: 44, wickBottom: 66 },
        { id: "c7", color: "green", bodyY: 52, bodyH: 14, wickTop: 48, wickBottom: 68 },
        { id: "c8", color: "red", bodyY: 66, bodyH: 16, wickTop: 62, wickBottom: 84, label: "Demand Tap" },
        { id: "c9", color: "green", bodyY: 54, bodyH: 22, wickTop: 50, wickBottom: 78, isTrigger: true, annotation: "Breakout CALL", annotationBn: "ব্রেকআউট CALL" },
        { id: "c10", color: "green", bodyY: 28, bodyH: 26, wickTop: 24, wickBottom: 56 },
        { id: "c11", color: "green", bodyY: 6, bodyH: 22, wickTop: 2, wickBottom: 30 },
      ],
    },
  },
  {
    id: "sd_flag_bearish",
    number: 4,
    titleEn: "Flag Continuation Bearish into Supply",
    titleBn: "সাপ্লাই বেস থেকে বিয়ারিশ ফ্ল্যাগ কন্টিনিউয়েশন",
    category: "Supply & Demand",
    type: "Continuation",
    signal: "PUT",
    winRateEst: "85% - 90%",
    expiry: "1M",
    zoneType: "Supply Zone",
    summaryEn: "A violent selloff (Bearish Pole) creates an origin Supply zone. Price grinds upward in an ascending parallel channel (Bear Flag) until it taps directly into the Supply box, where fresh institutional sell orders ignite another leg down.",
    summaryBn: "তীব্র সেলঅফ (বিয়ারিশ পোল) এর মাধ্যমে মূল সাপ্লাই জোন তৈরি হয়। এরপর প্রাইস সমান্তরাল ঊর্ধ্বমুখী চ্যানেলে (বিয়ার ফ্ল্যাগ) ধীরে ধীরে উঠে সোজা সাপ্লাই জোনে গিয়ে স্পর্শ করে এবং সেখান থেকে দ্বিতীয় দফা তীব্র পতন ঘটে।",
    structureRulesEn: [
      "Impulsive red waterfall drops from the Supply zone benchmark.",
      "Correction rallies upward in an ascending parallel channel (Bear Flag).",
      "The highest swing of the flag touches directly into the overhead Supply Zone.",
      "Instant aggressive red breakout candle breaches the lower channel boundary.",
    ],
    structureRulesBn: [
      "সাপ্লাই জোন থেকে খাড়া লাল ক্যান্ডেলগুলোর তীব্র পতন (পোল) তৈরি হয়।",
      "মার্কেট ওপরের দিকে সমান্তরাল চ্যানেলে ধীরগতিতে পুলব্যাক (বিয়ার ফ্ল্যাগ) দেয়।",
      "ফ্ল্যাগের সর্বোচ্চ সুইংটি সোজা মাথার ওপরের সাপ্লাই জোনে গিয়ে স্পর্শ করে।",
      "তীব্র শক্তিশালী লাল ব্রেকআউট ক্যান্ডেল চ্যানেলের নিচের দাগ ভেঙে নিচে নেমে যায়।",
    ],
    entryStrategyEn: "Execute PUT when the flag's upper touch hits the Supply Zone (MOS) or on the breakdown close below the lower channel line.",
    entryStrategyBn: "ফ্ল্যাগের ওপরের প্রান্ত সাপ্লাই জোনে ঠেকলে MOS সহ অথবা নিচের চ্যানেল ব্রেকডাউনে PUT এন্ট্রি নিন।",
    invalidationEn: "A solid green candle body closing above the Supply Zone box cancels the bearish continuation.",
    invalidationBn: "সাপ্লাই জোনের ওপরে গ্রিন ক্যান্ডেল ক্লোজ দিলে বিয়ারিশ সেটআপ অকার্যকর।",
    mosRuleEn: "Enter PUT on a fast green spike into the Supply Zone floor within the first 15 seconds.",
    mosRuleBn: "প্রথম ১৫ সেকেন্ডে সাপ্লাই জোনে দ্রুত গ্রিন স্পাইক দিলে সেরা মার্জিন অফ সেফটি পাওয়া যায়।",
    linkedScenarioId: "OTC_SURESHOT_MOMENTUM_CONT",
    diagramConfig: {
      zoneTopPercent: 14,
      zoneHeightPercent: 14,
      zoneLabel: "SUPPLY",
      zoneType: "supply",
      trendLines: [
        { x1: 24, y1: 76, x2: 76, y2: 32, color: "#9CA3AF", style: "dashed" },
        { x1: 32, y1: 94, x2: 84, y2: 50, color: "#9CA3AF", style: "dashed" },
      ],
      candles: [
        { id: "c1", color: "red", bodyY: 16, bodyH: 16, wickTop: 12, wickBottom: 34 },
        { id: "c2", color: "red", bodyY: 34, bodyH: 24, wickTop: 32, wickBottom: 60 },
        { id: "c3", color: "red", bodyY: 60, bodyH: 26, wickTop: 58, wickBottom: 88, label: "Pole Base" },
        { id: "c4", color: "green", bodyY: 68, bodyH: 14, wickTop: 64, wickBottom: 84 },
        { id: "c5", color: "red", bodyY: 62, bodyH: 12, wickTop: 60, wickBottom: 76 },
        { id: "c6", color: "green", bodyY: 48, bodyH: 16, wickTop: 44, wickBottom: 66 },
        { id: "c7", color: "red", bodyY: 44, bodyH: 14, wickTop: 40, wickBottom: 60 },
        { id: "c8", color: "green", bodyY: 26, bodyH: 18, wickTop: 16, wickBottom: 46, label: "Supply Tap" },
        { id: "c9", color: "red", bodyY: 36, bodyH: 24, wickTop: 28, wickBottom: 62, isTrigger: true, annotation: "Breakdown PUT", annotationBn: "ব্রেকডাউন PUT" },
        { id: "c10", color: "red", bodyY: 60, bodyH: 26, wickTop: 58, wickBottom: 88 },
        { id: "c11", color: "red", bodyY: 84, bodyH: 14, wickTop: 82, wickBottom: 98 },
      ],
    },
  },
  {
    id: "sd_retest_bullish",
    number: 5,
    titleEn: "Retest Continuation Bullish at Demand",
    titleBn: "ডিমান্ড জোনে রিটেস্ট বুলিশ কন্টিনিউয়েশন",
    category: "Supply & Demand",
    type: "Continuation",
    signal: "CALL",
    winRateEst: "88% - 93%",
    expiry: "1M",
    zoneType: "Demand Zone",
    summaryEn: "Following a breakout and strong uptrend wave, market makes a deep multi-candle retracement directly back into the unmitigated origin Demand zone. Rejection wicks at the demand base signal buyer protection and trigger continuation.",
    summaryBn: "ব্রেকআউট ও প্রথম আপট্রেন্ড ওয়েভের পর মার্কেট একটি গভীর রিট্রেসমেন্ট করে সোজা মূল আনমিটিগেটেড ডিমান্ড জোনে ফিরে আসে। ডিমান্ড জোনে লোয়ার উইক রিজেকশন তৈরি হওয়া মাত্র বায়ারদের ডিফেন্স সক্রিয় হয় এবং নতুন হাই তৈরি হয়।",
    structureRulesEn: [
      "Origin Demand Zone creates a strong expansion move to swing high.",
      "Intermediate pullback forms a temporary higher low/neckline before rallying.",
      "Deep pullback falls back to test the primary origin Demand Base (Golden Mitigation).",
      "Demand zone absorbs selling with long lower rejection wicks; next candle opens green.",
    ],
    structureRulesBn: [
      "মূল ডিমান্ড জোন থেকে প্রথম তীব্র বুলিশ ওয়েভ শুরু হয়ে নতুন সুইং হাই তৈরি করে।",
      "মাঝপথে ছোট পুলব্যাক হলেও পরবর্তীতে মার্কেট আরও উপরে যায়।",
      "এরপর দীর্ঘ ও গভীর রিট্রেসমেন্ট ঘটে সরাসরি আদি ডিমান্ড জোনে ফিরে আসে।",
      "ডিমান্ড বেসে রিজেকশন উইক দেখা দেয় এবং পরবর্তী গ্রিন ক্যান্ডেলে বুলিশ রকেট শুরু হয়।",
    ],
    entryStrategyEn: "Execute CALL on the exact touch of the Demand Box boundary (MOS) or on close of the rejection pin bar.",
    entryStrategyBn: "ডিমান্ড জোনের উপরের দাগে টাচ করার সাথে সাথে MOS সহ অথবা রিজেকশন পিনবার ক্লোজে CALL নিন।",
    invalidationEn: "A full solid red candle body closing below the Demand Zone cancels the continuation trade.",
    invalidationBn: "ডিমান্ড জোনের নিচে রেড ক্যান্ডেল বডি ক্লোজ দিলে সেটআপ বাতিল।",
    mosRuleEn: "Enter CALL when the running candle pierces the Demand Zone within seconds 01-15.",
    mosRuleBn: "প্রথম ১৫ সেকেন্ডে ক্যান্ডেল ডিমান্ড জোনে ডুব দিলে মার্জিন অফ সেফটি দিয়ে CALL নিন।",
    linkedScenarioId: "OTC_SURESHOT_50_RETEST",
    diagramConfig: {
      zoneTopPercent: 80,
      zoneHeightPercent: 14,
      zoneLabel: "DEMAND",
      zoneType: "demand",
      trendLines: [
        { x1: 44, y1: 52, x2: 68, y2: 52, color: "#6B7280", style: "dashed" },
      ],
      candles: [
        { id: "c1", color: "green", bodyY: 78, bodyH: 14, wickTop: 74, wickBottom: 92 },
        { id: "c2", color: "green", bodyY: 52, bodyH: 26, wickTop: 48, wickBottom: 80 },
        { id: "c3", color: "green", bodyY: 26, bodyH: 26, wickTop: 18, wickBottom: 54, label: "Swing High" },
        { id: "c4", color: "red", bodyY: 34, bodyH: 18, wickTop: 30, wickBottom: 54 },
        { id: "c5", color: "green", bodyY: 40, bodyH: 12, wickTop: 36, wickBottom: 54 },
        { id: "c6", color: "red", bodyY: 48, bodyH: 18, wickTop: 44, wickBottom: 68 },
        { id: "c7", color: "red", bodyY: 66, bodyH: 18, wickTop: 62, wickBottom: 86, label: "Demand Retest" },
        { id: "c8", color: "green", bodyY: 56, bodyH: 22, wickTop: 52, wickBottom: 84, isTrigger: true, annotation: "Continuation CALL", annotationBn: "কন্টিনিউয়েশন CALL" },
        { id: "c9", color: "green", bodyY: 30, bodyH: 26, wickTop: 24, wickBottom: 58 },
        { id: "c10", color: "green", bodyY: 10, bodyH: 20, wickTop: 6, wickBottom: 32 },
      ],
    },
  },
  {
    id: "sd_retest_bearish",
    number: 6,
    titleEn: "Retest Continuation Bearish at Supply",
    titleBn: "সাপ্লাই জোনে রিটেস্ট বিয়ারিশ কন্টিনিউয়েশন",
    category: "Supply & Demand",
    type: "Continuation",
    signal: "PUT",
    winRateEst: "88% - 93%",
    expiry: "1M",
    zoneType: "Supply Zone",
    summaryEn: "After a breakdown and severe downward impulse, price engages in a deep multi-candle corrective rally all the way back into the unmitigated origin Supply Zone. Upper wicks and seller defense trigger another massive drop.",
    summaryBn: "ব্রেকডাউন ও শক্তিশালী ডাউনট্রেন্ডের পর মার্কেট বহু ক্যান্ডেলে ধীরগতিতে র‍্যালি করে সোজা আদি আনমিটিগেটেড সাপ্লাই জোনে ফিরে আসে। সাপ্লাই লেভেলে আপার উইক রিজেকশন দেখা দেওয়া মাত্র সেলাররা সক্রিয় হয়ে নতুন লো তৈরি করে।",
    structureRulesEn: [
      "Origin Supply Zone acts as the institutional order block origin.",
      "Market drops sharply to a major swing low.",
      "Deep multi-step retracement rallies back to test the primary origin Supply level.",
      "Supply zone exhibits strong upper rejection wicks; follow-through red candle drops.",
    ],
    structureRulesBn: [
      "আদি সাপ্লাই জোনটি প্রাতিষ্ঠানিক সেল অর্ডারের মূল উৎস হিসেবে কাজ করে।",
      "মার্কেট খাড়াভাবে নেমে এসে প্রধান সুইং লো তৈরি করে।",
      "এরপর ধাপে ধাপে গভীর রিট্রেসমেন্ট করে সোজা আদি সাপ্লাই জোনে গিয়ে স্পর্শ করে।",
      "সাপ্লাই জোনে বড় আপার উইক রিজেকশন তৈরি হয় এবং পরবর্তী রেড ক্যান্ডেলে তীব্র পতন ঘটে।",
    ],
    entryStrategyEn: "Execute PUT when the retest candle pierces the Supply Zone boundary (MOS) or on close of the upper-wick rejection candle.",
    entryStrategyBn: "সাপ্লাই জোনের নিচের দাগ স্পর্শ করলে মার্জিন অফ সেফটি সহ অথবা রিজেকশন ক্যান্ডেল ক্লোজে PUT ট্রেড নিন।",
    invalidationEn: "A decisive solid green candle body closing above the Supply Zone box invalidates the bearish setup.",
    invalidationBn: "সাপ্লাই জোনের উপরে সলিড গ্রিন ক্যান্ডেল ক্লোজ দিলে বিয়ারিশ সেটআপ বাতিল।",
    mosRuleEn: "Enter PUT on a fast green spike into the Supply Zone floor within seconds 01-15.",
    mosRuleBn: "প্রথম ১৫ সেকেন্ডে গ্রিন স্পাইক সাপ্লাই জোনের ভেতরে ঢুকলে সেরা MOS এন্ট্রি হয়।",
    linkedScenarioId: "OTC_SURESHOT_50_RETEST",
    diagramConfig: {
      zoneTopPercent: 14,
      zoneHeightPercent: 14,
      zoneLabel: "SUPPLY",
      zoneType: "supply",
      trendLines: [
        { x1: 44, y1: 52, x2: 68, y2: 52, color: "#6B7280", style: "dashed" },
      ],
      candles: [
        { id: "c1", color: "red", bodyY: 16, bodyH: 16, wickTop: 12, wickBottom: 34 },
        { id: "c2", color: "red", bodyY: 34, bodyH: 26, wickTop: 32, wickBottom: 62 },
        { id: "c3", color: "red", bodyY: 62, bodyH: 26, wickTop: 60, wickBottom: 90, label: "Swing Low" },
        { id: "c4", color: "green", bodyY: 68, bodyH: 16, wickTop: 64, wickBottom: 86 },
        { id: "c5", color: "red", bodyY: 60, bodyH: 12, wickTop: 58, wickBottom: 74 },
        { id: "c6", color: "green", bodyY: 46, bodyH: 18, wickTop: 42, wickBottom: 66 },
        { id: "c7", color: "green", bodyY: 26, bodyH: 20, wickTop: 15, wickBottom: 48, label: "Supply Retest" },
        { id: "c8", color: "red", bodyY: 36, bodyH: 24, wickTop: 28, wickBottom: 62, isTrigger: true, annotation: "Continuation PUT", annotationBn: "কন্টিনিউয়েশন PUT" },
        { id: "c9", color: "red", bodyY: 60, bodyH: 26, wickTop: 58, wickBottom: 88 },
        { id: "c10", color: "red", bodyY: 84, bodyH: 14, wickTop: 82, wickBottom: 98 },
      ],
    },
  },
  {
    id: "cs_morning_star",
    number: 7,
    titleEn: "Morning Star 3-Candle Reversal",
    titleBn: "মর্নিং স্টার ৩-ক্যান্ডেল রিভার্সাল",
    category: "Star Candlesticks",
    type: "Reversal",
    signal: "CALL",
    winRateEst: "89% - 94%",
    expiry: "1M",
    zoneType: "Star Cluster",
    summaryEn: "A premier 3-candle bottom reversal formation. Candle 1 is a large bearish red candle; Candle 2 is a small indecision star/doji gapping or basing at the extreme low; Candle 3 is a solid bullish green candle closing >50% into Candle 1's body. Confirms an institutional trend reversal.",
    summaryBn: "মার্কেট বটমের শীর্ষ ৩-ক্যান্ডেল রিভার্সাল প্যাটার্ন। ১ম ক্যান্ডেলটি বড় বিয়ারিশ লাল; ২য় ক্যান্ডেলটি ছোট ডোজি/স্টার যা সর্বনিম্ন লেভেলে ইনডিসিশন দেখায়; ৩য় ক্যান্ডেলটি শক্তিশালী গ্রিন যা ১ম ক্যান্ডেলের ৫০% বডির ওপরে ক্লোজ দেয়।",
    structureRulesEn: [
      "Candle 1: Strong Bearish Red in an existing downtrend.",
      "Candle 2 (The Star): Small body (Doji/Spinning Top) at the bottom showing selling exhaustion.",
      "Candle 3: Strong Bullish Green closing at least >50% into Candle 1's real body (or full engulf).",
      "Stop Loss / Invalidation anchor is placed right below the low of the Star's lower wick.",
    ],
    structureRulesBn: [
      "১ম ক্যান্ডেল: চলমান ডাউনট্রেন্ডে বড় সলিড রেড ক্যান্ডেল।",
      "২য় ক্যান্ডেল (স্টার): তলদেশে ছোট বডির ডোজি বা স্পিনিং টপ যা সেলারদের দুর্বলতা প্রমাণ করে।",
      "৩য় ক্যান্ডেল: বড় গ্রিন ক্যান্ডেল যা ১ম লাল ক্যান্ডেলের কমপক্ষে ৫০% বডির ওপরে ক্লোজ দেয়।",
      "স্টপ লস / সাপোর্ট লেভেল স্টার ক্যান্ডেলের লোয়ার উইকের নিচে নির্ধারণ করা হয়।",
    ],
    entryStrategyEn: "Execute CALL on close of Candle 3, or on a 15-second opening pullback towards the 50% midpoint of Candle 3.",
    entryStrategyBn: "৩য় গ্রিন ক্যান্ডেল ক্লোজ হওয়া মাত্র অথবা পরবর্তী ক্যান্ডেলের প্রথম ১৫ সেকেন্ডের পুলব্যাকে CALL এন্ট্রি নিন।",
    invalidationEn: "If Candle 3 fails to close above 50% of Candle 1, or if price breaks below the Star's low, invalidate setup.",
    invalidationBn: "৩য় ক্যান্ডেল ১ম ক্যান্ডেলের ৫০% বডির নিচে ক্লোজ দিলে বা স্টারের নিচে নেমে গেলে সেটআপ বাতিল।",
    mosRuleEn: "Wait for the 4th candle to retest the high of the Star/Candle 1 close for flawless Margin of Safety.",
    mosRuleBn: "৪র্থ ক্যান্ডেল ১ম ক্যান্ডেলের ক্লোজ লেভেল রিটেস্ট করলে নিখুঁত মার্জিন অফ সেফটি এন্ট্রি হয়।",
    linkedScenarioId: "OTC_SURESHOT_50_RETEST",
    diagramConfig: {
      zoneTopPercent: 68,
      zoneHeightPercent: 24,
      zoneLabel: "STAR CLUSTER",
      zoneType: "demand",
      candles: [
        { id: "c1", color: "red", bodyY: 10, bodyH: 22, wickTop: 6, wickBottom: 34 },
        { id: "c2", color: "red", bodyY: 30, bodyH: 24, wickTop: 28, wickBottom: 56 },
        { id: "c3", color: "red", bodyY: 54, bodyH: 26, wickTop: 52, wickBottom: 82, label: "C1 (Red)" },
        { id: "c4", color: "red", bodyY: 82, bodyH: 8, wickTop: 78, wickBottom: 94, label: "Star Doji" },
        { id: "c5", color: "green", bodyY: 48, bodyH: 34, wickTop: 44, wickBottom: 82, label: "C3 (>50%)", isTrigger: true, annotation: "Entry CALL", annotationBn: "এন্ট্রি CALL" },
        { id: "c6", color: "green", bodyY: 28, bodyH: 24, wickTop: 24, wickBottom: 54 },
        { id: "c7", color: "green", bodyY: 8, bodyH: 22, wickTop: 4, wickBottom: 32 },
      ],
    },
  },
  {
    id: "cs_evening_star",
    number: 8,
    titleEn: "Evening Star 3-Candle Reversal",
    titleBn: "ইভনিং স্টার ৩-ক্যান্ডেল রিভার্সাল",
    category: "Star Candlesticks",
    type: "Reversal",
    signal: "PUT",
    winRateEst: "89% - 94%",
    expiry: "1M",
    zoneType: "Star Cluster",
    summaryEn: "A premier 3-candle top reversal formation. Candle 1 is a strong bullish green candle; Candle 2 is a small indecision star/doji at the top; Candle 3 is a solid bearish red candle closing >50% into Candle 1's body. Confirms a powerful shift from buyers to sellers.",
    summaryBn: "মার্কেট চূড়ার শীর্ষ ৩-ক্যান্ডেল বিয়ারিশ রিভার্সাল প্যাটার্ন। ১ম ক্যান্ডেলটি বড় বুলিশ গ্রিন; ২য় ক্যান্ডেলটি সর্বোচ্চ লেভেলে ছোট স্টার/ডোজি; ৩য় ক্যান্ডেলটি শক্তিশালী লাল ক্যান্ডেল যা ১ম ক্যান্ডেলের ৫০% বডির নিচে ক্লোজ দেয়।",
    structureRulesEn: [
      "Candle 1: Strong Bullish Green in an established uptrend.",
      "Candle 2 (The Star): Small body (Doji/Spinning Top) at the peak indicating buyer exhaustion.",
      "Candle 3: Strong Bearish Red closing at least >50% into Candle 1's real body (or full engulf).",
      "Stop Loss / Resistance anchor is placed above the high of the Star's upper wick.",
    ],
    structureRulesBn: [
      "১ম ক্যান্ডেল: আপট্রেন্ডে বড় সলিড গ্রিন ক্যান্ডেল।",
      "২য় ক্যান্ডেল (স্টার): চূড়ায় ছোট বডির ডোজি বা স্পিনিং টপ যা বায়ারদের সমাপ্তি নির্দেশ করে।",
      "৩য় ক্যান্ডেল: বড় লাল ক্যান্ডেল যা ১ম গ্রিন ক্যান্ডেলের ৫০% বডির নিচে ক্লোজ দেয়।",
      "স্টপ লস / রেজিস্ট্যান্স লেভেল স্টার ক্যান্ডেলের আপার উইকের ওপরে রাখা হয়।",
    ],
    entryStrategyEn: "Execute PUT on close of Candle 3, or on a 15-second opening spike into the 50% body of Candle 3.",
    entryStrategyBn: "৩য় রেড ক্যান্ডেল ক্লোজে অথবা পরবর্তী ক্যান্ডেলের প্রথম ১৫ সেকেন্ডের আপওয়ার্ড স্পাইকে PUT এন্ট্রি নিন।",
    invalidationEn: "If Candle 3 fails to close below 50% of Candle 1, or if price breaks above the Star's peak, invalidate setup.",
    invalidationBn: "৩য় ক্যান্ডেল ১ম ক্যান্ডেলের ৫০% বডির ওপরে ক্লোজ দিলে বা স্টারের হাই ব্রেক করলে সেটআপ বাতিল।",
    mosRuleEn: "Wait for the 4th candle to retest the base of Candle 1 / Star low for a high-probability Margin of Safety PUT.",
    mosRuleBn: "৪র্থ ক্যান্ডেল সামান্য ওপরে স্পাইক দিয়ে স্টার বেস স্পর্শ করলে সর্বোচ্চ সেফটি সহ PUT প্লেস করুন।",
    linkedScenarioId: "OTC_SURESHOT_50_RETEST",
    diagramConfig: {
      zoneTopPercent: 8,
      zoneHeightPercent: 24,
      zoneLabel: "STAR CLUSTER",
      zoneType: "supply",
      candles: [
        { id: "c1", color: "green", bodyY: 74, bodyH: 22, wickTop: 70, wickBottom: 98 },
        { id: "c2", color: "green", bodyY: 52, bodyH: 24, wickTop: 48, wickBottom: 76 },
        { id: "c3", color: "green", bodyY: 26, bodyH: 26, wickTop: 22, wickBottom: 54, label: "C1 (Green)" },
        { id: "c4", color: "red", bodyY: 10, bodyH: 8, wickTop: 4, wickBottom: 22, label: "Star Doji" },
        { id: "c5", color: "red", bodyY: 24, bodyH: 34, wickTop: 20, wickBottom: 60, label: "C3 (>50%)", isTrigger: true, annotation: "Entry PUT", annotationBn: "এন্ট্রি PUT" },
        { id: "c6", color: "red", bodyY: 54, bodyH: 24, wickTop: 52, wickBottom: 80 },
        { id: "c7", color: "red", bodyY: 76, bodyH: 20, wickTop: 72, wickBottom: 98 },
      ],
    },
  },
];
