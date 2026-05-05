"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("linesLoadingEase", "0.75,-0.01,0.16,1");

const LINE_COUNT = 17;
const NAV_H = 55;
const ROW_H = 24;

// Tuned to match the reference recordings (fast staggered growth + settle, then a quick wipe).
const MORPH_STAGGER = 34;
const MORPH_DUR = 720;
const APPEAR_DUR = 260;
const CONTENT_FADE_AT = 0.32; // seconds
const CONTENT_FADE_DUR = 520;
const TEXT_REVEAL_AT = 0.44; // seconds
const HOLD_AFTER_MORPH = 120;
const WIPE_DUR = 820;
const HOLD_END = 820;
const WIPE_OVERLAP = 0.10; // seconds (overlap lines end -> wipe start)

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function DemoContent({ theme = "dark", showText = true, navRefs, rowRefs } = {}) {
  const isDark = theme === "dark";

  const navItems = useMemo(
    () => [
      { left: "FIX STUDIO" },
      { center: "INDEX (22)" },
      { center: "(CONTACT)" },
      { center: "(SERVICES)" },
      { center: "(SELECTED CLIENTS)" },
      { center: "(PRESS)" },
      { right: "■" },
    ],
    []
  );

  const rows = useMemo(
    () => [
      ["A collective of creative thinkers making things", "+1212 457 3035", "Art Direction", "Netflix", "Design Everywhere"],
      ["smarter, newer, and more memorable.", "", "Brand Positioning", "NZero", "Sturdy"],
      ["", "Based in", "Brand & Identity Design", "NBC Sports", ""],
      ["We believe that function is the substance of", "Brooklyn, NY", "Creative Direction", "Equinox", "Blaze Type"],
      ["aesthetic experience. This principle guides clearer", "", "Design Direction", "Tovala", "Type design for Agencies"],
      ["user interfaces, stronger branding devices and", "For Job, Press and", "Packaging", "Arcadia", ""],
      ["more cohesive design systems. Whether designing", "General inquiries:", "Motion", "SiriusXM", "Prismic.io"],
      ["multi-platform experiences or building enterprise", "", "Prototyping", "TelevisaUnivision", "How Arcadia is Telling a"],
      ["applications, we make things to solve problems.", "hello@fix.studio", "Product Strategy", "LunarCrush", "Consistent Brand Story"],
      ["", "", "Testing & Research", "Union", ""],
      ["", "", "UX/UI Design", "Dona Chai", ""],
      ["", "", "Web Development", "Renew", ""],
      ["", "Instagram", "", "", ""],
      ["", "Linkedin", "", "", ""],
      ...Array.from({ length: Math.max(0, (LINE_COUNT - 1) - 14) }, () => ["", "", "", "", ""]),
    ],
    []
  );

  const rowCount = LINE_COUNT - 1;

  return (
    <div
      className={[
        "absolute inset-0 font-sans tracking-[-0.01em]",
        isDark ? "bg-[#0b0b0b] text-white/90" : "bg-white text-neutral-900",
      ].join(" ")}
    >
      {!showText ? null : (
        <>
          <div
            className={[
              "grid items-center px-5.5 text-[12px] uppercase select-none",
              "grid-cols-[1.25fr_1fr_1fr_1fr_1.25fr_.9fr_28px]",
              isDark ? "text-white/55" : "text-black/55",
            ].join(" ")}
            style={{ height: NAV_H }}
          >
            {navItems.map((item, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  if (!el || !navRefs) return;
                  navRefs.current[idx] = el;
                }}
                className={[
                  item.left ? "justify-self-start" : item.right ? "justify-self-end" : "justify-self-center",
                  "will-change-[filter,transform,opacity]",
                  item.left ? (isDark ? "text-white/90" : "text-neutral-900") : isDark ? "text-white/55" : "text-black/55",
                ].join(" ")}
              >
                {item.left || item.center || item.right}
              </div>
            ))}
          </div>

          <div>
            {rows.slice(0, rowCount).map((cells, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  if (!el || !rowRefs) return;
                  rowRefs.current[idx] = el;
                }}
                className={[
                  "grid items-center gap-4.5 px-5.5 text-[13px] leading-[1.2]",
                  "grid-cols-[2.1fr_1.05fr_1.05fr_1.05fr_1.25fr]",
                  "will-change-[filter,transform,opacity]",
                  idx < 9 ? (isDark ? "text-white/90" : "text-neutral-900") : isDark ? "text-white/55" : "text-black/55",
                ].join(" ")}
                style={{ height: ROW_H }}
              >
                <div className={isDark ? "text-white/90" : "text-neutral-900"}>{cells[0]}</div>
                <div className={isDark ? "text-white/90" : "text-neutral-900"}>{cells[1]}</div>
                <div>{cells[2]}</div>
                <div>{cells[3]}</div>
                <div className="justify-self-start">{cells[4]}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function LineRevealLoader({ onComplete } = {}) {
  const containerRef = useRef(null);
  const darkLineRefs = useRef([]);
  const lightLineRefs = useRef([]);
  const darkNavTextRefs = useRef([]);
  const darkRowTextRefs = useRef([]);
  const lightNavTextRefs = useRef([]);
  const lightRowTextRefs = useRef([]);
  const lightLayerRef = useRef(null);
  const darkContentRef = useRef(null);
  const tlRef = useRef(null);
  const layoutRef = useRef({
    height: 0,
    coneY: [],
    flatY: [],
    coneScale: [],
  });

  const [done, setDone] = useState(false);

  const recomputeLayout = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { height } = el.getBoundingClientRect();
    const h = Math.max(1, Math.round(height));

    const coneY = [];
    const flatY = [];
    const coneScale = [];

    const coneTop = 56;
    const coneBottomPad = 110;
    const flatTop = NAV_H;

    for (let i = 0; i < LINE_COUNT; i++) {
      const t = LINE_COUNT === 1 ? 0 : i / (LINE_COUNT - 1);

      const yCone = lerp(coneTop, h - coneBottomPad, Math.pow(t, 1.55));
      const wPctCone = lerp(0.66, 0.035, Math.pow(t, 1.12));

      const yFlat = flatTop + i * ROW_H;

      coneY.push(yCone);
      flatY.push(yFlat);
      coneScale.push(wPctCone);
    }

    layoutRef.current = { height: h, coneY, flatY, coneScale };
  }, []);

  const run = useCallback(() => {
    tlRef.current?.kill();
    setDone(false);

    recomputeLayout();

    const darkLineEls = darkLineRefs.current;
    const lightLineEls = lightLineRefs.current;
    const { flatY, coneScale } = layoutRef.current;
    const darkNavTextEls = darkNavTextRefs.current.filter(Boolean);
    const darkRowTextEls = darkRowTextRefs.current.filter(Boolean);
    const lightNavTextEls = lightNavTextRefs.current.filter(Boolean);
    const lightRowTextEls = lightRowTextRefs.current.filter(Boolean);
    const allTextEls = [
      ...darkNavTextEls,
      ...darkRowTextEls,
      ...lightNavTextEls,
      ...lightRowTextEls,
    ];

    gsap.set(darkLineEls, {
      opacity: 1,
      left: "50%",
      xPercent: -50,
      // Keep lines at their final (flat) positions for the entire sequence.
      y: (i) => flatY[i],
      scaleX: 0,
      transformOrigin: "50% 50%",
    });
    gsap.set(lightLineEls, {
      // Black lines are pre-drawn; the wipe (clip-path) reveals them.
      opacity: 1,
      left: "50%",
      xPercent: -50,
      y: (i) => flatY[i],
      scaleX: 1,
      transformOrigin: "50% 50%",
    });
    // Light layer reveals bottom -> top (to match the reference "translate up" wipe)
    // Start fully clipped from the top, then animate top inset to 0.
    gsap.set(lightLayerRef.current, { clipPath: "inset(100% 0 0 0)", opacity: 0 });
    gsap.set(darkContentRef.current, { opacity: 0 });
    gsap.set(allTextEls, { opacity: 0, y: 8, filter: "blur(14px)" });

    if (prefersReducedMotion()) {
      gsap.set(darkContentRef.current, { opacity: 1 });
      gsap.set(lightLayerRef.current, { opacity: 1, clipPath: "inset(0% 0 0 0)" });
      gsap.set(darkLineEls, { y: (i) => flatY[i], scaleX: 1 });
      gsap.set(lightLineEls, { opacity: 1, y: (i) => flatY[i], scaleX: 1 });
      gsap.set(allTextEls, { opacity: 1, y: 0, filter: "blur(0px)" });
      setDone(true);
      onComplete?.();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "linesLoadingEase" },
      onComplete: () => {
        setDone(true);
        onComplete?.();
      },
    });
    tlRef.current = tl;

    const staggerS = MORPH_STAGGER / 1000;
    const appearS = APPEAR_DUR / 1000;
    const morphS = MORPH_DUR / 1000;
    const totalS = appearS + morphS;
    const appearPct = totalS === 0 ? 1 : appearS / totalS;
    const scaleSetters = darkLineEls.map((el) =>
      el ? gsap.quickSetter(el, "scaleX") : null
    );

    // One continuous tween per line (prevents the "stop" between phase 1 and phase 2).
    for (let i = 0; i < LINE_COUNT; i++) {
      const startAt = i * staggerS;
      const setScaleX = scaleSetters[i];
      if (!setScaleX) continue;

      const driver = { p: 0 };
      tl.to(
        driver,
        {
          p: 1,
          duration: totalS,
          onUpdate: () => {
            const p = driver.p;
            const scaled =
              p <= appearPct
                ? coneScale[i] * (appearPct === 0 ? 1 : p / appearPct)
                : coneScale[i] +
                  (1 - coneScale[i]) * ((p - appearPct) / (1 - appearPct));
            setScaleX(scaled);
          },
        },
        startAt
      );
    }

    const lastStart = (LINE_COUNT - 1) * staggerS;
    const allLinesEnd = lastStart + totalS;
    const contentAt = CONTENT_FADE_AT;
    const wipeAt = Math.max(0, allLinesEnd + HOLD_AFTER_MORPH / 1000 - WIPE_OVERLAP);

    tl.to(
      darkContentRef.current,
      {
        opacity: 1,
        duration: CONTENT_FADE_DUR / 1000,
      },
      contentAt
    );

    tl.addLabel("wipe", wipeAt);
    tl.set(lightLayerRef.current, { opacity: 1 }, "wipe");
    tl.to(
      lightLayerRef.current,
      {
        clipPath: "inset(0% 0 0 0)",
        duration: WIPE_DUR / 1000,
      },
      "wipe"
    );
    tl.to(
      darkLineEls,
      {
        opacity: 0,
        duration: (WIPE_DUR / 1000) * 0.6,
      },
      "wipe"
    );

    const textAt = TEXT_REVEAL_AT;
    // Text reveals on black first (dark layer), while the wipe reveals the light layer (color swap in sync).
    tl.to(
      darkNavTextEls,
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, stagger: 0.03 },
      textAt
    );
    tl.to(
      lightNavTextEls,
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, stagger: 0.03 },
      "<"
    );
    tl.to(
      darkRowTextEls,
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.05 },
      textAt + 0.08
    );
    tl.to(
      lightRowTextEls,
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.05 },
      "<"
    );
    tl.to({}, { duration: HOLD_AFTER_MORPH / 1000 });
    tl.to({}, { duration: HOLD_END / 1000 });
  }, [onComplete, recomputeLayout]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => recomputeLayout());
    ro.observe(el);

    const id = setTimeout(run, 60);
    return () => {
      clearTimeout(id);
      ro.disconnect();
      tlRef.current?.kill();
    };
  }, [recomputeLayout, run]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <div ref={darkContentRef} className="absolute inset-0 opacity-0">
          <DemoContent theme="dark" navRefs={darkNavTextRefs} rowRefs={darkRowTextRefs} />
        </div>
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: LINE_COUNT }, (_, i) => (
            <div
              key={i}
              ref={(el) => (darkLineRefs.current[i] = el)}
              className="absolute left-1/2 top-0 h-px w-full origin-center bg-white will-change-transform"
            />
          ))}
        </div>
      </div>

      <div
        ref={lightLayerRef}
        className="absolute inset-0 opacity-0 [clip-path:inset(100%_0_0_0)] will-change-[clip-path]"
      >
        {/* Light layer holds the final UI; its text reveals after the line/wipe sequence */}
        <DemoContent theme="light" navRefs={lightNavTextRefs} rowRefs={lightRowTextRefs} />
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: LINE_COUNT }, (_, i) => (
            <div
              key={i}
              ref={(el) => (lightLineRefs.current[i] = el)}
              className="absolute left-1/2 top-0 h-px w-full origin-center bg-black will-change-transform"
            />
          ))}
        </div>
      </div>

      {done && (
        <button
          onClick={run}
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 cursor-pointer rounded-sm border border-black/25 bg-white/70 px-5.5 py-1.5 font-mono text-[11px] tracking-widest text-neutral-900"
        >
          replay
        </button>
      )}
    </div>
  );
}
