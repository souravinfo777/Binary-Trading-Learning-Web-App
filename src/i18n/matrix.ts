export interface MatrixFieldMeta {
  title: string;
  subtitle: string;
  placeholder: string;
  quickOptions?: string[];
}

export const EN_MATRIX_FIELDS: Record<string, MatrixFieldMeta> = {
  trend: {
    title: "1. Macro & Micro Trend Direction",
    subtitle: "Map 15M/5M higher timeframe bias and 1M micro trend alignment.",
    placeholder: "e.g. M15 strongly Bearish below EMA 50; 1M micro trend printing lower highs.",
    quickOptions: [
      "Aligned Bearish: M15 Bearish + 1M Bearish LH/LL structure",
      "Aligned Bullish: M15 Bullish + 1M Bullish HH/HL structure",
      "Conflicting: M15 Bullish but 1M pulling back into Bearish micro-structure",
      "Range-bound: Flat EMA 20/50 with horizontal boundary oscillation",
    ],
  },
  structure: {
    title: "2. Market Structure (BOS / CHOCH)",
    subtitle: "Identify latest Break of Structure (BOS) or Change of Character (CHOCH).",
    placeholder: "e.g. Bearish BOS confirmed by Candle 2 displacement body close below 1.08400.",
    quickOptions: [
      "Bullish BOS confirmed by full displacement candle body close",
      "Bearish BOS confirmed by full displacement candle body close",
      "CHOCH structural shift: First break of swing high/low",
      "Unconfirmed structure: Wick sweep only, no displacement body closure",
    ],
  },
  location: {
    title: "3. Location in Range (Premium / Discount / EQ)",
    subtitle: "Evaluate if price is in Premium (sell zone), Discount (buy zone), or Equilibrium.",
    placeholder: "e.g. Premium pricing zone (> 61.8% fib level of current dealing range).",
    quickOptions: [
      "Premium Zone (> 61.8%): Ideal for institutional PUT entries",
      "Discount Zone (< 38.2%): Ideal for institutional CALL entries",
      "Equilibrium Zone (50% Midpoint): Dead zone - strictly NO TRADE",
      "Extreme Overextension: Extended past outer range boundary",
    ],
  },
  keyLevel: {
    title: "4. Key Support / Resistance & Flip Levels",
    subtitle: "Determine if price is reacting to a fresh structural level or tested barrier.",
    placeholder: "e.g. Previous support at 1.08460 now acting as fresh resistance flip.",
    quickOptions: [
      "Fresh S/R Flip Level (1st or 2nd touch after confirmed breakout)",
      "Major Historical Swing High/Low zone",
      "Over-tested Level (3+ touches): High probability breakout risk",
      "No structural level in immediate proximity",
    ],
  },
  roundNumber: {
    title: "5. Psychological Round Numbers (.00 / .50)",
    subtitle: "Check proximity to major institutional psychological price anchors.",
    placeholder: "e.g. Direct tap of 1.08450 (.50 mid-round level) during Candle 4 retracement.",
    quickOptions: [
      "Major Triple-Zero (.000 / .00) direct tap & rejection",
      "Mid-Round Number (.50) confluence with structural level",
      "Quarter Point (.20 / .80) minor algorithmic trigger",
      "No round number confluence nearby",
    ],
  },
  liquidity: {
    title: "6. Liquidity Pools & Stop Hunts (BSL / SSL)",
    subtitle: "Verify if Buy-Side Liquidity (BSL) or Sell-Side Liquidity (SSL) has been swept.",
    placeholder: "e.g. Retail early breakout sellers swept by pullback wick into the zone.",
    quickOptions: [
      "Buy-Side Liquidity (BSL) swept above equal highs / swing high",
      "Sell-Side Liquidity (SSL) swept below equal lows / swing low",
      "Equal Highs / Equal Lows remaining unswept (Magnet hazard)",
      "Internal range liquidity cleared prior to displacement",
    ],
  },
  fvgOb: {
    title: "7. Fair Value Gap (FVG) / Order Block (OB)",
    subtitle: "Confirm presence of an unmitigated imbalance or institutional order block.",
    placeholder: "e.g. Tapping into unmitigated Bearish FVG (1.08440 - 1.08480), filling 50% CE.",
    quickOptions: [
      "Fresh Bearish FVG mitigation (50% Consequent Encroachment tapped)",
      "Fresh Bullish FVG mitigation (50% Consequent Encroachment tapped)",
      "Institutional Order Block (OB) tap following confirmed BOS",
      "No FVG or OB present in immediate price delivery",
    ],
  },
  momentum: {
    title: "8. Momentum & Intra-Candle Velocity",
    subtitle: "Assess candle size progression, deceleration, or exhaustion climax.",
    placeholder: "e.g. Candle bodies shrinking significantly approaching the round number resistance.",
    quickOptions: [
      "Clear Momentum Deceleration: Progressively shrinking bodies into zone",
      "Exhaustion Climax: Giant abnormal candle indicating retail capitulation",
      "Strong Displacement: Large healthy body with continuation velocity",
      "Indecision / Low Volume Chop: Small erratic bodies with no direction",
    ],
  },
  reaction: {
    title: "9. Running Candle Reaction & Close-Inside",
    subtitle: "Check rejection wick ratio and Close-Back-Inside confirmation.",
    placeholder: "e.g. 50%+ upper rejection shadow, closed strictly back inside the S/R boundary.",
    quickOptions: [
      "Strong Rejection Wick (>= 50%) with Close-Back-Inside level",
      "Breakout Acceptance: Solid body closed beyond level (NO REVERSAL)",
      "Delayed Rejection formed during seconds 15-45 of the candle lifecycle",
      "Unresolved Tension: Candle closed directly on the line without wick",
    ],
  },
  invalidationCondition: {
    title: "10. Invalidation Condition & Risk Check",
    subtitle: "Define the exact market event that renders this trade null and void.",
    placeholder: "e.g. Invalidation if next candle expands and closes above 1.08485.",
    quickOptions: [
      "Invalidated if next candle closes outside key zone boundary",
      "Invalidated if price creates an opposing displacement candle with FVG",
      "Invalidated if execution latency exceeds 2 seconds",
      "Disqualified due to broker payout < 80% or active news event",
    ],
  },
};

