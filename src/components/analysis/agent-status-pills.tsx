import { AGENTS } from "./constants";

export function AgentStatusPills({ progress }: { progress: number }) {
  return (
    <div className="flex gap-3 mt-10 flex-wrap justify-center">
      {AGENTS.map((agent, i) => {
        const isActive = progress > (i * 33);
        return (
          <div 
            key={agent.id} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 border ${
              isActive 
                ? "bg-[var(--sage-light)] border-[var(--sage)]/20 shadow-sm" 
                : "bg-[var(--cream-mid)] border-transparent opacity-40"
            }`}
          >
            <agent.icon 
              size={13} 
              className={isActive ? "text-[var(--sage)]" : "text-[var(--charcoal-3)]"} 
            />
            <span className="text-xs font-medium text-[var(--charcoal-2)]">
              {agent.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
