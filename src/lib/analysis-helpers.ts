import type { AgentPanelData, AgentKey, AdjacentCareerReport, RawAgentResponse } from "./analysis-types";

/**
 * Build agent-panel detail data keyed by agent from raw agent outputs.
 */
export function buildAgentPanels(
    feasibility: RawAgentResponse,
    labor: RawAgentResponse,
    jobDemand: RawAgentResponse
): Record<AgentKey, AgentPanelData> {
    console.log("Feasibility:", feasibility);
    console.log("Labor:", labor);
    console.log("Job Demand:", jobDemand);
    return {
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
            scoreBreakdown: feasibility.score_breakdown ? feasibility.score_breakdown.map(b => ({
                label: b.label,
                value: b.value,
                weight: b.weight,
            })) : [],
            supportingData: feasibility.supporting_data.map(d => ({
                icon: d.icon,
                label: d.label,
                value: d.value,
            })),
        },
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
            scoreBreakdown: labor.score_breakdown ? labor.score_breakdown.map(b => ({
                label: b.label,
                value: b.value,
                weight: b.weight,
            })) : [],
            supportingData: labor.supporting_data.map(d => ({
                icon: d.icon,
                label: d.label,
                value: d.value,
            })),
        },
        jobDemand: {
            key: "jobDemand",
            label: "Job Demand",
            framework: "JD-R Model",
            frameworkCite: "JD-R Model · Demerouti et al., 2001",
            score: jobDemand.score,
            verdict: jobDemand.verdict,
            keySignals: jobDemand.key_signals.map(s => ({
                icon: s.icon,
                label: s.label,
                value: s.value,
                subNote: s.sub_note,
            })),
            summary: jobDemand.summary,
            scoreBreakdown: jobDemand.score_breakdown ? jobDemand.score_breakdown.map(b => ({
                label: b.label,
                value: b.value,
                weight: b.weight,
            })) : [],
            supportingData: jobDemand.supporting_data.map(d => ({
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
