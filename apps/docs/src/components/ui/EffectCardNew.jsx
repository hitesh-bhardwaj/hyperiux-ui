"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function EffectCard({ effect }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Load wishlist state from localStorage
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("hyperiux-wishlist") || "[]");
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="group relative bg-white dark:bg-neutral-700 rounded-lg border-10 border-white dark:border-neutral-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Preview Image */}
      <Link href={`/effects/${effect.name}`} className="block group">
        <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden relative ">
          <Image src={effect.coverImage || "/assets/img/image01.webp"} alt={effect.title || effect.name} width={300} height={200} className="h-full w-full object-cover rounded-lg group-hover:scale-[1.1] duration-300 ease-in-out transition-all" />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300 capitalize">
              {effect.category}
            </span>
          </div>

          {/* Action buttons - top right */}
          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(effect.previewUrl || `/effects/${effect.name}/preview`, '_blank');
              }}
              className="p-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-colors"
              aria-label="Preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={toggleWishlist}
              className={`p-2 backdrop-blur-sm rounded-lg transition-colors ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800"
              }`}
              aria-label="Add to wishlist"
            >
              <svg
                className="w-4 h-4"
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
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/effects/${effect.name}`} className="block">
          <h3 className="font-medium text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
            {effect.title}
          </h3>
        </Link>

        {/* Dependencies */}
        <div className="flex items-center gap-2 mt-3">
          {effect.dependencies?.map((dep) => (
            <span
              key={dep}
              className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800  text-xs text-neutral-500 dark:text-neutral-400"
            >
              {dep}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
