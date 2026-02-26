"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Zap,
  Shield,
  Sparkles,
  Eye,
  Target,
  Clock,
  ChevronRight,
  LineChart,
  Wallet,
} from "lucide-react";
import LiveTickerCard from "@/components/dashboard/LiveTickerCard";

/* ── Mini Sparkline Component ───────────────────── */
function Sparkline({ data, color, id }: { data: number[]; color: string; id: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${id})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sparkline-animate"
      />
    </svg>
  );
}

/* ── Mini Bar Chart Component ───────────────────── */
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px] h-8 w-full">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bar-animate"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.25 + (v / max) * 0.75,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function syncWalletBalance() {
      try {
        if (typeof window !== "undefined" && (window as any).ethereum) {
          const accounts: string[] = await (window as any).ethereum.request({
            method: "eth_accounts",
          });
          if (accounts[0]) {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${accounts[0]}`
            );
            if (res.ok) {
              const data = await res.json();
              setBalance(data.portfolio_balance);
            }
          }
        }
      } catch {
        /* wallet sync silently handled */
      }
    }
    syncWalletBalance();
  }, []);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* ── Hero Header ─────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl gradient-border p-8 animate-fade-in shimmer">
        {/* Decorative elements */}
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-yellow-500/[0.04] blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-blue-500/[0.03] blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute right-20 top-10 h-1 w-1 rounded-full bg-yellow-500/40 sparkle" />
        <div className="absolute right-40 bottom-12 h-1 w-1 rounded-full bg-yellow-500/30 sparkle" style={{ animationDelay: '1s' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative h-2 w-2 rounded-full bg-emerald-500">
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500">
              All Systems Operational
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Arthashastra{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Command Center
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-400">
            Institutional-grade financial intelligence. Monitor portfolios,
            predict markets, analyze live news, and master the art of strategic
            wealth building — all from one unified dashboard.
          </p>

          {/* Quick metrics bar */}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-slate-600" />
              <span className="text-slate-500">Last sync:</span>
              <span className="text-slate-300 font-medium">Just now</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2 text-sm">
              <Eye size={14} className="text-slate-600" />
              <span className="text-slate-500">Watching:</span>
              <span className="text-slate-300 font-medium">42 assets</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2 text-sm">
              <Target size={14} className="text-slate-600" />
              <span className="text-slate-500">Alerts active:</span>
              <span className="text-yellow-500 font-medium">8</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Stats Grid ────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Portfolio Value */}
        <div className="glass-card rounded-2xl p-5 card-hover animate-fade-in delay-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Portfolio Value
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-1.5 ring-1 ring-emerald-500/20">
              <TrendingUp size={13} className="text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-50 stat-value">
            {balance !== null ? (
              <>₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
            ) : (
              <span className="flex items-center gap-2 text-lg">
                <Wallet size={18} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-600">Connect Wallet to sync</span>
              </span>
            )}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5">
              <ArrowUpRight size={12} className="text-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-500">+12.4%</span>
            </div>
            <span className="text-[11px] text-slate-600">this month</span>
          </div>
          <div className="mt-3">
            <Sparkline data={[20, 25, 22, 30, 28, 35, 32, 40, 38, 45, 42, 48]} color="#10b981" id="portfolio" />
          </div>
        </div>

        {/* Active Predictions */}
        <div className="glass-card rounded-2xl p-5 card-hover animate-fade-in delay-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Active Predictions
            </span>
            <div className="rounded-lg bg-yellow-500/10 p-1.5 ring-1 ring-yellow-500/20">
              <Brain size={13} className="text-yellow-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-50 stat-value">17</p>
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 rounded-full bg-yellow-500/10 px-2 py-0.5">
              <Zap size={12} className="text-yellow-500" />
              <span className="text-[11px] font-bold text-yellow-500">5 high-conf</span>
            </div>
            <span className="text-[11px] text-slate-600">running now</span>
          </div>
          <div className="mt-3">
            <MiniBarChart data={[3, 5, 2, 7, 4, 6, 8, 3, 5, 7, 4, 6]} color="#eab308" />
          </div>
        </div>

        {/* Win Rate */}
        <div className="glass-card rounded-2xl p-5 card-hover animate-fade-in delay-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Prediction Win Rate
            </span>
            <div className="rounded-lg bg-blue-500/10 p-1.5 ring-1 ring-blue-500/20">
              <BarChart3 size={13} className="text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-50 stat-value">73.2<span className="text-lg text-slate-500">%</span></p>
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5">
              <ArrowUpRight size={12} className="text-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-500">+2.1%</span>
            </div>
            <span className="text-[11px] text-slate-600">vs last month</span>
          </div>
          <div className="mt-3">
            <Sparkline data={[60, 62, 65, 63, 68, 66, 70, 69, 72, 71, 73, 73]} color="#3b82f6" id="winrate" />
          </div>
        </div>

        {/* Market Threat */}
        <div className="glass-card rounded-2xl p-5 card-hover animate-fade-in delay-400">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Market Threat Level
            </span>
            <div className="rounded-lg bg-orange-500/10 p-1.5 ring-1 ring-orange-500/20">
              <Shield size={13} className="text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-orange-400 stat-value">Moderate</p>
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 rounded-full bg-orange-500/10 px-2 py-0.5">
              <Activity size={12} className="text-orange-400" />
              <span className="text-[11px] font-bold text-orange-400">VIX 18.2</span>
            </div>
            <span className="text-[11px] text-slate-600">mixed sentiment</span>
          </div>
          <div className="mt-3">
            <Sparkline data={[15, 18, 14, 22, 19, 16, 20, 17, 21, 18, 19, 18]} color="#f97316" id="threat" />
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ───────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Activity — spans 2 cols */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 card-hover animate-fade-in delay-400">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
              <Activity size={15} className="text-yellow-500" />
              Live Activity Feed
            </h2>
            <button className="text-[11px] font-medium text-slate-600 hover:text-yellow-500 transition-smooth flex items-center gap-1">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {[
              {
                action: "Prediction Placed",
                detail: "AAPL bullish — 85% confidence score",
                time: "2m ago",
                color: "emerald",
                icon: Target,
              },
              {
                action: "Breaking News Alert",
                detail: "Federal Reserve minutes released — hawkish tone detected",
                time: "15m ago",
                color: "yellow",
                icon: Zap,
              },
              {
                action: "Portfolio Rebalanced",
                detail: "Auto-reduced TSLA exposure by 5% based on risk model",
                time: "1h ago",
                color: "blue",
                icon: LineChart,
              },
              {
                action: "Academy Module Completed",
                detail: "Options Greeks Deep Dive — Certificate earned",
                time: "3h ago",
                color: "purple",
                icon: Sparkles,
              },
              {
                action: "Price Alert Triggered",
                detail: "BTC crossed ₹56,80,000 resistance level",
                time: "4h ago",
                color: "orange",
                icon: ArrowUpRight,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const colorMap: Record<string, string> = {
                emerald: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
                yellow: "bg-yellow-500/10 text-yellow-500 ring-yellow-500/20",
                blue: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
                purple: "bg-purple-500/10 text-purple-500 ring-purple-500/20",
                orange: "bg-orange-500/10 text-orange-500 ring-orange-500/20",
              };
              const timeColorMap: Record<string, string> = {
                emerald: "text-emerald-500",
                yellow: "text-yellow-500",
                blue: "text-blue-500",
                purple: "text-purple-500",
                orange: "text-orange-500",
              };
              return (
                <div
                  key={i}
                  className="group flex items-center gap-4 rounded-xl bg-slate-800/20 px-4 py-3.5 transition-premium hover:bg-slate-800/40"
                  style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${colorMap[item.color]}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-200">{item.action}</p>
                    <p className="text-[11px] text-slate-500 truncate">{item.detail}</p>
                  </div>
                  <span className={`text-[11px] font-medium ${timeColorMap[item.color]} shrink-0`}>
                    {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions — single col */}
        <div className="glass-card rounded-2xl p-6 card-hover animate-fade-in delay-500">
          <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-5">
            <Zap size={15} className="text-yellow-500" />
            Quick Actions
          </h2>
          <div className="space-y-2.5">
            {[
              {
                label: "New Prediction",
                desc: "Enter the War Room",
                icon: Brain,
                href: "/war-room",
                accent: "group-hover:text-yellow-500 group-hover:bg-yellow-500/10 group-hover:ring-yellow-500/20",
              },
              {
                label: "Analyze Stock",
                desc: "Deep-dive any ticker",
                icon: BarChart3,
                href: "/market-intelligence",
                accent: "group-hover:text-blue-500 group-hover:bg-blue-500/10 group-hover:ring-blue-500/20",
              },
              {
                label: "Learn Strategy",
                desc: "Open the Academy",
                icon: Shield,
                href: "/academy",
                accent: "group-hover:text-purple-500 group-hover:bg-purple-500/10 group-hover:ring-purple-500/20",
              },
              {
                label: "View Portfolio",
                desc: "Check the Treasury",
                icon: TrendingUp,
                href: "/treasury",
                accent: "group-hover:text-emerald-500 group-hover:bg-emerald-500/10 group-hover:ring-emerald-500/20",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.href}
                  className="group flex items-center gap-4 rounded-xl border border-slate-800/50 bg-slate-800/10 p-4 transition-premium hover:border-slate-700/50 hover:bg-slate-800/30 hover:shadow-lg"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/50 ring-1 ring-slate-700/30 transition-premium ${item.accent}`}>
                    <Icon size={18} className="text-slate-500 transition-premium group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-slate-300 group-hover:text-slate-100 transition-smooth">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-600">{item.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-premium" />
                </a>
              );
            })}
          </div>

          {/* Separator */}
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

          {/* Live Market Summary */}
          <div className="rounded-xl bg-slate-800/20 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 mb-3">Top Movers — Live</p>
            <div className="space-y-2.5">
              <LiveTickerCard ticker="AAPL" />
              <LiveTickerCard ticker="TSLA" />
              <LiveTickerCard ticker="RELIANCE.NS" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────── */}
      <div className="pb-4 text-center animate-fade-in delay-600">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/20 px-4 py-2">
          <div className="h-1 w-1 rounded-full bg-yellow-500/50" />
          <p className="text-[11px] font-medium text-slate-700">
            Arthashastra v0.1.0 — The Art of Strategic Wealth
          </p>
          <div className="h-1 w-1 rounded-full bg-yellow-500/50" />
        </div>
      </div>
    </div>
  );
}
