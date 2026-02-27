"use client";

import { Search, Bell, User, Command, Globe, Wallet, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthModal, { type AuthUser } from "@/components/auth/AuthModal";

export default function Navbar() {
    const [searchFocused, setSearchFocused] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    // ── Auth state ──
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ── Clock ──
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                })
            );
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    // ── Firebase auth listener ──
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    type: "firebase",
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    walletAddress: null,
                    uid: firebaseUser.uid,
                    photoURL: firebaseUser.photoURL,
                });
            } else {
                // Only clear if current user is a Firebase user
                setUser((prev) => (prev?.type === "firebase" ? null : prev));
            }
        });
        return () => unsubscribe();
    }, []);

    // ── Close dropdown on outside click ──
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // ── Auth success callback ──
    function handleAuthSuccess(authUser: AuthUser) {
        setUser(authUser);
        // Sync Web3 user with backend if wallet-based
        if (authUser.type === "web3" && authUser.walletAddress) {
            const API = process.env.NEXT_PUBLIC_API_URL ?? "";
            fetch(`${API}/api/v1/user/${authUser.walletAddress}`).catch(() => {});
        }
    }

    // ── Sign out ──
    async function handleSignOut() {
        setDropdownOpen(false);
        if (user?.type === "firebase") {
            await signOut(auth);
        }
        setUser(null);
    }

    // ── Display helpers ──
    const displayLabel = user
        ? user.type === "web3" && user.walletAddress
            ? `${user.walletAddress.slice(0, 6)}…${user.walletAddress.slice(-4)}`
            : user.email
                ? user.email.length > 20
                    ? user.email.slice(0, 18) + "…"
                    : user.email
                : user.displayName ?? "User"
        : null;

    const avatarLetter = user
        ? user.type === "web3"
            ? "W"
            : (user.displayName?.[0] ?? user.email?.[0] ?? "U").toUpperCase()
        : null;

    return (
        <>
            <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between gap-6 border-b border-slate-800/40 px-6 bg-slate-950/80 backdrop-blur-2xl">
                {/* Subtle top highlight line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />
                {/* Bottom shimmer */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />

                {/* ── Search Bar ──────────────────────────── */}
                <div className="relative flex-1 max-w-md">
                    <Search
                        size={14}
                        className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-premium ${searchFocused ? "text-amber-500" : "text-slate-600"
                            }`}
                    />
                    <input
                        type="text"
                        placeholder="Search markets, assets, news…"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className={`w-full rounded-lg py-2 pl-9 pr-20 text-[12px] text-slate-200 placeholder-slate-600 outline-none transition-premium ${searchFocused
                                ? "bg-slate-800/60 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/5"
                                : "bg-slate-800/20 ring-1 ring-slate-800/50 hover:ring-slate-700 hover:bg-slate-800/40"
                            }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <kbd className="flex items-center gap-0.5 rounded border border-slate-700/40 bg-slate-800/60 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                            <Command size={9} /> K
                        </kbd>
                    </div>
                </div>

                {/* ── Right Actions ───────────────────────── */}
                <div className="flex items-center gap-2">
                    {/* Live Clock */}
                    <div className="hidden lg:flex items-center gap-2 rounded-lg bg-slate-800/20 border border-slate-800/30 px-3 py-1.5 mr-1">
                        <span className="text-[11px] font-mono font-medium text-slate-500 tabular-nums">{currentTime}</span>
                    </div>

                    {/* Live Market Indicator */}
                    <div className="hidden md:flex items-center gap-2 rounded-lg bg-slate-800/20 border border-slate-800/30 px-3 py-1.5 mr-1">
                        <div className="relative flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500">
                                <div className="absolute h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-500">Markets Open</span>
                        </div>
                        <div className="h-3 w-px bg-slate-700/30" />
                        <div className="flex items-center gap-1">
                            <Globe size={10} className="text-slate-600" />
                            <span className="text-[10px] text-slate-600 font-medium">NYSE</span>
                        </div>
                    </div>

                    {/* Notifications */}
                    <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-800/40 hover:text-slate-300 transition-premium">
                        <Bell size={15} strokeWidth={1.8} />
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-slate-950">
                            <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-75" />
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="mx-1 h-6 w-px bg-gradient-to-b from-transparent via-slate-800 to-transparent" />

                    {/* ── Auth Button / User Info ─────────────── */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="group flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all duration-200 border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/45"
                            >
                                {/* Avatar */}
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt=""
                                        className="h-6 w-6 rounded-full ring-1 ring-amber-500/30"
                                    />
                                ) : (
                                    <div
                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black"
                                        style={{
                                            background: user.type === "web3"
                                                ? "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(109,40,217,0.15))"
                                                : "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(180,140,30,0.15))",
                                            color: user.type === "web3" ? "#a78bfa" : "#fbbf24",
                                            border: user.type === "web3"
                                                ? "1px solid rgba(139,92,246,0.3)"
                                                : "1px solid rgba(212,175,55,0.3)",
                                        }}
                                    >
                                        {avatarLetter}
                                    </div>
                                )}

                                <span className="text-amber-400 max-w-[140px] truncate">
                                    {displayLabel}
                                </span>

                                {user.type === "web3" && (
                                    <Wallet size={11} className="text-violet-400 shrink-0" />
                                )}

                                <ChevronDown
                                    size={12}
                                    className={`text-slate-600 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl py-1 z-50"
                                    style={{
                                        background: "linear-gradient(160deg, rgba(15,23,42,0.97), rgba(2,6,23,0.95))",
                                        border: "1px solid rgba(51,65,85,0.5)",
                                        backdropFilter: "blur(24px)",
                                        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                                    }}
                                >
                                    {/* User info */}
                                    <div className="border-b border-slate-800/60 px-4 py-3">
                                        <p className="text-[11px] font-bold text-slate-400 truncate">
                                            {user.displayName ?? user.email ?? user.walletAddress}
                                        </p>
                                        <p className="text-[10px] text-slate-600 mt-0.5">
                                            {user.type === "firebase" ? "Firebase Auth" : "Web3 Wallet"}
                                        </p>
                                    </div>

                                    {/* Sign Out */}
                                    <button
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
                                    >
                                        <LogOut size={13} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="group flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-bold transition-all duration-300 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-400 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
                        >
                            <User size={13} className="text-amber-500/70 group-hover:text-amber-400" />
                            Sign In
                        </button>
                    )}
                </div>
            </header>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={handleAuthSuccess}
            />
        </>
    );
}
