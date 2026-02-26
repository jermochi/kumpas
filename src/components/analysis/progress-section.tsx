import { ANALYSIS_STEPS } from "./constants";

export function ProgressSection({ stepIdx, progress }: { stepIdx: number; progress: number }) {
  return (
    <>
      <div className="h-6 mb-8">
        <p className="text-sm text-[var(--charcoal-3)] transition-opacity duration-300">
          {ANALYSIS_STEPS[Math.min(stepIdx, ANALYSIS_STEPS.length - 1)]}
        </p>
      </div>

      <div className="w-full max-w-sm mb-4">
        <div className="bg-[var(--cream-mid)] rounded-full h-1.5 overflow-hidden border border-[var(--cream-deep)]/30">
          <div 
            className="h-full bg-[var(--charcoal)] rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--charcoal-3)] opacity-60">
        {Math.round(progress)}% complete
      </p>
    </>
  );
}
