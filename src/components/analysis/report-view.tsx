"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import type { AdjacentCareerReport, StructuredTranscript, AgentKey, AgentPanelData } from "@/lib/analysis-types";
import { buildRelatedCareers } from "@/lib/analysis-helpers";

import ScoreCardsRow from "@/components/analysis/score-cards-row";
import AgentDetailPanel from "@/components/analysis/agent-detail-panel";
import TranscriptPanel from "@/components/analysis/transcript-panel";
import RelatedCareersPanel from "@/components/analysis/related-careers-panel";
import PdfFooter from "@/components/analysis/pdf-footer";
import FullscreenModal from "@/components/analysis/fullscreen-modal";

interface ReportViewProps {
    report:       AdjacentCareerReport;
    structured:   StructuredTranscript;
    agentData:    Record<AgentKey, AgentPanelData>;
    onNewSession: () => void;
}

export default function ReportView({ report, structured, agentData, onNewSession }: ReportViewProps) {
    const [activeAgent, setActiveAgent] = useState<AgentKey>("labor_market");
    const [modalContent, setModalContent] = useState<"transcript" | AgentKey | null>(null);

    const relatedCareers = useMemo(() => buildRelatedCareers(report), [report]);

    const wordCount = structured.turns.reduce((n, t) => n + t.text.split(/\s+/).length, 0);

    const scores: Record<AgentKey, number> = {
        labor_market:  agentData.labor_market.score,
        feasibility:   agentData.feasibility.score,
        psychological: agentData.psychological.score,
    };

    const activePanel = agentData[activeAgent];

    const leftRef = useRef<HTMLDivElement>(null);
    const [sidebarMaxH, setSidebarMaxH] = useState<number | undefined>(undefined);

    useEffect(() => {
        const el = leftRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setSidebarMaxH(entry.contentRect.height);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [activeAgent]);

    const verdicts: Record<AgentKey, string> = {
        labor_market:  agentData.labor_market.verdict,
        feasibility:   agentData.feasibility.verdict,
        psychological: agentData.psychological.verdict,
    };

    return (
        <>
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 space-y-6">

                {/* ── Header ──────────────────────────────────────────── */}
                <header className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-text">
                            Career Assessment · Session Output
                        </p>
                        <h1 className="font-heading mt-1 text-3xl font-bold leading-tight text-ink sm:text-4xl">
                            Assessment for{" "}
                            <em className="text-forest">{structured.career_path || "Career"}</em>
                        </h1>
                        <p className="mt-1 text-xs text-muted-text">
                            Three agents · <span className="font-semibold text-ink">LMI Framework</span> · <span className="font-semibold text-ink">SCCT</span> · <span className="font-semibold text-ink">JD-R Model</span>
                        </p>
                    </div>

                    {/* New Session button */}
                    <button
                        onClick={onNewSession}
                        className="flex shrink-0 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/[0.03] transition-colors cursor-pointer"
                    >
                        New Session
                    </button>
                </header>

                {/* ── Score Cards Row ──────────────────────────────────── */}
                <ScoreCardsRow
                    verdicts={verdicts}
                    scores={scores}
                    activeAgent={activeAgent}
                    onSelect={setActiveAgent}
                />

                {/* ── Two-Column Body ─────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">

                    <div ref={leftRef}>
                        <AgentDetailPanel
                            data={activePanel}
                            onFullscreen={() => setModalContent(activeAgent)}
                        />
                    </div>

                    <div
                        className="flex flex-col gap-4 overflow-hidden"
                        style={sidebarMaxH ? { maxHeight: sidebarMaxH } : undefined}
                    >
                        <TranscriptPanel
                            turns={structured.turns}
                            wordCount={wordCount}
                            onFullscreen={() => setModalContent("transcript")}
                            className="flex-1 min-h-0"
                        />
                        <RelatedCareersPanel careers={relatedCareers} />
                    </div>
                </div>

                {/* ── PDF Footer ───────────────────────────────────────── */}
                <PdfFooter />

                {/* ── Modals ───────────────────────────────────────────── */}
                <FullscreenModal
                    isOpen={modalContent === "transcript"}
                    onClose={() => setModalContent(null)}
                    title="Counseling Session Transcript"
                >
                    <div className="space-y-4">
                        {structured.turns.map((turn, i) => (
                            <div key={i}>
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-text mb-0.5">
                                    {turn.speaker}
                                </p>
                                <p className="text-sm leading-relaxed text-ink">
                                    {turn.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </FullscreenModal>

                {(["labor_market", "feasibility", "psychological"] as AgentKey[]).map((key) => (
                    <FullscreenModal
                        key={key}
                        isOpen={modalContent === key}
                        onClose={() => setModalContent(null)}
                        title={`${agentData[key].label} · ${agentData[key].framework}`}
                    >
                        <AgentDetailPanel
                            data={agentData[key]}
                            onFullscreen={() => {}}
                            isFullscreen
                        />
                    </FullscreenModal>
                ))}
            </div>
        </>
    );
}