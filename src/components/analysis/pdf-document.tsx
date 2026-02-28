import React from "react";
import type { AdjacentCareerReport, StructuredTranscript, AgentKey, AgentPanelData } from "@/lib/analysis-types";

interface PdfDocumentProps {
    report: AdjacentCareerReport;
    structured: StructuredTranscript;
    agentData: Record<AgentKey, AgentPanelData>;
}

export const PdfDocument = React.forwardRef<HTMLDivElement, PdfDocumentProps>(
    ({ report, structured, agentData }, ref) => {
        // Prepare some structured score and verdict bindings
        const agents: AgentKey[] = ["labor_market", "feasibility", "psychological"];

        return (
            <div
                ref={ref}
                style={{
                    width: "800px",
                    height: "1123px", // Force exactly one A4 page 
                    overflow: "hidden", // Prevent breaking into page 2
                    fontSize: "12px",
                    lineHeight: "1.4",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    padding: "24px 32px",
                    boxSizing: "border-box",
                    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {/* PAGE 1: HEADER & SCORES */}
                <header style={{ borderBottom: "2px solid #000", paddingBottom: "12px", marginBottom: "16px", flexShrink: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <p style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", color: "#6b7280", margin: "0 0 2px 0" }}>
                                Kumpas · Career Assessment Report
                            </p>
                            <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#000", margin: 0, lineHeight: 1.1 }}>
                                {structured.career_path || "Career"}
                            </h1>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "12px", color: "#4b5563", margin: 0, fontWeight: "600" }}>
                                {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </header>

                {/* OVERALL SUMMARY MAP */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexShrink: 0 }}>
                    {agents.map((key) => {
                        const panel = agentData[key];
                        return (
                            <div key={key} style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: "6px", padding: "12px", backgroundColor: "#f9fafb" }}>
                                <h3 style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", color: "#4b5563", margin: "0 0 2px 0" }}>
                                    {panel.label}
                                </h3>
                                <div style={{ fontSize: "24px", fontWeight: "900", color: "#000", margin: "0 0 2px 0", lineHeight: 1 }}>
                                    {panel.score}%
                                </div>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#1f2937", margin: 0 }}>
                                    {panel.verdict}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* AGENT DETAILS - 3 columns to save vertical space */}
                <div style={{ display: "flex", gap: "16px", flex: 1, minHeight: 0 }}>
                    {agents.map((key) => {
                        const panel = agentData[key];
                        return (
                            <section key={key} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "6px", marginBottom: "10px" }}>
                                    <h2 style={{ fontSize: "16px", fontWeight: "900", margin: "0 0 2px 0", lineHeight: 1.2 }}>
                                        {panel.label}
                                    </h2>
                                    <p style={{ fontSize: "10px", color: "#6b7280", margin: 0, fontStyle: "italic" }}>
                                        Based on {panel.framework}
                                    </p>
                                </div>

                                <p style={{ margin: "0 0 10px 0", fontSize: "11px", lineHeight: "1.4", flexShrink: 0 }}>{panel.summary}</p>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#6b7280", margin: "0 0 4px 0" }}>Key Signals</h3>
                                    <ul style={{ margin: "0 0 12px 0", paddingLeft: "16px", fontSize: "11px" }}>
                                        {panel.keySignals.slice(0, 4).map((s, i) => (
                                            <li key={i} style={{ marginBottom: "2px" }}><strong>{s.label}:</strong> {s.value}</li>
                                        ))}
                                    </ul>
                                </div>

                                {panel.supportingData && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto", flexShrink: 0 }}>
                                        {panel.supportingData.slice(0, 3).map((m, i) => (
                                            <div key={i} style={{ border: "1px solid #f3f4f6", borderRadius: "4px", padding: "6px 8px", backgroundColor: "#fdfdfd", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                <div style={{ fontSize: "9px", color: "#6b7280", textTransform: "uppercase", fontWeight: "bold", marginBottom: "3px", lineHeight: 1 }}>{m.label}</div>
                                                <div style={{ fontWeight: "800", fontSize: "11px", lineHeight: 1.2, color: "#111827" }}>{m.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>

            </div>
        );
    }
);

PdfDocument.displayName = "PdfDocument";
