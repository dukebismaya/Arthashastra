"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  Zap,
  TrendingUp,
  Lock,
  Sparkles,
  GraduationCap,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Portfolio Insights Widget
   ═══════════════════════════════════════════════════════════
   Three KPI cards:
   1. Total $ARTHA Earned  — from academy course completion rewards
   2. Capital Deployed     — sum of prediction wagers (localStorage)
   3. Strategic Win Rate   — % of high-confidence predictions (≥75%)
   ═══════════════════════════════════════════════════════════ */

const EXPO_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface PredictionRecord {
  wager: number;
  confidence: number;
}

interface Props {
  userId: string | null;
}

function loadPredictions(userId: string): PredictionRecord[] {
  try {
    return JSON.parse(localStorage.getItem(`arthashastra_predictions_${userId}`) || "[]");
  } catch {
    return [];
  }
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function PortfolioInsightsWidget({ userId }: Props) {
  const [totalEarned, setTotalEarned] = useState(0);
  const [capitalDeployed, setCapitalDeployed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshInsights = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Fetch academy progress → total rewards earned
    try {
      const res = await fetch(`${API}/api/v1/academy/progress?wallet_address=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setTotalEarned(data.total_rewards ?? 0);
      }
    } catch {
      /* silent */
    }

    // 2. Local prediction data
    const preds = loadPredictions(userId);
    const deployed = preds.reduce((s: number, p: PredictionRecord) => s + p.wager, 0);
    setCapitalDeployed(deployed);

    // 3. Win rate = % of predictions with confidence ≥ 75
    const wins = preds.filter((p: PredictionRecord) => p.confidence >= 75).length;
    setWinRate(preds.length > 0 ? Math.round((wins / preds.length) * 100) : 0);

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refreshInsights();
  }, [refreshInsights]);

  // Refresh when new prediction is saved
  useEffect(() => {
    function handlePrediction() {
      refreshInsights();
    }
    window.addEventListener("arthashastra:prediction", handlePrediction);
    return () => window.removeEventListener("arthashastra:prediction", handlePrediction);
  }, [refreshInsights]);

  const metrics = [
    {
      label: "Total $ARTHA Earned",
      value: totalEarned.toLocaleString("en-IN"),
      prefix: "",
      suffix: " $ARTHA",
      icon: Trophy,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
      glow: "shadow-amber-500/10",
    },
    {
      label: "Capital Deployed",
      value: `₹${capitalDeployed.toLocaleString("en-IN")}`,
      prefix: "",
      suffix: "",
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      ring: "ring-blue-500/20",
      glow: "shadow-blue-500/10",
    },
    {
      label: "Strategic Win Rate",
      value: `${winRate}`,
      prefix: "",
      suffix: "%",
      icon: TrendingUp,
      color: winRate >= 70 ? "text-emerald-400" : winRate >= 40 ? "text-yellow-400" : "text-orange-400",
      bg: winRate >= 70 ? "bg-emerald-500/10" : winRate >= 40 ? "bg-yellow-500/10" : "bg-orange-500/10",
      ring: winRate >= 70 ? "ring-emerald-500/20" : winRate >= 40 ? "ring-yellow-500/20" : "ring-orange-500/20",
      glow: winRate >= 70 ? "shadow-emerald-500/10" : winRate >= 40 ? "shadow-yellow-500/10" : "shadow-orange-500/10",
    },
  ];

  /* ── Locked state ── */
  if (!userId) {
    return (
      <div className="glass-card rounded-2xl p-6 card-hover animate-fade-in delay-200">
        <div className="flex items-center gap-2 mb-5">
          <div className="rounded-lg bg-yellow-500/10 p-1.5 ring-1 ring-yellow-500/20">
            <Zap size={15} className="text-yellow-500" />
          </div>
          <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Portfolio Insights
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-slate-800/10 border border-slate-800/30 p-8">
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-slate-950/60 z-10 flex flex-col items-center justify-center">
            <Lock size={24} className="text-slate-600 mb-2" />
            <p className="text-[12px] font-semibold text-slate-500">Sign in to unlock insights</p>
          </div>
          {/* Placeholder metrics */}
          <div className="grid grid-cols-3 gap-4 opacity-30">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl bg-slate-800/30 p-4">
                <div className="h-3 w-16 rounded bg-slate-700 mb-3" />
                <div className="h-5 w-20 rounded bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 card-hover animate-fade-in delay-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-yellow-500/10 p-1.5 ring-1 ring-yellow-500/20">
            <Zap size={15} className="text-yellow-500" />
          </div>
          <h2 className="text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Portfolio Insights
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <GraduationCap size={12} className="text-amber-500/50" />
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            Live Data
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EXPO_OUT, delay: 0.1 * i }}
            className={`relative overflow-hidden rounded-xl border border-slate-800/40 p-4 transition-all hover:shadow-lg ${m.glow}`}
            style={{
              background: "linear-gradient(145deg, rgba(15,23,42,0.6), rgba(2,6,23,0.4))",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`rounded-lg ${m.bg} p-1.5 ring-1 ${m.ring}`}>
                <m.icon size={13} className={m.color} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                {m.label}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-500 animate-pulse" />
                <div className="h-4 w-20 rounded bg-slate-800/60 animate-pulse" />
              </div>
            ) : (
              <p className={`text-xl font-extrabold font-mono ${m.color}`}>
                {m.prefix}{m.value}{m.suffix}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
