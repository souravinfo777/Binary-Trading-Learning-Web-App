export interface SureshotCandleDiagram {
  label: string;
  color: "green" | "red" | "gray";
  bodyHeight: number; // relative height 1-100
  upperWick: number;  // relative height 0-50
  lowerWick: number;  // relative height 0-50
  isKeyAction?: boolean;
  annotation?: string;
  annotationBn?: string;
}

export interface SureshotPattern {
  id: string;
  number: number;
  titleEn: string;
  titleBn: string;
  category: "50% Golden Level" | "Engulfing & Piercing" | "Gap & Overlap SNR" | "Wicks & Rejections" | "OTC Mechanics";
  categoryBn: string;
  winRateEst: string;
  expiry: "1M" | "2M";
  tradeDirection: "CALL" | "PUT" | "BOTH";
  summaryEn: string;
  summaryBn: string;
  goldenRuleEn: string;
  goldenRuleBn: string;
  criteriaEn: string[];
  criteriaBn: string[];
  pitfallEn: string;
  pitfallBn: string;
  mosGuidelineEn: string;
  mosGuidelineBn: string;
  linkedScenarioId?: string;
  diagram: {
    snrLevelType?: "Resistance" | "Support" | "50% Level" | "Overlap" | "Gap";
    snrPositionPercent?: number; // 0 to 100 vertical position on chart
    candles: SureshotCandleDiagram[];
  };
}

