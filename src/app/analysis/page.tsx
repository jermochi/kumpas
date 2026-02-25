"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Circle, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

type StageName =
    | "transcriptionLayer"
    | "laborMarket"
    | "feasibility"
    | "psychological"
    | "verdict";

type AnalysisState =
    | { phase: "processing"; completedStages: StageName[] }
    | { phase: "complete";   report: VerdictReport }
    | { phase: "error";      message: string };

interface StructuredTranscript {
    participants:       { student: string; counselor: string };
    career_path:        string;
    career_path_source: "stated" | "implied" | "derived";
    career_path_note:   string;
    turns:              Array<{ speaker: "Counselor" | "Student"; text: string }>;
}

interface VerdictReport {
    report_metadata: {
        grade_level:  string;
        region:       string;
        generated_by: string;
    };
    confidence_score: number;
    agent_verdicts: {
        labor_market:  { verdict: string; sub_label: string };
        feasibility:   { verdict: string; sub_label: string };
        psychological: { verdict: string; sub_label: string };
    };
    agent_agreement_map: {
        high_agreement_areas: string[];
        tensions: Array<{
            tension_type:   string;
            path_affected:  string;
            description:    string;
            counselor_note: string;
        }>;
    };
    ranked_career_paths: Array<{
        rank:                    number;
        career_path:             string;
        composite_score:         number;
        market_fit_score:        number;
        feasibility_score:       number;
        psychological_fit_score: number;
        insufficient_data:       boolean;
        recommendation_type:     "PRIMARY" | "ALTERNATIVE";
        rationale:               string;
        key_strengths:           string[];
        key_risks:               string[];
        risk_mitigations:        string[];
    }>;
    roadmap: Array<{
        phase:    number;
        label:    string;
        timeline: string;
        title:    string;
        actions:  string[];
    }>;
    scholarships: Array<{
        name:             string;
        provider:         string;
        eligibility_note: string;
        how_to_apply:     string;
    }>;
    analyst_note:             string;
    analyst_note_attribution: string;
    overall_verdict:          string;
    counselor_talking_points: string[];
}

interface StoredSession {
    rawTranscript: string;
    createdAt:     string;
}

const STAGE_META: Record<StageName, { label: string; description: string }> = {
    transcriptionLayer: {
        label:       "Transcription Layer",
        description: "Redacting session and detecting career path...",
    },
    laborMarket: {
        label:       "Labor Market Analyst",
        description: "Mapping career paths to PH market demand...",
    },
    feasibility: {
        label:       "Feasibility Analyst",
        description: "Evaluating real-world barriers and constraints...",
    },
    psychological: {
        label:       "Psychological Analyst",
        description: "Extracting genuine interests and aptitudes...",
    },
    verdict: {
        label:       "Verdict Generator",
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

export default function AnalysisPage() {
    const [state, setState] = useState<AnalysisState>({
        phase:           "processing",
        completedStages: [],
    });

    const searchParams = useSearchParams();
    const router       = useRouter();
    const sessionId    = searchParams.get("session");

    const runPipeline = useCallback(async () => {
        if (!sessionId) {
            setState({ phase: "error", message: "No session ID found. Please start a new session." });
            return;
        }

        const raw = sessionStorage.getItem(`kumpas-session-${sessionId}`);
        if (!raw) {
            setState({ phase: "error", message: "Session expired or not found. Please start again." });
            return;
        }

        const session = JSON.parse(raw) as StoredSession;
        setState({ phase: "processing", completedStages: [] });

        try {
            const tlRes = await fetch("/api/transcription-layer", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ transcript: session.rawTranscript }),
            });
            if (!tlRes.ok) throw new Error("Transcription layer failed");
            const structured = await tlRes.json() as StructuredTranscript;

            setState({ phase: "processing", completedStages: ["transcriptionLayer"] });

            // Flatten redacted turns, plain text for specialist agents
            const redactedText = structured.turns
                .map((t) => `${t.speaker}: ${t.text}`)
                .join("\n");

            const [labor, feasibility, psychological] = await Promise.all([
                fetch("/api/analyze/labor", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ transcript: redactedText }),
                }).then((r) => r.json()),

                fetch("/api/analyze/feasibility", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ transcript: redactedText }),
                }).then((r) => r.json()),

                fetch("/api/analyze/psychological", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ transcript: redactedText }),
                }).then((r) => r.json()),
            ]);

            setState({
                phase:           "processing",
                completedStages: ["transcriptionLayer", "laborMarket", "feasibility", "psychological"],
            });

            // Works exclusively from the 3 agent outputs — never sees the raw transcript
            const verdictRes = await fetch("/api/analyze/verdict", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    career_path:        structured.career_path,
                    career_path_source: structured.career_path_source,
                    labor,
                    feasibility,
                    psychological,
                }),
            });
            if (!verdictRes.ok) throw new Error("Verdict generation failed");
            const report = await verdictRes.json() as VerdictReport;

            // All 5 stages complete
            setState({ phase: "processing", completedStages: STAGE_ORDER });
            await new Promise((r) => setTimeout(r, 500));

            // Cache for back-navigation
            sessionStorage.setItem(`kumpas-report-${sessionId}`, JSON.stringify(report));

            setState({ phase: "complete", report });

        } catch (err) {
            console.error("Pipeline error:", err);
            setState({
                phase:   "error",
                message: err instanceof Error ? err.message : "Analysis failed. Please try again.",
            });
        }
    }, [sessionId]);

    useEffect(() => {
        if (sessionId) {
            const cached = sessionStorage.getItem(`kumpas-report-${sessionId}`);
            if (cached) {
                setState({ phase: "complete", report: JSON.parse(cached) as VerdictReport });
                return;
            }
        }
        runPipeline();
    }, [runPipeline, sessionId]);

    return (
        <main className="min-h-screen bg-background">
            {state.phase === "processing" && (
                <ProcessingView completedStages={state.completedStages} />
            )}
            {state.phase === "complete" && (
                <ReportView report={state.report} />
            )}
            {state.phase === "error" && (
                <ErrorView
                    message={state.message}
                    onRetry={runPipeline}
                    onBack={() => router.push("/")}
                />
            )}
        </main>
    );
}

