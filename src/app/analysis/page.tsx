"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import LoadingScreen from "@/components/analysis/loading-screen";
import DashboardAnalysis from "@/components/analysis/dashboard/detailed-analysis";

import type {
    AnalysisState,
    StructuredTranscript,
    AdjacentCareerReport,
    StoredSession,
} from "@/lib/analysis-types";

import ProcessingView, { STAGE_ORDER } from "@/components/analysis/processing-view";
import ReportView from "@/components/analysis/report-view";
import ErrorView from "@/components/analysis/error-view";

// ─── Inner component (needs useSearchParams) ───────────────────────
function AnalysisContent() {
    const [state, setState] = useState<AnalysisState>({
        phase: "processing",
        completedStages: [],
    });

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

            setState({ phase: "processing", completedStages: ["transcriptionLayer"] });

            // Persist structured transcript for the report UI
            sessionStorage.setItem(
                `kumpas-structured-${sessionId}`,
                JSON.stringify(structured),
            );

            // Flatten redacted turns for specialist agents
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

            setState({
                phase: "processing",
                completedStages: ["transcriptionLayer", "laborMarket", "feasibility", "psychological"],
            });

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

            // All 5 stages complete
            setState({ phase: "processing", completedStages: STAGE_ORDER });
            await new Promise((r) => setTimeout(r, 500));

            // Cache for back-navigation
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
        }
        runPipeline();
    }, [runPipeline, sessionId]);

    return (
        <main className="min-h-screen bg-background">
            {state.phase === "processing" && (
                <ProcessingView completedStages={state.completedStages} />
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

// ─── Page wrapper with Suspense ─────────────────────────────────────
export default function AnalysisPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-background">
                    <Loader2 size={24} className="animate-spin text-muted-text" />
                </main>
            }
        >
            <AnalysisContent />
        </Suspense>
    );
}
'use client';

// export default function Page() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [projectData, setProjectData] = useState({});
//   const searchParams = useSearchParams();
//   const sessionId = searchParams.get("session");
//   const router = useRouter();

//   useEffect(() => {
//     const savedProjectData = sessionStorage.getItem(`kumpas-session-${sessionId}`);
//     if (savedProjectData) {
//       const parsedData = JSON.parse(savedProjectData);
//       setProjectData(parsedData);
//     } else {
//       router.push("/");
//     }
//   }, [router]);

//   return (
//     <>
//       { isLoading 
//         ? <LoadingScreen finishLoading={() => setIsLoading(false)} /> 
//         : <DashboardAnalysis data={projectData} /> }
//     </>
//   );
// }