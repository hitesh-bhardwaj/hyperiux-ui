"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const categoryNames = {
 text:"Text Animations",
 backgrounds:"Backgrounds",
 buttons:"Buttons",
 scroll:"Scroll Animations",
 cursor:"Cursor Effects",
 components:"Components",
 navigation:"Navigation",
 transitions:"Page Transitions",
 loaders:"Website Loaders",
 webgl:"WebGL",
 others:"Others",
};

export function VaultHeader({ searchQuery, onSearchChange, totalEffects, effectName, showSearch = true }) {
 const searchParams = useSearchParams();
 const currentCategory = searchParams.get("category");

 return (
 <header className="fixed top-0 left-0 right-0 z-50 px-10 h-18 py-4 bg-black/10 backdrop-blur-md ">
 <div className="flex items-center h-full justify-between">

 <Link href="/" className="flex items-center gap-3">
 <Image src="/hyperiux.svg" alt="Hyperiux" width={30} height={30} />
 <div className="flex items-center gap-2 text-white">
 <Image src="/hyperiux-wordmark.svg" alt="Hyperiux" width={156} height={45} />
 {/* <span className="text-xl -ml-1">UI</span> */}
 </div>
 </Link>

 {/* Right side - Search */}
 <div className="flex items-center gap-3">
 {currentCategory && (
 <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl bg-[#A9A9A9]/30 backdrop-blur-xs text-sm text-foreground">
 <span>{categoryNames[currentCategory] || currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</span>
 <Link href="/effects" className="hover:text-white transition-colors">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </Link>
 </div>
 )}
 {/* Search Bar */}
 {showSearch && (
 <div className="relative ">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 </svg>
 </div>
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => onSearchChange(e.target.value)}
 placeholder="Search effects..."
 className="w-64 pl-10 pr-10 py-2.5 border border-border rounded-xl bg-[#A9A9A9]/30   text-sm text-foreground placeholder:text-muted focus:outline-none  transition-all backdrop-blur-xs"
 />
 {searchQuery && (
 <button
 onClick={() => onSearchChange("")}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 )}
 
 </div>
 )}
 </div>
 </div>
 </header>
 );
}
