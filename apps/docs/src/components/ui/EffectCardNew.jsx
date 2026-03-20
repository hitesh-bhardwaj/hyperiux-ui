"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function EffectCard({ effect }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Load wishlist state from localStorage
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("hyperiux-wishlist") || "[]");
    setIsWishlisted(wishlist.includes(effect.name));
  }, [effect.name]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem("hyperiux-wishlist") || "[]");
    let newWishlist;

    if (isWishlisted) {
      newWishlist = wishlist.filter((name) => name !== effect.name);
    } else {
      newWishlist = [...wishlist, effect.name];
    }

    localStorage.setItem("hyperiux-wishlist", JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl border border-neutral-200 overflow-hidden transition-all hover:shadow-lg hover:border-neutral-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview Image */}
      <Link href={`/effects/${effect.name}`} className="block">
        <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
          {/* Placeholder - replace with actual preview images later */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">
              {effect.category === "text" && "Aa"}
              {effect.category === "backgrounds" && "◐"}
              {effect.category === "buttons" && "◉"}
              {effect.category === "scroll" && "↕"}
              {effect.category === "cursor" && "◈"}
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-neutral-700 capitalize">
              {effect.category}
            </span>
          </div>

          {/* Hover overlay with buttons */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              href={`/effects/${effect.name}/preview`}
              className="px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-100 transition-colors flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </Link>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/effects/${effect.name}`} className="flex-1">
            <h3 className="font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors">
              {effect.title}
            </h3>
            <p className="text-sm text-neutral-500 mt-1 line-clamp-1">
              {effect.description}
            </p>
          </Link>

          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            className={`p-2 rounded-lg transition-colors ${
              isWishlisted
                ? "text-red-500 bg-red-50"
                : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Dependencies */}
        <div className="flex items-center gap-2 mt-3">
          {effect.dependencies?.map((dep) => (
            <span
              key={dep}
              className="px-2 py-0.5 bg-neutral-100 rounded text-xs text-neutral-500"
            >
              {dep}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
