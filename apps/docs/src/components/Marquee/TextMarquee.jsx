"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const items = [
  "makes it even better",
  "calls for adaptation",
  "an opportunity opens",
  "confronts injustice",
  "is a fresh start",
  "brings disappointment",
  "makes the difference",
  "Happens™",
  "brings the unexpected",
  "history is written",
  "doesn’t always go to plan",
  "builds on the work of today",
  "brings uncertainty",
  "new life begins",
  "may bring tears",
  "the story continues",
  "a chapter comes to a close",
  "sparks a new idea",
  "an opportunity slips away",
  "heroes are made",
  "fights inequality",
  "finishes the project",
];

export default function TextMarquee() {
  const trackRef = useRef(null);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [copyCount, setCopyCount] = useState(2);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const content = contentRef.current;
    const container = containerRef.current;

    if (!track || !content || !container) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      let tween;

      const startAnimation = () => {
        const distance = content.offsetHeight;
        const containerHeight = container.offsetHeight;

        if (!distance || !containerHeight) {
          return;
        }

        const nextCopyCount = Math.max(2, Math.ceil(containerHeight / distance) + 2);
        setCopyCount((currentCount) =>
          currentCount === nextCopyCount ? currentCount : nextCopyCount
        );

        tween?.kill();
        gsap.set(track, { y: 0 });

        tween = gsap.to(track, {
          y: -distance,
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      };

      startAnimation();

      const resizeObserver = new ResizeObserver(startAnimation);
      resizeObserver.observe(content);
      resizeObserver.observe(container);
      window.addEventListener("resize", startAnimation);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", startAnimation);
        tween?.kill();
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[100vh] overflow-hidden bg-black"
    >
      <div
        ref={trackRef}
        className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col text-white text-2xl md:text-3xl font-medium leading-none"
      >
        {Array.from({ length: copyCount }, (_, copyIndex) => (
          <div
            key={copyIndex}
            ref={copyIndex === 0 ? contentRef : null}
            className="flex flex-col"
            aria-hidden={copyIndex === 1}
          >
            {items.map((text, i) => (
              <div
                key={`${copyIndex}-${i}`}
                className="py-3 text-center whitespace-nowrap"
              >
                {text}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
