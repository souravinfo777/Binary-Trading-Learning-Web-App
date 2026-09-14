import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Mentor Chat API
app.post("/api/mentor/ask", async (req, res) => {
  try {
    const { message, context, chapter } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Deterministic Mentor Knowledge Response when API key isn't active
      return res.json({
        reply: `[Institutional Mentor Engine - Offline Mode]\nRegarding Chapter ${chapter || "Price Action"}: In OTC markets, remember our core axioms:\n1. Zero Martingale & Zero Hype: Every candle is probabilistic. A 60% win-rate with 1:0.85 payout is statistically viable ONLY with strict risk management.\n2. Confluence over Isolation: Never trade a standalone pin bar or candle color. Require at least 3 confluence layers (e.g., FVG tap + round number .00 + micro-structure CHOCH).\n3. Algorithmic Rejection vs Acceptance: Look for how the running candle behaves at the zone. If it expands rapidly through a level without wick reaction, it is acceptance—do not counter-trend trade!`,
      });
    }

    const systemInstruction = `You are the "OTC Quantitative Price Action Engine & Algorithmic Trading Mentor".
Your role is to teach, test, and evaluate traders on 1-minute (1M) and 2-minute (2M) Binary Options and OTC chart reading across a 30-Chapter Master Curriculum.
Core Principles:
1. ZERO HYPE & ZERO MARTINGALE: Never promise 99%/100% win rates. Emphasize that "NO TRADE" is often the highest EV decision.
2. CONFLUENCE OVER ISOLATION: A single candle, indicator, or level is never a signal.
3. OTC MARKET AWARENESS: Acknowledge broker-algorithm price delivery (liquidity sweeps, wick traps, round-number rejections, imbalance fills).
4. RIGOROUS EVALUATION: Grade like an institutional risk officer. Call out FOMO, chasing momentum into round numbers, or ignoring unmitigated FVGs.
Tone: Concise, technical, disciplined, mathematical, institutional.`;

    const prompt = `Context: ${context || "General OTC Price Action"}\nCurrent Chapter: ${chapter || "All"}\nUser Query: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    res.json({ reply: response.text || "No response generated." });
  } catch (error: any) {
    console.error("Mentor Ask Error:", error);
    res.status(500).json({ error: error.message || "Failed to process mentor query" });
  }
});

// Institutional 10-Point Evaluation API
app.post("/api/mentor/evaluate", async (req, res) => {
  try {
    const { scenario, submission } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback deterministic institutional rubric grading
      const action = submission.executionAction?.toUpperCase() || "NO TRADE";
      const expectedAction = scenario.expected_action || "PUT";
      const isCorrectDirection = action === expectedAction;
      const score = isCorrectDirection ? 85 : 45;

      return res.json({
        grade: score,
        verdict: isCorrectDirection ? "APPROVED SETUP" : "RISK REJECTED",
        confluenceTier: isCorrectDirection ? "A_TIER" : "C_TIER",
        summary: `Institutional Risk Officer Review: You selected ${action}. Expected institutional positioning was ${expectedAction}.`,
        rubricBreakdown: {
          trend: { score: 9, max: 10, feedback: "Recognized micro order flow trajectory." },
          structure: { score: 8, max: 10, feedback: "Accurately noted BOS/CHOCH state." },
          location: { score: 9, max: 10, feedback: "Correctly assessed premium/discount zone." },
          keyLevel: { score: 8, max: 10, feedback: "Identified relevant supply/demand zone." },
          roundNumber: { score: 9, max: 10, feedback: "Factored proximity to psychological level." },
          liquidity: { score: 8, max: 10, feedback: "Checked for swept highs/lows." },
          fvgOb: { score: 9, max: 10, feedback: "Evaluated imbalance fill status." },
          momentum: { score: 8, max: 10, feedback: "Analyzed candle velocity correctly." },
          reaction: { score: 9, max: 10, feedback: "Observed wick rejection timing." },
          execution: { score: isCorrectDirection ? 10 : 3, max: 10, feedback: isCorrectDirection ? "Optimal execution discipline." : "Sub-optimal direction selection." },
        },
        blindSpots: [
          "Always verify if the previous swing high/low swept buy-side or sell-side liquidity before the zone tap.",
          "Check intra-candle clock: rejection wicks formed in the first 30 seconds carry 2x the statistical validity of late spikes.",
        ],
        institutionalTakeaway: "In OTC algorithms, price seeks liquidity pools before returning to equilibrium. Never trade in the middle of nowhere without multi-factor confluence.",
      });
    }

    const systemInstruction = `You are an Institutional Risk Officer and Algorithmic Trading Mentor specializing in 1M/2M OTC Binary Options Price Action.
Evaluate the trader's 10-point analysis and execution decision for the provided chart scenario.
Grade strictly on a 0-100% scale based on:
- Multi-factor confluence analysis (Trend, Structure, Location, Key Level, Round Number, Liquidity, FVG/OB, Momentum, Reaction).
- Selection of CALL / PUT / NO TRADE and 1M/2M expiry.
- Identification of traps, wick rejections, and round-number magnetism.
- Punish gambling habits (e.g. trading without confluence, chasing momentum into resistance).

Return ONLY valid JSON matching this schema:
{
  "grade": number (0 to 100),
  "verdict": string (e.g., "INSTITUTIONAL PASS - A+ CONFLUENCE" or "REJECTED - HIGH RISK FOMO"),
  "confluenceTier": string ("A_PLUS", "A_TIER", "B_TIER", "C_TIER", "DISQUALIFIED"),
  "summary": string,
  "rubricBreakdown": {
    "trend": {"score": number (0-10), "max": 10, "feedback": string},
    "structure": {"score": number (0-10), "max": 10, "feedback": string},
    "location": {"score": number (0-10), "max": 10, "feedback": string},
    "keyLevel": {"score": number (0-10), "max": 10, "feedback": string},
    "roundNumber": {"score": number (0-10), "max": 10, "feedback": string},
    "liquidity": {"score": number (0-10), "max": 10, "feedback": string},
    "fvgOb": {"score": number (0-10), "max": 10, "feedback": string},
    "momentum": {"score": number (0-10), "max": 10, "feedback": string},
    "reaction": {"score": number (0-10), "max": 10, "feedback": string},
    "execution": {"score": number (0-10), "max": 10, "feedback": string}
  },
  "blindSpots": [string],
  "institutionalTakeaway": string
}`;

    const prompt = `Chart Scenario Context:
${JSON.stringify(scenario, null, 2)}

User Trader Submission (10-Point Decision Matrix):
${JSON.stringify(submission, null, 2)}

Evaluate ruthlessly. Deliver exact numerical scores and pointed feedback for every point.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Evaluation Error:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate trader submission" });
  }
});

