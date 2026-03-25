import TextBlockReveal from "@/components/RectangularTextReveal/RectangularTextReveal";
import React from "react";
import { ReactLenis } from "lenis/react";

const page = () => {
  return (
          <ReactLenis root>
    
    <div className="w-screen h-fit bg-white text-black font-medium flex flex-col items-center">
      {/* <RectangularTextReveal/> */}
      <div className="w-full h-screen flex justify-center items-center text-[3vw]">
        <p>Scroll</p>
      </div>
      <div className="w-[70%] space-y-[4vw] h-[40vw]">
        <TextBlockReveal
          overlayEnterDuration={0.35}
          overlayExitDuration={0.35}
          coverDuration={0.4}
          revealDuration={0.5}
          baseColor="#ff6b00"
          overlayColor="#1a1a1a"
        >
          <h1 className=" text-[5.5vw] leading-[1.1] font-semibold">
            Hi, This is a premium dual - layer text reveal animation.
          </h1>
        </TextBlockReveal>
        <div className="w-[40%]">
          <TextBlockReveal
            baseColor="#ff6b00"
            // overlayEnterDuration={0.3}
            // overlayExitDuration={0.3}
            coverDuration={0.3}
            revealDuration={0.3}
            useOverlay={false}
            overlayColor="#1a1a1a"
          >
            <p>
              The future of interfaces isn’t just about what users see - it’s about how motion communicates intent. Every transition, every reveal, and every micro-interaction should feel deliberate, fluid, and alive.
            </p>
          </TextBlockReveal>
        </div>
      </div>
    </div>
    </ReactLenis>
  );
};

export default page;
