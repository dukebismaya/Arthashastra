"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════ */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" as const },
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

/* ═══════════════════════════════════════════════════════════
   FEATURE CARDS DATA
   ═══════════════════════════════════════════════════════════ */

const features = [
  {
    icon: Swords,
    title: "War Room",
    desc: "AI-powered predictions with Chanakya reasoner. Place directional bets with explainable confidence scores.",
    href: "/war-room",
    accent: "from-amber-500/20 to-amber-600/5",
    ring: "ring-amber-500/20 hover:ring-amber-500/40",
    iconColor: "text-amber-400",
    glow: "group-hover:shadow-amber-500/10",
  },
  {
    icon: Newspaper,
    title: "Market Intel",
    desc: "Real-time financial news aggregation. Sentiment analysis and breaking alert detection across global markets.",
    href: "/market-intel",
    accent: "from-blue-500/20 to-blue-600/5",
    ring: "ring-blue-500/20 hover:ring-blue-500/40",
    iconColor: "text-blue-400",
    glow: "group-hover:shadow-blue-500/10",
  },
  {
    icon: GraduationCap,
    title: "Academy",
    desc: "Master financial strategy through curated courses. Earn on-chain certificates and sharpen your edge.",
    href: "/academy",
    accent: "from-purple-500/20 to-purple-600/5",
    ring: "ring-purple-500/20 hover:ring-purple-500/40",
    iconColor: "text-purple-400",
    glow: "group-hover:shadow-purple-500/10",
  },
  {
    icon: Vault,
    title: "Treasury",
    desc: "Web3-native portfolio dashboard. View balances, manage deposits, and track every transaction on-chain.",
    href: "/treasury",
    accent: "from-emerald-500/20 to-emerald-600/5",
    ring: "ring-emerald-500/20 hover:ring-emerald-500/40",
    iconColor: "text-emerald-400",
    glow: "group-hover:shadow-emerald-500/10",
  },
];

/* ═══════════════════════════════════════════════════════════
   STATS DATA
   ═══════════════════════════════════════════════════════════ */

const stats = [
  { label: "AI Predictions / day", value: "2,400+" },
  { label: "News Sources Tracked", value: "120+" },
  { label: "Avg. Confidence Score", value: "87.3%" },
  { label: "On-chain Certificates", value: "5,000+" },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-y-auto overflow-x-hidden">
      {/* ═══════════ FLOATING ₹ HOLOGRAM BACKGROUND ═══════════ */}
      <motion.div
        className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <motion.span
          className="text-[42rem] font-black leading-none bg-gradient-to-b from-amber-500/[0.07] via-yellow-400/[0.04] to-transparent bg-clip-text text-transparent"
          style={{ filter: "blur(8px)" }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          ₹
        </motion.span>
      </motion.div>

      {/* Radial glow behind the rupee */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ═══════════ CONTENT LAYER ═══════════ */}
      <div className="relative z-10">
        {/* ── HERO SECTION ──────────────────────── */}
        <section className="flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 backdrop-blur-sm">
              <div className="relative h-2 w-2">
                <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-60" />
                <div className="relative h-2 w-2 rounded-full bg-amber-400" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400/90">
                Decentralized Intelligence Engine
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl xl:text-9xl"
            >
              <span className="block bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent gold-text-glow">
                ARTHASHASTRA
              </span>
            </motion.h1>

            {/* Decorative line */}
            <motion.div variants={fadeIn} className="mx-auto mt-6 mb-6 flex items-center gap-3">
              <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-amber-500/40" />
              <Shield size={14} className="text-amber-500/60" />
              <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-amber-500/40" />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl"
            >
              The Ultimate Engine for{" "}
              <span className="text-amber-400/90 font-semibold">Decentralized Financial Intelligence</span>.
              <br className="hidden sm:block" />
              Predict markets. Decode news. Master strategy. Build wealth.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/war-room"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Brain size={16} />
                Enter the War Room
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link
                href="/academy"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/30 px-7 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/50 hover:text-slate-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <GraduationCap size={16} />
                Explore Academy
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ── STATS BAR ─────────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-5xl px-6 py-12"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={scaleIn}
                className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-5 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-extrabold text-slate-100 sm:text-3xl tracking-tight">
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── FEATURE CARDS ─────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-6xl px-6 pb-16"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
              Your{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Command Center
              </span>
            </h2>
            <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto">
              Four integrated modules — one unified intelligence platform.
              Every tool a modern strategist needs, inspired by ancient wisdom.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} variants={fadeUp}>
                  <Link
                    href={f.href}
                    className={`group relative flex flex-col rounded-2xl border bg-gradient-to-br ${f.accent} border-slate-800/40 p-6 ring-1 ${f.ring} backdrop-blur-sm transition-all duration-500 hover:shadow-2xl ${f.glow} hover:border-slate-700/60 hover:-translate-y-1`}
                  >
                    {/* icon */}
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/60 ring-1 ring-slate-700/40 ${f.iconColor}`}>
                      <Icon size={22} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                      {f.desc}
                    </p>

                    {/* arrow */}
                    <div className="mt-5 flex items-center gap-1 text-[12px] font-semibold text-slate-500 group-hover:text-amber-400 transition-colors">
                      Launch module
                      <ChevronRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── PHILOSOPHY STRIP ──────────────────── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="border-t border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm"
        >
          <div className="mx-auto max-w-4xl px-6 py-16 text-center">
            <blockquote className="text-xl font-medium italic text-slate-400 leading-relaxed sm:text-2xl">
              &ldquo;Wealth, properly used, is a source of strength.
              <br />
              Misused, it is a source of destruction.&rdquo;
            </blockquote>
            <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-amber-500/60">
              — Kautilya, Arthashastra, c. 300 BCE
            </p>
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
            <Zap size={28} className="mx-auto mb-4 text-amber-500/70" />
            <h3 className="text-2xl font-extrabold text-slate-100 sm:text-3xl tracking-tight">
              Ready to deploy intelligence?
            </h3>
            <p className="mt-3 text-sm text-slate-500 max-w-lg mx-auto">
              Connect your wallet, enter the War Room, and let Chanakya AI
              guide your next strategic move.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/war-room"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Eye size={16} />
                Launch Platform
              </Link>
            </div>
          </motion.div>
        </motion.section>

        {/* ── FOOTER ────────────────────────────── */}
        <footer className="border-t border-slate-800/40 py-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/20 px-4 py-2">
            <div className="h-1 w-1 rounded-full bg-amber-500/50" />
            <p className="text-[11px] font-medium text-slate-600">
              Arthashastra v0.1.0 — The Art of Strategic Wealth
            </p>
            <div className="h-1 w-1 rounded-full bg-amber-500/50" />
          </div>
        </footer>
      </div>
    </div>
  );
}
