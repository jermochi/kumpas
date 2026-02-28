"use client";

import { useEffect, useRef } from "react";
import { Download, X } from "lucide-react";

interface PdfModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string | null;
}

export default function PdfModal({ isOpen, onClose, pdfUrl }: PdfModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    if (!isOpen || !pdfUrl) return null;

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="backdrop:bg-black/60 backdrop:backdrop-blur-sm w-full max-w-5xl h-[90vh] max-h-[1000px] rounded-2xl bg-white shadow-2xl m-auto p-0 z-50 overflow-hidden outline-none"
        >
            <div className="flex h-full flex-col">
                <header className="flex items-center justify-between border-b border-black/5 px-6 py-4 shrink-0 bg-gray-50/80">
                    <div>
                        <h2 className="text-lg font-bold text-ink">Assessment Report</h2>
                        <p className="text-xs text-muted-text">Printable PDF Document</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={pdfUrl}
                            download={`Kumpas_Assessment_Report.pdf`}
                            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest"
                        >
                            <Download size={16} />
                            Download PDF
                        </a>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-muted-text hover:bg-black/5 hover:text-ink transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </header>
                <div className="flex-1 bg-gray-200 p-4 overflow-hidden">
                    {/* Object tag for native PDF viewing experience */}
                    <object
                        data={pdfUrl}
                        type="application/pdf"
                        className="w-full h-full rounded shadow-sm bg-white"
                    >
                        <div className="flexh-full items-center justify-center flex-col gap-2 p-8 text-center text-muted-text">
                            <p>Your browser doesn't support viewing PDFs directly.</p>
                            <a href={pdfUrl} download className="text-forest underline font-semibold">Download it here</a>
                        </div>
                    </object>
                </div>
            </div>
        </dialog>
    );
}
