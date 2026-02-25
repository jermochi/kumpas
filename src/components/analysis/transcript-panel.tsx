"use client";

import { Maximize2, FileText } from "lucide-react";
import type { TranscriptTurn } from "@/lib/analysis-types";

interface TranscriptPanelProps {
    turns: TranscriptTurn[];
    wordCount: number;
    onFullscreen: () => void;
    className?: string;
}

export default function TranscriptPanel({ turns, wordCount, onFullscreen, className = "" }: TranscriptPanelProps) {
    return (
        <div className={`rounded-2xl bg-ink p-4 sm:p-5 flex flex-col min-h-0 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
                        Session Transcript
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <FileText size={14} className="text-white/80" />
                        <h3 className="text-sm font-bold text-white">Counseling Session</h3>
                    </div>
                    <p className="text-[10px] text-white/60 mt-0.5">
                        Groq Whisper · {wordCount} words
                    </p>
                </div>
                <button
                    onClick={onFullscreen}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                    aria-label="View fullscreen"
                >
                    <Maximize2 size={14} className="text-white/80" />
                </button>
            </div>

            {/* Scrollable transcript body — capped height */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin max-h-[350px]">
                {turns.map((turn, i) => (
                    <div key={i}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70 mb-0.5">
                            {turn.speaker}
                        </p>
                        <p className="text-xs leading-relaxed text-white/90">
                            {turn.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
