import { MicOff } from "lucide-react";

interface PermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PermissionModal({ isOpen, onClose }: PermissionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all animate-in fade-in">
            <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl animate-in zoom-in-95 border border-black/[0.06]">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm border border-red-100">
                    <MicOff size={24} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-ink">Microphone Access Denied</h3>
                <p className="mb-6 text-[15px] leading-relaxed text-muted-text">
                    We need access to your microphone to record audio. Please allow microphone permissions in your browser settings and try again.
                </p>
                <button
                    onClick={onClose}
                    className="w-full rounded-xl bg-ink py-3.5 text-[15px] font-medium text-white transition-all hover:bg-forest hover:shadow-md active:scale-[0.98]"
                >
                    Got it, thanks
                </button>
            </div>
        </div>
    );
}
