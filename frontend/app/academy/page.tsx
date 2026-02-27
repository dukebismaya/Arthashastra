"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserData } from "@/hooks/useUserData";
import {
  GraduationCap,
  Trophy,
  Coins,
  Pickaxe,
  CheckCircle2,
  Shield,
  Sparkles,
  Zap,
  BookOpen,
  Brain,
  Cpu,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Star,
  CircleDot,
  XCircle,
  RotateCcw,
  Wallet,
  ChevronRight,
  Lock,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════ */

const API = process.env.NEXT_PUBLIC_API_URL ?? "";
const EXPO_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];
const SPRING_SNAP = { stiffness: 280, damping: 28 };

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface ModuleSummary {
  id: number;
  title: string;
  completed: boolean;
  score: number | null;
  total: number | null;
}

interface ModuleDetail {
  id: number;
  title: string;
  content: string;
  questions: Question[];
  completed: boolean;
  score: number | null;
  total: number | null;
}

interface CourseSummary {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  reward: number;
  xp_reward: number;
  total_modules: number;
  completed_modules: number;
  course_completed: boolean;
}

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  reward: number;
  xp_reward: number;
  modules: ModuleSummary[];
  course_completed: boolean;
}

interface SubmitResult {
  passed: boolean;
  score: number;
  total: number;
  correct_answers: number[];
  already_completed: boolean;
  course_completed: boolean;
  reward_credited: number;
  new_balance: number | null;
}

interface Progress {
  total_earned: number;
  xp_earned: number;
  courses_completed: number;
  modules_completed: number;
  completed_course_ids: number[];
  completed_module_ids: number[];
}

type View = "courses" | "course-detail" | "lesson" | "quiz" | "result";

/* ── Category & difficulty styling ─────────────────── */

const CAT_STYLE: Record<string, { bg: string; border: string; text: string; glow: string; dot: string }> = {
  "Web3": { bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)", text: "#a78bfa", glow: "rgba(139,92,246,0.15)", dot: "#8b5cf6" },
  "AI / ML": { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.25)", text: "#60a5fa", glow: "rgba(59,130,246,0.15)", dot: "#3b82f6" },
  Investing: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", text: "#34d399", glow: "rgba(16,185,129,0.15)", dot: "#10b981" },
};

const CAT_ICON: Record<string, React.ReactNode> = {
  "Web3": <Shield size={22} />,
  "AI / ML": <Brain size={22} />,
  Investing: <TrendingUp size={22} />,
};

