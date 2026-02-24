"use client";

import { Mic, Square, RotateCcw, Loader2, MicOff } from "lucide-react";
import WaveForm from "../audio/waveform";
import { useState, useEffect, useRef } from "react";
import useRecordVoice from "./use-voice-record";

interface LiveRecordingProps {
    isRecording: boolean;
    onToggleRecording: () => void;
}

export default function LiveRecording({ isRecording, onToggleRecording }: LiveRecordingProps) {
    const [recTime, setRecTime] = useState(0);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    
    const { mediaRecorder, initRecording, clearRecording } = useRecordVoice();    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Handle timer updates
    useEffect(() => {
        if (isRecording) {
            setHasRecorded(true);
            timerRef.current = setInterval(() => setRecTime(t => t + 1), 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRecording]);

    // Handle mediaRecorder data events
    useEffect(() => {
        if (!mediaRecorder) return;

        const handleDataAvailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                audioChunks.current.push(event.data);
            }
        };

        const handleStop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            audioChunks.current = [];
            
            // Release the microphone stream
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            clearRecording();
        };

        mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
        mediaRecorder.addEventListener("stop", handleStop);

        return () => {
            mediaRecorder.removeEventListener("dataavailable", handleDataAvailable);
            mediaRecorder.removeEventListener("stop", handleStop);
        };
    }, [mediaRecorder, clearRecording]);

    // Handle media recorder start/stop syncing with isRecording
    useEffect(() => {
        const handleRecording = () => {
            if (isRecording) {
                if (mediaRecorder && mediaRecorder.state === "inactive") {
                    audioChunks.current = [];
                    setAudioUrl(null);
                    mediaRecorder.start();
                }
            } else {
                if (mediaRecorder && mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
            }
        };

        handleRecording();
    }, [isRecording, mediaRecorder]);

    const handleToggleClick = async () => {
        if (!isRecording) {
            setIsPending(true);
            setShowPermissionModal(false);
            try {
                const recorder = await initRecording();
                setIsPending(false);
                if (!recorder) return; 
            } catch (err) {
                // User denied permission or device failed
                setIsPending(false);
                setShowPermissionModal(true);
                return;
            }
        }
        
        onToggleRecording();
    };

    const handleReset = () => {
        if (isRecording) {
            onToggleRecording();
        }
        setRecTime(0);
        setHasRecorded(false);
        setAudioUrl(null);
        audioChunks.current = [];
    };
    
    return (
        <div className="flex w-full flex-col items-center gap-6">
            {/* Modal Overlay */}
            {showPermissionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all animate-in fade-in">
                    <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl animate-in zoom-in-95 border border-black/[0.06]">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm border border-red-100">
                            <MicOff size={24} />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-ink">Microphone Access Denied</h3>
                        <p className="mb-6 text-[15px] leading-relaxed text-muted-text">
                            We need access to your microphone to record audio. Please allow microphone permissions in your browser settings and try again.
                        </p>
                        <button
                            onClick={() => setShowPermissionModal(false)}
                            className="w-full rounded-xl bg-ink py-3.5 text-[15px] font-medium text-white transition-all hover:bg-forest hover:shadow-md active:scale-[0.98]"
                        >
                            Got it, thanks
                        </button>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="relative flex w-full max-w-[220px] items-center justify-center">
                {/* Reset button */}
                {hasRecorded && !isPending && (
                    <button
                        onClick={handleReset}
                        className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-muted-text transition-all hover:bg-black/10 hover:text-ink animate-in fade-in zoom-in"
                        title="Reset Recording"
                    >
                        <RotateCcw size={18} />
                    </button>
                )}

                {/* Record button */}
                <button
                    onClick={handleToggleClick}
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

            {/* Voice visualizer */}
            <div className="flex items-center gap-[3px]">
                <WaveForm active={isRecording} />
            </div>

            {/* Status text */}
            <p className="text-sm text-muted-text">
                {isRecording
                    ? `Recording... ${formatTime(recTime)}`
                    : hasRecorded 
                        ? `Recorded: ${formatTime(recTime)}`
                        : isPending
                        ? "Requesting microphone access..."
                        : "Click to start speaking"}
            </p>

            {/* Playback & Transcript Box */}
            <div className="w-full space-y-3">
                {audioUrl && hasRecorded && !isRecording && (
                    <audio src={audioUrl} controls className="w-full animate-in fade-in" />
                )}

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
        </div>
    );
}
