"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   Kuber Guide — Floating AI Assistant
   ═══════════════════════════════════════════════════════════
   Sits fixed bottom-right on every page. Opens a glassmorphic
   chat panel that communicates with /api/kuber (Gemini 2.0 Flash).
   ═══════════════════════════════════════════════════════════ */

const EXPO_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface Message {
  role: "user" | "kuber";
  text: string;
}

const GREETING: Message = {
  role: "kuber",
  text: "Namaste! I am Kuber, guardian of the Arthashastra treasury. Ask me about the War Room, Market Intel, Academy, or your Portfolio — I am at your service.",
};

export default function KuberGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Auto-scroll to bottom on new message ──────────── */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  /* ── Focus input when panel opens ──────────────────── */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  /* ── Send message ──────────────────────────────────── */
  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/kuber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const data = await res.json();
      const kuberMsg: Message = {
        role: "kuber",
        text: data.response ?? "I could not process that. Please try again.",
      };
      setMessages((prev) => [...prev, kuberMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "kuber", text: "Connection lost. Please try again shortly." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════
          CHAT PANEL
         ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.35, ease: EXPO_OUT }}
            className="fixed bottom-20 right-4 z-50 flex w-80 flex-col overflow-hidden rounded-xl"
            style={{
              height: "24rem",
              background:
                "linear-gradient(160deg, rgba(2,6,23,0.97), rgba(15,23,42,0.95))",
              border: "1px solid rgba(245,158,11,0.3)",
              backdropFilter: "blur(24px)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(245,158,11,0.08)",
            }}
          >
            {/* ── Header ─────────────────────────────── */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                borderBottom: "1px solid rgba(245,158,11,0.15)",
                background:
                  "linear-gradient(90deg, rgba(245,158,11,0.06), transparent)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/25">
                  <Bot size={14} className="text-amber-400" />
                </div>
                <div>
                  <span className="text-[13px] font-bold text-amber-400">
                    Kuber Guide
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-500/80 uppercase tracking-wider">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* ── Message Body ───────────────────────── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: EXPO_OUT,
                    delay: i === messages.length - 1 ? 0.05 : 0,
                  }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[85%] ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] ${
                        msg.role === "kuber"
                          ? "bg-amber-500/15 ring-1 ring-amber-500/25 text-amber-400"
                          : "bg-slate-800/80 ring-1 ring-slate-700/40 text-slate-400"
                      }`}
                    >
                      {msg.role === "kuber" ? (
                        <Sparkles size={11} />
                      ) : (
                        <User size={11} />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`rounded-xl px-3 py-2 text-[12px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-slate-800/70 text-slate-200 border border-slate-700/40"
                          : "bg-amber-500/[0.06] text-amber-100/90 border border-amber-500/15"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/25">
                      <Sparkles
                        size={11}
                        className="text-amber-400 animate-pulse"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/15 px-3 py-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((dot) => (
                          <motion.div
                            key={dot}
                            className="h-1.5 w-1.5 rounded-full bg-amber-400/60"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: dot * 0.2,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-amber-400/60 ml-1">
                        Kuber is thinking…
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Input Footer ───────────────────────── */}
            <div
              className="px-3 py-2.5"
              style={{
                borderTop: "1px solid rgba(245,158,11,0.12)",
                background: "rgba(2,6,23,0.6)",
              }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Kuber anything…"
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2 text-[12px] text-slate-200 placeholder-slate-600 outline-none ring-1 ring-slate-800/60 transition-all focus:ring-amber-500/30 focus:bg-slate-800/70 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25 transition-all hover:bg-amber-500/25 hover:shadow-lg hover:shadow-amber-500/10 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-center text-[9px] text-slate-700">
                Powered by Gemini 2.0 Flash &middot; Arthashastra AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          FLOATING BUTTON
         ══════════════════════════════════════════════════ */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full transition-all"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(212,175,55,0.15))",
          border: "1px solid rgba(245,158,11,0.4)",
          boxShadow:
            "0 4px 24px rgba(245,158,11,0.2), 0 0 40px rgba(245,158,11,0.08)",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={18} className="text-amber-400" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare size={18} className="text-amber-400" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow ring animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-amber-500" />
        )}
      </motion.button>
    </>
  );
}
