export interface GapCandleDiagram {
  label: string;
  color: "green" | "red" | "gray";
  bodyHeight: number; // 1-100
  upperWick: number;  // 0-40
  lowerWick: number;  // 0-40
  offsetY?: number;   // vertical shift in px or % for gaps
  isKeyAction?: boolean;
  annotation?: string;
  annotationBn?: string;
  badge?: string;
}

export interface GapPattern {
  id: string;
  number: number;
  titleEn: string;
  titleBn: string;
  category: "Reversal Gaps" | "Continuation Gaps" | "Liquidity Run Gaps" | "Weekend / Session Gaps" | "Gap Fill Mitigation";
  categoryBn: string;
  type: "BULLISH" | "BEARISH";
  action: "CALL" | "PUT";
  winRateEst: string;
  expiry: "1M" | "2M";
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  summaryEn: string;
  summaryBn: string;
  marketLogicEn: string;
  marketLogicBn: string;
  coreRuleEn: string;
  coreRuleBn: string;
  executionStepsEn: string[];
  executionStepsBn: string[];
  invalidationEn: string;
  invalidationBn: string;
  otcNuanceEn: string;
  otcNuanceBn: string;
  diagram: {
    zoneType?: "SUPPLY" | "DEMAND" | "LIQUIDITY" | "FAKEOUT" | "OB REVERSAL";
    zonePosition: "TOP" | "BOTTOM" | "MIDDLE";
    gapPosition: {
      fromCandleIdx: number;
      toCandleIdx: number;
      label: string;
    };
    hasGapFillLine?: boolean;
    candles: GapCandleDiagram[];
  };
}

