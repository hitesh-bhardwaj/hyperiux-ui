"use client";

import { Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { GlobalSearch } from "./SearchBar";

function SidebarFallback({ effectCounts }) {
  const totalEffects = Object.values(effectCounts).reduce((a, b) => a + b, 0);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-neutral-200 flex flex-col z-40">
      <div className="p-5 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="font-semibold text-lg text-neutral-900">Hyperiux</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2 bg-neutral-100 text-neutral-900">
            <span className="text-lg">◎</span>
            <span className="font-medium">The Vault</span>
            <span className="ml-auto text-sm text-neutral-400">{totalEffects}</span>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function VaultLayout({ children, effectCounts = {}, effects = [] }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Suspense fallback={<SidebarFallback effectCounts={effectCounts} />}>
        <Sidebar effectCounts={effectCounts} />
      </Suspense>
      <main className="ml-[260px]">
        {children}
      </main>
      <GlobalSearch effects={effects} />
    </div>
  );
}
