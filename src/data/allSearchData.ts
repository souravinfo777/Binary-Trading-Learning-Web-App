import { CURRICULUM_CHAPTERS } from "./curriculum";
import { SURESHOT_PATTERNS } from "./sureshotPatterns";
import { GAP_PATTERNS } from "./gapPatternsData";
import { SUPPLY_DEMAND_PATTERNS } from "./supplyDemandData";
import { STRAT_SETUPS, STRAT_CANDLE_DEFINITIONS } from "./stratData";
import { BUILTIN_SCENARIOS } from "./scenarios";

export type SearchCategory =
  | "curriculum"
  | "sureshot"
  | "supply_demand"
  | "star_pattern"
  | "gap_pattern"
  | "strat"
  | "simulation"
  | "math_risk"
  | "calculator"
  | "daily_challenge";

export interface GlobalSearchItem {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  category: SearchCategory;
  categoryLabelEn: string;
  categoryLabelBn: string;
  badge?: string;
  badgeColor?: string;
  signal?: "CALL" | "PUT" | "BOTH" | "NEUTRAL" | "NO TRADE";
  winRate?: string;
  tags: string[];
  target: {
    tab: "curriculum" | "simulation" | "daily-challenge" | "math-risk" | "playbook";
    subTab?: "sureshots" | "strat" | "gaps" | "supply_demand" | "calculator" | "blueprints";
    chapterId?: number;
    patternId?: string;
    scenarioId?: string;
    actionPrompt?: string;
  };
}

