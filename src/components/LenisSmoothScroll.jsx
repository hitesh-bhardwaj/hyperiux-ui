"use client"
// import { gsap } from "@/lib/gsapCore";
import { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';

const LenisSmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 500)
    }

    gsap.ticker.add(update)

    return () => gsap.ticker.remove(update)
  }, []);

  return <ReactLenis root options={{ autoRaf: false}} ref={lenisRef}>{children}</ReactLenis>
}

export default LenisSmoothScroll;