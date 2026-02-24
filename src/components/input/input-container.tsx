"use client";

import { useState } from "react";
import Button from "@/components/button";
import TabSwitcher from "@/components/input/tab-switcher";
import LiveRecording from "@/components/input/live-recording";
import FileUpload from "@/components/input/file-upload";

type Tab = "recording" | "upload";
type TranscriptionState = 
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; text: string }
    | { status: "error"; message: string }

export default function InputContainer() {
    const [activeTab, setActiveTab] = useState<Tab>("recording");
    const [isRecording, setIsRecording] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState<TranscriptionState>({ status: "idle" });

    const handleFileChange = (file: File | null) => {
        setUploadedFile(file);
        setTranscription({ status: "idle" });
    };

    //TODO - record handling
    const handleBeginAnalysis = async () => {
        if (!uploadedFile) return;

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
            <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} setIsRecording={setIsRecording} />

            {/* Content card */}
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-card">
                <div className="p-6 sm:p-8">
                    {activeTab === "recording" ? (
                        <LiveRecording 
                            isRecording={isRecording} 
                            onToggleRecording={() => setIsRecording(!isRecording)} 
                        />
                    ) : (
                        <FileUpload 
                            uploadedFile={uploadedFile} 
                            onFileChange={setUploadedFile} 
                        />
                    )}
                </div>

                {/* Begin Analysis button */}
                <Button 
                    text="Begin Multi-Agent Analysis" 
                    onClick={handleBeginAnalysis}
                    disabled={transcription.status === "loading" || !uploadedFile}
                    isLoading={transcription.status === "loading"}
                    loadingText="Transcribing..."
                />
            </div>
        </section>
    );
}