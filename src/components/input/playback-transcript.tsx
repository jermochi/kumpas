import { TranscriptionState } from "@/types";

interface PlaybackTranscriptProps {
    hasRecorded: boolean;
    isRecording: boolean;
    transcription?: TranscriptionState;
}

export default function PlaybackTranscript({
    hasRecorded,
    isRecording,
    transcription
}: PlaybackTranscriptProps) {
    if (!hasRecorded && !isRecording && (!transcription || transcription.status === 'idle')) return null;

    return (
        <div className="w-full space-y-3">

            {hasRecorded && (!transcription || transcription.status !== 'success') && (
                <div className="w-full rounded-xl border border-black/[0.06] bg-black/[0.02] p-5 text-sm animate-in fade-in slide-in-from-bottom-2">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-text/70">
                        Transcript
                    </p>
                    <p className="leading-relaxed text-ink/80 italic">
                        {isRecording 
                            ? "Listening to your voice..." 
                            : transcription?.status === 'loading'
                                ? "Transcribing audio..."
                                : transcription?.status === 'error'
                                    ? transcription.message
                                    : "Recording finished. Ready for processing."}
                    </p>
                </div>
            )}

            {transcription?.status === 'success' && (
                <div className="w-full rounded-xl border border-black/[0.06] bg-black/[0.02] p-5 text-sm animate-in fade-in slide-in-from-bottom-2 h-[200px] max-h-[400px] overflow-y-scroll">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-text/70">
                        Transcript
                    </p>
                    <p className="leading-relaxed text-ink/80">
                        {transcription.text}
                    </p>
                </div>
            )}
        </div>
    );
}
