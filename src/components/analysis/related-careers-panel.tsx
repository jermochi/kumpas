"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface RelatedCareer {
    career: string;
    status: "In-Demand" | "Emerging" | "Stable";
    score: number;
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

    const isUnlocked = selectedIndex !== null && !isGenerating;

    const handleExplore = () => {
        if (selectedIndex === null || !sessionId) return;
        setIsGenerating(true);

        const raw = sessionStorage.getItem(`kumpas-session-${sessionId}`);
        if (!raw) return;

        const session = JSON.parse(raw);
        const selectedCareer = careers[selectedIndex];

        // Create new session ID and save overriding data
        const newSessionId = crypto.randomUUID();
        sessionStorage.setItem(
            `kumpas-session-${newSessionId}`,
            JSON.stringify({
                ...session,
                careerOverride: selectedCareer.career,
                createdAt: new Date().toISOString(),
            })
        );

        // Navigate to the new session
        router.push(`/analysis?session=${newSessionId}`);
    };

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
                {careers.map((c, i) => {
                    const isSelected = selectedIndex === i;
                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(isSelected ? null : i)}
                            className={`
                                flex w-full items-center justify-between rounded-xl border px-4 py-3 
                                cursor-pointer transition-all duration-150 text-left
                                ${isSelected
                                    ? "border-forest/30 bg-forest/[0.04] ring-1 ring-forest/20"
                                    : "border-black/[0.04] hover:bg-black/[0.02]"
                                }
                            `}
                        >
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-ink">{c.career}</span>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[c.status]}`}>
                                    {c.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span className="text-sm font-bold text-ink">{c.score}%</span>
                                <ArrowRight size={12} className="text-muted-text" />
                            </div>
                        </button>
                    );
                })}
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
