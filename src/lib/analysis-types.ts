// ─── Transcription Layer ────────────────────────────────────────────
export interface StructuredTranscript {
    participants: { student: string; counselor: string };
    career_path: string;
    career_path_source: "stated" | "implied" | "derived";
    career_path_note: string;
    turns: TranscriptTurn[];
}

export interface TranscriptTurn {
    speaker: "Counselor" | "Student";
    text: string;
}

// ─── Verdict Report ─────────────────────────────────────────────────
export interface VerdictReport {
    report_metadata: {
        grade_level: string;
        region: string;
        generated_by: string;
    };
    confidence_score: number;
    agent_verdicts: {
        labor_market: AgentVerdict;
        feasibility: AgentVerdict;
        psychological: AgentVerdict;
    };
    agent_agreement_map: {
        high_agreement_areas: string[];
        tensions: AgentTension[];
    };
    ranked_career_paths: RankedCareerPath[];
    roadmap: RoadmapPhase[];
    scholarships: Scholarship[];
    analyst_note: string;
    analyst_note_attribution: string;
    overall_verdict: string;
    counselor_talking_points: string[];
}

export interface AgentVerdict {
    verdict: string;
    sub_label: string;
}

export interface AgentTension {
    tension_type: string;
    path_affected: string;
    description: string;
    counselor_note: string;
}

export interface RankedCareerPath {
    rank: number;
    career_path: string;
    composite_score: number;
    market_fit_score: number;
    feasibility_score: number;
    psychological_fit_score: number;
    insufficient_data: boolean;
    recommendation_type: "PRIMARY" | "ALTERNATIVE";
    rationale: string;
    key_strengths: string[];
    key_risks: string[];
    risk_mitigations: string[];
}

export interface RoadmapPhase {
    phase: number;
    label: string;
    timeline: string;
    title: string;
    actions: string[];
}

export interface Scholarship {
    name: string;
    provider: string;
    eligibility_note: string;
    how_to_apply: string;
}

// ─── Agent Detail Panel (dummy-data shape) ──────────────────────────
export type AgentKey = "labor_market" | "feasibility" | "psychological";

export interface AgentPanelData {
    key: AgentKey;
    label: string;
    framework: string;
    frameworkCite: string;
    score: number;
    verdict: string;
    keySignals: KeySignal[];
    summary: string;
    supportingData: SupportingRow[];
}

export interface KeySignal {
    icon: "up" | "down" | "neutral";
    label: string;
    value: string;
    subNote?: string;
}

export interface SupportingRow {
    icon: "up" | "down" | "neutral";
    label: string;
    value: string;
}

// ─── Pipeline State ─────────────────────────────────────────────────
export type StageName =
    | "transcriptionLayer"
    | "laborMarket"
    | "feasibility"
    | "psychological"
    | "verdict";

export type AnalysisState =
    | { phase: "processing"; completedStages: StageName[] }
    | { phase: "complete"; report: VerdictReport; structured: StructuredTranscript }
    | { phase: "error"; message: string };

export interface StoredSession {
    rawTranscript: string;
    createdAt: string;
}
