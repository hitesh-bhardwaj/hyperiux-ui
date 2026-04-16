"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLenis } from "lenis/react";

// ─── vertex shader ───
const vertexShader = /* glsl */ `
  uniform float uFold;
  varying vec2 vUv;
  varying float vShade;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float strength = abs(uFold);
    float dir = sign(uFold);

    // When entering from bottom (dir < 0, uFold negative): fold the top edge (uv.y = 1)
    // When exiting to top (dir > 0, uFold positive): fold the bottom edge (uv.y = 0)
    float edgeUV = dir < 0.0 ? uv.y : (1.0 - uv.y);

    // Limit the fold to cover a bit more than half of the plane (e.g. 1.8 units out of 3.0)
    float foldLength = 1.8;
    float distFromEdge = (1.0 - edgeUV) * 3.0; 
    float localUV = clamp((foldLength - distFromEdge) / foldLength, 0.0, 1.0);

    // Square localUV so twist and shading strictly obey the confined halved fold
    float edgeCurve = localUV * localUV;

    // Perfect localized soft-flap: purely realistic with localized curvature starting right at the hinge
    float A = max(strength * 3.14159, 0.001); // Fold up to 180 degrees
    float t = localUV * foldLength; // Physical distance from the hinge
    
    // Further smoothen the geometric curve by massively expanding the bend radius to prevent steepness
    float L_bend = 2.0; // Length of the curved crease
    float R = L_bend / A; // dynamic arc radius
    
    // Separate into a bending portion and a flapped straight portion
    float t_bend = min(t, L_bend);
    float theta = (t_bend / L_bend) * A;
    float t_straight = max(t - L_bend, 0.0);

    // Z lift: cylinder crease + straight tangent orientation
    float foldZ = R * (1.0 - cos(theta)) + t_straight * sin(A);
    pos.z += foldZ;

    // Y pull: guarantees absolute perfect arc length over both crease and straight flap
    float foldPull = (t_bend - R * sin(theta)) + t_straight * (1.0 - cos(A));
    pos.y += foldPull * dir;

    // Slight lateral twist
    pos.x += edgeCurve * strength * 0.1 * dir;

    vShade = 1.0 - edgeCurve * strength * 0.4;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ─── fragment shader ───
const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  varying vec2 vUv;
  varying float vShade;

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    gl_FragColor = color;
  }
`;

// ─── helpers ───
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const mod = (n, m) => ((n % m) + m) % m;

export default function WebGLSlider({ images = [] }) {
  const containerRef = useRef(null);
  const scrollRef = useRef(0);

  useLenis((lenis) => {
    scrollRef.current = lenis.scroll;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ─── renderer ───
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // ─── scene & camera ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    // ─── layout settings ───
    const CARD_W = 3.2;
    const CARD_H = 3.0;
    const GAP = 4.5;
    const total = images.length;

    const vFov = (camera.fov * Math.PI) / 180;
    const viewH = 2 * Math.tan(vFov / 2) * camera.position.z;

    const loopLength = total * GAP;
    const pxPerWorldUnit = window.innerHeight / GAP;

    // ─── textures & meshes ───
    const loader = new THREE.TextureLoader();
    const meshes = [];

    const geo = new THREE.PlaneGeometry(CARD_W, CARD_H, 64, 64);

    images.forEach((img, i) => {
      const tex = loader.load(img.src);
      tex.colorSpace = THREE.SRGBColorSpace;

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: tex },
          uFold: { value: 0.0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.index = i;
      scene.add(mesh);
      meshes.push(mesh);
    });

    document.body.style.height = `${total * 100 + 100}vh`;

    // ─── animation loop ───
    const tick = () => {
      requestAnimationFrame(tick);

      const worldOffset = scrollRef.current / pxPerWorldUnit;
      const wrappedOffset = mod(worldOffset, loopLength);

      const halfView = viewH / 2;
      const foldRange = halfView + CARD_H;
      const viewW = viewH * camera.aspect;
      // Make the circle larger to create a gentler, less curvy path
      const arcRadius = viewW * 1.2;

      meshes.forEach((mesh) => {
        const i = mesh.userData.index;
        const baseY = -i * GAP;

        // y represents the arc length along the curved path
        let y = mod(baseY + wrappedOffset + loopLength / 2, loopLength) - loopLength / 2;

        // Map linear y to an angle along a semi-circle centered at the middle-left of the screen
        const theta = y / arcRadius;
        mesh.position.x = -arcRadius + arcRadius * Math.cos(theta);
        mesh.position.y = arcRadius * Math.sin(theta);
        mesh.rotation.z = theta;

        let fold = clamp(y / foldRange, -1, 1);
        mesh.material.uniforms.uFold.value = fold;

        const isVisible = Math.abs(y) < foldRange + CARD_H;
        mesh.visible = isVisible;

        // --- Text Synchronization ---
        const textEl = document.getElementById(`slider-text-${i}`);
        if (textEl) {
          if (isVisible) {
            textEl.style.display = "block";

            // Text starts on the left side of the plane (fold = -1 or +1)
            // Reaches the right side of the plane precisely when at the middle of the screen (fold = 0)
            // Using a cosine curve instead of absolute value provides smooth easing, eliminating any sharp "glitchy" bounce at the peak
            const progressToCenter = Math.cos(fold * Math.PI * 0.5); // 0 at screen edges, 1 at screen center

            // Start closer to the right (horizontal center at edges), reaching exact same right shift at center
            // This strictly maps 0.0 to 1.0, preventing it from ever crossing into the left side
            const localOffsetX = progressToCenter * (CARD_W * 0.70);

            // Start further from bottom, and exit further from top
            const localOffsetY = fold * (CARD_H * 0.75);

            // Add the local X and Y offsets in world space respecting the tilt/rotation of the plane
            const textWorldX = mesh.position.x + localOffsetX * Math.cos(theta) - localOffsetY * Math.sin(theta);
            const textWorldY = mesh.position.y + localOffsetX * Math.sin(theta) + localOffsetY * Math.cos(theta);

            // Project 3D coordinate directly to 2D pixels
            const screenX = window.innerWidth / 2 + (textWorldX / (viewW / 2)) * (window.innerWidth / 2);
            const screenY = window.innerHeight / 2 - (textWorldY / (viewH / 2)) * (window.innerHeight / 2);

            // Apply translate and rotation without any fading
            textEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) rotate(${-theta}rad)`;
            textEl.style.opacity = "1";
          } else {
            textEl.style.display = "none";
          }
        }
      });

      renderer.render(scene, camera);
    };

    tick();

    // ─── resize handler ───
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ─── cleanup ───
    return () => {
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geo.dispose();
      meshes.forEach((m) => {
        m.material.dispose();
      });
      document.body.style.height = "";
    };
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-screen pointer-events-none z-10"
      />
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-20 overflow-hidden">
        {images.map((img, i) => (
          <div
            key={i}
            id={`slider-text-${i}`}
            className="absolute top-0 left-0 hidden will-change-transform"
          >
            {/* Centering achieved locally allowing top-level translate3d to act purely as a coordinate plotter */}
            <div className="flex flex-col -translate-x-1/2 -translate-y-1/2 origin-center">
              <h1 className="text-[7vw] font-bold leading-[0.85] tracking-tighter whitespace-pre-wrap">
                {img.text}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}