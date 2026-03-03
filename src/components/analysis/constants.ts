import { BarChart3, Shield, Brain } from "lucide-react";

export const AGENTS = [
    { id: "feasi", icon: Shield, label: "Feasibility Analyst", color: "#C4861C", bg: "#F5E6CC", desc: "Risk & viability mapping" },
    { id: "labor", icon: BarChart3, label: "Labor Market Analyst", color: "#6B8C6B", bg: "#D4E6D4", desc: "Real-time labor intelligence" },
    { id: "jobDemand", icon: Brain, label: "Job Demand Analyst", color: "#5B7FA6", bg: "#D4E2F0", desc: "Trait & passion alignment" },
];

export const ANALYSIS_STEPS = [
    "Parsing career notes…",
    "Calibrating semantic model…",
    "Running Feasibility risk scan…",
    "Activating Labor Market Analyst…",
    "Profiling Job Demand Analyst…",
    "Generating Adjacent Career Paths…",
];
