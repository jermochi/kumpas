"use client";

import { useState } from "react";
import Button from "@/components/button";
import TabSwitcher from "@/components/input/tab-switcher";
import LiveRecording from "@/components/input/live-recording";
import FileUpload from "@/components/input/file-upload";

type Tab = "recording" | "upload";

export default function InputContainer() {
    const [activeTab, setActiveTab] = useState<Tab>("recording");
    const [isRecording, setIsRecording] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    return (
        <section className="mx-auto w-full max-w-2xl px-4 sm:px-6">
            {/* Tab switcher — separate from card */}
            <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

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
                <Button text="Begin Multi-Agent Analysis" />
            </div>
        </section>
    );
}