export const BN_MATRIX_FIELDS: Record<string, MatrixFieldMeta> = {
  trend: {
    title: "১. ম্যাক্রো ও মাইক্রো ট্রেন্ডের দিকনির্দেশনা",
    subtitle: "১৫ মিনিট/৫ মিনিটের হায়ার টাইমফ্রেম বায়াস এবং ১ মিনিটের মাইক্রো ট্রেন্ড সামঞ্জস্য যাচাই করুন।",
    placeholder: "যেমন: M15 EMA 50-এর নিচে তীব্র বিয়ারিশ; 1M মাইক্রো ট্রেন্ড লোয়ার হাই তৈরি করছে।",
    quickOptions: [
      "অ্যালাইনড বিয়ারিশ: M15 বিয়ারিশ + 1M বিয়ারিশ LH/LL স্ট্রাকচার",
      "অ্যালাইনড বুলিশ: M15 বুলিশ + 1M বুলিশ HH/HL স্ট্রাকচার",
      "পরস্পরবিরোধী: M15 বুলিশ কিন্তু 1M পুলব্যাক করে বিয়ারিশ মাইক্রো-স্ট্রাকচারে",
      "রেঞ্জ-বাউন্ড: ফ্ল্যাট EMA 20/50 সহ অনুভূমিক রেঞ্জে ওঠানামা",
    ],
  },
  structure: {
    title: "২. মার্কেট স্ট্রাকচার (BOS / CHOCH)",
    subtitle: "সাম্প্রতিক ব্রেক অফ স্ট্রাকচার (BOS) বা চেঞ্জ অফ ক্যারেক্টার (CHOCH) শনাক্ত করুন।",
    placeholder: "যেমন: ক্যান্ডেল ২-এর ডিসপ্লেসমেন্ট বডি ক্লোজ দিয়ে ১.০৮৪০০-এর নিচে বিয়ারিশ BOS নিশ্চিত।",
    quickOptions: [
      "পূর্ণ ডিসপ্লেসমেন্ট ক্যান্ডেল বডি ক্লোজ দিয়ে বুলিশ BOS নিশ্চিত",
      "পূর্ণ ডিসপ্লেসমেন্ট ক্যান্ডেল বডি ক্লোজ দিয়ে বিয়ারিশ BOS নিশ্চিত",
      "CHOCH স্ট্রাকচারাল শিফট: পূর্ববর্তী সুইং হাই/লো প্রথমবার ভাঙা",
      "অনিশ্চিত স্ট্রাকচার: শুধু উইক দিয়ে সুইপ, বডি ক্লোজ হয়নি",
    ],
  },
  location: {
    title: "৩. রেঞ্জে অবস্থান (প্রিমিয়াম / ডিসকাউন্ট / EQ)",
    subtitle: "মূল্য প্রিমিয়াম (বিক্রয় জোন), ডিসকাউন্ট (ক্রয় জোন) নাকি ইকুইলিব্রিয়ামে আছে তা যাচাই করুন।",
    placeholder: "যেমন: প্রিমিয়াম প্রাইসিং জোন (বর্তমান রেঞ্জের ৬১.৮% ফিবোনাচি লেভেলের উপরে)।",
    quickOptions: [
      "প্রিমিয়াম জোন (> ৬১.৮%): প্রাতিষ্ঠানিক PUT এন্ট্রির জন্য আদর্শ",
      "ডিসকাউন্ট জোন (< ৩৮.২%): প্রাতিষ্ঠানিক CALL এন্ট্রির জন্য আদর্শ",
      "ইকুইলিব্রিয়াম জোন (৫০% মিডপয়েন্ট): ডেড জোন - সম্পূর্ণ নো-ট্রেড",
      "চরম ওভারএক্সটেনশন: রেঞ্জের বাইরের সীমানা ছাড়িয়ে প্রসারিত",
    ],
  },
  keyLevel: {
    title: "৪. কি-সাপোর্ট / রেজিস্ট্যান্স ও ফ্লিপ লেভেল",
    subtitle: "মূল্য কি তাজা কাঠামোগত লেভেলে প্রতিক্রিয়া দেখাচ্ছে নাকি একাধিকবার পরীক্ষিত লেভেলে?",
    placeholder: "যেমন: ১.০৮৪৬০-এর পূর্ববর্তী সাপোর্ট এখন তাজা রেজিস্ট্যান্স ফ্লিপ হিসেবে কাজ করছে।",
    quickOptions: [
      "তাজা S/R ফ্লিপ লেভেল (নিশ্চিত ব্রেকআউটের পর ১ম বা ২য় রিটেস্ট)",
      "মেজর হিস্টোরিক্যাল সুইং হাই/লো জোন",
      "অতিরিক্ত টেস্ট হওয়া লেভেল (৩+ বার স্পর্শ): ব্রেকআউটের উচ্চ ঝুঁকি",
      "কাছাকাছি কোনো কাঠামোগত কি-লেভেল নেই",
    ],
  },
  roundNumber: {
    title: "৫. সাইকোলজিক্যাল রাউন্ড নম্বর (.০০ / .৫০)",
    subtitle: "মেজর প্রাতিষ্ঠানিক সাইকোলজিক্যাল প্রাইস অ্যাঙ্করের সান্নিধ্য পরীক্ষা করুন।",
    placeholder: "যেমন: ক্যান্ডেল ৪-এর পুলব্যাকের সময় সরাসরি ১.০৮৪৫০ (.৫০ মিড-রাউন্ড লেভেল) স্পর্শ করেছে।",
    quickOptions: [
      "মেজর ট্রিপল-জিরো (.০০০ / .০০) সরাসরি স্পর্শ ও রিজেকশন",
      "মিড-রাউন্ড নম্বর (.৫০) এবং স্ট্রাকচারাল লেভেলের কনফ্লুয়েন্স",
      "কোয়ার্টার পয়েন্ট (.২০ / .৮০) মাইনর অ্যালগরিদমিক ট্রিগার",
      "কাছাকাছি কোনো রাউন্ড নম্বর কনফ্লুয়েন্স নেই",
    ],
  },
  liquidity: {
    title: "৬. লিকুইডিটি পুল ও স্টপ হান্ট (BSL / SSL)",
    subtitle: "বাই-সাইড লিকুইডিটি (BSL) বা সেল-সাইড লিকুইডিটি (SSL) সুইপ হয়েছে কি না তা নিশ্চিত করুন।",
    placeholder: "যেমন: জোনে পুলব্যাক উইকের মাধ্যমে রিটেইল প্রারম্ভিক সেলারদের স্টপ শিকার করা হয়েছে।",
    quickOptions: [
      "ইকুয়াল হাই / সুইং হাইয়ের উপরে বাই-সাইড লিকুইডিটি (BSL) সুইপ সম্পন্ন",
      "ইকুয়াল লো / সুইং লোয়ের নিচে সেল-সাইড লিকুইডিটি (SSL) সুইপ সম্পন্ন",
      "ইকুয়াল হাই / লো এখনও আনসুইপড রয়ে গেছে (ম্যাগনেট বিপদ)",
      "ডিসপ্লেসমেন্টের পূর্বে অভ্যন্তরীণ রেঞ্জ লিকুইডিটি ক্লিয়ার করা হয়েছে",
    ],
  },
  fvgOb: {
    title: "৭. ফেয়ার ভ্যালু গ্যাপ (FVG) / অর্ডার ব্লক (OB)",
    subtitle: "আনমিটিগেটেড ইমব্যালেন্স বা প্রাতিষ্ঠানিক অর্ডার ব্লকের উপস্থিতি নিশ্চিত করুন।",
    placeholder: "যেমন: বিয়ারিশ FVG (১.০৮৪৪০ - ১.০৮৪৮০) স্পর্শ করেছে, ৫০% CE ফিল হয়েছে।",
    quickOptions: [
      "তাজা বিয়ারিশ FVG মিটিগেশন (৫০% কনসিকুয়েন্ট এনক্রোচমেন্ট স্পর্শ)",
      "তাজা বুলিশ FVG মিটিগেশন (৫০% কনসিকুয়েন্ট এনক্রোচমেন্ট স্পর্শ)",
      "নিশ্চিত BOS-এর পর প্রাতিষ্ঠানিক অর্ডার ব্লক (OB) স্পর্শ",
      "বর্তমান প্রাইস ডেলিভারিতে কোনো FVG বা OB উপস্থিত নেই",
    ],
  },
  momentum: {
    title: "৮. মোমেন্টাম ও ইন্ট্রা-ক্যান্ডেল ভেলোসিটি",
    subtitle: "ক্যান্ডেল সাইজের ক্রমবিকাশ, ডেসিলারেশন (গতি হ্রাস) বা এক্সহশন ক্লান্তি মূল্যায়ন করুন।",
    placeholder: "যেমন: রাউন্ড নম্বর রেজিস্ট্যান্সে পৌঁছানোর সময় ক্যান্ডেল বডি ক্রমান্বয়ে ছোট ও সংকুচিত হয়েছে।",
    quickOptions: [
      "স্পষ্ট মোমেন্টাম ডেসিলারেশন: জোনে পৌঁছানোর সাথে সাথে বডি ক্রমান্বয়ে ছোট হওয়া",
      "এক্সহশন ক্লাইম্যাক্স: অস্বাভাবিক বিশালাকার ক্যান্ডেল যা রিটেইলদের আত্মসমর্পন নির্দেশ করে",
      "শক্তিশালী ডিসপ্লেসমেন্ট: ধারাবাহিক গতিসহ বড় স্বাস্থ্যকর বডি",
      "অনিশ্চয়তা / কম ভলিউমের চপ: কোনো দিক ছাড়া ছোট অনিয়মিত ক্যান্ডেল",
    ],
  },
  reaction: {
    title: "৯. রানিং ক্যান্ডেল রিঅ্যাকশন ও ক্লোজ-ইনসাইড",
    subtitle: "রিজেকশন উইক রেশিও এবং ক্লোজ-ব্যাক-ইনসাইড নিশ্চিতকরণ পরীক্ষা করুন।",
    placeholder: "যেমন: ৫০%+ আপার রিজেকশন শ্যাডো, কঠোরভাবে S/R বাউন্ডারির ভেতরে ক্লোজ হয়েছে।",
    quickOptions: [
      "শক্তিশালী রিজেকশন উইক (>= ৫০%) সহ লেভেলের ভেতরে ক্লোজ-ব্যাক-ইনসাইড",
      "ব্রেকআউট অ্যাকসেপ্ট্যান্স: লেভেলের বাইরে সলিড বডি ক্লোজ (কোনো রিভার্সাল নয়)",
      "ক্যান্ডেলের ১৫-৪৫ সেকেন্ড সময়ে গঠিত বিলম্বিত রিজেকশন",
      "অনির্ধারিত টানাপোড়েন: উইক ছাড়াই সরাসরি লাইনের উপরে ক্যান্ডেল ক্লোজ",
    ],
  },
  invalidationCondition: {
    title: "১০. ইনভ্যালিডেশন শর্ত ও রিস্ক চেক",
    subtitle: "সুনির্দিষ্ট মার্কেট ইভেন্ট সংজ্ঞায়িত করুন যা এই ট্রেডটিকে সম্পূর্ণ বাতিল করবে।",
    placeholder: "যেমন: পরবর্তী ক্যান্ডেল যদি প্রসারিত হয়ে ১.০৮৪৮৫-এর উপরে ক্লোজ হয় তবে ট্রেড বাতিল।",
    quickOptions: [
      "পরবর্তী ক্যান্ডেল কি-জোন বাউন্ডারির বাইরে ক্লোজ হলে ট্রেড বাতিল",
      "প্রাইস যদি FVG সহ বিপরীত ডিসপ্লেসমেন্ট ক্যান্ডেল তৈরি করে তবে বাতিল",
      "এক্সিকিউশন ল্যাটেন্সি ২ সেকেন্ড অতিক্রম করলে বাতিল",
      "ব্রোকার পেআউট < ৮০% বা সক্রিয় নিউজের কারণে ডিসকোয়ালিফাইড",
    ],
  },
};
