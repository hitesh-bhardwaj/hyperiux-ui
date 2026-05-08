"use client";

import { useState, useEffect, useRef } from"react";
import Link from"next/link";
import Image from"next/image";

export function EffectCard({ effect, priority = false }) {
 const [isWishlisted, setIsWishlisted] = useState(false);
 const [isHovered, setIsHovered] = useState(false);
 const [videoSrc, setVideoSrc] = useState(null);
 const videoRef = useRef(null);

 // Only construct the URL, don't assign to video until first hover
 const videoPreviewUrl = effect.videoUrl
 ? `https://res.cloudinary.com/hyperiux/video/upload/v1775820344/${effect.videoUrl}.mp4`
 : null;

 // Load wishlist state from localStorage
 useEffect(() => {
 const wishlist = JSON.parse(localStorage.getItem("hyperiux-wishlist") ||"[]");
 // eslint-disable-next-line react-hooks/set-state-in-effect
 setIsWishlisted(wishlist.includes(effect.name));
 }, [effect.name]);

 const handleMouseEnter = () => {
 setIsHovered(true);
 // Lazy-load video src on first hover
 if (videoPreviewUrl && !videoSrc) {
 setVideoSrc(videoPreviewUrl);
 }
 };

 // Handle video play/pause on hover
 useEffect(() => {
 if (videoRef.current) {
 if (isHovered) {
 videoRef.current.play().catch(() => {});
 } else {
 videoRef.current.pause();
 videoRef.current.currentTime = 0;
 }
 }
 }, [isHovered]);

 const toggleWishlist = (e) => {
 e.preventDefault();
 e.stopPropagation();

 const wishlist = JSON.parse(localStorage.getItem("hyperiux-wishlist") ||"[]");
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
 className="group relative bg-white/20 p-3 pb-[0.01vw] rounded-md border border-border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/50 backdrop-blur-md"
 onMouseEnter={handleMouseEnter}
 onMouseLeave={() => setIsHovered(false)}
 >
 {/* Preview Image/Video */}
 <Link href={`/effects/${effect.name}`} className="block">
 <div className="aspect-video bg-black/20 rounded-sm overflow-hidden relative">
 {/* Static Image */}
 <Image
 src={effect.coverImage ||"/assets/img/image01.webp"}
 alt={effect.title || effect.name}
 fill
 sizes="(max-width: 768px) 100vw, 50vw"
 priority={priority}
 className={`object-cover transition-all duration-500 ${
 isHovered && videoSrc ?'opacity-0' :'opacity-100'
 }`}
 />

 {/* Video Preview on Hover - src only set after first hover */}
 {videoPreviewUrl && (
 <video
 ref={videoRef}
 src={videoSrc || undefined}
 muted
 loop
 playsInline
 className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
 isHovered && videoSrc ?'opacity-100' :'opacity-0'
 }`}
 />
 )}
 {/* Category badge(s) */}
 

 {/* Action buttons - top right */}
 <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
 <button
 onClick={(e) => {
 e.preventDefault();
 e.stopPropagation();
 window.open(effect.previewUrl || `/effects/${effect.name}/preview`,'_blank');
 }}
 className="p-2.5 bg-black/20 border border-border backdrop-blur-sm text-foreground rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer"
 aria-label="Preview"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 </button>
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
 </div>
 </Link>

 {/* Info */}
 
 <div className=" flex items-center justify-between py-4">
 <Link href={`/effects/${effect.name}`} className="block">
 <h3 className="font-sans font-semibold  text-base text-foreground group-hover:text-primary transition-colors">
 {effect.title}
 </h3>
 </Link>
 <div className="flex items-center gap-2  flex-wrap">
 {(effect.categories?.length ? effect.categories : [effect.category]).map((cat) => (
 <span key={cat} className="px-3 py-1 bg-white border border-border backdrop-blur-sm text-xs font-semibold text-[#3C3C3C] capitalize font-sans" style={{ borderRadius:'56px' }}>
 {cat}
 </span>
 ))}
 </div>

 {/* Dependencies */}
 {/* <div className="flex items-center gap-2 mt-3 flex-wrap">
 {effect.dependencies?.map((dep) => (
 <span
 key={dep}
 className="px-3 py-1 bg-black/30 border border-border text-xs text-muted font-medium font-mono"
 style={{ borderRadius:'56px' }}
 >
 {dep}
 </span>
 ))}
 </div> */}
 </div>
 </div>
 );
}
