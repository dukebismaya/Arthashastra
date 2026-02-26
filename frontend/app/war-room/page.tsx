"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
  CandlestickChart,
  ShieldCheck,
  Crosshair,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface AnalysisResult {
  ticker: string;
  direction: string;
  current_price: number | null;
  wager: number;
  confidence_score: number;
  explainable_logic: string[];
  status: string;
}

export default function WarRoomPage() {
  const [wager, setWager] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  async function handlePrediction(direction: "bullish" | "bearish") {
    setIsPredicting(true);
    setAnalysisResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/predict/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: "AAPL",
          direction,
          wager: parseFloat(wager) || 1000,
        }),
      });

      if (!res.ok) throw new Error("Prediction request failed");
      const data: AnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch {
      /* prediction error silently handled */
    } finally {
      setIsPredicting(false);
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* ── Header ──────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl gradient-border p-8 animate-fade-in shimmer">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-red-500/[0.04] blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-emerald-500/[0.03] blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative h-2 w-2 rounded-full bg-rose-500">
              <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-400">
              High-Stakes Zone
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            War Room:{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Prediction Arena
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-400">
            Place conviction-backed predictions on live markets. Chanakya AI
            scores your thesis and provides explainable reasoning in real time.
          </p>
        </div>
      </section>

      {/* ── Two-Column Grid ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ════════════════════════════════════════
            LEFT — The Arena (2/3)
           ════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-4">
          {/* Chart Placeholder */}
          <div className="glass-card rounded-2xl p-6 card-hover animate-fade-in delay-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
                <CandlestickChart size={15} className="text-yellow-500" />
                Live Chart
              </h2>
              <div className="flex items-center gap-2">
                {["1D", "1W", "1M", "3M"].map((tf) => (
                  <button
                    key={tf}
                    className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 transition-premium"
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* TradingView Live Chart */}
            <div className="overflow-hidden rounded-xl">
              <iframe
                src="https://s.tradingview.com/widgetembed/?symbol=NASDAQ:AAPL&interval=D&theme=dark&style=1&hidesidetoolbar=1"
                width="100%"
                height="450"
                frameBorder="0"
                allowFullScreen
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Wager + Action Buttons */}
          <div className="glass-card rounded-2xl p-6 card-hover animate-fade-in delay-200">
            <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-5">
              <Crosshair size={15} className="text-yellow-500" />
              Place Your Prediction
            </h2>

            {/* Wager input */}
            <div className="mb-6">
              <label
                htmlFor="wager"
                className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-2"
              >
                Wager Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                  ₹
                </span>
                <input
                  id="wager"
                  type="number"
                  min={0}
                  placeholder="10,000"
                  value={wager}
                  onChange={(e) => setWager(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/40 py-3.5 pl-9 pr-4 text-lg font-bold text-slate-100 placeholder-slate-700 outline-none ring-1 ring-slate-800 transition-premium focus:ring-yellow-500/40 focus:bg-slate-800/60 focus:shadow-lg focus:shadow-yellow-500/5"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* Bullish */}
              <button
                onClick={() => handlePrediction("bullish")}
                disabled={isPredicting}
                className="group relative overflow-hidden rounded-xl bg-emerald-600 py-5 text-center font-extrabold text-lg text-white transition-premium hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/40 to-transparent" />
                <div className="relative flex items-center justify-center gap-2">
                  {isPredicting ? <Loader2 size={22} className="animate-spin" /> : <TrendingUp size={22} strokeWidth={2.5} />}
                  PREDICT BULLISH
                </div>
              </button>

              {/* Bearish */}
              <button
                onClick={() => handlePrediction("bearish")}
                disabled={isPredicting}
                className="group relative overflow-hidden rounded-xl bg-rose-600 py-5 text-center font-extrabold text-lg text-white transition-premium hover:bg-rose-500 hover:shadow-xl hover:shadow-rose-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-rose-700/40 to-transparent" />
                <div className="relative flex items-center justify-center gap-2">
                  {isPredicting ? <Loader2 size={22} className="animate-spin" /> : <TrendingDown size={22} strokeWidth={2.5} />}
                  PREDICT BEARISH
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT — AI Advisor (1/3)
           ════════════════════════════════════════ */}
        <div className="space-y-4">
          {/* Panel Header */}
          <div className="glass-card rounded-2xl p-6 card-hover animate-fade-in delay-200">
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-lg bg-yellow-500/10 p-1.5 ring-1 ring-yellow-500/20">
                <Brain size={15} className="text-yellow-500" />
              </div>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Chanakya&apos;s Analysis
              </h2>
            </div>

            {/* Dynamic status area */}
            {isPredicting ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="relative mb-4">
                  <Brain size={32} className="text-yellow-500 animate-pulse" strokeWidth={1.5} />
                  <div className="absolute inset-0 rounded-full bg-yellow-500/10 blur-xl animate-pulse" />
                </div>
                <p className="text-sm font-semibold text-yellow-500 animate-pulse">
                  Chanakya is analyzing market conditions…
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  Evaluating technical indicators &amp; sentiment
                </p>
              </div>
            ) : analysisResult ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="relative mb-3">
                  <CheckCircle2 size={28} className={analysisResult.direction === "bullish" ? "text-emerald-400" : "text-rose-400"} />
                </div>
                <p className="text-sm font-semibold text-slate-300">
                  {analysisResult.ticker} —{" "}
                  <span className={analysisResult.direction === "bullish" ? "text-emerald-400" : "text-rose-400"}>
                    {analysisResult.direction.toUpperCase()}
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{analysisResult.status}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="relative mb-4">
                  <Sparkles size={32} className="text-slate-700" strokeWidth={1.2} />
                  <div className="absolute inset-0 rounded-full bg-yellow-500/5 blur-xl" />
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  Awaiting your prediction…
                </p>
                <p className="mt-1 text-[11px] text-slate-700 max-w-[220px]">
                  Place a bullish or bearish call and Chanakya AI will analyse your
                  thesis instantly.
                </p>
              </div>
            )}
          </div>

          {/* AI Confidence Score */}
          <div className="glass-card rounded-2xl p-5 card-hover animate-fade-in delay-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                AI Confidence Score
              </span>
              <div className="rounded-lg bg-blue-500/10 p-1.5 ring-1 ring-blue-500/20">
                <ShieldCheck size={13} className="text-blue-500" />
              </div>
            </div>

            {/* Confidence gauge */}
            <div className="flex items-center justify-center py-6">
              <div
                className={`relative flex items-center justify-center h-28 w-28 rounded-full border-4 transition-all duration-700 ${
                  analysisResult
                    ? analysisResult.confidence_score >= 80
                      ? "border-emerald-500/60 shadow-lg shadow-emerald-500/10"
                      : analysisResult.confidence_score >= 70
                        ? "border-yellow-500/60 shadow-lg shadow-yellow-500/10"
                        : "border-orange-500/60 shadow-lg shadow-orange-500/10"
                    : "border-slate-800/60"
                }`}
              >
                {isPredicting ? (
                  <Loader2 size={28} className="text-yellow-500 animate-spin" />
                ) : analysisResult ? (
                  <span
                    className={`text-3xl font-extrabold ${
                      analysisResult.confidence_score >= 80
                        ? "text-emerald-400"
                        : analysisResult.confidence_score >= 70
                          ? "text-yellow-400"
                          : "text-orange-400"
                    }`}
                  >
                    {analysisResult.confidence_score}
                  </span>
                ) : (
                  <span className="text-3xl font-extrabold text-slate-700">—</span>
                )}
                <div className="absolute -bottom-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                  Score
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
            <p className="mt-3 text-center text-[11px] text-slate-700">
              {analysisResult
                ? `${analysisResult.confidence_score}% confidence on ${analysisResult.direction} thesis`
                : "Score populates after prediction is placed"}
            </p>
          </div>

          {/* Explainable Logic */}
          <div className="glass-card rounded-2xl p-5 card-hover animate-fade-in delay-400">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                Explainable Logic
              </span>
              <div className="rounded-lg bg-purple-500/10 p-1.5 ring-1 ring-purple-500/20">
                <Brain size={13} className="text-purple-500" />
              </div>
            </div>

            <div className="space-y-2">
              {analysisResult ? (
                analysisResult.explainable_logic.map((reason, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-slate-800/20 px-4 py-3 border border-slate-800/40 transition-all duration-500"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 text-[10px] font-bold uppercase ${
                        analysisResult.direction === "bullish" ? "text-emerald-500" : "text-rose-500"
                      }`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[12px] leading-relaxed text-slate-300">{reason}</p>
                    </div>
                  </div>
                ))
              ) : isPredicting ? (
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-slate-800/20 px-4 py-3 border border-slate-800/40"
                  >
                    <div className="h-2.5 w-3/4 rounded bg-yellow-500/10 animate-pulse" />
                    <div className="mt-2 h-2 w-1/2 rounded bg-yellow-500/5 animate-pulse" />
                  </div>
                ))
              ) : (
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-slate-800/20 px-4 py-3 border border-slate-800/40"
                  >
                    <div className="h-2.5 w-3/4 rounded bg-slate-800/60 animate-pulse" />
                    <div className="mt-2 h-2 w-1/2 rounded bg-slate-800/40 animate-pulse" />
                  </div>
                ))
              )}
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-700">
              {analysisResult
                ? "Chanakya AI reasoning chain — based on technical indicators"
                : "AI reasoning chain appears here after analysis"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
