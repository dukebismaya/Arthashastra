"use client";

import { useEffect, useState } from "react";
import {
  Vault,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Loader2,
  ShieldCheck,
  Receipt,
  Landmark,
  Sparkles,
} from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import PortfolioInsightsWidget from "@/components/dashboard/PortfolioInsightsWidget";
import PredictionHistoryWidget from "@/components/dashboard/PredictionHistoryWidget";

/* ── Mock transaction history ────────────────────── */
const MOCK_TRANSACTIONS = [
  {
    id: 1,
    label: "Initial Deposit",
    type: "credit" as const,
    amount: 100000.0,
    date: "2026-02-25",
    tag: "System",
  },
  {
    id: 2,
    label: "AAPL Bullish Prediction Wager",
    type: "debit" as const,
    amount: 5000.0,
    date: "2026-02-26",
    tag: "War Room",
  },
  {
    id: 3,
    label: "FinBERT Sentiment API Fee",
    type: "debit" as const,
    amount: 250.0,
    date: "2026-02-26",
    tag: "Market Intel",
  },
  {
    id: 4,
    label: "TSLA Bearish Prediction Win",
    type: "credit" as const,
    amount: 8200.0,
    date: "2026-02-27",
    tag: "War Room",
  },
  {
    id: 5,
    label: "RELIANCE.NS Analysis Fee",
    type: "debit" as const,
    amount: 150.0,
    date: "2026-02-27",
    tag: "Market Intel",
  },
];

export default function TreasuryPage() {
  const { user, backendId, isAuthenticated, balance: hookBalance, refreshBalance } = useUserData();
  const [balance, setBalance] = useState<number>(0);
  const walletAddress = backendId ?? "";
  const walletConnected = isAuthenticated;
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositSuccess, setDepositSuccess] = useState(false);

  // Sync balance from hook
  useEffect(() => {
    setBalance(hookBalance);
  }, [hookBalance]);

  async function handleDeposit() {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0 || !walletAddress) return;

    setIsDepositing(true);
    setDepositSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${walletAddress}/deposit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amt }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setBalance(data.new_balance);
        setDepositAmount("");
        setDepositSuccess(true);
        refreshBalance(); // sync hook state
        setTimeout(() => setDepositSuccess(false), 3000);
      }
    } catch {
      /* deposit error silently handled */
    } finally {
      setIsDepositing(false);
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* ── Header ──────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl gradient-border p-8 animate-fade-in shimmer">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-yellow-500/[0.04] blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-emerald-500/[0.03] blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative h-2 w-2 rounded-full bg-yellow-500">
              <div className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-75" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-500">
              Secured Vault
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Treasury:{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Portfolio Analyzer
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-400">
            Real-time vault overview synced to your connected Web3 wallet.
            Deposit virtual funds, track wagers, and monitor every transaction
            against your PostgreSQL-backed ledger.
          </p>
        </div>
      </section>

      {/* ── Two-Column Layout ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ════════════════════════════════════════
            LEFT — The Vault (2/3)
           ════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live Balance Card */}
          <div className="relative glass-card rounded-2xl p-8 card-hover animate-fade-in delay-100 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-yellow-500/[0.06] blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-emerald-500/[0.04] blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-lg bg-yellow-500/10 p-1.5 ring-1 ring-yellow-500/20">
                  <Vault size={15} className="text-yellow-500" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Total Portfolio Balance
                </span>
              </div>

              {walletConnected ? (
                <p className="text-5xl sm:text-6xl font-extrabold text-slate-50 font-mono mt-4 tracking-tight">
                  <span className="text-yellow-500">₹</span>
                  {balance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              ) : (
                <div className="mt-4 flex items-center gap-3">
                  <Wallet size={24} className="text-slate-600" />
                  <p className="text-lg font-medium text-slate-600">
                    Connect wallet to view balance
                  </p>
                </div>
              )}

              {walletConnected && (
                <div className="mt-3 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="text-[11px] text-slate-500 font-mono truncate max-w-[300px]">
                    {user?.displayName ?? user?.email ?? walletAddress}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Deposit Card */}
          <div className="glass-card rounded-2xl p-6 card-hover animate-fade-in delay-200">
            <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-5">
              <Landmark size={15} className="text-yellow-500" />
              Deposit Virtual Funds
            </h2>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/40 py-3.5 pl-9 pr-4 text-lg font-bold text-slate-100 placeholder-slate-700 outline-none ring-1 ring-slate-800 transition-premium focus:ring-yellow-500/40 focus:bg-slate-800/60 focus:shadow-lg focus:shadow-yellow-500/5"
                />
              </div>
              <button
                onClick={handleDeposit}
                disabled={isDepositing || !walletConnected}
                className="flex items-center gap-2 rounded-xl bg-yellow-600 px-6 py-3.5 font-bold text-sm text-white transition-premium hover:bg-yellow-500 hover:shadow-xl hover:shadow-yellow-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDepositing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Plus size={18} strokeWidth={2.5} />
                )}
                Deposit
              </button>
            </div>

            {/* Success toast */}
            {depositSuccess && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 px-4 py-2.5 animate-fade-in">
                <Sparkles size={14} className="text-emerald-400" />
                <span className="text-[12px] font-semibold text-emerald-400">
                  Deposit successful — balance updated in PostgreSQL
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT — Transaction Ledger (1/3)
           ════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6 card-hover animate-fade-in delay-200">
            <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-5">
              <Receipt size={15} className="text-yellow-500" />
              Transaction Ledger
            </h2>

            <div className="space-y-2">
              {MOCK_TRANSACTIONS.map((tx) => (
                <div
                  key={tx.id}
                  className="group flex items-center gap-3 rounded-xl bg-slate-800/20 px-4 py-3 transition-premium hover:bg-slate-800/40"
                >
                  {/* Icon */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${
                      tx.type === "credit"
                        ? "bg-emerald-500/10 ring-emerald-500/20 text-emerald-500"
                        : "bg-rose-500/10 ring-rose-500/20 text-rose-500"
                    }`}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownRight size={14} />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-300 truncate">
                      {tx.label}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-600">
                        {tx.date}
                      </span>
                      <span className="text-[9px] font-semibold uppercase tracking-wider bg-slate-800/60 text-slate-500 rounded-full px-1.5 py-0.5">
                        {tx.tag}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <span
                    className={`text-[12px] font-bold font-mono shrink-0 ${
                      tx.type === "credit"
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}₹
                    {tx.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/40">
              <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">
                Showing recent transactions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── User-Tied Insights ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PortfolioInsightsWidget userId={backendId} />
        <PredictionHistoryWidget userId={backendId} />
      </div>
    </div>
  );
}
