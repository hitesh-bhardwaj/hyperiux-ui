'use client'

import { useEffect, useRef } from "react";

export default function BinaryEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const video = document.createElement("video");
    video.src = "/assets/videos/eye-loop.mp4";
    video.loop = true;
    video.muted = true;
    video.play();

    let width, height;
    let animationFrameId = 0;

    const FLUID_COLS = 80;
    const FLUID_ROWS = 60;
    const FN = FLUID_COLS * FLUID_ROWS;

    let vx  = new Float32Array(FN);
    let vy  = new Float32Array(FN);
    let vx0 = new Float32Array(FN);
    let vy0 = new Float32Array(FN);

    const fi = (x, y) => {
      x = Math.max(0, Math.min(FLUID_COLS - 1, x));
      y = Math.max(0, Math.min(FLUID_ROWS - 1, y));
      return y * FLUID_COLS + x;
    };

    const setBnd = (b, arr) => {
      for (let x = 1; x < FLUID_COLS - 1; x++) {
        arr[fi(x, 0)]            = b === 2 ? -arr[fi(x, 1)]            : arr[fi(x, 1)];
        arr[fi(x, FLUID_ROWS-1)] = b === 2 ? -arr[fi(x, FLUID_ROWS-2)] : arr[fi(x, FLUID_ROWS-2)];
      }
      for (let y = 1; y < FLUID_ROWS - 1; y++) {
        arr[fi(0, y)]             = b === 1 ? -arr[fi(1, y)]            : arr[fi(1, y)];
        arr[fi(FLUID_COLS-1, y)]  = b === 1 ? -arr[fi(FLUID_COLS-2, y)] : arr[fi(FLUID_COLS-2, y)];
      }
    };

    const diffuse = (b, arr, arr0, diff, dt) => {
      const a = dt * diff * FN;
      for (let k = 0; k < 4; k++) {
        for (let y = 1; y < FLUID_ROWS - 1; y++) {
          for (let x = 1; x < FLUID_COLS - 1; x++) {
            arr[fi(x,y)] = (arr0[fi(x,y)] + a*(
              arr[fi(x-1,y)] + arr[fi(x+1,y)] +
              arr[fi(x,y-1)] + arr[fi(x,y+1)]
            )) / (1 + 4*a);
          }
        }
        setBnd(b, arr);
      }
    };

    const advect = (b, d, d0, ux, uy, dt) => {
      const dtx = dt * FLUID_COLS * 1.4; // 🔥 stronger flow
      const dty = dt * FLUID_ROWS * 1.4;

      for (let y = 1; y < FLUID_ROWS - 1; y++) {
        for (let x = 1; x < FLUID_COLS - 1; x++) {
          let px = x - dtx * ux[fi(x,y)];
          let py = y - dty * uy[fi(x,y)];

          px = Math.max(0.5, Math.min(FLUID_COLS - 1.5, px));
          py = Math.max(0.5, Math.min(FLUID_ROWS - 1.5, py));

          const x0 = Math.floor(px), x1 = x0+1;
          const y0 = Math.floor(py), y1 = y0+1;

          const s1 = px-x0, s0 = 1-s1;
          const t1 = py-y0, t0 = 1-t1;

          d[fi(x,y)] = s0*(t0*d0[fi(x0,y0)] + t1*d0[fi(x0,y1)])
                     + s1*(t0*d0[fi(x1,y0)] + t1*d0[fi(x1,y1)]);
        }
      }
      setBnd(b, d);
    };

    const project = (ux, uy, p, div) => {
      const hx = 1/FLUID_COLS, hy = 1/FLUID_ROWS;

      for (let y = 1; y < FLUID_ROWS-1; y++) {
        for (let x = 1; x < FLUID_COLS-1; x++) {
          div[fi(x,y)] = -0.5*(hx*(ux[fi(x+1,y)]-ux[fi(x-1,y)]) + hy*(uy[fi(x,y+1)]-uy[fi(x,y-1)]));
          p[fi(x,y)] = 0;
        }
      }

      setBnd(0, div); setBnd(0, p);

      for (let k = 0; k < 4; k++) {
        for (let y = 1; y < FLUID_ROWS-1; y++) {
          for (let x = 1; x < FLUID_COLS-1; x++) {
            p[fi(x,y)] = (div[fi(x,y)] + p[fi(x-1,y)]+p[fi(x+1,y)]+p[fi(x,y-1)]+p[fi(x,y+1)])/4;
          }
        }
        setBnd(0, p);
      }

      for (let y = 1; y < FLUID_ROWS-1; y++) {
        for (let x = 1; x < FLUID_COLS-1; x++) {
          ux[fi(x,y)] -= 0.5*(p[fi(x+1,y)]-p[fi(x-1,y)])/hx;
          uy[fi(x,y)] -= 0.5*(p[fi(x,y+1)]-p[fi(x,y-1)])/hy;
        }
      }

      setBnd(1, ux); setBnd(2, uy);
    };

    const pBuf  = new Float32Array(FN);
    const divBuf = new Float32Array(FN);

    const stepFluid = (dt) => {
      diffuse(1, vx0, vx, 0.00002, dt);
      diffuse(2, vy0, vy, 0.00002, dt);
      project(vx0, vy0, pBuf, divBuf);

      advect(1, vx, vx0, vx0, vy0, dt);
      advect(2, vy, vy0, vx0, vy0, dt);

      project(vx, vy, pBuf, divBuf);

      for (let i = 0; i < FN; i++) {
        vx[i] *= 0.94;
        vy[i] *= 0.94;
      }
    };

    // ─── Characters ───────────────────────────────────────────────────────
    const CHAR_COLS = 120;
    const CHAR_ROWS = 80;

    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
    const trail = [];

    const TRAIL_LIFETIME = 320;
    const TRAIL_SPACING = 10;
    const TRAIL_MAX_POINTS = 72;
    const nowMs = () => performance.now();

    const pushTrailPoint = (x, y, vx, vy, bornAt) => {
      trail.unshift({ x, y, vx, vy, bornAt });
      if (trail.length > TRAIL_MAX_POINTS) {
        trail.length = TRAIL_MAX_POINTS;
      }
    };

    const onMouseMove = (e) => {
      const prevX = mouse.x;
      const prevY = mouse.y;
      mouse.vx = e.clientX - prevX;
      mouse.vy = e.clientY - prevY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (prevX < 0 || prevY < 0) {
        pushTrailPoint(mouse.x, mouse.y, 0, 0, nowMs());
        return;
      }

      const distance = Math.hypot(mouse.vx, mouse.vy);
      if (distance < 0.5) return;

      const steps = Math.max(1, Math.ceil(distance / TRAIL_SPACING));
      const bornAt = nowMs();

      for (let step = 1; step <= steps; step++) {
        const t = step / steps;
        pushTrailPoint(
          prevX + mouse.vx * t,
          prevY + mouse.vy * t,
          mouse.vx / steps,
          mouse.vy / steps,
          bornAt
        );
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    const bayer = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v => v/16*255);

    const resize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const injectTrail = (timestamp) => {
      for (let index = trail.length - 1; index >= 0; index--) {
        const point = trail[index];
        const age = timestamp - point.bornAt;

        if (age >= TRAIL_LIFETIME) {
          trail.splice(index, 1);
          continue;
        }

        const life = 1 - age / TRAIL_LIFETIME;
        const radius = 0.8 + life * 1.2;
        const gridRadius = Math.ceil(radius);
        const speed = Math.hypot(point.vx, point.vy);
        const force = (0.08 + Math.min(speed, 18) / 18) * life;
        const fcx = (point.x / width) * FLUID_COLS | 0;
        const fcy = (point.y / height) * FLUID_ROWS | 0;

        for (let dy = -gridRadius; dy <= gridRadius; dy++) {
          for (let dx = -gridRadius; dx <= gridRadius; dx++) {
            const gx = fcx + dx;
            const gy = fcy + dy;
            const distance = Math.hypot(dx, dy);

            if (distance > radius) continue;

            const falloff = (1 - distance / radius) ** 2;
            vx[fi(gx, gy)] += point.vx * falloff * force * 0.45;
            vy[fi(gx, gy)] += point.vy * falloff * force * 0.45;
          }
        }
      }
    };

    const getTrailDispersion = (x, y, timestamp) => {
      let offsetX = 0;
      let offsetY = 0;

      for (let index = 0; index < trail.length; index++) {
        const point = trail[index];
        const age = timestamp - point.bornAt;

        if (age >= TRAIL_LIFETIME) continue;

        const life = 1 - age / TRAIL_LIFETIME;
        const dx = x - point.x;
        const dy = y - point.y;
        const distance = Math.hypot(dx, dy);
        const radius = 16 + life * 18;

        if (distance === 0 || distance > radius) continue;

        const falloff = (1 - distance / radius) ** 2;
        const scatter = falloff * life * 7;
        offsetX += (dx / distance) * scatter + point.vx * falloff * 0.04;
        offsetY += (dy / distance) * scatter + point.vy * falloff * 0.04;
      }

      return { x: offsetX, y: offsetY };
    };

    const draw = () => {
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, width, height);
        const frame = ctx.getImageData(0, 0, width, height);
        ctx.clearRect(0, 0, width, height);

        const cellW = width / CHAR_COLS;
        const cellH = height / CHAR_ROWS;
        const timestamp = nowMs();

        injectTrail(timestamp);

        stepFluid(0.016);

        ctx.font = `${cellH * 0.9}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let gy = 0; gy < CHAR_ROWS; gy++) {
          for (let gx = 0; gx < CHAR_COLS; gx++) {

            const baseX = (gx+0.5)*cellW;
            const baseY = (gy+0.5)*cellH;

            const fluidIndex = fi((gx/CHAR_COLS*FLUID_COLS)|0, (gy/CHAR_ROWS*FLUID_ROWS)|0);
            const flowX = vx[fluidIndex];
            const flowY = vy[fluidIndex];
            const dispersion = getTrailDispersion(baseX, baseY, timestamp);

            // 🔥 sample slightly offset → pixel mixing feel
            const sampleX = baseX + dispersion.x + flowX * 6;
            const sampleY = baseY + dispersion.y + flowY * 6;

            const spx = Math.max(0, Math.min(width-1, sampleX|0));
            const spy = Math.max(0, Math.min(height-1, sampleY|0));

            const idx = (spy * width + spx) * 4;

            const baseGray = (frame.data[idx] + frame.data[idx+1] + frame.data[idx+2]) / 3;
            const hoverMix = Math.min(1, Math.hypot(flowX, flowY) * 1.1);
            const gray = baseGray * (1 - hoverMix);

            const threshold = bayer[(gy&3)*4 + (gx&3)];
            const char = gray > threshold ? "I" : "S";

            const alpha = Math.min(1, gray / 255);

            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fillText(char, baseX, baseY);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
      video.pause();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-black z-[-1]"
    />
  );
}
