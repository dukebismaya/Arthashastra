"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface LiveTickerCardProps {
  ticker: string;
}

export default function LiveTickerCard({ ticker }: LiveTickerCardProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [changePercent, setChangePercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/market/quote/${ticker}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        setPrice(data.current_price);

        if (data.current_price != null && data.previous_close != null && data.previous_close !== 0) {
          const pct =
            ((data.current_price - data.previous_close) / data.previous_close) *
            100;
          setChangePercent(pct);
        }
      } catch {
        /* silently handled */
      } finally {
        setLoading(false);
      }
    }

    fetchQuote();
  }, [ticker]);

  const isPositive = changePercent !== null && changePercent >= 0;

  /* Format price: use ₹ for .NS/.BO tickers, $ otherwise */
  const currencySymbol = ticker.endsWith(".NS") || ticker.endsWith(".BO") ? "₹" : "$";

  const formattedPrice =
    price !== null
      ? `${currencySymbol}${price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "—";

  /* ── Skeleton Loader ──────────────────────────── */
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800/50 bg-slate-900/60 backdrop-blur-md p-5 animate-pulse">
        <div className="h-3 w-20 rounded bg-slate-800 mb-4" />
        <div className="h-7 w-28 rounded bg-slate-800 mb-3" />
        <div className="h-3 w-16 rounded bg-slate-800" />
      </div>
    );
  }

  /* ── Card ──────────────────────────────────────── */
  return (
    <div className="group relative rounded-xl border border-slate-800/50 bg-slate-900/60 backdrop-blur-md p-5 transition-premium hover:border-slate-700/50 hover:bg-slate-800/40 hover:shadow-lg hover:shadow-slate-950/50">
      {/* Subtle highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />

      {/* Ticker label */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1">
        {ticker}
      </p>

      {/* Price */}
      <p className="text-2xl font-extrabold text-slate-50 font-mono">
        {formattedPrice}
      </p>

      {/* Change badge */}
      {changePercent !== null && (
        <div className="mt-2 flex items-center gap-1">
          <div
            className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            <span className="text-[11px] font-bold">
              {isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
