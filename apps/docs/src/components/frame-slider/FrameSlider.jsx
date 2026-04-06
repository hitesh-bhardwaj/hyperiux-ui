"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";

const SCALE_OFFSCREEN = 1.2;
const ROTATION_DEG = 10;
const SCALE_CENTER = 1.0;

const FRAME_W = 500;
const FRAME_H = 600;
const SLIDE_W = FRAME_W;
const THUMB_W = 190;
const THUMB_H = 260;
const THUMB_GAP = 12;
const THUMB_ITEM = THUMB_W + THUMB_GAP;

const VH_PER_SLIDE = 70;
const CENTER_HOLD_RATIO = 0.18;
const scrubEase = gsap.parseEase("power3.out");

export default function ScrollFrameSlider({ images = [], bgColor = "#0f0e0e" }) {

  const slides = images.map((src, i) => ({
    id: `slide-${i}`,
    src,
    type: "image",
  }));

  const total = slides.length;

  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef    = useRef(null);
  const galleryRef    = useRef(null);
  const itemInnerRefs = useRef([]);
  const thumbLeftRef  = useRef(null);
  const thumbRightRef = useRef(null);
  const lastPosRef    = useRef(0);

  const applyPosition = useCallback((pos) => {
    if (!galleryRef.current) return;

    const tx = -pos * SLIDE_W;
    galleryRef.current.style.transform = `translate3d(${tx}px, 0px, 0px)`;

    itemInnerRefs.current.forEach((el, i) => {
      if (!el) return;
      const dist = i - pos;
      const absDist = Math.abs(dist);

      const maxRot = ROTATION_DEG;
      const rot = dist > 0
        ? Math.min(absDist, 1) * maxRot
        : -Math.min(absDist, 1) * maxRot;

      const scale = SCALE_CENTER + Math.min(absDist, 1) * (SCALE_OFFSCREEN - SCALE_CENTER);

      el.style.transform = `rotate(${rot}deg) scale(${scale})`;
    });

    const leftThumbTx = -pos * THUMB_ITEM;
    const rightThumbTx = -(pos + 1) * THUMB_ITEM;

    if (thumbLeftRef.current) {
      thumbLeftRef.current.style.transform = `translate3d(${leftThumbTx}px, -50%, 0px)`;
    }
    if (thumbRightRef.current) {
      thumbRightRef.current.style.transform = `translate3d(${rightThumbTx}px, -50%, 0px)`;
    }

    const rounded = Math.round(pos);
    if (rounded !== lastPosRef.current) {
      lastPosRef.current = rounded;
      setActiveIndex(rounded);
    }
  }, []);

  const getScrubbedPosition = useCallback((progress) => {
    if (total <= 1) return 0;

    const rawPos = progress * (total - 1);
    const baseIndex = Math.floor(rawPos);
    const clampedIndex = Math.min(baseIndex, total - 1);
    const segmentProgress = rawPos - baseIndex;

    if (clampedIndex >= total - 1) return total - 1;
    if (segmentProgress <= CENTER_HOLD_RATIO) return clampedIndex;

    const easedProgress = scrubEase(
      (segmentProgress - CENTER_HOLD_RATIO) / (1 - CENTER_HOLD_RATIO)
    );

    return clampedIndex + easedProgress;
  }, [total]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = null;

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const viewportH = window.innerHeight;
        const scrollableDistance = sectionHeight - viewportH;

        if (scrollableDistance <= 0) return;

        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
        const pos = getScrubbedPosition(progress);

        applyPosition(pos);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [applyPosition, getScrubbedPosition]);

  useEffect(() => {
    applyPosition(0);
  }, [applyPosition]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${total * VH_PER_SLIDE}vh` }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden select-none"
        style={{ height: "100vh", background: bgColor }}
      >
        {/* Slide counter */}
        <div
          className="absolute z-30"
          style={{
            top: 36, right: 40,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.28)",
            textTransform: "uppercase",
          }}
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </div>

        {/* Thumbnail strips */}
        <ThumbStrip
          refProp={thumbLeftRef}
          slides={slides}
          side="left"
          activeIndex={activeIndex}
          frameW={FRAME_W}
          thumbW={THUMB_W}
          thumbH={THUMB_H}
          thumbGap={THUMB_GAP}
          bgColor={bgColor}
        />
        <ThumbStrip
          refProp={thumbRightRef}
          slides={slides}
          side="right"
          activeIndex={activeIndex}
          frameW={FRAME_W}
          thumbW={THUMB_W}
          thumbH={THUMB_H}
          thumbGap={THUMB_GAP}
          bgColor={bgColor}
        />

        {/* Center frame */}
        <div
          className="absolute top-1/2 left-1/2 overflow-hidden"
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: "translate(-50%, -50%)",
            zIndex: 20,
          }}
        >
          {/* Dashed border overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: "1.5px dashed rgba(255,255,255,0.3)",
              zIndex: 40,
              borderRadius: 2,
            }}
          />

          {/* Gallery strip */}
          <div
            ref={galleryRef}
            className="absolute top-0 left-0 bottom-0 flex will-change-transform"
            style={{ width: SLIDE_W * total }}
          >
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className="relative shrink-0 overflow-hidden"
                style={{ width: SLIDE_W, height: FRAME_H }}
              >
                <div
                  ref={(el) => (itemInnerRefs.current[i] = el)}
                  className="absolute inset-0 will-change-transform"
                  style={{
                    transform: `rotate(${i === 0 ? 0 : ROTATION_DEG}deg) scale(${i === 0 ? 1 : SCALE_OFFSCREEN})`,
                    transformOrigin: "center center",
                    borderRadius: 0,  // explicitly no rounding on main slides
                  }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.id}
                    fill
                    style={{ objectFit: "cover", borderRadius: 0 }}
                    sizes={`${SLIDE_W}px`}
                    priority={i === 0}
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left + right edge gradients */}
        <div
          className="absolute inset-y-0 left-0 pointer-events-none"
          style={{
            width: 200,
            background: `linear-gradient(to right, ${bgColor} 0%, transparent 100%)`,
            zIndex: 25,
          }}
        />
        <div
          className="absolute inset-y-0 right-0 pointer-events-none"
          style={{
            width: 200,
            background: `linear-gradient(to left, ${bgColor} 0%, transparent 100%)`,
            zIndex: 25,
          }}
        />
      </div>
    </section>
  );
}

function ThumbStrip({ refProp, slides, side, frameW, thumbW, thumbH, thumbGap, bgColor }) {
  const stripStyle = {
    position: "absolute",
    top: "50%",
    zIndex: 10,
    overflow: "hidden",
    ...(side === "left"
      ? { right: `calc(50% + ${frameW / 2}px)`, left: 0 }
      : { left:  `calc(50% + ${frameW / 2}px)`, right: 0 }
    ),
    height: thumbH,
    transform: "translateY(-50%)",
  };

  return (
    <div style={stripStyle}>
      {side === "left" && (
        <div
          className="absolute inset-y-0 left-0 pointer-events-none"
          style={{
            width: 80, zIndex: 5,
            background: `linear-gradient(to right, ${bgColor} 0%, transparent 100%)`,
          }}
        />
      )}
      {side === "right" && (
        <div
          className="absolute inset-y-0 right-0 pointer-events-none"
          style={{
            width: 80, zIndex: 5,
            background: `linear-gradient(to left, ${bgColor} 0%, transparent 100%)`,
          }}
        />
      )}

      <div
        ref={refProp}
        className="absolute top-1/2 flex will-change-transform"
        style={{
          gap: thumbGap,
          transform: "translate3d(0px, -50%, 0px)",
          left: side === "left" ? "100%" : 0,
          right: "auto",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="shrink-0 overflow-hidden"
            style={{
              width: thumbW,
              height: thumbH,
              position: "relative",
              opacity: 0.5,
              borderRadius: 0,   // no rounding on thumbnails
            }}
          >
            <Image
              src={slide.src}
              alt={slide.id}
              fill
              style={{ objectFit: "cover", borderRadius: 0 }}
              draggable={false}
              sizes={`${thumbW}px`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}