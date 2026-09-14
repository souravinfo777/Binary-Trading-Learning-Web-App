export interface Candle {
  index: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume_proxy?: number;
  timestamp?: string;
  isForming?: boolean;
}

export interface FVGZone {
  top: number;
  bottom: number;
  type: "bullish" | "bearish";
  isMitigated?: boolean;
}

export interface OrderBlockZone {
  top: number;
  bottom: number;
  type: "bullish" | "bearish";
  isMitigated?: boolean;
}

export interface LiquidityPool {
  level: number;
  type: "BSL" | "SSL"; // Buy-side Liquidity / Sell-side Liquidity
  swept: boolean;
  label?: string;
}

export interface MarketContext {
  asset: string;
  trend: "Uptrend" | "Downtrend" | "Range-bound" | "Compression";
  key_levels: number[];
  round_numbers?: number[];
  fvg_zone?: FVGZone | null;
  order_block?: OrderBlockZone | null;
  liquidity_pool?: LiquidityPool | null;
  higherTimeframeBias?: "Bullish" | "Bearish" | "Neutral";
}

export interface TenPointMatrix {
  trend: string;
  structure: string;
  location: string;
  keyLevel: string;
  roundNumber: string;
  liquidity: string;
  fvgOb: string;
  momentum: string;
  reaction: string;
  executionAction: "CALL" | "PUT" | "NO TRADE" | "";
  expiry: "1M" | "2M" | "";
  invalidationCondition: string;
}

export interface RubricFactorScore {
  score: number;
  max: number;
  feedback: string;
}

export interface EvaluationResult {
  grade: number; // 0 to 100
  verdict: string;
  confluenceTier: "A_PLUS" | "A_TIER" | "B_TIER" | "C_TIER" | "DISQUALIFIED";
  summary: string;
  rubricBreakdown: {
    trend: RubricFactorScore;
    structure: RubricFactorScore;
    location: RubricFactorScore;
    keyLevel: RubricFactorScore;
    roundNumber: RubricFactorScore;
    liquidity: RubricFactorScore;
    fvgOb: RubricFactorScore;
    momentum: RubricFactorScore;
    reaction: RubricFactorScore;
    execution: RubricFactorScore;
  };
  blindSpots: string[];
  institutionalTakeaway: string;
  isWon?: boolean;
  userAction: "CALL" | "PUT" | "NO TRADE";
  expectedAction: "CALL" | "PUT" | "NO TRADE";
  payoutEv?: number;
}

export interface Scenario {
  scenario_id: string;
  chapter: number;
  topic: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Institutional";
  market_context: MarketContext;
  candles: Candle[];
  pause_at_index: number;
  prompt_question: string;
  expected_action: "CALL" | "PUT" | "NO TRADE";
  expected_expiry: "1M" | "2M";
  ideal_10_point_analysis: {
    trend: string;
    structure: string;
    location: string;
    keyLevel: string;
    roundNumber: string;
    liquidity: string;
    fvgOb: string;
    momentum: string;
    reaction: string;
    execution: string;
  };
  resolution_next_candle: {
    index: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume_proxy?: number;
    outcome_explanation: string;
  };
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  mechanicsKey: string;
}

export interface Chapter {
  id: number;
  title: string;
  category:
    | "Foundations & Math"
    | "Candlestick Mechanics"
    | "Structure & Levels"
    | "Liquidity & Imbalance"
    | "Running Candle & Traps"
    | "Execution & Matrix"
    | "Advanced Confluence & OTC"
    | "Risk, Edge & Playbook";
  coreThesis: string;
  zeroHypeRule: string;
  technicalTheory: string[];
  orderFlowMechanics: {
    title: string;
    description: string;
    whyItHappens: string;
  }[];
  strictRules: string[];
  invalidations: string[];
  diagnosticQuestions: DiagnosticQuestion[];
  linkedScenarioId?: string;
}

export interface TradeLogItem {
  id: string;
  scenarioId: string;
  chapter: number;
  topic: string;
  action: string;
  isWon: boolean;
  grade: number;
  tier: string;
  timestamp: string;
}

export interface UserStats {
  completedChapters: number[];
  totalSimulations: number;
  simulationsWon: number;
  averageGrade: number;
  simulatedBalance: number;
  tradeLog: TradeLogItem[];
}

export interface DailyChallengeRecord {
  date: string; // YYYY-MM-DD
  scenarioId: string;
  topic: string;
  asset: string;
  userAction: "CALL" | "PUT" | "NO TRADE";
  expectedAction: "CALL" | "PUT" | "NO TRADE";
  grade: number;
  tier: "A_PLUS" | "A_TIER" | "B_TIER" | "C_TIER" | "DISQUALIFIED";
  isWon: boolean;
  timestamp: string;
}

export interface StreakBadge {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  icon: string; // lucide icon identifier
  category: "streak" | "grade" | "win";
  requirement: number; // e.g. 1, 3, 7, 14, 30 days or score 90/100
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  unlockedAt?: string; // date string or undefined if locked
}

export interface DailyChallengeState {
  currentStreak: number;
  bestStreak: number;
  totalCompleted: number;
  lastCompletedDate?: string;
  unlockedBadgeIds: string[];
  history: DailyChallengeRecord[];
}