function ProcessingView({ completedStages }: { completedStages: StageName[] }) {
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
                    const done    = completedStages.includes(stage);
                    const running = stage === currentStage;

                    return (
                        <div
                            key={stage}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                                done
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

function ReportView({ report }: { report: VerdictReport }) {
    const primary      = report.ranked_career_paths.find((p) => p.recommendation_type === "PRIMARY");
    const alternatives = report.ranked_career_paths.filter((p) => p.recommendation_type === "ALTERNATIVE");

    return (
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-12 sm:px-6">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">
                        Kumpas · Final Verdict
                    </p>
                    <h1 className="mt-1 text-2xl font-bold leading-tight text-ink">
                        Career Decision<br />
                        <span className="font-light italic">Intelligence Report</span>
                    </h1>
                    <p className="mt-1 text-xs text-muted-text">{report.report_metadata.generated_by}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-text">Confidence Score</p>
                    <p className="text-4xl font-bold text-ink">
                        {report.confidence_score}
                        <span className="text-lg font-normal text-muted-text">/100</span>
                    </p>
                </div>
            </div>

            {/* §01 Primary recommendation */}
            {primary && (
                <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-card">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-text">
                        §01 · Primary Recommendation
                    </p>
                    <h2 className="text-xl font-semibold text-ink">{primary.career_path}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-text">{primary.rationale}</p>

                    <div className="mt-4 flex gap-2">
                        {[
                            { label: "Market",   score: primary.market_fit_score },
                            { label: "Feasible", score: primary.feasibility_score },
                            { label: "Psych",    score: primary.psychological_fit_score },
                        ].map(({ label, score }) => (
                            <div key={label} className="flex flex-1 flex-col items-center rounded-xl bg-black/[0.03] py-2">
                                <span className="text-lg font-bold text-ink">{score}</span>
                                <span className="text-xs text-muted-text">{label}</span>
                            </div>
                        ))}
                        <div className="flex flex-1 flex-col items-center rounded-xl bg-forest/10 py-2">
                            <span className="text-lg font-bold text-forest">{primary.composite_score}</span>
                            <span className="text-xs text-muted-text">Composite</span>
                        </div>
                    </div>

                    {primary.key_risks.length > 0 && (
                        <div className="mt-4 space-y-1">
                            <p className="text-xs font-semibold text-muted-text">Key risks</p>
                            {primary.key_risks.map((risk, i) => (
                                <p key={i} className="text-xs text-muted-text before:mr-1.5 before:content-['·']">{risk}</p>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* §02 Agent verdicts */}
            <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-card">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-text">
                    §02 · Agent Verdicts
                </p>
                <div className="grid grid-cols-3 gap-3">
                    {(
                        [
                            { key: "labor_market",  label: "Labor Market" },
                            { key: "feasibility",   label: "Feasibility" },
                            { key: "psychological", label: "Psychological" },
                        ] as const
                    ).map(({ key, label }) => (
                        <div key={key} className="rounded-xl bg-black/[0.03] p-3">
                            <p className="text-xs font-medium text-muted-text">{label}</p>
                            <p className="mt-1 text-sm font-semibold text-ink">
                                {report.agent_verdicts[key].verdict}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-text">
                                {report.agent_verdicts[key].sub_label}
                            </p>
                        </div>
                    ))}
                </div>

                {report.agent_agreement_map.tensions.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-muted-text">Tensions detected</p>
                        {report.agent_agreement_map.tensions.map((t, i) => (
                            <div key={i} className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                                <p className="text-xs font-semibold text-amber-700">{t.tension_type}</p>
                                <p className="mt-0.5 text-xs text-amber-600">{t.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {report.agent_agreement_map.high_agreement_areas.length > 0 && (
                    <div className="mt-4 rounded-xl bg-forest/[0.04] px-4 py-3">
                        <p className="mb-1 text-xs font-semibold text-forest">All agents agree</p>
                        {report.agent_agreement_map.high_agreement_areas.map((area, i) => (
                            <p key={i} className="text-xs text-muted-text before:mr-1.5 before:content-['·']">{area}</p>
                        ))}
                    </div>
                )}
            </section>

            {/* §03 Roadmap */}
            <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-card">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-text">
                    §03 · Implementation Roadmap
                </p>
                <div className="space-y-4">
                    {report.roadmap.map((step) => (
                        <div key={step.phase} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                                    {step.phase}
                                </div>
                                {step.phase < report.roadmap.length && (
                                    <div className="mt-1 w-px flex-1 bg-black/10" />
                                )}
                            </div>
                            <div className="pb-4">
                                <p className="text-xs font-semibold text-muted-text">
                                    {step.label} · {step.timeline}
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-ink">{step.title}</p>
                                <ul className="mt-1.5 space-y-1">
                                    {step.actions.map((action, i) => (
                                        <li key={i} className="text-xs text-muted-text before:mr-1.5 before:content-['·']">
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* §04 Analyst's note */}
            <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-card">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-text">
                    §04 · Analyst&apos;s Note
                </p>
                <blockquote className="border-l-2 border-forest pl-4 text-sm italic leading-relaxed text-ink">
                    &ldquo;{report.analyst_note}&rdquo;
                </blockquote>
                <p className="mt-3 text-xs text-muted-text">— {report.analyst_note_attribution}</p>
            </section>

            {/* §05 Overall verdict */}
            <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-card">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-text">
                    §05 · Overall Verdict
                </p>
                <p className="text-sm leading-relaxed text-ink">{report.overall_verdict}</p>

                {report.counselor_talking_points.length > 0 && (
                    <div className="mt-4 rounded-xl bg-black/[0.03] p-4">
                        <p className="mb-2 text-xs font-semibold text-muted-text">Counselor talking points</p>
                        <ul className="space-y-1">
                            {report.counselor_talking_points.map((pt, i) => (
                                <li key={i} className="text-xs text-muted-text before:mr-1.5 before:content-['·']">
                                    {pt}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {/* Alternative paths */}
            {alternatives.length > 0 && (
                <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-card">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-text">
                        Alternative Paths
                    </p>
                    <div className="space-y-3">
                        {alternatives.map((path) => (
                            <div key={path.rank} className="rounded-xl bg-black/[0.03] p-4">
                                <div className="flex items-start justify-between">
                                    <p className="text-sm font-medium text-ink">{path.career_path}</p>
                                    <span className="ml-3 shrink-0 rounded-full bg-black/[0.06] px-2 py-0.5 text-xs text-muted-text">
                                        {path.composite_score}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-muted-text">{path.rationale}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Scholarships */}
            {report.scholarships.length > 0 && (
                <section className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-card">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-text">
                        Scholarships
                    </p>
                    <div className="space-y-3">
                        {report.scholarships.map((s, i) => (
                            <div key={i} className="rounded-xl bg-black/[0.03] p-4">
                                <div className="flex items-start justify-between">
                                    <p className="text-sm font-medium text-ink">{s.name}</p>
                                    <span className="ml-3 shrink-0 text-xs text-muted-text">{s.provider}</span>
                                </div>
                                <p className="mt-1 text-xs text-muted-text">{s.eligibility_note}</p>
                                <a
                                    href={s.how_to_apply}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 block text-xs text-forest underline"
                                >
                                    {s.how_to_apply}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="pb-8">
                <button
                    onClick={() => window.location.href = "/"}
                    className="w-full rounded-xl border border-black/10 bg-white py-3 text-sm font-medium text-ink transition-colors hover:bg-black/[0.03]"
                >
                    New Session
                </button>
            </div>
        </div>
    );
}

function ErrorView({ message, onRetry, onBack }: {
    message: string;
    onRetry: () => void;
    onBack:  () => void;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertCircle size={28} />
            </div>
            <div>
                <p className="text-base font-medium text-ink">Analysis failed</p>
                <p className="mt-1.5 max-w-sm text-sm text-muted-text">{message}</p>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-ink hover:bg-black/[0.03]"
                >
                    <ArrowLeft size={15} /> Start over
                </button>
                <button
                    onClick={onRetry}
                    className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-forest"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}