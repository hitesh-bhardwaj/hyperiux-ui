"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { PropsPanel } from "@/components/ui/PropsPanel";

// Import all effects
import BlurText from "@/components/effects/BlueText";
import { TextReveal } from "@/components/effects/text-reveal";

// Effects that need special handling
const SCROLL_EFFECTS = ["text-reveal", "smooth-scroll"];

// Demo components for each effect
function BlurTextDemo({ props, replayKey }) {
  return (
    <BlurText
      key={replayKey}
      blur={props.blur}
      duration={props.duration}
      delay={props.delay}
      className="text-6xl md:text-8xl font-bold text-white text-center"
    >
      Beautiful Blur Effect
    </BlurText>
  );
}

function TextRevealDemo({ props, replayKey, scrollerRef }) {
  return (
    <TextReveal
      key={replayKey}
      duration={props.duration}
      stagger={props.stagger}
      y={props.y}
      className="text-4xl md:text-6xl font-bold text-white text-center max-w-4xl"
      trigger="top 80%"
      once={false}
      scroller={scrollerRef?.current}
    >
      Scroll to reveal this amazing text animation effect
    </TextReveal>
  );
}

function SmoothScrollDemo() {
  return (
    <div className="text-center">
      <div className="w-16 h-24 mx-auto rounded-full border-2 border-white/30 flex items-start justify-center p-4 mb-6">
        <div className="w-2 h-5 bg-white/50 rounded-full animate-bounce" />
      </div>
      <p className="text-xl text-white/70">
        Smooth Scroll is a page wrapper component
      </p>
      <p className="text-white/40 mt-2">
        Wrap your page content for momentum-based scrolling
      </p>
    </div>
  );
}

const demoComponents = {
  "blur-text": BlurTextDemo,
  "text-reveal": TextRevealDemo,
  "smooth-scroll": SmoothScrollDemo,
};

export function FullscreenPreview({ slug, effect, config }) {
  const [propValues, setPropValues] = useState(config?.defaults || {});
  const [replayKey, setReplayKey] = useState(0);
  const [showProps, setShowProps] = useState(true);
  const scrollerRef = useRef(null);

  const handlePropChange = useCallback((name, value) => {
    setPropValues((prev) => ({ ...prev, [name]: value }));
    setReplayKey((k) => k + 1);
  }, []);

  const handleReplay = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  const DemoComponent = demoComponents[slug];
  const isScrollEffect = SCROLL_EFFECTS.includes(slug);
  const isFullscreen = false;

  return (
    <div className="fixed inset-0 bg-neutral-950 flex">
      {/* Main preview area */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/50 to-transparent">
          <Link
            href={`/effects/${slug}`}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Details
          </Link>

          <div className="flex items-center gap-3">
            {/* Replay button */}
            <button
              onClick={handleReplay}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Replay
            </button>

            {/* Toggle props panel */}
            {config?.props?.length > 0 && (
              <button
                onClick={() => setShowProps(!showProps)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors backdrop-blur-sm ${
                  showProps
                    ? "bg-white text-black"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Props
              </button>
            )}
          </div>
        </div>

        {/* Effect title */}
        <div className="absolute bottom-6 left-6 z-20">
          <h1 className="text-2xl font-bold text-white">{effect.title}</h1>
          <p className="text-white/60 mt-1">{effect.description}</p>
        </div>

        {/* Preview content */}
        {isScrollEffect ? (
          <div
            ref={scrollerRef}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="min-h-[150vh] flex flex-col">
              <div className="flex-1 flex items-end justify-center pb-32">
                <span className="text-white/30 text-lg">↓ Scroll down ↓</span>
              </div>
              <div className="flex items-center justify-center py-32 px-8">
                {DemoComponent && (
                  <DemoComponent
                    props={propValues}
                    replayKey={replayKey}
                    scrollerRef={scrollerRef}
                  />
                )}
              </div>
              <div className="flex-1 flex items-start justify-center pt-32">
                <span className="text-white/30 text-lg">↑ Scroll up to replay ↑</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${isFullscreen ? "" : "p-8"}`}>
            {DemoComponent && (
              <DemoComponent props={propValues} replayKey={replayKey} />
            )}
          </div>
        )}
      </div>

      {/* Props panel */}
      {showProps && config?.props?.length > 0 && (
        <div className="w-80 bg-neutral-900 border-l border-neutral-800 p-6 overflow-y-auto">
          <h3 className="text-lg font-medium text-white mb-6">Properties</h3>
          <div className="space-y-6">
            {config.props.map((prop) => (
              <PropControlDark
                key={prop.name}
                prop={prop}
                value={propValues[prop.name]}
                onChange={(value) => handlePropChange(prop.name, value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PropControlDark({ prop, value, onChange }) {
  const { name, type, min, max, step, options, description } = prop;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">{name}</label>
        {type === "range" && (
          <span className="text-xs text-neutral-400">{value}</span>
        )}
      </div>

      {type === "range" && (
        <input
          type="range"
          min={min}
          max={max}
          step={step || 1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white"
        />
      )}

      {type === "number" && (
        <input
          type="number"
          min={min}
          max={max}
          step={step || 1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
        />
      )}

      {type === "color" && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded border border-neutral-700 cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500"
          />
        </div>
      )}

      {description && (
        <p className="text-xs text-neutral-500">{description}</p>
      )}
    </div>
  );
}
