"use client"

import { useEffect, useState, useMemo } from "react";
import { AgentSpinner } from "./agent-spinner";
import {
    FileText, PenLine, BotMessageSquare, Shield, BarChart3,
    Brain, Sparkles, CheckCircle2, CircleDashed, Loader2,
} from "lucide-react";

/* ─── stage config ─── */
const STAGE_CONFIG = [
    {
        key: "documentParsing",
        label: "Processing Documents",
        sub: "Reading NCAE scores and academic records",
        icon: FileText,
        color: "#C4861C",
    },
    {
        key: "notesParsing",
        label: "Reading Counselor Notes",
        sub: "Structuring interview sections for analysis",
        icon: PenLine,
        color: "#6B8C6B",
    },
    {
        key: "transcriptionLayer",
        label: "Session Intake Layer",
        sub: "Detecting career path and redacting PII",
        icon: BotMessageSquare,
        color: "#5B7FA6",
    },
    // parallel group handled separately
    {
        key: "adjacentCareer",
        label: "Adjacent Career Generation",
        sub: "Finding related career opportunities",
        icon: Sparkles,
        color: "#8B5E3C",
    },
] as const;

const PARALLEL_AGENTS = [
    { key: "feasibility", label: "Feasibility Assessor", icon: Shield, color: "#6B8C6B" },
    { key: "laborMarket", label: "Labor Market Analyst", icon: BarChart3, color: "#C4861C" },
    { key: "jobDemand", label: "Job Demand Profiler", icon: Brain, color: "#5B7FA6" },
] as const;

/* ─── dynamic headers based on current stage ─── */
const HEADERS: Record<string, { title: string; subtitle: string }> = {
    documentParsing: { title: "Preparing Your Data", subtitle: "Extracting information from your documents..." },
    notesParsing: { title: "Reading Your Notes", subtitle: "Structuring counselor observations..." },
    transcriptionLayer: { title: "Understanding the Session", subtitle: "AI is analyzing career intentions and context..." },
    parallel: { title: "Running Multi-AI Specialist Analysis", subtitle: "Three specialist AIs are evaluating simultaneously..." },
    adjacentCareer: { title: "Generating Career Insights", subtitle: "Discovering alternative career pathways..." },
    done: { title: "Analysis Complete", subtitle: "Finalizing your career guidance report..." },
};

function getCurrentPhase(completed: string[]): string {
    if (completed.includes("adjacentCareer")) return "done";
    if (completed.includes("laborMarket")) return "adjacentCareer";
    if (completed.includes("transcriptionLayer")) return "parallel";
    if (completed.includes("notesParsing")) return "transcriptionLayer";
    if (completed.includes("documentParsing")) return "notesParsing";
    return "documentParsing";
}