export const SURESHOT_PATTERNS: SureshotPattern[] = [
  {
    id: "ss_01_50_retest",
    number: 1,
    titleEn: "The 50% Golden Body Retest (MOS Entry)",
    titleBn: "৫০% গোল্ডেন ক্যান্ডেল বডি রিটেস্ট (MOS এন্ট্রি)",
    category: "50% Golden Level",
    categoryBn: "৫০% গোল্ডেন লেভেল",
    winRateEst: "84% - 89%",
    expiry: "1M",
    tradeDirection: "BOTH",
    summaryEn: "The exact 50% midpoint of a strong breakout or engulfing candle acts as high-precision algorithmic support/resistance. Entering with Margin of Safety on the pullback guarantees high win rates.",
    summaryBn: "যেকোনো শক্তিশালী ব্রেকআউট বা এনগালফিং ক্যান্ডেলের ৫০% মিডপয়েন্ট অ্যালগরিদমিক সাপোর্ট/রেজিস্ট্যান্স হিসেবে কাজ করে। পুলব্যাকে মার্জিন অফ সেফটি (MOS) সহ এন্ট্রি নিলে সর্বোচ্চ উইন রেট নিশ্চিত হয়।",
    goldenRuleEn: "Wait for the next candle to retrace down into the 50% level of the strong candle body within seconds 01-15, then trigger your trade with Margin of Safety.",
    goldenRuleBn: "পরবর্তী ক্যান্ডেলটি প্রথম ১৫ সেকেন্ডের মধ্যে ৫০% বডি লেভেল স্পর্শ করার জন্য অপেক্ষা করুন, তারপর মার্জিন অফ সেফটি দিয়ে ট্রেড প্লেস করুন।",
    criteriaEn: [
      "Prior candle is a solid strong body (Body >= 70% of total range).",
      "Calculate 50% Level = (Candle Open + Candle Close) / 2.",
      "Running candle pulls back to touch the 50% line within the first 15 seconds.",
      "Immediate rejection tick seen upon touching the 50% line.",
    ],
    criteriaBn: [
      "পূর্ববর্তী ক্যান্ডেলটি শক্তিশালী সলিড বডি সম্পন্ন (বডি মোট রেঞ্জের ৭০%+)।",
      "৫০% লেভেল সূত্র = (ক্যান্ডেল ওপেন + ক্যান্ডেল ক্লোজ) / ২।",
      "চলতি ক্যান্ডেলটি প্রথম ১৫ সেকেন্ডে ৫০% লেভেল স্পর্শ করে পুলব্যাক দেয়।",
      "৫০% লেভেল স্পর্শ করার সাথে সাথে রিজেকশন বাউন্স দেখা যায়।",
    ],
    pitfallEn: "Do NOT enter at the opening price 00:00 without waiting for the pullback. An unexpected flat doji close will cause a loss without Margin of Safety.",
    pitfallBn: "পুলব্যাকের অপেক্ষা না করে ০০:০০ ওপেন প্রাইসে এন্ট্রি নেবেন না। মার্জিন অফ সেফটি না থাকলে ফ্ল্যাট ডোজি ক্যান্ডেলে লস হতে পারে।",
    mosGuidelineEn: "Safety buffer into the round number / 50% line ensures an In The Money (ITM) finish even if the candle finishes flat.",
    mosGuidelineBn: "রাউন্ড নাম্বার বা ৫০% লাইনের দিকে সেফটি বাফার আপনাকে ফ্ল্যাট ডোজি হলেও উইন করিয়ে দেবে।",
    linkedScenarioId: "OTC_SURESHOT_50_RETEST",
    diagram: {
      snrLevelType: "50% Level",
      snrPositionPercent: 55,
      candles: [
        { label: "C1", color: "green", bodyHeight: 40, upperWick: 5, lowerWick: 5 },
        { label: "C2 (Strong)", color: "green", bodyHeight: 80, upperWick: 4, lowerWick: 4, annotation: "50% Midpoint Level", annotationBn: "৫০% মিডপয়েন্ট" },
        { label: "C3 (MOS)", color: "green", bodyHeight: 50, upperWick: 5, lowerWick: 35, isKeyAction: true, annotation: "Touch 50% -> CALL", annotationBn: "৫০% টাচ -> CALL" },
      ],
    },
  },
  {
    id: "ss_02_valid_engulfing",
    number: 2,
    titleEn: "Valid Engulfing Ratio (51% – 149% Golden Zone)",
    titleBn: "ভ্যালিড এনগালফিং অনুপাত (৫১% – ১৪৯% গোল্ডেন রুল)",
    category: "Engulfing & Piercing",
    categoryBn: "এনগালফিং ও পিয়ার্সিং",
    winRateEst: "82% - 86%",
    expiry: "1M",
    tradeDirection: "BOTH",
    summaryEn: "A textbook continuation engulfing must cover between 51% and 149% of the preceding candle body. Anything over 200% is an Exhaustion Climax trap.",
    summaryBn: "ধারাবাহিক ট্রেন্ডে সঠিক এনগালফিং হতে হলে পূর্ববর্তী ক্যান্ডেলের ৫১% থেকে ১৪৯% বডি কভার করতে হবে। ২০০% এর বেশি বড় ক্যান্ডেল মোমেন্টাম একজশন ট্র্যাপ।",
    goldenRuleEn: "Only trade engulfing continuation when current candle body is 1.2x to 1.5x of previous candle. Never chase a 3x giant candle.",
    goldenRuleBn: "বর্তমান ক্যান্ডেলের বডি যখন পূর্ববর্তী ক্যান্ডেলের ১.২ থেকে ১.৫ গুণ হবে তখনই কেবল কন্টিনিউয়েশন ট্রেড নিন। ৩ গুণ বড় ক্যান্ডেলে ট্রেড নেবেন না।",
    criteriaEn: [
      "Candle 2 real body completely covers Candle 1 real body.",
      "Candle 2 body size is between 51% and 149% larger than Candle 1.",
      "Aligned with dominant trend and unmitigated SNR base.",
      "Next candle retests Candle 2 open or 50% body for entry.",
    ],
    criteriaBn: [
      "২য় ক্যান্ডেলের বডি ১ম ক্যান্ডেলের বডিকে সম্পূর্ণ ঢেকে ফেলে।",
      "২য় ক্যান্ডেলের সাইজ ১ম ক্যান্ডেলের চেয়ে ৫১% থেকে ১৪৯% বড়।",
      "মূল ট্রেন্ড এবং আনমিটিগেটেড লেভেলের সাথে সামঞ্জস্যপূর্ণ।",
      "পরবর্তী ক্যান্ডেলটি ২য় ক্যান্ডেলের ওপেন বা ৫০% লেভেল রিটেস্ট করলে এন্ট্রি।",
    ],
    pitfallEn: "Buying after a massive 4x giant candle that lands directly on resistance (Exhaustion Climax).",
    pitfallBn: "সরাসরি রেজিস্ট্যান্সে গিয়ে শেষ হওয়া ৪ গুণ বড় বিশাল ক্যান্ডেলের পর অন্ধভাবে বাই করা।",
    mosGuidelineEn: "Enter at the opening edge or on a micro pullback toward the prior candle's close.",
    mosGuidelineBn: "ওপেনিং প্রাইস বা পূর্ববর্তী ক্যান্ডেলের ক্লোজিংয়ের দিকে সামান্য পুলব্যাকে এন্ট্রি নিন।",
    linkedScenarioId: "OTC_SURESHOT_VALID_ENGULF",
    diagram: {
      snrLevelType: "Support",
      snrPositionPercent: 75,
      candles: [
        { label: "C1 (Red)", color: "red", bodyHeight: 35, upperWick: 8, lowerWick: 8 },
        { label: "C2 (1.3x)", color: "green", bodyHeight: 52, upperWick: 5, lowerWick: 4, annotation: "51-149% Engulfing", annotationBn: "৫১-১৪৯% এনগালফিং" },
        { label: "C3 (Next)", color: "green", bodyHeight: 60, upperWick: 6, lowerWick: 15, isKeyAction: true, annotation: "Continuation CALL", annotationBn: "কন্টিনিউয়েশন CALL" },
      ],
    },
  },
  {
    id: "ss_03_gap_jump_snr",
    number: 3,
    titleEn: "OTC Gap-Over-Resistance (Level Jump Breakout)",
    titleBn: "OTC গ্যাপ ওভার রেজিস্ট্যান্স (লেভেল জাম্প ব্রেকআউট)",
    category: "Gap & Overlap SNR",
    categoryBn: "গ্যাপ ও ওভারল্যাপ SNR",
    winRateEst: "85% - 90%",
    expiry: "1M",
    tradeDirection: "CALL",
    summaryEn: "When the algorithm creates a gap at the candle open jumping cleanly ABOVE a resistance line, resting sell orders are bypassed, triggering an aggressive short squeeze.",
    summaryBn: "যখন নতুন ক্যান্ডেলের শুরুতে অ্যালগরিদম রেজিস্ট্যান্স লাইনের উপরে সরাসরি গ্যাপ ওপেন দেয়, তখন সেলারদের লিমিট অর্ডার বাইপাস হয়ে তীব্র শর্ট স্কুইজ তৈরি হয়।",
    goldenRuleEn: "If a candle closes right at resistance and next candle opens with a Gap UP above the line, execute CALL on the gap floor touch.",
    goldenRuleBn: "যদি কোনো ক্যান্ডেল রেজিস্ট্যান্সে শেষ হয়ে পরবর্তী ক্যান্ডেল রেজিস্ট্যান্সের উপরে গ্যাপ দিয়ে ওপেন হয়, গ্যাপ লাইনে টাচ করলে CALL নিন।",
    criteriaEn: [
      "Candle 1 closes directly beneath strong horizontal round number resistance.",
      "Candle 2 opens with a clean Gap UP beyond the resistance level.",
      "Candle 2 touches the broken resistance (gap floor) without breaking back below.",
      "Uptrend or bullish momentum context.",
    ],
    criteriaBn: [
      "১ম ক্যান্ডেলটি স্ট্রং রাউন্ড নাম্বার রেজিস্ট্যান্সের একদম কাছাকাছি নিচে ক্লোজ হয়।",
      "২য় ক্যান্ডেলটি রেজিস্ট্যান্সের উপরে গ্যাপ আপ দিয়ে ওপেন হয়।",
      "২য় ক্যান্ডেলটি নিচের ভাঙা রেজিস্ট্যান্স (গ্যাপ ফ্লোর) রিটেস্ট করে বাউন্স নেয়।",
      "মার্কেট আপট্রেন্ড অথবা বুলিশ মোমেন্টামে অবস্থান করে।",
    ],
    pitfallEn: "Mistaking an Exhaustion Gap for a Jump Gap. An exhaustion gap opens into the middle of nowhere without a level.",
    pitfallBn: "একজশন গ্যাপের সাথে লেভেল জাম্প গুলিয়ে ফেলা। একজশন গ্যাপ কোনো লেভেল ছাড়া মাঝপথে তৈরি হয়।",
    mosGuidelineEn: "Wait for the candle to dip into the top edge of the broken resistance line before clicking CALL.",
    mosGuidelineBn: "ভাঙা রেজিস্ট্যান্স লাইনের উপরিভাগে সামান্য ডিপ করার পর CALL ক্লিক করুন।",
    linkedScenarioId: "OTC_SURESHOT_GAP_SNR",
    diagram: {
      snrLevelType: "Resistance",
      snrPositionPercent: 50,
      candles: [
        { label: "C1", color: "green", bodyHeight: 45, upperWick: 2, lowerWick: 5, annotation: "Hits SNR", annotationBn: "SNR স্পর্শ" },
        { label: "C2 (Gap)", color: "green", bodyHeight: 65, upperWick: 5, lowerWick: 12, isKeyAction: true, annotation: "Gap Jump -> CALL", annotationBn: "গ্যাপ জাম্প -> CALL" },
      ],
    },
  },
  {
    id: "ss_04_overlap_snr",
    number: 4,
    titleEn: "Wick-to-Body Overlap SNR Transition",
    titleBn: "উইক-টু-বডি ওভারল্যাপ SNR ট্রানজিশন",
    category: "Gap & Overlap SNR",
    categoryBn: "গ্যাপ ও ওভারল্যাপ SNR",
    winRateEst: "83% - 87%",
    expiry: "1M",
    tradeDirection: "BOTH",
    summaryEn: "The horizontal level where the high wick of a previous candle aligns exactly with the opening/body of the next candle forms an Overlap SNR Level that acts as a fortress on retests.",
    summaryBn: "যেখানে পূর্ববর্তী ক্যান্ডেলের উইকের শীর্ষবিন্দু পরবর্তী ক্যান্ডেলের বডি ওপেনের সাথে মিলে যায়, সেটি ওভারল্যাপ SNR তৈরি করে যা রিটেস্টে অত্যন্ত কার্যকর।",
    goldenRuleEn: "Mark horizontal lines at exact wick-body intersections. When a future candle wicks into this overlap line, trade the bounce.",
    goldenRuleBn: "যেখানে উইক এবং বডির সংযোগস্থল আছে সেখানে হরাইজন্টাল লাইন টানুন। ভবিষ্যৎ ক্যান্ডেল এই লাইনে টাচ করলে বাউন্স ট্রেড নিন।",
    criteriaEn: [
      "Prior candle upper/lower wick meets subsequent candle open/close line.",
      "Clean visual level overlap forming an established micro barrier.",
      "Third candle tests the overlap line with deceleration.",
      "Rejection shadow appears on touch.",
    ],
    criteriaBn: [
      "পূর্ববর্তী ক্যান্ডেলের উইক পরবর্তী ক্যান্ডেলের ওপেন/ক্লোজ লাইনের সমান্তরাল।",
      "স্পষ্ট ভিজ্যুয়াল ওভারল্যাপ লাইন যা অ্যালগরিদমিক বাধা তৈরি করে।",
      "৩য় ক্যান্ডেলটি ওভারল্যাপ লাইনে পৌঁছালে গতি কমে যায়।",
      "স্পর্শ করার সাথে সাথে রিজেকশন শ্যাডো গঠিত হয়।",
    ],
    pitfallEn: "Ignoring trend direction: Overlap levels with trend flow have 85% accuracy; counter-trend overlaps have only 55%.",
    pitfallBn: "ট্রেন্ডের বিপরীতে ওভারল্যাপ ট্রেড করা। ট্রেন্ডের পক্ষে ৮৫% কাজ করলেও বিপরীতে মাত্র ৫৫% কার্যকর।",
    mosGuidelineEn: "Enter precisely when the candle shadow pierces the overlap coordinate.",
    mosGuidelineBn: "ক্যান্ডেলের শ্যাডো যখন ওভারল্যাপ রেখাকে স্পর্শ করে তখনই ক্লিক করুন।",
    diagram: {
      snrLevelType: "Overlap",
      snrPositionPercent: 60,
      candles: [
        { label: "C1 (Wick)", color: "green", bodyHeight: 40, upperWick: 25, lowerWick: 5, annotation: "Wick Peak", annotationBn: "উইক পিক" },
        { label: "C2 (Body)", color: "red", bodyHeight: 35, upperWick: 3, lowerWick: 5, annotation: "Overlap Line", annotationBn: "ওভারল্যাপ লাইন" },
        { label: "C3 (Retest)", color: "green", bodyHeight: 45, upperWick: 4, lowerWick: 22, isKeyAction: true, annotation: "Overlap Bounce", annotationBn: "ওভারল্যাপ বাউন্স" },
      ],
    },
  },
  {
    id: "ss_05_piercing_dark_cloud",
    number: 5,
    titleEn: "Piercing Line & Dark Cloud (50% Penetration Rule)",
    titleBn: "পিয়ার্সিং লাইন ও ডার্ক ক্লাউড কভার (৫০% পেনিট্রেশন রুল)",
    category: "Engulfing & Piercing",
    categoryBn: "এনগালফিং ও পিয়ার্সিং",
    winRateEst: "81% - 85%",
    expiry: "1M",
    tradeDirection: "BOTH",
    summaryEn: "Piercing Line (Bullish) and Dark Cloud Cover (Bearish) are valid ONLY when the reversal candle penetrates and closes beyond the exact 50% midpoint of the prior candle body.",
    summaryBn: "পিয়ার্সিং লাইন (বুলিশ) এবং ডার্ক ক্লাউড কভার (বেয়ারিশ) তখনই সফল হয় যখন রিভার্সাল ক্যান্ডেলটি পূর্ববর্তী ক্যান্ডেলের ৫০% মিডপয়েন্ট অতিক্রম করে ক্লোজ হয়।",
    goldenRuleEn: "Check that the second candle body crosses the 50% line of the first candle. If it closes below 50%, it is a failed continuation trap.",
    goldenRuleBn: "২য় ক্যান্ডেলটি ১ম ক্যান্ডেলের ৫০% বডির উপরে/নিচে ক্লোজ হয়েছে কিনা নিশ্চিত করুন। ৫০% এর কম হলে সেটি ফেইল্ড প্যাটার্ন।",
    criteriaEn: [
      "Piercing Line: Red candle followed by Green candle opening lower but closing above 50% of Red body.",
      "Dark Cloud: Green candle followed by Red candle opening higher but closing below 50% of Green body.",
      "Formed at verified Support (Piercing) or Resistance (Dark Cloud).",
      "Next candle continues in the direction of the penetration.",
    ],
    criteriaBn: [
      "পিয়ার্সিং লাইন: লাল ক্যান্ডেলের পর সবুজ ক্যান্ডেল নিচে ওপেন হলেও লালের ৫০% বডির উপরে ক্লোজ হয়।",
      "ডার্ক ক্লাউড: সবুজ ক্যান্ডেলের পর লাল ক্যান্ডেল উপরে ওপেন হলেও সবুজের ৫০% বডির নিচে ক্লোজ হয়।",
      "সাপোর্ট (পিয়ার্সিং) বা রেজিস্ট্যান্সে (ডার্ক ক্লাউড) গঠিত হতে হবে।",
      "পরবর্তী ক্যান্ডেলটি ব্রেকআউটের দিকে মোমেন্টাম ধরে রাখে।",
    ],
    pitfallEn: "Trading when the candle closes at 30-40% penetration (Incomplete Piercing leads to trend continuation against you).",
    pitfallBn: "৩০-৪০% পেনিট্রেশনে ট্রেড নেওয়া (অসম্পূর্ণ পিয়ার্সিংয়ে আগের ট্রেন্ড পুনরায় শুরু হয়)।",
    mosGuidelineEn: "Enter on the fresh open of Candle 3 or on a micro pullback to Candle 2 close.",
    mosGuidelineBn: "৩য় ক্যান্ডেলের ফ্রেশ ওপেনে বা ২য় ক্যান্ডেলের ক্লোজে সামান্য পুলব্যাকে এন্ট্রি নিন।",
    diagram: {
      snrLevelType: "Support",
      snrPositionPercent: 80,
      candles: [
        { label: "C1 (Red)", color: "red", bodyHeight: 70, upperWick: 5, lowerWick: 5 },
        { label: "C2 (Green)", color: "green", bodyHeight: 50, upperWick: 4, lowerWick: 8, isKeyAction: true, annotation: "> 50% Penetration", annotationBn: "> ৫০% পেনিট্রেশন" },
        { label: "C3 (Follow)", color: "green", bodyHeight: 55, upperWick: 5, lowerWick: 10, annotation: "CALL Win", annotationBn: "CALL উইন" },
      ],
    },
  },
  {
    id: "ss_06_hammer_snr",
    number: 6,
    titleEn: "Hammer / Pin Bar with 66% Wick at Round Number",
    titleBn: "হ্যামার / পিনবার এবং ৬৬% উইক রিজেকশন (.০০ লেভেল)",
    category: "Wicks & Rejections",
    categoryBn: "উইক ও রিজেকশন",
    winRateEst: "86% - 91%",
    expiry: "1M",
    tradeDirection: "CALL",
    summaryEn: "A textbook Hammer with a lower wick at least 2x (66%+) the real body formed right at an institutional .00/.50 round number provides maximum bounce probability.",
    summaryBn: "যে হ্যামার ক্যান্ডেলের নিচের উইক বডির চেয়ে দ্বিগুণ (৬৬%+) এবং যা .০০ বা .৫০ রাউন্ড নাম্বারে সাপোর্ট পায়, সেটি সর্বোচ্চ বাউন্স পাওয়ার নিশ্চয়তা দেয়।",
    goldenRuleEn: "Wick must be >= 66% of total range, body <= 33%, and the wick tip must sweep a .00 round number.",
    goldenRuleBn: "উইক হতে হবে মোট রেঞ্জের ৬৬%+, বডি ৩৩% বা তার কম, এবং উইকের মাথাটি .০০ রাউন্ড নাম্বার স্পর্শ করতে হবে।",
    criteriaEn: [
      "Lower wick length is at least twice the height of the real body.",
      "Close is located in the top 25% of the total candle span.",
      "Taps or sweeps a verified round number (.000, .00, .50).",
      "Formed after at least 3 consecutive red candles.",
    ],
    criteriaBn: [
      "নিচের উইক বডির তুলনায় অন্তত দ্বিগুণ লম্বা।",
      "ক্লোজিং প্রাইস মোট রেঞ্জের শীর্ষ ২৫% এর মধ্যে অবস্থিত।",
      "যাচাইকৃত রাউন্ড নাম্বার (.০০, .৫০) স্পর্শ বা সুইপ করে।",
      "টানা অন্তত ৩টি লাল ক্যান্ডেলের পর সাপোর্ট জোনে গঠিত।",
    ],
    pitfallEn: "Trading a hammer in the middle of nowhere without any SNR level or round number.",
    pitfallBn: "কোনো সাপোর্ট লেভেল বা রাউন্ড নাম্বার ছাড়া ফাঁকা জায়গায় হ্যামার দেখে ট্রেড নেওয়া।",
    mosGuidelineEn: "Execute CALL on the open or wait 3 seconds for a dip toward the hammer body low.",
    mosGuidelineBn: "ওপেনে CALL নিন অথবা প্রথম ৩ সেকেন্ড হ্যামার বডির নিচের দিকে পুলব্যাকের জন্য অপেক্ষা করুন।",
    diagram: {
      snrLevelType: "Support",
      snrPositionPercent: 85,
      candles: [
        { label: "C1", color: "red", bodyHeight: 50, upperWick: 4, lowerWick: 5 },
        { label: "C2", color: "red", bodyHeight: 45, upperWick: 3, lowerWick: 4 },
        { label: "C3 (Hammer)", color: "green", bodyHeight: 20, upperWick: 2, lowerWick: 65, isKeyAction: true, annotation: "66% Lower Wick", annotationBn: "৬৬% লোয়ার উইক" },
        { label: "C4 (Target)", color: "green", bodyHeight: 60, upperWick: 5, lowerWick: 8, annotation: "CALL Win", annotationBn: "CALL উইন" },
      ],
    },
  },
  {
    id: "ss_07_spinning_top_snr",
    number: 7,
    titleEn: "Spinning Top Indecision at Key SNR (Color Shift)",
    titleBn: "স্পিনিং টপ ইনডিসিশন এবং কালার শিফট রিভার্সাল",
    category: "Wicks & Rejections",
    categoryBn: "উইক ও রিজেকশন",
    winRateEst: "82% - 87%",
    expiry: "1M",
    tradeDirection: "BOTH",
    summaryEn: "When a Spinning Top (small centered body with equal upper/lower wicks) forms directly at a strong SNR level, it signals complete buyer/seller equilibrium and an imminent color change on the next candle.",
    summaryBn: "যখন একটি স্পিনিং টপ (ছোট বডি ও উভয় পাশে সমান উইক) স্ট্রং লেভেলে তৈরি হয়, তখন এটি ক্রেতা-বিক্রেতার ভারসাম্যহীনতার সমাপ্তি এবং পরবর্তী ক্যান্ডেলে কালার পরিবর্তনের সংকেত দেয়।",
    goldenRuleEn: "Identify a trend approaching SNR. If the contact candle is a balanced Spinning Top, trade the opposing color on the next candle with Margin of Safety.",
    goldenRuleBn: "লেভেলে স্পিনিং টপ দেখলে পরবর্তী ক্যান্ডেলে বিপরীত কালারের জন্য মার্জিন অফ সেফটি সহ ট্রেড নিন।",
    criteriaEn: [
      "Real body is small (15-30% of total candle range).",
      "Upper and lower wicks are roughly symmetrical (indecision).",
      "Closed directly at a key horizontal Support or Resistance line.",
      "Prior move showed deceleration.",
    ],
    criteriaBn: [
      "রিয়েল বডি ছোট (মোট ক্যান্ডেল রেঞ্জের ১৫-৩০%)।",
      "উপর ও নিচের উইক প্রায় সমান ও প্রতিসম।",
      "সরাসরি স্ট্রং সাপোর্ট বা রেজিস্ট্যান্স লাইনের উপর ক্লোজ।",
      "পূর্ববর্তী ক্যান্ডেলগুলোতে গতির স্থবিরতা লক্ষ্য করা গেছে।",
    ],
    pitfallEn: "Trading a spinning top in the middle of a strong trend where it acts as continuation instead of reversal.",
    pitfallBn: "স্ট্রং ট্রেন্ডের মাঝখানে স্পিনিং টপ দেখে রিভার্সাল নেওয়া (মাঝখানে এটি ট্রেন্ড কন্টিনিউ করে)।",
    mosGuidelineEn: "Wait for running candle to push into the round number SNR line before executing the color reversal.",
    mosGuidelineBn: "পরবর্তী ক্যান্ডেলটি রাউন্ড নাম্বার লেভেলের দিকে উইক দেওয়ার পর বিপরীতমুখী ট্রেড প্লেস করুন।",
    diagram: {
      snrLevelType: "Resistance",
      snrPositionPercent: 30,
      candles: [
        { label: "C1", color: "green", bodyHeight: 50, upperWick: 5, lowerWick: 4 },
        { label: "C2 (Decel)", color: "green", bodyHeight: 30, upperWick: 8, lowerWick: 4 },
        { label: "C3 (Spin)", color: "green", bodyHeight: 18, upperWick: 25, lowerWick: 25, annotation: "Spinning Top", annotationBn: "স্পিনিং টপ" },
        { label: "C4 (Reversal)", color: "red", bodyHeight: 55, upperWick: 4, lowerWick: 6, isKeyAction: true, annotation: "PUT Color Shift", annotationBn: "PUT কালার শিফট" },
      ],
    },
  },
  {
    id: "ss_08_inside_bar_breakout",
    number: 8,
    titleEn: "Inside Bar (Harami) Volatility Expansion",
    titleBn: "ইনসাইড বার (হারামি) ভলাট্যালিটি এক্সপ্যানশন",
    category: "OTC Mechanics",
    categoryBn: "OTC অ্যালগরিদম",
    winRateEst: "83% - 88%",
    expiry: "1M",
    tradeDirection: "BOTH",
    summaryEn: "An Inside Bar represents extreme volatility compression inside a Mother Bar. The subsequent candle breaks the mother bar boundary with explosive algorithmic expansion.",
    summaryBn: "ইনসাইড বার মাদার বারের পেটের ভেতর তীব্র চাপ নির্দেশ করে। পরবর্তী ক্যান্ডেলটি বিস্ফোরণের সাথে মাদার বারের সীমা ভেঙে একমুখী মোমেন্টাম তৈরি করে।",
    goldenRuleEn: "When an inside bar forms at support/resistance, trade the breakout candle in the direction of the dominant higher-timeframe trend.",
    goldenRuleBn: "সাপোর্ট বা রেজিস্ট্যান্সে ইনসাইড বার দেখলে মূল ট্রেন্ডের দিকে ব্রেকআউট ট্রেড নিন।",
    criteriaEn: [
      "Mother Bar (Candle 1) has solid range.",
      "Inside Bar (Candle 2) High is strictly lower than Mother Bar High; Low is strictly higher than Mother Bar Low.",
      "Aligned with dominant 15M/5M trend.",
      "Candle 3 breaks the high/low of the Mother Bar.",
    ],
    criteriaBn: [
      "মাদার বার (১ম ক্যান্ডেল) স্পষ্ট রেঞ্জ সম্পন্ন।",
      "ইনসাইড বার (২য় ক্যান্ডেল) হাই ও লো সম্পূর্ণভাবে মাদার বারের ভেতরে সীমাবদ্ধ।",
      "মূল ১৫M/৫M ট্রেন্ডের সাথে দিকনির্দেশনা এক।",
      "৩য় ক্যান্ডেলটি মাদার বারের হাই অথবা লো ভেঙে বেরিয়ে যায়।",
    ],
    pitfallEn: "Entering before the inside bar candle officially closes.",
    pitfallBn: "ইনসাইড বার ক্যান্ডেল পুরোপুরি ক্লোজ হওয়ার আগেই তাড়াহুড়ো করে এন্ট্রি নেওয়া।",
    mosGuidelineEn: "Enter as soon as the price breaks clearly beyond the mother bar boundary.",
    mosGuidelineBn: "মাদার বারের সীমা স্পষ্টভাবে অতিক্রম করার সাথে সাথে মোমেন্টাম এন্ট্রি নিন।",
    diagram: {
      snrLevelType: "50% Level",
      snrPositionPercent: 70,
      candles: [
        { label: "C1 (Mother)", color: "green", bodyHeight: 70, upperWick: 8, lowerWick: 8, annotation: "Mother Bar", annotationBn: "মাদার বার" },
        { label: "C2 (Inside)", color: "red", bodyHeight: 25, upperWick: 6, lowerWick: 6, annotation: "Inside Bar", annotationBn: "ইনসাইড বার" },
        { label: "C3 (Break)", color: "green", bodyHeight: 80, upperWick: 5, lowerWick: 8, isKeyAction: true, annotation: "Expansion CALL", annotationBn: "এক্সপ্যানশন CALL" },
      ],
    },
  },
  {
    id: "ss_09_climax_exhaustion_trap",
    number: 9,
    titleEn: "Exhaustion Climax Trap (>200% Body Spike into SNR)",
    titleBn: "একজশন ক্লাইম্যাক্স ট্র্যাপ (>২০০% বডি জাম্প রেজিস্ট্যান্সে)",
    category: "OTC Mechanics",
    categoryBn: "OTC অ্যালগরিদম",
    winRateEst: "87% - 92%",
    expiry: "1M",
    tradeDirection: "PUT",
    summaryEn: "An abnormally giant candle (3x-4x ATR) that explodes into a major resistance zone is retail FOMO buying. Smart money sells into this liquidity, causing an immediate sharp reversal.",
    summaryBn: "স্বাভাবিকের চেয়ে ৩-৪ গুণ বড় ক্যান্ডেল যখন হঠাৎ রেজিস্ট্যান্সে গিয়ে আঘাত হানে, তখন এটি রিটেইল ট্র্যাপ। বড় ট্রেডাররা এই লিকুইডিটিতে সেল করে পরবর্তী ক্যান্ডেলে রিভার্সাল ঘটায়।",
    goldenRuleEn: "Never buy the top of an abnormally giant candle. If a 300% giant candle lands on resistance, execute PUT on the next candle.",
    goldenRuleBn: "বিশাল আকৃতির ক্যান্ডেলের মাথায় কখনো বাই করবেন না। রেজিস্ট্যান্সে এমন ক্লাইম্যাক্স দেখলে পরবর্তী ক্যান্ডেলে নিশ্চিত PUT নিন।",
    criteriaEn: [
      "Candle size is > 200% of average candle size.",
      "Occurs at the terminal end of an extended 4+ candle move.",
      "Lands directly upon a major .00/.50 round number or historical SNR.",
      "Volume proxy or tick count hits extreme peak.",
    ],
    criteriaBn: [
      "ক্যান্ডেলের সাইজ সাধারণ ক্যান্ডেলের ২০০% এর চেয়েও বড়।",
      "টানা ৪+ ক্যান্ডেল মুভমেন্টের একদম শেষ মাথায় তৈরি।",
      "সরাসরি .০০ বা .৫০ রাউন্ড নাম্বার অথবা ঐতিহাসিক রেজিস্ট্যান্সে গিয়ে থামে।",
      "ভলিউম প্রক্সি বা টিক কাউন্ট অস্বাভাবিক সর্বোচ্চ শিখরে পৌঁছায়।",
    ],
    pitfallEn: "Assuming the giant candle represents 'huge bullish strength' and buying blindly.",
    pitfallBn: "বিশাল ক্যান্ডেল দেখে অতি-বুলিশ ভেবে পরবর্তী ক্যান্ডেলেও অন্ধভাবে বাই করা।",
    mosGuidelineEn: "Enter PUT on the fresh open of the next candle or on any tiny upward spike in the first 5 seconds.",
    mosGuidelineBn: "পরবর্তী ক্যান্ডেলের শুরুতে অথবা প্রথম ৫ সেকেন্ডের মধ্যে সামান্য উপরের স্পাইকে PUT নিন।",
    linkedScenarioId: "OTC_SURESHOT_VALID_ENGULF",
    diagram: {
      snrLevelType: "Resistance",
      snrPositionPercent: 25,
      candles: [
        { label: "C1", color: "green", bodyHeight: 25, upperWick: 4, lowerWick: 4 },
        { label: "C2", color: "green", bodyHeight: 30, upperWick: 4, lowerWick: 3 },
        { label: "C3 (Giant)", color: "green", bodyHeight: 90, upperWick: 3, lowerWick: 2, annotation: "300% Climax Trap", annotationBn: "৩০০% ক্লাইম্যাক্স ট্র্যাপ" },
        { label: "C4 (Collapse)", color: "red", bodyHeight: 70, upperWick: 5, lowerWick: 10, isKeyAction: true, annotation: "PUT Reversal", annotationBn: "PUT রিভার্সাল" },
      ],
    },
  },
  {
    id: "ss_10_margin_of_safety",
    number: 10,
    titleEn: "The 10-Second Margin of Safety (MOS) Protocol",
    titleBn: "১০-সেকেন্ড মার্জিন অফ সেফটি (MOS) প্রোটোকল",
    category: "OTC Mechanics",
    categoryBn: "OTC অ্যালগরিদম",
    winRateEst: "88% - 94%",
    expiry: "1M",
    tradeDirection: "BOTH",
    summaryEn: "In binary options, entering at a favorable price pullback toward the key round number level within seconds 01-15 provides an impregnable statistical shield against flat dojis and spread losses.",
    summaryBn: "বাইনারি অপশনে ০০:০০ ওপেনে ক্লিক না করে প্রথম ১৫ সেকেন্ডের মধ্যে রাউন্ড নাম্বার লেভেলে পুলব্যাকে এন্ট্রি নেওয়া ডোজি এবং স্প্রেড লসের বিরুদ্ধে শতভাগ সুরক্ষা দেয়।",
    goldenRuleEn: "Never click immediately at 00:00. Wait for a favorable pullback toward the key round number level before confirming execution.",
    goldenRuleBn: "০০:০০ সেকেন্ডে সাথে সাথে ক্লিক করবেন না। মূল রাউন্ড নাম্বার লেভেলের দিকে পুলব্যাকের জন্য অপেক্ষা করে তবেই এন্ট্রি নিশ্চিত করুন।",
    criteriaEn: [
      "Direction already verified via 10-point confluence.",
      "Candle opens at 00:00; wait 5 to 15 seconds.",
      "Price pulls back toward previous candle's close or 50% line.",
      "Execute with solid price advantage and margin of safety.",
    ],
    criteriaBn: [
      "১০-পয়েন্ট কনফ্লুয়েন্সের মাধ্যমে দিক আগেই নির্ধারিত।",
      "ক্যান্ডেল ওপেন হওয়ার পর প্রথম ৫ থেকে ১৫ সেকেন্ড অপেক্ষা করুন।",
      "প্রাইস পূর্ববর্তী ক্যান্ডেলের ক্লোজ বা ৫০% লাইনের দিকে পুলব্যাক দিলে এন্ট্রি নিন।",
      "নিখুঁত সেফটি মার্জিন প্রাইস অ্যাডভান্টেজ নিয়ে ট্রেড এক্সিকিউট করুন।",
    ],
    pitfallEn: "Entering late after the candle has already expanded far away in your target direction (Chasing).",
    pitfallBn: "ক্যান্ডেলটি অলরেডি টার্গেটের দিকে অনেক দূরে চলে যাওয়ার পর তাড়াহুড়ো করে এন্ট্রি নেওয়া (চেজিং)।",
    mosGuidelineEn: "If the candle does not give a pullback and runs away immediately, DO NOT CHASE — accept NO TRADE.",
    mosGuidelineBn: "যদি ক্যান্ডেলটি পুলব্যাক না দিয়ে একবারে ছুটে যায়, পিছু ছুটবেন না — 'নো ট্রেড' মেনে নিন।",
    diagram: {
      snrLevelType: "Support",
      snrPositionPercent: 65,
      candles: [
        { label: "C1", color: "green", bodyHeight: 50, upperWick: 5, lowerWick: 5 },
        { label: "C2 (MOS)", color: "green", bodyHeight: 55, upperWick: 6, lowerWick: 28, isKeyAction: true, annotation: "MOS Entry at Wick Bottom", annotationBn: "উইকের নিচে MOS এন্ট্রি" },
      ],
    },
  },
];
