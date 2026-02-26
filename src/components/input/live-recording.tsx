"use client";

import WaveForm from "@/components/audio/waveform";
import { useState, useEffect, useRef } from "react";
import { upload } from "@vercel/blob/client";
import useRecordVoice from "./use-voice-record";
import PermissionModal from "./permission-modal";
import RecordingControls from "./recording-controls";
import PlaybackTranscript from "./playback-transcript";
import { TranscriptionState } from "@/types";

interface LiveRecordingProps {
    isRecording: boolean;
    onToggleRecording: () => void;
    onHasDataChange: (hasData: boolean) => void;
    onTranscriptionComplete: (text: string | null) => void;
}

export default function LiveRecording({ isRecording, onToggleRecording, onHasDataChange, onTranscriptionComplete }: LiveRecordingProps) {
    const [recTime, setRecTime] = useState(0);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [transcription, setTranscription] = useState<TranscriptionState>({ status: "idle" });

    const { mediaRecorder, initRecording, clearRecording } = useRecordVoice();
    const audioChunks = useRef<Blob[]>([]);

    useEffect(() => {
        onHasDataChange(isRecording || hasRecorded || transcription.status !== "idle");
    }, [isRecording, hasRecorded, transcription.status, onHasDataChange]);

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

        const handleStop = async () => {
            const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
            const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });

            audioChunks.current = [];

            // Release the microphone stream
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            clearRecording();

            // Auto-transcribe
            setTranscription({ status: "loading" });

            try {
                // Step 1: Upload to Vercel Blob (bypasses 4.5MB body limit)
                const blob = await upload(file.name, file, {
                    access: "public",
                    handleUploadUrl: "/api/upload",
                });

                // Step 2: Send blob URL to transcribe API
                const res = await fetch("/api/transcribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ blobUrl: blob.url }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setTranscription({ status: "error", message: data.error ?? "Unknown error" });
                    return;
                }

                setTranscription({ status: "success", text: data.text });
                onTranscriptionComplete(data.text);
            } catch (err) {
                setTranscription({ status: "error", message: "Network error. Please try again." });
            }
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
        setTranscription({ status: "idle" });
        onTranscriptionComplete(null);
        audioChunks.current = [];
    };

    return (
        <div className="flex w-full flex-col items-center gap-6">
            <PermissionModal
                isOpen={showPermissionModal}
                onClose={() => setShowPermissionModal(false)}
            />

            <RecordingControls
                isRecording={isRecording}
                isPending={isPending}
                hasRecorded={hasRecorded}
                onToggle={handleToggleClick}
                onReset={handleReset}
            />

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

            <PlaybackTranscript
                hasRecorded={hasRecorded}
                isRecording={isRecording}
                transcription={transcription}
            />
        </div>
    );
}
