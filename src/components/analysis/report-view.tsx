"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { AdjacentCareerReport, StructuredTranscript, AgentKey } from "@/lib/analysis-types";
import { buildAgentPanels, buildRelatedCareers } from "@/lib/analysis-helpers";

import ScoreCardsRow from "@/components/analysis/score-cards-row";
import AgentDetailPanel from "@/components/analysis/agent-detail-panel";
import TranscriptPanel from "@/components/analysis/transcript-panel";
import RelatedCareersPanel from "@/components/analysis/related-careers-panel";
import PdfFooter from "@/components/analysis/pdf-footer";
import FullscreenModal from "@/components/analysis/fullscreen-modal";

interface ReportViewProps {
    report: AdjacentCareerReport;
    structured: StructuredTranscript;
}

export default function ReportView({ report, structured }: ReportViewProps) {
    const [activeAgent, setActiveAgent] = useState<AgentKey>("labor_market");
    const [modalContent, setModalContent] = useState<"transcript" | AgentKey | null>(null);

    const agentPanels = useMemo(() => buildAgentPanels(), []);
    const relatedCareers = useMemo(() => buildRelatedCareers(report), [report]);

    const wordCount = structured.turns.reduce((n, t) => n + t.text.split(/\s+/).length, 0);

    const scores: Record<AgentKey, number> = {
        labor_market: agentPanels.labor_market.score,
        feasibility: agentPanels.feasibility.score,
        psychological: agentPanels.psychological.score,
    };

    const activePanel = agentPanels[activeAgent];

    const leftRef = useRef<HTMLDivElement>(null);
    const [sidebarMaxH, setSidebarMaxH] = useState<number | undefined>(undefined);

    /* Sync right column max-height to left column's rendered height */
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
        labor_market: agentPanels.labor_market.verdict,
        feasibility: agentPanels.feasibility.verdict,
        psychological: agentPanels.psychological.verdict,
    };

    return (
        <>
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 space-y-6">

                {/* ── Header ──────────────────────────────────────────── */}
                <header>
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

                    {/* Left — drives the height */}
                    <div ref={leftRef}>
                        <AgentDetailPanel
                            data={activePanel}
                            onFullscreen={() => setModalContent(activeAgent)}
                        />
                    </div>

                    {/* Right — capped to left column's height */}
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

                {/* Transcript Modal */}
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

                {/* Agent Detail Modals — fullscreen shows all data */}
                {(["labor_market", "feasibility", "psychological"] as AgentKey[]).map((key) => (
                    <FullscreenModal
                        key={key}
                        isOpen={modalContent === key}
                        onClose={() => setModalContent(null)}
                        title={`${agentPanels[key].label} · ${agentPanels[key].framework}`}
                    >
                        <AgentDetailPanel
                            data={agentPanels[key]}
                            onFullscreen={() => { }}
                            isFullscreen
                        />
                    </FullscreenModal>
                ))}
            </div>
        </>
    );
}
