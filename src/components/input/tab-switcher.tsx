"use client";

import { Mic, Upload } from "lucide-react";

type Tab = "recording" | "upload";

interface TabSwitcherProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

export default function TabSwitcher({ activeTab, setActiveTab }: TabSwitcherProps) {
    return (
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
    );
}