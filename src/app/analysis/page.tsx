"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import LoadingScreen from "@/components/analysis/loading-screen";

import type {
    AnalysisState,
    StructuredTranscript,
    AdjacentCareerReport,
    StoredSession,
} from "@/lib/analysis-types";

import { STAGE_ORDER } from "@/components/analysis/processing-view";
import ReportView from "@/components/analysis/report-view";
import ErrorView from "@/components/analysis/error-view";

function AnalysisContent() {
    const [state, setState] = useState<AnalysisState>({
        phase: "processing",
        completedStages: [],
    });
    const [sessionData, setSessionData] = useState<any>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session");

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
        setSessionData(session);
        setState({ phase: "processing", completedStages: [] });

        try {
            // ── Stage 1: Transcription Layer ────────────────────────
            const tlRes = await fetch("/api/transcription-layer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: session.rawTranscript }),
            });
            if (!tlRes.ok) throw new Error("Transcription layer failed");
            const structured = await tlRes.json() as StructuredTranscript;

            setState(prev => ({ ...prev, completedStages: ["transcriptionLayer"] }));

            sessionStorage.setItem(
                `kumpas-structured-${sessionId}`,
                JSON.stringify(structured),
            );

            const redactedText = structured.turns
                .map((t) => `${t.speaker}: ${t.text}`)
                .join("\n");

            // ── Stage 2–4: Three agents in parallel ─────────────────
            const careerPathTitle = structured.career_path;

            const [labor, feasibility, psychological] = await Promise.all([
                fetch("/api/analyze/labor", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transcript: redactedText, careerPathTitle }),
                }).then((r) => r.json()),

                fetch("/api/analyze/feasibility", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transcript: redactedText, careerPathTitle }),
                }).then((r) => r.json()),

                fetch("/api/analyze/psychological", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transcript: redactedText, careerPathTitle }),
                }).then((r) => r.json()),
            ]);

            setState(prev => ({
                ...prev,
                completedStages: ["transcriptionLayer", "laborMarket", "feasibility", "psychological"],
            }));

            // ── Stage 5: Verdict ────────────────────────────────────
            const verdictRes = await fetch("/api/analyze/verdict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    career_path: structured.career_path,
                    career_path_source: structured.career_path_source,
                    labor,
                    feasibility,
                    psychological,
                }),
            });
            if (!verdictRes.ok) throw new Error("Verdict generation failed");
            const report = await verdictRes.json() as AdjacentCareerReport;

            setState(prev => ({ ...prev, completedStages: ["transcriptionLayer", "laborMarket", "feasibility", "psychological", "verdict"] }));
            // Give the UI a moment to show 100% completion before switching
            await new Promise((r) => setTimeout(r, 1000));

            sessionStorage.setItem(`kumpas-report-${sessionId}`, JSON.stringify(report));

            setState({ phase: "complete", report, structured });

        } catch (err) {
            console.error("Pipeline error:", err);
            setState({
                phase: "error",
                message: err instanceof Error ? err.message : "Analysis failed. Please try again.",
            });
        }
    }, [sessionId]);

    useEffect(() => {
        if (sessionId) {
            const raw = sessionStorage.getItem(`kumpas-session-${sessionId}`);
            if (raw) setSessionData(JSON.parse(raw));

            const cachedReport = sessionStorage.getItem(`kumpas-report-${sessionId}`);
            const cachedStructured = sessionStorage.getItem(`kumpas-structured-${sessionId}`);

            if (cachedReport && cachedStructured) {
                setState({
                    phase: "complete",
                    report: JSON.parse(cachedReport) as AdjacentCareerReport,
                    structured: JSON.parse(cachedStructured) as StructuredTranscript,
                });
                return;
            }
        } else {
          router.push("/");
        }
        runPipeline();
    }, [runPipeline, sessionId]);

    return (
        <main className="min-h-screen bg-background">
            {state.phase === "processing" && (
                <LoadingScreen completedStages={state.completedStages} />
            )}
            {state.phase === "complete" && (
                <ReportView report={state.report} structured={state.structured} />
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

export default function Page() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-[60vh] items-center justify-center bg-background">
                    <Loader2 size={24} className="animate-spin text-muted-text" />
                </main>
            }
        >
            <AnalysisContent />
        </Suspense>
    );
}