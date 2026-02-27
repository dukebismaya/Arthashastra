"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuestModal from "@/components/academy/QuestModal";
import {
  GraduationCap,
  Trophy,
  Coins,
  Pickaxe,
  CheckCircle2,
  Lock,
  Shield,
  Sparkles,
  Zap,
  BookOpen,
  Brain,
  Cpu,
  TrendingUp,
  ArrowUpRight,
  Star,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   CONSTANTS & TYPES
   ══════════════════════════════════════════════════════════ */

const EXPO_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];
const SPRING_SNAP = { stiffness: 280, damping: 28 };

interface Quest {
  id: number;
  category: string;
  categoryColor: {
    bg: string;
    border: string;
    text: string;
    glow: string;
    dot: string;
  };
  icon: React.ReactNode;
  title: string;
  description: string;
  reward: string;
  rewardAmount: number;
  xpReward: number;
  difficulty: "Initiate" | "Strategist" | "Grandmaster";
  modules: number;
}

const QUESTS: Quest[] = [
  {
    id: 1,
    category: "Web3",
    categoryColor: {
      bg: "rgba(139,92,246,0.08)",
      border: "rgba(139,92,246,0.25)",
      text: "#a78bfa",
      glow: "rgba(139,92,246,0.15)",
      dot: "#8b5cf6",
    },
    icon: <Shield size={22} />,
    title: "Web3 Fundamentals",
    description:
      "Decode the architecture of decentralised finance. Master wallets, private keys, smart contract mechanics, and the immutable ledger that underpins the new financial order.",
    reward: "500 $ARTHA",
    rewardAmount: 500,
    xpReward: 120,
    difficulty: "Initiate",
    modules: 5,
  },
  {
    id: 2,
    category: "AI",
    categoryColor: {
      bg: "rgba(59,130,246,0.08)",
      border: "rgba(59,130,246,0.25)",
      text: "#60a5fa",
      glow: "rgba(59,130,246,0.15)",
      dot: "#3b82f6",
    },
    icon: <Brain size={22} />,
    title: "FinBERT Sentiment Analysis",
    description:
      "Wield the power of transformer-based NLP to decode market narratives. Learn how FinBERT extracts actionable signals from financial news and how Arthashastra integrates them.",
    reward: "500 $ARTHA",
    rewardAmount: 500,
    xpReward: 150,
    difficulty: "Strategist",
    modules: 6,
  },
  {
    id: 3,
    category: "Investing",
    categoryColor: {
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.25)",
      text: "#34d399",
      glow: "rgba(16,185,129,0.15)",
      dot: "#10b981",
    },
    icon: <TrendingUp size={22} />,
    title: "Value Investing Principles",
    description:
      "Study the timeless frameworks of Graham, Buffett, and Munger through a Kautilyan lens. Understand intrinsic value, margin of safety, and moat identification.",
    reward: "500 $ARTHA",
    rewardAmount: 500,
    xpReward: 130,
    difficulty: "Strategist",
    modules: 7,
  },
  {
    id: 4,
    category: "AI",
    categoryColor: {
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.25)",
      text: "#fbbf24",
      glow: "rgba(245,158,11,0.15)",
      dot: "#f59e0b",
    },
    icon: <Cpu size={22} />,
    title: "Chanakya AI: The Reasoner",
    description:
      "Go under the hood of Arthashastra's prediction engine. Master directional forecasting, confidence scoring, and the fusion of technical and fundamental signals via LLM reasoning.",
    reward: "500 $ARTHA",
    rewardAmount: 500,
    xpReward: 200,
    difficulty: "Grandmaster",
    modules: 8,
  },
];

const DIFFICULTY_STYLE: Record<
  Quest["difficulty"],
  { color: string; bg: string; border: string }
