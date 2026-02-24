import { Zap } from "lucide-react";

export default function Button({ text }: { text: string }) {
    return (
        <div className="border-t border-black/[0.06] p-4 sm:p-6">
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink py-4 text-sm font-semibold text-white transition-colors hover:bg-forest">
                <Zap size={16} />
                {text}
            </button>
        </div>
    )
}