// Fixed Institutional Math, Risk & Calculator Search Items
const MATH_AND_SYSTEM_ITEMS: GlobalSearchItem[] = [
  {
    id: "math_break_even",
    titleEn: "Break-Even Win Rate Formula (BE% = 1 / (1 + Payout))",
    titleBn: "ব্রেক-ইভেন উইন-রেট ফর্মুলা (BE% = ১ / (১ + পেআউট))",
    subtitleEn: "Negative-Sum Asymmetry & Edge Requirements",
    subtitleBn: "নেগেটিভ-সাম ব্রোকার পে-আউট ও গাণিতিক প্রয়োজনীয়তা",
    descriptionEn: "At 85% broker payout, required break-even is 54.05%. Win rates below 55% inevitably bleed capital over hundreds of trades.",
    descriptionBn: "৮৫% ব্রোকার পেআউটে ন্যূনতম ব্রেক-ইভেন ৫৪.০৫%। ৫৫% এর নিচে ট্রেড করলে দীর্ঘমেয়াদে অ্যাকাউন্ট শূন্য হতে বাধ্য।",
    category: "math_risk",
    categoryLabelEn: "Math & Risk",
    categoryLabelBn: "ম্যাথ ও রিস্ক",
    badge: "54.05% BE",
    badgeColor: "bg-cyan-950 text-cyan-300 border-cyan-500/40",
    winRate: "BE: 54.05%",
    tags: [
      "break even", "breakeven", "ব্রেক ইভেন", "payout", "formula", "ফর্মুলা",
      "win rate", "উইন রেট", "math", "ম্যাথ", "calculator", "ev", "expected value"
    ],
    target: {
      tab: "math-risk",
      actionPrompt: "Explain the mathematical break-even formula in binary options trading and how broker payouts affect long-term expectancy.",
    },
  },
  {
    id: "math_fixed_one_percent",
    titleEn: "Fixed 1% Risk Compounding Rule",
    titleBn: "১% ফিক্সড রিস্ক ও কম্পাউন্ডিং মডেল",
    subtitleEn: "Geometric Capital Preservation System",
    subtitleBn: "মূলধন সুরক্ষার জ্যামিতিক রিস্ক ম্যানেজমেন্ট",
    descriptionEn: "Never risk more than 1% to 2% of equity per trade. Prevents account destruction during normal 4 to 6 loss statistical drawdown clusters.",
    descriptionBn: "প্রতি ট্রেডে মূলধনের ১% থেকে ২% এর বেশি রিস্ক নেওয়া নিষিদ্ধ। এটি টানা ৪-৬টি স্বাভাবিক স্টপলস ক্লাস্টারেও ব্যালেন্স অক্ষত রাখে।",
    category: "math_risk",
    categoryLabelEn: "Math & Risk",
    categoryLabelBn: "ম্যাথ ও রিস্ক",
    badge: "1% Rule",
    badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
    tags: [
      "1%", "one percent", "এক পারসেন্ট", "fixed risk", "রিস্ক", "compounding",
      "কম্পাউন্ডিং", "capital preservation", "টাকা সুরক্ষা", "money management"
    ],
    target: {
      tab: "math-risk",
      actionPrompt: "Explain why professional OTC traders use a fixed 1% risk per trade instead of increasing lot sizes after losses.",
    },
  },
  {
    id: "math_anti_martingale",
    titleEn: "Anti-Martingale Ruin Demonstration",
    titleBn: "মার্টিংগেল ধ্বংসের গাণিতিক প্রমাণ",
    subtitleEn: "Why 2.2x Doubling Guarantees Total Account Liquidation",
    subtitleBn: "কেন ২.২ গুণ বাজি বাড়ানো নিশ্চিত অ্যাকাউন্ট ধ্বংস ডেকে আনে",
    descriptionEn: "Doubling position after loss creates exponential risk progression (1, 2.2, 4.8, 10.6, 23.4, 51.5 units). 6 consecutive losses wipes 100% of capital.",
    descriptionBn: "ক্ষতির পর বাজি দ্বিগুণ করলে মাত্র ৬টি টানা লসে পুরো ১০০% ব্যালেন্স শূন্য হয়ে যায়। নো মার্টিংগেল!",
    category: "math_risk",
    categoryLabelEn: "Math & Risk",
    categoryLabelBn: "ম্যাথ ও রিস্ক",
    badge: "Ruin Proof",
    badgeColor: "bg-rose-950 text-rose-300 border-rose-500/40",
    tags: [
      "martingale", "মার্টিংগেল", "anti-martingale", "ruin", "ধ্বংস",
      "gambling fallacy", "loss recovery", "doubling", "লট দ্বিগুণ"
    ],
    target: {
      tab: "math-risk",
      actionPrompt: "Provide a detailed statistical proof of why Martingale guarantees account ruin in binary options trading.",
    },
  },
  {
    id: "math_kelly_criterion",
    titleEn: "Kelly Criterion & Optimal Bet Fraction",
    titleBn: "কেলি ক্রাইটেরিয়ন ও অপটিমাল বেট সাইজিং",
    subtitleEn: "Information Theory Sizing: f* = (bp - q) / b",
    subtitleBn: "তথ্য তত্ত্ব ভিত্তিক আদর্শ পজিশন সাইজিং",
    descriptionEn: "Calculates the mathematically optimal fraction of bankroll to wager given win rate and payout, capped at fractional Kelly (0.2x) to eliminate tail risk.",
    descriptionBn: "উইন রেট ও পেআউটের সাপেক্ষে সর্বোচ্চ লাভজনক ফ্র্যাকশনাল সাইজিং নির্ধারণের ফর্মুলা।",
    category: "math_risk",
    categoryLabelEn: "Math & Risk",
    categoryLabelBn: "ম্যাথ ও রিস্ক",
    badge: "Kelly Sizing",
    badgeColor: "bg-purple-950 text-purple-300 border-purple-500/40",
    tags: [
      "kelly", "kelly criterion", "কেলি", "sizing", "bet size", "position size",
      "ফর্মুলা", "probability math"
    ],
    target: {
      tab: "math-risk",
      actionPrompt: "How does the Kelly Criterion apply to high-probability OTC binary options setups?",
    },
  },
  {
    id: "math_circuit_breaker",
    titleEn: "3-Consecutive Loss Circuit Breaker Protocol",
    titleBn: "টানা ৩টি লসের পর ট্রেডিং সার্কিট ব্রেকার",
    subtitleEn: "Emotional Preservation & Terminal Lockout",
    subtitleBn: "ইমোশন কন্ট্রোল ও বাধ্যতামূলক টার্মিনাল লকআউট",
    descriptionEn: "After 3 consecutive losses in a session, all trading activity must immediately halt for at least 4 hours to eliminate tilt-induced revenge trading.",
    descriptionBn: "যেকোনো সেশনে টানা ৩টি ট্রেড লস হলে বাধ্যতামূলকভাবে ৪ ঘণ্টার জন্য ট্রেডিং প্ল্যাটফর্ম বন্ধ রাখার নিয়ম।",
    category: "math_risk",
    categoryLabelEn: "Math & Risk",
    categoryLabelBn: "ম্যাথ ও রিস্ক",
    badge: "Circuit Breaker",
    badgeColor: "bg-amber-950 text-amber-300 border-amber-500/40",
    tags: [
      "circuit breaker", "সার্কিট ব্রেকার", "3 loss", "consecutive loss", "revenge trading",
      "রিভেঞ্জ ট্রেডিং", "tilt", "psychology", "মনস্তত্ত্ব"
    ],
    target: {
      tab: "math-risk",
    },
  },
  {
    id: "calc_mos_50_midpoint",
    titleEn: "Interactive 50% Golden Midpoint & MOS Calculator",
    titleBn: "ইন্টারেক্টিভ ৫০% গোল্ডেন মিডপয়েন্ট ও MOS ক্যালকুলেটর",
    subtitleEn: "Margin of Safety (MOS) 15-Second Execution Helper",
    subtitleBn: "মার্জিন অফ সেফটি (MOS) ১৫ সেকেন্ড এক্সিকিউশন হেল্পার",
    descriptionEn: "Input candle High and Low to compute the exact institutional 50% equilibrium level and 15s entry window threshold in real-time.",
    descriptionBn: "ক্যান্ডেলের High এবং Low মান দিয়ে তাৎক্ষণিক ৫০% ইকুইলিব্রিয়াম এবং ১৫ সেকেন্ডের MOS এন্ট্রি লেভেল বের করুন।",
    category: "calculator",
    categoryLabelEn: "Calculator",
    categoryLabelBn: "ক্যালকুলেটর",
    badge: "50% Midpoint",
    badgeColor: "bg-cyan-950 text-cyan-300 border-cyan-500/40",
    tags: [
      "calculator", "ক্যালকুলেটর", "mos", "margin of safety", "মার্জিন অফ সেফটি",
      "50%", "midpoint", "গোল্ডেন লেভেল", "15 second", "১৫ সেকেন্ড", "entry price"
    ],
    target: {
      tab: "playbook",
      subTab: "calculator",
    },
  },
  {
    id: "daily_challenge_feature",
    titleEn: "Daily Trading Challenge & Streak System",
    titleBn: "দৈনিক ট্রেডিং চ্যালেঞ্জ ও স্ট্রিক সিস্টেম",
    subtitleEn: "1-Trade Per Day Algorithmic Discipline Protocol",
    subtitleBn: "প্রতিদিন ১টি মাত্র হাই-কনফ্লুয়েন্স প্রাতিষ্ঠানিক ড্রিল",
    descriptionEn: "Test your skills on a fresh OTC market scenario every single day, build uninterrupted discipline streaks, and unlock trader achievement badges.",
    descriptionBn: "প্রতিদিন নতুন ওটিসি পরিস্থিতি সমাধান করুন, নিয়ম মেনে স্ট্রিক বাড়ান এবং প্রাতিষ্ঠানিক ব্যাজ আনলক করুন।",
    category: "daily_challenge",
    categoryLabelEn: "Daily Challenge",
    categoryLabelBn: "দৈনিক চ্যালেঞ্জ",
    badge: "Streak Engine",
    badgeColor: "bg-amber-950 text-amber-300 border-amber-500/40",
    tags: [
      "daily challenge", "দৈনিক চ্যালেঞ্জ", "challenge", "চ্যালেঞ্জ", "streak", "স্ট্রিক",
      "badge", "ব্যাজ", "discipline", "ডিসিপ্লিন", "practice"
    ],
    target: {
      tab: "daily-challenge",
    },
  },
];

