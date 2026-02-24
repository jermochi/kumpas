import { Mic, Square, RotateCcw, Loader2 } from "lucide-react";

interface RecordingControlsProps {
    isRecording: boolean;
    isPending: boolean;
    hasRecorded: boolean;
    onToggle: () => void;
    onReset: () => void;
}

export default function RecordingControls({
    isRecording,
    isPending,
    hasRecorded,
    onToggle,
    onReset
}: RecordingControlsProps) {
    return (
        <div className="relative flex w-full max-w-[220px] items-center justify-center">
            {/* Reset button */}
            {hasRecorded && !isPending && (
                <button
                    onClick={onReset}
                    className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-muted-text transition-all hover:bg-black/10 hover:text-ink animate-in fade-in zoom-in"
                    title="Reset Recording"
                >
                    <RotateCcw size={18} />
                </button>
            )}

            {/* Record button */}
            <button
                onClick={onToggle}
                disabled={isPending}
                className={`flex h-16 w-16 z-10 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ${isRecording
                        ? "scale-110 bg-forest text-white shadow-lg"
                        : "bg-ink text-white hover:scale-105 hover:bg-forest hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    }`}
            >
                {isPending ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : isRecording ? (
                    <Square size={20} fill="currentColor" />
                ) : (
                    <Mic size={22} />
                )}
            </button>
        </div>
    );
}
