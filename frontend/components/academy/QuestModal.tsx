"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  X,
  ChevronRight,
  CheckCircle2,
  Lock,
  PlayCircle,
  FileText,
  HelpCircle,
  Award,
  Zap
} from "lucide-react";

interface Quest {
  id: number;
  category: string;
  categoryColor: {
    bg: string;
    border: string;
    text: string;
    glow: string;
    dot: string;
  };
  icon: React.ReactNode;
  title: string;
  description: string;
  reward: string;
  rewardAmount: number;
  xpReward: number;
  difficulty: "Initiate" | "Strategist" | "Grandmaster";
  modules: number;
}

interface Module {
  id: number;
  title: string;
  duration: string;
  type: "video" | "article" | "quiz";
}

interface QuestModalProps {
  quest: Quest;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (id: number) => void;
  isAlreadyCompleted: boolean;
}

// Generate realistic looking modules based on the quest title
const generateModules = (quest: Quest): Module[] => {
  const baseModules: Module[] = [
    { id: 1, title: "Introduction & Core Concepts", duration: "5 min", type: "video" },
    { id: 2, title: "Historical Context & Evolution", duration: "8 min", type: "article" },
    { id: 3, title: "Key Mechanisms Explained", duration: "12 min", type: "video" },
    { id: 4, title: "Case Studies & Real Application", duration: "10 min", type: "article" },
    { id: 5, title: "Final Assessment", duration: "15 min", type: "quiz" },
  ];

  if (quest.modules > 5) {
      baseModules.splice(3, 0, { id: 6, title: "Advanced Strategies", duration: "15 min", type: "video" });
  }
  if (quest.modules > 6) {
      baseModules.splice(4, 0, { id: 7, title: "Risk Management", duration: "7 min", type: "article" });
  }
  
  return baseModules.slice(0, quest.modules);
};

