import { Sparkles } from "lucide-react";
import styles from "@/styles/analysis.module.css";

export function AgentSpinner() {
  return (
    <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
      <div className={`absolute inset-0 rounded-full border-2 border-[var(--cream-deep)] border-t-[var(--charcoal)] ${styles.spinSlow}`} />
      <div className={`absolute inset-4 rounded-full border-2 border-[var(--cream-mid)] border-b-[var(--sage)] ${styles.spinSlowReverse}`} />
      <div className={`absolute inset-8 rounded-full border-2 border-[var(--cream-mid)] border-r-[var(--ochre)] ${styles.spinSlow}`} />
      
      <div className="relative z-10 w-6 h-6 rounded-full bg-[var(--charcoal)] flex items-center justify-center shadow-lg">
        <Sparkles size={12} className="text-[var(--cream)]" />
      </div>
    </div>
  );
}
