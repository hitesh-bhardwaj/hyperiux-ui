"use client";

import { useState } from "react";
import { RgbShiftFluid } from "@/components/effects/rgb-shift-fluid";
import Link from "next/link";

export default function RgbShiftFluidDemo() {
  const [intensity, setIntensity] = useState(1.0);
  const [smoothing, setSmoothing] = useState(0.1);
  const [rgbShiftAmount, setRgbShiftAmount] = useState(0.008);
  const [distortionStrength, setDistortionStrength] = useState(1.0);
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* RGB Shift Fluid Effect with Image */}
      <RgbShiftFluid
        intensity={intensity}
        smoothing={smoothing}
        rgbShiftAmount={rgbShiftAmount}
        distortionStrength={distortionStrength}
        backgroundImage="/assets/parallax-img/p-img-1.jpg"
        className="w-full h-full"
      />

      {/* Minimal instruction overlay */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center pointer-events-none z-10">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full text-white/70 text-sm">
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span>Move cursor to distort</span>
        </div>
      </div>

      {/* Back button */}
      <Link
        href="/effects/rgb-shift-fluid"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      {/* Toggle controls button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        {showControls ? "Hide" : "Show"} Controls
      </button>

      {/* Controls panel */}
      {showControls && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-[90%] max-w-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Intensity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/70">Radius</label>
                <span className="text-xs text-white/50">{intensity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* Smoothing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/70">Smoothing</label>
                <span className="text-xs text-white/50">{smoothing.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.25"
                step="0.01"
                value={smoothing}
                onChange={(e) => setSmoothing(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* RGB Shift */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/70">RGB Shift</label>
                <span className="text-xs text-white/50">{rgbShiftAmount.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.02"
                step="0.002"
                value={rgbShiftAmount}
                onChange={(e) => setRgbShiftAmount(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* Distortion */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/70">Strength</label>
                <span className="text-xs text-white/50">{distortionStrength.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={distortionStrength}
                onChange={(e) => setDistortionStrength(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
