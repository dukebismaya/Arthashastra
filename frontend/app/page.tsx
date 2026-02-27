"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
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
   SPRING / EASING CONFIGS
   ═══════════════════════════════════════════════════════════ */

const EXPO_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];
const SPRING_SOFT = { stiffness: 80,  damping: 20, mass: 1 };
const SPRING_SNAP = { stiffness: 280, damping: 28 };

/* ═══════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════ */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 1.1, ease: EXPO_OUT },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.4, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.82, filter: "blur(12px)" },
  show: {
    opacity: 1, scale: 1, filter: "blur(0px)",
    transition: { duration: 1.3, ease: EXPO_OUT },
  },
};

/* ═══════════════════════════════════════════════════════════
   PARALLAX LAYER — scroll-linked vertical translate
   ═══════════════════════════════════════════════════════════ */

function ParallaxLayer({
  speed = 0.3, children, className = ""
}: { speed?: number; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, [0, 1200], [0, -1200 * speed]);
  const y = useSpring(raw, SPRING_SOFT);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}

/* ═══════════════════════════════════════════════════════════
   SCROLL-REVEAL SECTION
   ═══════════════════════════════════════════════════════════ */

function RevealSection({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.0, ease: EXPO_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


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
    icon: Swords,  title: "War Room",
    desc: "AI-powered predictions with the Chanakya reasoner. Place directional bets with explainable confidence scores.",
    href: "/war-room",
    accentFrom: "rgba(244,63,94,0.16)",  accentTo: "rgba(249,115,22,0.06)",
    iconFrom: "#fb7185", iconTo: "#f97316",
    borderBase: "rgba(244,63,94,0.14)",  glow: "rgba(244,63,94,0.10)",
  },
  {
    icon: Newspaper, title: "Market Intel",
    desc: "Real-time financial news aggregation with FinBERT sentiment analysis across global and Indian markets.",
    href: "/market-intel",
    accentFrom: "rgba(59,130,246,0.16)",  accentTo: "rgba(6,182,212,0.06)",
    iconFrom: "#60a5fa", iconTo: "#22d3ee",
    borderBase: "rgba(59,130,246,0.14)",  glow: "rgba(59,130,246,0.10)",
  },
  {
    icon: GraduationCap, title: "Academy",
    desc: "Master financial strategy through curated courses and case studies. Earn verifiable on-chain certificates.",
    href: "/academy",
    accentFrom: "rgba(139,92,246,0.16)",  accentTo: "rgba(167,139,250,0.06)",
    iconFrom: "#c084fc", iconTo: "#818cf8",
    borderBase: "rgba(139,92,246,0.14)",  glow: "rgba(139,92,246,0.10)",
  },
  {
    icon: Vault, title: "Treasury",
    desc: "Web3-native portfolio dashboard. View on-chain balances, manage deposits, and audit all transactions.",
    href: "/treasury",
    accentFrom: "rgba(16,185,129,0.16)",  accentTo: "rgba(20,184,166,0.06)",
    iconFrom: "#34d399", iconTo: "#2dd4bf",
    borderBase: "rgba(16,185,129,0.14)",  glow: "rgba(16,185,129,0.10)",
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
  const [entered, setEntered]   = useState(false);
  const [, setHoveredFeature]   = useState<number | null>(null);
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);

  // Scroll-linked transforms
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.35]);
  const heroScale   = useTransform(scrollY, [0, 500], [1, 0.96]);
  const bgY = useSpring(useTransform(scrollY, [0, 1200], [0, -240]), SPRING_SOFT);
  const tickerY = useSpring(useTransform(scrollY, [0, 300], [0, -30]), SPRING_SOFT);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bookX  = useSpring(useTransform(mouseX, [-1, 1], [-12, 12]), SPRING_SOFT);
  const bookY  = useSpring(useTransform(mouseY, [-1, 1],  [-8,  8]), SPRING_SOFT);
  const blob1X = useSpring(useTransform(mouseX, [-1, 1], [-35, 35]), SPRING_SOFT);
  const blob1Y = useSpring(useTransform(mouseY, [-1, 1], [-25, 25]), SPRING_SOFT);
  const blob2X = useSpring(useTransform(mouseX, [-1, 1],  [25,-25]), SPRING_SOFT);
  const blob2Y = useSpring(useTransform(mouseY, [-1, 1],  [18,-18]), SPRING_SOFT);

  function handleMouseMove(e: React.MouseEvent) {
    mouseX.set((e.clientX / window.innerWidth)  * 2 - 1);
    mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
  }

  const quotes = [
    { text: "Wealth, properly used, is a source of strength. Misused, it is a source of destruction.",    chapter: "Book II, Chapter 1" },
    { text: "The king who is possessed of the qualities of leadership is the fountain of justice.",        chapter: "Book I, Chapter 19" },
    { text: "In the happiness of his subjects lies his happiness; in their welfare, his welfare.",         chapter: "Book I, Chapter 7" },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentQuoteIdx(p => (p + 1) % quotes.length), 7000);
    return () => clearInterval(t);
  }, [quotes.length]);

  function handleLaunch() {
    setEntered(true);
    setTimeout(() => router.push("/war-room"), 900);
  }

  return (
    <div suppressHydrationWarning className="relative text-slate-50 overflow-x-hidden" onMouseMove={handleMouseMove}>

      {/* ═══════════ CINEMATIC FIXED BACKGROUND ═══════════ */}
      <motion.div className="fixed inset-0 z-0 pointer-events-none" style={{ y: bgY }}>
        <motion.div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-[0.04]"
          animate={{ scale: [1, 1.12, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, #d4af37, transparent)", x: blob1X, y: blob1Y }}
        />
        <motion.div
          className="absolute bottom-0 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.025]"
          animate={{ scale: [1, 0.9, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)", x: blob2X, y: blob2Y }}
        />
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 70% 50% at 30% 20%, rgba(212,175,55,0.04) 0%, transparent 65%),
            radial-gradient(ellipse 55% 70% at 75% 75%, rgba(139,92,246,0.03) 0%, transparent 60%)
          `,
        }} />
      </motion.div>

      {/* Fixed grid */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid opacity-25" />

      {/* ═══════════ PAGE-EXIT OVERLAY ═══════════ */}
      <AnimatePresence>
        {entered && (
          <motion.div
            className="fixed inset-0 z-[100] bg-slate-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EXPO_OUT }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* ── STICKY TICKER BAR ──────────────── */}
        <motion.div
          className="sticky top-0 z-40 border-b border-white/[0.04]"
          style={{ background: "rgba(2,6,23,0.80)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", y: tickerY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-4 px-6">
              <div className="flex items-center gap-2 shrink-0 py-0.5">
                <div className="relative h-2 w-2">
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                  <div className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400/80">Live</span>
              </div>
              <TickerTape />
            </div>
          </div>
        </motion.div>

        {/* ── HERO SECTION ──────────────────────── */}
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center min-h-[88vh]"
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-5xl mx-auto w-full"
          >
            {/* Floating Book */}
            <motion.div variants={scaleIn} className="mb-10 flex justify-center">
              <motion.div
                style={{ x: bookX, y: bookY }}
                animate={{ y: ["-3%", "3%"] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="relative"
              >
                <BookLogo size={96} />
                <div className="absolute inset-0 -m-12 rounded-full blur-3xl opacity-25 bg-amber-400 animate-pulse" />
                <div className="absolute inset-0 -m-6 rounded-full blur-xl opacity-12 bg-amber-300" />
              </motion.div>
            </motion.div>

            {/* Status badge */}
            <motion.div
              variants={fadeUp}
              className="mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2 backdrop-blur-xl"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))",
                border: "1px solid rgba(212,175,55,0.2)",
                boxShadow: "0 0 32px rgba(212,175,55,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/90">
                Decentralized Financial Intelligence
              </span>
              <Sparkles size={12} className="text-amber-400 animate-pulse" />
            </motion.div>

            {/* Wordmark */}
            <motion.h1
              variants={fadeUp}
              className="font-black tracking-tighter leading-[0.82] select-none"
              style={{ fontSize: "clamp(5rem, 14vw, 11rem)" }}
            >
              <span className="block bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(180deg, #ffffff 0%, #e2e8f0 40%, #94a3b8 100%)", filter: "drop-shadow(0 4px 32px rgba(0,0,0,0.4))" }}>
                ARTHA
              </span>
              <span className="block bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 35%, #d97706 65%, #b45309 100%)", filter: "drop-shadow(0 0 40px rgba(212,175,55,0.25))" }}>
                SHASTRA
              </span>
            </motion.h1>

            {/* Divider */}
            <motion.div variants={fadeIn} className="mx-auto mt-10 mb-8 flex items-center gap-5 max-w-xs">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/30" />
              <div className="flex items-center gap-2">
                <motion.div className="h-1 w-1 rounded-full bg-amber-500/50"
                  animate={{ scale: [1, 1.7, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }} />
                <Shield size={14} className="text-amber-500/50" />
                <motion.div className="h-1 w-1 rounded-full bg-amber-500/50"
                  animate={{ scale: [1, 1.7, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/30" />
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={fadeUp}
              className="mx-auto max-w-xl text-lg sm:text-xl font-light leading-relaxed tracking-wide text-slate-400"
            >
              The ancient science of strategic wealth —
              <br className="hidden sm:block" />
              reimagined with{" "}
              <span className="font-semibold text-amber-400/90">artificial intelligence</span>.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="mt-14 flex flex-col items-center gap-5">
              <motion.button
                onClick={handleLaunch}
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING_SNAP}
                className="group relative overflow-hidden rounded-full"
                style={{
                  padding: "1rem 3.5rem",
                  background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.03))",
                  border: "1px solid rgba(212,175,55,0.30)",
                  boxShadow: "0 4px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.08) 50%, transparent 65%)", backgroundSize: "200% 100%" }}
                  animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.14), transparent 70%)" }} />
                <span className="relative flex items-center gap-3 text-base font-bold uppercase tracking-[0.22em] text-amber-400 group-hover:text-amber-300 transition-colors">
                  <Eye size={18} />
                  Enter Portal
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </motion.button>
              <p className="text-[11px] text-slate-600 font-medium uppercase tracking-[0.25em]">
                Connect wallet · Access Intelligence
              </p>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-px h-10 bg-gradient-to-b from-amber-500/80 to-transparent" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-amber-500">Scroll</span>
          </motion.div>
        </motion.section>

        {/* ── LIVE PREDICTIONS ──────────────── */}
        <RevealSection className="mx-auto max-w-6xl px-6 pb-20">
          <div className="mb-8 flex items-center gap-4">
            <div className="relative h-2 w-2 shrink-0">
              <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
              <div className="h-2 w-2 rounded-full bg-amber-400" />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400/80">Live AI Predictions</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {livePredictions.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, ease: EXPO_OUT, delay: i * 0.08 }}
                whileHover={{ y: -7, scale: 1.02 }}
                className="group relative rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-4 cursor-default overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent" />
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">{p.ticker}</p>
                <p className="text-base font-black text-slate-100 font-mono tracking-tight leading-tight">{p.price}</p>
                <div className="mt-2 flex items-center justify-between gap-1">
                  <span className={`text-[11px] font-black ${p.direction === "bullish" ? "text-emerald-400" : "text-rose-400"}`}>{p.change}</span>
                  <div className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-black ${
                    p.direction === "bullish" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  }`}>
                    {p.direction === "bullish" ? <TrendingUp size={7} /> : <TrendingDown size={7} />}
                    {p.confidence}%
                  </div>
                </div>
                <div className="mt-2.5 h-[2px] rounded-full bg-slate-800/80 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${p.direction === "bullish" ? "bg-gradient-to-r from-emerald-600 to-emerald-400" : "bg-gradient-to-r from-rose-600 to-rose-400"}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${p.confidence}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: EXPO_OUT, delay: 0.3 + i * 0.08 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </RevealSection>

        {/* ── STATS BAR ─────────────────────────── */}
        <RevealSection className="mx-auto max-w-5xl px-6 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, ease: EXPO_OUT, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl border border-slate-800/40 bg-slate-900/35 backdrop-blur-xl p-7 text-center overflow-hidden"
                >
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.06), transparent 70%)" }} />
                  <Icon size={18} className="mx-auto mb-4 text-amber-500/30 group-hover:text-amber-400/60 transition-colors duration-500" />
                  <p className="text-3xl font-black tracking-tighter text-slate-50 font-mono">{s.value}</p>
                  <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </RevealSection>

        {/* ── COMMAND CENTER / FEATURES ─────────── */}
        <RevealSection className="mx-auto max-w-6xl px-6 pb-24">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-500/60 mb-4">Platform Modules</p>
            <h2 className="font-black tracking-tighter text-slate-50" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              Your{" "}
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)" }}>
                Command Center
              </span>
            </h2>
            <p className="mt-5 text-sm text-slate-500 max-w-lg mx-auto leading-relaxed font-light">
              Four integrated modules — one unified intelligence platform. Ancient wisdom. Modern execution.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, ease: EXPO_OUT, delay: idx * 0.1 }}
                  onHoverStart={() => setHoveredFeature(idx)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  whileHover={{ y: -10, scale: 1.015 }}
                  className="h-full"
                >
                  <a
                    href={f.href}
                    className="group relative flex flex-col h-full rounded-2xl p-8 overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, rgba(15,23,42,0.7), rgba(2,6,23,0.5))",
                      border: `1px solid ${f.borderBase}`,
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
                      transition: "border-color 0.5s ease, box-shadow 0.5s ease",
                    }}
                  >
                    {/* Hover fill */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${f.accentFrom}, ${f.accentTo}, transparent)`, transition: "opacity 0.7s ease" }} />

                    {/* Top sheen line */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

                    {/* Outer glow */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100"
                      style={{ boxShadow: `0 0 48px ${f.glow}`, transition: "opacity 0.6s ease" }} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <motion.div
                        className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ring-1 ring-white/[0.06]"
                        style={{ background: `linear-gradient(135deg, ${f.iconFrom}, ${f.iconTo})`, boxShadow: `0 8px 24px ${f.glow}` }}
                        whileHover={{ scale: 1.12, rotate: 4 }}
                        transition={SPRING_SNAP}
                      >
                        <Icon size={26} className="text-white drop-shadow" />
                      </motion.div>

                      <h3 className="text-xl font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors duration-500">
                        {f.title}
                      </h3>
                      <p className="mt-3 text-[13px] font-light leading-relaxed text-slate-500 group-hover:text-slate-300 transition-colors duration-500">
                        {f.desc}
                      </p>

                      <div className="mt-auto pt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-amber-400 transition-colors duration-500">
                        Launch module
                        <ChevronRight size={13} className="transition-transform group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </RevealSection>

        {/* ── PHILOSOPHY QUOTES ─────────────────── */}
        <RevealSection className="relative border-t border-slate-800/20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.025), transparent)" }} />
          <ParallaxLayer speed={0.08} className="mx-auto max-w-4xl px-6 py-28 text-center">
            <div className="mb-8 flex justify-center">
              <motion.div
                animate={{ y: ["-4%", "4%"] }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <BookLogo size={40} />
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIdx}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                transition={{ duration: 0.8, ease: EXPO_OUT }}
              >
                <blockquote className="text-xl sm:text-2xl font-light italic text-slate-400 leading-[1.65] max-w-2xl mx-auto">
                  &ldquo;{quotes[currentQuoteIdx].text}&rdquo;
                </blockquote>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/40">
                  — Kautilya, Arthashastra · {quotes[currentQuoteIdx].chapter}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-center gap-2">
              {quotes.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentQuoteIdx(i)}
                  className="rounded-full bg-amber-500"
                  animate={{ width: i === currentQuoteIdx ? 24 : 6, opacity: i === currentQuoteIdx ? 0.7 : 0.25 }}
                  style={{ height: 4 }}
                  transition={SPRING_SNAP}
                />
              ))}
            </div>
          </ParallaxLayer>
        </RevealSection>

        {/* ── BOTTOM CTA ────────────────────────── */}
        <RevealSection className="mx-auto max-w-3xl px-6 py-28 text-center">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 inline-block"
          >
            <Zap size={36} className="mx-auto text-amber-500/50" />
          </motion.div>

          <h3 className="font-black tracking-tighter text-slate-50" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Ready to deploy{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
              intelligence
            </span>
            ?
          </h3>
          <p className="mt-5 text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-light">
            Connect your wallet, step into the War Room, and let the Chanakya AI guide your next strategic move.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              onClick={handleLaunch}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING_SNAP}
              className="group relative overflow-hidden rounded-2xl"
              style={{
                padding: "1.1rem 3rem",
                background: "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)",
                boxShadow: "0 8px 32px rgba(212,175,55,0.2), 0 0 0 1px rgba(212,175,55,0.3)",
              }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)", backgroundSize: "200% 100%" }}
                animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
              />
              <span className="relative flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-slate-900">
                <Eye size={16} />
                Launch Platform
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.button>
          </div>
        </RevealSection>

        {/* ── FOOTER ────────────────────────────── */}
        <div className="border-t border-slate-800/20 py-8 px-6 text-center">
          <p className="text-[10px] text-slate-700 uppercase tracking-[0.35em] font-bold">
            Arthashastra · Financial Intelligence Platform · Est. 2026
          </p>
        </div>
      </div>
    </div>
  );
}
