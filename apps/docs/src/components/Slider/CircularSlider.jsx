"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Lenis from "lenis";

export default function WebGLInfiniteSlider() {
  const containerRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer;
    let planes = [];
    let rafId;

    const container = containerRef.current;

    // ---------------------------
    // LENIS (INFINITE SCROLL)
    // ---------------------------
    const lenis = new Lenis({
      infinite: true,
      lerp: 0.1,
    });

    // ---------------------------
    // THREE SETUP
    // ---------------------------
    scene = new THREE.Scene();

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // ---------------------------
    // IMAGE SETUP
    // ---------------------------
    const loader = new THREE.TextureLoader();

    const images = Array.from({ length: 21 }, (_, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `/assets/ghost/ghost${num}.webp`;
    });

    // FULLSCREEN CALC
    const frustumHeight =
      2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const frustumWidth = frustumHeight * camera.aspect;

    const planeWidth = frustumWidth / 2;
    const planeHeight = frustumHeight;

    const spacing = planeWidth;

    // Speed factor: converts scroll pixels → Three.js world units
    const speedFactor = 0.01;

    images.forEach((src, i) => {
      const texture = loader.load(src);
      texture.minFilter = THREE.LinearFilter;

      const geometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight,
        32,
        32
      );

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uZoom: { value: 1.2 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uZoom;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            uv = (uv - 0.5) / uZoom + 0.5;
            gl_FragColor = texture2D(uTexture, uv);
          }
        `,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = i * spacing;

      scene.add(mesh);
      planes.push(mesh);
    });

    const totalWidth = spacing * images.length;

    // ---------------------------
    // COMBINED RAF + RENDER LOOP
    // ---------------------------
    function raf(time) {
      lenis.raf(time);

      // animatedScroll grows unboundedly with infinite mode
      const scrollOffset = lenis.animatedScroll * speedFactor;

      planes.forEach((plane, i) => {
        // Base position minus scroll offset
        let x = i * spacing - scrollOffset;

        // Wrap into [-totalWidth/2, totalWidth/2] for seamless infinite loop
        x = ((x % totalWidth) + totalWidth) % totalWidth;
        if (x > totalWidth / 2) x -= totalWidth;

        plane.position.x = x;

        // SMOOTH TEXTURE ZOOM — lerp toward target each frame
        const dist = Math.abs(x);
        const targetZoom = 1 + Math.min(dist * 0.6, 1.8);
        const currentZoom = plane.material.uniforms.uZoom.value;
        plane.material.uniforms.uZoom.value += (targetZoom - currentZoom) * 0.08;
      });

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-full h-[300vh] bg-black">
      <div ref={containerRef} className="sticky top-0 h-screen w-full" />
    </div>
  );
}