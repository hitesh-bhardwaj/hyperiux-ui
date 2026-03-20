import { Suspense } from "react";
import { getEffectsByCategory, getRegistryIndex } from "@/lib/registry";
import { VaultContent } from "./vault-content";

export const metadata = {
  title: "The Vault | Hyperiux UI",
  description: "Browse all available effects and animations",
};

function VaultFallback() {
  return (
    <div className="min-h-screen bg-neutral-50 ml-[260px]">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-8 py-16 text-center">
          <p className="text-neutral-500 mb-3">Welcome to</p>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-8">
            The Vault
          </h1>
          <div className="h-12 w-full max-w-xl mx-auto bg-neutral-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function EffectsPage() {
  const categories = getEffectsByCategory();
  const registry = getRegistryIndex();

  // Calculate effect counts per category
  const effectCounts = {};
  for (const [category, effects] of Object.entries(categories)) {
    effectCounts[category] = effects.length;
  }

  return (
    <Suspense fallback={<VaultFallback />}>
      <VaultContent
        effects={registry.items}
        effectCounts={effectCounts}
      />
    </Suspense>
  );
}
