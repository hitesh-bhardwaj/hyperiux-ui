"use client";

import Link from "next/link";
import BlurText from "@/components/effects/BlueText";

export function HeroSection({ effectCount }) {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1d4ed8_0%,rgba(29,78,216,0.22)_22%,transparent_52%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.3)_0%,transparent_34%),radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.22)_0%,transparent_34%),linear-gradient(180deg,#050816_0%,#020617_55%,#000000_100%)]" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>{effectCount} effects available</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <BlurText delay={0.2} duration={0.8} blur={15}>
            Beautiful Effects
          </BlurText>
          <br />
          <span className="text-neutral-400">
            <BlurText delay={0.5} duration={0.8} blur={15}>
              For Your Website
            </BlurText>
          </span>
        </h1>

        <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
          A collection of animated effects and UI components. Copy-paste or use
          our CLI to add stunning animations to your Next.js project.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/effects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition-colors"
          >
            Browse Effects
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>

          <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 border border-neutral-800 rounded-xl font-mono text-sm">
            <span className="text-green-500">$</span>
            <span>npx hyperiux init</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
