"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Brain,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Lightbulb,
  Compass,
  Heart,
  Award,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import styles from "@/styles/landing.module.css";

/* ─── floating icon config ─── */
const FLOATING_ICONS = [
  { Icon: GraduationCap, x: "10%", y: "20%", size: 30, delay: 0, dur: 7, colorClass: "text-forest" },
  { Icon: Target, x: "82%", y: "26%", size: 28, delay: 1.2, dur: 8, colorClass: "text-gold" },
  { Icon: Lightbulb, x: "15%", y: "65%", size: 26, delay: 0.6, dur: 9, colorClass: "text-amber" },
  { Icon: Compass, x: "78%", y: "68%", size: 28, delay: 1.8, dur: 7.5, colorClass: "text-sage" },
  { Icon: Users, x: "35%", y: "85%", size: 24, delay: 2.4, dur: 8.5, colorClass: "text-ochre" },
  { Icon: Heart, x: "65%", y: "15%", size: 24, delay: 1.5, dur: 8, colorClass: "text-red-soft" },
  { Icon: TrendingUp, x: "50%", y: "88%", size: 28, delay: 0.9, dur: 7.5, colorClass: "text-forest-light" },
];

/* ─── bubble phrases ─── */
const BUBBLE_PHRASES = [
  { text: "\"Where do you see yourself in 5 years?\"", x: "70%", y: "17%", delay: 1.8 },
  { text: "\"What are your strengths?\"", x: "8%", y: "35%", delay: 0.5 },
  { text: "\"Describe a challenge you overcame.\"", x: "12%", y: "65%", delay: 2.2 },
  { text: "\"What motivates you?\"", x: "75%", y: "70%", delay: 0.8 },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-background font-sans">
      {/* ── ambient gradient blobs ── */}
      <div className={styles.blobGreen} />
      <div className={styles.blobGold} />

      {/* ── floating icons ── */}
      {mounted &&
        FLOATING_ICONS.map(({ Icon, x, y, size, delay, dur, colorClass }, i) => (
          <div
            key={`icon-${i}`}
            className={`${styles.floatIcon} ${colorClass}`}
            style={{
              left: x,
              top: y,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
            }}
          >
            <Icon size={size} strokeWidth={1.6} />
          </div>
        ))}

      {/* ── bubble phrases ── */}
      {mounted &&
        BUBBLE_PHRASES.map(({ text, x, y, delay }, i) => (
          <div
            key={`bubble-${i}`}
            className={styles.bubble}
            style={{
              left: x,
              top: y,
              animationDelay: `${delay}s`,
            }}
          >
            {text}
          </div>
        ))}

      {/* ── hero content ── */}
      <section className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 text-center">
        {/* pill badge */}
        <div
          className={`${styles.fadeUp} mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 px-5 py-2.5 text-xs font-medium tracking-wide text-muted-text shadow-sm backdrop-blur-sm sm:text-sm`}
          style={{ animationDelay: "0.1s" }}
        >
          <Sparkles size={14} className="text-forest" />
          Powered by Multi-Agent AI
        </div>

        {/* main heading */}
        <h1
          className={`${styles.fadeUp} ${styles.heroHeading} font-heading max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl`}
          style={{ animationDelay: "0.25s" }}
        >
          Your Kumpas,
          <br />
          <em className="whitespace-nowrap bg-gradient-to-r from-forest to-forest-light bg-clip-text text-transparent text-3xl md:text-4xl lg:text-6xl">
            Turn Data Into Direction
          </em>
        </h1>

        {/* subtitle */}
        <p
          className={`${styles.fadeUp} mt-6 max-w-lg text-sm leading-6 text-muted-text sm:text-base sm:leading-7`}
          style={{ animationDelay: "0.4s" }}
        >
          Three specialized AI agents analyze labor markets,
          student feasibility, and emotional aspects to craft a personalized
          guidance roadmap.
        </p>

        {/* CTA button */}
        <Link
          href="/input"
          className={`${styles.fadeUp} ${styles.ctaButton} group mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream shadow-btn transition-all duration-300 hover:scale-[1.04] hover:shadow-lg active:scale-[0.98] sm:text-base`}
          style={{ animationDelay: "0.55s" }}
        >
          Get Started
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </section>

      {/* Footer */}
      <footer className="pb-10 flex flex-col items-center gap-2">
        <div className="h-px w-48 bg-black/[0.06]" />
        <p className="text-xs text-muted-text">
          By using Kumpas, you agree to our{" "}
          <Link
            href="/privacy"
            className="font-medium text-ink underline-offset-4 hover:underline transition-colors"
          >
            Privacy Policy
          </Link>
          {" "}·{" "}RA 10173 Compliant
        </p>
      </footer>
    </div>
  );
}