export default function QuestModal({ quest, isOpen, onClose, onComplete, isAlreadyCompleted }: QuestModalProps) {
  const modules = useMemo(() => generateModules(quest), [quest]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const targetIndex = isAlreadyCompleted ? quest.modules : 0;
      if (currentModuleIndex !== targetIndex) {
        setCurrentModuleIndex(targetIndex);
        setProgress(isAlreadyCompleted ? 100 : 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, quest.id, isAlreadyCompleted]);

  const handleModuleComplete = () => {
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex((prev) => prev + 1);
      setProgress(((currentModuleIndex + 1) / modules.length) * 100);
    } else {
      // All modules done
      setCurrentModuleIndex(modules.length);
      setProgress(100);
    }
  };

  const handleFinalClaim = async () => {
    setIsMinting(true);
    await onComplete(quest.id);
    setIsMinting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-slate-900 border shadow-2xl"
        style={{
             borderColor: quest.categoryColor.border,
             boxShadow: `0 0 40px ${quest.categoryColor.glow}20`,
        }}
      >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800/50 bg-slate-900/50">
              <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                       style={{ background: quest.categoryColor.bg }}>
                      {quest.icon}
                  </div>
                  <div>
                      <h2 className="text-xl font-bold text-slate-100">{quest.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span style={{ color: quest.categoryColor.text }}>{quest.category}</span>
                          <span>•</span>
                          <span>{quest.modules} Modules</span>
                          <span>•</span>
                          <span>{quest.reward}</span>
                       </div>
                  </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                  <X size={24} />
              </button>
          </div>

          <div className="flex flex-col md:flex-row h-[600px]">
              {/* Sidebar: Module List */}
              <div className="w-full md:w-80 border-r border-slate-800/50 bg-slate-900/30 overflow-y-auto">
                    <div className="p-4">
                        <div className="mb-4 flex items-center justify-between text-xs font-medium text-slate-500">
                            <span>COURSE PROGRESS</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                            <motion.div 
                                className="h-full bg-amber-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 p-2">
                        {modules.map((module, idx) => {
                            const isActive = idx === currentModuleIndex;
                            const isCompleted = idx < currentModuleIndex;
                            const isLocked = idx > currentModuleIndex;

                            return (
                                <button
                                    key={module.id}
                                    disabled={isLocked}
                                    onClick={() => !isLocked && setCurrentModuleIndex(idx)}
                                    className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                                        isActive 
                                        ? "bg-slate-800 ring-1 ring-slate-700" 
                                        : "hover:bg-slate-800/50"
                                    } ${
                                        isLocked ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                        isCompleted 
                                            ? "bg-green-500/20 text-green-500" 
                                            : isActive
                                                ? "bg-amber-500 text-slate-900"
                                                : "bg-slate-800 text-slate-500"
                                    }`}>
                                        {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-sm font-medium ${isActive ? "text-slate-200" : "text-slate-400"}`}>
                                            {module.title}
                                        </div>
                                        <div className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                                            {module.type === 'video' ? <PlayCircle size={10} /> : module.type === 'article' ? <FileText size={10} /> : <HelpCircle size={10} />}
                                            {module.duration}
                                        </div>
                                    </div>
                                    {isLocked && <Lock size={12} className="text-slate-700" />}
                                </button>
                            );
                        })}
                    </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col bg-slate-950 p-8 relative">
                    {/* Placeholder content for module */}
                    {currentModuleIndex < modules.length ? (
                        <div className="flex flex-col h-full">
                            <div className="mb-6">
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-500 mb-2">
                                     Module {currentModuleIndex + 1}
                                </span>
                                <h1 className="text-3xl font-black text-slate-100 mb-4">
                                    {modules[currentModuleIndex]?.title}
                                </h1>
                                <p className="text-slate-400 leading-relaxed">
                                    In this module, we explore the fundamental concepts behind {modules[currentModuleIndex]?.title}. 
                                    Understanding this is crucial for mastering the broader topic of {quest.title}.
                                    <br/><br/>
                                    (This is a simulated learning environment. In a production app, this would contain actual video content, long-form articles, or interactive quizzes.)
                                </p>
                            </div>

                            {/* Content Visualization Placeholder */}
                            <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden group mb-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                                <div className={`h-20 w-20 rounded-full flex items-center justify-center z-10 ${
                                    modules[currentModuleIndex]?.type === 'video' ? "bg-amber-500 text-slate-900 pl-1" : "bg-slate-700 text-slate-300"
                                }`}>
                                    {modules[currentModuleIndex]?.type === 'video' && <PlayCircle size={32} strokeWidth={2.5} />}
                                    {modules[currentModuleIndex]?.type === 'article' && <FileText size={32} strokeWidth={2.5} />}
                                    {modules[currentModuleIndex]?.type === 'quiz' && <HelpCircle size={32} strokeWidth={2.5} />}
                                </div>
                            </div>

                            <button 
                                onClick={handleModuleComplete}
                                className="mt-auto w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span>Complete Module</span>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    ) : (
                        /* Course Completion Screen */
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="h-24 w-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center mb-6 shadow-xl shadow-amber-500/20"
                            >
                                <Award size={48} className="text-white" />
                            </motion.div>
                            
                            <h2 className="text-3xl font-black text-white mb-2">Quest Completed!</h2>
                            <p className="text-slate-400 max-w-md mb-8">
                                You have successfully mastered {quest.title}. Claim your reward to mint your on-chain certificate.
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">XP Earned</div>
                                    <div className="text-2xl font-black text-amber-500">+{quest.xpReward}</div>
                                </div>
                                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Token Reward</div>
                                    <div className="text-2xl font-black text-emerald-400">+{quest.rewardAmount}</div>
                                </div>
                            </div>

                            {isAlreadyCompleted ? (
                                <button disabled className="w-full max-w-sm py-4 rounded-xl bg-slate-800 text-slate-500 font-bold border border-slate-700 cursor-not-allowed">
                                    Reward Already Claimed
                                </button>
                            ) : (
                                <button 
                                    onClick={handleFinalClaim}
                                    disabled={isMinting}
                                    className="w-full max-w-sm py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {isMinting ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Minting Certificate...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={20} fill="currentColor" />
                                            <span>Claim Reward</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
              </div>
          </div>
      </motion.div>
    </div>
  );
}
