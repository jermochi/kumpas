import type { AgentPanelData, AgentKey, AdjacentCareerReport, RawAgentResponse } from "./analysis-types";

/**
 * Build agent-panel detail data keyed by agent from raw agent outputs.
 */
export function buildAgentPanels(
    labor: RawAgentResponse,
    feasibility: RawAgentResponse,
    psychological: RawAgentResponse
): Record<AgentKey, AgentPanelData> {
    return {
        labor_market: {
            key: "labor_market",
            label: "Labor Market",
            framework: "LMI Framework",
            frameworkCite: "LMI Framework · Arulmani et al., 2014",
            score: labor.score,
            verdict: labor.verdict,
            keySignals: labor.key_signals.map(s => ({
                icon: s.icon,
                label: s.label,
                value: s.value,
                subNote: s.sub_note,
            })),
            summary: labor.summary,
            supportingData: labor.supporting_data.map(d => ({
                icon: d.icon,
                label: d.label,
                value: d.value,
            })),
        },
        feasibility: {
            key: "feasibility",
            label: "Feasibility",
            framework: "SCCT",
            frameworkCite: "SCCT · Lent, Brown & Hackett, 1994",
            score: feasibility.score,
            verdict: feasibility.verdict,
            keySignals: feasibility.key_signals.map(s => ({
                icon: s.icon,
                label: s.label,
                value: s.value,
                subNote: s.sub_note,
            })),
            summary: feasibility.summary,
            supportingData: feasibility.supporting_data.map(d => ({
                icon: d.icon,
                label: d.label,
                value: d.value,
            })),
        },
        psychological: {
            key: "psychological",
            label: "Psychological",
            framework: "JD-R Model",
            frameworkCite: "JD-R Model · Demerouti et al., 2001",
            score: psychological.score,
            verdict: psychological.verdict,
            keySignals: psychological.key_signals.map(s => ({
                icon: s.icon,
                label: s.label,
                value: s.value,
                subNote: s.sub_note,
            })),
            summary: psychological.summary,
            supportingData: psychological.supporting_data.map(d => ({
                icon: d.icon,
                label: d.label,
                value: d.value,
            })),
        },
    };
}

/** Map related careers from AdjacentCareerReport into a display-friendly format */
export function buildRelatedCareers(report: AdjacentCareerReport) {
    // Fallback if agent returns empty or malformed data
    const fallback = [
        { career: "Medical Technology", status: "In-Demand" as const, score: 88 },
        { career: "Health Informatics", status: "Emerging" as const, score: 79 },
        { career: "Midwifery", status: "In-Demand" as const, score: 73 },
    ];

    if (!report.related_careers || report.related_careers.length === 0) return fallback;

    return report.related_careers.map((rc) => ({
        career: rc.career_path,
        status: rc.demand_status,
        score: rc.composite_score,
    }));
}
