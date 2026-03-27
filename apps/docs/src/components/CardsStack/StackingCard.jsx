"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SliderCard } from "./Card";

gsap.registerPlugin(ScrollTrigger);

export default function StackingCard({ data = [] }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      const numCards = cards.length;

      cards.forEach((card, i) => {
        gsap.set(card, {
          yPercent: i === 0 ? 0 : 100,
          zIndex: i + 1,
          scale: 1,
          rotation: 0,
          borderRadius: 0,
        });
      });

      const firstImage = cards[0]?.querySelector(".card-image");
      if (firstImage) {
        gsap.fromTo(
          firstImage,
          { scale: 1.5 },
          {
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "50% bottom",
              end: "bottom 60%",
              scrub: true,
            //   markers:true
            },
          }
        );
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${(numCards-1) * 100}%`,
          scrub: true,
        },
      });

      for (let i = 1; i < numCards; i++) {
        const rotateDir = (i - 1) % 2 === 0 ? -5 : 5;

        tl.to(
          cards[i],
          {
            yPercent: 0,
            duration: 1,
            ease: "none",
          },
          i - 1
        );

        const currentImage = cards[i].querySelector(".card-image");

        if (currentImage) {
          tl.to(
            currentImage,
            {
              keyframes: [
                { scale: 1.5, ease: "none", duration: 0.25 },
                { scale: 1, ease: "none", duration: 0.25 },
              ],
            },
            i - 1
          );
        }

        tl.to(
          cards[i - 1],
          {
            scale: 0.8,
            rotation: rotateDir,
            rotateX: 20,
            borderRadius: "3vw",
            ease: "linear",
          },
          i - 1
        ).to(
          cards[i - 1],
          {
            opacity: 0,
            ease: "none",
          },
          i - 0.5
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [data]);

  return (
    <section
      className="relative z-0 w-full"
      style={{ height: `${data.length * 100}vh` }}
    >
      <div
        ref={containerRef}
        className="sticky top-0 h-screen w-screen overflow-hidden bg-black"
        style={{ perspective: "1200px" }}
      >
        {data.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            className="absolute inset-0 overflow-hidden"
          >
            <SliderCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}