// Build unified items from all existing modules
export function buildGlobalSearchIndex(): GlobalSearchItem[] {
  const items: GlobalSearchItem[] = [];

  // 1. Math & Tools
  items.push(...MATH_AND_SYSTEM_ITEMS);

  // 2. Curriculum Chapters (30 Chapters)
  CURRICULUM_CHAPTERS.forEach((ch) => {
    const rulesSummary = ch.strictRules.slice(0, 2).join("; ");
    items.push({
      id: `curriculum_ch_${ch.id}`,
      titleEn: `Chapter ${ch.id}: ${ch.title}`,
      titleBn: `অধ্যায় ${ch.id}: ${ch.title}`,
      subtitleEn: `${ch.category} • Institutional Rule Engine`,
      subtitleBn: `${ch.category} • প্রাতিষ্ঠানিক নির্দেশিকা`,
      descriptionEn: `${ch.coreThesis} ${rulesSummary}`,
      descriptionBn: `${ch.coreThesis}`,
      category: "curriculum",
      categoryLabelEn: "Curriculum",
      categoryLabelBn: "কারিকুলাম (অধ্যায়)",
      badge: `CH ${ch.id}`,
      badgeColor: "bg-blue-950 text-blue-300 border-blue-500/40",
      tags: [
        `ch ${ch.id}`,
        `chapter ${ch.id}`,
        `অধ্যায় ${ch.id}`,
        `অধ্যায় ${ch.id}`,
        `${ch.id}`,
        ch.title.toLowerCase(),
        ch.category.toLowerCase(),
        ...ch.technicalTheory.map((t) => t.slice(0, 40).toLowerCase()),
        ...ch.orderFlowMechanics.map((m) => m.title.toLowerCase()),
      ],
      target: {
        tab: "curriculum",
        chapterId: ch.id,
        actionPrompt: `Explain the core concepts and execution rules of Chapter ${ch.id}: ${ch.title}.`,
      },
    });
  });

  // 3. Sureshot Patterns (10 Patterns)
  SURESHOT_PATTERNS.forEach((p) => {
    items.push({
      id: `sureshot_${p.id}`,
      titleEn: `Sureshot #${p.number}: ${p.titleEn}`,
      titleBn: `শিওর শট #${p.number}: ${p.titleBn}`,
      subtitleEn: `${p.category} • Est Win Rate: ${p.winRateEst}`,
      subtitleBn: `${p.categoryBn} • প্রত্যাশিত উইন রেট: ${p.winRateEst}`,
      descriptionEn: `${p.summaryEn} Golden Rule: ${p.goldenRuleEn}`,
      descriptionBn: `${p.summaryBn} মূল নিয়ম: ${p.goldenRuleBn}`,
      category: "sureshot",
      categoryLabelEn: "Sureshots",
      categoryLabelBn: "শিওর শট প্যাটার্ন",
      badge: `SURESHOT #${p.number}`,
      badgeColor: "bg-cyan-950 text-cyan-300 border-cyan-500/40",
      signal: p.tradeDirection,
      winRate: p.winRateEst,
      tags: [
        `sureshot ${p.number}`,
        `sureshot`,
        `শিওর শট`,
        `শিওরশট`,
        p.titleEn.toLowerCase(),
        p.titleBn.toLowerCase(),
        p.category.toLowerCase(),
        p.categoryBn.toLowerCase(),
        p.tradeDirection.toLowerCase(),
        "snr",
        "retest",
        "রিটেস্ট",
        "mos",
        "margin of safety",
        "মার্জিন",
      ],
      target: {
        tab: "playbook",
        subTab: "sureshots",
        patternId: p.id,
        scenarioId: p.linkedScenarioId,
        actionPrompt: `Explain the entry mechanics and invalidation rules for Sureshot Pattern: ${p.titleEn}.`,
      },
    });
  });

  // 4. Supply & Demand + Star Candlesticks (8 Patterns)
  SUPPLY_DEMAND_PATTERNS.forEach((p) => {
    const isStar = p.category === "Star Candlesticks";
    items.push({
      id: `supply_demand_${p.id}`,
      titleEn: `${p.titleEn} (${p.category})`,
      titleBn: `${p.titleBn} (${p.category === "Star Candlesticks" ? "স্টার প্যাটার্ন" : "সাপ্লাই ও ডিমান্ড"})`,
      subtitleEn: `${p.zoneType} • ${p.type} Setup • ${p.signal} Signal`,
      subtitleBn: `${p.zoneType} • ${p.type} সেটআপ • ${p.signal} সিগন্যাল`,
      descriptionEn: `${p.summaryEn} Entry: ${p.entryStrategyEn} MOS Rule: ${p.mosRuleEn}`,
      descriptionBn: `${p.summaryBn} এন্ট্রি: ${p.entryStrategyBn}`,
      category: isStar ? "star_pattern" : "supply_demand",
      categoryLabelEn: isStar ? "Star Formations" : "Supply & Demand",
      categoryLabelBn: isStar ? "স্টার ক্যান্ডেলস্টিক" : "সাপ্লাই ও ডিমান্ড",
      badge: isStar ? "STAR SETUP" : "S&D ZONE",
      badgeColor: isStar
        ? "bg-amber-950 text-amber-300 border-amber-500/40"
        : "bg-emerald-950 text-emerald-300 border-emerald-500/40",
      signal: p.signal,
      winRate: p.winRateEst,
      tags: [
        p.titleEn.toLowerCase(),
        p.titleBn.toLowerCase(),
        p.category.toLowerCase(),
        p.zoneType.toLowerCase(),
        p.signal.toLowerCase(),
        "supply",
        "demand",
        "সাপ্লাই",
        "ডিমান্ড",
        "double top",
        "double bottom",
        "ডাবল টপ",
        "ডাবল বটম",
        "flag",
        "ফ্ল্যাগ",
        "morning star",
        "evening star",
        "মর্নিং স্টার",
        "ইভনিং স্টার",
        "star",
        "স্টার",
        "retest",
        "রিটেস্ট",
      ],
      target: {
        tab: "playbook",
        subTab: "supply_demand",
        patternId: p.id,
        scenarioId: p.linkedScenarioId,
        actionPrompt: `How do I trade the ${p.titleEn} pattern with high margin of safety in OTC binary options?`,
      },
    });
  });

  // 5. Gap Patterns (9 Formations)
  GAP_PATTERNS.forEach((p) => {
    items.push({
      id: `gap_${p.id}`,
      titleEn: `Gap #${p.number}: ${p.titleEn}`,
      titleBn: `গ্যাপ #${p.number}: ${p.titleBn}`,
      subtitleEn: `${p.category} • ${p.action} Signal • ${p.winRateEst}`,
      subtitleBn: `${p.categoryBn} • ${p.action} সিগন্যাল • ${p.winRateEst}`,
      descriptionEn: `${p.summaryEn} Core Rule: ${p.coreRuleEn} OTC Nuance: ${p.otcNuanceEn}`,
      descriptionBn: `${p.summaryBn} মূল নিয়ম: ${p.coreRuleBn}`,
      category: "gap_pattern",
      categoryLabelEn: "Gap Patterns",
      categoryLabelBn: "গ্যাপ প্যাটার্নস (৯টি)",
      badge: `GAP #${p.number}`,
      badgeColor: "bg-purple-950 text-purple-300 border-purple-500/40",
      signal: p.action,
      winRate: p.winRateEst,
      tags: [
        `gap ${p.number}`,
        `gap`,
        `গ্যাপ`,
        p.titleEn.toLowerCase(),
        p.titleBn.toLowerCase(),
        p.category.toLowerCase(),
        p.categoryBn.toLowerCase(),
        p.action.toLowerCase(),
        "reversal gap",
        "momentum gap",
        "weekend gap",
        "liquidity run gap",
        "gap fill",
        "উইকএন্ড গ্যাপ",
        "গ্যাপ ফিল",
      ],
      target: {
        tab: "playbook",
        subTab: "gaps",
        patternId: p.id,
        actionPrompt: `Explain the order flow reason and execution criteria for ${p.titleEn}.`,
      },
    });
  });

  // 6. The Strat Setups & Candle Definitions
  STRAT_CANDLE_DEFINITIONS.forEach((def) => {
    items.push({
      id: `strat_def_${def.type}`,
      titleEn: `The Strat ${def.nameEn}`,
      titleBn: `দ্য স্ট্র্যাট ${def.nameBn}`,
      subtitleEn: "Core Candlestick Actionable Science",
      subtitleBn: "ক্যান্ডেলস্টিক অ্যাকশনেবল সায়েন্স",
      descriptionEn: `${def.descriptionEn} Rule: ${def.ruleEn}`,
      descriptionBn: `${def.descriptionBn} নিয়ম: ${def.ruleBn}`,
      category: "strat",
      categoryLabelEn: "The Strat",
      categoryLabelBn: "দ্য স্ট্র্যাট (The Strat)",
      badge: `STRAT ${def.type}`,
      badgeColor: "bg-yellow-950 text-yellow-300 border-yellow-500/40",
      tags: [
        "strat",
        "the strat",
        "স্ট্র্যাট",
        def.nameEn.toLowerCase(),
        def.nameBn.toLowerCase(),
        `type ${def.type.toLowerCase()}`,
        `টাইপ ${def.type.toLowerCase()}`,
        "inside bar",
        "ইনসাইড বার",
        "directional",
        "outside bar",
        "আউটসাইড বার",
      ],
      target: {
        tab: "playbook",
        subTab: "strat",
        actionPrompt: `How do professional traders use ${def.nameEn} in binary options trading?`,
      },
    });
  });

  STRAT_SETUPS.forEach((setup) => {
    items.push({
      id: `strat_setup_${setup.id}`,
      titleEn: `The Strat Setup: ${setup.titleEn} (${setup.code})`,
      titleBn: `দ্য স্ট্র্যাট সেটআপ: ${setup.titleBn} (${setup.code})`,
      subtitleEn: `${setup.category} • ${setup.bias} Bias • ${setup.winRate}`,
      subtitleBn: `${setup.categoryBn} • ${setup.bias} বায়াস • ${setup.winRate}`,
      descriptionEn: `${setup.descriptionEn} Trigger Wick: ${setup.triggerWickRuleEn} 50% Rule: ${setup.rule50PercentEn}`,
      descriptionBn: `${setup.descriptionBn} ট্রিগার উইক: ${setup.triggerWickRuleBn}`,
      category: "strat",
      categoryLabelEn: "The Strat",
      categoryLabelBn: "দ্য স্ট্র্যাট (The Strat)",
      badge: setup.code,
      badgeColor: "bg-yellow-950 text-yellow-300 border-yellow-500/40",
      signal: setup.bias,
      winRate: setup.winRate,
      tags: [
        "strat",
        "the strat",
        "স্ট্র্যাট",
        setup.code.toLowerCase(),
        setup.titleEn.toLowerCase(),
        setup.titleBn.toLowerCase(),
        setup.category.toLowerCase(),
        "2-1-2",
        "3-1-2",
        "2-2",
        "reversal",
        "continuation",
        "কন্টিনিউয়েশন",
        "রিভার্সাল",
      ],
      target: {
        tab: "playbook",
        subTab: "strat",
        actionPrompt: `Explain how to enter the Strat ${setup.code} setup with the wick-trigger rule.`,
      },
    });
  });

  // 7. Interactive Simulation Scenarios (Builtin)
  BUILTIN_SCENARIOS.forEach((sc) => {
    items.push({
      id: `drill_${sc.scenario_id}`,
      titleEn: `Interactive Drill: ${sc.topic} (${sc.scenario_id})`,
      titleBn: `ইন্টারেক্টিভ ড্রিল: ${sc.topic} (${sc.scenario_id})`,
      subtitleEn: `${sc.market_context.asset} • ${sc.market_context.trend} • Action: ${sc.expected_action}`,
      subtitleBn: `${sc.market_context.asset} • ${sc.market_context.trend} • অ্যাকশন: ${sc.expected_action}`,
      descriptionEn: `${sc.prompt_question} Ideal: ${sc.ideal_10_point_analysis.execution}`,
      descriptionBn: `${sc.prompt_question}`,
      category: "simulation",
      categoryLabelEn: "Drill Scenario",
      categoryLabelBn: "প্র্যাকটিস ড্রিল",
      badge: sc.scenario_id,
      badgeColor: "bg-cyan-950 text-cyan-300 border-cyan-500/40",
      signal: sc.expected_action,
      tags: [
        "drill",
        "scenario",
        "ড্রিল",
        "সিমুলেশন",
        "simulation",
        sc.scenario_id.toLowerCase(),
        sc.topic.toLowerCase(),
        sc.market_context.asset.toLowerCase(),
        sc.market_context.trend.toLowerCase(),
        `chapter ${sc.chapter}`,
        `ch ${sc.chapter}`,
        "fvg",
        "order block",
        "ob",
        "choch",
        "liquidity sweep",
      ],
      target: {
        tab: "simulation",
        scenarioId: sc.scenario_id,
        actionPrompt: `Walk me through the 10-point confluence checklist for scenario ${sc.scenario_id}.`,
      },
    });
  });

  return items;
}

