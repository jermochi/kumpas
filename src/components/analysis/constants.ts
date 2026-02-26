import { BarChart3, Shield, Brain } from "lucide-react";

export const AGENTS = [
    { id: "labor",  icon: BarChart3, label: "Labor Market Analyst",  color: "#6B8C6B", bg: "#D4E6D4", desc: "Real-time labor intelligence" },
    { id: "feasi",  icon: Shield,    label: "Feasibility Analyst",    color: "#C4861C", bg: "#F5E6CC", desc: "Risk & viability mapping" },
    { id: "psych",  icon: Brain,     label: "Psychological Analyst",  color: "#5B7FA6", bg: "#D4E2F0", desc: "Trait & passion alignment" },
];

export const ANALYSIS_STEPS = [
    "Parsing audio transcript…",
    "Calibrating semantic model…",
    "Activating Labor Market Analyst…",
    "Running Feasibility risk scan…",
    "Profiling psychological patterns…",
    "Cross-correlating agent findings…",
    "Compiling Final Verdict…",
];
