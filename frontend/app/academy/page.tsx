"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Trophy,
  CheckCircle2,
  Loader2,
  X,
  Coins,
  Zap,
} from "lucide-react";

/* ── Types ───────────────────────────────────────── */
interface Course {
  id: number;
  title: string;
  description: string;
  reward: number;
  category: string;
}

/* ── Category styling map ────────────────────────── */
const categoryStyle: Record<
  string,
  { bg: string; text: string; ring: string; dot: string }
> = {
  Web3: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    ring: "ring-purple-500/20",
    dot: "bg-purple-500",
  },
  Investing: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-500/20",
    dot: "bg-emerald-500",
  },
  "AI / ML": {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    ring: "ring-blue-500/20",
    dot: "bg-blue-500",
  },
};

const fallbackStyle = {
  bg: "bg-slate-500/10",
  text: "text-slate-400",
  ring: "ring-slate-500/20",
  dot: "bg-slate-500",
};

/* ── Progress icon per category ──────────────────── */
const categoryIcon: Record<string, React.ReactNode> = {
  Web3: <Zap size={13} />,
  Investing: <Coins size={13} />,
  "AI / ML": <Sparkles size={13} />,
};

export default function AcademyPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");

  /* Per-card state: "idle" | "completing" | "done" */
  const [cardState, setCardState] = useState<Record<number, string>>({});

  /* Toast */
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    reward: number;
    balance: number;
  } | null>(null);

  /* ── Fetch courses + wallet ────────────────────── */
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/academy/courses`);
        if (res.ok) {
          const data: Course[] = await res.json();
          setCourses(data);
        }
      } catch {
        /* course fetch silently handled */
      } finally {
        setLoading(false);
      }

      try {
        if (typeof window !== "undefined" && (window as any).ethereum) {
          const accounts: string[] = await (window as any).ethereum.request({
            method: "eth_accounts",
          });
          if (accounts[0]) setWalletAddress(accounts[0]);
        }
      } catch {
        /* wallet detection silently handled */
      }
    }
    init();
  }, []);

  /* ── Complete course handler ───────────────────── */
  async function handleComplete(course: Course) {
    if (!walletAddress) return;
    if (cardState[course.id] === "completing" || cardState[course.id] === "done")
      return;

    setCardState((prev) => ({ ...prev, [course.id]: "completing" }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/academy/complete/${course.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet_address: walletAddress }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setCardState((prev) => ({ ...prev, [course.id]: "done" }));
        setToast({
          show: true,
          title: data.course_title,
          reward: data.reward,
          balance: data.new_balance,
        });
        setTimeout(() => setToast(null), 4500);
      }
    } catch {
      setCardState((prev) => ({ ...prev, [course.id]: "idle" }));
    }
  }

  /* ── Render ────────────────────────────────────── */
  return (
    <>
      {/* ── Reward Credited Toast ─────────────────── */}
      <div
        className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out ${
          toast?.show ? "top-6 opacity-100" : "-top-24 opacity-0"
        }`}
      >
        {toast && (
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="relative shrink-0">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-50" />
            </div>
            <div>
              <p className="text-emerald-50 font-bold text-sm">
                Reward Credited! +₹
                {toast.reward.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                New Treasury Balance: ₹
                {toast.balance.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="shrink-0 rounded-lg p-1 text-slate-500 hover:text-emerald-400 hover:bg-slate-800/60 transition-premium"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ── Header ──────────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl gradient-border p-8 animate-fade-in shimmer">
          <div
            className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-yellow-500/[0.04] blur-3xl animate-float"
          />
          <div
            className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-emerald-500/[0.03] blur-3xl animate-float"
            style={{ animationDelay: "-3s" }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative h-2 w-2 rounded-full bg-yellow-500">
                <div className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-75" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-500">
                Learn &amp; Earn
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Academy:{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
                Kautilya&apos;s Courses
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-400">
              Master Web3, value investing, and AI-driven finance through
              curated micro-courses. Complete each lesson to earn virtual
              rewards credited directly to your Treasury vault.
            </p>

            {/* Badges */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-yellow-500/10 ring-1 ring-yellow-500/20 px-3.5 py-1.5">
                <div className="relative h-2 w-2 rounded-full bg-yellow-500">
                  <div className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-75" />
                </div>
                <GraduationCap size={12} className="text-yellow-400" />
                <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">
                  {courses.length} Courses Available
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 px-3.5 py-1.5">
                <Trophy size={12} className="text-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Earn Up To ₹
                  {courses
                    .reduce((s, c) => s + c.reward, 0)
                    .toLocaleString("en-IN")}
                </span>
              </div>

              {!walletAddress && (
                <div className="flex items-center gap-2 rounded-full bg-rose-500/10 ring-1 ring-rose-500/20 px-3.5 py-1.5">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                    Connect wallet to earn
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Course Grid ─────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 animate-pulse"
              >
                <div className="h-3 w-20 rounded bg-slate-800 mb-4" />
                <div className="h-5 w-full rounded bg-slate-800 mb-2" />
                <div className="h-5 w-3/4 rounded bg-slate-800 mb-6" />
                <div className="h-3 w-32 rounded bg-slate-800" />
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course, i) => {
              const style = categoryStyle[course.category] ?? fallbackStyle;
              const icon = categoryIcon[course.category] ?? (
                <BookOpen size={13} />
              );
              const state = cardState[course.id] ?? "idle";
              const isDone = state === "done";

              return (
                <div
                  key={course.id}
                  className={`group relative glass-card rounded-2xl p-6 card-hover animate-fade-in transition-premium ${
                    isDone ? "ring-1 ring-emerald-500/30" : ""
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Completion overlay */}
                  {isDone && (
                    <div className="absolute inset-0 rounded-2xl bg-emerald-500/[0.03] pointer-events-none z-0" />
                  )}

                  <div className="relative z-10">
                    {/* Top row: category badge + reward */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`flex items-center gap-1.5 rounded-full ${style.bg} ring-1 ${style.ring} px-3 py-1`}
                      >
                        <span className={style.text}>{icon}</span>
                        <span
                          className={`text-[11px] font-extrabold uppercase tracking-wider ${style.text}`}
                        >
                          {course.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 ring-1 ring-yellow-500/20 px-3 py-1">
                        <Sparkles size={11} className="text-yellow-400" />
                        <span className="text-[12px] font-extrabold text-yellow-400 font-mono">
                          +₹{course.reward.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[16px] font-bold leading-snug text-slate-200 group-hover:text-slate-50 transition-smooth mb-2">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13px] leading-relaxed text-slate-500 mb-6 line-clamp-3">
                      {course.description}
                    </p>

                    {/* CTA Button */}
                    {isDone ? (
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 px-4 py-3">
                        <CheckCircle2
                          size={18}
                          className="text-emerald-400"
                        />
                        <span className="text-[13px] font-bold text-emerald-400">
                          Lesson Completed!
                        </span>
                        <span className="ml-auto text-[11px] font-mono font-bold text-emerald-500">
                          +₹{course.reward.toLocaleString("en-IN")} credited
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleComplete(course)}
                        disabled={
                          !walletAddress || state === "completing"
                        }
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-yellow-600 px-5 py-3 font-bold text-[13px] text-white transition-premium hover:bg-yellow-500 hover:shadow-xl hover:shadow-yellow-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {state === "completing" ? (
                          <>
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                            Completing…
                          </>
                        ) : (
                          <>
                            <BookOpen size={16} />
                            Start Learning
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center">
            <GraduationCap
              size={40}
              className="mx-auto text-slate-700 mb-4"
              strokeWidth={1.2}
            />
            <p className="text-sm font-medium text-slate-500">
              No courses available. Check the backend connection.
            </p>
          </div>
        )}

        {/* ── Summary Bar ─────────────────────────── */}
        {courses.length > 0 && (
          <div className="glass-card rounded-2xl p-5 animate-fade-in delay-500">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <GraduationCap size={16} className="text-yellow-500" />
                <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Academy Progress
                </span>
              </div>
              <div className="flex items-center gap-4">
                {Object.keys(categoryStyle).map((cat) => {
                  const count = courses.filter(
                    (c) => c.category === cat
                  ).length;
                  const done = courses.filter(
                    (c) =>
                      c.category === cat && cardState[c.id] === "done"
                  ).length;
                  const s = categoryStyle[cat];
                  return (
                    <div key={cat} className="flex items-center gap-1.5">
                      <div
                        className={`h-2 w-2 rounded-full ${s.dot}`}
                      />
                      <span
                        className={`text-[12px] font-bold ${s.text}`}
                      >
                        {done}/{count}
                      </span>
                      <span className="text-[11px] text-slate-600">
                        {cat}
                      </span>
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
