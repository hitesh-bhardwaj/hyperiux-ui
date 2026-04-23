"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";

import ImageParticleBreakdown from "@/components/ImageParticleBreakdown/ImageParticleBreakdown";
import ParticleFaceTunnel from "@/components/ParticleFaceTunnel/ParticleFaceTunnel";
import StickyPointPlaneSection from "@/components/StickyPointPlaneSection/StickyPointPlaneSection";
// Assuming you saved the new component here:
// import StickyPointPlaneSection from "@/components/StickyPointPlaneSection";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const sectionRef = useRef(null);

  const heroProgressRef = useRef(0);
  const tunnelProgressRef = useRef(0);

  const tunnelLayerRef = useRef(null);
  const gridLayerRef = useRef(null); // New ref for the grid

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize both hidden
      gsap.set([tunnelLayerRef.current, gridLayerRef.current], {
        autoAlpha: 0,
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          // 1. Hero Progress (Full 0-100)
          heroProgressRef.current = p;

          // 2. TUNNEL CALCULATION (Modified)
          // Formula: (current - start) / (end - start)
          // This makes tunnelProgressRef 0 at 28% scroll and 1 at 60% scroll.
          const tunnelP = gsap.utils.clamp(0, 1, (p - 0.28) / (0.6 - 0.28));
          tunnelProgressRef.current = tunnelP;

          // Visibility: Fade in at 28%, fade out at 60% (or stay visible)
          // We use a tight 5% window (0.05) for the fade-in
          const tunnelOpacity = gsap.utils.clamp(0, 1, (p - 0.28) / 0.05);

          // Optional: If you want it to fade OUT as the Grid (60%+) arrives:
          const tunnelFadeOut = gsap.utils.clamp(0, 1, (0.65 - p) / 0.05);

          gsap.set(tunnelLayerRef.current, {
            autoAlpha: tunnelOpacity * tunnelFadeOut,
          });

          // 3. Grid/PointPlane (Starts at 60% as requested earlier)
          const gridOpacity = gsap.utils.clamp(0, 1, (p - 0.58) / 0.08);
          gsap.set(gridLayerRef.current, { autoAlpha: gridOpacity });
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  useEffect(() => {
    gsap.set(".gradient-1", { opacity: 0 });
    gsap.set(".gradient-2", { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "15% top",
        end: "25% top",
        scrub: true,
      },
    });

    tl.fromTo(
      sectionRef.current,
      { background: "#ffffff" },
      {
        background: "#111B7F",
      },
    )
      .fromTo(".gradient-2", { opacity: 0 }, { opacity: 1 }, "<")
      .fromTo(".gradient-1", { opacity: 0 }, { opacity: 1 }, "<");

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <ReactLenis root>
      <main className="bg-white">
        <section
          ref={sectionRef}
          className="relative h-[1800vh]"
          id="experience"
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Background Gradients */}
            <div className="gradient-1 pointer-events-none absolute inset-0 z-0">
              <div className="absolute bottom-0 left-0 h-[60vh] w-screen bg-linear-to-b from-[#0A1057]/0 to-[#0A1057]" />
            </div>
            <div className="gradient-2 pointer-events-none absolute inset-0 z-0">
              <div className="absolute bottom-0 left-0 h-[25vh] w-screen bg-linear-to-b from-[#2D5F92]/0 to-[#2D5F92]" />
            </div>

            {/* NEW COMPONENT LAYER - GRID (z-index 5, top layer) */}
            <div
              ref={gridLayerRef}
              className="absolute inset-0 z-5 pointer-events-none"
            >
              <StickyPointPlaneSection
                sectionRef={sectionRef} // MUST PASS THIS REF
                trailSize={0.05}
                trailDensity={150}
                trailSpeedMin={300}
                trailSpeedMax={305}
                trailTailMin={120}
                trailTailMax={156}
                trailColor={[2.4, 2.4, 2.4]}
                startY={-4} // Start it lower so the upward "rush" is more visible
              />
            </div>

            {/* TUNNEL LAYER */}
            <div ref={tunnelLayerRef} className="absolute inset-0 z-[4]">
              <ParticleFaceTunnel
                progressRef={tunnelProgressRef}
                faceImageSrc="/assets/face-outline.png"
                // ... your existing props
              />
            </div>

            {/* HERO BREAKDOWN LAYER */}
            <div className="absolute inset-0 z-[3]">
              <ImageParticleBreakdown
                imageSrc="/assets/ametrasu-bg-img.png"
                progressRef={heroProgressRef}
                transitionColors={["#142ea8", "#a9e7ff", "#ffffff"]}
              />
            </div>
          </div>
        </section>
      </main>
    </ReactLenis>
  );
}
