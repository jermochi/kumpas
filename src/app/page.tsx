import Navbar from "@/components/navigation/nav-bar";
import InputContainer from "@/components/input/input-container";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="flex flex-col items-center px-6 pt-3 pb-4 sm:pt-5 sm:pb-5 md:pt-6 md:pb-6">
        {/* Pill badge */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 px-4 py-2 text-xs font-medium tracking-wide text-muted-text shadow-sm backdrop-blur-sm sm:text-sm">
          <Sparkles size={14} className="text-forest" />
          Powered by Multi-Agent AI
        </div>

        {/* Main heading */}
        <h1 className="font-heading max-w-3xl text-center text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
          Counsel Smarter,
          <br />
          <em className="whitespace-nowrap text-forest">Guide Students Further</em>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-md text-center text-xs leading-5 text-muted-text sm:mt-5 sm:text-sm sm:leading-6">
          Three specialized AI agents analyze labor markets,
          student feasibility, and emotional aspects to craft a personalized guidance roadmap.
        </p>
      </section>

      {/* Input Container */}
      <InputContainer />

      {/* Bottom spacer */}
      <div className="pb-20" />
    </div>
  );
}