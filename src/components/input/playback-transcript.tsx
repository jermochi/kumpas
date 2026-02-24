interface PlaybackTranscriptProps {
    hasRecorded: boolean;
    isRecording: boolean;
}

export default function PlaybackTranscript({
    hasRecorded,
    isRecording
}: PlaybackTranscriptProps) {
    if (!hasRecorded && !isRecording) return null;

    return (
        <div className="w-full space-y-3">

            {hasRecorded && (
                <div className="w-full rounded-xl border border-black/[0.06] bg-black/[0.02] p-5 text-sm animate-in fade-in slide-in-from-bottom-2">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-text/70">
                        Live Transcript
                    </p>
                    <p className="leading-relaxed text-ink/80 italic">
                        {isRecording 
                            ? "Listening to your voice..." 
                            : "Recording finished. Ready for processing."}
                    </p>
                </div>
            )}
        </div>
    );
}
