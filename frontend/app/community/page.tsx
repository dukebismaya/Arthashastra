"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Users,
  Hash,
  Minus,
  Flame,
  Zap,
  Shield,
  HelpCircle,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Community — The Trading Floor
   ═══════════════════════════════════════════════════════════
   Fully mock, frontend-only chat interface.
   No backend — state-driven with pre-seeded messages.
   ═══════════════════════════════════════════════════════════ */

const EXPO_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ── Types ─────────────────────────────────────────────── */

type Sentiment = "neutral" | "bullish" | "bearish";

interface ChatMessage {
  id: string;
  author: string;
  avatar: string;          // 2-char initials
  avatarColor: string;
  text: string;
  sentiment: Sentiment;
  time: string;
}

interface Channel {
  id: string;
  name: string;
  icon: React.ElementType;
  unread?: number;
}

/* ── Mock Channels ─────────────────────────────────────── */

const CHANNELS: Channel[] = [
  { id: "global-alpha",   name: "global-alpha",   icon: Flame,       unread: 12 },
  { id: "crypto-signals", name: "crypto-signals",  icon: Zap,         unread: 3  },
  { id: "options-plays",  name: "options-plays",   icon: Shield                  },
  { id: "academy-help",   name: "academy-help",    icon: HelpCircle              },
];

/* ── Palette for random avatar rings ──────────────────── */

const AVATAR_COLORS = [
  "from-emerald-500 to-cyan-500",
  "from-amber-500 to-orange-500",
  "from-violet-500 to-fuchsia-500",
  "from-rose-500 to-pink-500",
  "from-sky-500 to-blue-500",
];

function pickColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

/* ── Pre-seeded Messages ──────────────────────────────── */

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    author: "0xc8...44d9",
    avatar: "0X",
    avatarColor: pickColor("0xc8"),
    text: "Just ran the Chanakya AI on $NVDA. Confidence is 92% bullish. Anyone else seeing this accumulation?",
    sentiment: "bullish",
    time: "2m ago",
  },
  {
    id: "2",
    author: "Kautilya_Whale",
    avatar: "KW",
    avatarColor: pickColor("Kautilya_Whale"),
    text: "Careful, MACD is showing bearish divergence on the hourly chart. I'm hedging with puts.",
    sentiment: "bearish",
    time: "5m ago",
  },
  {
    id: "3",
    author: "AlphaSeeker",
    avatar: "AS",
    avatarColor: pickColor("AlphaSeeker"),
    text: "Did anyone catch that FinBERT sentiment drop on the latest Fed news? Market might overreact.",
    sentiment: "neutral",
    time: "12m ago",
  },
  {
    id: "4",
    author: "NewTrader99",
    avatar: "NT",
    avatarColor: pickColor("NewTrader99"),
    text: "Just claimed my 500 $ARTHA from the Academy Web3 module! LFG 🚀",
    sentiment: "bullish",
    time: "15m ago",
  },
  {
    id: "5",
    author: "DeFi_Sage",
    avatar: "DS",
    avatarColor: pickColor("DeFi_Sage"),
    text: "RSI on RELIANCE just broke below 30 on the 4H. Classic oversold bounce incoming?",
    sentiment: "bullish",
    time: "18m ago",
  },
  {
    id: "6",
    author: "BearishBaba",
    avatar: "BB",
    avatarColor: pickColor("BearishBaba"),
    text: "Nifty looks weak at resistance. If 24,800 doesn't hold today, I'm shorting into the close.",
    sentiment: "bearish",
    time: "22m ago",
  },
  {
    id: "7",
    author: "QuantQueen",
    avatar: "QQ",
    avatarColor: pickColor("QuantQueen"),
    text: "My algo flagged unusual options volume on INFY. IV crush might be a play post-earnings. Thoughts?",
    sentiment: "neutral",
    time: "28m ago",
  },
];

/* ── Sentiment Helpers ────────────────────────────────── */

