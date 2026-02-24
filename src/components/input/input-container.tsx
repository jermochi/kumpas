"use client";

import { use, useState } from "react";
import Button from "@/components/button";
import TabSwitcher from "@/components/input/tab-switcher";
import LiveRecording from "@/components/input/live-recording";
import FileUpload from "@/components/input/file-upload";
import DiscardModal from "@/components/input/discard-modal";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";

type Tab = "recording" | "upload";

export default function InputContainer() {
    const [activeTab, setActiveTab] = useState<Tab>("recording");
    const [isRecording, setIsRecording] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [rawTranscript, setRawTranscript] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Track if either tab has active data that shouldn't be lost
    const [recordingHasData, setRecordingHasData] = useState(false);
    const [uploadHasData, setUploadHasData] = useState(false);
    
    // Tab switching modal state
    const [pendingTab, setPendingTab] = useState<Tab | null>(null);

    const router = useRouter();

    const handleTabChangeAttempt = (newTab: Tab) => {
        if (newTab === activeTab) return;

        const currentTabHasData = activeTab === "recording" ? recordingHasData : uploadHasData;
        
        if (currentTabHasData) {
            setPendingTab(newTab);
        } else {
            executeTabChange(newTab);
        }
    };

    const executeTabChange = (newTab: Tab) => {
        setActiveTab(newTab);
        setPendingTab(null);
        
        // Reset state across both tabs thoroughly
        setUploadedFile(null);
        setIsRecording(false);
        setRecordingHasData(false);
        setUploadHasData(false);
        setRawTranscript(null);
        setError(null);
    };

    const handleDiscard = () => {
        if (pendingTab) executeTabChange(pendingTab);
    };

    const handleBeginAnalysis = async () => {
        if(!rawTranscript) return;

        setError(null);
        setIsProcessing(true);

        try {
            const res = await fetch("/api/process-transcript", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: rawTranscript }),
            });

            const data = await res.json() as Record<string, unknown>;

            if(!res.ok) {
                throw new Error((data.error as string) ?? "Transcription layer failed");
            }

            const sessionId = crypto.randomUUID();
            sessionStorage.setItem(
                `session_${sessionId}`,
                JSON.stringify({
                    structured: data,
                })
            );

            router.push(`/analysis?session=${sessionId}`);
        } catch (err) {
            console.error("Analysis error:", err);
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setIsProcessing(false);
        }
    };


    return (
        <section className="mx-auto w-full max-w-2xl px-4 sm:px-6 relative">
            <DiscardModal 
                isOpen={pendingTab !== null} 
                onDiscard={handleDiscard} 
                onCancel={() => setPendingTab(null)} 
            />

            {/* Tab switcher — separate from card */}
            <TabSwitcher activeTab={activeTab} setActiveTab={handleTabChangeAttempt} />

            {/* Content card */}
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-card">
                <div className="p-6 sm:p-8">
                    {activeTab === "recording" && (
                        <LiveRecording 
                            isRecording={isRecording} 
                            onToggleRecording={() => setIsRecording(!isRecording)} 
                            onHasDataChange={setRecordingHasData}
                            onTranscriptionComplete={setRawTranscript}
                        />
                    )}
                    {activeTab === "upload" && (
                        <FileUpload 
                            uploadedFile={uploadedFile} 
                            onFileChange={setUploadedFile} 
                            onHasDataChange={setUploadHasData}
                            onTranscriptionComplete={setRawTranscript}
                        />
                    )}
                </div>
                <Button
                    text="Begin Multi Agent Analysis"
                    onClick={handleBeginAnalysis}
                    icon={<Zap size={16} />}
                    disabled={!rawTranscript}
                    isLoading={isProcessing}
                    loadingText="Processing Transcript..."
                />
            </div>
        </section>
    );
}