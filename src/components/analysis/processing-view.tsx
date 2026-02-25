"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { StageName } from "@/lib/analysis-types";

const STAGE_META: Record<StageName, { label: string; description: string }> = {
    transcriptionLayer: {
        label: "Transcription Layer",
        description: "Redacting session and detecting career path...",
    },
    laborMarket: {
        label: "Labor Market Analyst",
        description: "Mapping career paths to PH market demand...",
    },
    feasibility: {
        label: "Feasibility Analyst",
        description: "Evaluating real-world barriers and constraints...",
    },
    psychological: {
        label: "Psychological Analyst",
        description: "Extracting genuine interests and aptitudes...",
    },
    verdict: {
        label: "Verdict Generator",
        description: "Synthesizing all agents into final report...",
    },
};

const STAGE_ORDER: StageName[] = [
    "transcriptionLayer",
    "laborMarket",
    "feasibility",
    "psychological",
    "verdict",
];

export { STAGE_ORDER };

interface ProcessingViewProps {
    completedStages: StageName[];
}

export default function ProcessingView({ completedStages }: ProcessingViewProps) {
    const currentIndex = completedStages.length;
    const currentStage = STAGE_ORDER[currentIndex] as StageName | undefined;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
            <div className="text-center">
                <p className="text-base font-medium text-ink">Analyzing session</p>
                <p className="mt-1 text-sm text-muted-text">
                    {currentStage ? STAGE_META[currentStage].description : "Finalizing..."}
                </p>
            </div>

            <div className="w-full max-w-sm space-y-3">
                {STAGE_ORDER.map((stage) => {
                    const done = completedStages.includes(stage);
                    const running = stage === currentStage;

                    return (
                        <div
                            key={stage}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${done
                                    ? "border-forest/20 bg-forest/[0.04]"
                                    : running
                                        ? "border-black/10 bg-white shadow-sm"
                                        : "border-black/[0.06] bg-white/50"
                                }`}
                        >
                            {done ? (
                                <CheckCircle2 size={18} className="shrink-0 text-forest" />
                            ) : running ? (
                                <Loader2 size={18} className="shrink-0 animate-spin text-ink" />
                            ) : (
                                <Circle size={18} className="shrink-0 text-black/20" />
                            )}
                            <p className={`text-sm font-medium ${done || running ? "text-ink" : "text-muted-text"}`}>
                                {STAGE_META[stage].label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
