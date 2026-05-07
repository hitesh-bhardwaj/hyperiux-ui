"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const categories = [
  { id: "all", name: "All Effects" },
  { id: "text", name: "Text Animations" },
  { id: "backgrounds", name: "Backgrounds" },
  { id: "buttons", name: "Buttons" },
  { id: "scroll", name: "Scroll Animations" },
  { id: "components", name: "Components" },
  { id: "navigation", name: "Navigation" },
  { id: "cursor", name: "Cursor Effects" },
  { id: "transitions", name: "Page Transitions" },
  { id: "loaders", name: "Website Loaders" },
  { id: "webgl", name: "WebGL" },
  { id: "others", name: "Others" },
];

export function Sidebar({
  effectCounts = {},
  totalEffects = 0,
  isExpanded: controlledExpanded,
  onToggle,
  onClose,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(false);
  const isExpanded =
    typeof controlledExpanded === "boolean" ? controlledExpanded : uncontrolledExpanded;
  const toggle = () => {
    if (onToggle) return onToggle();
    setUncontrolledExpanded((v) => !v);
  };
  const close = () => {
    if (onClose) return onClose();
    setUncontrolledExpanded(false);
  };

  return (
    <aside
      className="fixed left-5 top-20 bottom-0 z-40 p-3 bg-transparent text-foreground transition-all duration-300 ease-out"
      style={{ width: isExpanded ? "16rem" : "5.5rem" }}
    >
      <div
        className={`relative flex flex-col h-fit w-full rounded-lg transition-all duration-300 overflow-visible ${
          isExpanded
            ? "border border-border/50 p-4"
            : "border border-transparent"
        }`}
      >
        {/* Pinned toggle button (click to open/close) */}
        <button
          type="button"
          aria-label={isExpanded ? "Close sidebar" : "Open sidebar"}
          onClick={toggle}
          className="absolute -left-18 top-30 p-3  h-14 w-18 rounded-md bg-white/10 cursor-pointer border border-border/60 flex items-center justify-end backdrop-blur-md"
          
        >
          <div className="flex gap-1.5">
            <span className="h-6 w-0.5 rounded-full bg-foreground/90" />
            <span className="h-6 w-0.5 rounded-full bg-foreground/90" />
          </div>
        </button>

        {!isExpanded ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-14 w-14" />
          </div>
        ) : (
          <>
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto z-99">
              {/* The Vault section */}
              <div className="mb-6">
                <Link
                  href="/effects"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-2 bg-white/10 transition-colors ${
                    pathname === "/effects" && currentCategory === "all"
                      ? " text-foreground"
                      : "text-muted"
                  }`}
                  title="The Vault"
                  onClick={close}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 transition-opacity duration-300">
                    <span className="font-medium">The Vault</span>
                    <span className="ml-auto text-sm text-muted flex-shrink-0">
                      {totalEffects}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Categories */}
              <div className="space-y-1">
                <p className="px-3 text-sm font-medium text-muted uppercase tracking-wider my-4 transition-opacity duration-300">
                  Categories
                </p>
                <div className="bg-white/10 backdrop-blur-md rounded-md p-4 px-2 space-y-3">
                {categories.slice(1).map((category) => {
                  const count = effectCounts[category.id] || 0;
                  const isActive = currentCategory === category.id;

                  return (
                    <Link
                      key={category.id}
                      href={`/effects?category=${category.id}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-white/5 text-foreground"
                          : "text-muted hover:bg-black/30"
                      }`}
                      title={category.name}
                      onClick={close}
                    >
                      <div className="flex items-center flex-1 min-w-0 gap-3 transition-opacity duration-300">
                        <span className="text-sm truncate">{category.name}</span>
                        <span className="ml-auto text-xs text-muted flex-shrink-0">
                          {count}
                        </span>
                      </div>
                    </Link>
                  );
                })}
                </div>
              </div>
            </nav>
          </>
        )}
      </div>
    </aside>
  );
}
