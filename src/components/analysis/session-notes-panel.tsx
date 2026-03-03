"use client";

import { Maximize2, FileText } from "lucide-react";
import styles from "@/styles/analysis.module.css";

interface SessionNotesPanelProps {
    notes: string;
    onFullscreen: () => void;
    className?: string;
}

export default function SessionNotesPanel({ notes, onFullscreen, className = "" }: SessionNotesPanelProps) {
    const formattedNotes = notes.replace(/(?!^)<h3>/g, '<br><h3>');

    return (
        <div className={`rounded-2xl bg-ink p-4 sm:p-5 flex flex-col min-h-0 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
                <div>
                    <div className="flex items-center gap-2 mt-1">
                        <FileText size={14} className="text-white/80" />
                        <h3 className="text-sm font-bold text-white">Counselor Notes</h3>
                    </div>
                </div>
                <button
                    onClick={onFullscreen}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                    aria-label="View fullscreen"
                >
                    <Maximize2 size={14} className="text-white/80" />
                </button>
            </div>

            {/* Scrollable body — capped height */}
            <div className={`flex-1 overflow-y-auto space-y-3 pr-1 max-h-[350px] ${styles.scrollbarThin}`}>
                <div
                    className="[&_h3]:text-xs [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:text-muted-text [&_h3]:mb-1 [&_h3]:mt-6 first:[&_h3]:mt-0 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-white/90 [&_p]:mb-4 last:[&_p]:mb-0 [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:text-sm [&_li]:text-white/90 [&_li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: formattedNotes }}
                />
            </div>
        </div>
    );
}
