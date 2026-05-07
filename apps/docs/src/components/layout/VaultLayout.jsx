"use client";

import { Suspense, useState } from "react";
import { Sidebar } from"./Sidebar";
import { GlobalSearch } from"./SearchBar";

function SidebarFallback({ totalEffects }) {
 return (
 <aside
 className="fixed left-0 top-15 bottom-0 z-40 p-3 bg-transparent text-foreground"
 style={{ width: "5.5rem" }}
 >
 <div className="relative flex flex-col h-full w-full border border-transparent rounded-lg overflow-visible">
  <button
    type="button"
    aria-label="Open sidebar"
 className="absolute left-2 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl bg-black/35 border border-border/60 flex items-center justify-center backdrop-blur-md"
 style={{ zIndex: 60 }}
  >
 <div className="flex gap-1.5">
 <span className="h-6 w-0.75 rounded-full bg-white/90" />
 <span className="h-6 w-0.75 rounded-full bg-white/90" />
 </div>
 </button>

 <div className="h-full w-full flex items-center justify-center">
 <div className="h-14 w-14" />
 </div>
 </div>
 </aside>
 );
}

export function VaultLayout({
 children,
 effectCounts = {},
 effects = [],
 bgImageSrc = "/assets/hero-bg.png",
}) {
 const totalEffects = effects.length;
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 return (
 <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
 <div
 className="pointer-events-none fixed inset-0 z-10 bg-cover bg-center"
 style={{
 backgroundImage: bgImageSrc ? `url("${bgImageSrc}")` : undefined,
 opacity: bgImageSrc ? 0.85 : 1
 }}
 />
 <div className="pointer-events-none fixed inset-0 -z-10 bg-black/30" />
 <Suspense fallback={<SidebarFallback totalEffects={totalEffects} />}>
 <Sidebar
 effectCounts={effectCounts}
 totalEffects={totalEffects}
 isExpanded={isSidebarOpen}
 onToggle={() => setIsSidebarOpen((v) => !v)}
 onClose={() => setIsSidebarOpen(false)}
 />
 </Suspense>
 <main
 className="relative z-10 transition-[margin-left] duration-300 ease-out"
 style={{ marginLeft: isSidebarOpen ? "16rem" : "" }}
 >
 {children}
 </main>
 <GlobalSearch effects={effects} />
 </div>
 );
}