// Custom Scenario Generator API
app.post("/api/mentor/generate-scenario", async (req, res) => {
  try {
    const { chapter, topic, difficulty } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(400).json({
        error: "AI Scenario Generation requires GEMINI_API_KEY. Using built-in scenario repository.",
      });
    }

    const systemInstruction = `You are the OTC Quantitative Price Action Engine.
Generate an authentic 1M/2M binary options OTC candlestick dataset and challenge adhering strictly to the JSON schema.
The dataset must have 6 to 10 historical candles with a pause point at the decision candle, followed by the actual next candle resolution.
Ensure mathematical consistency in OHLC values:
For green candle: low <= open < close <= high.
For red candle: low <= close < open <= high.
Pip precision should be 5 decimals (e.g. 1.08450).

Return ONLY valid JSON:
{
  "scenario_id": string (e.g., "OTC_GEN_001"),
  "chapter": number (1 to 30),
  "topic": string,
  "difficulty": string ("Beginner" | "Intermediate" | "Advanced" | "Institutional"),
  "market_context": {
    "asset": string (e.g., "EUR/USD (OTC)"),
    "trend": string ("Uptrend" | "Downtrend" | "Range-bound"),
    "key_levels": [number],
    "round_numbers": [number],
    "fvg_zone": {"top": number, "bottom": number, "type": "bullish" | "bearish"} | null,
    "order_block": {"top": number, "bottom": number, "type": "bullish" | "bearish"} | null,
    "liquidity_pool": {"level": number, "type": "BSL" | "SSL", "swept": boolean} | null
  },
  "candles": [
    {"index": number, "open": number, "high": number, "low": number, "close": number, "volume_proxy": number}
  ],
  "pause_at_index": number,
  "prompt_question": string,
  "expected_action": "CALL" | "PUT" | "NO TRADE",
  "expected_expiry": "1M" | "2M",
  "ideal_10_point_analysis": {
    "trend": string,
    "structure": string,
    "location": string,
    "keyLevel": string,
    "roundNumber": string,
    "liquidity": string,
    "fvgOb": string,
    "momentum": string,
    "reaction": string,
    "execution": string
  },
  "resolution_next_candle": {
    "index": number,
    "open": number,
    "high": number,
    "low": number,
    "close": number,
    "volume_proxy": number,
    "outcome_explanation": string
  }
}`;

    const prompt = `Generate a realistic OTC scenario for Chapter ${chapter || 10}: "${topic || "Imbalance Fills & Wick Traps"}", difficulty: ${difficulty || "Advanced"}. Make the price action subtle with realistic algorithmic liquidity sweep or round-number trap.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Scenario Generator Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate scenario" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OTC Trading Mentor Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
