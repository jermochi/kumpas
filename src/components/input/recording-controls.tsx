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
    const isResetState = hasRecorded && !isRecording;

    const handleClick = () => {
        if (isResetState) {
            onReset();
        } else {
            onToggle();
        }
    };

    return (
        <div className="relative flex w-full max-w-[220px] items-center justify-center">
            {/* Record/Reset button */}
            <button
                onClick={handleClick}
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
                ) : isResetState ? (
                    <RotateCcw size={22} />
                ) : (
                    <Mic size={22} />
                )}
            </button>
        </div>
    );
}
