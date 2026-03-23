"use client";

import { useState } from "react";
import Link from "next/link";
import { VaultLayout } from "@/components/layout/VaultLayout";
import { VaultHeader } from "@/components/layout/VaultHeader";
import { EffectCard } from "@/components/ui/EffectCardNew";

export function EffectDetailContent({
  slug,
  effect,
  config,
  code,
  relatedEffects,
  effectCounts,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("hyperiux-wishlist") || "[]");
    let newWishlist;

    if (isWishlisted) {
      newWishlist = wishlist.filter((name) => name !== slug);
    } else {
      newWishlist = [...wishlist, slug];
    }

    localStorage.setItem("hyperiux-wishlist", JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);
  };

  // Generate usage code
  const componentName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const usageCode = `import { ${componentName} } from "@/components/effects/${slug}";

export default function MyComponent() {
  return (
    <${componentName}>
      Your content here
    </${componentName}>
  );
}`;

  const installCode = `npx hyperiux add ${slug}`;

  return (
    <VaultLayout effectCounts={effectCounts}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Sticky Header with Breadcrumb */}
        <VaultHeader effectName={effect.title} showSearch={false} />

        {/* Title Section */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-6xl mx-auto px-8 py-6">
            {/* Title row */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                  {effect.title}
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">{effect.description}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/effects/${slug}/preview`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Live Preview
                </Link>

                <button
                  onClick={toggleWishlist}
                  className={`p-2 rounded-lg border transition-colors ${
                    isWishlisted
                      ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-500"
                      : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
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
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Preview + Documentation */}
            <div className="lg:col-span-2 space-y-8">
              {/* Preview */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <div className="text-8xl opacity-10 dark:opacity-20 text-neutral-900 dark:text-neutral-100">
                    {effect.category === "text" && "Aa"}
                    {effect.category === "backgrounds" && "◐"}
                    {effect.category === "buttons" && "◉"}
                    {effect.category === "scroll" && "↕"}
                    {effect.category === "cursor" && "◈"}
                  </div>
                </div>
              </div>

              {/* Documentation */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Documentation</h2>

                {/* Installation */}
                <div className="space-y-3">
                  <h3 className="font-medium text-neutral-700 dark:text-neutral-300">Installation</h3>
                  <CodeBlockWithCopy code={installCode} language="bash" />
                </div>

                {/* Usage */}
                <div className="space-y-3">
                  <h3 className="font-medium text-neutral-700 dark:text-neutral-300">Usage</h3>
                  <CodeBlockWithCopy code={usageCode} language="jsx" />
                </div>

                {/* Component Code */}
                <div className="space-y-3">
                  <h3 className="font-medium text-neutral-700 dark:text-neutral-300">Component Code</h3>
                  <CodeBlockWithCopy code={code} language="jsx" filename={`${slug}.jsx`} />
                </div>

                {/* Props Table */}
                {config?.props?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-neutral-700 dark:text-neutral-300">Props</h3>
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                          <tr>
                            <th className="text-left px-4 py-3 font-medium text-neutral-600 dark:text-neutral-400">Prop</th>
                            <th className="text-left px-4 py-3 font-medium text-neutral-600 dark:text-neutral-400">Type</th>
                            <th className="text-left px-4 py-3 font-medium text-neutral-600 dark:text-neutral-400">Default</th>
                            <th className="text-left px-4 py-3 font-medium text-neutral-600 dark:text-neutral-400">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                          {config.props.map((prop) => (
                            <tr key={prop.name}>
                              <td className="px-4 py-3 font-mono text-neutral-900 dark:text-white">{prop.name}</td>
                              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{prop.type}</td>
                              <td className="px-4 py-3 font-mono text-neutral-500 dark:text-neutral-400">
                                {config.defaults?.[prop.name]?.toString() || "-"}
                              </td>
                              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{prop.description || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Resource Details */}
            <div className="space-y-6">
              {/* Resource details card */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
                <h3 className="font-medium text-neutral-900 dark:text-white">Resource details</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Category</span>
                    <span className="text-neutral-900 dark:text-white capitalize">{effect.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Dependencies</span>
                    <span className="text-neutral-900 dark:text-white">
                      {effect.dependencies?.join(", ") || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">License</span>
                    <span className="text-neutral-900 dark:text-white">MIT</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs text-neutral-600 dark:text-neutral-400 capitalize">
                      {effect.category}
                    </span>
                    {effect.dependencies?.map((dep) => (
                      <span
                        key={dep}
                        className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs text-neutral-600 dark:text-neutral-400"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Props (if available) */}
              {config?.props?.length > 0 && (
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-4">Try it out</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    Use the Live Preview to interact with props
                  </p>
                  <Link
                    href={`/effects/${slug}/preview`}
                    target="_blank"
                    className="block w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-center font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                  >
                    Open Live Preview
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Related Resources */}
          {relatedEffects.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Related effects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedEffects.map((relatedEffect) => (
                  <EffectCard key={relatedEffect.name} effect={relatedEffect} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </VaultLayout>
  );
}

function CodeBlockWithCopy({ code, language = "jsx", filename }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">{filename}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <div className="relative">
        {!filename && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm text-neutral-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
        <pre className="p-4 overflow-x-auto text-sm bg-neutral-900 text-neutral-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
