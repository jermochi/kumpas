"use client";

import type { AgentKey } from "@/lib/analysis-types";
import { BarChart3, Compass, Brain } from "lucide-react";

interface ScoreCardsRowProps {
    verdicts: Record<AgentKey, string>;
    scores: Record<AgentKey, number>;
    activeAgent: AgentKey;
    onSelect: (key: AgentKey) => void;
}

const AGENT_CONFIG: { key: AgentKey; label: string; icon: React.ReactNode }[] = [
    { key: "labor_market", label: "LABOR MARKET", icon: <BarChart3 size={16} /> },
    { key: "feasibility", label: "FEASIBILITY", icon: <Compass size={16} /> },
    { key: "psychological", label: "PSYCHOLOGICAL", icon: <Brain size={16} /> },
];

const FRAMEWORK_LABELS: Record<AgentKey, string> = {
    labor_market: "LMI Framework · Arulmani et al., 2014",
    feasibility: "SCCT · Lent, Brown & Hackett, 1994",
    psychological: "JD-R Model · Demerouti et al., 2001",
};

export default function ScoreCardsRow({ verdicts, scores, activeAgent, onSelect }: ScoreCardsRowProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AGENT_CONFIG.map(({ key, label, icon }) => {
                const isActive = key === activeAgent;
                return (
                    <button
                        key={key}
                        onClick={() => onSelect(key)}
                        className={`
                            relative rounded-2xl p-4 text-left transition-all duration-200 cursor-pointer
                            ${isActive
                                ? "bg-ink text-white shadow-lg ring-2 ring-forest/30"
                                : "bg-white border border-black/[0.06] text-ink hover:border-black/[0.12] hover:shadow-sm"
                            }
                        `}
                    >
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-semibold tracking-widest uppercase ${isActive ? "text-white" : "text-muted-text"}`}>
                                {label}
                            </span>
                            <span className={isActive ? "text-white/80" : "text-muted-text/50"}>
                                {icon}
                            </span>
                        </div>

                        {/* Score */}
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className={`text-3xl font-bold ${isActive ? "text-white" : "text-ink"}`}>
                                {scores[key]}
                            </span>
                            <span className={`text-xs ${isActive ? "text-white/70" : "text-muted-text"}`}>/100</span>
                        </div>

                        {/* Verdict */}
                        <p className={`text-sm font-semibold ${isActive ? "text-forest-light" : "text-forest"}`}>
                            {verdicts[key]}
                        </p>

                        {/* Framework citation */}
                        <p className={`mt-0.5 text-[10px] ${isActive ? "text-white/60" : "text-muted-text/70"}`}>
                            {FRAMEWORK_LABELS[key]}
                        </p>
                    </button>
                );
            })}
        </div>
    );
}
