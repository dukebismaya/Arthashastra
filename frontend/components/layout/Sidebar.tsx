"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    GraduationCap,
    Swords,
    Newspaper,
    Landmark,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Crown,
} from "lucide-react";
import { useState } from "react";
import BookLogo from "@/components/ui/BookLogo";

const navItems = [
    {
        label: "Home",
        href: "/",
        icon: Home,
        description: "Command Center",
    },
    {
        label: "Academy",
        href: "/academy",
        icon: GraduationCap,
        description: "Finance Learning",
    },
    {
        label: "War Room",
        href: "/war-room",
        icon: Swords,
        description: "Prediction Arena",
    },
    {
        label: "Market Intel",
        href: "/market-intel",
        icon: Newspaper,
        description: "News Analysis",
    },
    {
        label: "Community",
        href: "/community",
        icon: MessageSquare,
        description: "Trading Floor",
    },
    {
        label: "Treasury",
        href: "/treasury",
        icon: Landmark,
        description: "Portfolio Tracker",
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-slate-950/[0.97] backdrop-blur-2xl transition-all duration-500 ease-out ${collapsed ? "w-[68px]" : "w-[260px]"
                }`}
        >
            {/* Sidebar right border — elegant gradient */}
            <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-amber-500/20 via-slate-800/30 to-amber-500/10" />

            {/* ── Logo ────────────────────────────────── */}
            <div className={`flex h-[56px] items-center gap-3 ${collapsed ? "justify-center px-2" : "px-5"}`}>
                <div className="relative shrink-0">
                    <BookLogo size={collapsed ? 32 : 36} />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden min-w-0">
                        <h1 className="flex items-center gap-1.5 text-[14px] font-extrabold tracking-wide bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                            Arthashastra
                        </h1>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-700 truncate">
                            Strategic Intelligence
                        </p>
                    </div>
                )}
            </div>

            {/* ── Separator ───────────────────────────── */}
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-800/50 to-transparent" />

            {/* ── Section Label ───────────────────────── */}
            {!collapsed && (
                <div className="px-5 pt-5 pb-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-700">
                        Navigation
                    </span>
                </div>
            )}

            {/* ── Navigation ──────────────────────────── */}
            <nav className={`flex-1 space-y-0.5 overflow-y-auto ${collapsed ? "px-2 py-3" : "px-3 py-2"}`}>
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 ${isActive
                                    ? "bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400"
                                    : "text-slate-500 hover:bg-slate-800/30 hover:text-slate-300"
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            {/* Active left indicator */}
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] rounded-full bg-gradient-to-b from-amber-400 to-yellow-600 shadow-sm shadow-amber-500/30" />
                            )}

                            <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${isActive
                                    ? "bg-amber-500/10"
                                    : "group-hover:bg-slate-800/40"
                                }`}>
                                <Icon
                                    size={16}
                                    className={`transition-all duration-300 ${isActive ? "text-amber-400" : "text-slate-600 group-hover:text-slate-400"
                                        }`}
                                    strokeWidth={isActive ? 2.2 : 1.8}
                                />
                            </div>

                            {!collapsed && (
                                <div className="overflow-hidden min-w-0">
                                    <span className={`block text-[12px] font-bold leading-tight truncate transition-colors ${isActive ? "text-amber-400" : ""
                                        }`}>
                                        {item.label}
                                    </span>
                                    <span className={`block text-[9px] font-medium leading-tight truncate transition-colors ${isActive ? "text-amber-500/40" : "text-slate-700 group-hover:text-slate-600"
                                        }`}>
                                        {item.description}
                                    </span>
                                </div>
                            )}

                            {/* Hover glow for active item */}
                            {isActive && !collapsed && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-amber-500/50 animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Bottom Section ──────────────────────── */}
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-800/50 to-transparent" />

            {/* Pro Badge */}
            {!collapsed && (
                <div className="px-3 py-3">
                    <div className="relative rounded-lg border border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-transparent p-3 overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 shimmer" />
                        <div className="relative flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/5">
                                <Crown size={13} className="text-amber-500" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-300">Arthashastra Pro</p>
                                <p className="text-[9px] text-slate-600 font-medium">Upgrade for full access</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Collapse Toggle */}
            <div className="p-2.5">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex w-full items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-800/30 hover:text-slate-400 transition-all duration-300"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>
        </aside>
    );
}
