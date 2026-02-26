"use client";

import { useEffect, useState } from "react";
import {
  Newspaper,
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Cpu,
  Globe,
  X,
} from "lucide-react";

interface Article {
  headline: string;
  source: string;
  published_at: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  confidence_score: number;
  sector: string;
  is_breaking_alert: boolean;
}

interface SentimentData {
  analyzed_at: string;
  model: string;
  articles: Article[];
}

export default function MarketIntelPage() {
  const [data, setData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  async function fetchSentiment() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/news/sentiment`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json: SentimentData = await res.json();
      setData(json);

      // Detect breaking alert
      const breaking = json.articles.find((a) => a.is_breaking_alert);
      if (breaking) {
        setActiveAlert(breaking.headline);
        setShowAlert(true);
      }
    } catch {
      /* sentiment fetch silently handled */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchSentiment();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    fetchSentiment();
  }

  const sentimentConfig = {
    Bullish: {
      color: "emerald",
      icon: TrendingUp,
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      ring: "ring-emerald-500/20",
      dot: "bg-emerald-500",
      border: "border-emerald-500/20",
    },
    Bearish: {
      color: "rose",
      icon: TrendingDown,
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      ring: "ring-rose-500/20",
      dot: "bg-rose-500",
      border: "border-rose-500/20",
    },
    Neutral: {
      color: "slate",
      icon: Minus,
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      ring: "ring-slate-500/20",
      dot: "bg-slate-500",
      border: "border-slate-600/20",
    },
  };

  return (
    <>
      {/* ── Breaking Alert Toast ────────────────── */}
      <div
        className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out ${
          showAlert ? "top-6 opacity-100" : "-top-20 opacity-0"
        }`}
      >
        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
          <div className="relative shrink-0">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-rose-500 animate-ping opacity-50" />
          </div>
          <p className="text-rose-50 font-medium text-sm max-w-lg">
            ⚠️ BREAKING MARKET EVENT: {activeAlert}
          </p>
          <button
            onClick={() => setShowAlert(false)}
            className="shrink-0 rounded-lg p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800/60 transition-premium"
          >
            <X size={16} />
          </button>
        </div>
      </div>

    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* ── Header ──────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl gradient-border p-8 animate-fade-in shimmer">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-blue-500/[0.04] blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-purple-500/[0.03] blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative h-2 w-2 rounded-full bg-blue-500">
              <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400">
              Real-Time Intelligence
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Market Intel:{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Live News Sentiment
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-400">
            AI-powered news radar scanning global financial feeds. Every headline
            is processed through our FinBERT NLP engine to extract actionable
            sentiment signals.
          </p>

          {/* Status badges */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* FinBERT badge */}
            <div className="flex items-center gap-2 rounded-full bg-purple-500/10 ring-1 ring-purple-500/20 px-3.5 py-1.5">
              <div className="relative h-2 w-2 rounded-full bg-purple-500">
                <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-75" />
              </div>
              <Cpu size={12} className="text-purple-400" />
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                FinBERT NLP Engine Active
              </span>
            </div>

            {/* Model tag */}
            {data && (
              <div className="flex items-center gap-2 rounded-full bg-slate-800/40 ring-1 ring-slate-700/40 px-3.5 py-1.5">
                <Brain size={12} className="text-slate-500" />
                <span className="text-[11px] font-medium text-slate-500">
                  {data.model}
                </span>
              </div>
            )}

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-full bg-slate-800/30 ring-1 ring-slate-700/30 px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-300 hover:ring-slate-600/50 transition-premium disabled:opacity-50"
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              Refresh Feed
            </button>
          </div>
        </div>
      </section>

      {/* ── News Grid ───────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 animate-pulse"
            >
              <div className="h-3 w-24 rounded bg-slate-800 mb-4" />
              <div className="h-5 w-full rounded bg-slate-800 mb-2" />
              <div className="h-5 w-3/4 rounded bg-slate-800 mb-6" />
              <div className="h-3 w-32 rounded bg-slate-800" />
            </div>
          ))}
        </div>
      ) : data && data.articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.articles.map((article, i) => {
            const cfg = sentimentConfig[article.sentiment];
            const Icon = cfg.icon;

            return (
              <div
                key={i}
                className={`group glass-card rounded-2xl p-6 card-hover animate-fade-in border-l-2 ${cfg.border}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Top row: source + sector */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe size={12} className="text-slate-600" />
                    <span className="text-[11px] font-semibold text-slate-500">
                      {article.source}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600 bg-slate-800/40 rounded-full px-2 py-0.5">
                    {article.sector}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-[15px] font-bold leading-snug text-slate-200 group-hover:text-slate-50 transition-smooth mb-4">
                  {article.headline}
                </h3>

                {/* Sentiment analysis bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Pulsing dot */}
                    <div className="relative">
                      <div className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                      <div className={`absolute inset-0 h-2.5 w-2.5 rounded-full ${cfg.dot} animate-ping opacity-75`} />
                    </div>

                    {/* Sentiment label */}
                    <div className={`flex items-center gap-1.5 rounded-full ${cfg.bg} ring-1 ${cfg.ring} px-2.5 py-1`}>
                      <Icon size={12} className={cfg.text} />
                      <span className={`text-[11px] font-extrabold uppercase tracking-wider ${cfg.text}`}>
                        {article.sentiment}
                      </span>
                    </div>
                  </div>

                  {/* Confidence score */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                      Confidence
                    </span>
                    <span className={`text-sm font-extrabold ${cfg.text} font-mono`}>
                      {(article.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-3 h-1 w-full rounded-full bg-slate-800/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cfg.dot} transition-all duration-1000`}
                    style={{ width: `${article.confidence_score * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Newspaper size={40} className="mx-auto text-slate-700 mb-4" strokeWidth={1.2} />
          <p className="text-sm font-medium text-slate-500">
            No articles available. Check the backend connection.
          </p>
        </div>
      )}

      {/* ── Sentiment Summary Bar ───────────────── */}
      {data && data.articles.length > 0 && (
        <div className="glass-card rounded-2xl p-5 animate-fade-in delay-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain size={16} className="text-yellow-500" />
              <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Aggregate Signal
              </span>
            </div>
            <div className="flex items-center gap-4">
              {(["Bullish", "Bearish", "Neutral"] as const).map((s) => {
                const count = data.articles.filter((a) => a.sentiment === s).length;
                const cfg = sentimentConfig[s];
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    <span className={`text-[12px] font-bold ${cfg.text}`}>
                      {count}
                    </span>
                    <span className="text-[11px] text-slate-600">{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
