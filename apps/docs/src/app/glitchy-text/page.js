"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


const Text3D = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      let isDesktop = globalThis.innerWidth > 1024;
      if (isDesktop) {
        gsap.set(".text-2, .text-3, .text-4", {
          x: 0,
          y: 0,
          opacity: 1,
        });

        let resetCall;

        ScrollTrigger.create({
          trigger: ".text-container",
          start: "10% top",
          end: "bottom 10%",
          scrub: false,
          // markers: true,
          onUpdate: (self) => {
            const dir = self.direction; // 1 = down, -1 = up
            const velocity = Math.abs(self.getVelocity()) / 100; // normalize velocity

            // Cancel previous reset if scrolling again
            if (resetCall) resetCall.kill();

            gsap.to(".text-2", {
              x: 1,
              y: (dir === 1 ? -1 : 1) * velocity * 1.1, // multiply to control sensitivity
              duration: 0.1,
              overwrite: true,
            });
            gsap.to(".text-3", {
              x: 3,
              y: (dir === 1 ? -1 : 1) * velocity * 2.1, // bigger multiplier for more depth
              duration: 0.2,
              overwrite: true,
            });
            gsap.to(".text-4", {
              x: 4,
              y: (dir === 1 ? -1 : 1) * velocity * 2.5, // bigger multiplier for more depth
              duration: 0.2,
              overwrite: true,
            });

            // Schedule return to original position after 0.2s of no scroll
            resetCall = gsap.delayedCall(0.2, () => {
              gsap.to([".text-2", ".text-3", ".text-4"], {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
              });
            });
          },
        });
      } else {
        gsap.set(".text-2, .text-3, .text-4", {
          x: 0,
          y: 0,
          opacity: 1,
        });

        let resetCall;

        ScrollTrigger.create({
          trigger: ".text-container",
          start: "10% top",
          end: "bottom 10%",
          scrub: false,
          // markers: true,
          onUpdate: (self) => {
            const dir = self.direction; // 1 = down, -1 = up
            const velocity = Math.abs(self.getVelocity()) / 100; // normalize velocity

            // Cancel previous reset if scrolling again
            if (resetCall) resetCall.kill();

            gsap.to(".text-2", {
              x: 1,
              y: (dir === 1 ? -1 : 1) * velocity * 0.8, // multiply to control sensitivity
              duration: 0.1,
              overwrite: true,
            });
            gsap.to(".text-3", {
              x: 3,
              y: (dir === 1 ? -1 : 1) * velocity * 1.2, // bigger multiplier for more depth
              duration: 0.2,
              overwrite: true,
            });
            gsap.to(".text-4", {
              x: 4,
              y: (dir === 1 ? -1 : 1) * velocity * 1.5, // bigger multiplier for more depth
              duration: 0.3,
              overwrite: true,
            });

            // Schedule return to original position after 0.2s of no scroll
            resetCall = gsap.delayedCall(0.2, () => {
              gsap.to([".text-2", ".text-3", ".text-4"], {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
              });
            });
          },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
          <div className="h-[150vh] mobile:h-[150vh]">
            <div className="w-screen relative flex text-container justify-center items-center h-screen ">
              <p className="text-white text-1 w-[60%] z-[5]  mobile:w-full text-center leading-[1] text-[9vw]  font-bold">
                Scroll to See Glitchy Effect
              </p>
              <p className="absolute top-71  text-2 z-[3] text-pink-500   mobile:w-full w-[60%] text-center  leading-[1] text-[9vw] font-medium">
                Scroll to See Glitchy Effect
              </p>
              <p className="absolute text-3 top-71  z-[1] text-green-600  w-[60%]  mobile:w-full text-center leading-[1]  text-[9vw] font-medium">
                Scroll to See Glitchy Effect
              </p>
              <p className="absolute text-4 top-71  z-[0] text-blue-500  w-[60%]  mobile:w-full text-center leading-[1]  text-[9vw] font-medium">
                Scroll to See Glitchy Effect
              </p>
            </div>

          </div>
    </>
  );
};

export default Text3D;
