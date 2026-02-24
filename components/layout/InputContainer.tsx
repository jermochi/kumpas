"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, Square, Upload, Check, Zap, Loader2 } from "lucide-react";

type Tab = "recording" | "upload";
type TranscriptionState = 
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; text: string }
    | { status: "error"; message: string };

export default function InputContainer() {
    const [activeTab, setActiveTab] = useState<Tab>("recording");
    const [isRecording, setIsRecording] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [transcription, setTranscription] = useState<TranscriptionState>({ status: "idle" });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const ACCEPTED_TYPES = ".mp3,.wav,.m4a,.txt";
    const MAX_SIZE_MB = 20;

    const handleFileChange = useCallback((file: File | null) => {
        if (!file) return;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`File must be under ${MAX_SIZE_MB}MB`);
            return;
        }
        setUploadedFile(file);
        setTranscription({ status: "idle" });
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            handleFileChange(file ?? null);
        },
        [handleFileChange]
    );

    const handleBeginAnalysis = async () => {
        if (!uploadedFile) {
            //disable button
        return;
        }

        setTranscription({ status: "loading" });

        const formData = new FormData();
        formData.append("file", uploadedFile);

        try {
        const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            setTranscription({ status: "error", message: data.error ?? "Unknown error" });
            return;
        }

        console.log("Transcript:", data.text);
        setTranscription({ status: "success", text: data.text });
        } catch (err) {
        setTranscription({ status: "error", message: "Network error. Please try again." });
        }
    };

    return (
        <section className="mx-auto w-full max-w-2xl px-4 sm:px-6">
            {/* Tab switcher — separate from card */}
            <div className="mb-3 flex rounded-full border border-black/[0.06] bg-cream-dark/50 p-1">
                <button
                    onClick={() => setActiveTab("recording")}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-all ${activeTab === "recording"
                            ? "bg-white text-ink shadow-sm"
                            : "text-muted-text hover:text-ink"
                        }`}
                >
                    <Mic size={15} />
                    Live Recording
                </button>
                <button
                    onClick={() => setActiveTab("upload")}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-all ${activeTab === "upload"
                            ? "bg-white text-ink shadow-sm"
                            : "text-muted-text hover:text-ink"
                        }`}
                >
                    <Upload size={15} />
                    Upload
                </button>
            </div>

            {/* Content card */}
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-card">
                <div className="p-6 sm:p-8">
                    {activeTab === "recording" ? (
                        /* ---- LIVE RECORDING ---- */
                        <div className="flex flex-col items-center gap-6">
                            {/* Record button */}
                            <button
                                onClick={() => setIsRecording((prev) => !prev)}
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
                    ) : (
                        /* ---- UPLOAD ---- */
                        <div className="flex flex-col items-center gap-4">
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${dragOver
                                        ? "border-forest bg-forest/5"
                                        : uploadedFile
                                            ? "border-forest/40 bg-forest/[0.03]"
                                            : "border-black/10 hover:border-forest hover:bg-forest/[0.02]"
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={ACCEPTED_TYPES}
                                    className="hidden"
                                    onChange={(e) =>
                                        handleFileChange(e.target.files?.[0] ?? null)
                                    }
                                />

                                {uploadedFile ? (
                                    <>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
                                            <Check size={22} />
                                        </div>
                                        <p className="text-sm font-medium text-ink">
                                            {uploadedFile.name}
                                        </p>
                                        <p className="text-xs text-muted-text">
                                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB —
                                            Click to replace
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/[0.04] text-muted-text">
                                            <Upload size={22} />
                                        </div>
                                        <p className="text-sm font-medium text-ink">
                                            Drag & drop or click to browse
                                        </p>
                                        <p className="text-xs text-muted-text">
                                            MP3, WAV, M4A, TXT — up to {MAX_SIZE_MB}MB
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Begin Analysis button */}
                <div className="border-t border-black/[0.06] p-4 sm:p-6">
                    <button
                        onClick={handleBeginAnalysis}
                        disabled={transcription.status === "loading" || !uploadedFile}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink py-4 text-sm font-semibold text-white transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {transcription.status === "loading" ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Transcribing...
                        </>
                        ) : (
                        <>
                            <Zap size={16} />
                            Begin Multi-Agent Analysis
                        </>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}
