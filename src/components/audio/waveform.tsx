export default function WaveForm({ active }: { active: boolean }) {
  const bars = 28;
  return (
    <div className="flex h-5 items-center gap-[3px]">
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className="w-1 origin-bottom rounded-sm bg-forest transition-[height] duration-300 ease-in-out"
          style={{
            height: active ? `${8 + Math.random() * 30}px` : "8px",
            animationName: active ? "wave-bar" : "none",
            animationDuration: `${0.5 + (i % 5) * 0.12}s`,
            animationIterationCount: "infinite",
            animationDelay: `${(i * 0.05) % 0.5}s`,
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}