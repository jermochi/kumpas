"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ScoreBreakdownItem } from "@/lib/analysis-types";

interface ScoreBreakdownProps {
    data: ScoreBreakdownItem[];
}

export default function ScoreBreakdown({ data }: ScoreBreakdownProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!data || data.length === 0) return null;

    return (
        <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group w-full text-left rounded-2xl border border-black/[0.06] shadow-card bg-white p-4 sm:p-5 mb-4 cursor-pointer hover:border-black/[0.12] hover:shadow-sm transition-all duration-200"
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-text">
                        Score Breakdown
                    </p>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-muted-text" /> : <ChevronDown size={16} className="text-muted-text" />}
            </div>

            {isExpanded && (
                <div
                    className="flex flex-col gap-3 mt-4 pt-4 border-t border-black/[0.04] cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    {data.map((item, i) => (
                        <div key={i} className="flex flex-col gap-1.5 w-full relative group">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-ink w-1/2 md:w-1/3 shrink-0" title={item.label}>
                                    {item.label}
                                </span>

                                <div className="flex-1 flex items-center justify-end gap-3">
                                    <span className="text-xs text-muted-text w-12 text-right">{item.weight}</span>

                                    {/* Visual simple bar for the score */}
                                    <div className="h-1.5 w-24 sm:w-32 md:w-48 bg-black/[0.06] rounded-full overflow-hidden shrink-0">
                                        <div
                                            className="h-full bg-forest rounded-full transition-all duration-500"
                                            style={{ width: `${Math.max(0, Math.min(100, item.value))}%` }}
                                        />
                                    </div>

                                    <span className="text-sm font-semibold text-forest w-8 text-right shrink-0">{item.value}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </button>
    );
}
