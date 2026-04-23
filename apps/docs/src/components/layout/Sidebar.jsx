"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

const categories = [
  { id: "all", name: "All Effects", icon: "◎" },
  { id: "text", name: "Text Animations", icon: "T" },
  { id: "backgrounds", name: "Backgrounds", icon: "◐" },
  { id: "buttons", name: "Buttons", icon: "◉" },
  { id: "scroll", name: "Scroll Animations", icon: "↕" },
  { id: "components", name: "Components", icon: "⬡" },
  { id: "navigation", name: "Navigation", icon: "☰" },
  { id: "cursor", name: "Cursor Effects", icon: "◈" },
  { id: "transitions", name: "Page Transitions", icon: "⇄" },
  { id: "loaders", name: "Website Loaders", icon: "⏳" },
  { id: "webgl", name: "WebGL", icon: "◈" },
  { id: "others", name: "Others", icon: "⊹" },
];

export function Sidebar({ effectCounts = {}, totalEffects = 0 }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col z-40">
      {/* Logo */}
      <div className="h-18 flex items-center px-5 border-b border-neutral-200 dark:border-neutral-800">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/hyperiux.svg"
            alt="Hyperiux"
            width={24}
            height={24}
          />
          <Image
            src="/hyperiux-wordmark.svg"
            alt="Hyperiux"
            width={116}
            height={24}
            className="dark:invert"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* The Vault section */}
        <div className="mb-6">
          <Link
            href="/effects"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2 transition-colors ${
              pathname === "/effects" && currentCategory === "all"
                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            <span className="text-lg">◎</span>
            <span className="font-medium">The Vault</span>
            <span className="ml-auto text-sm text-neutral-400">{totalEffects}</span>
          </Link>
        </div>

        {/* Categories */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
            Categories
          </p>
          {categories.slice(1).map((category) => {
            const count = effectCounts[category.id] || 0;
            const isActive = currentCategory === category.id;

            return (
              <Link
                key={category.id}
                href={`/effects?category=${category.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                <span className="w-5 text-center opacity-60">{category.icon}</span>
                <span className="text-sm">{category.name}</span>
                <span className="ml-auto text-xs text-neutral-400">{count}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">
          <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">⌘</kbd>
          <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">K</kbd>
          <span className="ml-1">to search</span>
        </div>
      </div>
    </aside>
  );
}
