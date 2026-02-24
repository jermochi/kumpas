import { AlertTriangle } from "lucide-react";

interface DiscardModalProps {
    isOpen: boolean;
    onDiscard: () => void;
    onCancel: () => void;
}

export default function DiscardModal({ isOpen, onDiscard, onCancel }: DiscardModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all animate-in fade-in">
            <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl animate-in zoom-in-95 border border-black/[0.06]">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 shadow-sm border border-orange-100">
                    <AlertTriangle size={24} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-ink">Discard Progress?</h3>
                <p className="mb-6 text-[15px] leading-relaxed text-muted-text">
                    You have an active recording or transcription on this tab. Switching tabs will discard your current progress. Are you sure you want to proceed?
                </p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-xl bg-black/5 py-3 text-[15px] font-medium text-ink transition-all hover:bg-black/10 active:scale-[0.98]"
                    >
                        Stay
                    </button>
                    <button
                        onClick={onDiscard}
                        className="flex-1 rounded-xl bg-orange-500 py-3 text-[15px] font-medium text-white transition-all hover:bg-orange-600 hover:shadow-md active:scale-[0.98]"
                    >
                        Discard
                    </button>
                </div>
            </div>
        </div>
    );
}
