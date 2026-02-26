"use client";

import { Search, Wallet, Bell, User, Command, Globe } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between gap-6 border-b border-slate-800/50 px-6 glass-strong">
            {/* Subtle top highlight line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />

            {/* ── Search Bar ──────────────────────────── */}
            <div className="relative flex-1 max-w-lg">
                <Search
                    size={15}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-premium ${searchFocused ? "text-yellow-500" : "text-slate-600"
                        }`}
                />
                <input
                    type="text"
                    placeholder="Search markets, assets, news…"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`w-full rounded-xl py-2.5 pl-10 pr-20 text-[13px] text-slate-200 placeholder-slate-600 outline-none transition-premium ${searchFocused
                            ? "bg-slate-800/70 ring-1 ring-yellow-500/30 shadow-lg shadow-yellow-500/5"
                            : "bg-slate-800/30 ring-1 ring-slate-800 hover:ring-slate-700 hover:bg-slate-800/50"
                        }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <kbd className="flex items-center gap-0.5 rounded-md border border-slate-700/50 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        <Command size={10} /> K
                    </kbd>
                </div>
            </div>

            {/* ── Right Actions ───────────────────────── */}
            <div className="flex items-center gap-1.5">
                {/* Live Market Indicator */}
                <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-800/30 px-3 py-2 mr-2">
                    <div className="relative flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500">
                            <div className="absolute h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <span className="text-[11px] font-medium text-emerald-500">Markets Open</span>
                    </div>
                    <div className="h-3 w-px bg-slate-700/50" />
                    <div className="flex items-center gap-1">
                        <Globe size={12} className="text-slate-600" />
                        <span className="text-[11px] text-slate-500">NYSE</span>
                    </div>
                </div>

                {/* Notifications */}
                <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 transition-premium">
                    <Bell size={17} strokeWidth={1.8} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-yellow-500 ring-2 ring-slate-950">
                        <span className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-75" />
                    </span>
                </button>

                {/* Profile */}
                <button className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 transition-premium">
                    <User size={17} strokeWidth={1.8} />
                </button>

                {/* Divider */}
                <div className="mx-1 h-7 w-px bg-gradient-to-b from-transparent via-slate-700/50 to-transparent" />

                {/* Connect Wallet — Premium CTA */}
                <button className="btn-gold flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold">
                    <Wallet size={15} />
                    <span>Connect Wallet</span>
                </button>
            </div>
        </header>
    );
}
