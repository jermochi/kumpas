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

// ─── Adjacent Career Report ─────────────────────────────────────────
export interface AdjacentCareerReport {
    related_careers: RelatedCareer[];
}

export interface RelatedCareer {
    career_path: string;
    composite_score: number;
    demand_status: "In-Demand" | "Emerging" | "Stable";
    rationale: string;
}

// ─── Agent Detail Panel (dummy-data shape) ──────────────────────────
export type AgentKey = "labor_market" | "feasibility" | "psychological";

export interface RawAgentResponse {
    score: number;
    verdict: string;
    key_signals: {
        icon: "up" | "down" | "neutral";
        label: string;
        value: string;
        sub_note?: string;
    }[];
    summary: string;
    supporting_data: {
        icon: "up" | "down" | "neutral";
        label: string;
        value: string;
    }[];
}

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
    | { phase: "complete"; report: AdjacentCareerReport; structured: StructuredTranscript; agentData: Record<AgentKey, AgentPanelData> }
    | { phase: "error"; message: string };

export interface StoredSession {
    rawTranscript: string;
    createdAt: string;
}
