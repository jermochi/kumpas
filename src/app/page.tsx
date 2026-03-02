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
  { Icon: GraduationCap, x: "8%",  y: "18%", size: 28, delay: 0,   dur: 7  },
  { Icon: Briefcase,     x: "85%", y: "22%", size: 24, delay: 1.2, dur: 8  },
  { Icon: Brain,         x: "12%", y: "55%", size: 22, delay: 0.6, dur: 9  },
  { Icon: Target,        x: "90%", y: "60%", size: 26, delay: 1.8, dur: 7.5},
  { Icon: TrendingUp,    x: "20%", y: "80%", size: 20, delay: 2.4, dur: 8.5},
  { Icon: Users,         x: "78%", y: "82%", size: 24, delay: 0.3, dur: 7  },
  { Icon: BookOpen,      x: "5%",  y: "38%", size: 20, delay: 1.5, dur: 9  },
  { Icon: Lightbulb,     x: "92%", y: "42%", size: 22, delay: 2.1, dur: 8  },
  { Icon: Compass,       x: "30%", y: "15%", size: 18, delay: 0.9, dur: 7.5},
  { Icon: Heart,         x: "70%", y: "14%", size: 18, delay: 2.7, dur: 8.5},
  { Icon: Award,         x: "50%", y: "85%", size: 22, delay: 1.1, dur: 9  },
  { Icon: BarChart3,     x: "65%", y: "75%", size: 20, delay: 0.4, dur: 7  },
];

/* ─── bubble phrases ─── */
const BUBBLE_PHRASES = [
  { text: "\"What are your strengths?\"",       x: "6%",  y: "28%", delay: 0.5 },
  { text: "\"Where do you see yourself in 5 years?\"", x: "68%", y: "20%", delay: 1.8 },
  { text: "\"Tell me about yourself.\"",         x: "15%", y: "68%", delay: 2.2 },
  { text: "\"Why should we hire you?\"",         x: "72%", y: "70%", delay: 0.8 },
  { text: "\"Describe a challenge you overcame.\"", x: "4%", y: "45%", delay: 3.0 },
  { text: "\"What motivates you?\"",             x: "78%", y: "48%", delay: 1.4 },
  { text: "\"What's your dream career?\"",       x: "35%", y: "88%", delay: 2.6 },
  { text: "\"How do you handle pressure?\"",     x: "55%", y: "12%", delay: 3.4 },
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
        FLOATING_ICONS.map(({ Icon, x, y, size, delay, dur }, i) => (
          <div
            key={`icon-${i}`}
            className={styles.floatIcon}
            style={{
              left: x,
              top: y,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
            }}
          >
            <Icon size={size} strokeWidth={1.4} />
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
          className={`${styles.fadeUp} font-heading max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl`}
          style={{ animationDelay: "0.25s" }}
        >
          Counsel Smarter,
          <br />
          <em className="whitespace-nowrap bg-gradient-to-r from-forest to-forest-light bg-clip-text text-transparent">
            Guide Students Further
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
          className={`${styles.fadeUp} group mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream shadow-btn transition-all duration-300 hover:scale-[1.04] hover:shadow-lg active:scale-[0.98] sm:text-base`}
          style={{ animationDelay: "0.55s" }}
        >
          Get Started
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        {/* secondary info */}
        <p
          className={`${styles.fadeUp} mt-5 text-xs text-muted-text/70`}
          style={{ animationDelay: "0.65s" }}
        >
          Free &amp; open-source · No sign-up required
        </p>
      </section>
    </div>
  );
}