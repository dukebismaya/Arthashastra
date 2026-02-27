"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Wallet,
  X,
  Chrome,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

/* ── Types ─────────────────────────────────────────────── */

export interface AuthUser {
  type: "firebase" | "web3";
  displayName: string | null;
  email: string | null;
  walletAddress: string | null;
  uid: string;
  photoURL: string | null;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

/* ── Constants ─────────────────────────────────────────── */

const EXPO_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const MODAL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.92, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.95, y: 16, filter: "blur(4px)" },
};

/* ══════════════════════════════════════════════════════════
   AUTH MODAL COMPONENT
   ══════════════════════════════════════════════════════════ */

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<"email" | "google" | "web3" | null>(null);

  /* ── Reset state on close ────────────────────────────── */
  function handleClose() {
    setEmail("");
    setPassword("");
    setError("");
    setIsLoading(false);
    setLoadingMethod(null);
    setIsRegistering(false);
    onClose();
  }

  /* ── Firebase Email/Password ─────────────────────────── */
  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setLoadingMethod("email");

    try {
      const authFn = isRegistering
        ? createUserWithEmailAndPassword
        : signInWithEmailAndPassword;

      const result = await authFn(auth, email, password);
      const u = result.user;

      onSuccess({
        type: "firebase",
        displayName: u.displayName,
        email: u.email,
        walletAddress: null,
        uid: u.uid,
        photoURL: u.photoURL,
      });
      handleClose();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      const messages: Record<string, string> = {
        "auth/invalid-credential": "Invalid email or password.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
      };
      setError(messages[code] || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingMethod(null);
    }
  }

  /* ── Google Sign In ──────────────────────────────────── */
  async function handleGoogleAuth() {
    setError("");
    setIsLoading(true);
    setLoadingMethod("google");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;

      onSuccess({
        type: "firebase",
        displayName: u.displayName,
        email: u.email,
        walletAddress: null,
        uid: u.uid,
        photoURL: u.photoURL,
      });
      handleClose();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setLoadingMethod(null);
    }
  }

  /* ── Web3 Wallet Connect ─────────────────────────────── */
  async function handleWeb3Connect() {
    setError("");
    setIsLoading(true);
    setLoadingMethod("web3");

    try {
      if (
        typeof window === "undefined" ||
        !(window as unknown as { ethereum?: { request: (a: { method: string }) => Promise<string[]> } }).ethereum
      ) {
        setError("MetaMask not detected. Please install the MetaMask extension.");
        return;
      }

      const eth = (window as unknown as { ethereum: { request: (a: { method: string }) => Promise<string[]> } }).ethereum;
      const accounts = await eth.request({ method: "eth_requestAccounts" });

      if (accounts[0]) {
        onSuccess({
          type: "web3",
          displayName: null,
          email: null,
          walletAddress: accounts[0],
          uid: accounts[0],
          photoURL: null,
        });
        handleClose();
      }
    } catch {
      setError("Wallet connection was rejected or failed.");
    } finally {
      setIsLoading(false);
      setLoadingMethod(null);
    }
  }

  /* ══════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════ */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          variants={OVERLAY_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[420px] overflow-hidden rounded-3xl"
            variants={MODAL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5, ease: EXPO_OUT }}
            style={{
              background: "linear-gradient(160deg, rgba(15,23,42,0.95), rgba(2,6,23,0.92))",
              border: "1px solid rgba(212,175,55,0.20)",
              backdropFilter: "blur(40px)",
              boxShadow:
                "0 0 80px rgba(212,175,55,0.08), 0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Top glow line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            {/* Ambient orbs */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-[0.06] blur-3xl pointer-events-none bg-amber-500" />
            <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full opacity-[0.04] blur-3xl pointer-events-none bg-violet-500" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 rounded-lg p-1.5 text-slate-600 hover:text-slate-300 hover:bg-slate-800/40 transition-all duration-200"
            >
              <X size={16} />
            </button>

            <div className="relative z-10 p-8">
              {/* Header */}
              <div className="mb-7 text-center">
                <motion.div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 12px rgba(212,175,55,0.15)",
                      "0 0 24px rgba(212,175,55,0.3)",
                      "0 0 12px rgba(212,175,55,0.15)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ShieldCheck size={22} className="text-amber-400" />
                </motion.div>
                <h2 className="text-xl font-black tracking-tight text-slate-50">
                  {isRegistering ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="mt-1 text-[12px] text-slate-500">
                  {isRegistering
                    ? "Join Kautilya's inner circle"
                    : "Sign in to your Arthashastra account"}
                </p>
              </div>

              {/* ── Error ──────────────────────────────── */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex items-start gap-2.5 overflow-hidden rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-400" />
                    <p className="text-[12px] font-medium text-red-400 leading-relaxed">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Firebase Auth Section ──────────────── */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                {/* Email */}
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-[13px] text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 bg-slate-800/30 ring-1 ring-slate-700/50 focus:ring-amber-500/40 focus:bg-slate-800/50 focus:shadow-lg focus:shadow-amber-500/5"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-[13px] text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 bg-slate-800/30 ring-1 ring-slate-700/50 focus:ring-amber-500/40 focus:bg-slate-800/50 focus:shadow-lg focus:shadow-amber-500/5"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.01 } : {}}
                  whileTap={!isLoading ? { scale: 0.99 } : {}}
                  className="relative w-full overflow-hidden rounded-xl py-3 text-[13px] font-black uppercase tracking-[0.1em] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.20), rgba(180,140,30,0.12))",
                    border: "1px solid rgba(212,175,55,0.35)",
                    color: "#fbbf24",
                    boxShadow: "0 4px 20px rgba(212,175,55,0.10)",
                  }}
                >
                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loadingMethod === "email" ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    {isRegistering ? "Create Account" : "Sign In"}
                  </span>
                </motion.button>
              </form>

              {/* Toggle register/login */}
              <p className="mt-4 text-center text-[11px] text-slate-600">
                {isRegistering ? "Already have an account?" : "Need an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError("");
                  }}
                  className="font-bold text-amber-500/80 hover:text-amber-400 transition-colors"
                >
                  {isRegistering ? "Sign In" : "Register"}
                </button>
              </p>

              {/* Google */}
              <motion.button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.01 } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
                className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-[12px] font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                style={{
                  background: "rgba(30,41,59,0.4)",
                  border: "1px solid rgba(51,65,85,0.5)",
                  color: "#94a3b8",
                }}
              >
                {loadingMethod === "google" ? (
                  <Loader2 size={14} className="animate-spin text-slate-400" />
                ) : (
                  <Chrome size={14} className="text-slate-400" />
                )}
                Continue with Google
              </motion.button>

              {/* ── Divider ────────────────────────────── */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700/40" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
                  or
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700/40" />
              </div>

              {/* ── Web3 Section ───────────────────────── */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400/70">
                    Web3 Native (Bonus)
                  </span>
                </div>

                <motion.button
                  onClick={handleWeb3Connect}
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.01 } : {}}
                  whileTap={!isLoading ? { scale: 0.99 } : {}}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-[12px] font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, rgba(139,92,246,0.10), rgba(109,40,217,0.06))",
                    border: "1px solid rgba(139,92,246,0.25)",
                    color: "#a78bfa",
                  }}
                >
                  {loadingMethod === "web3" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Wallet size={14} />
                  )}
                  Connect Web3 Wallet
                </motion.button>

                <p className="mt-2 text-center text-[10px] text-slate-700">
                  Requires MetaMask or compatible browser wallet
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
