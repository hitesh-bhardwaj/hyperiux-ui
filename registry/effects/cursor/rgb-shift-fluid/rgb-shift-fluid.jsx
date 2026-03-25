"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function RgbShiftFluid({
  className = "",
  intensity = 0.5,
  smoothing = 0.1,
  rgbShiftAmount = 0.02,
  distortionStrength = 0.3,
  backgroundImage,
  children,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Wait for next frame to ensure container has dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // If no dimensions, try getBoundingClientRect
    if (width === 0 || height === 0) {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }

    // Still no dimensions? Return early
    if (width === 0 || height === 0) {
      console.warn("RgbShiftFluid: Container has no dimensions");
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Mouse tracking
    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };
    const prevMouse = { x: 0.5, y: 0.5 };

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader - Lusion-style fluid distortion (velocity-based only)
    const fragmentShader = `
      uniform vec2 uMouse;
      uniform vec2 uVelocity;
      uniform float uIntensity;
      uniform float uRgbShift;
      uniform float uDistortion;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      uniform sampler2D uTexture;
      uniform bool uHasTexture;

      varying vec2 vUv;

      // Cover UV calculation (like background-size: cover)
      vec2 getCoverUv(vec2 uv, vec2 resolution, vec2 imageResolution) {
        vec2 s = resolution;
        vec2 i = imageResolution;
        float rs = s.x / s.y;
        float ri = i.x / i.y;
        vec2 new_size = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
        vec2 offset = (rs < ri ? vec2((new_size.x - s.x) / 2.0, 0.0) : vec2(0.0, (new_size.y - s.y) / 2.0)) / new_size;
        return uv * s / new_size + offset;
      }

      void main() {
        vec2 uv = vUv;

        // Calculate distance from mouse
        vec2 mousePos = uMouse;
        float dist = distance(uv, mousePos);

        // Velocity magnitude determines effect strength
        float velocityMag = length(uVelocity);

        // Dynamic radius based on velocity - bigger effect when moving fast
        float radius = (0.15 + velocityMag * 2.0) * uIntensity;

        // Smooth falloff from cursor position
        float falloff = smoothstep(radius, 0.0, dist);

        // Distortion strength based on velocity AND distance
        float strength = falloff * velocityMag * uDistortion * 8.0;

        // Push pixels in the direction of cursor movement
        vec2 distortion = uVelocity * strength;

        vec2 distortedUv = uv - distortion;

        // RGB shift ONLY when moving (purely velocity-based)
        float rgbOffset = uRgbShift * velocityMag * falloff * 3.0;
        vec2 rgbShiftDir = normalize(uVelocity + vec2(0.0001));

        vec3 color;

        if (uHasTexture) {
          // Apply cover UV for proper aspect ratio
          vec2 baseUv = getCoverUv(distortedUv, uResolution, uImageResolution);

          // RGB separation for chromatic aberration - only when moving
          vec2 uvR = getCoverUv(distortedUv + rgbShiftDir * rgbOffset, uResolution, uImageResolution);
          vec2 uvB = getCoverUv(distortedUv - rgbShiftDir * rgbOffset, uResolution, uImageResolution);

          float r = texture2D(uTexture, uvR).r;
          float g = texture2D(uTexture, baseUv).g;
          float b = texture2D(uTexture, uvB).b;

          color = vec3(r, g, b);
        } else {
          // Fallback gradient
          vec2 coverUv = getCoverUv(distortedUv, uResolution, uImageResolution);
          color = vec3(coverUv.x * 0.2, 0.05, coverUv.y * 0.3 + 0.1);
        }

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create shader material
    const uniforms = {
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: intensity },
      uRgbShift: { value: rgbShiftAmount },
      uDistortion: { value: distortionStrength },
      uResolution: { value: new THREE.Vector2(width, height) },
      uImageResolution: { value: new THREE.Vector2(1, 1) },
      uTexture: { value: null },
      uHasTexture: { value: false },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    // Load texture if provided
    if (backgroundImage) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(backgroundImage, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        uniforms.uTexture.value = texture;
        uniforms.uImageResolution.value.set(
          texture.image.width,
          texture.image.height
        );
        uniforms.uHasTexture.value = true;
      });
    }

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Handle resize
    const handleResize = () => {
      let w = container.clientWidth;
      let h = container.clientHeight;
      if (w === 0 || h === 0) {
        const rect = container.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
      }
      if (w > 0 && h > 0) {
        renderer.setSize(w, h);
        uniforms.uResolution.value.set(w, h);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Use ResizeObserver for more reliable size detection
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Handle mouse move
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    container.addEventListener("mousemove", handleMouseMove);

    // Handle touch
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        targetMouse.x = (e.touches[0].clientX - rect.left) / rect.width;
        targetMouse.y = 1.0 - (e.touches[0].clientY - rect.top) / rect.height;
      }
    };
    container.addEventListener("touchmove", handleTouchMove);

    // Smoothed velocity for natural decay
    const smoothedVelocity = { x: 0, y: 0 };

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth mouse interpolation
      mouse.x += (targetMouse.x - mouse.x) * smoothing;
      mouse.y += (targetMouse.y - mouse.y) * smoothing;

      // Calculate raw velocity
      const rawVelX = mouse.x - prevMouse.x;
      const rawVelY = mouse.y - prevMouse.y;
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;

      // Smooth velocity with decay (this creates the "settling" effect)
      smoothedVelocity.x += (rawVelX - smoothedVelocity.x) * 0.3;
      smoothedVelocity.y += (rawVelY - smoothedVelocity.y) * 0.3;

      // Apply velocity decay when not moving
      smoothedVelocity.x *= 0.95;
      smoothedVelocity.y *= 0.95;

      // Update uniforms
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      uniforms.uVelocity.value.set(smoothedVelocity.x, smoothedVelocity.y);

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [intensity, smoothing, rgbShiftAmount, distortionStrength, backgroundImage]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          touchAction: "none",
        }}
      />
      {children && (
        <div className="relative z-10 h-full">{children}</div>
      )}
    </div>
  );
}
