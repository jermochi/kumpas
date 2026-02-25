"use client";

import { useState } from "react";
import { Maximize2, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import type { AgentPanelData } from "@/lib/analysis-types";

interface AgentDetailPanelProps {
    data: AgentPanelData;
    onFullscreen: () => void;
    /** When true, supporting data is shown by default and fullscreen button is hidden */
    isFullscreen?: boolean;
}

function SignalIcon({ type }: { type: "up" | "down" | "neutral" }) {
    if (type === "up") return <TrendingUp size={14} className="text-forest" />;
    if (type === "down") return <TrendingDown size={14} className="text-red-500" />;
    return <Minus size={14} className="text-muted-text" />;
}

export default function AgentDetailPanel({ data, onFullscreen, isFullscreen = false }: AgentDetailPanelProps) {
    const [showSupporting, setShowSupporting] = useState(isFullscreen);

    return (
        <div className={`rounded-2xl ${isFullscreen ? "" : "border border-black/[0.06] shadow-card"} bg-white p-5 sm:p-6`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Circular score — positioned left near verdict */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-forest/40">
                        <span className="text-lg font-bold text-ink">{data.score}</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-text">
                            {data.label} · {data.framework}
                        </p>
                        <h2 className="mt-0.5 text-xl font-bold text-ink">{data.verdict}</h2>
                    </div>
                </div>
                {!isFullscreen && (
                    <button
                        onClick={onFullscreen}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-black/[0.04] cursor-pointer transition-colors"
                        aria-label="Fullscreen"
                    >
                        <Maximize2 size={14} className="text-muted-text" />
                    </button>
                )}
            </div>

            {/* Framework cite pill */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5">
                <span className="text-[10px] text-white/80">📋</span>
                <span className="text-[10px] font-medium text-white">{data.frameworkCite}</span>
            </div>

            {/* Key Signals */}
            <div className="mb-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-text">
                    Key Signals
                </p>
                <div className="space-y-3">
                    {data.keySignals.map((signal, i) => (
                        <div key={i}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SignalIcon type={signal.icon} />
                                    <span className="text-sm text-ink">{signal.label}</span>
                                </div>
                                <span className="text-sm font-semibold text-ink text-right">{signal.value}</span>
                            </div>
                            {signal.subNote && (
                                <p className="mt-0.5 ml-6 text-xs text-muted-text">↳ {signal.subNote}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* What This Means */}
            <div className="rounded-xl bg-forest/[0.06] px-4 py-3 mb-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-forest">
                    ✦ What This Means
                </p>
                <p className="text-sm leading-relaxed text-ink">{data.summary}</p>
            </div>

            {/* Supporting Data */}
            {data.supportingData.length > 0 && (
                <>
                    {isFullscreen ? (
                        /* In fullscreen: always show, no toggle */
                        <div className="space-y-3">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-text">
                                Supporting Data
                            </p>
                            {data.supportingData.map((row, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <SignalIcon type={row.icon} />
                                        <span className="text-sm text-ink">{row.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-forest">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Normal: collapsible toggle */
                        <>
                            <button
                                onClick={() => setShowSupporting((v) => !v)}
                                className="flex w-full items-center justify-between rounded-xl border border-black/[0.06] px-4 py-3 text-sm text-ink cursor-pointer hover:bg-black/[0.02] transition-colors"
                            >
                                <span>{showSupporting ? "Hide" : "Show"} supporting data</span>
                                {showSupporting ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {showSupporting && (
                                <div className="mt-3 space-y-3">
                                    {data.supportingData.map((row, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <SignalIcon type={row.icon} />
                                                <span className="text-sm text-ink">{row.label}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-forest">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
