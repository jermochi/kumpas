"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface FullscreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function FullscreenModal({ isOpen, onClose, title, children }: FullscreenModalProps) {
    const backdropRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    const handleBackdropClick = useCallback(
        (e: React.MouseEvent) => { if (e.target === backdropRef.current) onClose(); },
        [onClose],
    );

    if (!isOpen) return null;

    return (
        <div
            ref={backdropRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-8"
            style={{ animation: "modalFadeIn 0.25s ease-out" }}
        >
            <div
                className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                style={{ animation: "modalScaleIn 0.25s ease-out" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-4">
                    <h2 className="text-base font-semibold text-ink">{title}</h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/[0.04] cursor-pointer transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} className="text-muted-text" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
}