export default function LoadingScreen({ completedStages = [] }: { completedStages?: string[] }) {
    /* ─── placebo progress for each stage ─── */
    const [progress, setProgress] = useState<Record<string, number>>({
        documentParsing: 0,
        notesParsing: 0,
        transcriptionLayer: 0,
        feasibility: 0,
        laborMarket: 0,
        jobDemand: 0,
        adjacentCareer: 0,
    });

    const phase = getCurrentPhase(completedStages);
    const header = HEADERS[phase] || HEADERS.documentParsing;

    /* Overall progress: how many of 7 total stages are done */
    const totalStages = 7;
    const overallPct = Math.round((completedStages.length / totalStages) * 100);

    const hasDocs = completedStages.includes("documentParsing");
    const hasNotes = completedStages.includes("notesParsing");
    const hasTranscription = completedStages.includes("transcriptionLayer");
    const hasParallel = completedStages.includes("laborMarket");
    const hasAdjacent = completedStages.includes("adjacentCareer");

    /* Placebo timers — each stage ticks up while active, snaps to 100 when completed */
    useEffect(() => {
        const t = setInterval(() => {
            setProgress(prev => {
                const next = { ...prev };

                // Document Parsing
                if (hasDocs) next.documentParsing = 100;
                else next.documentParsing = Math.min(prev.documentParsing + Math.random() * 6, 92);

                // Notes Parsing
                if (hasNotes) next.notesParsing = 100;
                else if (hasDocs) next.notesParsing = Math.min(prev.notesParsing + Math.random() * 10, 95);

                // Transcription Layer
                if (hasTranscription) next.transcriptionLayer = 100;
                else if (hasNotes) next.transcriptionLayer = Math.min(prev.transcriptionLayer + Math.random() * 3, 90);

                // Parallel agents
                if (hasParallel) {
                    next.feasibility = 100;
                    next.laborMarket = 100;
                    next.jobDemand = 100;
                } else if (hasTranscription) {
                    next.feasibility = Math.min(prev.feasibility + Math.random() * 2, 94);
                    next.laborMarket = Math.min(prev.laborMarket + Math.random() * 3, 98);
                    next.jobDemand = Math.min(prev.jobDemand + Math.random() * 4, 96);
                }

                // Adjacent Career
                if (hasAdjacent) next.adjacentCareer = 100;
                else if (hasParallel) next.adjacentCareer = Math.min(prev.adjacentCareer + Math.random() * 5, 97);

                return next;
            });
        }, 250);
        return () => clearInterval(t);
    }, [hasDocs, hasNotes, hasTranscription, hasParallel, hasAdjacent]);

    /* ─── UI helpers ─── */
    const StageRow = ({
        label, sub, icon: Icon, color, pct, isDone, isActive,
    }: {
        label: string; sub: string; icon: any; color: string;
        pct: number; isDone: boolean; isActive: boolean;
    }) => (
        <div
            className={`flex items-center gap-4 w-full p-4 rounded-2xl border transition-all duration-500 ${isDone
                    ? "bg-white/80 border-[var(--sage)]/15"
                    : isActive
                        ? "bg-white border-[var(--sage)]/25 shadow-md ring-1 ring-[var(--sage)]/10"
                        : "bg-[var(--cream-mid)]/60 border-transparent opacity-40"
                }`}
        >
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${isDone
                        ? "bg-[var(--charcoal)] text-white"
                        : isActive
                            ? "text-white shadow-sm"
                            : "bg-gray-200 text-gray-400"
                    }`}
                style={isActive && !isDone ? { backgroundColor: color } : undefined}
            >
                {isDone ? (
                    <CheckCircle2 size={18} />
                ) : isActive ? (
                    <Icon size={18} className="animate-pulse" />
                ) : (
                    <CircleDashed size={16} />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-sm font-semibold ${isDone || isActive ? "text-[var(--charcoal)]" : "text-gray-400"}`}>
                        {label}
                    </span>
                    {(isActive || isDone) && (
                        <span className={`text-[11px] font-mono tabular-nums ${isDone ? "text-[var(--sage)]" : "text-gray-400"}`}>
                            {Math.round(pct)}%
                        </span>
                    )}
                </div>
                {isActive && !isDone && (
                    <p className="text-[11px] text-gray-400 mb-2 animate-pulse">{sub}</p>
                )}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                            width: `${pct}%`,
                            backgroundColor: isDone ? "var(--sage)" : color,
                        }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col items-center justify-center font-sans text-center min-h-[80vh] py-12">
            <div className="animate-fade-in flex flex-col items-center w-full max-w-2xl px-6">
                {/* Spinner */}
                <div className="mb-2 scale-90">
                    <AgentSpinner />
                </div>

                {/* Dynamic header */}
                <h2 className="font-heading text-2xl text-[var(--charcoal)] mb-1 transition-all duration-500">
                    {header.title}
                </h2>
                <p className="text-sm text-gray-400 mb-2">{header.subtitle}</p>

                {/* Overall progress bar */}
                <div className="w-full max-w-md mb-8">
                    <div className="flex justify-between text-[11px] text-gray-400 mb-1.5 font-mono">
                        <span>Overall Progress</span>
                        <span>{overallPct}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${overallPct}%`,
                                background: "linear-gradient(90deg, var(--sage), var(--charcoal))",
                            }}
                        />
                    </div>
                </div>

                {/* Stage list */}
                <div className="flex flex-col gap-3 w-full items-center">
                    {/* 1. Document Parsing */}
                    <StageRow
                        label="Processing Documents"
                        sub="Reading NCAE scores and academic records"
                        icon={FileText}
                        color="#C4861C"
                        pct={progress.documentParsing}
                        isDone={hasDocs}
                        isActive={!hasDocs}
                    />

                    {/* 2. Notes Parsing */}
                    <StageRow
                        label="Reading Counselor Notes"
                        sub="Structuring interview sections for analysis"
                        icon={PenLine}
                        color="#6B8C6B"
                        pct={progress.notesParsing}
                        isDone={hasNotes}
                        isActive={hasDocs && !hasNotes}
                    />

                    {/* 3. Session Intake */}
                    <StageRow
                        label="Session Intake Layer"
                        sub="Detecting career path and redacting PII"
                        icon={BotMessageSquare}
                        color="#5B7FA6"
                        pct={progress.transcriptionLayer}
                        isDone={hasTranscription}
                        isActive={hasNotes && !hasTranscription}
                    />

                    {/* 4. Parallel Agent Group */}
                    <div className={`w-full p-5 rounded-2xl border transition-all duration-500 ${hasTranscription && !hasParallel
                            ? "bg-white border-[var(--sage)]/25 shadow-md ring-1 ring-[var(--sage)]/10"
                            : hasParallel
                                ? "bg-white/80 border-[var(--sage)]/15"
                                : "bg-[var(--cream-mid)]/60 border-transparent opacity-40"
                        }`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${hasParallel
                                    ? "bg-[var(--charcoal)] text-white"
                                    : hasTranscription
                                        ? "bg-[var(--sage)]/10 text-[var(--sage)]"
                                        : "bg-gray-200 text-gray-400"
                                }`}>
                                {hasParallel ? (
                                    <CheckCircle2 size={14} />
                                ) : hasTranscription ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <CircleDashed size={14} />
                                )}
                            </div>
                            <span className={`text-sm font-semibold ${hasTranscription ? "text-[var(--charcoal)]" : "text-gray-400"}`}>
                                Multi-AI Specialist Analysis
                            </span>
                            {hasTranscription && !hasParallel && (
                                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[var(--sage)]/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--sage)]">
                                    Running in parallel
                                </span>
                            )}
                        </div>
                        <div className="pl-[2.5rem] flex flex-col gap-3.5">
                            {PARALLEL_AGENTS.map(agent => (
                                <AgentSubProgress
                                    key={agent.key}
                                    label={agent.label}
                                    icon={agent.icon}
                                    progress={progress[agent.key]}
                                    color={agent.color}
                                    active={hasTranscription && !hasParallel}
                                    done={hasParallel}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 5. Adjacent Career */}
                    <StageRow
                        label="Adjacent Career Generation"
                        sub="Finding related career opportunities"
                        icon={Sparkles}
                        color="#8B5E3C"
                        pct={progress.adjacentCareer}
                        isDone={hasAdjacent}
                        isActive={hasParallel && !hasAdjacent}
                    />
                </div>
            </div>
        </div>
    );
}

function AgentSubProgress({
    label, icon: Icon, progress, color, active, done,
}: {
    label: string; icon: any; progress: number; color: string; active: boolean; done: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="opacity-80">
                {done ? (
                    <CheckCircle2 size={15} style={{ color }} />
                ) : (
                    <Icon
                        size={15}
                        style={{ color: active ? color : '#9ca3af' }}
                        className={active ? "animate-pulse" : ""}
                    />
                )}
            </div>
            <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                    <span className={done || active ? "text-gray-600 font-medium" : "text-gray-400"}>{label}</span>
                    {(active || done) && (
                        <span className="font-mono text-gray-400 text-[11px] tabular-nums">{Math.round(progress)}%</span>
                    )}
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress}%`, backgroundColor: color }}
                    />
                </div>
            </div>
        </div>
    );
}