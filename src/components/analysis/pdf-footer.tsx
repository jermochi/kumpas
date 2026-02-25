"use client";

import { Download } from "lucide-react";

export default function PdfFooter() {
    return (
        <div className="rounded-2xl bg-ink px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h3 className="text-base font-bold text-white">
                    Ready to generate the full PDF?
                </h3>
                <p className="text-xs text-white/70 mt-0.5">
                    Career roadmap · scholarship pathway · coping plan · research citations
                </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink cursor-pointer hover:bg-white/90 transition-colors whitespace-nowrap">
                <Download size={16} />
                Generate PDF Report
            </button>
        </div>
    );
}