const DIFF_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Initiate: { color: "#34d399", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
  Strategist: { color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
  Grandmaster: { color: "#fbbf24", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
};

/* ── Markdown bold renderer ────────────────────────── */

function renderContent(text: string) {
  return text.split("\n\n").map((paragraph, i) => (
    <p
      key={i}
      className="text-[14px] leading-[1.85] text-slate-400 mb-5 last:mb-0"
      dangerouslySetInnerHTML={{
        __html: paragraph.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="text-amber-400/90 font-semibold">$1</strong>'
        ),
      }}
    />
  ));
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════ */

export default function AcademyPage() {
  // ── User identity (Firebase + Web3) ──
  const { user, backendId, isAuthenticated, isLoading: authLoading } = useUserData();
  const walletAddress = backendId ?? "";
  const walletConnected = isAuthenticated;

  // ── Data ──
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [moduleDetail, setModuleDetail] = useState<ModuleDetail | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);

  // ── Navigation ──
  const [view, setView] = useState<View>("courses");
  const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);

  // ── Quiz ──
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<SubmitResult | null>(null);

  // ── Toast ──
  const [toast, setToast] = useState<{ message: string; sub: string; reward?: string; xp?: number } | null>(null);

  /* ── Fetch courses ─────────────────────────────────── */
  const fetchCourses = useCallback(async () => {
    try {
      const qs = walletAddress ? `?wallet_address=${walletAddress}` : "";
      const res = await fetch(`${API}/api/v1/academy/courses${qs}`);
      if (res.ok) setCourses(await res.json());
    } catch {
      /* silent */
    }
  }, [walletAddress]);

  /* ── Fetch progress ────────────────────────────────── */
  const fetchProgress = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const res = await fetch(`${API}/api/v1/academy/progress?wallet_address=${walletAddress}`);
      if (res.ok) setProgress(await res.json());
    } catch {
      /* silent */
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchCourses();
    fetchProgress();
  }, [fetchCourses, fetchProgress]);

  /* ── Open course detail ────────────────────────────── */
  async function openCourse(courseId: number) {
    try {
      const qs = walletAddress ? `?wallet_address=${walletAddress}` : "";
      const res = await fetch(`${API}/api/v1/academy/courses/${courseId}${qs}`);
      if (res.ok) {
        setCourseDetail(await res.json());
        setActiveCourseId(courseId);
        setView("course-detail");
      }
    } catch {
      /* silent */
    }
  }

  /* ── Open module lesson ────────────────────────────── */
  async function openModule(courseId: number, moduleId: number) {
    try {
      const qs = walletAddress ? `?wallet_address=${walletAddress}` : "";
      const res = await fetch(`${API}/api/v1/academy/courses/${courseId}/modules/${moduleId}${qs}`);
      if (res.ok) {
        setModuleDetail(await res.json());
        setActiveCourseId(courseId);
        setActiveModuleId(moduleId);
        setView("lesson");
        setAnswers({});
        setQuizResult(null);
      }
    } catch {
      /* silent */
    }
  }

  /* ── Submit quiz ───────────────────────────────────── */
  async function submitQuiz() {
    if (!moduleDetail || !activeCourseId || !walletAddress) return;
    if (Object.keys(answers).length < moduleDetail.questions.length) return;

    setSubmitting(true);
    try {
      const orderedAnswers = moduleDetail.questions.map((q) => answers[q.id] ?? -1);
      const res = await fetch(
        `${API}/api/v1/academy/courses/${activeCourseId}/modules/${moduleDetail.id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet_address: walletAddress,
            answers: orderedAnswers,
          }),
        }
      );
      if (res.ok) {
        const result: SubmitResult = await res.json();
        setQuizResult(result);
        setView("result");

        if (result.course_completed) {
          const course = courses.find((c) => c.id === activeCourseId);
          setToast({
            message: `Course Complete! +${result.reward_credited} $ARTHA`,
            sub: `${course?.title ?? "Course"} reward credited to your wallet`,
            reward: `${result.reward_credited}`,
            xp: course?.xp_reward,
          });
          setTimeout(() => setToast(null), 5000);
        } else if (result.passed && !result.already_completed) {
          setToast({
            message: "Module Passed!",
            sub: `${moduleDetail.title} — ${result.score}/${result.total} correct`,
          });
          setTimeout(() => setToast(null), 4000);
        }

        // Refresh data
        fetchCourses();
        fetchProgress();
      }
    } catch {
      /* silent */
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Navigate back ─────────────────────────────────── */
  function goBack() {
    if (view === "result" || view === "quiz") {
      if (activeCourseId) openCourse(activeCourseId);
      else setView("courses");
    } else if (view === "lesson") {
      if (activeCourseId) openCourse(activeCourseId);
      else setView("courses");
    } else if (view === "course-detail") {
      setView("courses");
      setCourseDetail(null);
    }
  }

  /* ── Computed stats ────────────────────────────────── */
  const totalEarned = progress?.total_earned ?? 0;
  const xpEarned = progress?.xp_earned ?? 0;
  const modulesCompleted = progress?.modules_completed ?? 0;
  const coursesCompleted = progress?.courses_completed ?? 0;
  const totalModules = courses.reduce((a, c) => a + c.total_modules, 0);
  const XP_MAX = 600;
  const xpPct = Math.min(((xpEarned) / XP_MAX) * 100, 100);

  const rankLabel =
    coursesCompleted >= 4 ? "Grandmaster" :
    coursesCompleted >= 2 ? "Strategist" :
    coursesCompleted >= 1 ? "Adept" : "Initiate";
  const rankLevel =
    coursesCompleted >= 4 ? 4 :
    coursesCompleted >= 2 ? 3 :
    coursesCompleted >= 1 ? 2 : 1;

  /* ══════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════ */

  return (
    <div className="relative max-w-[1400px] mx-auto space-y-8">
      {/* ── TOAST ──────────────────────────────── */}
      <AnimatePresence>
        {toast && (
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
                boxShadow: "0 0 40px rgba(16,185,129,0.18), 0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div className="relative shrink-0">
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-400 animate-ping opacity-60" />
              </div>
              <div>
                <p className="text-sm font-black text-emerald-300">{toast.message}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{toast.sub}</p>
              </div>
              {toast.xp && (
                <div className="ml-2 flex items-center gap-1 rounded-full px-3 py-1" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <Sparkles size={11} className="text-emerald-400" />
                  <span className="text-[11px] font-black text-emerald-400">+{toast.xp} XP</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SIGN-IN BANNER (if not authenticated) ──── */}
      {!walletConnected && !authLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background: "linear-gradient(145deg, rgba(15,23,42,0.85), rgba(2,6,23,0.70))",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <Wallet size={24} className="text-amber-400" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-100">Sign In to Begin</p>
                <p className="text-[13px] text-slate-500">Use the Sign In button in the navbar to connect with Google, Email, or MetaMask</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── PLAYER HEADER ────────────────────────────── */}
      {walletConnected && (
        <motion.section
          initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: EXPO_OUT }}
          className="relative overflow-hidden rounded-3xl p-8"
          style={{
            background: "linear-gradient(145deg, rgba(15,23,42,0.85), rgba(2,6,23,0.70))",
            border: "1px solid rgba(212,175,55,0.14)",
            backdropFilter: "blur(32px)",
            boxShadow: "0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="absolute -top-28 -right-28 h-64 w-64 rounded-full opacity-[0.07] blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #d4af37, transparent)" }} />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full opacity-[0.04] blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-center gap-5">
                <motion.div
                  animate={{ boxShadow: ["0 0 16px rgba(212,175,55,0.2)", "0 0 32px rgba(212,175,55,0.35)", "0 0 16px rgba(212,175,55,0.2)"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))", border: "1px solid rgba(212,175,55,0.25)" }}
                >
                  <GraduationCap size={30} className="text-amber-400" />
                  <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950">
                    {rankLevel}
                  </div>
                </motion.div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/60">Current Rank</span>
                  <h1 className="text-2xl font-black tracking-tight text-slate-50">
                    Level {rankLevel}:{" "}
                    <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)" }}>
                      {rankLabel}
                    </span>
                  </h1>
                  <p className="mt-0.5 text-[12px] text-slate-500 font-medium">
                    {user?.displayName ?? user?.email ?? (user?.walletAddress ? `${user.walletAddress.slice(0, 6)}…${user.walletAddress.slice(-4)}` : "Kautilya\u0027s Academy")}
                    {" "}&middot; Ancient Wealth Protocol
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl px-5 py-3" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
                <Trophy size={18} className="text-amber-400" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Total Earned</p>
                  <p className="text-lg font-black font-mono text-amber-400">{totalEarned.toLocaleString()} $ARTHA</p>
                </div>
              </div>
            </div>

            {/* XP bar */}
            <div className="mt-7">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Experience Points</span>
                <span className="text-[11px] font-black font-mono text-amber-400/80">{xpEarned} / {XP_MAX} XP</span>
              </div>
              <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 1.4, ease: EXPO_OUT }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #92400e, #d97706, #fbbf24, #fde68a)", boxShadow: "0 0 16px rgba(212,175,55,0.5)" }}
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Pickaxe size={13} className="text-amber-500/50" />
                <span className="text-[12px] font-bold text-slate-400">Modules: <span className="text-amber-400 font-black">{modulesCompleted}/{totalModules}</span></span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-2">
                <Coins size={13} className="text-amber-500/50" />
                <span className="text-[12px] font-bold text-slate-400">Courses: <span className="text-amber-400 font-black">{coursesCompleted}/{courses.length}</span></span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-2">
                <Star size={13} className="text-amber-500/50" />
                <span className="text-[12px] font-bold text-slate-400">XP: <span className="text-amber-400 font-black">{xpEarned}</span></span>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── BACK BUTTON (when not on courses list) ────── */}
      <AnimatePresence>
        {view !== "courses" && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={goBack}
            className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          VIEW: COURSES LIST
         ══════════════════════════════════════════════════ */}
      {view === "courses" && (
        <>
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
              Quest Board &middot; {courses.filter((c) => !c.course_completed).length} Active
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/15 to-transparent" />
            <BookOpen size={13} className="text-slate-700" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course, idx) => {
              const cat = CAT_STYLE[course.category] ?? CAT_STYLE["AI / ML"];
              const diff = DIFF_STYLE[course.difficulty] ?? DIFF_STYLE.Initiate;
              const icon = CAT_ICON[course.category] ?? <Cpu size={22} />;
              const progressPct = course.total_modules > 0 ? (course.completed_modules / course.total_modules) * 100 : 0;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.85, ease: EXPO_OUT, delay: 0.1 + idx * 0.1 }}
                  whileHover={!course.course_completed ? { y: -6, scale: 1.01 } : {}}
                  onClick={() => openCourse(course.id)}
                  className="group relative flex flex-col rounded-3xl overflow-hidden cursor-pointer"
                  style={{
                    background: "linear-gradient(160deg, rgba(15,23,42,0.80), rgba(2,6,23,0.65))",
                    border: course.course_completed ? "1px solid rgba(16,185,129,0.30)" : "1px solid rgba(30,41,59,0.80)",
                    backdropFilter: "blur(24px)",
                    boxShadow: course.course_completed
                      ? "0 4px 32px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.03)"
                      : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
                    transition: "box-shadow 0.5s ease, border-color 0.5s ease",
                  }}
                >
                  {!course.course_completed && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-3xl" style={{ boxShadow: `0 0 60px ${cat.glow}`, transition: "opacity 0.6s ease" }} />
                  )}
                  {course.course_completed && (
                    <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{ background: "linear-gradient(145deg, rgba(16,185,129,0.04), transparent)" }} />
                  )}
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: course.course_completed ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)" : `linear-gradient(90deg, transparent, ${cat.border}, transparent)` }} />

                  <div className="relative z-10 flex flex-col h-full p-7">
                    {/* Top tags */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full px-3.5 py-1.5 shrink-0" style={{ background: cat.bg, border: `1px solid ${cat.border}` }}>
                          <div className="h-1.5 w-1.5 rounded-full" style={{ background: cat.dot }} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: cat.text }}>{course.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: diff.bg, border: `1px solid ${diff.border}` }}>
                          <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: diff.color }}>{course.difficulty}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full px-4 py-1.5 shrink-0" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.22)" }}>
                        <Coins size={12} className="text-amber-400" />
                        <span className="text-[12px] font-black font-mono text-amber-400">{course.reward} $ARTHA</span>
                      </div>
                    </div>

                    {/* Icon + Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/[0.06]"
                        style={{ background: `linear-gradient(135deg, ${cat.bg}, rgba(2,6,23,0.5))`, color: cat.text, boxShadow: `0 4px 16px ${cat.glow}` }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={SPRING_SNAP}
                      >
                        {icon}
                      </motion.div>
                      <div>
                        <h3 className="text-[17px] font-black tracking-tight text-slate-100 group-hover:text-white transition-colors leading-snug">{course.title}</h3>
                        <p className="mt-0.5 text-[11px] font-bold text-slate-600">{course.total_modules} modules &middot; +{course.xp_reward} XP</p>
                      </div>
                    </div>

                    <p className="text-[13px] leading-relaxed text-slate-500 group-hover:text-slate-400 transition-colors flex-1 mb-5">{course.description}</p>

                    {/* Progress bar */}
                    <div className="mb-5">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Progress</span>
                        <span className="text-[10px] font-black text-slate-500">{course.completed_modules}/{course.total_modules}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.03)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 1, ease: EXPO_OUT }}
                          className="h-full rounded-full"
                          style={{
                            background: course.course_completed
                              ? "linear-gradient(90deg, #059669, #10b981, #34d399)"
                              : "linear-gradient(90deg, #92400e, #d97706, #fbbf24)",
                          }}
                        />
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto">
                      {course.course_completed ? (
                        <div className="flex w-full items-center gap-3 rounded-2xl px-5 py-3.5" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
                          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                          <span className="text-[13px] font-black text-emerald-400">Course Completed</span>
                          <span className="ml-auto text-[11px] font-black font-mono text-emerald-500/70">+{course.reward} $ARTHA</span>
                        </div>
                      ) : (
                        <div className="flex w-full items-center justify-center gap-2.5 rounded-2xl px-5 py-3.5" style={{
                          background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
                          border: "1px solid rgba(212,175,55,0.28)",
                        }}>
                          <Zap size={15} className="text-amber-400" />
                          <span className="text-[13px] font-black uppercase tracking-[0.1em] text-amber-400">
                            {course.completed_modules > 0 ? "Continue Learning" : "Start Learning"}
                          </span>
                          <ChevronRight size={14} className="text-amber-500/60" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Completion banner */}
          <AnimatePresence>
            {courses.length > 0 && courses.every((c) => c.course_completed) && (
              <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: EXPO_OUT }}
                className="relative overflow-hidden rounded-3xl p-10 text-center"
                style={{ background: "linear-gradient(160deg, rgba(212,175,55,0.08), rgba(2,6,23,0.80))", border: "1px solid rgba(212,175,55,0.22)", boxShadow: "0 0 80px rgba(212,175,55,0.08)" }}
              >
                <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 6, -6, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  <Trophy size={48} className="text-amber-400 mx-auto" />
                </motion.div>
                <h2 className="mt-4 text-3xl font-black text-slate-50">
                  All Quests <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)" }}>Conquered</span>
                </h2>
                <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
                  {totalEarned.toLocaleString()} $ARTHA earned. Kautilya would be proud.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ══════════════════════════════════════════════════
          VIEW: COURSE DETAIL (module list)
         ══════════════════════════════════════════════════ */}
      {view === "course-detail" && courseDetail && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
          className="space-y-6"
        >
          {/* Course header */}
          <div
            className="relative overflow-hidden rounded-3xl p-8"
            style={{
              background: "linear-gradient(145deg, rgba(15,23,42,0.85), rgba(2,6,23,0.70))",
              border: courseDetail.course_completed ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(212,175,55,0.14)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <div className="flex items-start gap-5 flex-wrap">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${(CAT_STYLE[courseDetail.category] ?? CAT_STYLE["AI / ML"]).bg}, rgba(2,6,23,0.5))`,
                  color: (CAT_STYLE[courseDetail.category] ?? CAT_STYLE["AI / ML"]).text,
                  border: `1px solid ${(CAT_STYLE[courseDetail.category] ?? CAT_STYLE["AI / ML"]).border}`,
                }}
              >
                {CAT_ICON[courseDetail.category] ?? <Cpu size={28} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full" style={{ background: (DIFF_STYLE[courseDetail.difficulty] ?? DIFF_STYLE.Initiate).bg, color: (DIFF_STYLE[courseDetail.difficulty] ?? DIFF_STYLE.Initiate).color, border: `1px solid ${(DIFF_STYLE[courseDetail.difficulty] ?? DIFF_STYLE.Initiate).border}` }}>
                    {courseDetail.difficulty}
                  </span>
                  {courseDetail.course_completed && (
                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400">
                      <CheckCircle2 size={12} /> Completed
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-slate-50 tracking-tight">{courseDetail.title}</h2>
                <p className="mt-2 text-[13px] text-slate-500 leading-relaxed">{courseDetail.description}</p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-[11px] font-bold text-slate-500">
                    <Coins size={12} className="inline text-amber-400 mr-1" />{courseDetail.reward} $ARTHA reward
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    <Star size={12} className="inline text-amber-400 mr-1" />+{courseDetail.xp_reward} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module list */}
          <div className="flex items-center gap-4">
            <div className="relative h-2 w-2 shrink-0">
              <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
              <div className="h-2 w-2 rounded-full bg-amber-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/70">
              Modules &middot; {courseDetail.modules.filter((m) => m.completed).length}/{courseDetail.modules.length} Complete
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/15 to-transparent" />
          </div>

          <div className="space-y-3">
            {courseDetail.modules.map((mod, idx) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5, ease: EXPO_OUT }}
                onClick={() => openModule(courseDetail.id, mod.id)}
                className="group flex items-center gap-5 rounded-2xl p-5 cursor-pointer transition-all duration-300"
                style={{
                  background: mod.completed
                    ? "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(2,6,23,0.4))"
                    : "linear-gradient(135deg, rgba(15,23,42,0.6), rgba(2,6,23,0.4))",
                  border: mod.completed ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(30,41,59,0.6)",
                }}
              >
                {/* Number / check */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[13px] font-black"
                  style={mod.completed
                    ? { background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }
                    : { background: "rgba(212,175,55,0.08)", color: "#fbbf24", border: "1px solid rgba(212,175,55,0.15)" }
                  }
                >
                  {mod.completed ? <CheckCircle2 size={18} /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-black text-slate-200 group-hover:text-white transition-colors">{mod.title}</p>
                  {mod.completed && mod.score !== null && (
                    <p className="text-[11px] text-emerald-500/70 font-bold mt-0.5">Score: {mod.score}/{mod.total} correct</p>
                  )}
                </div>

                {mod.completed ? (
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.15em]">Passed</span>
                ) : (
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-amber-400 transition-colors" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════
          VIEW: LESSON
         ══════════════════════════════════════════════════ */}
      {view === "lesson" && moduleDetail && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
          className="space-y-6"
        >
          <div
            className="relative overflow-hidden rounded-3xl p-8"
            style={{
              background: "linear-gradient(145deg, rgba(15,23,42,0.85), rgba(2,6,23,0.70))",
              border: "1px solid rgba(212,175,55,0.14)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={18} className="text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/70">Lesson</span>
              {moduleDetail.completed && (
                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 ml-2">
                  <CheckCircle2 size={12} /> Already completed
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-50 tracking-tight mb-8">{moduleDetail.title}</h2>
            <div>{renderContent(moduleDetail.content)}</div>
          </div>

          {/* Take Quiz button */}
          {!moduleDetail.completed ? (
            <motion.button
              onClick={() => { setView("quiz"); setAnswers({}); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 rounded-2xl px-6 py-4"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
                border: "1px solid rgba(212,175,55,0.28)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
            >
              {!walletConnected && <Lock size={16} className="text-slate-500" />}
              <span className="text-[14px] font-black uppercase tracking-[0.1em]" style={{ color: walletConnected ? "#fbbf24" : "#475569" }}>
                {walletConnected ? "Take the Quiz" : "Connect Wallet to Take Quiz"}
              </span>
              {walletConnected && <ArrowRight size={16} className="text-amber-400" />}
            </motion.button>
          ) : (
            <div className="flex w-full items-center gap-3 rounded-2xl px-6 py-4" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-[14px] font-black text-emerald-400">Module Already Completed — {moduleDetail.score}/{moduleDetail.total} correct</span>
            </div>
          )}
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════
          VIEW: QUIZ
         ══════════════════════════════════════════════════ */}
      {view === "quiz" && moduleDetail && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Cpu size={16} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/70">
              Quiz — {moduleDetail.title}
            </span>
            <span className="text-[10px] text-slate-600 font-bold ml-auto">
              {Object.keys(answers).length}/{moduleDetail.questions.length} answered
            </span>
          </div>

          <div className="text-[12px] text-slate-500 px-1 -mt-3">
            Answer all questions. You need at least <strong className="text-amber-400">2 out of 3</strong> correct to pass.
          </div>

          {moduleDetail.questions.map((q, qIdx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIdx * 0.1, duration: 0.5, ease: EXPO_OUT }}
              className="rounded-2xl p-6"
              style={{ background: "linear-gradient(145deg, rgba(15,23,42,0.7), rgba(2,6,23,0.5))", border: "1px solid rgba(30,41,59,0.6)" }}
            >
              <p className="text-[14px] font-black text-slate-200 mb-4">
                <span className="text-amber-400 mr-2">Q{qIdx + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === optIdx;
                  return (
                    <motion.button
                      key={optIdx}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200"
                      style={{
                        background: isSelected ? "rgba(212,175,55,0.1)" : "rgba(15,23,42,0.4)",
                        border: isSelected ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(30,41,59,0.5)",
                      }}
                    >
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black"
                        style={isSelected
                          ? { background: "rgba(212,175,55,0.2)", color: "#fbbf24", border: "1px solid rgba(212,175,55,0.4)" }
                          : { background: "rgba(30,41,59,0.5)", color: "#64748b", border: "1px solid rgba(30,41,59,0.8)" }
                        }
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-[13px] font-medium" style={{ color: isSelected ? "#fbbf24" : "#94a3b8" }}>{opt}</span>
                      {isSelected && <CircleDot size={14} className="text-amber-400 ml-auto shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Submit button */}
          <motion.button
            onClick={submitQuiz}
            disabled={Object.keys(answers).length < moduleDetail.questions.length || submitting || !walletConnected}
            whileHover={Object.keys(answers).length === moduleDetail.questions.length ? { scale: 1.02 } : {}}
            whileTap={Object.keys(answers).length === moduleDetail.questions.length ? { scale: 0.98 } : {}}
            className="w-full flex items-center justify-center gap-3 rounded-2xl px-6 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: Object.keys(answers).length === moduleDetail.questions.length
                ? "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.06))"
                : "rgba(30,41,59,0.5)",
              border: Object.keys(answers).length === moduleDetail.questions.length
                ? "1px solid rgba(212,175,55,0.35)"
                : "1px solid rgba(30,41,59,0.6)",
            }}
          >
            {submitting ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Pickaxe size={16} className="text-amber-400" />
                </motion.div>
                <span className="text-[13px] font-black text-amber-400">Validating...</span>
              </>
            ) : (
              <>
                <Zap size={16} className="text-amber-400" />
                <span className="text-[14px] font-black uppercase tracking-[0.1em] text-amber-400">Submit Answers</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════
          VIEW: RESULT
         ══════════════════════════════════════════════════ */}
      {view === "result" && quizResult && moduleDetail && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
          className="space-y-6"
        >
          {/* Score card */}
          <div
            className="relative overflow-hidden rounded-3xl p-8 text-center"
            style={{
              background: quizResult.passed
                ? "linear-gradient(145deg, rgba(16,185,129,0.08), rgba(2,6,23,0.70))"
                : "linear-gradient(145deg, rgba(239,68,68,0.06), rgba(2,6,23,0.70))",
              border: quizResult.passed ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(239,68,68,0.2)",
              boxShadow: quizResult.passed ? "0 0 40px rgba(16,185,129,0.08)" : "0 0 40px rgba(239,68,68,0.05)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: quizResult.passed ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)" : "linear-gradient(90deg, transparent, rgba(239,68,68,0.3), transparent)" }} />

            {quizResult.passed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              >
                <CheckCircle2 size={56} className="text-emerald-400 mx-auto" />
              </motion.div>
            ) : (
              <XCircle size={56} className="text-red-400 mx-auto" />
            )}

            <h2 className="mt-4 text-3xl font-black text-slate-50">
              {quizResult.already_completed
                ? "Already Completed!"
                : quizResult.passed
                ? "Module Passed!"
                : "Not Quite..."}
            </h2>

            <div className="mt-4 flex items-center justify-center gap-8">
              <div>
                <p className="text-4xl font-black font-mono" style={{ color: quizResult.passed ? "#34d399" : "#f87171" }}>
                  {quizResult.score}/{quizResult.total}
                </p>
                <p className="text-[11px] text-slate-500 font-bold mt-1">Correct Answers</p>
              </div>
              <div className="h-12 w-px bg-slate-800" />
              <div>
                <p className="text-4xl font-black font-mono" style={{ color: quizResult.passed ? "#34d399" : "#f87171" }}>
                  {quizResult.passed ? "PASS" : "FAIL"}
                </p>
                <p className="text-[11px] text-slate-500 font-bold mt-1">Threshold: 2/3</p>
              </div>
            </div>

            {/* Course completion celebration */}
            {quizResult.course_completed && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-6 flex items-center justify-center gap-3 rounded-2xl mx-auto max-w-md px-6 py-4"
                style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)" }}
              >
                <Sparkles size={18} className="text-amber-400" />
                <div className="text-left">
                  <p className="text-[13px] font-black text-amber-400">Course Complete! +{quizResult.reward_credited} $ARTHA</p>
                  <p className="text-[11px] text-slate-500">Reward credited to your wallet</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Answer review */}
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={14} className="text-slate-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Answer Review</span>
          </div>

          {moduleDetail.questions.map((q, qIdx) => {
            const userAnswer = answers[q.id];
            const correctAnswer = quizResult.correct_answers[qIdx];
            const isCorrect = userAnswer === correctAnswer;

            return (
              <div
                key={q.id}
                className="rounded-2xl p-5"
                style={{
                  background: "linear-gradient(145deg, rgba(15,23,42,0.7), rgba(2,6,23,0.5))",
                  border: isCorrect ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(239,68,68,0.15)",
                }}
              >
                <div className="flex items-start gap-2 mb-3">
                  {isCorrect
                    ? <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    : <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                  }
                  <p className="text-[13px] font-bold text-slate-300">{q.question}</p>
                </div>
                <div className="space-y-1.5 ml-6">
                  {q.options.map((opt, optIdx) => {
                    const isUserPick = optIdx === userAnswer;
                    const isCorrectOpt = optIdx === correctAnswer;
                    let bg = "transparent";
                    let textColor = "#64748b";
                    let borderColor = "transparent";

                    if (isCorrectOpt) {
                      bg = "rgba(16,185,129,0.08)";
                      textColor = "#34d399";
                      borderColor = "rgba(16,185,129,0.2)";
                    } else if (isUserPick && !isCorrect) {
                      bg = "rgba(239,68,68,0.06)";
                      textColor = "#f87171";
                      borderColor = "rgba(239,68,68,0.15)";
                    }

                    return (
                      <div
                        key={optIdx}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium"
                        style={{ background: bg, color: textColor, border: `1px solid ${borderColor}` }}
                      >
                        <span className="font-black w-5">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                        {isCorrectOpt && <CheckCircle2 size={12} className="ml-auto text-emerald-400" />}
                        {isUserPick && !isCorrect && <XCircle size={12} className="ml-auto text-red-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Action buttons */}
          <div className="flex gap-3">
            {!quizResult.passed && !quizResult.already_completed && (
              <motion.button
                onClick={() => { setAnswers({}); setQuizResult(null); setView("quiz"); }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-6 py-4"
                style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))", border: "1px solid rgba(212,175,55,0.28)" }}
              >
                <RotateCcw size={15} className="text-amber-400" />
                <span className="text-[13px] font-black uppercase tracking-[0.1em] text-amber-400">Retry Quiz</span>
              </motion.button>
            )}
            <motion.button
              onClick={() => { if (activeCourseId) openCourse(activeCourseId); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl px-6 py-4"
              style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(30,41,59,0.6)" }}
            >
              <ArrowLeft size={15} className="text-slate-400" />
              <span className="text-[13px] font-black uppercase tracking-[0.1em] text-slate-400">Back to Course</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
