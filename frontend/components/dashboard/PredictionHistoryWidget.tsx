"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Sparkles,
  BarChart3,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Prediction History Widget
   ═══════════════════════════════════════════════════════════
   Persists all War-Room predictions to localStorage keyed
   by the user's backendId.  Renders a glass-card table with
   staggered Framer-Motion fade-in.
   ═══════════════════════════════════════════════════════════ */

export interface PredictionRecord {
  id: string;
  ticker: string;
  direction: "bullish" | "bearish";
  wager: number;
  confidence: number;
  status: string;
  timestamp: number;
}

const EXPO_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

function storageKey(userId: string) {
  return `arthashastra_predictions_${userId}`;
}

/** Save a new prediction to this user's history */
export function savePrediction(userId: string, record: Omit<PredictionRecord, "id" | "timestamp">) {
  try {
    const key = storageKey(userId);
    const existing: PredictionRecord[] = JSON.parse(localStorage.getItem(key) || "[]");
    const entry: PredictionRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
    };
    existing.unshift(entry);
    // Keep the latest 50 predictions
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
  } catch {
    /* localStorage might be unavailable */
  }
}

/** Read predictions for a user */
function loadPredictions(userId: string): PredictionRecord[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId)) || "[]");
  } catch {
    return [];
  }
}

/* ── Component ────────────────────────────────────────── */

interface Props {
  userId: string | null;
}

export default function PredictionHistoryWidget({ userId }: Props) {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);

  useEffect(() => {
    if (userId) setPredictions(loadPredictions(userId));
    else setPredictions([]);
  }, [userId]);

  // Listen for new prediction events
  useEffect(() => {
    function handleNewPrediction() {
      if (userId) setPredictions(loadPredictions(userId));
    }
    window.addEventListener("arthashastra:prediction", handleNewPrediction);
    return () => window.removeEventListener("arthashastra:prediction", handleNewPrediction);
  }, [userId]);

  const totalWagered = predictions.reduce((s, p) => s + p.wager, 0);
  const avgConfidence =
    predictions.length > 0
      ? Math.round(predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length)
      : 0;
  const bullishCount = predictions.filter((p) => p.direction === "bullish").length;

  return (
    <div
      className="glass-card rounded-2xl p-6 card-hover animate-fade-in delay-300"
      style={{ minHeight: "260px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
          <History size={15} className="text-yellow-500" />
          Prediction History
        </h2>
        {predictions.length > 0 && (
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            {predictions.length} record{predictions.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Stats row */}
      {predictions.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Total Wagered", value: `₹${totalWagered.toLocaleString("en-IN")}`, icon: BarChart3, color: "text-amber-400" },
            { label: "Avg Confidence", value: `${avgConfidence}%`, icon: ShieldCheck, color: "text-blue-400" },
            { label: "Bull / Bear", value: `${bullishCount} / ${predictions.length - bullishCount}`, icon: TrendingUp, color: "text-emerald-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-slate-800/20 border border-slate-800/40 px-3 py-2.5 text-center"
            >
              <stat.icon size={13} className={`mx-auto mb-1 ${stat.color}`} />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{stat.label}</p>
              <p className={`text-[13px] font-extrabold font-mono ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Locked state */}
      {!userId && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="relative mb-3">
            <History size={28} className="text-slate-700" strokeWidth={1.2} />
            <div className="absolute inset-0 rounded-full bg-yellow-500/5 blur-xl" />
          </div>
          <p className="text-sm font-semibold text-slate-500">Sign in to track predictions</p>
          <p className="mt-1 text-[11px] text-slate-700 max-w-[200px]">
            Your prediction history will appear here after you authenticate.
          </p>
        </div>
      )}

      {/* Empty state */}
      {userId && predictions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="relative mb-3">
            <Sparkles size={28} className="text-slate-700" strokeWidth={1.2} />
            <div className="absolute inset-0 rounded-full bg-yellow-500/5 blur-xl" />
          </div>
          <p className="text-sm font-semibold text-slate-500">No predictions yet</p>
          <p className="mt-1 text-[11px] text-slate-700 max-w-[200px]">
            Place your first bullish or bearish call above to start building your track record.
          </p>
        </div>
      )}

      {/* Prediction list */}
      {userId && predictions.length > 0 && (
        <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
          <AnimatePresence initial={false}>
            {predictions.slice(0, 20).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EXPO_OUT, delay: i * 0.04 }}
                className="group flex items-center gap-3 rounded-xl bg-slate-800/20 px-4 py-3 border border-slate-800/40 transition-all hover:bg-slate-800/40"
              >
                {/* Direction icon */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${
                    p.direction === "bullish"
                      ? "bg-emerald-500/10 ring-emerald-500/20 text-emerald-500"
                      : "bg-rose-500/10 ring-rose-500/20 text-rose-500"
                  }`}
                >
                  {p.direction === "bullish" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-slate-300 truncate">
                    {p.ticker}{" "}
                    <span
                      className={
                        p.direction === "bullish" ? "text-emerald-400" : "text-rose-400"
                      }
                    >
                      {p.direction.toUpperCase()}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-600">
                      {new Date(p.timestamp).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider bg-slate-800/60 text-slate-500 rounded-full px-1.5 py-0.5">
                      {p.confidence}% conf
                    </span>
                  </div>
                </div>

                {/* Wager */}
                <span className="text-[12px] font-bold font-mono shrink-0 text-amber-400">
                  ₹{p.wager.toLocaleString("en-IN")}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
