"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function InfiniteSlider() {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);
  const imagesRef = useRef([]);
  const circleRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    { src: "/assets/ghost/ghost01.webp" },
    { src: "/assets/ghost/ghost02.webp" },
    { src: "/assets/ghost/ghost03.webp" },
    { src: "/assets/ghost/ghost04.webp" },
    { src: "/assets/ghost/ghost05.webp" },
    { src: "/assets/ghost/ghost06.webp" },
    { src: "/assets/ghost/ghost07.webp" },
    { src: "/assets/ghost/ghost08.webp" },
    { src: "/assets/ghost/ghost09.webp" },
    { src: "/assets/ghost/ghost10.webp" },
    { src: "/assets/ghost/ghost11.webp" },
    { src: "/assets/ghost/ghost12.webp" },
    { src: "/assets/ghost/ghost14.webp" },
    { src: "/assets/ghost/ghost15.webp" },
    { src: "/assets/ghost/ghost16.webp" },
    { src: "/assets/ghost/ghost17.webp" },
    { src: "/assets/ghost/ghost18.webp" },
    { src: "/assets/ghost/ghost19.webp" },
    { src: "/assets/ghost/ghost20.webp" },
    { src: "/assets/ghost/ghost21.webp" },
  ];

  const loopImages = [...images, ...images];

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.08,
      infinite: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const totalWidth = track.scrollWidth / 2;

      let currentRotation = 0;

      const updateScale = () => {
        const center = window.innerWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        imagesRef.current.forEach((img, i) => {
          if (!img) return;

          const rect = img.getBoundingClientRect();
          const imgCenter = rect.left + rect.width / 2;
          const distance = Math.abs(center - imgCenter);
          const maxDist = window.innerWidth / 2 + rect.width / 2;

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i % images.length;
          }

          let progress = distance / maxDist;
          progress = gsap.utils.clamp(0, 1, progress);

          const scale = 1 + progress * 0.9;
          const yOffset = Math.sin(progress * Math.PI) * -40;

          gsap.to(img, {
            scale,
            y: yOffset,
            duration: 0.5,
            ease: "power2.out",
          });
        });

        setActiveIndex(closestIndex);

        const anglePerItem = 360 / images.length;
        const naiveTarget = -(closestIndex * anglePerItem);

        // Compute shortest angular delta to avoid snap on wrap
        let delta = naiveTarget - (currentRotation % 360);
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        currentRotation += delta;

        if (circleRef.current) {
          gsap.to(circleRef.current, {
            rotation: currentRotation,
            duration: 0.6,
            ease: "power3.out",
          });
        }
      };

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000",
          markers: false,
          scrub: true,
          onUpdate: (self) => {
            updateScale();
          },
        },
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });

      updateScale();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const radius = 300;
  const total = images.length;

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ height: "calc(100vh + 3000px)" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <div className="flex items-center h-full relative">
          <div ref={trackRef} className="flex">
            {loopImages.map((img, index) => (
              <div
                key={index}
                className="min-w-[55vw] h-screen flex items-center justify-center overflow-hidden"
              >
                <div className="w-[55vw] h-full shrink-0 overflow-hidden">
                  <Image
                    ref={(el) => (imagesRef.current[index] = el)}
                    src={img.src}
                    alt=""
                    width={1000}
                    height={1000}
                    className="w-full h-full brightness-50 object-cover will-change-transform"
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            className="fixed pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: `${radius * 2 + 36}px`,
              height: `${radius * 2 + 36}px`,
              zIndex: 50,
            }}
          >
            <div
              ref={circleRef}
              className="absolute inset-0"
              style={{ transformOrigin: "center center" }}
            >
              {images.map((img, i) => {
                const angleDeg = (360 / total) * i - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const x = radius * Math.cos(angleRad);
                const y = radius * Math.sin(angleRad);
                const isActive = i === activeIndex;

                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      zIndex: isActive ? 10 : 1,
                    }}
                  >
                    <div
                      style={{
                        transform: `rotate(${(360 / total) * i}deg)`,
                      }}
                    >
                      <Image
                        src={img.src}
                        alt=""
                        width={30}
                        height={40}
                        className="object-cover block"
                        style={{
                          transition: "width 0.3s ease, height 0.3s ease, outline 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}