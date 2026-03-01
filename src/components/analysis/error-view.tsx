"use client";

import { AlertCircle, ArrowLeft, ShieldAlert } from "lucide-react";

interface ErrorViewProps {
    message: string;
    onRetry: () => void;
    onBack: () => void;
}

export default function ErrorView({ message, onRetry, onBack }: ErrorViewProps) {
    const isProhibited = message.includes("PROHIBITED_CONTENT") || message.includes("Safety settings");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
            {isProhibited ? (
                <>
                    <div className="flex flex-col items-center max-w-md w-full rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                            <ShieldAlert size={28} />
                        </div>
                        <h2 className="text-xl font-semibold text-red-900 mb-2">Analysis Blocked</h2>
                        <p className="text-sm text-red-700 leading-relaxed mb-6">
                            Our AI safety systems have blocked this transcript because it contains prohibited or highly sensitive content (such as explicit language, harassment, or dangerous material).
                        </p>
                        <button
                            onClick={onBack}
                            className="w-full flex justify-center items-center gap-2 rounded-xl bg-white border border-red-200 px-5 py-3 text-sm font-medium text-red-700 cursor-pointer hover:bg-red-50 transition-colors"
                        >
                            <ArrowLeft size={16} /> Return to Upload
                        </button>
                    </div>
                </>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
}
