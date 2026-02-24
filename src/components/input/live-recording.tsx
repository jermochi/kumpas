"use client";

import WaveForm from "@/components/audio/waveform";
import { useState, useEffect, useRef } from "react";
import useRecordVoice from "./use-voice-record";
import PermissionModal from "./permission-modal";
import RecordingControls from "./recording-controls";
import PlaybackTranscript from "./playback-transcript";

interface LiveRecordingProps {
    isRecording: boolean;
    onToggleRecording: () => void;
}

export default function LiveRecording({ isRecording, onToggleRecording }: LiveRecordingProps) {
    const [recTime, setRecTime] = useState(0);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    
    const { mediaRecorder, initRecording, clearRecording } = useRecordVoice();
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
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
            />
        </div>
    );
}
