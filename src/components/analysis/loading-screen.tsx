"use client"

import { useEffect, useState } from "react";
import { ANALYSIS_STEPS } from "./constants";
import { AgentSpinner } from "./agent-spinner";
import { ProgressSection } from "./progress-section";
import { AgentStatusPills } from "./agent-status-pills";

export default function LoadingScreen() {
    const [stepIdx, setStepIdx] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const dur = 15000;
        const tick = 120;
        let elapsed = 0;
        const t = setInterval(() => {
            elapsed += tick;
            const p = Math.min((elapsed / dur) * 100, 100);
            setProgress(p);
            setStepIdx(Math.floor((p / 100) * ANALYSIS_STEPS.length));
            if (elapsed >= dur) {
                clearInterval(t);
                setTimeout(onComplete, 400);
            }
        }, tick);
        return () => clearInterval(t);
    }, []);

    const onComplete = () => {
        console.log("Analysis complete!");
    };

    return (
        <div className="flex-1 flex items-center justify-center font-sans text-center">
            <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <AgentSpinner />
                <h2 className="font-heading text-3xl text-[var(--charcoal)] mb-3">
                    Agents at work...
                </h2>
                <ProgressSection stepIdx={stepIdx} progress={progress} />
                <AgentStatusPills progress={progress} />
            </div>
        </div>
    );
}