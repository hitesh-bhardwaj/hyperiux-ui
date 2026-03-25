"use client";

import { useState } from "react";
import { LiquidCursor } from "@/components/effects/liquid-cursor";

export default function LiquidCursorDemo() {
  const [amount, setAmount] = useState(1);
  const [rgbShift, setRgbShift] = useState(0.5);
  const [multiplier, setMultiplier] = useState(1);
  const [colorMultiplier, setColorMultiplier] = useState(1);
  const [maxRadius, setMaxRadius] = useState(100);
  const [pushStrength, setPushStrength] = useState(22);
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Liquid Cursor Effect */}
      <LiquidCursor
        amount={amount}
        rgbShift={rgbShift}
        multiplier={multiplier}
        colorMultiplier={colorMultiplier}
        maxRadius={maxRadius}
        pushStrength={pushStrength}
      />

      {/* <div className="w-full h-screen">
        <Image width={1920} height={1080} src="/assets/img/image03.webp" alt="Placeholder" />
      </div> */}

      {/* Toggle controls */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="fixed top-6 right-6 z-60 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        {showControls ? "Hide" : "Show"} Controls
      </button>

      {/* Controls panel */}
      {showControls && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-[90%] max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/70">Amount</label>
                <span className="text-xs text-white/50">{amount.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* RGB Shift */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/70">RGB Shift</label>
                <span className="text-xs text-white/50">{rgbShift.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={rgbShift}
                onChange={(e) => setRgbShift(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* Multiplier */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/70">Multiplier</label>
                <span className="text-xs text-white/50">{multiplier.toFixed(0)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* Color Multiplier */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/70">Color</label>
                <span className="text-xs text-white/50">{colorMultiplier.toFixed(0)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={colorMultiplier}
                onChange={(e) => setColorMultiplier(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* Max Radius */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/70">Radius</label>
                <span className="text-xs text-white/50">{maxRadius.toFixed(0)}</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="10"
                value={maxRadius}
                onChange={(e) => setMaxRadius(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            {/* Push Strength */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/70">Push</label>
                <span className="text-xs text-white/50">{pushStrength.toFixed(0)}</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={pushStrength}
                onChange={(e) => setPushStrength(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Instruction */}
      <div className="fixed bottom-32 left-0 right-0 flex justify-center pointer-events-none z-40">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full text-white/70 text-sm">
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span>Move cursor to paint with light</span>
        </div>
      </div>
    </div>
  );
}
