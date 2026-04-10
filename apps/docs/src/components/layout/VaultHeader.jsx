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
};

export function VaultHeader({ searchQuery, onSearchChange, totalEffects, effectName, showSearch = true }) {
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <header className="sticky h-18 top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center h-full justify-between px-5">
        {/* Left side - Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/effects"
            className={`transition-colors ${
              currentCategory || effectName
                ? "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                : "text-neutral-900 dark:text-white font-medium"
            }`}
          >
            The Vault
          </Link>
          {currentCategory && !effectName && (
            <>
              <svg className="w-4 h-4 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-neutral-900 dark:text-white font-medium">
                {categoryNames[currentCategory] || currentCategory}
              </span>
            </>
          )}
          {effectName && (
            <>
              <svg className="w-4 h-4 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-neutral-900 dark:text-white font-medium">
                {effectName}
              </span>
            </>
          )}
          {totalEffects !== undefined && (
            <span className="ml-2 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs text-neutral-500 dark:text-neutral-400">
              {totalEffects}
            </span>
          )}
        </nav>

        {/* Right side - Search & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          {showSearch && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search effects..."
                className="w-64 pl-9 pr-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-[10px] text-neutral-500 dark:text-neutral-400">
                ⌘K
              </kbd>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
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
    </header>
  );
}
