import type { AgentPanelData, AgentKey, AdjacentCareerReport } from "./analysis-types";

/**
 * Build dummy agent-panel detail data keyed by agent.
 * Currently returns placeholder content — will be wired to real agent output.
 */
export function buildAgentPanels(): Record<AgentKey, AgentPanelData> {
    return {
        labor_market: {
            key: "labor_market",
            label: "Labor Market",
            framework: "LMI Framework",
            frameworkCite: "LMI Framework · Arulmani et al., 2014",
            score: 82,
            verdict: "Highly Favorable",
            keySignals: [
                { icon: "up", label: "DOLE Status", value: "In-Demand (2023–2024)" },
                { icon: "up", label: "Board Pass Rate", value: "43.6% — low supply", subNote: "Low pass rate = less competition for those who pass" },
                { icon: "neutral", label: "Salary Range", value: "₱18k — ₱90k / mo" },
            ],
            summary:
                "This career path is in-demand and hard-to-fill nationally. The low board pass rate is the main risk — but it also means less competition for students who complete licensure.",
            supportingData: [
                { icon: "up", label: "Market Gap", value: "DOH provincial shortage" },
                { icon: "up", label: "5-yr Growth", value: "+14% nationally" },
            ],
        },
        feasibility: {
            key: "feasibility",
            label: "Feasibility",
            framework: "SCCT",
            frameworkCite: "SCCT · Lent, Brown & Hackett, 1994",
            score: 63,
            verdict: "Feasible",
            keySignals: [
                { icon: "neutral", label: "Academic Fit", value: "Bio 90 ✓ Chem 88 ✓ Math 78 ✗", subNote: "Math below BSN 80 threshold — pharmacology risk in Year 2" },
                { icon: "down", label: "Financial Barrier", value: "High — named by student" },
                { icon: "up", label: "Best Pathway", value: "CNU (free) + TES grant" },
            ],
            summary:
                "Science grades are ready. Financial cost is the real barrier — but two scholarships require no GWA minimum. Enroll at Cebu Normal University for free tuition, apply for TES to cover living costs.",
            supportingData: [
                { icon: "up", label: "UAQTE / Free HE", value: "✓ Eligible — any SUC/LUC" },
            ],
        },
        psychological: {
            key: "psychological",
            label: "Psychological",
            framework: "JD-R Model",
            frameworkCite: "JD-R Model · Demerouti et al., 2001",
            score: 71,
            verdict: "Moderately Aligned",
            keySignals: [
                { icon: "down", label: "Career Demands", value: "High — emotional + moral" },
                { icon: "up", label: "Student Resources", value: "Moderate-Strong", subNote: "Intrinsic motivation + peer support + role model are proven burnout buffers" },
                { icon: "neutral", label: "Key Risk", value: "Financial stress as extra demand" },
            ],
            summary:
                "This is a high-demand career. This student has real strengths — meaning-driven, peer-supported, has a role model. The gap: financial stress adds pressure on top of an already demanding career path.",
            supportingData: [
                { icon: "down", label: "Emotional Labor", value: "Very high — grief, loss" },
            ],
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
