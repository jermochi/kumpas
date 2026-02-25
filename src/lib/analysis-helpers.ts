import type { AgentPanelData, AgentKey, VerdictReport } from "./analysis-types";

/**
 * Build dummy agent-panel detail data keyed by agent.
 * Uses real scores/verdicts from the VerdictReport where available,
 * but KEY SIGNALS and supporting data are placeholder content.
 */
export function buildAgentPanels(report: VerdictReport): Record<AgentKey, AgentPanelData> {
    const primary = report.ranked_career_paths.find((p) => p.recommendation_type === "PRIMARY");

    return {
        labor_market: {
            key: "labor_market",
            label: "Labor Market",
            framework: "LMI Framework",
            frameworkCite: "LMI Framework · Arulmani et al., 2014",
            score: primary?.market_fit_score ? primary.market_fit_score * 10 : 82,
            verdict: report.agent_verdicts.labor_market.verdict,
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
            score: primary?.feasibility_score ? primary.feasibility_score * 10 : 63,
            verdict: report.agent_verdicts.feasibility.verdict,
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
            score: primary?.psychological_fit_score ? primary.psychological_fit_score * 10 : 71,
            verdict: report.agent_verdicts.psychological.verdict,
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

/** Map related careers from VerdictReport into a display-friendly format */
export function buildRelatedCareers(report: VerdictReport) {
    const alternatives = report.ranked_career_paths
        .filter((p) => p.recommendation_type === "ALTERNATIVE")
        .sort((a, b) => b.composite_score - a.composite_score);

    // Dummy fallback if no alternatives exist in the report
    const fallback = [
        { career: "Medical Technology", status: "In-Demand" as const, score: 88 },
        { career: "Health Informatics", status: "Emerging" as const, score: 79 },
        { career: "Midwifery", status: "In-Demand" as const, score: 73 },
        { career: "Physical Therapy", status: "Stable" as const, score: 67 },
    ];

    if (alternatives.length === 0) return fallback;

    return alternatives.map((alt) => ({
        career: alt.career_path,
        status: (alt.composite_score >= 7.5 ? "In-Demand" : alt.composite_score >= 6 ? "Emerging" : "Stable") as "In-Demand" | "Emerging" | "Stable",
        score: Math.round(alt.composite_score * 10),
    }));
}