// Global cached database
let cachedSearchIndex: GlobalSearchItem[] | null = null;

export function getGlobalSearchIndex(): GlobalSearchItem[] {
  if (!cachedSearchIndex) {
    cachedSearchIndex = buildGlobalSearchIndex();
  }
  return cachedSearchIndex;
}

// Search algorithm with multi-word and phonetic scoring
export function searchGlobalTopics(query: string, categoryFilter: string = "all"): GlobalSearchItem[] {
  const index = getGlobalSearchIndex();
  const trimmed = query.trim().toLowerCase();

  // If query is empty, return top featured institutional items
  if (!trimmed) {
    const featured = index.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      return (
        item.id === "math_break_even" ||
        item.id === "sureshot_ss_01_50_retest" ||
        item.id === "supply_demand_sd_double_top" ||
        item.id === "supply_demand_sd_morning_star" ||
        item.id === "gap_gap_01_reversal_bearish" ||
        item.id === "curriculum_ch_7" ||
        item.id === "curriculum_ch_8" ||
        item.id === "curriculum_ch_10" ||
        item.id === "strat_setup_strat_2_1_2u_cont" ||
        item.id === "drill_OTC_CH10_001"
      );
    });
    return featured.length > 0 ? featured : index.slice(0, 10);
  }

  const queryTerms = trimmed.split(/\s+/).filter(Boolean);

  const scoredResults = index
    .filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      return true;
    })
    .map((item) => {
      let score = 0;
      const titleEn = item.titleEn.toLowerCase();
      const titleBn = item.titleBn.toLowerCase();
      const subtitleEn = item.subtitleEn.toLowerCase();
      const subtitleBn = item.subtitleBn.toLowerCase();
      const descEn = item.descriptionEn.toLowerCase();
      const descBn = item.descriptionBn.toLowerCase();
      const id = item.id.toLowerCase();
      const tagsStr = item.tags.join(" ").toLowerCase();

      // Check full query exact match
      if (titleEn.includes(trimmed) || titleBn.includes(trimmed)) score += 100;
      if (id.includes(trimmed)) score += 80;
      if (subtitleEn.includes(trimmed) || subtitleBn.includes(trimmed)) score += 50;
      if (tagsStr.includes(trimmed)) score += 40;
      if (descEn.includes(trimmed) || descBn.includes(trimmed)) score += 25;

      // Check each term
      let allTermsMatch = true;
      for (const term of queryTerms) {
        const inTitle = titleEn.includes(term) || titleBn.includes(term);
        const inSub = subtitleEn.includes(term) || subtitleBn.includes(term);
        const inTags = tagsStr.includes(term);
        const inDesc = descEn.includes(term) || descBn.includes(term);
        const inId = id.includes(term);

        if (inTitle) score += 40;
        else if (inSub) score += 20;
        else if (inTags) score += 15;
        else if (inId) score += 25;
        else if (inDesc) score += 10;
        else {
          allTermsMatch = false;
        }
      }

      if (allTermsMatch) score += 30;

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  return scoredResults;
}
