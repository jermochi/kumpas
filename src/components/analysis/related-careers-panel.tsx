"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface RelatedCareer {
    career: string;
    status: "In-Demand" | "Emerging" | "Stable";
    score: number;
    rationale?: string;
}

interface RelatedCareersPanelProps {
    careers: RelatedCareer[];
}

const STATUS_STYLES: Record<string, string> = {
    "In-Demand": "bg-forest/10 text-forest",
    "Emerging": "bg-amber-50 text-amber-700",
    "Stable": "bg-blue-50 text-blue-700",
};

export default function RelatedCareersPanel({ careers }: RelatedCareersPanelProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session");

    // Force re-evaluation of sessionStorage when navigating back
    const [lastStorageUpdate, setLastStorageUpdate] = useState(0);
    useEffect(() => {
        const handleFocus = () => setLastStorageUpdate(Date.now());
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const isUnlocked = selectedIndex !== null && !isGenerating;

    const handleExplore = () => {
        if (selectedIndex === null || !sessionId) return;
        setIsGenerating(true);

        const raw = sessionStorage.getItem(`kumpas-session-${sessionId}`);
        if (!raw) return;

        const session = JSON.parse(raw);
        const selectedCareer = careers[selectedIndex];

        const parentId = session.parentSessionId || sessionId;

        let originalCareer = session.originalCareer;
        if (!originalCareer) {
            const parentStructuredStr = sessionStorage.getItem(`kumpas-structured-${parentId}`);
            if (parentStructuredStr) {
                try {
                    const parsed = JSON.parse(parentStructuredStr);
                    originalCareer = parsed.career_path;
                } catch (e) {
                    // Ignore parse errors
                }
            }
        }

        // If the user selected the original career, route them back to the parent session
        if (originalCareer && selectedCareer.career === originalCareer) {
            router.push(`/analysis?session=${encodeURIComponent(parentId)}`);
            setTimeout(() => setIsGenerating(false), 500);
            return;
        }

        // Deterministic ID allows instant cache hit
        const newSessionId = `alt-${parentId}-${selectedCareer.career}`;

        sessionStorage.setItem(
            `kumpas-session-${newSessionId}`,
            JSON.stringify({
                ...session,
                careerOverride: selectedCareer.career,
                parentSessionId: parentId,
                originalCareer,
                createdAt: new Date().toISOString(),
            })
        );

        // Navigate to the new session
        router.push(`/analysis?session=${encodeURIComponent(newSessionId)}`);

        // Timeout to visually clear the button state in case the route transition is instant
        setTimeout(() => setIsGenerating(false), 500);
    };

    // Keep state clean on back/forward navigation
    useEffect(() => {
        setIsGenerating(false);
    }, [sessionId]);

    return (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-4 sm:p-5">
            <div className="mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-text">
                    Adjacent Paths
                </p>
                <h3 className="text-base font-bold text-ink">Related Careers</h3>
                <p className="text-[10px] text-muted-text">Scored across all three frameworks</p>
            </div>

            <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin">
                {(() => {
                    const currentSessionStr = sessionId ? sessionStorage.getItem(`kumpas-session-${sessionId}`) : null;
                    const currentSession = currentSessionStr ? JSON.parse(currentSessionStr) : null;
                    const parentId = currentSession ? (currentSession.parentSessionId || sessionId) : sessionId;

                    let origCareer = currentSession?.originalCareer;
                    if (!origCareer && parentId) {
                        const parentStr = sessionStorage.getItem(`kumpas-structured-${parentId}`);
                        if (parentStr) {
                            try { origCareer = JSON.parse(parentStr).career_path; } catch (e) { }
                        }
                    }

                    const currentCareerPath = currentSession?.careerOverride || origCareer;

                    const historyMap = new Map<string, RelatedCareer>();

                    if (origCareer) {
                        historyMap.set(origCareer, {
                            career: origCareer,
                            status: "Stable",
                            score: 0,
                            rationale: "Return to your original career assessment."
                        });
                    }

                    if (parentId) {
                        for (let i = 0; i < sessionStorage.length; i++) {
                            const key = sessionStorage.key(i);
                            if (key && key.startsWith(`kumpas-session-alt-${parentId}-`)) {
                                try {
                                    const altSession = JSON.parse(sessionStorage.getItem(key)!);
                                    if (altSession.careerOverride) {
                                        historyMap.set(altSession.careerOverride, {
                                            career: altSession.careerOverride,
                                            status: "Stable",
                                            score: 0,
                                            rationale: "Explored path"
                                        });
                                    }
                                } catch (e) { }
                            }
                        }
                    }

                    // Remove current career so we don't show it as an option
                    if (currentCareerPath) {
                        historyMap.delete(currentCareerPath);
                    }

                    const enrichedCareers = careers.map(c => {
                        const isExplored = historyMap.has(c.career) || c.rationale === "Return to your original career assessment.";
                        if (isExplored) {
                            historyMap.delete(c.career);
                            return { ...c, isAlreadyExplored: true };
                        }
                        return { ...c, isAlreadyExplored: false };
                    });

                    // Add remaining from historyMap
                    for (const h of Array.from(historyMap.values())) {
                        enrichedCareers.push({ ...h, isAlreadyExplored: true });
                    }

                    // Sort to push explored items to the bottom
                    enrichedCareers.sort((a, b) => {
                        if (a.isAlreadyExplored === b.isAlreadyExplored) return 0;
                        return a.isAlreadyExplored ? 1 : -1;
                    });

                    return enrichedCareers.map((c, i) => {
                        const originalIndex = careers.findIndex(orig => orig.career === c.career);
                        const isSelected = selectedIndex === originalIndex;
                        const showDivider = c.isAlreadyExplored && (i === 0 || !enrichedCareers[i - 1].isAlreadyExplored);

                        return (
                            <div key={i} className="space-y-2">
                                {showDivider && (
                                    <div className="flex items-center gap-2 py-1">
                                        <div className="h-px w-full bg-black/5" />
                                        <span className="text-[10px] uppercase font-semibold text-muted-text whitespace-nowrap">Explored</span>
                                        <div className="h-px w-full bg-black/5" />
                                    </div>
                                )}
                                <button
                                    onClick={() => setSelectedIndex(isSelected ? null : originalIndex)}
                                    className={`
                                        flex w-full items-center justify-between rounded-xl border px-4 py-3 
                                        cursor-pointer transition-all duration-150 text-left
                                        ${isSelected
                                            ? "border-forest/30 bg-forest/[0.04] ring-1 ring-forest/20"
                                            : c.isAlreadyExplored
                                                ? "border-black/[0.04] bg-black/[0.02] hover:bg-black/[0.04]"
                                                : "border-black/[0.04] hover:bg-black/[0.02]"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-sm font-medium ${c.isAlreadyExplored ? 'text-ink/70' : 'text-ink'}`}>{c.career}</span>
                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[c.status]}`}>
                                            {c.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                        <span className="text-sm font-bold text-ink">{c.score}%</span>
                                        <ArrowRight size={12} className="text-muted-text" />
                                    </div>
                                </button>
                            </div>
                        );
                    });
                })()}
            </div>

            {/* Explore alternative button — unlocked when a career is selected */}
            <button
                disabled={!isUnlocked}
                onClick={handleExplore}
                className={`
                    mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors
                    ${isUnlocked
                        ? "bg-ink text-white cursor-pointer hover:bg-forest"
                        : "bg-black/[0.04] text-muted-text cursor-not-allowed opacity-50"
                    }
                `}
            >
                {isGenerating ? "Setting up..." : "Explore alternative"}
            </button>
        </div>
    );
}
