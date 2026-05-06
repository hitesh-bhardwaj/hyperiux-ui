"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { VaultLayout } from "@/components/layout/VaultLayout";
import { VaultHeader } from "@/components/layout/VaultHeader";
import { EffectCard } from "@/components/ui/EffectCardNew";

export function VaultContent({ effects, effectCounts }) {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");

  // Filter effects based on search and category
  const filteredEffects = useMemo(() => {
    return effects.filter((effect) => {
      // Category filter
      if (categoryFilter !== "all") {
        const cats = effect.categories?.length ? effect.categories : [effect.category];
        if (!cats.includes(categoryFilter)) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const cats = effect.categories?.length ? effect.categories : [effect.category];
        return (
          effect.name.toLowerCase().includes(query) ||
          effect.title.toLowerCase().includes(query) ||
          cats.some((c) => c?.toLowerCase().includes(query)) ||
          effect.description?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [effects, categoryFilter, searchQuery]);

  const totalEffects = effects.length;

  return (
    <VaultLayout effectCounts={effectCounts} effects={effects}>
      <div className="min-h-screen bg-white dark:bg-dark-surface">
        {/* Sticky Header with Search */}
        <VaultHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalEffects={totalEffects}
        />

        {/* Hero Section - Coinbase style */}
        <div className="bg-white dark:bg-dark-surface">
          <div className="max-w-5xl mx-auto px-8 py-16 text-center">
            <p className="text-muted dark:text-white/60 mb-4 text-base font-sans">Welcome to</p>
            <h1 className="font-display text-6xl md:text-7xl font-normal text-foreground dark:text-white mb-8" style={{ lineHeight: '1.0' }}>
              The Vault
            </h1>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted dark:text-white/70 font-sans">
              <span>{totalEffects} effects</span>
              <span>•</span>
              <span>Free & open source</span>
              <span>•</span>
              <span>Copy & paste</span>
            </div>
          </div>
        </div>

        {/* Effects Grid */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Active filter indicator */}
          {(categoryFilter !== "all" || searchQuery) && (
            <div className="flex items-center gap-3 mb-8">
              <span className="text-sm text-muted dark:text-white/70 font-sans">
                Showing {filteredEffects.length} of {totalEffects} effects
              </span>
              {categoryFilter !== "all" && (
                <span className="px-4 py-1.5 bg-dark-surface dark:bg-white text-white dark:text-dark-surface text-sm capitalize font-medium" style={{ borderRadius: '56px' }}>
                  {categoryFilter}
                </span>
              )}
              {searchQuery && (
                <span className="px-4 py-1.5 bg-secondary-surface dark:bg-dark-card text-foreground dark:text-white text-sm font-medium" style={{ borderRadius: '56px' }}>
                  &quot;{searchQuery}&quot;
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {filteredEffects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="font-display text-3xl font-normal text-foreground dark:text-white mb-3" style={{ lineHeight: '1.1' }}>
                No effects found
              </h3>
              <p className="text-muted dark:text-white/70 font-sans text-base">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEffects.map((effect, i) => (
                  <EffectCard key={effect.name} effect={effect} priority={i < 4} />
                ))}
              </div>

              {/* End-of-listing statement */}
              <div className="mt-40 select-none overflow-hidden">
                <p
                  className="font-display font-normal text-center tracking-tight text-foreground/50 dark:text-white/50"
                  style={{ fontSize: "clamp(2rem, 2vw, 7.5rem)", lineHeight: 0.9 }}
                >
                  From subtle interactions to complex motion
                </p>
                <p
                  className="font-display font-normal text-center tracking-tight text-foreground/50 dark:text-white/50 mt-4"
                  style={{ fontSize: "clamp(1.5rem, 2vw, 5.25rem)", lineHeight: 1, fontStyle: "italic" }}
                >
                  — for those who care about detail.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </VaultLayout>
  );
}
