"use client";

import { useState, useMemo } from"react";
import { useSearchParams } from"next/navigation";
import { VaultLayout } from"@/components/layout/VaultLayout";
import { VaultHeader } from"@/components/layout/VaultHeader";
import { EffectCard } from"@/components/ui/EffectCardNew";

export function VaultContent({ effects, effectCounts }) {
 const searchParams = useSearchParams();
 const categoryFilter = searchParams.get("category") ||"all";
 const [searchQuery, setSearchQuery] = useState("");
 const quickCategories = useMemo(() => {
 const entries = Object.entries(effectCounts || {}).filter(([k]) => k && k !=="all");
 entries.sort((a, b) => (b[1] || 0) - (a[1] || 0));
 return entries.slice(0, 5).map(([id]) => id);
 }, [effectCounts]);

 // Filter effects based on search and category
 const filteredEffects = useMemo(() => {
 return effects.filter((effect) => {
 // Category filter
 if (categoryFilter !=="all") {
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
 <div className="min-h-screen text-foreground">
 {/* Fixed Header with Search */}
 <VaultHeader
 searchQuery={searchQuery}
 onSearchChange={setSearchQuery}
 totalEffects={totalEffects}
 />

 {/* Hero Section - Coinbase style */}
 <div className="">
 <div className=" mx-auto px-8 pt-28 pb-12 text-center">
 <p className="text-muted mb-4 text-base font-sans">Hello</p>
 <h1 className="font-display text-6xl md:text-7xl font-normal text-foreground mb-4" style={{ lineHeight:'1.0' }}>
 Welcome to <br/> the vault
 </h1>

 {/* Quick stats */}
 <div className="flex items-center justify-center gap-4 text-md text-muted font-sans">
 <span>{totalEffects} effects</span>
 <span>•</span>
 <span>Free & open source</span>
 <span>•</span>
 <span>Copy & paste</span>
 </div>
 </div>
 </div>

 {/* Search row + quick category buttons */}
 <div className=" px-10 pb-10">
 <div className="flex items-center gap-6 flex-wrap">

 <div className="flex-1 ">
 <div className="relative">
 <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white z-10">
 <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 </div>
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search effects..."
 className="w-full pl-14 pr-5 py-3 rounded-full bg-white/20 backdrop-blur-md border border-border text-foreground placeholder:text-muted focus:outline-none  focus:border-transparent transition-all font-sans"
 />
 </div>
 </div>
 <div className="flex items-center gap-3 flex-wrap">
 {quickCategories.map((cat) => (
 <a
 key={cat}
 href={`/effects?category=${cat}`}
 className="px-6 py-2 text-md rounded-full bg-white/20 backdrop-blur-md border border-border text-foreground hover:bg-white/20 transition-colors font-sans"
 >
 {cat ==="webgl" ?"WebGL" : cat.charAt(0).toUpperCase() + cat.slice(1)}
 </a>
 ))}
 </div>
 </div>
 </div>

 {/* Effects Grid */}
 <div className=" px-10 pb-12">
 {/* Active filter indicator */}
 {(categoryFilter !=="all" || searchQuery) && (
 <div className="flex items-center gap-3 mb-8">
 <span className="text-sm text-muted font-sans">
 Showing {filteredEffects.length} of {totalEffects} effects
 </span>
 {categoryFilter !=="all" && (
 <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-border text-foreground text-sm capitalize font-medium" style={{ borderRadius:"56px" }}>
 {categoryFilter}
 </span>
 )}
 {searchQuery && (
 <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-border text-foreground text-sm font-medium" style={{ borderRadius:"56px" }}>
 &quot;{searchQuery}&quot;
 </span>
 )}
 </div>
 )}

 {/* Grid */}
 {filteredEffects.length === 0 ? (
 <div className="text-center py-20">
 <div className="text-6xl mb-6">🔍</div>
 <h3 className="font-display text-3xl font-normal text-foreground mb-3" style={{ lineHeight:'1.1' }}>
 No effects found
 </h3>
 <p className="text-muted font-sans text-base">
 Try adjusting your search or filter criteria
 </p>
 </div>
 ) : (
 <>
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
 {filteredEffects.map((effect, i) => (
 <EffectCard key={effect.name} effect={effect} priority={i < 4} />
 ))}
 </div>

 {/* End-of-listing statement */}
 <div className="mt-40 select-none overflow-hidden">
 <p
 className="font-display font-normal text-center tracking-tight text-foreground/50"
 style={{ fontSize:"clamp(2rem, 2vw, 7.5rem)", lineHeight: 0.9 }}
 >
 From subtle interactions to complex motion
 </p>
 <p
 className="font-display font-normal text-center tracking-tight text-foreground/50 mt-4"
 style={{ fontSize:"clamp(1.5rem, 2vw, 5.25rem)", lineHeight: 1, fontStyle:"italic" }}
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
