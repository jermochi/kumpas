// ─── Notes Extraction (Gemini Vision) ───────────────────────────────
export interface ExtractedNotes {
    careerGoal: string;
    interests: string;
    financial: string;
    concerns: string;
    impression: string;
}

export const EMPTY_NOTES: ExtractedNotes = {
    careerGoal: "",
    interests: "",
    financial: "",
    concerns: "",
    impression: "",
};

// ─── Session Intake Layer ───────────────────────────────────────────
export interface SessionIntakeOutput {
    career_goal: {
        title: string;
        source: "stated" | "implied" | "derived";
        confidence: "High" | "Medium" | "Low";
        note: string;
    };
    personal_interests_and_strengths: {
        interests: string[];
        strengths: string[];
        academic_fit: string;
    };
    family_and_financial_situation: {
        family_support: string;
        financial_status: "Stable" | "Constrained" | "Unknown";
        note: string;
    };
    concerns_and_red_flags: {
        academic: string[];
        psychological: string[];
        other: string[];
    };
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
export type AgentKey = "feasibility" | "labor_market" | "job_demand";

export interface ScoreBreakdownItem {
    label: string;
    value: number;
    weight: string; // e.g. "30%"
}

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
    score_breakdown: {
        label: string;
        value: number;
        weight: string;
    }[];
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
    scoreBreakdown: ScoreBreakdownItem[];
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
    | "feasibility"
    | "laborMarket"
    | "jobDemand"
    | "adjacentCareer";

export type AnalysisState =
    | { phase: "processing"; completedStages: StageName[] }
    | { phase: "complete"; report: AdjacentCareerReport; sessionIntake: SessionIntakeOutput; agentData: Record<AgentKey, AgentPanelData> }
    | { phase: "error"; message: string };

export interface StoredSession {
    counselorNotes: string;
    createdAt: string;
    careerOverride?: string;
    parentSessionId?: string;
    originalCareer?: string;
    extractedDocuments?: any[];
}
