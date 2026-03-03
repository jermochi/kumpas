"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import type { AdjacentCareerReport, SessionIntakeOutput, AgentKey, AgentPanelData } from "@/lib/analysis-types";
import { buildRelatedCareers } from "@/lib/analysis-helpers";

import ScoreCardsRow from "@/components/analysis/score-cards-row";
import AgentDetailPanel from "@/components/analysis/agent-detail-panel";
import ScoreBreakdown from "@/components/analysis/score-breakdown";
import SessionNotesPanel from "@/components/analysis/session-notes-panel";
import RelatedCareersPanel from "@/components/analysis/related-careers-panel";
import PdfFooter from "@/components/analysis/pdf-footer";
import FullscreenModal from "@/components/analysis/fullscreen-modal";
import PdfModal from "@/components/analysis/pdf-modal";
import { PdfDocument } from "@/components/analysis/pdf-document";

interface ReportViewProps {
    report: AdjacentCareerReport;
    sessionIntake: SessionIntakeOutput;
    counselorNotes: string;
    agentData: Record<AgentKey, AgentPanelData>;
    onNewSession: () => void;
}

export default function ReportView({ report, sessionIntake, counselorNotes, agentData, onNewSession }: ReportViewProps) {
    const [activeAgent, setActiveAgent] = useState<AgentKey>("labor_market");
    const [modalContent, setModalContent] = useState<"transcript" | AgentKey | null>(null);

    // PDF Generation State
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const pdfContentRef = useRef<HTMLDivElement>(null);

    const handleGeneratePdf = async () => {
        if (!pdfContentRef.current) return;
        setIsGeneratingPdf(true);
        try {
            // Dynamically import html2pdf to avoid SSR issues
            // @ts-ignore
            const html2pdf = (await import("html2pdf.js")).default;
            const element = pdfContentRef.current;

            const opt = {
                margin: 0,
                filename: `Kumpas_Assessment_${sessionIntake.career_goal.title || "Report"}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    // Remove all external/global stylesheets from the cloned document
                    onclone: (clonedDoc: Document) => {
                        const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
                        styles.forEach(s => s.remove());
                    }
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            };

            const pdfBlobUrl = await html2pdf().set(opt).from(element).output('bloburl');
            setPdfBlobUrl(pdfBlobUrl);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const relatedCareers = useMemo(() => buildRelatedCareers(report), [report]);

    const scores: Record<AgentKey, number> = {
        feasibility: agentData.feasibility.score,
        labor_market: agentData.labor_market.score,
        job_demand: agentData.job_demand.score,
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
        feasibility: agentData.feasibility.verdict,
        labor_market: agentData.labor_market.verdict,
        job_demand: agentData.job_demand.verdict,
    };

    const formattedNotes = counselorNotes.replace(/(?!^)<h3>/g, '<br><h3>');

    return (
        <>
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 space-y-6">

                {/* ── Header ──────────────────────────────────────────── */}
                <header>
                    {/* Eyebrow */}
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-text">
                        Career Assessment · Session Output
                    </p>

                    {/* h1 + button on the same baseline row */}
                    <div className="mt-1 flex items-baseline justify-between gap-4">
                        <h1 className="font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
                            Assessment for{" "}
                            <em className="text-forest">{sessionIntake.career_goal.title || "Career"}</em>
                        </h1>

                        {/* New Session — sits on the h1 baseline, calm secondary style */}
                        <button
                            onClick={onNewSession}
                            className="
                                flex shrink-0 items-center gap-1.5
                                rounded-lg border border-black/[0.1]
                                bg-white
                                px-3.5 py-2
                                text-xs font-semibold uppercase tracking-wider
                                text-muted-text
                                transition-all duration-150
                                hover:border-black/[0.18] hover:text-ink hover:shadow-sm
                                active:scale-[0.97]
                                cursor-pointer
                            "
                        >
                            <RotateCcw size={12} strokeWidth={2.5} />
                            New Session
                        </button>
                    </div>

                    {/* Frameworks line */}
                    <p className="mt-1 text-xs text-muted-text">
                        Three agents ·{" "}
                        <span className="font-semibold text-ink">SCCT</span> ·{" "}
                        <span className="font-semibold text-ink">LMI Framework</span> ·{" "}
                        <span className="font-semibold text-ink">JD-R Model</span>
                    </p>
                </header>

                {/* ── Score Cards Row ──────────────────────────────────── */}
                <ScoreCardsRow
                    verdicts={verdicts}
                    scores={scores}
                    activeAgent={activeAgent}
                    onSelect={setActiveAgent}
                />

                {/* ── Score Breakdown ──────────────────────────────────── */}
                <ScoreBreakdown data={activePanel.scoreBreakdown} />

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
                        <SessionNotesPanel
                            notes={counselorNotes}
                            onFullscreen={() => setModalContent("transcript")}
                            className="flex-1 min-h-0"
                        />
                        <RelatedCareersPanel careers={relatedCareers} />
                    </div>
                </div>

                {/* ── PDF Footer ───────────────────────────────────────── */}
                <PdfFooter
                    onGenerate={handleGeneratePdf}
                    isGenerating={isGeneratingPdf}
                />

                {/* ── Hidden Printable PDF Content ─────────────────────── */}
                <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                    <PdfDocument
                        ref={pdfContentRef}
                        report={report}
                        sessionIntake={sessionIntake}
                        counselorNotes={counselorNotes}
                        agentData={agentData}
                    />
                </div>

                {/* ── Modals ───────────────────────────────────────────── */}

                <PdfModal
                    isOpen={!!pdfBlobUrl}
                    onClose={() => setPdfBlobUrl(null)}
                    pdfUrl={pdfBlobUrl}
                />

                {/* Counselor Notes Modal */}
                <FullscreenModal
                    isOpen={modalContent === "transcript"}
                    onClose={() => setModalContent(null)}
                    title="Counseling Session Notes"
                >
                    <div
                        className="[&_h3]:text-xs [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:text-muted-text [&_h3]:mb-1 [&_h3]:mt-6 first:[&_h3]:mt-0 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-ink [&_p]:mb-4 last:[&_p]:mb-0 [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:text-sm [&_li]:text-ink [&_li]:mb-1"
                        dangerouslySetInnerHTML={{ __html: formattedNotes }}
                    />
                </FullscreenModal>

                {(["feasibility", "labor_market", "job_demand"] as AgentKey[]).map((key) => (
                    <FullscreenModal
                        key={key}
                        isOpen={modalContent === key}
                        onClose={() => setModalContent(null)}
                        title={`${agentData[key].label} · ${agentData[key].framework}`}
                    >
                        <AgentDetailPanel
                            data={agentData[key]}
                            onFullscreen={() => { }}
                            isFullscreen
                        />
                    </FullscreenModal>
                ))}
            </div>
        </>
    );
}