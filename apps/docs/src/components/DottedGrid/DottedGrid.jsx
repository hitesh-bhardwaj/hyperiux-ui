"use client";

import { useEffect, useRef } from "react";

export default function DottedGrid() {
  const canvasRef = useRef(null);

  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let animationId;
    let dots = [];

    const spacing = 24;
    const baseRadius = 4.8;
    const mouseRadius = 230;

    const randomTime = 1.1;
    const collectTime = 2.0;
    const shapeHoldTime = 2.3;
    const grayDisperseTime = 1.6;

    const totalCycleTime =
      randomTime + collectTime + shapeHoldTime + grayDisperseTime;

    const totalShapes = 9;

    const lerp = (start, end, amount) => start + (end - start) * amount;

    const clamp01 = (value) => Math.max(0, Math.min(1, value));

    const smoothstep = (edge0, edge1, value) => {
      const t = clamp01((value - edge0) / (edge1 - edge0));
      return t * t * (3 - 2 * t);
    };

    const createDots = () => {
      dots = [];

      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          dots.push({
            x,
            y,
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 2.2,
            randomOffset: Math.random() * 10,

            currentShapeStrength: 0,
            currentRandomStrength: 1,
            currentMouseStrength: 0,
            currentGrayDisperseStrength: 0,
          });
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createDots();
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();

      mouseRef.current.targetX = event.clientX - rect.left;
      mouseRef.current.targetY = event.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const getStarStrength = (x, y, time) => {
      const cx = width / 2;
      const cy = height / 2;

      const dx = x - cx;
      const dy = y - cy;

      const scale = Math.min(width, height) * 0.28;

      const nx = dx / scale;
      const ny = dy / scale;

      const r = Math.sqrt(nx * nx + ny * ny);
      const angle = Math.atan2(ny, nx);

      const rotation = time * 0.18;
      const starRadius = 0.58 + 0.28 * Math.cos(5 * (angle - rotation));

      return clamp01(1 - smoothstep(starRadius - 0.09, starRadius + 0.09, r));
    };

    const getSquareStrength = (x, y, time) => {
      const cx = width / 2;
      const cy = height / 2;

      const dx = x - cx;
      const dy = y - cy;

      const scale = Math.min(width, height) * 0.26;

      const rotation = Math.sin(time * 0.4) * 0.18;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      const rx = (dx * cos - dy * sin) / scale;
      const ry = (dx * sin + dy * cos) / scale;

      const box = Math.max(Math.abs(rx), Math.abs(ry));

      return clamp01(1 - smoothstep(0.82, 0.9, box));
    };

    const getCircleRingStrength = (x, y) => {
      const cx = width / 2;
      const cy = height / 2;

      const dx = x - cx;
      const dy = y - cy;

      const scale = Math.min(width, height) * 0.28;

      const nx = dx / scale;
      const ny = dy / scale;

      const r = Math.sqrt(nx * nx + ny * ny);
      const distanceFromRing = Math.abs(r - 0.72);

      return clamp01(1 - smoothstep(0.11, 0.19, distanceFromRing));
    };

    const getDiamondStrength = (x, y, time) => {
      const cx = width / 2;
      const cy = height / 2;

      const dx = x - cx;
      const dy = y - cy;

      const scale = Math.min(width, height) * 0.3;

      const rotation = Math.PI / 4 + Math.sin(time * 0.25) * 0.14;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      const rx = (dx * cos - dy * sin) / scale;
      const ry = (dx * sin + dy * cos) / scale;

      const diamond = Math.abs(rx) + Math.abs(ry);

      return clamp01(1 - smoothstep(0.9, 1.02, diamond));
    };

    const getHeartStrength = (x, y) => {
      const cx = width / 2;
      const cy = height / 2;

      const scale = Math.min(width, height) * 0.025;

      const nx = (x - cx) / scale;
      const ny = -(y - cy) / scale + 3;

      const value =
        Math.pow(nx * nx + ny * ny - 1, 3) -
        nx * nx * Math.pow(ny, 3);

      return clamp01(1 - smoothstep(-1.5, 1.5, value));
    };

    const getTriangleStrength = (x, y, time) => {
      const cx = width / 2;
      const cy = height / 2;

      const dx = x - cx;
      const dy = y - cy;

      const scale = Math.min(width, height) * 0.32;

      const rotation = Math.sin(time * 0.3) * 0.12;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      const rx = (dx * cos - dy * sin) / scale;
      const ry = (dx * sin + dy * cos) / scale;

      const a = Math.abs(rx) * 0.9 + ry * 0.52;
      const b = -ry * 0.95;

      const triangle = Math.max(a, b);

      return clamp01(1 - smoothstep(0.38, 0.48, triangle));
    };

    const getHexagonStrength = (x, y, time) => {
      const cx = width / 2;
      const cy = height / 2;

      const dx = x - cx;
      const dy = y - cy;

      const scale = Math.min(width, height) * 0.29;

      const rotation = time * 0.12;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      const rx = Math.abs((dx * cos - dy * sin) / scale);
      const ry = Math.abs((dx * sin + dy * cos) / scale);

      const hex = Math.max(rx * 0.866 + ry * 0.5, ry);

      return clamp01(1 - smoothstep(0.74, 0.84, hex));
    };

    const getPlusStrength = (x, y, time) => {
      const cx = width / 2;
      const cy = height / 2;

      const dx = x - cx;
      const dy = y - cy;

      const scale = Math.min(width, height) * 0.27;

      const rotation = Math.sin(time * 0.35) * 0.2;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      const rx = Math.abs((dx * cos - dy * sin) / scale);
      const ry = Math.abs((dx * sin + dy * cos) / scale);

      const barThickness = 0.24;
      const barLength = 0.86;

      const verticalBar = rx < barThickness && ry < barLength;
      const horizontalBar = ry < barThickness && rx < barLength;

      const edgeDistance = Math.min(
        Math.max(rx - barThickness, ry - barLength),
        Math.max(ry - barThickness, rx - barLength)
      );

      if (verticalBar || horizontalBar) return 1;

      return clamp01(1 - smoothstep(0, 0.08, edgeDistance));
    };

    const getInfinityStrength = (x, y, time) => {
      const cx = width / 2;
      const cy = height / 2;

      const dx = x - cx;
      const dy = y - cy;

      const scale = Math.min(width, height) * 0.18;

      const nx = dx / scale;
      const ny = dy / scale;

      const wobble = Math.sin(time * 0.6) * 0.08;

      const leftDistance = Math.sqrt(
        Math.pow(nx + 1.15 + wobble, 2) + Math.pow(ny, 2)
      );

      const rightDistance = Math.sqrt(
        Math.pow(nx - 1.15 - wobble, 2) + Math.pow(ny, 2)
      );

      const ringRadius = 0.9;
      const thickness = 0.18;

      const leftRing = Math.abs(leftDistance - ringRadius);
      const rightRing = Math.abs(rightDistance - ringRadius);

      const infinity = Math.min(leftRing, rightRing);

      return clamp01(1 - smoothstep(thickness, thickness + 0.08, infinity));
    };

    const getRawShapeStrength = (shapeIndex, x, y, time) => {
      const index = shapeIndex % totalShapes;

      if (index === 0) return getStarStrength(x, y, time);
      if (index === 1) return getSquareStrength(x, y, time);
      if (index === 2) return getCircleRingStrength(x, y, time);
      if (index === 3) return getDiamondStrength(x, y, time);
      if (index === 4) return getHeartStrength(x, y, time);
      if (index === 5) return getTriangleStrength(x, y, time);
      if (index === 6) return getHexagonStrength(x, y, time);
      if (index === 7) return getPlusStrength(x, y, time);

      return getInfinityStrength(x, y, time);
    };

    const getShapeData = (x, y, time) => {
      const cyclePosition = time % totalCycleTime;
      const cycleIndex = Math.floor(time / totalCycleTime);
      const shapeIndex = cycleIndex % totalShapes;

      const shapeStrength = getRawShapeStrength(shapeIndex, x, y, time);

      if (cyclePosition < randomTime) {
        return {
          shapeStrength: 0,
          randomStrength: 1,
          grayDisperseStrength: 0.35,
        };
      }

      if (cyclePosition < randomTime + collectTime) {
        const progress = (cyclePosition - randomTime) / collectTime;
        const eased = smoothstep(0, 1, progress);

        return {
          shapeStrength: shapeStrength * eased,
          randomStrength: 1 - eased,
          grayDisperseStrength: 0.35 * (1 - eased),
        };
      }

      if (cyclePosition < randomTime + collectTime + shapeHoldTime) {
        return {
          shapeStrength,
          randomStrength: 0,
          grayDisperseStrength: 0,
        };
      }

      const progress =
        (cyclePosition - randomTime - collectTime - shapeHoldTime) /
        grayDisperseTime;

      const eased = smoothstep(0, 1, progress);

      return {
        shapeStrength: shapeStrength * (1 - eased),
        randomStrength: eased,
        grayDisperseStrength: eased,
      };
    };

    const drawDot = (x, y, radius, brightness, grayDisperseStrength) => {
      const alpha = 0.28 + brightness * 0.72;

      /*
        Only grayscale:
        saturation is always 0%.
        lightness controls black, gray, and white.
      */
      const normalLightness = 16 + brightness * 78;
      const disperseLightness =
        12 + brightness * 58 + grayDisperseStrength * 22;

      const lightness = lerp(
        normalLightness,
        disperseLightness,
        grayDisperseStrength
      );

      ctx.beginPath();
      ctx.fillStyle = `hsla(0, 0%, ${lightness}%, ${alpha})`;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (ms) => {
      const time = ms * 0.001;
      const mouse = mouseRef.current;

      mouse.x = lerp(mouse.x, mouse.targetX, 0.065);
      mouse.y = lerp(mouse.y, mouse.targetY, 0.065);

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      for (const dot of dots) {
        const { shapeStrength, randomStrength, grayDisperseStrength } =
          getShapeData(dot.x, dot.y, time);

        dot.currentShapeStrength = lerp(
          dot.currentShapeStrength,
          shapeStrength,
          0.06
        );

        dot.currentRandomStrength = lerp(
          dot.currentRandomStrength,
          randomStrength,
          0.075
        );

        dot.currentGrayDisperseStrength = lerp(
          dot.currentGrayDisperseStrength,
          grayDisperseStrength,
          0.08
        );

        let targetMouseStrength = 0;

        if (mouse.active) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            const normalizedDistance = distance / mouseRadius;
            targetMouseStrength = 1 - smoothstep(0, 1, normalizedDistance);
          }
        }

        dot.currentMouseStrength = lerp(
          dot.currentMouseStrength,
          targetMouseStrength,
          0.09
        );

        const randomBlink =
          Math.sin(
            time * (1.8 + dot.speed * 1.6) +
              dot.phase +
              dot.randomOffset +
              dot.x * 0.017 +
              dot.y * 0.013
          ) ** 2;

        const softPulse =
          Math.sin(time * 1.8 + dot.phase + dot.x * 0.01) ** 2;

        const stableBrightness = clamp01(
          0.16 + dot.currentShapeStrength * 0.84 + softPulse * 0.04
        );

        const randomBrightness = clamp01(0.16 + randomBlink * 0.34);

        const brightness = lerp(
          stableBrightness,
          randomBrightness,
          dot.currentRandomStrength
        );

        const grayDisperseBlink = clamp01(
          dot.currentGrayDisperseStrength * (0.45 + randomBlink * 0.55)
        );

        const mouseShrink = 1 - dot.currentMouseStrength * 0.55;

        const stableRadius = baseRadius + dot.currentShapeStrength * 1.25;
        const randomRadius = baseRadius + randomBlink * 0.35;

        const radius =
          lerp(stableRadius, randomRadius, dot.currentRandomStrength) *
          mouseShrink;

        drawDot(
          dot.x,
          dot.y,
          radius,
          brightness,
          grayDisperseBlink
        );
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="block h-full w-full cursor-pointer touch-none bg-black"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/40" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.95)]" />
    </section>
  );
}