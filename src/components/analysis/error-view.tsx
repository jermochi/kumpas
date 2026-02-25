"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";

interface ErrorViewProps {
    message: string;
    onRetry: () => void;
    onBack: () => void;
}

export default function ErrorView({ message, onRetry, onBack }: ErrorViewProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertCircle size={28} />
            </div>
            <div>
                <p className="text-base font-medium text-ink">Analysis failed</p>
                <p className="mt-1.5 max-w-sm text-sm text-muted-text">{message}</p>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-ink cursor-pointer hover:bg-black/[0.03]"
                >
                    <ArrowLeft size={15} /> Start over
                </button>
                <button
                    onClick={onRetry}
                    className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white cursor-pointer hover:bg-forest"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
