"use client";

import { useEffect, useState, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import LoadingScreen from "@/components/analysis/loading-screen";

import type {
    AnalysisState,
    SessionIntakeOutput,
    AdjacentCareerReport,
    StoredSession,
    RawAgentResponse,
} from "@/lib/analysis-types";
import { buildAgentPanels } from "@/lib/analysis-helpers";

import { STAGE_ORDER } from "@/components/analysis/processing-view";
import ReportView from "@/components/analysis/report-view";
import ErrorView from "@/components/analysis/error-view";

function AnalysisContent() {
    const [state, setState] = useState<AnalysisState>({
        phase: "processing",
        completedStages: [],
    });
    const [sessionData, setSessionData] = useState<any>(null);
    const hasRun = useRef(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session");

    const onNewSession = useCallback(() => {
        router.push("/");
    }, [router]);

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
            // ── Stage 1: Session Intake Layer ────────────────────────
            let sessionIntake: SessionIntakeOutput | null = null;
            if (session.parentSessionId) {
                const parentSessionIntakeStr = sessionStorage.getItem(`kumpas-session-intake-${session.parentSessionId}`);
                if (parentSessionIntakeStr) {
                    sessionIntake = JSON.parse(parentSessionIntakeStr);
                }
            }

            if (!sessionIntake) {
                console.log("Session Intake API called");
                const tlRes = await fetch("/api/transcription-layer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        counselorNotes: session.counselorNotes,
                        extractedDocuments: session.extractedDocuments
                    }),
                });
                if (!tlRes.ok) {
                    const errData = await tlRes.json().catch(() => null);
                    throw new Error(errData?.error || "Session Intake layer failed");
                }
                sessionIntake = (await tlRes.json()) as SessionIntakeOutput;
            }

            // Override the career title in sessionIntake so ReportView shows the correct title
            if (session.careerOverride) {
                if (!session.originalCareer) {
                    session.originalCareer = sessionIntake.career_goal.title;
                    sessionStorage.setItem(`kumpas-session-${sessionId}`, JSON.stringify(session));
                }
                sessionIntake.career_goal.title = session.careerOverride;
                sessionIntake.career_goal.source = "derived";
            }

            setState(prev => ({ ...prev, completedStages: ["transcriptionLayer"] }));

            sessionStorage.setItem(
                `kumpas-session-intake-${sessionId}`,
                JSON.stringify(sessionIntake),
            );

            // ── Stage 2–4: Three agents in parallel ─────────────────
            const careerPathTitle = session.careerOverride || sessionIntake.career_goal.title;
            const structuredStr = JSON.stringify(sessionIntake);

            const [laborRes, feasibilityRes, psychologicalRes] = await Promise.all([
                fetch("/api/analyze/labor", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionIntakeOutput: structuredStr, careerPathTitle }),
                }).then((r) => r.json()),

                fetch("/api/analyze/feasibility", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionIntakeOutput: structuredStr, careerPathTitle }),
                }).then((r) => r.json()),

                fetch("/api/analyze/psychological", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionIntakeOutput: structuredStr, careerPathTitle }),
                }).then((r) => r.json()),
            ]);

            if (laborRes.error) throw new Error(laborRes.error);
            if (feasibilityRes.error) throw new Error(feasibilityRes.error);
            if (psychologicalRes.error) throw new Error(psychologicalRes.error);

            const labor = laborRes.data;
            const feasibility = feasibilityRes.data;
            const psychological = psychologicalRes.data;

            setState(prev => ({
                ...prev,
                completedStages: ["transcriptionLayer", "laborMarket", "feasibility", "psychological"],
            }));

            // ── Stage 5: Verdict ────────────────────────────────────
            const verdictRes = await fetch("/api/analyze/verdict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    career_path: session.careerOverride || sessionIntake.career_goal.title,
                    career_path_source: session.careerOverride ? "derived" : sessionIntake.career_goal.source,
                    labor,
                    feasibility,
                    psychological,
                }),
            });
            if (!verdictRes.ok) throw new Error("Verdict generation failed");
            const report = await verdictRes.json() as AdjacentCareerReport;

            // Prepend original career to allow navigating back
            if (session.originalCareer && session.originalCareer !== sessionIntake.career_goal.title) {
                const alreadyExists = report.related_careers.some(c => c.career_path === session.originalCareer);
                if (!alreadyExists) {
                    report.related_careers.unshift({
                        career_path: session.originalCareer,
                        composite_score: 100,
                        demand_status: "Stable",
                        rationale: "Return to your original career assessment.",
                    });
                }
            }

            const agentData = buildAgentPanels(labor, feasibility, psychological);

            setState(prev => ({ ...prev, completedStages: ["transcriptionLayer", "laborMarket", "feasibility", "psychological", "verdict"] }));
            // Give the UI a moment to show 100% completion before switching
            await new Promise((r) => setTimeout(r, 1000));

            sessionStorage.setItem(`kumpas-report-${sessionId}`, JSON.stringify(report));
            sessionStorage.setItem(`kumpas-agent-data-${sessionId}`, JSON.stringify(agentData));

            setState({ phase: "complete", report, sessionIntake, agentData });

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
            const cachedSessionIntake = sessionStorage.getItem(`kumpas-session-intake-${sessionId}`);
            const cachedAgentData = sessionStorage.getItem(`kumpas-agent-data-${sessionId}`);

            if (cachedReport && cachedSessionIntake && cachedAgentData) {
                setState({
                    phase: "complete",
                    report: JSON.parse(cachedReport) as AdjacentCareerReport,
                    sessionIntake: JSON.parse(cachedSessionIntake) as SessionIntakeOutput,
                    agentData: JSON.parse(cachedAgentData),
                });
                return;
            }
        } else {
            router.push("/");
            return;
        }

        if (hasRun.current) return;
        hasRun.current = true;

        runPipeline();
    }, [runPipeline, sessionId, router]);

    return (
        <main className="min-h-screen bg-background">
            {state.phase === "processing" && (
                <LoadingScreen completedStages={state.completedStages} />
            )}
            {state.phase === "complete" && (
                <ReportView report={state.report} sessionIntake={state.sessionIntake} counselorNotes={sessionData?.counselorNotes || ""} agentData={state.agentData} onNewSession={onNewSession} />
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