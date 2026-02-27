"use client"

import { useEffect, useState } from "react";
import { AgentSpinner } from "./agent-spinner";
import { Brain, Shield, BarChart3, BotMessageSquare, CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

export default function LoadingScreen({ completedStages = [] }: { completedStages?: string[] }) {
    const [transcriptionProgress, setTranscriptionProgress] = useState(0);
    const [agentProgress, setAgentProgress] = useState({ labor: 0, feasi: 0, psych: 0 });
    const [verdictProgress, setVerdictProgress] = useState(0);

    const hasTranscription = completedStages.includes("transcriptionLayer");
    const hasParallel = completedStages.includes("laborMarket");
    const hasVerdict = completedStages.includes("verdict");

    // Transcription Placebo
    useEffect(() => {
        if (hasTranscription) {
            setTranscriptionProgress(100);
            return;
        }
        const t = setInterval(() => {
            setTranscriptionProgress(p => Math.min(p + Math.random() * 8, 95));
        }, 200);
        return () => clearInterval(t);
    }, [hasTranscription]);

    // Agents Placebo
    useEffect(() => {
        if (!hasTranscription) return; 
        if (hasParallel) {
            setAgentProgress({ labor: 100, feasi: 100, psych: 100 });
            return;
        }
        const t = setInterval(() => {
            setAgentProgress(prev => ({
                labor: Math.min(prev.labor + Math.random() * 3, 98),
                feasi: Math.min(prev.feasi + Math.random() * 2, 94),
                psych: Math.min(prev.psych + Math.random() * 4, 96),
            }));
        }, 300);
        return () => clearInterval(t);
    }, [hasTranscription, hasParallel]);

    // Verdict Placebo
    useEffect(() => {
        if (!hasParallel) return;
        if (hasVerdict) {
            setVerdictProgress(100);
            return;
        }
        const t = setInterval(() => {
            setVerdictProgress(p => Math.min(p + Math.random() * 6, 99));
        }, 250);
        return () => clearInterval(t);
    }, [hasParallel, hasVerdict]);

    const ProgressRow = ({ label, progress, isDone, icon: Icon, active }: { label: string, progress: number, isDone: boolean, icon: any, active: boolean }) => (
        <div className={`flex items-center gap-4 w-full max-w-xl p-4 rounded-2xl border transition-all duration-700 ${active ? "bg-white border-[var(--sage)]/20 shadow-sm" : "bg-[var(--cream-mid)] border-transparent opacity-50"}`}>
            <div className={`p-2.5 rounded-full transition-colors duration-500 ${active && !isDone ? "bg-[var(--sage-light)] text-[var(--sage)]" : isDone ? "bg-[var(--charcoal)] text-white" : "bg-gray-200 text-gray-400"}`}>
                {isDone ? <CheckCircle2 size={20} /> : <Icon size={20} className={active ? "animate-spin" : ""} style={{ animationDuration: '3s' }} />}
            </div>
            <div className="flex-1 text-left">
                <div className="flex justify-between mb-2">
                    <span className={`text-sm font-medium ${active ? "text-[var(--charcoal)]" : "text-gray-400"}`}>{label}</span>
                    {active && <span className="text-xs text-gray-500 font-mono">{Math.round(progress)}%</span>}
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[var(--sage)] rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col items-center justify-center font-sans text-center min-h-[80vh] py-12">
            <div className="animate-fade-in flex flex-col items-center w-full max-w-2xl px-6">
                <div className="mb-2 scale-90">
                    <AgentSpinner />
                </div>
                <h2 className="font-heading text-2xl text-[var(--charcoal)] mb-8">
                    Processing Analysis...
                </h2>

                <div className="flex flex-col gap-4 w-full items-center">
                    <ProgressRow 
                        label="1. Transcription Layer" 
                        progress={transcriptionProgress} 
                        isDone={hasTranscription} 
                        active={true}
                        icon={BotMessageSquare}
                    />

                    <div className={`w-full max-w-xl p-5 rounded-2xl border transition-all duration-700 ${hasTranscription && !hasParallel ? "bg-white border-[var(--sage)]/20 shadow-sm" : (hasParallel ? "bg-white border-transparent shadow-sm" : "bg-[var(--cream-mid)] border-transparent opacity-40")}`}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className={`p-1.5 rounded-full ${hasParallel ? "bg-[var(--charcoal)] text-white" : (hasTranscription ? "bg-gray-100 text-[var(--charcoal)]" : "bg-gray-200 text-gray-400")}`}>
                                {hasParallel ? <CheckCircle2 size={14} /> : (hasTranscription ? <Loader2 size={14} className="animate-spin" /> : <CircleDashed size={14} />)}
                            </div>
                            <span className={`text-sm font-medium ${hasTranscription ? "text-[var(--charcoal)]" : "text-gray-400"}`}>2. Parallel Agent Analysis</span>
                        </div>
                        <div className="pl-[2.25rem] flex flex-col gap-4">
                            <AgentSubProgress 
                                label="Labor Market Analyst" 
                                icon={BarChart3} 
                                progress={agentProgress.labor} 
                                color="#6B8C6B" 
                                active={hasTranscription && !hasParallel} 
                                done={hasParallel} 
                            />
                            <AgentSubProgress 
                                label="Feasibility Risk Scan" 
                                icon={Shield} 
                                progress={agentProgress.feasi} 
                                color="#C4861C" 
                                active={hasTranscription && !hasParallel} 
                                done={hasParallel} 
                            />
                            <AgentSubProgress 
                                label="Psychological Profiler" 
                                icon={Brain} 
                                progress={agentProgress.psych} 
                                color="#5B7FA6" 
                                active={hasTranscription && !hasParallel} 
                                done={hasParallel} 
                            />
                        </div>
                    </div>

                    <ProgressRow 
                        label="3. Final Verdict Synthesis" 
                        progress={verdictProgress} 
                        isDone={hasVerdict} 
                        active={hasParallel}
                        icon={CheckCircle2}
                    />
                </div>
            </div>
        </div>
    );
}

function AgentSubProgress({ label, icon: Icon, progress, color, active, done }: { label: string, icon: any, progress: number, color: string, active: boolean, done: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className="opacity-80">
                <Icon size={16} style={{ color: done ? color : (active ? color : '#9ca3af') }} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                    <span className={done || active ? "text-gray-600" : "text-gray-400"}>{label}</span>
                    {(active || done) && <span className="font-mono text-gray-400">{Math.round(progress)}%</span>}
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-300 ease-out rounded-full" style={{ width: `${progress}%`, backgroundColor: color }}/>
                </div>
            </div>
        </div>
    );
}