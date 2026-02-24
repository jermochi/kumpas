"use client";

import { useRef, useCallback, useState } from "react";
import { Upload, Check } from "lucide-react";

interface FileUploadProps {
    uploadedFile: File | null;
    onFileChange: (file: File | null) => void;
}

export default function FileUpload({ uploadedFile, onFileChange }: FileUploadProps) {
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const ACCEPTED_TYPES = ".mp3,.wav,.m4a,.txt";
    const MAX_SIZE_MB = 20;

    const handleFileChange = useCallback((file: File | null) => {
        if (!file) return;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`File must be under ${MAX_SIZE_MB}MB`);
            return;
        }
        onFileChange(file);
    }, [onFileChange]);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            handleFileChange(file ?? null);
        },
        [handleFileChange]
    );

    return (
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
    );
}