> = {
  Initiate: {
    color: "#34d399",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
  Strategist: {
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
  Grandmaster: {
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */

export default function AcademyPage() {
  const [quests, setQuests] = useState<Quest[]>(QUESTS);
  // const [loading, setLoading] = useState(true); // Removed as unused
  const [completedQuests, setCompletedQuests] = useState<number[]>([]);
  const [mintingId, setMintingId] = useState<number | null>(null);
  const [toastQuest, setToastQuest] = useState<Quest | null>(null);
  
  // Modal state
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Determine category props based on category string
    const getCategoryProps = (cat: string) => {
        const found = QUESTS.find(q => q.category === cat);
        if (found) return { color: found.categoryColor, icon: found.icon };
        // Default
        return { 
            color: QUESTS[0].categoryColor, 
            icon: <BookOpen size={22} />
        };
    };

    fetch('http://localhost:8000/api/v1/academy/courses')
      .then(res => res.json())
      .then(data => {
         const mapped = data.map((c: any) => {
             const props = getCategoryProps(c.category);
             return {
                 id: c.id,
                 category: c.category || "General",
                 categoryColor: props.color,
                 icon: props.icon,
                 title: c.title,
                 description: c.description,
                 reward: `${c.reward} $ARTHA`,
                 rewardAmount: c.reward,
                 xpReward: Math.floor(c.reward / 4),
                 difficulty: c.reward > 700 ? "Grandmaster" : (c.reward > 550 ? "Strategist" : "Initiate"),
                 modules: Math.floor(c.reward / 100) + 2
             };
         });
         setQuests(mapped);
        })
        .catch(err => {
            console.error(err);
        });
    }, []);

    const totalEarned = completedQuests.reduce((acc, id) => {
      const q = quests.find(q => q.id === id);
      return acc + (q?.rewardAmount || 0);
  }, 0);

  const xpEarned = completedQuests.reduce((acc, id) => {
    const q = quests.find((q) => q.id === id);
    return acc + (q?.xpReward || 0);
  }, 0);

  const XP_MAX = 800;
  const XP_CURRENT = 600 + xpEarned;
  const xpPct = Math.min((XP_CURRENT / XP_MAX) * 100, 100);

  async function handleClaimReward(id: number) {
    if (completedQuests.includes(id) || mintingId !== null) return;
    
    // Check wallet connection
    let wallet: string | null = null;
    if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
            const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
            if (accounts.length > 0) wallet = accounts[0];
        } catch (e) {
            console.error(e);
            return;
        }
    }

    if (!wallet) {
        alert("Please connect your wallet first!");
        return;
    }

    setMintingId(id);
    
    try {
        const res = await fetch(`http://localhost:8000/api/v1/academy/complete/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet_address: wallet })
        });
        
        if (!res.ok) throw new Error("Failed to complete course");
        
        // Success animation
        await new Promise((r) => setTimeout(r, 2200));
        
        setCompletedQuests((prev) => [...prev, id]);
        setMintingId(null);
        
        const q = quests.find((q) => q.id === id) ?? null;
        setToastQuest(q);
        
        // Dispatch event to update Navbar balance
        window.dispatchEvent(new Event("balanceUpdated"));
        
        setTimeout(() => setToastQuest(null), 4500);
        
    } catch (err: any) {
        console.error(err);
        setMintingId(null);
    }
  }

  const handleQuestClick = (quest: Quest) => {
    // Open the detailed learning modal
    setSelectedQuest(quest);
    setIsModalOpen(true);
  };

  return (
    <div className="relative max-w-[1400px] mx-auto space-y-8">

      {/* ── ON-CHAIN MINT TOAST ──────────────────────────── */}
      <AnimatePresence>
        {toastQuest && (
          <motion.div
            initial={{ opacity: 0, y: -32, scale: 0.95, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.5, ease: EXPO_OUT }}
            className="fixed top-6 left-1/2 z-[200] -translate-x-1/2"
          >
            <div
              className="flex items-center gap-4 px-6 py-4 rounded-2xl backdrop-blur-2xl"
              style={{
                background: "rgba(2,6,23,0.90)",
                border: "1px solid rgba(16,185,129,0.35)",
                boxShadow:
                  "0 0 40px rgba(16,185,129,0.18), 0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div className="relative shrink-0">
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-400 animate-ping opacity-60" />
              </div>
              <div>
                <p className="text-sm font-black text-emerald-300">
                  On-chain Mint Confirmed! +{toastQuest.reward}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {toastQuest.title} · NFT certificate minted to your wallet
                </p>
              </div>
              <div className="ml-2 flex items-center gap-1 rounded-full px-3 py-1"
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <Sparkles size={11} className="text-emerald-400" />
                <span className="text-[11px] font-black text-emerald-400">+{toastQuest.xpReward} XP</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PLAYER HEADER ────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: EXPO_OUT }}
        className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.85), rgba(2,6,23,0.70))",
          border: "1px solid rgba(212,175,55,0.14)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          boxShadow:
            "0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          className="absolute -top-28 -right-28 h-64 w-64 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #d4af37, transparent)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent pointer-events-none" />

        <div className="relative z-10">
          {/* Top row: Level + badge */}
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar orb */}
              <motion.div
                animate={{ boxShadow: ["0 0 16px rgba(212,175,55,0.2)", "0 0 32px rgba(212,175,55,0.35)", "0 0 16px rgba(212,175,55,0.2)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))",
                  border: "1px solid rgba(212,175,55,0.25)",
                }}
              >
                <GraduationCap size={30} className="text-amber-400" />
                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950">
                  3
                </div>
              </motion.div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/60">
                    Current Rank
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-50">
                  Level 3:{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
                    }}
                  >
                    Strategist
                  </span>
                </h1>
                <p className="mt-0.5 text-[12px] text-slate-500 font-medium">
                  Kautilya&apos;s Academy · Ancient Wealth Protocol
                </p>
              </div>
            </div>

            {/* Trophy stat */}
            <div
              className="flex items-center gap-3 rounded-2xl px-5 py-3"
              style={{
                background: "rgba(212,175,55,0.06)",
                border: "1px solid rgba(212,175,55,0.15)",
              }}
            >
              <Trophy size={18} className="text-amber-400" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                  Total Earned
                </p>
                <p className="text-lg font-black font-mono text-amber-400">
                  {totalEarned.toLocaleString()} $ARTHA
                </p>
              </div>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="mt-7">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                Experience Points
              </span>
              <span className="text-[11px] font-black font-mono text-amber-400/80">
                {XP_CURRENT} / {XP_MAX} XP
              </span>
            </div>
            <div
              className="relative h-2.5 rounded-full overflow-hidden"
              style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <motion.div
                initial={{ width: "75%" }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.4, ease: EXPO_OUT }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #92400e, #d97706, #fbbf24, #fde68a)",
                  boxShadow: "0 0 16px rgba(212,175,55,0.5)",
                }}
              />
              {/* Sheen */}
              <motion.div
                className="absolute inset-y-0 w-16"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                }}
                animate={{ left: ["-10%", "110%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Pickaxe size={13} className="text-amber-500/50" />
              <span className="text-[12px] font-bold text-slate-400">
                Quests Completed:{" "}
                <span className="text-amber-400 font-black">
                  {completedQuests.length}/{QUESTS.length}
                </span>
              </span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <Coins size={13} className="text-amber-500/50" />
              <span className="text-[12px] font-bold text-slate-400">
                Total Earned:{" "}
                <span className="text-amber-400 font-black">
                  {totalEarned.toLocaleString()} $ARTHA
                </span>
              </span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <Star size={13} className="text-amber-500/50" />
              <span className="text-[12px] font-bold text-slate-400">
                XP Gained this session:{" "}
                <span className="text-amber-400 font-black">+{xpEarned}</span>
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── SECTION LABEL ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: EXPO_OUT, delay: 0.15 }}
        className="flex items-center gap-4"
      >
        <div className="relative h-2 w-2 shrink-0">
          <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
          <div className="h-2 w-2 rounded-full bg-amber-400" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/70">
          Quest Board · {quests.length - completedQuests.length} Active
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-amber-500/15 to-transparent" />
        <BookOpen size={13} className="text-slate-700" />
      </motion.div>

      {/* ── QUEST GRID ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quests.map((quest, idx) => {
          const isCompleted = completedQuests.includes(quest.id);
          const isMinting = mintingId === quest.id;
          const isLocked = mintingId !== null && mintingId !== quest.id;
          const diff = DIFFICULTY_STYLE[quest.difficulty];

          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.85,
                ease: EXPO_OUT,
                delay: 0.1 + idx * 0.1,
              }}
              whileHover={!isCompleted && !isMinting ? { y: -8, scale: 1.012 } : {}}
              className="group relative flex flex-col rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(160deg, rgba(15,23,42,0.80), rgba(2,6,23,0.65))",
                border: isCompleted
                  ? "1px solid rgba(16,185,129,0.30)"
                  : `1px solid rgba(30,41,59,0.80)`,
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: isCompleted
                  ? "0 4px 32px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.03)"
                  : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
                transition: "box-shadow 0.5s ease, border-color 0.5s ease",
              }}
            >
              {/* Hover glow overlay */}
              {!isCompleted && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-3xl"
                  style={{
                    boxShadow: `0 0 60px ${quest.categoryColor.glow}`,
                    transition: "opacity 0.6s ease",
                  }}
                />
              )}

              {/* Completion overlay tint */}
              {isCompleted && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(16,185,129,0.04), transparent)",
                  }}
                />
              )}

              {/* Top accent bar */}
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: isCompleted
                    ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)"
                    : `linear-gradient(90deg, transparent, ${quest.categoryColor.border}, transparent)`,
                  opacity: isCompleted ? 1 : 0.5,
                  transition: "opacity 0.5s ease",
                }}
              />

              {/* ── Card body */}
              <div className="relative z-10 flex flex-col h-full p-7">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    {/* Category tag */}
                    <div
                      className="flex items-center gap-2 rounded-full px-3.5 py-1.5 shrink-0"
                      style={{
                        background: quest.categoryColor.bg,
                        border: `1px solid ${quest.categoryColor.border}`,
                      }}
                    >
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: quest.categoryColor.dot }}
                      />
                      <span
                        className="text-[10px] font-black uppercase tracking-[0.2em]"
                        style={{ color: quest.categoryColor.text }}
                      >
                        {quest.category}
                      </span>
                    </div>

                    {/* Difficulty */}
                    <div
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                      style={{
                        background: diff.bg,
                        border: `1px solid ${diff.border}`,
                      }}
                    >
                      <span
                        className="text-[10px] font-black uppercase tracking-[0.15em]"
                        style={{ color: diff.color }}
                      >
                        {quest.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Reward chip */}
                  <div
                    className="flex items-center gap-1.5 rounded-full px-4 py-1.5 shrink-0"
                    style={{
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.22)",
                    }}
                  >
                    <Coins size={12} className="text-amber-400" />
                    <span className="text-[12px] font-black font-mono text-amber-400">
                      {quest.reward}
                    </span>
                  </div>
                </div>

                {/* Icon + Title */}
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/[0.06]"
                    style={{
                      background: `linear-gradient(135deg, ${quest.categoryColor.bg}, rgba(2,6,23,0.5))`,
                      color: quest.categoryColor.text,
                      boxShadow: `0 4px 16px ${quest.categoryColor.glow}`,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={SPRING_SNAP}
                  >
                    {quest.icon}
                  </motion.div>

                  <div>
                    <h3 className="text-[17px] font-black tracking-tight text-slate-100 group-hover:text-white transition-colors duration-400 leading-snug">
                      {quest.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-bold text-slate-600">
                      {quest.modules} modules · +{quest.xpReward} XP
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] leading-relaxed text-slate-500 group-hover:text-slate-400 transition-colors duration-400 flex-1 mb-7">
                  {quest.description}
                </p>

                {/* ── CTA BUTTON */}
                <div className="mt-auto">
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: EXPO_OUT }}
                        className="flex w-full items-center gap-3 rounded-2xl px-5 py-3.5"
                        style={{
                          background: "rgba(16,185,129,0.08)",
                          border: "1px solid rgba(16,185,129,0.25)",
                        }}
                      >
                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        <span className="text-[13px] font-black text-emerald-400">
                          Reward Claimed
                        </span>
                        <span className="ml-auto text-[11px] font-black font-mono text-emerald-500/70">
                          +{quest.reward}
                        </span>
                      </motion.div>
                    ) : isMinting ? (
                      <motion.div
                        key="minting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-3.5"
                        style={{
                          background: "rgba(212,175,55,0.08)",
                          border: "1px solid rgba(212,175,55,0.25)",
                        }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Pickaxe size={16} className="text-amber-400" />
                        </motion.div>
                        <motion.span
                          className="text-[13px] font-black text-amber-400"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        >
                          Studying Module & Minting Certificate...
                        </motion.span>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="claim"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => handleQuestClick(quest)}
                        disabled={isLocked}
                        whileHover={!isLocked ? { scale: 1.03 } : {}}
                        whileTap={!isLocked ? { scale: 0.97 } : {}}
                        transition={SPRING_SNAP}
                        className="group/btn relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-5 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: isLocked
                            ? "rgba(30,41,59,0.6)"
                            : "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
                          border: isLocked
                            ? "1px solid rgba(30,41,59,0.8)"
                            : "1px solid rgba(212,175,55,0.28)",
                          boxShadow: isLocked
                            ? "none"
                            : "0 4px 20px rgba(0,0,0,0.25)",
                        }}
                      >
                        {/* Shine sweep on hover */}
                        {!isLocked && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)",
                              backgroundSize: "200% 100%",
                            }}
                            animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 4,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                        {isLocked ? (
                          <Lock size={15} className="text-slate-600" />
                        ) : (
                          <Zap size={15} className="text-amber-400" />
                        )}
                        <span
                          className="text-[13px] font-black uppercase tracking-[0.1em]"
                          style={{ color: isLocked ? "#475569" : "#fbbf24" }}
                        >
                          {isLocked ? "Another Quest Active" : "Start Learning Module"}
                        </span>
                        {!isLocked && (
                          <ArrowUpRight
                            size={14}
                            className="text-amber-500/60 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                          />
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── COMPLETION BANNER ────────────────────────────── */}
      <AnimatePresence>
        {quests.length > 0 && completedQuests.length === quests.length && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.8, ease: EXPO_OUT }}
            className="relative overflow-hidden rounded-3xl p-10 text-center"
            style={{
              background:
                "linear-gradient(160deg, rgba(212,175,55,0.08), rgba(2,6,23,0.80))",
              border: "1px solid rgba(212,175,55,0.22)",
              backdropFilter: "blur(32px)",
              boxShadow:
                "0 0 80px rgba(212,175,55,0.08), 0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 6, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4 inline-block"
            >
              <Trophy size={48} className="text-amber-400 mx-auto" />
            </motion.div>
            <h2 className="text-3xl font-black tracking-tight text-slate-50">
              Quest Board{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
                }}
              >
                Conquered
              </span>
            </h2>
            <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
              All quests complete. {(QUESTS.length * 500).toLocaleString()} $ARTHA
              earned and {QUESTS.length} NFT certificates minted to your wallet. Kautilya
              would be proud.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div
                className="flex items-center gap-2 rounded-full px-5 py-2.5"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <Shield size={14} className="text-amber-400" />
                <span className="text-[12px] font-black text-amber-400 uppercase tracking-[0.2em]">
                  Rank Unlocked: Grandmaster
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedQuest && (
            <QuestModal 
                quest={selectedQuest} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onComplete={handleClaimReward}
                isAlreadyCompleted={completedQuests.includes(selectedQuest.id)}
            />
        )}
      </AnimatePresence>
    </div>
  );
}
