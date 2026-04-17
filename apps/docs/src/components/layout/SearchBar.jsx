"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function SearchBar({
  value = "",
  onChange,
  placeholder = "Search effects...",
  totalCount = 0,
  className = ""
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3.5 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
      />
      {totalCount > 0 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
          {totalCount} effects
        </div>
      )}
    </div>
  );
}

export function GlobalSearch({ effects = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredEffects = effects.filter((effect) =>
    effect.name.toLowerCase().includes(query.toLowerCase()) ||
    effect.title.toLowerCase().includes(query.toLowerCase()) ||
    effect.category?.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (effect) => {
    router.push(`/effects/${effect.name}`);
    setIsOpen(false);
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative max-w-xl mx-auto mt-[20vh]">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search effects..."
              className="flex-1 bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
            />
            <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs text-neutral-500 dark:text-neutral-400">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredEffects.length === 0 ? (
              <div className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                No effects found for "{query}"
              </div>
            ) : (
              <div className="py-2">
                {filteredEffects.map((effect) => (
                  <button
                    key={effect.name}
                    onClick={() => handleSelect(effect)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition-colors"
                  >
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400">
                      {effect.category?.[0]?.toUpperCase() || "E"}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-white">{effect.title}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">{effect.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
