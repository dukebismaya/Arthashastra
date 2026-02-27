"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BookLogo from "@/components/ui/BookLogo";

import {
  Brain,
  Swords,
  Newspaper,
  Vault,
  GraduationCap,
  ChevronRight,
  Shield,
  Zap,
  Eye,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════ */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/* ═══════════════════════════════════════════════════════════
   MOCK LIVE PREDICTIONS DATA
   ═══════════════════════════════════════════════════════════ */

const livePredictions = [
  { ticker: "AAPL", direction: "bullish", confidence: 89.2, price: "$198.45", change: "+2.34%" },
  { ticker: "RELIANCE.NS", direction: "bullish", confidence: 84.5, price: "₹2,847.30", change: "+1.12%" },
  { ticker: "TSLA", direction: "bearish", confidence: 76.8, price: "$342.10", change: "-3.21%" },
  { ticker: "INFY.NS", direction: "bullish", confidence: 91.3, price: "₹1,892.45", change: "+0.87%" },
  { ticker: "NVDA", direction: "bullish", confidence: 93.1, price: "$892.30", change: "+4.56%" },
  { ticker: "TCS.NS", direction: "bearish", confidence: 72.4, price: "₹3,456.80", change: "-1.45%" },
];

const features = [
  {
    icon: Swords,
    title: "War Room",
    desc: "AI-powered predictions with Chanakya reasoner. Place directional bets with explainable confidence.",
    href: "/war-room",
    gradient: "from-rose-500/20 via-orange-500/10 to-transparent",
    iconGradient: "from-rose-400 to-orange-500",
    borderColor: "border-rose-500/20 hover:border-rose-500/40",
  },
  {
    icon: Newspaper,
    title: "Market Intel",
    desc: "Real-time financial news aggregation with FinBERT sentiment analysis across global markets.",
    href: "/market-intel",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    iconGradient: "from-blue-400 to-cyan-500",
    borderColor: "border-blue-500/20 hover:border-blue-500/40",
  },
  {
    icon: GraduationCap,
    title: "Academy",
    desc: "Master financial strategy through curated courses. Earn on-chain certificates.",
    href: "/academy",
    gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
    iconGradient: "from-purple-400 to-violet-500",
    borderColor: "border-purple-500/20 hover:border-purple-500/40",
  },
  {
    icon: Vault,
    title: "Treasury",
    desc: "Web3-native portfolio dashboard. View balances, manage deposits, and track transactions.",
    href: "/treasury",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconGradient: "from-emerald-400 to-teal-500",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
  },
];

const stats = [
  { label: "AI Predictions / day", value: "2,400+", icon: Brain },
  { label: "News Sources Tracked", value: "120+", icon: Newspaper },
  { label: "Avg. Confidence Score", value: "87.3%", icon: Shield },
  { label: "On-chain Certificates", value: "5,000+", icon: GraduationCap },
];

/* ═══════════════════════════════════════════════════════════
   LIVE TICKER TAPE COMPONENT
   ═══════════════════════════════════════════════════════════ */

function TickerTape() {
  const allTickers = [...livePredictions, ...livePredictions];

  return (
    <div className="relative overflow-hidden py-3 flex-1">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10" />
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      >
        {allTickers.map((t, i) => (
          <div key={i} className="flex items-center gap-3 rounded-full border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm px-4 py-2">
            <span className="text-[11px] font-bold text-slate-300 tracking-wide">{t.ticker}</span>
            <span className="text-[11px] font-mono text-slate-400">{t.price}</span>
            <span className={`text-[11px] font-bold ${t.direction === "bullish" ? "text-emerald-400" : "text-rose-400"}`}>
              {t.change}
            </span>
            <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
              t.direction === "bullish" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            }`}>
              {t.direction === "bullish" ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {t.confidence}%
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════ */

export default function Home() {
  const router = useRouter();
  const [entered, setEntered] = useState(false);
  const [, setHoveredFeature] = useState<number | null>(null);
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);

  const quotes = [
    { text: "Wealth, properly used, is a source of strength. Misused, it is a source of destruction.", chapter: "Book II, Chapter 1" },
    { text: "The king who is possessed of the qualities of leadership is the fountain of justice.", chapter: "Book I, Chapter 19" },
    { text: "In the happiness of his subjects lies his happiness.", chapter: "Book I, Chapter 7" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  function handleLaunch() {
    setEntered(true);
    setTimeout(() => router.push("/war-room"), 800);
  }

  return (
    <div suppressHydrationWarning className="relative min-h-screen text-slate-50 overflow-x-hidden">
      {/* ═══════════ CINEMATIC BACKGROUND ═══════════ */}

      {/* Animated mesh gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 30%, rgba(212,175,55,0.04) 0%, transparent 60%),
              radial-gradient(ellipse 60% 80% at 80% 70%, rgba(139,92,246,0.03) 0%, transparent 60%),
              radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,175,55,0.02) 0%, transparent 70%)
            `,
          }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid opacity-40" />

      {/* ═══════════ CONTENT LAYER ═══════════ */}
      <AnimatePresence>
        {entered && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* ── LIVE TICKER TAPE BAR ──────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-b border-slate-800/30 bg-slate-950/60 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-4 px-6">
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative h-2 w-2">
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                  <div className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/80">Live</span>
              </div>
              <TickerTape />
            </div>
          </div>
        </motion.div>

        {/* ── HERO SECTION ──────────────────────── */}
        <section className="relative flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center min-h-[80vh]">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-5xl mx-auto"
          >
            {/* Animated Book Logo */}
            <motion.div
              variants={scaleIn}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <BookLogo size={80} />
                {/* Glow ring behind book */}
                <div className="absolute inset-0 -m-4 rounded-full bg-amber-500/10 blur-2xl" />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-5 py-2 backdrop-blur-sm">
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400/90">
                Decentralized Financial Intelligence
              </span>
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-7xl font-black tracking-tight sm:text-8xl lg:text-9xl xl:text-[10rem] leading-[0.85]"
            >
              <span className="block bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent" style={{ textShadow: "0 0 80px rgba(212,175,55,0.15)" }}>
                ARTHA
              </span>
              <span className="block bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent gold-text-glow">
                SHASTRA
              </span>
            </motion.h1>

            {/* Sanskrit-inspired decorative divider */}
            <motion.div variants={fadeIn} className="mx-auto mt-8 mb-6 flex items-center gap-4">
              <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-amber-500/40" />
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-amber-500/60" />
                <Shield size={14} className="text-amber-500/60" />
                <div className="h-1 w-1 rounded-full bg-amber-500/60" />
              </div>
              <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-amber-500/40" />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl font-light"
            >
              The ancient wisdom of strategic wealth, reimagined with{" "}
              <span className="text-amber-400/90 font-medium">artificial intelligence</span>.
              <br className="hidden sm:block" />
              Predict. Decode. Master. Build.
            </motion.p>

            {/* LAUNCH PORTAL BUTTON */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-col items-center gap-5"
            >
              <motion.button
                onClick={handleLaunch}
                className="group relative overflow-hidden rounded-2xl px-12 py-5"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Button background layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Animated shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />

                {/* Shadow */}
                <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow duration-500" />

                <span className="relative flex items-center gap-3 text-base font-black text-slate-950 uppercase tracking-[0.15em]">
                  <Eye size={18} />
                  Enter the Portal
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.button>

              <span className="text-[11px] text-slate-600 font-medium tracking-wide">
                Connect your wallet and begin strategic operations
              </span>
            </motion.div>
          </motion.div>
        </section>

        {/* ── LIVE PREDICTIONS CARDS ────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-6xl px-6 pb-16"
        >
          <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3">
            <div className="relative h-2.5 w-2.5">
              <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
              <div className="relative h-2.5 w-2.5 rounded-full bg-amber-400" />
            </div>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-amber-400/80">
              Live AI Predictions
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {livePredictions.map((p, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="group relative rounded-xl border border-slate-800/40 bg-slate-900/30 backdrop-blur-sm p-4 transition-all duration-500 hover:border-slate-700/60 hover:bg-slate-800/30 hover:-translate-y-1"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700/20 to-transparent" />
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">{p.ticker}</p>
                <p className="text-lg font-extrabold text-slate-100 font-mono tracking-tight">{p.price}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${p.direction === "bullish" ? "text-emerald-400" : "text-rose-400"}`}>
                    {p.change}
                  </span>
                  <div className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    p.direction === "bullish" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  }`}>
                    {p.direction === "bullish" ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                    {p.confidence}%
                  </div>
                </div>
                {/* Confidence bar */}
                <div className="mt-2 h-[2px] rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${p.direction === "bullish" ? "bg-emerald-500" : "bg-rose-500"}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${p.confidence}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── STATS BAR ─────────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-5xl px-6 py-12"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  variants={scaleIn}
                  className="group relative rounded-2xl border border-slate-800/40 bg-slate-900/30 backdrop-blur-sm p-6 text-center transition-all duration-500 hover:border-amber-500/20 hover:bg-slate-800/30"
                >
                  <Icon size={16} className="mx-auto mb-3 text-amber-500/40 group-hover:text-amber-400/70 transition-colors" />
                  <p className="text-2xl font-extrabold text-slate-100 sm:text-3xl tracking-tight font-mono">
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    {s.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── FEATURE CARDS ─────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mx-auto max-w-6xl px-6 pb-20"
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tight text-slate-100 sm:text-5xl">
              Your{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Command Center
              </span>
            </h2>
            <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Four integrated modules — one unified intelligence platform.
              Every tool a modern strategist needs, inspired by ancient wisdom.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={idx % 2 === 0 ? slideInLeft : slideInRight}
                  onHoverStart={() => setHoveredFeature(idx)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="h-full"
                >
                  <a
                    href={f.href}
                    className={`group relative flex flex-col h-full rounded-2xl border ${f.borderColor} bg-slate-900/20 backdrop-blur-sm p-7 transition-all duration-700 hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden`}
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.iconGradient} shadow-lg`}>
                        <Icon size={22} className="text-white" />
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-100 group-hover:text-white transition-colors">
                        {f.title}
                      </h3>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-slate-500 group-hover:text-slate-300 transition-colors">
                        {f.desc}
                      </p>

                      <div className="mt-auto pt-6 flex items-center gap-1.5 text-[12px] font-bold text-slate-600 group-hover:text-amber-400 transition-colors">
                        Launch module
                        <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── PHILOSOPHY / ROTATING QUOTES ──────── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative border-t border-b border-slate-800/30 overflow-hidden"
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.02] via-transparent to-amber-500/[0.02]" />

          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <div className="mb-6 flex justify-center">
              <BookLogo size={36} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <blockquote className="text-xl font-light italic text-slate-400 leading-relaxed sm:text-2xl">
                  &ldquo;{quotes[currentQuoteIdx].text}&rdquo;
                </blockquote>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-500/50">
                  — Kautilya, Arthashastra &middot; {quotes[currentQuoteIdx].chapter}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Quote indicators */}
            <div className="mt-6 flex justify-center gap-2">
              {quotes.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === currentQuoteIdx ? "w-6 bg-amber-500/60" : "w-1 bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── BOTTOM CTA ────────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-3xl px-6 py-20 text-center"
        >
          <motion.div variants={fadeUp}>
            <motion.div
              className="mx-auto mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap size={32} className="mx-auto text-amber-500/60" />
            </motion.div>
            <h3 className="text-3xl font-black text-slate-100 sm:text-4xl tracking-tight">
              Ready to deploy{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                intelligence
              </span>
              ?
            </h3>
            <p className="mt-4 text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              Connect your wallet, enter the War Room, and let Chanakya AI
              guide your next strategic move.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <motion.button
                onClick={handleLaunch}
                className="group relative overflow-hidden inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-10 py-4 text-sm font-black text-slate-950 uppercase tracking-wider shadow-xl shadow-amber-500/20"
                whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(212,175,55,0.3)" }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                />
                <Eye size={16} className="relative z-10" />
                <span className="relative z-10">Launch Platform</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.section>

        {/* ── FOOTER ────────────────────────────── */}
        <footer className="border-t border-slate-800/30 py-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <BookLogo size={28} />
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/40 border border-slate-800/30 px-5 py-2.5 backdrop-blur-sm">
              <div className="h-1 w-1 rounded-full bg-amber-500/50 animate-pulse" />
              <p className="text-[11px] font-medium text-slate-600 tracking-wide">
                Arthashastra v0.1.0 — The Art of Strategic Wealth
              </p>
              <div className="h-1 w-1 rounded-full bg-amber-500/50 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-700 tracking-wider">
              &copy; 2026 Arthashastra. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
