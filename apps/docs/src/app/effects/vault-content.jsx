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
      if (categoryFilter !== "all" && effect.category !== categoryFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          effect.name.toLowerCase().includes(query) ||
          effect.title.toLowerCase().includes(query) ||
          effect.category?.toLowerCase().includes(query) ||
          effect.description?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [effects, categoryFilter, searchQuery]);

  const totalEffects = effects.length;

  return (
    <VaultLayout effectCounts={effectCounts} effects={effects}>
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950">
        {/* Sticky Header with Search */}
        <VaultHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalEffects={totalEffects}
        />

        {/* Hero Section */}
        <div className="">
          <div className="max-w-5xl mx-auto px-8 py-12 text-center">
            <p className="text-neutral-500 dark:text-neutral-400 mb-3">Welcome to</p>
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              The Vault
            </h1>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
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
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Showing {filteredEffects.length} of {totalEffects} effects
              </span>
              {categoryFilter !== "all" && (
                <span className="px-3 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full text-sm capitalize">
                  {categoryFilter}
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm">
                  &quot;{searchQuery}&quot;
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {filteredEffects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                No effects found
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEffects.map((effect) => (
                <EffectCard key={effect.name} effect={effect} />
              ))}
            </div>
          )}
        </div>
      </div>
    </VaultLayout>
  );
}
