import type { AgentPanelData, AgentKey, AdjacentCareerReport, RawAgentResponse } from "./analysis-types";

/**
 * Build agent-panel detail data keyed by agent from raw agent outputs.
 */
export function buildAgentPanels(
    feasibility: RawAgentResponse,
    labor_market: RawAgentResponse,
    job_demand: RawAgentResponse
): Record<AgentKey, AgentPanelData> {
    console.log("Feasibility:", feasibility);
    console.log("Labor Market:", labor_market);
    console.log("Job Demand:", job_demand);

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
            score: labor_market.score,
            verdict: labor_market.verdict,
            keySignals: labor_market.key_signals.map(s => ({
                icon: s.icon,
                label: s.label,
                value: s.value,
                subNote: s.sub_note,
            })),
            summary: labor_market.summary,
            scoreBreakdown: labor_market.score_breakdown ? labor_market.score_breakdown.map(b => ({
                label: b.label,
                value: b.value,
                weight: b.weight,
            })) : [],
            supportingData: labor_market.supporting_data.map(d => ({
                icon: d.icon,
                label: d.label,
                value: d.value,
            })),
        },
        job_demand: {
            key: "job_demand",
            label: "Job Demand",
            framework: "JD-R Model",
            frameworkCite: "JD-R Model · Demerouti et al., 2001",
            score: job_demand.score,
            verdict: job_demand.verdict,
            keySignals: job_demand.key_signals.map(s => ({
                icon: s.icon,
                label: s.label,
                value: s.value,
                subNote: s.sub_note,
            })),
            summary: job_demand.summary,
            scoreBreakdown: job_demand.score_breakdown ? job_demand.score_breakdown.map(b => ({
                label: b.label,
                value: b.value,
                weight: b.weight,
            })) : [],
            supportingData: job_demand.supporting_data.map(d => ({
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
