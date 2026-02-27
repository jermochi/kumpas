"use client";

import { Download, Loader2 } from "lucide-react";

interface PdfFooterProps {
    onGenerate: () => void;
    isGenerating: boolean;
}

export default function PdfFooter({ onGenerate, isGenerating }: PdfFooterProps) {
    return (
        <div
            className={`
                rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                transition-all duration-300 relative overflow-hidden
                ${isGenerating ? 'bg-ink/90' : 'bg-ink'}
            `}
        >
            {/* Animated Loading Bar Background */}
            {isGenerating && (
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 20px)`,
                        backgroundSize: '28px 28px',
                        animation: 'progress-stripes 1s linear infinite'
                    }}
                />
            )}

            {/* Inject infinite scroll CSS for the striped background */}
            <style jsx>{`
                @keyframes progress-stripes {
                    from { background-position: 28px 0; }
                    to { background-position: 0 0; }
                }
            `}</style>

            <div className="relative z-10">
                <h3 className="text-base font-bold text-white">
                    Ready to generate the full PDF?
                </h3>
                <p className="text-xs text-white/70 mt-0.5">
                    {isGenerating ? "Compiling your assessment report, please wait..." : "Career roadmap · scholarship pathway · coping plan · research citations"}
                </p>
            </div>

            <button
                onClick={onGenerate}
                disabled={isGenerating}
                className={`
                    relative z-10 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap
                    ${isGenerating
                        ? 'bg-white/20 text-white cursor-wait'
                        : 'bg-white text-ink cursor-pointer hover:bg-white/90'
                    }
                `}
            >
                {isGenerating ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Generating PDF...
                    </>
                ) : (
                    <>
                        <Download size={16} />
                        Generate PDF Report
                    </>
                )}
            </button>
        </div>
    );
}
