import { Zap, Loader2 } from "lucide-react";

interface ButtonProps {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    loadingText?: string;
}

export default function Button({ 
    text, 
    onClick, 
    disabled, 
    isLoading, 
    loadingText = "Loading..." 
}: ButtonProps) {
    return (
        <div className="border-t border-black/[0.06] p-4 sm:p-6">
            <button
                onClick={onClick}
                disabled={disabled || isLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink py-4 text-sm font-semibold text-white transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        {loadingText}
                    </>
                ) : (
                    <>
                        <Zap size={16} />
                        {text}
                    </>
                )}
            </button>
        </div>
    );
}