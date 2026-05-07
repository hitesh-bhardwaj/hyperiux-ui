"use client";

import { useEffect, useRef, useState, Suspense } from"react";
import Link from"next/link";
import { VaultLayout } from"@/components/layout/VaultLayout";
import { VaultHeader } from"@/components/layout/VaultHeader";
import { EffectCard } from"@/components/ui/EffectCardNew";
import { CldVideoPlayer } from"next-cloudinary";
import"next-cloudinary/dist/cld-video-player.css";

export function EffectDetailContent({
 slug,
 effect,
 config,
 code,
 relatedEffects,
 effectCounts,
}) {
 const [isWishlisted, setIsWishlisted] = useState(false);
 const [loadedVideoUrl, setLoadedVideoUrl] = useState(null);
 const [introVideoUrl, setIntroVideoUrl] = useState(null);
 const playerRef = useRef(null);
 const videoRef = useRef(null);

 const toggleWishlist = () => {
 const wishlist = JSON.parse(localStorage.getItem("hyperiux-wishlist") ||"[]");
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

 const usageCode = `import { ${componentName} } from"@/components/effects/${slug}";

export default function MyComponent() {
 return (
 <${componentName}>
 Your content here
 </${componentName}>
 );
}`;

 const installCode = `npx hyperiux add ${slug}`;
 const isLoaded = loadedVideoUrl === effect.videoUrl;
 const hasIntroDelayElapsed = introVideoUrl === effect.videoUrl;

 useEffect(() => {
 if (!effect.videoUrl) {
 return undefined;
 }

 const timeoutId = window.setTimeout(() => {
 setIntroVideoUrl(effect.videoUrl);
 }, 800);

 return () => window.clearTimeout(timeoutId);
 }, [effect.videoUrl]);

 useEffect(() => {
 if (!effect.videoUrl || !isLoaded || !hasIntroDelayElapsed) {
 return;
 }

 const startPlayback = async () => {
 try {
 if (typeof playerRef.current?.play ==="function") {
 await playerRef.current.play();
 return;
 }

 await videoRef.current?.play?.();
 } catch {
 // Ignore autoplay rejections; the muted player is retried through the native video element.
 }
 };

 startPlayback();
 }, [effect.videoUrl, hasIntroDelayElapsed, isLoaded]);

 return (
 <VaultLayout effectCounts={effectCounts} bgImageSrc="">
 <div className="min-h-screen text-foreground">
 {/* Sticky Header with Breadcrumb */}
 <Suspense fallback={<div className="h-12" />}>
 <VaultHeader effectName={effect.title} showSearch={false} />
 </Suspense>

 {/* Main content */}
 <div className=" mx-auto px-8 pt-28 pb-8">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
 {/* Left: Title + Preview + Documentation */}
 <div className="lg:col-span-2 space-y-8">
 {/* Title Section */}
 <div>
 <h1 className="text-3xl text-foreground mb-2">
 {effect.title}
 </h1>
 <p className="text-muted">{effect.description}</p>
 </div>
 {/* Preview */}
 <div className="h-[50vh] overflow-hidden relative">
 {effect.videoUrl ? (
 <CldVideoPlayer
 key={effect.videoUrl}
 src={effect.videoUrl}
 autoplay
 loop
 muted
 playsinline
 controls={false}
 playerRef={playerRef}
 videoRef={videoRef}
 className="w-full h-full object-cover"
 poster={true}
 onDataLoad={() => setLoadedVideoUrl(effect.videoUrl)}
 />
 ) : (
 <div className="flex items-center justify-center h-full">
 <div className="text-8xl opacity-10 text-foreground">
 {(effect.categories?.length ? effect.categories : [effect.category]).map((cat) => (
 <span key={cat}>
 {cat ==="text" &&"Aa"}
 {cat ==="backgrounds" &&"◐"}
 {cat ==="buttons" &&"◉"}
 {cat ==="scroll" &&"↕"}
 {cat ==="cursor" &&"◈"}
 {cat ==="webgl" &&"◈"}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Documentation */}
 <div className="space-y-6">
 <h2 className="text-xl font-semibold text-foreground">Documentation</h2>

 {/* Installation */}
 <div className="space-y-3">
 <h3 className="font-medium text-muted">Installation</h3>
 <CodeBlockWithCopy code={installCode} language="bash" />
 </div>

 {/* Usage */}
 <div className="space-y-3">
 <h3 className="font-medium text-muted">Usage</h3>
 <CodeBlockWithCopy code={usageCode} language="jsx" />
 </div>

 {/* Component Code */}
 <div className="space-y-3">
 <h3 className="font-medium text-muted">Component Code</h3>
 <CodeBlockWithCopy code={code} language="jsx" filename={`${slug}.jsx`} />
 </div>

 {/* Props Table */}
 {config?.props?.length > 0 && (
 <div className="space-y-3">
 <h3 className="font-medium text-muted">Props</h3>
 <div className="bg-secondary-surface/60 backdrop-blur-md rounded-xl border border-border overflow-hidden">
 <table className="w-full text-sm">
 <thead className="bg-black/20 border-b border-border">
 <tr>
 <th className="text-left px-4 py-3 font-medium text-muted">Prop</th>
 <th className="text-left px-4 py-3 font-medium text-muted">Type</th>
 <th className="text-left px-4 py-3 font-medium text-muted">Default</th>
 <th className="text-left px-4 py-3 font-medium text-muted">Description</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {config.props.map((prop) => (
 <tr key={prop.name}>
 <td className="px-4 py-3 font-mono text-foreground">{prop.name}</td>
 <td className="px-4 py-3 text-muted">{prop.type}</td>
 <td className="px-4 py-3 font-mono text-muted">
 {config.defaults?.[prop.name]?.toString() ||"-"}
 </td>
 <td className="px-4 py-3 text-muted">{prop.description ||"-"}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Right: Action Buttons + Resource Details (Sticky) */}
 <div className="lg:col-span-1 self-start">
 <div className="sticky top-24 space-y-6 h-fit">
 {/* Action buttons */}
 <div className="flex items-center gap-3">
 <Link
 href={effect.previewUrl || `/effects/${slug}/preview`}
 target="_blank"
 className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border backdrop-blur-md text-foreground bg-primary hover:bg-primary/80 hover:text-white rounded-md hover:border-transparent transition-colors"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 Live Preview
 </Link>

 <button
 onClick={toggleWishlist}
 className={`p-2.5 backdrop-blur-sm rounded-full transition-colors cursor-pointer ${
 isWishlisted
 ?"bg-primary text-white"
 :"bg-black/20 border border-border text-foreground hover:bg-primary hover:text-white"
 }`}
 aria-label="Add to wishlist"
 >
 <svg
 className="w-4 h-4"
 fill={isWishlisted ?"currentColor" :"none"}
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

 {/* Resource details card */}
 <div className="bg-secondary-surface/60 backdrop-blur-md rounded-md border border-border p-5 space-y-4">
 <h3 className="font-medium text-foreground">Resource details</h3>

 <div className="space-y-3 text-sm">
 <div className="flex justify-between gap-6">
 <span className="text-muted">Category</span>
 <span className="text-foreground capitalize text-right">
 {(effect.categories?.length ? effect.categories : [effect.category]).join(",")}
 </span>
 </div>
 <div className="flex justify-between gap-6">
 <span className="text-muted">Dependencies</span>
 <span className="text-foreground text-right">
 {effect.dependencies?.join(",") ||"None"}
 </span>
 </div>
 <div className="flex justify-between gap-6">
 <span className="text-muted">License</span>
 <span className="text-foreground text-right">MIT</span>
 </div>
 </div>

 {/* Tags */}
 <div className="pt-3 border-t border-border">
 <div className="flex flex-wrap gap-2">
 {(effect.categories?.length ? effect.categories : [effect.category]).map((cat) => (
 <span key={cat} className="px-2.5 py-1 bg-white border border-border rounded-full text-xs text-[#3C3C3C] capitalize">
 {cat}
 </span>
 ))}
 {effect.dependencies?.map((dep) => (
 <span
 key={dep}
 className="px-2.5 py-1 bg-white border border-border rounded-full text-xs text-[#3C3C3C]"
 >
 {dep}
 </span>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Related Resources */}
 {relatedEffects.length > 0 && (
 <div className="mt-16">
 <h2 className="text-xl font-semibold text-foreground mb-6">Related effects</h2>
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

function CodeBlockWithCopy({ code, language ="jsx", filename }) {
 const [copied, setCopied] = useState(false);

 const handleCopy = async () => {
 await navigator.clipboard.writeText(code);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <div className="bg-secondary-surface/60 backdrop-blur-md rounded-md border border-border overflow-hidden">
 {filename && (
 <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-b border-border">
 <span className="text-sm text-muted">{filename}</span>
 <button
 onClick={handleCopy}
 className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
 </svg>
 {copied ?"Copied!" :"Copy"}
 </button>
 </div>
 )}
 <div className="relative">
 {!filename && (
 <button
 onClick={handleCopy}
 className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 hover:bg-black/55 border border-border rounded text-sm text-muted transition-colors"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
 </svg>
 {copied ?"Copied!" :"Copy"}
 </button>
 )}
 <pre className="p-4 overflow-x-auto text-sm bg-black/40 text-foreground">
 <code>{code}</code>
 </pre>
 </div>
 </div>
 );
}
