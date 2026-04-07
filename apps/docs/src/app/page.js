import Link from "next/link";
import { getRegistryIndex } from "@/lib/registry";
import { HeroSection } from "./hero-section";

export default function Home() {
  const registry = getRegistryIndex();
  const effectCount = registry.items.length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <HeroSection effectCount={effectCount} />

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Copy & Paste</h3>
            <p className="text-neutral-400 text-sm">
              No npm packages to install. Just copy the code directly into your
              project. You own the code.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">CLI Tool</h3>
            <p className="text-neutral-400 text-sm">
              Use our CLI to add effects automatically. Handles dependencies and
              places files in the right location.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Customizable</h3>
            <p className="text-neutral-400 text-sm">
              Every effect is fully customizable. Adjust props, tweak styles,
              make it yours.
            </p>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="max-w-5xl mx-auto px-4 py-24 border-t border-neutral-800">
        <h2 className="text-3xl font-bold mb-8 text-center">Quick Start</h2>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Initialize Hyperiux</h3>
              <div className="p-3 rounded-lg bg-neutral-900 font-mono text-sm">
                <span className="text-green-500">$</span> npx hyperiux init
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Add an effect</h3>
              <div className="p-3 rounded-lg bg-neutral-900 font-mono text-sm">
                <span className="text-green-500">$</span> npx hyperiux add
                blur-text
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Use it in your component</h3>
              <div className="p-3 rounded-lg bg-neutral-900 font-mono text-sm overflow-x-auto">
                <pre>{`import { BlurText } from "@/components/effects/blur-text";

<BlurText>Hello World</BlurText>`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-24 text-center border-t border-neutral-800">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-neutral-400 mb-8">
          Browse our collection of {effectCount} beautiful effects.
        </p>
        <Link
          href="/effects"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition-colors"
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
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Built with Next.js and Tailwind CSS
          </div>
          <div className="flex items-center gap-4">
            <p className="text-neutral-500" suppressHydrationWarning>
              © {new Date().getFullYear()}{" "}
              <a
                href="https://hyperiux.com"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                Hyperiux Immersion Labs
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
