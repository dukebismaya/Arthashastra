"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    GraduationCap,
    Swords,
    Newspaper,
    Landmark,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from "lucide-react";
import { useState } from "react";

const navItems = [
    {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        description: "Command Center",
    },
    {
        label: "Academy",
        href: "/academy",
        icon: GraduationCap,
        description: "Finance Learning & Assessment",
    },
    {
        label: "War Room",
        href: "/war-room",
        icon: Swords,
        description: "Stock Prediction Playground",
    },
    {
        label: "Market Intel",
        href: "/market-intel",
        icon: Newspaper,
        description: "Live News Analysis",
    },
    {
        label: "Treasury",
        href: "/treasury",
        icon: Landmark,
        description: "Portfolio Analyzer",
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-slate-950/95 backdrop-blur-xl transition-all duration-500 ease-out ${collapsed ? "w-[72px]" : "w-[260px]"
                }`}
        >
            {/* Sidebar right border — subtle gradient */}
            <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-yellow-500/20 via-slate-800 to-yellow-500/10" />

            {/* ── Logo ────────────────────────────────── */}
            <div className="flex h-[72px] items-center gap-3 px-5">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 shadow-lg shadow-yellow-500/20">
                    <span className="text-lg font-black text-slate-950">A</span>
                    {/* Animated glow ring */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-40 blur-md animate-pulse" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="flex items-center gap-1.5 text-[15px] font-bold tracking-wide text-yellow-500 gold-text-glow">
                            Arthashastra
                            <Sparkles size={12} className="text-yellow-500/60 animate-pulse" />
                        </h1>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
                            Financial Intelligence
                        </p>
                    </div>
                )}
            </div>

            {/* ── Separator ───────────────────────────── */}
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

            {/* ── Section Label ───────────────────────── */}
            {!collapsed && (
                <div className="px-5 pt-5 pb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">
                        Navigation
                    </span>
                </div>
            )}

            {/* ── Navigation ──────────────────────────── */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-premium ${isActive
                                    ? "bg-gradient-to-r from-yellow-500/10 to-transparent text-yellow-500"
                                    : "text-slate-500 hover:bg-slate-800/40 hover:text-slate-300"
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            {/* Active left indicator — animated gradient bar */}
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[3px] rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-md shadow-yellow-500/30" />
                            )}

                            <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-premium ${isActive
                                    ? "bg-yellow-500/15 shadow-inner"
                                    : "bg-slate-800/0 group-hover:bg-slate-800/50"
                                }`}>
                                <Icon
                                    size={18}
                                    className={`transition-premium ${isActive ? "text-yellow-500" : "text-slate-600 group-hover:text-slate-400"
                                        }`}
                                    strokeWidth={isActive ? 2.2 : 1.8}
                                />
                            </div>

                            {!collapsed && (
                                <div className="overflow-hidden min-w-0">
                                    <span className={`block text-[13px] font-semibold leading-tight truncate transition-premium ${isActive ? "text-yellow-500" : ""
                                        }`}>
                                        {item.label}
                                    </span>
                                    <span className={`block text-[10px] leading-tight truncate transition-premium ${isActive ? "text-yellow-500/50" : "text-slate-700 group-hover:text-slate-600"
                                        }`}>
                                        {item.description}
                                    </span>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Bottom Section ──────────────────────── */}
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

            {/* Pro Badge */}
            {!collapsed && (
                <div className="px-4 py-3">
                    <div className="gradient-border rounded-xl p-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/10">
                                <Sparkles size={14} className="text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-300">Arthashastra Pro</p>
                                <p className="text-[9px] text-slate-600">Upgrade for full access</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Collapse Toggle */}
            <div className="p-3">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex w-full items-center justify-center rounded-xl p-2.5 text-slate-600 hover:bg-slate-800/40 hover:text-slate-400 transition-premium"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>
        </aside>
    );
}
