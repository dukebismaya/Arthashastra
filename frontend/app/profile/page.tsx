"use client";

import { useEffect, useState } from "react";
import { User, Wallet, Trophy, TrendingUp, Layers, History } from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
    amount: number;
    type: string;
    description: string;
    date: string;
}

interface PortfolioInsights {
    win_rate: number;
    reputation_score: number;
    net_worth: number;
    asset_allocation: { [key: string]: number };
}

interface UserAnalytics {
    id: number;
    wallet_address: string;
    portfolio_balance: number;
    total_xp: number;
    courses_completed: number;
    predictions_made: number;
    portfolio_history: Transaction[];
    insights: PortfolioInsights;
}

export default function ProfilePage() {
    const [userData, setUserData] = useState<UserAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch Wallet
    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window !== "undefined" && (window as any).ethereum) {
                try {
                    const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
                    if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                    } else {
                        setLoading(false); // No wallet connected, stop loading
                    }
                } catch (err) {
                    console.error("Error checking wallet connection:", err);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        checkConnection();
    }, []);

    // Fetch Analytics when wallet connects
    useEffect(() => {
        if (!walletAddress) return;

        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8000/api/v1/user/${walletAddress}`);
                if (!res.ok) throw new Error("Failed to fetch user data");
                const data = await res.json();
                setUserData(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [walletAddress]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-56px)] text-amber-500 font-mono animate-pulse">
                INITIALIZING PROFILE DATA...
            </div>
        );
    }

    if (!walletAddress) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] gap-4 text-center">
                <Wallet size={48} className="text-slate-600 mb-2" />
                <h2 className="text-2xl font-bold text-slate-200">Wallet Not Connected</h2>
                <p className="text-slate-400 max-w-md">
                    Connect your MetaMask wallet to view your learning progress, portfolio insights, and specialized analytics.
                </p>
                <button 
                    onClick={() => {
                        (window as any).ethereum?.request({ method: "eth_requestAccounts" })
                            .then((accounts: string[]) => {
                                if(accounts.length > 0) setWalletAddress(accounts[0]);
                            });
                    }}
                    className="mt-4 px-6 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all font-bold"
                >
                    Connect Wallet
                </button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-56px)] text-red-400 font-mono">
                ERROR: {error}
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 p-8 pb-32">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header Section */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-amber-500/30">
                            <User size={32} className="text-amber-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                                Portfolio Analytics
                            </h1>
                            <p className="font-mono text-slate-400 text-sm mt-1">
                                {walletAddress}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Balance</p>
                            <span className="text-2xl font-mono text-emerald-400 font-bold">
                                ₹{userData?.portfolio_balance.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="h-10 w-px bg-slate-800" />
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Risk Level</p>
                            <span className="text-lg font-mono text-amber-500 font-bold">MODERATE</span>
                        </div>
                    </div>
                </motion.section>

                {/* Grid Layout for Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* 1. Learning Progress Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 backdrop-blur-sm relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 mb-6">
                            <Trophy className="text-blue-400" size={20} />
                            <h3 className="font-bold text-lg text-slate-200">Academy Mastery</h3>
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-4xl font-bold text-slate-100">{userData?.total_xp}</span>
                                    <span className="text-sm text-slate-500 ml-2">Total XP</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-blue-400">{userData?.courses_completed}</span>
                                    <span className="block text-xs text-slate-500 uppercase mt-1">Courses Done</span>
                                </div>
                            </div>

                            {/* Simple XP Progress Bar Mockup */}
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200/10">
                                        Rank: Novice Trader
                                    </span>
                                    <span className="text-xs font-semibold inline-block text-blue-400">
                                        {((userData?.total_xp || 0) % 1000) / 10}%
                                    </span>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-800">
                                    <div style={{ width: `${((userData?.total_xp || 0) % 1000) / 10}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transaction-all duration-500"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. Prediction History Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 backdrop-blur-sm relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="text-purple-400" size={20} />
                            <h3 className="font-bold text-lg text-slate-200">Market Predictions</h3>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-bold text-slate-100">{userData?.predictions_made}</span>
                                    <span className="text-sm text-slate-500">Total Insights</span>
                                </div>
                                <div className="h-12 w-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 flex items-center justify-center">
                                    <span className="text-xs font-bold text-purple-400">{userData?.insights?.win_rate ?? 0}%</span>
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-400 border-t border-slate-800 pt-4">
                                Reputation Score: <span className="text-purple-400 font-bold">{userData?.insights?.reputation_score ?? 0}</span>. Higher accuracy unlocks advanced trading tools.
                            </p>
                        </div>
                    </motion.div>

                    {/* 3. Asset Allocation and Net Worth */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 backdrop-blur-sm relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 mb-6">
                            <Layers className="text-emerald-400" size={20} />
                            <h3 className="font-bold text-lg text-slate-200">Asset Allocation</h3>
                        </div>
                         
                        <div className="flex items-center justify-center h-40 relative z-10">
                            {/* Simple Pie Chart Mockup using CSS Conic Gradient */}
                            {/* Calculate segment size based on cash vs locked */}
                            {(() => {
                                const cash = userData?.insights?.asset_allocation?.Cash || 100;
                                // Simple 2-segment gradient for demo
                                const gradient = `conic-gradient(#10b981 0% ${cash}%, #3b82f6 ${cash}% 100%)`;
                                return (
                                <div className="w-32 h-32 rounded-full bg-slate-800 relative flex items-center justify-center"
                                     style={{ background: gradient }}
                                >
                                    <div className="w-24 h-24 rounded-full bg-slate-900 flex flex-col items-center justify-center">
                                        <span className="text-xs text-slate-500 font-bold">NET WORTH</span>
                                        <span className="text-sm font-bold text-emerald-400">₹{(userData?.insights?.net_worth ?? userData?.portfolio_balance ?? 0).toLocaleString('en-IN', { notation: "compact" })}</span>
                                    </div>
                                </div>
                                );
                            })()}
                        </div>
                        <div className="flex justify-between text-xs px-4 mt-2">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-slate-400">Cash ({userData?.insights?.asset_allocation?.Cash ?? 100}%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-slate-400">Locked ({userData?.insights?.asset_allocation?.Locked ?? 0}%)</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity Table */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                        <History size={18} className="text-slate-400" />
                        <h3 className="font-bold text-lg text-slate-200">Recent Transactions</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-sm">
                                {userData?.portfolio_history.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                                            No transaction history found.
                                        </td>
                                    </tr>
                                ) : (
                                    userData?.portfolio_history.map((tx, i) => (
                                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase
                                                    ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 
                                                      tx.type === 'debit' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300 font-medium">{tx.description}</td>
                                            <td className={`px-6 py-4 font-mono font-bold 
                                                ${tx.type === 'credit' || tx.type === 'reward' ? 'text-emerald-400' : 'text-slate-200'}`}>
                                                {tx.type === 'credit' || tx.type === 'reward' ? '+' : '-'}
                                                ₹{tx.amount.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 tabular-nums">
                                                {new Date(tx.date).toLocaleDateString()} <span className="text-slate-600 text-xs ml-1">{new Date(tx.date).toLocaleTimeString()}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.section>

            </div>
        </main>
    );
}