export const GAP_PATTERNS: GapPattern[] = [
  {
    id: "gap_01_reversal_bearish",
    number: 1,
    titleEn: "Reversal Bearish Gap (Supply OB Reversal)",
    titleBn: "রিভার্সাল বেয়ারিশ গ্যাপ (সাপ্লাই ও OB রিভার্সাল)",
    category: "Reversal Gaps",
    categoryBn: "রিভার্সাল গ্যাপস",
    type: "BEARISH",
    action: "PUT",
    winRateEst: "88% - 93%",
    expiry: "1M",
    difficulty: "INTERMEDIATE",
    summaryEn: "A powerful institutional reversal pattern where price pushes into a higher timeframe Supply Zone, forms a small Order Block (OB) reversal base, and violently gaps down before retesting the gap floor for a heavy selloff.",
    summaryBn: "একটি শক্তিশালী রিভার্সাল সেটআপ যেখানে প্রাইস সাপ্লাই জোনে পৌঁছানোর পর ছোট অর্ডার ব্লক (OB) তৈরি করে, হঠাৎ নিচের দিকে গ্যাপ তৈরি করে (Gap Down) ড্রপ করে এবং পুনরায় গ্যাপ রিটেস্টে ভারী সেল অফ দেয়।",
    marketLogicEn: "Smart money traps breakout buyers in the Supply zone, then abruptly shifts liquidity downwards. The small green retest candle provides the optimal discount entry to enter PUT with Margin of Safety.",
    marketLogicBn: "স্মার্ট মানি সাপ্লাই জোনে বায়ারদের ট্র্যাপ করে আকস্মিক নিচে গ্যাপ তৈরি করে। পরবর্তী ছোট গ্রিন রিটেস্ট ক্যান্ডেলটি সাপ্লাই গ্যাপ লেভেলে রিজেকশন দিয়ে নিখুঁত MOS PUT এন্ট্রি তৈরি করে।",
    coreRuleEn: "Wait for the green pullback candle to touch the bottom boundary of the Gap Zone / Supply level and show an immediate wick rejection within the first 15 seconds.",
    coreRuleBn: "সবুজ রিট্রেসমেন্ট ক্যান্ডেলটি প্রথম ১৫ সেকেন্ডের মধ্যে গ্যাপ লেভেল / সাপ্লাই জোনের লোয়ার বাউন্ডারি স্পর্শ করে রিজেকশন দিলেই PUT ট্রেড প্লেস করুন।",
    executionStepsEn: [
      "Identify a clean Supply Zone / Resistance on the left chart.",
      "Spot the green push followed by small hesitation Order Block candles.",
      "Observe the massive red displacement candle creating an unfilled GAP below supply.",
      "When the next candle pulls back green into the Gap boundary, execute a 1-Minute PUT trade with MOS.",
    ],
    executionStepsBn: [
      "বামে স্পষ্ট সাপ্লাই জোন বা রেজিস্ট্যান্স লেভেল চিহ্নিত করুন।",
      "গ্রিন পুশের পর ছোট কনসলিডেশন বা অর্ডার ব্লক ক্যান্ডেল লক্ষ্য করুন।",
      "হঠাৎ বড় লাল ক্যান্ডেলের নিচে ড্রপ ও গ্যাপ তৈরি পর্যবেক্ষণ করুন।",
      "পরবর্তী ক্যান্ডেল গ্যাপ লেভেলে সবুজ হয়ে রিটেস্ট করার সাথে সাথে মার্জিন অফ সেফটি সহ ১ মিনিটের PUT ট্রেড নিন।",
    ],
    invalidationEn: "If the green pullback candle closes with a full body inside or above the Supply zone without rejecting, cancel the trade setup.",
    invalidationBn: "যদি রিটেস্ট ক্যান্ডেলটি রিজেকশন ছাড়া সরাসরি সাপ্লাই জোনের ভেতরে বা উপরে বড় বডিতে ক্লোজ হয়, তবে ট্রেড বাতিল করুন।",
    otcNuanceEn: "In OTC binary markets, brokers use this gap to liquidate late buyers. Ensure the gap is at least 30% the height of the average candle body.",
    otcNuanceBn: "OTC মার্কেটে ব্রোকার অ্যালগরিদম বায়ারদের লিকুইডেট করতে এই গ্যাপ ড্রপ করে। গ্যাপটি সাধারণ ক্যান্ডেলের অন্তত ৩০% সাইজের হতে হবে।",
    diagram: {
      zoneType: "SUPPLY",
      zonePosition: "TOP",
      gapPosition: {
        fromCandleIdx: 2,
        toCandleIdx: 4,
        label: "GAP",
      },
      hasGapFillLine: true,
      candles: [
        { label: "C1", color: "green", bodyHeight: 70, upperWick: 10, lowerWick: 8, annotation: "Push Up", annotationBn: "বুলিশ পুশ" },
        { label: "C2", color: "red", bodyHeight: 25, upperWick: 8, lowerWick: 6, annotation: "OB Base", annotationBn: "অর্ডার ব্লক" },
        { label: "C3", color: "green", bodyHeight: 35, upperWick: 12, lowerWick: 8, annotation: "OB Reversal", annotationBn: "OB রিভার্সাল" },
        { label: "C4", color: "red", bodyHeight: 85, upperWick: 6, lowerWick: 12, annotation: "Gap Down", annotationBn: "বিশাল ড্রপ" },
        { label: "C5", color: "green", bodyHeight: 20, upperWick: 14, lowerWick: 6, isKeyAction: true, badge: "ENTRY PUT", annotation: "Gap Retest", annotationBn: "গ্যাপ রিটেস্ট এন্ট্রি" },
      ],
    },
  },
  {
    id: "gap_02_reversal_bullish",
    number: 2,
    titleEn: "Reversal Bullish Gap (Demand OB Reversal)",
    titleBn: "রিভার্সাল বুলিশ গ্যাপ (ডিমান্ড ও OB রিভার্সাল)",
    category: "Reversal Gaps",
    categoryBn: "রিভার্সাল গ্যাপস",
    type: "BULLISH",
    action: "CALL",
    winRateEst: "89% - 94%",
    expiry: "1M",
    difficulty: "INTERMEDIATE",
    summaryEn: "A high-probability bullish reversal setup where price dumps into a deep Demand Zone, consolidates into an Order Block base, and explodes up leaving an unfilled bullish gap before continuing into an aggressive rally.",
    summaryBn: "উচ্চ উইনরেটের বুলিশ রিভার্সাল যেখানে প্রাইস ডিমান্ড জোনে ড্রপ করার পর ছোট বেস তৈরি করে এবং আকস্মিক ঊর্ধ্বমুখী গ্যাপ (Gap Up) তৈরি করে রকেট গতিতে উপরে উঠে যায়।",
    marketLogicEn: "Institutions accumulate massive buy orders at the demand floor. The explosive green displacement gaps away from the liquidity pool. The slight red pullback mitigates the gap zone before the markup phase.",
    marketLogicBn: "ইনস্টিটিউশন ডিমান্ড লেভেলে বড় বাই অর্ডার সংগ্রহ করে। আকস্মিক গ্রিন ক্যান্ডেল গ্যাপ তৈরি করে উপরে ওঠে। এরপর ছোট রেড পুলব্যাক গ্যাপ মিটিগেট করে CALL র্যালির সুযোগ দেয়।",
    coreRuleEn: "Enter CALL with Margin of Safety when the red retest candle dips into the top boundary of the demand gap and gets rejected upwards.",
    coreRuleBn: "লাল রিটেস্ট ক্যান্ডেলটি ডিমান্ড গ্যাপের আপার বাউন্ডারি স্পর্শ করে রিজেকশন নিলেই মার্জিন অফ সেফটি সহ CALL ট্রেড নিন।",
    executionStepsEn: [
      "Locate strong historical Demand Zone / Support at the bottom of the chart.",
      "Identify the red drop followed by micro-consolidation OB candles.",
      "Confirm the massive green breakout candle creating a GAP above the demand zone.",
      "Wait for the next small red candle to retest the gap zone within seconds 01-15, then enter CALL.",
    ],
    executionStepsBn: [
      "নিচে শক্তিশালী ঐতিহাসিক ডিমান্ড জোন বা সাপোর্ট চিহ্নিত করুন।",
      "রেড ড্রপ ও পরবর্তী মাইক্রো-কনসলিডেশন ক্যান্ডেল লক্ষ্য করুন।",
      "বড় গ্রিন ব্রেকআউট ক্যান্ডেল দ্বারা সৃষ্ট গ্যাপ কনফার্ম করুন।",
      "পরবর্তী ছোট রেড ক্যান্ডেল গ্যাপ জোন রিটেস্ট করার সময় CALL এন্ট্রি নিন।",
    ],
    invalidationEn: "If the retest candle breaks cleanly below the Demand zone floor, abort the setup.",
    invalidationBn: "রিটেস্ট ক্যান্ডেলটি ডিমান্ড জোনের নিচে ব্রেক করে ক্লোজ হলে সেটআপ বাতিল হবে।",
    otcNuanceEn: "Look for strong lower wick rejection on the red pullback candle as confirmation of algorithmic buy orders firing.",
    otcNuanceBn: "রেড পুলব্যাক ক্যান্ডেলের নিচের উইক রিজেকশন অ্যালগরিদমিক বাই অর্ডারের সেরা নিশ্চয়তা।",
    diagram: {
      zoneType: "DEMAND",
      zonePosition: "BOTTOM",
      gapPosition: {
        fromCandleIdx: 2,
        toCandleIdx: 4,
        label: "GAP",
      },
      hasGapFillLine: true,
      candles: [
        { label: "C1", color: "red", bodyHeight: 65, upperWick: 8, lowerWick: 10, annotation: "Drop Down", annotationBn: "বেয়ারিশ ড্রপ" },
        { label: "C2", color: "green", bodyHeight: 25, upperWick: 8, lowerWick: 8, annotation: "Demand Base", annotationBn: "ডিমান্ড বেস" },
        { label: "C3", color: "red", bodyHeight: 30, upperWick: 6, lowerWick: 10, annotation: "OB Reversal", annotationBn: "OB রিভার্সাল" },
        { label: "C4", color: "green", bodyHeight: 85, upperWick: 14, lowerWick: 6, annotation: "Gap Up Expansion", annotationBn: "বিশাল বুলিশ গ্যাপ" },
        { label: "C5", color: "red", bodyHeight: 22, upperWick: 6, lowerWick: 14, isKeyAction: true, badge: "ENTRY CALL", annotation: "Gap Retest", annotationBn: "গ্যাপ রিটেস্ট CALL" },
      ],
    },
  },
  {
    id: "gap_03_weekend_bearish",
    number: 3,
    titleEn: "Weekend / Session Bearish Gap Trap",
    titleBn: "উইকেন্ড ও সেশন বেয়ারিশ গ্যাপ ট্র্যাপ",
    category: "Weekend / Session Gaps",
    categoryBn: "উইকেন্ড ও সেশন গ্যাপস",
    type: "BEARISH",
    action: "PUT",
    winRateEst: "86% - 91%",
    expiry: "1M",
    difficulty: "BEGINNER",
    summaryEn: "When the market reopens with an aggressive Gap UP after a strong prior downtrend, retail traders often chase the breakout. Smart money immediately sells into this opening liquidity, closing the gap with a swift red dump.",
    summaryBn: "ডাউনট্রেন্ডের পর সেশন বা উইকেন্ডের শুরুতে কৃত্রিম গ্যাপ-আপ (Gap Up) তৈরি হলে সাধারণ ট্রেডাররা বাই করে ট্র্যাপ হয়। বড় প্লেয়াররা সাথে সাথে সেল করে গ্যাপ পূরণ করে ট্রেন্ড ডাউন শুরু করে।",
    marketLogicEn: "The opening jump gap fills existing liquidity voids. Because the higher timeframe momentum is bearish, the market aggressively drives price down to fill the opening gap and break lower.",
    marketLogicBn: "ওপেনিং গ্যাপটি শুধুই লিকুইডিটি পূরণ করে। মূল ট্রেন্ড বেয়ারিশ হওয়ায় মার্কেট দ্রুত গ্যাপ ফিল করে নিচে নেমে যায়।",
    coreRuleEn: "On the first candle following the weekend gap up, wait for an upper wick rejection at resistance or opening print, then execute a 1-Minute PUT.",
    coreRuleBn: "উইকেন্ড গ্যাপ-আপের পর প্রথম ক্যান্ডেল রেজিস্ট্যান্সে আপার উইক রিজেকশন দিলেই ১ মিনিটের PUT এন্ট্রি নিন।",
    executionStepsEn: [
      "Observe high volatility red downtrend leading into the session pause.",
      "Market gaps UP above the previous red close upon reopening.",
      "Price stalls at previous resistance/supply level.",
      "Enter PUT trade as sellers aggressively push to fill the opening gap.",
    ],
    executionStepsBn: [
      "পূর্ববর্তী শক্তিশালী রেড ডাউনট্রেন্ড পর্যবেক্ষণ করুন।",
      "মার্কেট খোলার সময় পূর্বের ক্লোজের অনেক উপরে গ্যাপ-আপ তৈরি হয়।",
      "প্রাইস পূর্বের রেজিস্ট্যান্সে বাধা পেয়ে লাল ক্যান্ডেল তৈরি শুরু করে।",
      "গ্যাপ ফিলের লক্ষ্যে দ্রুত PUT ট্রেড এক্সিকিউট করুন।",
    ],
    invalidationEn: "If the opening candle breaks above the previous swing high and closes green with no upper wick, do not short.",
    invalidationBn: "যদি প্রথম ক্যান্ডেলটি পূর্ববর্তী হাই ব্রেক করে উইক ছাড়া বড় গ্রিন ক্যান্ডেলে ক্লোজ হয়, তবে ট্রেড নেবেন না।",
    otcNuanceEn: "OTC binary pairs on weekends frequently feature gap-up traps at 00:00 UTC. These have over 85% gap-fill probability within 1-2 candles.",
    otcNuanceBn: "উইকেন্ড OTC পেয়ারে গ্যাপ-আপ ট্র্যাপ প্রায়ই দেখা যায় যা ১-২ ক্যান্ডেলের মধ্যে ৮৫%+ সময়ে পূরণ হয়ে যায়।",
    diagram: {
      zoneType: "OB REVERSAL",
      zonePosition: "TOP",
      gapPosition: {
        fromCandleIdx: 1,
        toCandleIdx: 2,
        label: "WEEKEND GAP",
      },
      hasGapFillLine: true,
      candles: [
        { label: "C1", color: "red", bodyHeight: 80, upperWick: 8, lowerWick: 12, annotation: "Friday Close", annotationBn: "সেশন ক্লোজ" },
        { label: "C2", color: "red", bodyHeight: 35, upperWick: 6, lowerWick: 8, offsetY: 25, annotation: "Base", annotationBn: "বেস" },
        { label: "C3", color: "green", bodyHeight: 40, upperWick: 14, lowerWick: 6, offsetY: -30, annotation: "Weekend Gap UP", annotationBn: "উইকেন্ড গ্যাপ-আপ" },
        { label: "C4", color: "red", bodyHeight: 80, upperWick: 10, lowerWick: 12, isKeyAction: true, badge: "ENTRY PUT", annotation: "Gap Fill Dump", annotationBn: "গ্যাপ ফিল ডাম্প" },
      ],
    },
  },
  {
    id: "gap_04_bearish_momentum_gap",
    number: 4,
    titleEn: "Bearish Momentum Continuation Gap",
    titleBn: "বেয়ারিশ মোমেন্টাম কন্টিনিউয়েশন গ্যাপ",
    category: "Continuation Gaps",
    categoryBn: "কন্টিনিউয়েশন গ্যাপস",
    type: "BEARISH",
    action: "PUT",
    winRateEst: "87% - 92%",
    expiry: "1M",
    difficulty: "BEGINNER",
    summaryEn: "A runaway momentum breakdown pattern where intense selling pressure causes the market to jump-gap downwards below a structural support level, confirming runaway bearish trend continuation.",
    summaryBn: "তীব্র বিক্রয় চাপের কারণে প্রাইস সরাসরি সাপোর্টের নিচে গ্যাপ-ডাউন (Gap Down) দিয়ে ওপেন হয় এবং কন্টিনিউয়াস সেল অফ দিয়ে পরবর্তী লেভেলে নেমে যায়।",
    marketLogicEn: "No buyer liquidity exists at the broken level. The gap represents true seller dominance. Pullbacks to the gap ceiling are fiercely defended by institutional algorithms.",
    marketLogicBn: "ব্রোকেন লেভেলে কোনো বায়ার থাকে না। গ্যাপটি সম্পূর্ণ সেলার ডমিন্যান্স প্রকাশ করে এবং গ্যাপ সিলিংয়ে রিটেস্ট পেলেই নিশ্চিত PUT কাজ করে।",
    coreRuleEn: "Wait for the micro-retest candle to tap the lower edge of the broken support gap, then enter PUT in the direction of the dominant momentum.",
    coreRuleBn: "ছোট রিটেস্ট ক্যান্ডেলটি ব্রোকেন সাপোর্টের গ্যাপ বর্ডার স্পর্শ করলেই ট্রেন্ডের দিকে নিশ্চিত PUT ট্রেড নিন।",
    executionStepsEn: [
      "Confirm established bearish market structure (Lower Highs & Lower Lows).",
      "Observe a red impulse candle followed by an immediate Gap Down.",
      "Notice small consolidation candles failing to fill the gap upwards.",
      "Execute PUT on the continuation breakdown candle.",
    ],
    executionStepsBn: [
      "প্রতিষ্ঠিত বেয়ারিশ মার্কেট স্ট্রাকচার নিশ্চিত করুন।",
      "রেড ইমপালসের পর স্পষ্ট গ্যাপ ডাউন পর্যবেক্ষণ করুন।",
      "ছোট ক্যান্ডেলগুলো গ্যাপ পূরণ করতে ব্যর্থ হচ্ছে তা লক্ষ্য করুন।",
      "কন্টিনিউয়েশন ক্যান্ডেলে মসৃণ PUT ট্রেড এক্সিকিউট করুন।",
    ],
    invalidationEn: "If buyers push price completely back above the pre-gap candle body, momentum has failed.",
    invalidationBn: "বায়াররা যদি প্রাইসকে আগের ক্যান্ডেলের বডির উপরে ফিরিয়ে নেয়, তবে ট্রেড বাতিল।",
    otcNuanceEn: "In OTC markets, runaway bearish gaps rarely retrace more than 20% before the next red bar expands.",
    otcNuanceBn: "OTC মার্কেটে মোমেন্টাম গ্যাপ ২০% এর বেশি রিট্রেস না করেই সরাসরি লাল ক্যান্ডেলে প্রসারিত হয়।",
    diagram: {
      zoneType: "SUPPLY",
      zonePosition: "MIDDLE",
      gapPosition: {
        fromCandleIdx: 1,
        toCandleIdx: 2,
        label: "GAP DOWN",
      },
      hasGapFillLine: true,
      candles: [
        { label: "C1", color: "green", bodyHeight: 30, upperWick: 8, lowerWick: 6, annotation: "Hesitation", annotationBn: "কনসলিডেশন" },
        { label: "C2", color: "red", bodyHeight: 75, upperWick: 6, lowerWick: 10, annotation: "Breakdown", annotationBn: "ব্রেকডাউন" },
        { label: "C3", color: "red", bodyHeight: 28, upperWick: 8, lowerWick: 6, offsetY: 25, annotation: "Hold Gap Floor", annotationBn: "গ্যাপ হোল্ড" },
        { label: "C4", color: "red", bodyHeight: 30, upperWick: 10, lowerWick: 8, offsetY: 25, annotation: "Weak Buyers", annotationBn: "দুর্বল বায়ার" },
        { label: "C5", color: "red", bodyHeight: 85, upperWick: 6, lowerWick: 14, offsetY: 25, isKeyAction: true, badge: "ENTRY PUT", annotation: "Bearish Expansion", annotationBn: "বেয়ারিশ এক্সপ্যানশন" },
      ],
    },
  },
  {
    id: "gap_05_weekend_bullish",
    number: 5,
    titleEn: "Weekend / Session Bullish Gap Trap",
    titleBn: "উইকেন্ড ও সেশন বুলিশ গ্যাপ ট্র্যাপ",
    category: "Weekend / Session Gaps",
    categoryBn: "উইকেন্ড ও সেশন গ্যাপস",
    type: "BULLISH",
    action: "CALL",
    winRateEst: "88% - 92%",
    expiry: "1M",
    difficulty: "BEGINNER",
    summaryEn: "Following a bullish trend, the market opens with a sharp Gap DOWN over the session break. This creates an immediate institutional discount where smart money steps in, fills the gap, and rockets to new highs.",
    summaryBn: "বুলিশ ট্রেন্ডের পর সেশন ওপেনে নিচের দিকে গ্যাপ তৈরি হলে (Gap Down) বড় প্লেয়াররা ডিসকাউন্টে বাই করে গ্যাপ পূরণ করে এবং নতুন হাই তৈরি করে।",
    marketLogicEn: "Retail traders panic sell on the gap down. Institutional buy limits trigger at the discounted support, causing an explosive short-squeeze rally back into trend.",
    marketLogicBn: "গ্যাপ ডাউনে রিটেল সেলারদের প্যানিক সেলিং সুযোগকে কাজে লাগিয়ে ইনস্টিটিউশন ভারী বাই করে দ্রুত মার্কেটকে উপরে টেনে তোলে।",
    coreRuleEn: "Wait for the red opening candle to hit support and form a strong lower wick rejection, then enter CALL for the swift gap-fill continuation.",
    coreRuleBn: "গ্যাপ ডাউনের লাল ক্যান্ডেলটি সাপোর্টে রিজেকশন উইক তৈরি করার সাথে সাথে গ্যাপ ফিলের জন্য CALL এন্ট্রি নিন।",
    executionStepsEn: [
      "Confirm prior bullish structure with strong buying pressure.",
      "Market gaps DOWN abruptly at session opening.",
      "The first candle rejects the lows with a strong lower wick.",
      "Execute CALL trade targeting the gap fill and higher structural swing.",
    ],
    executionStepsBn: [
      "পূর্বে শক্তিশালী বুলিশ স্ট্রাকচার নিশ্চিত করুন।",
      "সেশন ওপেনে আকস্মিক গ্যাপ ডাউন লক্ষ্য করুন।",
      "প্রথম ক্যান্ডেলটি নিচে রিজেকশন উইক তৈরি করছে কিনা দেখুন।",
      "গ্যাপ ফিল ও নতুন হাইয়ের উদ্দেশ্যে CALL ট্রেড প্লেস করুন।",
    ],
    invalidationEn: "If the red candle breaks aggressively below the discount support floor and closes at its absolute low, do not enter CALL.",
    invalidationBn: "লাল ক্যান্ডেলটি সাপোর্টের নিচে কোনো উইক ছাড়াই বড় বডিতে ক্লোজ হলে ট্রেড স্থগিত রাখুন।",
    otcNuanceEn: "A classic OTC liquidity engine: the gap down is engineered solely to grab sell-side liquidity before the real trend resumes.",
    otcNuanceBn: "OTC মার্কেটের ক্লাসিক লিকুইডিটি ট্র্যাপ: মূল বুলিশ ট্রেন্ড শুরুর আগে সেল-সাইড লিকুইডিটি হান্ট করতে এই গ্যাপ ডাউন দেওয়া হয়।",
    diagram: {
      zoneType: "DEMAND",
      zonePosition: "BOTTOM",
      gapPosition: {
        fromCandleIdx: 1,
        toCandleIdx: 2,
        label: "WEEKEND GAP",
      },
      hasGapFillLine: true,
      candles: [
        { label: "C1", color: "green", bodyHeight: 70, upperWick: 10, lowerWick: 8, annotation: "Prior Trend", annotationBn: "বুলিশ ট্রেন্ড" },
        { label: "C2", color: "green", bodyHeight: 35, upperWick: 8, lowerWick: 6, annotation: "Pre-Close", annotationBn: "ক্লোজিং বেস" },
        { label: "C3", color: "red", bodyHeight: 40, upperWick: 6, lowerWick: 16, offsetY: 30, annotation: "Gap Down Open", annotationBn: "গ্যাপ ডাউন ওপেন" },
        { label: "C4", color: "green", bodyHeight: 85, upperWick: 12, lowerWick: 8, isKeyAction: true, badge: "ENTRY CALL", annotation: "Gap Fill Rally", annotationBn: "বুলিশ র্যালি CALL" },
      ],
    },
  },
  {
    id: "gap_06_bullish_momentum_gap",
    number: 6,
    titleEn: "Bullish Momentum Continuation Gap",
    titleBn: "বুলিশ মোমেন্টাম কন্টিনিউয়েশন গ্যাপ",
    category: "Continuation Gaps",
    categoryBn: "কন্টিনিউয়েশন গ্যাপস",
    type: "BULLISH",
    action: "CALL",
    winRateEst: "89% - 93%",
    expiry: "1M",
    difficulty: "BEGINNER",
    summaryEn: "An explosive upward runaway gap from an accumulation base that completely bypasses overhead resistance, followed by a tight floor defense and rapid bullish expansion.",
    summaryBn: "অ্যাকুমুলেশন বেস থেকে আকস্মিক ঊর্ধ্বমুখী গ্যাপ-আপ (Gap Up) যা সমস্ত রেজিস্ট্যান্স ভেদ করে উপরে যায় এবং গ্যাপ ফ্লোর ধরে রেখে তীব্র বুলিশ ব্রেকআউট দেয়।",
    marketLogicEn: "Buyer aggression is overwhelming. The open gap above the base signals institutional urgency. Retests of the gap ceiling represent premium continuation entries.",
    marketLogicBn: "বায়ারদের শক্তি অত্যধিক। গ্যাপ-আপটি প্রাতিষ্ঠানিক তাড়াহুড়োর প্রতীক। গ্যাপ ফ্লোরে যেকোনো ছোট রিটেস্ট সেরা কন্টিনিউয়েশন সুযোগ তৈরি করে।",
    coreRuleEn: "When the micro-pullback candle touches the upper boundary of the base gap without closing inside the base, enter CALL with Margin of Safety.",
    coreRuleBn: "ছোট রিটেস্ট ক্যান্ডেলটি বেসের গ্যাপ বাউন্ডারি স্পর্শ করে রিজেকশন নিলেই মার্জিন অফ সেফটি সহ CALL ট্রেড নিন।",
    executionStepsEn: [
      "Identify a solid consolidation or accumulation base.",
      "Spot the massive green breakout candle creating a gap above the base.",
      "Notice small red/green consolidation candles comfortably holding above the gap line.",
      "Execute CALL on the next momentum expansion candle.",
    ],
    executionStepsBn: [
      "কনসলিডেশন বা অ্যাকুমুলেশন বেস চিহ্নিত করুন।",
      "বিশাল গ্রিন ক্যান্ডেলের মাধ্যমে ঊর্ধ্বমুখী গ্যাপ লক্ষ্য করুন।",
      "ছোট ক্যান্ডেলগুলো গ্যাপ লাইনের উপরে সাপোর্ট ধরে রাখছে কিনা দেখুন।",
      "পরবর্তী এক্সপ্যানশন ক্যান্ডেলে আত্মবিশ্বাসের সাথে CALL ট্রেড নিন।",
    ],
    invalidationEn: "If a candle closes back deep within the accumulation base, the breakout has failed.",
    invalidationBn: "কোনো ক্যান্ডেল যদি আবার বেসের ভেতরে নেমে ক্লোজ হয়, তবে ব্রেকআউট ব্যর্থ হয়েছে।",
    otcNuanceEn: "In OTC trading, when 2 micro candles hold the gap level, the 3rd candle almost always explodes green (>88% frequency).",
    otcNuanceBn: "OTC মার্কেটে ২টি ছোট ক্যান্ডেল গ্যাপ লেভেল ধরে রাখলে ৩য় ক্যান্ডেলটি ৮৮%+ ক্ষেত্রে বড় গ্রিন ক্যান্ডেল হয়।",
    diagram: {
      zoneType: "DEMAND",
      zonePosition: "MIDDLE",
      gapPosition: {
        fromCandleIdx: 1,
        toCandleIdx: 2,
        label: "GAP UP",
      },
      hasGapFillLine: true,
      candles: [
        { label: "C1", color: "red", bodyHeight: 30, upperWick: 6, lowerWick: 8, annotation: "Base", annotationBn: "বেস" },
        { label: "C2", color: "green", bodyHeight: 80, upperWick: 12, lowerWick: 6, annotation: "Breakout Gap", annotationBn: "গ্যাপ-আপ ব্রেকআউট" },
        { label: "C3", color: "green", bodyHeight: 25, upperWick: 8, lowerWick: 6, offsetY: -25, annotation: "Defend Gap", annotationBn: "গ্যাপ সাপোর্ট" },
        { label: "C4", color: "red", bodyHeight: 20, upperWick: 6, lowerWick: 10, offsetY: -25, annotation: "Retest Floor", annotationBn: "ফ্লোর রিটেস্ট" },
        { label: "C5", color: "green", bodyHeight: 90, upperWick: 12, lowerWick: 8, offsetY: -25, isKeyAction: true, badge: "ENTRY CALL", annotation: "Rocket Expansion", annotationBn: "রকেট এক্সপ্যানশন CALL" },
      ],
    },
  },
  {
    id: "gap_07_bullish_liquidity_run",
    number: 7,
    titleEn: "Bullish Liquidity Run Gap (Stop Hunt Sweep)",
    titleBn: "বুলিশ লিকুইডিটি রান গ্যাপ (স্টপ হান্ট ও সুইপ)",
    category: "Liquidity Run Gaps",
    categoryBn: "লিকুইডিটি রান গ্যাপস",
    type: "BULLISH",
    action: "CALL",
    winRateEst: "91% - 95%",
    expiry: "1M",
    difficulty: "ADVANCED",
    summaryEn: "An engineered liquidity hunt where the market deliberately gaps down below obvious support lows into an external liquidity pool, wicks aggressively, and launches a massive V-shaped bullish reversal.",
    summaryBn: "অ্যালগরিদমিক স্টপ হান্ট যেখানে প্রাইস উদ্দেশ্যপ্রণোদিতভাবে সাপোর্টের নিচে গ্যাপ দিয়ে ওপেন হয়, সেল-সাইড লিকুইডিটি সুইপ করে এবং বিশাল V-শেপ বুলিশ রিভার্সাল ঘটায়।",
    marketLogicEn: "Smart money engineers the gap down to trigger stop losses of all retail longs and entice breakout short sellers. Once all sell liquidity is consumed, price is rocketed upwards.",
    marketLogicBn: "স্মার্ট মানি রিটেল ট্রেডারদের স্টপ লস হান্ট করতে এই গ্যাপ ডাউন ঘটায়। সম্পূর্ণ সেল লিকুইডিটি গ্রহণ করার পর দ্রুত মার্কেটকে উপরে তুলে নেয়।",
    coreRuleEn: "Enter CALL immediately upon witnessing the lower wick sweep into the liquidity pool followed by a rapid reclaim of the broken support level.",
    coreRuleBn: "লিকুইডিটি পুলে উইক সুইপ করার পর সাপোর্ট লেভেল পুনরায় রিক্লেইম হওয়ার সাথে সাথে CALL এন্ট্রি নিন।",
    executionStepsEn: [
      "Mark major swing lows with visible retail stop-loss liquidity resting below.",
      "Observe the deliberate gap down directly into the liquidity pool.",
      "Watch for a long lower wick rejecting the extreme lows within seconds 01-20.",
      "Execute CALL on the green reclaim candle.",
    ],
    executionStepsBn: [
      "প্রধান সুইং লো চিহ্নিত করুন যার নিচে প্রচুর স্টপ লস জমা আছে।",
      "সরাসরি লিকুইডিটি পুলে গ্যাপ ডাউন ক্যান্ডেলটি লক্ষ্য করুন।",
      "নিচে দীর্ঘ উইক রিজেকশন দেখতে পেলে সতর্ক হোন।",
      "রিক্লেইম গ্রিন ক্যান্ডেলে কনফার্মেশন সহ CALL ট্রেড নিন।",
    ],
    invalidationEn: "If price continues cascading down and closes below the liquidity pool without any lower wick rejection, do not trade.",
    invalidationBn: "যদি প্রাইস রিজেকশন ছাড়াই লিকুইডিটি পুলের আরও নিচে বড় বডিতে ভেঙে পড়ে, তবে ট্রেড বাতিল।",
    otcNuanceEn: "OTC algorithms run liquidity gaps to wipe 1-minute call buyers before triggering the real 2-minute green surge.",
    otcNuanceBn: "OTC অ্যালগরিদম ১-মিনিটের বায়ারদের ওয়াইপ আউট করতে এই সুইপ গ্যাপ দেয় এবং এরপরই বিশাল গ্রিন ক্যান্ডেল তৈরি করে।",
    diagram: {
      zoneType: "LIQUIDITY",
      zonePosition: "BOTTOM",
      gapPosition: {
        fromCandleIdx: 1,
        toCandleIdx: 2,
        label: "LIQUIDITY GAP",
      },
      hasGapFillLine: true,
      candles: [
        { label: "C1", color: "red", bodyHeight: 65, upperWick: 6, lowerWick: 8, annotation: "Sell Pressure", annotationBn: "সেল প্রেসার" },
        { label: "C2", color: "red", bodyHeight: 30, upperWick: 6, lowerWick: 20, offsetY: 25, annotation: "Gap Sweep", annotationBn: "গ্যাপ সুইপ" },
        { label: "C3", color: "red", bodyHeight: 35, upperWick: 6, lowerWick: 28, offsetY: 30, annotation: "Hunt Liquidity", annotationBn: "লিকুইডিটি হান্ট" },
        { label: "C4", color: "green", bodyHeight: 70, upperWick: 10, lowerWick: 8, annotation: "V-Reclaim", annotationBn: "ভি-রিক্লেইম" },
        { label: "C5", color: "green", bodyHeight: 90, upperWick: 14, lowerWick: 6, isKeyAction: true, badge: "ENTRY CALL", annotation: "Massive Launch", annotationBn: "বুলিশ লঞ্চ CALL" },
      ],
    },
  },
  {
    id: "gap_08_bearish_liquidity_run",
    number: 8,
    titleEn: "Bearish Liquidity Run Gap (Fake-Out Trap)",
    titleBn: "বেয়ারিশ লিকুইডিটি রান গ্যাপ (ফেক-আউট ট্র্যাপ)",
    category: "Liquidity Run Gaps",
    categoryBn: "লিকুইডিটি রান গ্যাপস",
    type: "BEARISH",
    action: "PUT",
    winRateEst: "92% - 96%",
    expiry: "1M",
    difficulty: "ADVANCED",
    summaryEn: "A textbook fake-out trap where price intentionally gaps up above a prominent resistance level into buy-side liquidity, creating a deceptive breakout before instantly collapsing into a devastating selloff.",
    summaryBn: "টেক্সটবুক ফেক-আউট ট্র্যাপ যেখানে প্রাইস রেজিস্ট্যান্সের উপরে গ্যাপ-আপ (Gap Up) দিয়ে ওপেন হয়ে বায়ারদের আকৃষ্ট করে এবং সাথে সাথে ড্রপ করে বিধ্বংসী রেড ক্যান্ডেল তৈরি করে।",
    marketLogicEn: "Smart money needs counterparty buyers to fill their massive sell orders. The engineered gap-up lures eager breakout traders, providing exit liquidity for institutional distribution.",
    marketLogicBn: "ইনস্টিটিউশন তাদের বিশাল সেল অর্ডার কার্যকর করতে এই কৃত্রিম গ্যাপ-আপ তৈরি করে। ব্রেকআউট বায়াররা এতে আটকে গিয়ে লিকুইডেটেড হয়।",
    coreRuleEn: "Execute PUT the moment the fake-out candle fails to hold above resistance and drops back below the pre-gap opening level.",
    coreRuleBn: "ফেক-আউট ক্যান্ডেলটি রেজিস্ট্যান্স ধরে রাখতে ব্যর্থ হয়ে গ্যাপ লেভেলের নিচে নামার সাথে সাথেই PUT এন্ট্রি নিন।",
    executionStepsEn: [
      "Identify a major resistance ceiling where retail traders expect a breakout.",
      "Notice the artificial gap up opening straight into the buy-side liquidity zone.",
      "Watch the candle form a long upper wick rejection at the highs.",
      "Enter PUT on the collapse candle breaking back below the gap line.",
    ],
    executionStepsBn: [
      "রেজিস্ট্যান্স সিলিং চিহ্নিত করুন যেখানে ট্রেডাররা ব্রেকআউট আশা করছে।",
      "লিকুইডিটি জোনে কৃত্রিম গ্যাপ-আপ ওপেন পর্যবেক্ষণ করুন।",
      "উপরে দীর্ঘ আপার উইক রিজেকশন লক্ষ্য করুন।",
      "প্রাইস গ্যাপ লেভেলের নিচে পড়ার সাথে সাথে আগ্রাসী PUT ট্রেড নিন।",
    ],
    invalidationEn: "If price maintains strong bullish volume and closes firmly above the upper liquidity zone, exit short bias.",
    invalidationBn: "যদি প্রাইস বুলিশ ভলিউম সহ লিকুইডিটি জোনের অনেক উপরে শক্তিশালী বডিতে ক্লোজ হয়, তবে ট্রেড বাতিল।",
    otcNuanceEn: "OTC algorithms create these gap fake-outs repeatedly right at round numbers (e.g. .500 or .000). Highly exploitable with 1M PUT.",
    otcNuanceBn: "OTC অ্যালগরিদম রাউন্ড নাম্বারে (.৫০০ বা .০০০) প্রায়ই এই ফেক-আউট গ্যাপ দেয়, যা ১M PUT এন্ট্রির জন্য দারুণ কার্যকরী।",
    diagram: {
      zoneType: "FAKEOUT",
      zonePosition: "TOP",
      gapPosition: {
        fromCandleIdx: 1,
        toCandleIdx: 2,
        label: "FAKEOUT GAP",
      },
      hasGapFillLine: true,
      candles: [
        { label: "C1", color: "green", bodyHeight: 60, upperWick: 8, lowerWick: 6, annotation: "Push High", annotationBn: "রেজিস্ট্যান্সে পুশ" },
        { label: "C2", color: "green", bodyHeight: 30, upperWick: 12, lowerWick: 6, offsetY: -25, annotation: "Fake Gap Up", annotationBn: "ফেক গ্যাপ-আপ" },
        { label: "C3", color: "red", bodyHeight: 80, upperWick: 25, lowerWick: 10, offsetY: -20, isKeyAction: true, badge: "ENTRY PUT", annotation: "Trap & Dump", annotationBn: "ট্র্যাপ ও ডাম্প PUT" },
        { label: "C4", color: "red", bodyHeight: 35, upperWick: 8, lowerWick: 8, annotation: "Continuation", annotationBn: "কন্টিনিউয়েশন" },
        { label: "C5", color: "red", bodyHeight: 75, upperWick: 6, lowerWick: 14, annotation: "Full Breakdown", annotationBn: "পূর্ণ ব্রেকডাউন" },
      ],
    },
  },
  {
    id: "gap_09_gap_filled_mitigation",
    number: 9,
    titleEn: "100% Gap Filled Mitigation & Launch",
    titleBn: "১০০% গ্যাপ ফিল্ড মিটিগেশন ও লঞ্চ",
    category: "Gap Fill Mitigation",
    categoryBn: "গ্যাপ ফিল মিটিগেশন",
    type: "BULLISH",
    action: "CALL",
    winRateEst: "90% - 95%",
    expiry: "1M",
    difficulty: "INTERMEDIATE",
    summaryEn: "The classical price action rule: Every open price imbalance or gap acts as a magnetic vacuum. Once price retraces to 100% fill and mitigate the gap baseline, buyers step in aggressively for an explosive trend launch.",
    summaryBn: "ক্লাসিক্যাল প্রাইজ অ্যাকশনের সুবর্ণ নিয়ম: প্রতিটি অপূর্ণ গ্যাপ প্রাইসকে চুম্বকের মতো টানে। প্রাইস যখন ১০০% গ্যাপ পূরণ (Gap Fill) করে বেসলাইন স্পর্শ করে, তখনই বায়াররা প্রচণ্ড গতিতে নতুন র্যালি শুরু করে।",
    marketLogicEn: "Unfilled gaps represent market inefficiency. Algorithmic liquidity providers mandate 100% gap mitigation before allowing price to expand into the next liquidity target.",
    marketLogicBn: "অপূর্ণ গ্যাপ মার্কেটের অসামঞ্জস্য নির্দেশ করে। অ্যালগরিদম ১০০% গ্যাপ পূরণ করার পরেই মার্কেটকে নতুন টার্গেটের দিকে এগিয়ে নিয়ে যায়।",
    coreRuleEn: "Wait for the red mitigation candle to touch the precise pre-gap closing baseline (100% Gap Fill), then trigger CALL with Margin of Safety.",
    coreRuleBn: "লাল মিটিগেশন ক্যান্ডেলটি পূর্ববর্তী ক্যান্ডেলের ক্লোজিং বেসলাইন (১০০% গ্যাপ ফিল) স্পর্শ করার সাথে সাথে MOS সহ CALL ট্রেড প্লেস করুন।",
    executionStepsEn: [
      "Locate the green impulse candle leaving an open, unfilled gap from the prior red base.",
      "Observe sideways consolidation drifting back down toward the gap window.",
      "Identify the exact red candle that touches and fulfills the 100% Gap Fill line.",
      "Execute CALL on the immediate rejection from the gap bottom baseline.",
    ],
    executionStepsBn: [
      "গ্রিন ইমপালস ক্যান্ডেলের ফেলে যাওয়া অপূর্ণ গ্যাপ চিহ্নিত করুন।",
      "প্রাইস ধীরে ধীরে গ্যাপের দিকে পুলব্যাক করছে তা লক্ষ্য করুন।",
      "১০০% গ্যাপ ফিল লাইনে লাল ক্যান্ডেল স্পর্শ করার মুহূর্তটি শনাক্ত করুন।",
      "গ্যাপ বটম থেকে রিজেকশন পাওয়ার সাথে সাথে CALL ট্রেড নিন।",
    ],
    invalidationEn: "If the red candle penetrates through the gap and closes below the entire pre-gap base, do not trade.",
    invalidationBn: "যদি লাল ক্যান্ডেল গ্যাপ ভেদ করে আগের সম্পূর্ণ বেসের নিচে ক্লোজ হয়, তবে ট্রেড নেবেন না।",
    otcNuanceEn: "In OTC binary trading, the 100% gap fill line is one of the single most reliable Margin of Safety bounce levels in existence.",
    otcNuanceBn: "OTC বাইনারি ট্রেডিংয়ে ১০০% গ্যাপ ফিল লাইন অন্যতম সেরা এবং নির্ভরযোগ্য মার্জিন অফ সেফটি বাউন্স লেভেল।",
    diagram: {
      zoneType: "DEMAND",
      zonePosition: "BOTTOM",
      gapPosition: {
        fromCandleIdx: 0,
        toCandleIdx: 1,
        label: "GAP",
      },
      hasGapFillLine: true,
      candles: [
        { label: "C1", color: "red", bodyHeight: 30, upperWick: 6, lowerWick: 8, annotation: "Pre-Gap Base", annotationBn: "বেস" },
        { label: "C2", color: "green", bodyHeight: 75, upperWick: 10, lowerWick: 6, annotation: "Impulse Gap", annotationBn: "ইমপালস গ্যাপ" },
        { label: "C3", color: "green", bodyHeight: 35, upperWick: 8, lowerWick: 6, offsetY: -15, annotation: "Consolidation", annotationBn: "কনসলিডেশন" },
        { label: "C4", color: "red", bodyHeight: 50, upperWick: 6, lowerWick: 16, offsetY: 0, annotation: "Gap Filled", annotationBn: "গ্যাপ ফিল্ড" },
        { label: "C5", color: "green", bodyHeight: 90, upperWick: 14, lowerWick: 6, isKeyAction: true, badge: "ENTRY CALL", annotation: "Rocket Launch", annotationBn: "রকেট লঞ্চ CALL" },
      ],
    },
  },
];

