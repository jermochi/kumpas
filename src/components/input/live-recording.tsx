"use client";

import { Mic, Square } from "lucide-react";

interface LiveRecordingProps {
    isRecording: boolean;
    onToggleRecording: () => void;
}

export default function LiveRecording({ isRecording, onToggleRecording }: LiveRecordingProps) {
    return (
        <div className="flex flex-col items-center gap-6">
            {/* Record button */}
            <button
                onClick={onToggleRecording}
                className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ${isRecording
                        ? "bg-forest text-white shadow-lg scale-110"
                        : "bg-ink text-white hover:bg-forest hover:shadow-lg hover:scale-105"
                    }`}
            >
                {isRecording ? (
                    <Square size={20} fill="currentColor" />
                ) : (
                    <Mic size={22} />
                )}
            </button>

            {/* Voice visualizer */}
            <div className="flex items-center gap-[3px]">
                {Array.from({ length: 24 }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-[3px] rounded-full transition-all duration-300 ${isRecording ? "bg-forest" : "bg-black/15"
                            }`}
                        style={{
                            height: isRecording
                                ? `${8 + Math.random() * 20}px`
                                : "8px",
                        }}
                    />
                ))}
            </div>

            {/* Status text */}
            <p className="text-sm text-muted-text">
                {isRecording
                    ? "Recording... click to stop"
                    : "Click to start speaking"}
            </p>
        </div>
    );
}
