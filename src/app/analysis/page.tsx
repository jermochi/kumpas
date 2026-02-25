"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Circle, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

type StageName = "transcriptionLayer" | "laborMarket" | "feasibility" | "psychological";

type AnalysisState =
    | { phase: "processing"; completedStages: StageName[] }
    | { phase: "complete"; results: AgentResults }
    | { phase: "error"; message: string };

interface StructuredTranscript {
    participants:        { student: string; counselor: string };
    career_path:         string;
    career_path_source:  "stated" | "implied" | "derived";
    career_path_note:    string;
    turns:               Array<{ speaker: "Counselor" | "Student"; text: string }>;
}

interface AgentResults {
    structured:    StructuredTranscript;
    labor:         unknown;
    feasibility:   unknown;
    psychological: unknown;
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
};

const STAGE_ORDER: StageName[] = [
    "transcriptionLayer",
    "laborMarket",
    "feasibility",
    "psychological",
];


export default function AnalysisPage() {
    const [state, setState] = useState<AnalysisState>({
        phase: "processing",
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
            // ── Step 1: Transcription layer (redaction + career path detection) ──
            const tlRes = await fetch("/api/transcription-layer", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ transcript: session.rawTranscript }),
            });

            if (!tlRes.ok) throw new Error("Transcription layer failed");

            const jsonResponse = await tlRes.json();
            const structured = (jsonResponse.data || jsonResponse) as StructuredTranscript;

            if (!structured || !Array.isArray(structured.turns)) {
                throw new Error("The transcription agent returned an invalid format.");
            }

            setState({ phase: "processing", completedStages: ["transcriptionLayer"] });

            const redactedMarkdownPayload = `
            # Session Context
            **Identified Career Path:** ${structured.career_path}
            **Source Signal:** ${structured.career_path_source}
            **Analyst Note:** ${structured.career_path_note}

            ---

            ## Redacted Transcript
            ${structured.turns.map((t) => `**${t.speaker}:** ${t.text}`).join("\n\n")}
            `;

            // ── Steps 2–4: Three agents in parallel ───────────────────────────
            const [labor, feasibility, psychological] = await Promise.all([
                fetch("/api/analyze/labor", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ transcript: redactedMarkdownPayload }),
                }).then((r) => r.json()),

                fetch("/api/analyze/feasibility", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ transcript: redactedMarkdownPayload }),
                }).then((r) => r.json()),

                fetch("/api/analyze/psychological", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ transcript: redactedMarkdownPayload }),
                }).then((r) => r.json()),
            ]);

            setState({
                phase: "processing",
                completedStages: ["transcriptionLayer", "laborMarket", "feasibility", "psychological"],
            });

            // Small pause so user sees all stages checked before transition
            await new Promise((r) => setTimeout(r, 600));

            const results: AgentResults = { structured, labor, feasibility, psychological };

            // Cache for back-navigation
            sessionStorage.setItem(
                `kumpas-results-${sessionId}`,
                JSON.stringify(results)
            );

            setState({ phase: "complete", results });

        } catch (err) {
            console.error("Pipeline error:", err);
            setState({
                phase: "error",
                message: err instanceof Error ? err.message : "Analysis failed. Please try again.",
            });
        }
    }, [sessionId]);

    useEffect(() => {
        // Use cached results if navigating back to this page
        if (sessionId) {
            const cached = sessionStorage.getItem(`kumpas-results-${sessionId}`);
            if (cached) {
                setState({ phase: "complete", results: JSON.parse(cached) as AgentResults });
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
                <ResultsView results={state.results} />
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

// ── Processing view ───────────────────────────────────────────────────────────

function ProcessingView({ completedStages }: { completedStages: StageName[] }) {
    const currentIndex  = completedStages.length;
    const currentStage  = STAGE_ORDER[currentIndex] as StageName | undefined;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
            <div className="text-center">
                <p className="text-base font-medium text-ink">Analyzing session</p>
                <p className="mt-1 text-sm text-muted-text">
                    {currentStage
                        ? STAGE_META[currentStage].description
                        : "Finalizing..."}
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

// ── Results view (placeholder — replace with your ReportView) ─────────────────

function ResultsView({ results }: { results: AgentResults }) {
    return (
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">
                Analysis Complete
            </p>
            <h1 className="mt-1 text-2xl font-bold text-ink">
                {results.structured.career_path}
            </h1>
            <p className="mt-1 text-sm text-muted-text capitalize">
                {results.structured.career_path_source} · {results.structured.career_path_note}
            </p>
            {/* Replace with full ReportView component */}
            <pre className="mt-6 overflow-auto rounded-xl bg-black/[0.03] p-4 text-xs text-ink">
                {JSON.stringify(results, null, 2)}
            </pre>
        </div>
    );
}

// ── Error view ────────────────────────────────────────────────────────────────

function ErrorView({
    message,
    onRetry,
    onBack,
}: {
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