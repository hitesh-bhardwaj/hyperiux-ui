
'use client'
import GlassStripParallax from "@/components/GlassEffects/FractalGlass";
export default function Home() {
  return (
    <>
          <GlassStripParallax
        imageSrc="/assets/img/image10.jpg"  // image to distort (should be large and detailed for best effect)
       stripesFrequency={40}         // number of vertical glass strips (lower = wider)
       glassStrength={2.0}          // displacement per strip
       glassSmoothness={0.014}      // fractal sample spacing
       parallaxStrength={0.15}       // mouse parallax intensity
       distortionMultiplier={8.0}   // parallax boost in distorted areas
       edgePadding={0.12}           // edge fade zone (0-0.3)
      //  mediaType="image"
        // videoSrc="/assets/video03.mp4"  // path to video file (used if mediaType="video")
     />
    </>
  );
}
