import React, { useState, useMemo } from "react";
import { UserStats } from "../types";
import { useLanguage } from "../context/LanguageContext";
import {
  AlertOctagon,
  Calculator,
  CheckCircle2,
  DollarSign,
  Download,
  Flame,
  LineChart,
  Percent,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

interface MathRiskViewProps {
  stats: UserStats;
}

export const MathRiskView: React.FC<MathRiskViewProps> = ({ stats }) => {
  const { t, isBn, getTierName, getActionName } = useLanguage();
  // Interactive Math Model parameters
  const [payoutRate, setPayoutRate] = useState<number>(85); // 85%
  const [winRate, setWinRate] = useState<number>(62); // 62%
  const [startingBalance, setStartingBalance] = useState<number>(1000);
  const [riskPerTradePercent, setRiskPerTradePercent] = useState<number>(1); // 1%

  // Mathematical Calculations
  const breakEvenWinRate = useMemo(() => {
    return (1 / (1 + payoutRate / 100)) * 100;
  }, [payoutRate]);

  const expectedValuePerTrade = useMemo(() => {
    const p = winRate / 100;
    const payout = payoutRate / 100;
    // EV = (P * Payout) - ((1 - P) * 1)
    return p * payout - (1 - p) * 1.0;
  }, [winRate, payoutRate]);

  // Generate 50-Trade Equity Curve Simulation: 1% Fixed vs 2.2x Martingale
  const simulatedCurves = useMemo(() => {
    let fixedBalance = startingBalance;
    let martBalance = startingBalance;
    let martStake = (startingBalance * riskPerTradePercent) / 100;
    let martBustTrade = -1;

    const fixedData: number[] = [fixedBalance];
    const martData: number[] = [martBalance];

    // Seeded pseudo-random deterministic trade sequence matching winRate
    for (let i = 1; i <= 50; i++) {
      const isWin = (i * 17 + winRate * 3) % 100 < winRate;

      // 1% Fixed risk
      const fixedStake = (fixedBalance * riskPerTradePercent) / 100;
      if (isWin) {
        fixedBalance += fixedStake * (payoutRate / 100);
      } else {
        fixedBalance -= fixedStake;
      }
      fixedData.push(fixedBalance);

      // Martingale Progression (x2.2 multiplier on loss)
      if (martBustTrade === -1) {
        if (isWin) {
          martBalance += martStake * (payoutRate / 100);
          martStake = (startingBalance * riskPerTradePercent) / 100; // reset
        } else {
          martBalance -= martStake;
          martStake = martStake * 2.2;
          if (martStake > martBalance || martBalance <= 0) {
            martBalance = 0;
            martBustTrade = i;
          }
        }
        martData.push(martBalance);
      } else {
        martData.push(0);
      }
    }

    return { fixedData, martData, martBustTrade };
  }, [winRate, payoutRate, startingBalance, riskPerTradePercent]);

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full">
      {/* Header Banner */}
      <div className="p-3.5 sm:p-6 bg-[#111827] rounded-xl border border-[#1F2937] shadow-lg space-y-2 sm:space-y-2.5">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
          <Calculator className="w-4 h-4" />
          <span>{t("mathBadge")}</span>
        </div>
        <h1 className="text-lg sm:text-2xl font-bold text-gray-100">
          {t("mathTitle")}
        </h1>
        <p className="text-xs sm:text-base text-gray-300 max-w-4xl leading-relaxed">
          {t("mathSubtitle")}
        </p>
      </div>

      {/* Grid: Expectancy Calculator & Math Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Column (5 Cols): Interactive Formula Controls */}
        <div className="lg:col-span-5 p-3.5 sm:p-5 bg-[#111827] rounded-xl border border-[#1F2937] space-y-3.5 sm:space-y-4 shadow-md">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200 font-mono flex items-center gap-2">
            <Percent className="w-4 h-4 text-cyan-400" />
            <span>{t("expectancyParams")}</span>
          </h2>

          {/* Slider: Broker Payout % */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300 font-medium">{t("payoutRate")}</span>
              <span className="font-bold text-cyan-400 font-mono text-base">{payoutRate}%</span>
            </div>
            <input
              type="range"
              id="payout-rate-slider"
              min={70}
              max={95}
              value={payoutRate}
              onChange={(e) => setPayoutRate(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-[#0A0A0B] h-2.5 rounded-lg cursor-pointer"
            />
            <span className="text-xs text-gray-400 block">
              {t("payoutNote")}
            </span>
          </div>

          {/* Slider: Trader Win Rate % */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300 font-medium">{t("strategyWinRate")}</span>
              <span className="font-bold text-emerald-400 font-mono text-base">{winRate}%</span>
            </div>
            <input
              type="range"
              id="win-rate-slider"
              min={40}
              max={85}
              value={winRate}
              onChange={(e) => setWinRate(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-[#0A0A0B] h-2.5 rounded-lg cursor-pointer"
            />
            <span className="text-xs text-gray-400 block">
              {t("winRateNote")}
            </span>
          </div>

          {/* Mathematical Output Cards */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Break-Even Win Rate */}
            <div className="p-3.5 rounded-lg bg-[#0A0A0B] border border-[#1F2937] space-y-1">
              <span className="text-xs uppercase font-mono text-gray-400 block font-semibold">
                {t("breakEvenWinRate")}
              </span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {breakEvenWinRate.toFixed(2)}%
              </span>
              <span className="text-xs text-gray-500 block font-mono">
                ১ / (১ + {payoutRate}%)
              </span>
            </div>

            {/* Expected Value (EV) */}
            <div className="p-3.5 rounded-lg bg-[#0A0A0B] border border-[#1F2937] space-y-1">
              <span className="text-xs uppercase font-mono text-gray-400 block font-semibold">
                {t("expectedValue")}
              </span>
              <span
                className={`text-xl font-bold font-mono ${
                  expectedValuePerTrade > 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {expectedValuePerTrade > 0 ? "+" : ""}
                {(expectedValuePerTrade * 100).toFixed(1)}% {t("perTrade")}
              </span>
              <span className="text-xs font-mono text-gray-400 block">
                {expectedValuePerTrade > 0
                  ? t("positiveEdge")
                  : t("negativeEdge")}
              </span>
            </div>
          </div>

          {/* Mathematical Edge Verdict */}
          <div
            className={`p-4 rounded-lg border text-xs sm:text-sm leading-relaxed ${
              expectedValuePerTrade > 0
                ? "bg-emerald-950/20 text-emerald-300 border-emerald-800/40"
                : "bg-rose-950/20 text-rose-300 border-rose-800/40"
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1.5">
              {expectedValuePerTrade > 0 ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              )}
              <span>
                {expectedValuePerTrade > 0
                  ? t("viableEdge")
                  : t("unviableEdge")}
              </span>
            </div>
            <p className="text-gray-300">
              {expectedValuePerTrade > 0
                ? (isBn
                    ? `${winRate}% উইন রেট এবং ${payoutRate}% পেআউটে প্রতি $১০০ টার্নওভারে আপনার গাণিতিক এক্সপেক্টেড রিটার্ন +$${(
                        expectedValuePerTrade * 100
                      ).toFixed(1)}। ১% ফিক্সড রিস্ক মডেল অ্যাকাউন্টকে দ্রুত ও নিরাপদে বৃদ্ধি করে।`
                    : `At a ${winRate}% win rate with ${payoutRate}% payout, you generate +$${(
                        expectedValuePerTrade * 100
                      ).toFixed(1)} expected return for every $100 turnover. Compounding 1% per trade creates exponential portfolio growth.`
                  )
                : (isBn
                    ? `আপনার উইন রেট (${winRate}%) প্রয়োজনীয় ব্রেক-ইভেন সীমার (${breakEvenWinRate.toFixed(
                        1
                      )}%) চেয়ে কম। এই অবস্থায় ট্রেড করলে একসময় পুরো অ্যাকাউন্ট ফাঁকা হতে বাধ্য।`
                    : `Your win rate (${winRate}%) is below the required break-even threshold (${breakEvenWinRate.toFixed(
                        1
                      )}%). Taking trades under these parameters guarantees capital depletion over large sample sizes.`
                  )}
            </p>
          </div>
        </div>

        {/* Right Column (7 Cols): Equity Curve & Anti-Martingale Proof */}
        <div className="lg:col-span-7 p-3.5 sm:p-5 bg-[#111827] rounded-xl border border-[#1F2937] space-y-3.5 sm:space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3.5">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200 font-mono flex items-center gap-2">
              <LineChart className="w-4 h-4 text-cyan-400" />
              <span>{t("simulationChartTitle")}</span>
            </h2>
            <span className="text-xs font-mono text-gray-400">
              {t("initialBalance")}: ${startingBalance}
            </span>
          </div>

          {/* Synthetic SVG Curve Display */}
          <div className="relative w-full h-56 bg-[#0A0A0B] rounded-lg border border-[#1F2937] p-3.5 flex flex-col justify-between overflow-hidden">
            {/* SVG Plot with responsive viewBox */}
            <svg viewBox="0 0 600 130" preserveAspectRatio="none" className="w-full h-36">
              {/* Gridlines */}
              <line x1="0" y1="20" x2="600" y2="20" stroke="#1F2937" strokeDasharray="2 2" />
              <line x1="0" y1="60" x2="600" y2="60" stroke="#1F2937" strokeDasharray="2 2" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#1F2937" strokeDasharray="2 2" />

              {/* Fixed 1% Risk Curve (Green Line) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points={simulatedCurves.fixedData
                  .map((val, idx) => {
                    const x = (idx / 50) * 580 + 10;
                    const y = Math.max(8, 120 - ((val - startingBalance * 0.7) / (startingBalance * 1.5)) * 100);
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />

              {/* Martingale Risk Curve (Red Line) */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4 2"
                points={simulatedCurves.martData
                  .map((val, idx) => {
                    const x = (idx / 50) * 580 + 10;
                    const y = Math.max(8, 120 - ((val - startingBalance * 0.7) / (startingBalance * 1.5)) * 100);
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
            </svg>

            {/* Legend & Stats */}
            <div className="flex flex-wrap items-center justify-between text-xs pt-2.5 border-t border-[#1F2937]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-emerald-500 rounded" />
                  <span className="text-emerald-400 font-semibold font-mono text-xs sm:text-sm">
                    {t("fixed1PctRisk")}: ${simulatedCurves.fixedData[50].toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-rose-500 rounded" />
                  <span className="text-rose-400 font-semibold font-mono text-xs sm:text-sm">
                    {t("martingale22x")}: ${simulatedCurves.martData[50].toFixed(0)}
                  </span>
                </div>
              </div>

              {simulatedCurves.martBustTrade !== -1 && (
                <span className="text-rose-400 font-mono text-xs font-bold">
                  {t("martingaleRuinAt")}{simulatedCurves.martBustTrade}
                </span>
              )}
            </div>
          </div>

          {/* Mathematical Proof Card */}
          <div className="p-4 rounded-lg bg-[#0A0A0B] border border-[#1F2937] space-y-2">
            <h3 className="text-xs sm:text-sm font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>{t("martingaleProofTitle")}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {t("martingaleProofDesc")}
            </p>
          </div>
        </div>
      </div>

      {/* Trade Journal & Audit History Section */}
      <div className="p-3.5 sm:p-6 bg-[#111827] rounded-xl border border-[#1F2937] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2937] pb-3.5 sm:pb-4">
          <div>
            <h2 className="text-sm sm:text-lg font-bold text-gray-100 uppercase tracking-wider font-mono">
              {t("tradeJournalTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              {t("tradeJournalSubtitle")}
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-5">
            <div className="text-left sm:text-right">
              <span className="text-[10px] sm:text-xs text-gray-400 block uppercase font-mono font-semibold">
                {t("overallWinRate")}
              </span>
              <span className="text-sm sm:text-lg font-bold font-mono text-cyan-400">
                {stats.totalSimulations > 0
                  ? `${((stats.simulationsWon / stats.totalSimulations) * 100).toFixed(1)}%`
                  : "0.0%"}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] sm:text-xs text-gray-400 block uppercase font-mono font-semibold">
                {t("confluenceAvg")}
              </span>
              <span className="text-sm sm:text-lg font-bold font-mono text-emerald-400">
                {stats.averageGrade > 0 ? `${stats.averageGrade.toFixed(0)}%` : "--"}
              </span>
            </div>
          </div>
        </div>

        {/* Trade Journal Table */}
        {stats.tradeLog && stats.tradeLog.length > 0 ? (
          <div className="overflow-x-auto no-scrollbar md:custom-scrollbar touch-pan-x">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0A0A0B] text-gray-300 uppercase text-xs border-b border-[#1F2937] font-mono">
                <tr>
                  <th className="p-3">{t("tableTime")}</th>
                  <th className="p-3">{t("tableScenario")}</th>
                  <th className="p-3">{t("tableAction")}</th>
                  <th className="p-3">{t("tableGrade")}</th>
                  <th className="p-3">{t("tableTier")}</th>
                  <th className="p-3">{t("tableOutcome")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937] text-xs sm:text-sm">
                {stats.tradeLog.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800/40">
                    <td className="p-3 text-gray-400 font-mono">{log.timestamp}</td>
                    <td className="p-3 text-gray-200">
                      <span className="text-cyan-400 font-mono mr-1.5 font-semibold">
                        CH{log.chapter}
                      </span>{" "}
                      {log.topic}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold border ${
                          log.action === "CALL"
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                            : log.action === "PUT"
                            ? "bg-rose-950/60 text-rose-300 border-rose-700/60"
                            : "bg-amber-950/60 text-amber-300 border-amber-700/60"
                        }`}
                      >
                        {getActionName(log.action)}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-gray-200 font-mono">
                      {log.grade}%
                    </td>
                    <td className="p-3">
                      <span className="text-xs text-gray-400">
                        {getTierName(log.tier)}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          log.isWon ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {log.isWon
                          ? (isBn ? "✓ সফল" : "✓ PASS")
                          : (isBn ? "✗ ড্রডাউন" : "✗ REJECT")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 text-xs sm:text-sm space-y-2.5">
            <ShieldAlert className="w-10 h-10 mx-auto text-gray-500" />
            <p className="font-semibold text-gray-300 text-sm sm:text-base">{t("noAuditedTrades")}</p>
            <p className="text-xs sm:text-sm text-gray-500">
              {t("noTradesSubtitle")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
