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
    let time = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const cols = 120;
    const rows = 80;

    const draw = () => {
      if (video.readyState >= 2) {
        // draw video frame
        ctx.drawImage(video, 0, 0, width, height);

        const frame = ctx.getImageData(0, 0, width, height);
        ctx.clearRect(0, 0, width, height);

        const cellW = width / cols;
        const cellH = height / rows;

        ctx.font = `${cellH * 0.9}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const px = Math.floor(x * cellW);
            const py = Math.floor(y * cellH);

            const index = (py * width + px) * 4;

            const r = frame.data[index];
            const g = frame.data[index + 1];
            const b = frame.data[index + 2];

            const gray = (r + g + b) / 3;

            // 🔥 wave distortion
            const wave = Math.sin(y * 0.3 + time * 2) * 5;

            // 🔥 binary mapping
            let char = gray > 128 ? "1" : "0";

            // 🔥 subtle flicker (optional realism)
            if (Math.random() > 0.995) {
              char = Math.random() > 0.5 ? "1" : "0";
            }

            // opacity based on brightness
            const alpha = gray / 255;

            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fillText(char, px + wave, py);
          }
        }
      }

      time += 0.016;
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full bg-black z-[-1]"
    />
  );
}