"use client";

import { Search, Bell, User, Command, Globe, Wallet } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [searchFocused, setSearchFocused] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState("");

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

    async function connectWallet() {
        if (typeof window !== "undefined" && (window as any).ethereum) {
            try {
                const accounts: string[] = await (window as any).ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0]);
            } catch {
                /* wallet connection rejected */
            }
        } else {
            alert("MetaMask not detected. Please install the MetaMask extension to connect your wallet.");
        }
    }

    return (
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

                {/* Profile */}
                <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-800/40 hover:text-slate-300 transition-premium">
                    <User size={15} strokeWidth={1.8} />
                </button>

                {/* Divider */}
                <div className="mx-1 h-6 w-px bg-gradient-to-b from-transparent via-slate-800 to-transparent" />

                {/* Connect Wallet — Native MetaMask */}
                <button
                    onClick={connectWallet}
                    className={`group flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-bold transition-premium ${
                        walletAddress
                            ? "border border-amber-500/40 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10"
                            : "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-400 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
                    }`}
                >
                    <Wallet size={13} className={walletAddress ? "text-amber-500" : "text-amber-500/70 group-hover:text-amber-400"} />
                    {walletAddress
                        ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
                        : "Connect Wallet"}
                </button>
            </div>
        </header>
    );
}
