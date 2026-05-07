'use client'
import { useEffect, useRef, useMemo } from"react";
import gsap from"gsap";
import { ScrollTrigger } from"gsap/ScrollTrigger";
import { SplitText } from"gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function TextBreak({
 text ="",
 bgColor ="bg-black",
 textColor ="text-white",
}) {
 const sectionRef = useRef(null);
 const wrapperRef = useRef(null);
 const textRef = useRef(null);

 // ✅ Height based on word count + baseline 600vh
 const dynamicHeight = useMemo(() => {
 const words = text.trim().split(/\s+/).length;

 const baseHeight = 600; // your original height
 const baseWords = 20; // sentence length reference

 const scale = words / baseWords;
 const calculated = baseHeight * scale;

 // clamp for safety
 const clamped = Math.max(300, Math.min(calculated, 2000));

 return `${clamped}vh`;
 }, [text]);

 useEffect(() => {
 const ctx = gsap.context(() => {
 const textEl = textRef.current;

 const split = SplitText.create(textEl, { type:"chars,words" });

 const scrollTween = gsap.to(textEl, {
 xPercent: -100,
 ease:"linear",
 scrollTrigger: {
 trigger: sectionRef.current,
 start:"top top",
 end:"bottom 70%",
 scrub: true,
 // markers: true,
 scroller: window,
 invalidateOnRefresh: true,
 },
 });

 split.chars.forEach((char) => {
 gsap.from(char, {
 yPercent: gsap.utils.random(-200, 200),
 rotation: gsap.utils.random(-20, 20),
 ease:"elastic.out(1,0.8)",
 scrollTrigger: {
 trigger: char,
 containerAnimation: scrollTween,
 start:"left 100%",
 end:"left 30%",
 scrub: 1,
 },
 });
 });
 }, sectionRef);

 return () => ctx.revert();
 }, [text]);

 return (
 <div
 ref={sectionRef}
 className={`relative ${bgColor}`}
 style={{ height: dynamicHeight }}
 >
 {/* Sticky viewport container */}
 <div
 ref={wrapperRef}
 className="sticky top-0 h-screen overflow-hidden flex items-center"
 >
 {/* Horizontally scrolling text */}
 <h3
 ref={textRef}
 className={`flex whitespace-nowrap gap-[4vw] font-sans! tracking-tighter pl-[100vw] font-bold leading-[1.1] ${textColor}`}
 style={{
 fontSize:"clamp(2rem, 10vw, 12rem)",
 width:"max-content",
 }}
 >
 {text}
 </h3>
 </div>
 </div>
 );
}