const SENTIMENT_BADGE: Record<Sentiment, { icon: React.ElementType; label: string; color: string; bg: string; ring: string }> = {
  bullish: { icon: TrendingUp,   label: "Bullish",  color: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" },
  bearish: { icon: TrendingDown, label: "Bearish",  color: "text-rose-400",    bg: "bg-rose-500/10",    ring: "ring-rose-500/20"    },
  neutral: { icon: Minus,        label: "Neutral",  color: "text-slate-400",   bg: "bg-slate-500/10",   ring: "ring-slate-500/20"   },
};

/* ══════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════ */

export default function CommunityPage() {
  const [activeChannel, setActiveChannel] = useState("global-alpha");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeSentiment, setActiveSentiment] = useState<Sentiment>("neutral");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Auto-scroll on new message ─────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Send handler ───────────────────────────────────── */
  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      author: "You",
      avatar: "YO",
      avatarColor: "from-amber-400 to-yellow-500",
      text: trimmed,
      sentiment: activeSentiment,
      time: "Just now",
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    setActiveSentiment("neutral");
    inputRef.current?.focus();
  }

  /* ── Online traders count (mock) ────────────────────── */
  const onlineCount = "8,432";

  return (
    <div className="flex h-[calc(100vh-56px)] max-w-[1400px] mx-auto gap-0 animate-fade-in">
      {/* ════════════════════════════════════════════════════
          LEFT — Channel Sidebar
         ════════════════════════════════════════════════════ */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col glass-card rounded-2xl mr-3 my-0 overflow-hidden">
        {/* Sidebar header */}
        <div className="px-5 pt-5 pb-3">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <MessageSquare size={13} className="text-amber-500" />
            Channels
          </h2>
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-800/50 to-transparent" />

        {/* Channel list */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {CHANNELS.map((ch) => {
            const isActive = ch.id === activeChannel;
            const Icon = ch.icon;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400"
                    : "text-slate-500 hover:bg-slate-800/30 hover:text-slate-300"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 h-5 w-[2px] rounded-full bg-gradient-to-b from-amber-400 to-yellow-600" />
                )}
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                  isActive ? "bg-amber-500/10" : "group-hover:bg-slate-800/40"
                }`}>
                  <Icon size={14} className={isActive ? "text-amber-400" : "text-slate-600 group-hover:text-slate-400"} strokeWidth={isActive ? 2.2 : 1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`flex items-center gap-1 text-[12px] font-bold truncate ${isActive ? "text-amber-400" : ""}`}>
                    <Hash size={11} className="shrink-0 opacity-40" />
                    {ch.name}
                  </span>
                </div>
                {ch.unread && !isActive && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-[9px] font-bold text-amber-400">
                    {ch.unread}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Online indicator */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-800/50 to-transparent" />
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="relative h-2 w-2 rounded-full bg-emerald-500">
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>
            <span className="text-[10px] font-semibold text-slate-600">
              <span className="text-emerald-400 font-bold">{onlineCount}</span> traders online
            </span>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════
          MAIN — Chat Area
         ════════════════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* ── Chat Header ──────────────────────────────── */}
        <div className="glass-card rounded-2xl px-6 py-4 mb-3 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-100">
              The Trading Floor
              <span className="text-slate-600 font-medium text-sm">—</span>
              <span className="flex items-center gap-1 text-sm font-bold text-amber-400">
                <Hash size={13} /> {activeChannel}
              </span>
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-600">
              Real-time alpha sharing. Be respectful, be profitable.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile online count */}
            <div className="flex items-center gap-1.5 md:hidden">
              <div className="relative h-1.5 w-1.5 rounded-full bg-emerald-500">
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <span className="text-[10px] font-bold text-emerald-400">{onlineCount}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-800/30 px-3 py-1.5 ring-1 ring-slate-800/60">
              <Users size={13} className="text-slate-500" />
              <span className="text-[11px] font-semibold text-slate-400">
                <span className="text-emerald-400 font-bold">{onlineCount}</span> Online
              </span>
            </div>
          </div>
        </div>

        {/* ── Chat Feed ────────────────────────────────── */}
        <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
            {messages.map((msg, idx) => {
              const badge = SENTIMENT_BADGE[msg.sentiment];
              const BadgeIcon = badge.icon;
              const isYou = msg.author === "You";

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EXPO_OUT, delay: idx < initialMessages.length ? idx * 0.04 : 0 }}
                  className="group flex items-start gap-3 rounded-xl px-3 py-3 -mx-1 hover:bg-slate-800/20 transition-colors duration-200"
                >
                  {/* Avatar */}
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${msg.avatarColor} text-[11px] font-extrabold text-white shadow-lg ring-1 ring-white/10`}>
                    {msg.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[13px] font-bold ${isYou ? "text-amber-400" : "text-slate-200"}`}>
                        {msg.author}
                      </span>

                      {/* Sentiment badge */}
                      {msg.sentiment !== "neutral" && (
                        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1 ${badge.bg} ${badge.color} ${badge.ring}`}>
                          <BadgeIcon size={9} strokeWidth={2.5} />
                          {badge.label}
                        </span>
                      )}

                      <span className="text-[10px] text-slate-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.time}
                      </span>
                    </div>

                    <p className="text-[13px] leading-relaxed text-slate-400">{msg.text}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* Dummy scroll anchor */}
            <div ref={bottomRef} />
          </div>

          {/* ── Input Area ─────────────────────────────── */}
          <div className="border-t border-slate-800/40 px-4 py-3">
            {/* Sentiment toggles */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-700 mr-1">
                Sentiment:
              </span>
              {(["neutral", "bullish", "bearish"] as Sentiment[]).map((s) => {
                const b = SENTIMENT_BADGE[s];
                const Icon = b.icon;
                const isActive = activeSentiment === s;
                return (
                  <motion.button
                    key={s}
                    onClick={() => setActiveSentiment(s)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ring-1 ${
                      isActive
                        ? `${b.bg} ${b.color} ${b.ring} shadow-sm`
                        : "text-slate-600 ring-slate-800/40 hover:ring-slate-700/60 hover:text-slate-400"
                    }`}
                  >
                    <Icon size={11} strokeWidth={2.2} />
                    {b.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Input + Send */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${activeChannel}…`}
                  className="w-full rounded-xl bg-slate-800/40 py-3 pl-4 pr-4 text-[13px] text-slate-200 placeholder-slate-700 outline-none ring-1 ring-slate-800 transition-all duration-300 focus:ring-amber-500/30 focus:bg-slate-800/60 focus:shadow-lg focus:shadow-amber-500/5"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                disabled={!newMessage.trim()}
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20 transition-all duration-200 hover:shadow-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <Send size={17} strokeWidth={2.2} />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
