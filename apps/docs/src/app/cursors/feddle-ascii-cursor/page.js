"use client";

import React, { useEffect } from"react";
import gsap from"gsap";
import { ScrollTrigger } from"gsap/dist/ScrollTrigger";
import FiddelAsciiCursor from'@/components/cursors/FiddelAsciiCursor'

gsap.registerPlugin(ScrollTrigger);

export default function page() {
 useEffect(() => {
 const ctx = gsap.context(() => {
 const boxes = gsap.utils.toArray(".curved-scroll-box");
 boxes.forEach((box, index) => {
 const isLeft = index % 2 === 0;
 const radius = window.innerWidth * 0.15;
 ScrollTrigger.create({
 trigger: box,
 start:"top bottom",
 end:"bottom top",
 onUpdate: (self) => {
 const progress = self.progress;
 const theta = progress * Math.PI;
 const xOffset = Math.sin(theta) * radius;
 const finalX = isLeft ? -xOffset : xOffset;
 gsap.set(box, { x: finalX });
 },
 });
 });
 });
 return () => ctx.revert();
 }, []);

 return (
 <section className="w-full bg-gray-400 h-[750vh] flex items-center justify-center relative">

 <p className="text-black text-[8vw] fixed top-1/2 left-1/2 -translate-x-1/2 w-full text-center leading-[.5] -translate-y-1/2 z-[1]">MOVE CURSOR <br /><span className="text-[2vw]">ON IMAGES TO SEE THE EFFECT</span> </p>
 <FiddelAsciiCursor className='w-[85vh] h-[50vh] absolute! top-50! left-1/2 -translate-x-1/2 z-10 aspect-video' />
 <div className="h-[20vh] w-full"></div>
 <div className="relative flex flex-col gap-[10vh] items-center">
 <div className="curved-scroll-box size-[30vw] rounded-[2vw] overflow-clip mr-[25vw] transform-gpu backface-hidden">
 <FiddelAsciiCursor className='w-full h-full' type='video' src='https://media.fiddle.digital/uploads/feature_kaleida_f406072b29.mp4' />
 </div>
 <div className="curved-scroll-box size-[30vw] overflow-hidden ml-[25vw] rounded-[2vw] transform-gpu backface-hidden">
 <FiddelAsciiCursor className='w-full h-full' type='image' src='/assets/img/image02.webp' />
 </div>
 <div className="curved-scroll-box size-[30vw] overflow-hidden mr-[25vw] rounded-[2vw] transform-gpu backface-hidden">
 <FiddelAsciiCursor className='w-full h-full' type='image' src='/assets/img/image03.webp' />
 </div>
 <div className="curved-scroll-box size-[30vw] overflow-hidden ml-[25vw] rounded-[2vw] transform-gpu backface-hidden">
 <FiddelAsciiCursor className='w-full h-full' />
 </div>
 <div className="curved-scroll-box size-[30vw] overflow-hidden mr-[25vw] rounded-[2vw] transform-gpu backface-hidden">
 <FiddelAsciiCursor className='w-full h-full' type='image' src='/assets/img/image01.webp' />
 </div>
 <div className="curved-scroll-box size-[30vw] overflow-hidden ml-[25vw] rounded-[2vw] transform-gpu backface-hidden">
 <FiddelAsciiCursor className='w-full h-full' type='image' src='/assets/img/image02.webp' />
 </div>
 <div className="curved-scroll-box size-[30vw] overflow-hidden mr-[25vw] rounded-[2vw] transform-gpu backface-hidden">
 <FiddelAsciiCursor className='w-full h-full' type='image' src='/assets/img/image03.webp' />
 </div>
 <div className="curved-scroll-box size-[30vw] overflow-hidden ml-[25vw] rounded-[2vw] transform-gpu backface-hidden">
 <FiddelAsciiCursor className='w-full h-full' />
 </div>
 </div>
 <div className="h-[20vh] w-full"></div>
 </section>
 );
}
