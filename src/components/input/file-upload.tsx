"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { upload } from "@vercel/blob/client";
import { Upload, Check, X } from "lucide-react";
import PlaybackTranscript from "./playback-transcript";
import { TranscriptionState } from "@/types";
import { toast } from "sonner"

interface FileUploadProps {
    uploadedFile: File | null;
    onFileChange: (file: File | null) => void;
    onHasDataChange: (hasData: boolean) => void;
    onTranscriptionComplete: (text: string | null) => void;
}

export default function FileUpload({ uploadedFile, onFileChange, onHasDataChange, onTranscriptionComplete }: FileUploadProps) {
    const [dragOver, setDragOver] = useState(false);
    const [transcription, setTranscription] = useState<TranscriptionState>({ status: "idle" });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const ACCEPTED_TYPES = [".mp3", ".wav", ".m4a"];
    const MAX_SIZE_MB = 20;

    useEffect(() => {
        onHasDataChange(!!uploadedFile || transcription.status !== "idle");
    }, [uploadedFile, transcription.status, onHasDataChange]);

    const handleFileSelection = (file: File | null) => {
        setTranscription({ status: "idle" });
        onTranscriptionComplete(null);
        if (!file) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            onFileChange(null);
            return;
        }

        // 1. Validate File Type
        const fileName = file.name.toLowerCase();
        const isValidType = ACCEPTED_TYPES.some(ext => fileName.endsWith(ext));

        if (!isValidType) {
            toast.error("Invalid file type.", { description: `Please upload one of the following: ${ACCEPTED_TYPES.join(", ")}`, position: "top-center" });
            if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
            return;
        }

        // 2. Validate File Size
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error(`File must be under ${MAX_SIZE_MB}MB`, { position: "top-center" });
            if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
            return;
        }

        onFileChange(file);
        transcribeFile(file);
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            handleFileSelection(file ?? null);
        },
        [onFileChange]
    );

    /** Strip special chars that break Vercel Blob pathname handling */
    const sanitizeFileName = (name: string): string => {
        const ext = name.lastIndexOf(".") >= 0 ? name.slice(name.lastIndexOf(".")) : "";
        const base = name.slice(0, name.length - ext.length);
        const clean = base
            .replace(/\s+/g, "_")           // spaces → underscores
            .replace(/[^a-zA-Z0-9._-]/g, "") // strip unsafe chars
            .replace(/[_-]{2,}/g, "_");      // collapse repeats
        return (clean || "audio") + ext;
    };

    const transcribeFile = async (file: File) => {
        setTranscription({ status: "loading" });

        try {
            let res: Response;
            let data: any;
            const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

            if (isLocalhost) {
                const formData = new FormData();
                formData.append("file", file);

                res = await fetch("/api/transcribe", {
                    method: "POST",
                    body: formData,
                });
            } else {
                // Step 1: Upload to Vercel Blob (bypasses 4.5MB body limit)
                const safeName = sanitizeFileName(file.name);
                const uniqueName = `${Date.now()}-${safeName}`;
                const blob = await upload(uniqueName, file, {
                    access: "public",
                    handleUploadUrl: "/api/upload",
                });

                // Step 2: Send blob URL to transcribe API
                res = await fetch("/api/transcribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ blobUrl: blob.url }),
                });
            }

            data = await res.json();

            if (!res.ok) {
                const errorMessage = data.error ?? "Unknown error occurred during transcription.";
                setTranscription({ status: "error", message: errorMessage });
                toast.error(errorMessage, { position: "top-center" });
                return;
            }

            setTranscription({ status: "success", text: data.text });
            onTranscriptionComplete(data.text);
        } catch (err) {
            setTranscription({ status: "error", message: "Network error. Please try again." });
            toast.error("Network error", { description: "Please check your connection and try again.", position: "top-center" });
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${dragOver
                    ? "border-forest bg-forest/5"
                    : uploadedFile
                        ? "border-forest/40 bg-forest/[0.03]"
                        : "border-black/10 hover:border-forest hover:bg-forest/[0.02]"
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    className="hidden"
                    onChange={(e) =>
                        handleFileSelection(e.target.files?.[0] ?? null)
                    }
                />

                {uploadedFile ? (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFileSelection(null);
                            }}
                            className="absolute right-3 top-3 rounded-full p-1.5 text-muted-text transition-colors hover:bg-black/5 hover:text-ink"
                            aria-label="Remove file"
                        >
                            <X size={18} />
                        </button>

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
                            MP3, WAV, M4A — up to {MAX_SIZE_MB}MB
                        </p>
                    </>
                )}
            </div>

            {uploadedFile && (
                <div className="w-full space-y-4">
                    <PlaybackTranscript
                        hasRecorded={!!uploadedFile}
                        isRecording={false}
                        transcription={transcription}
                    />
                </div>
            )}
        </div>
    );
}
