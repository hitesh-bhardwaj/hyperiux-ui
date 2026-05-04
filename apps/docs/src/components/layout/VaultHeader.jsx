"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";

const categoryNames = {
  text: "Text Animations",
  backgrounds: "Backgrounds",
  buttons: "Buttons",
  scroll: "Scroll Animations",
  cursor: "Cursor Effects",
  components: "Components",
  navigation: "Navigation",
  transitions: "Page Transitions",
  loaders: "Website Loaders",
  webgl: "WebGL",
  others: "Others",
};

export function VaultHeader({ searchQuery, onSearchChange, totalEffects, effectName, showSearch = true }) {
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <header className="sticky top-0 z-30 p-3 pl-0">
      <div className="border rounded-lg bg-white/50 dark:bg-neutral-900/50 w-full h-18 backdrop-blur-md border-border">
        <div className="flex items-center h-full justify-between px-6">
          {/* Left side - Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-sans">
            <Link
              href="/effects"
              className={`transition-colors ${currentCategory || effectName
                  ? "text-muted dark:text-white/60 hover:text-foreground dark:hover:text-white"
                  : "text-foreground dark:text-white font-semibold"
                }`}
            >
              The Vault
            </Link>
            {currentCategory && !effectName && (
              <>
                <svg className="w-4 h-4 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-foreground dark:text-white font-semibold">
                  {categoryNames[currentCategory] || currentCategory}
                </span>
              </>
            )}
            {effectName && (
              <>
                <svg className="w-4 h-4 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-foreground dark:text-white font-semibold">
                  {effectName}
                </span>
              </>
            )}
            {totalEffects !== undefined && (
              <span className="ml-2 px-3 py-1 bg-secondary-surface dark:bg-dark-card text-xs text-muted dark:text-white/70 font-medium" style={{ borderRadius: '56px' }}>
                {totalEffects}
              </span>
            )}
          </nav>

          {/* Right side - Search & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            {showSearch && (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted dark:text-white/60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search effects..."
                  className="w-64 pl-10 pr-3 py-2.5 border border-border rounded-xl text-sm text-foreground dark:text-white placeholder:text-muted dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-sans"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex px-2 py-1 bg-white/80 dark:bg-dark-surface/80 border border-border rounded text-xs text-muted dark:text-white/60 font-mono">
                  ⌘ K
                </kbd>
              </div>
            )}

            {/* Theme Toggle - Coinbase pill style */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-secondary-surface dark:bg-dark-card text-muted dark:text-white/80 hover:bg-primary hover:text-white transition-colors"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