export interface GapCalculatorResult {
  gapSize: number;
  gapType: "BULLISH_GAP_UP" | "BEARISH_GAP_DOWN" | "NO_GAP";
  gapZoneTop: number;
  gapZoneBottom: number;
  fiftyPercentLevel: number;
  fullMitigationLevel: number;
  recommendedAction: "CALL" | "PUT" | "WAIT_FOR_FILL";
  recommendedActionBn: string;
  mosRule: string;
  mosRuleBn: string;
}

export function computeGapAnalysis(
  c1Close: number,
  c1High: number,
  c1Low: number,
  c2Open: number,
  c2High: number,
  c2Low: number
): GapCalculatorResult {
  const diff = c2Open - c1Close;
  const tolerance = 0.00005;

  if (diff > tolerance) {
    const gapZoneTop = c2Open;
    const gapZoneBottom = c1Close;
    const gapSize = gapZoneTop - gapZoneBottom;
    const fiftyPercentLevel = (gapZoneTop + gapZoneBottom) / 2;
    const fullMitigationLevel = gapZoneBottom;

    return {
      gapSize,
      gapType: "BULLISH_GAP_UP",
      gapZoneTop,
      gapZoneBottom,
      fiftyPercentLevel,
      fullMitigationLevel,
      recommendedAction: "CALL",
      recommendedActionBn: "CALL এন্ট্রি (৫০% বা ১০০% গ্যাপ রিটেস্টে)",
      mosRule: `Wait for pullback into 50% level (${fiftyPercentLevel.toFixed(5)}) or 100% fill (${fullMitigationLevel.toFixed(5)}) before triggering CALL.`,
      mosRuleBn: `CALL নেওয়ার আগে ৫০% লেভেল (${fiftyPercentLevel.toFixed(5)}) অথবা ১০০% গ্যাপ ফিল লেভেলে (${fullMitigationLevel.toFixed(5)}) রিটেস্টের জন্য অপেক্ষা করুন।`,
    };
  } else if (diff < -tolerance) {
    const gapZoneTop = c1Close;
    const gapZoneBottom = c2Open;
    const gapSize = gapZoneTop - gapZoneBottom;
    const fiftyPercentLevel = (gapZoneTop + gapZoneBottom) / 2;
    const fullMitigationLevel = gapZoneTop;

    return {
      gapSize,
      gapType: "BEARISH_GAP_DOWN",
      gapZoneTop,
      gapZoneBottom,
      fiftyPercentLevel,
      fullMitigationLevel,
      recommendedAction: "PUT",
      recommendedActionBn: "PUT এন্ট্রি (৫০% বা ১০০% গ্যাপ রিটেস্টে)",
      mosRule: `Wait for upward retest into 50% level (${fiftyPercentLevel.toFixed(5)}) or 100% gap ceiling (${fullMitigationLevel.toFixed(5)}) before triggering PUT.`,
      mosRuleBn: `PUT নেওয়ার আগে ৫০% লেভেল (${fiftyPercentLevel.toFixed(5)}) অথবা ১০০% গ্যাপ সিলিং লেভেলে (${fullMitigationLevel.toFixed(5)}) রিটেস্টের জন্য অপেক্ষা করুন।`,
    };
  } else {
    return {
      gapSize: 0,
      gapType: "NO_GAP",
      gapZoneTop: c1Close,
      gapZoneBottom: c2Open,
      fiftyPercentLevel: c1Close,
      fullMitigationLevel: c1Close,
      recommendedAction: "WAIT_FOR_FILL",
      recommendedActionBn: "কোনো স্পষ্ট গ্যাপ নেই (সাধারণ ক্যান্ডেল)",
      mosRule: "Normal continuous price action without jump gap.",
      mosRuleBn: "সাধারণ নিরবচ্ছিন্ন ক্যান্ডেলস্টিক প্রাইজ অ্যাকশন।",
    };
  }
}
