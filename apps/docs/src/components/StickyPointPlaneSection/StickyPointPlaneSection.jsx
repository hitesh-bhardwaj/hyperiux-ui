"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function buildGridData({
  planeWidth,
  planeHeight,
  widthSegments,
  heightSegments,
  planeCount,
  planeSpacing,
}) {
  const planes = [];

  for (let p = 0; p < planeCount; p++) {
    const z = (p - (planeCount - 1) / 2) * planeSpacing;
    const plane = [];

    for (let iy = 0; iy <= heightSegments; iy++) {
      const row = [];

      for (let ix = 0; ix <= widthSegments; ix++) {
        const x = (ix / widthSegments - 0.5) * planeWidth;
        const y = (iy / heightSegments - 0.5) * planeHeight;
        row.push(new THREE.Vector3(x, y, z));
      }

      plane.push(row);
    }

    planes.push(plane);
  }

  return { planes };
}

function pickDiagonalNodePath(planes, minNodes = 6, maxNodes = 14) {
  if (!planes?.length) return null;

  const directions = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  for (let attempt = 0; attempt < 100; attempt++) {
    const plane = planes[Math.floor(Math.random() * planes.length)];
    const rows = plane.length;
    const cols = plane[0].length;

    const dir = directions[Math.floor(Math.random() * directions.length)];
    const length =
      Math.floor(Math.random() * (maxNodes - minNodes + 1)) + minNodes;

    const startX = Math.floor(Math.random() * cols);
    const startY = Math.floor(Math.random() * rows);

    const endX = startX + dir[0] * (length - 1);
    const endY = startY + dir[1] * (length - 1);

    if (endX < 0 || endX >= cols || endY < 0 || endY >= rows) continue;

    const path = [];
    for (let i = 0; i < length; i++) {
      const x = startX + dir[0] * i;
      const y = startY + dir[1] * i;
      path.push(plane[y][x].clone());
    }

    if (path.length >= minNodes) return path;
  }

  return null;
}

function densifyPath(path, samplesPerSegment = 14) {
  if (!path || path.length < 2) return path || [];

  const dense = [];

  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];

    for (let s = 0; s < samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      dense.push(new THREE.Vector3().lerpVectors(a, b, t));
    }
  }

  dense.push(path[path.length - 1].clone());
  return dense;
}

function PointPlane({
  planeWidth = 3,
  planeHeight = 3,
  widthSegments = 10,
  heightSegments = 10,
  z = 0,
  particleSize = 0.08,
  particleColor = [2.4, 2.4, 2.4],
  stretchRef,
}) {
  const materialRef = useRef(null);

  const geometry = useMemo(() => {
    const positions = [];

    for (let iy = 0; iy <= heightSegments; iy++) {
      for (let ix = 0; ix <= widthSegments; ix++) {
        const x = (ix / widthSegments - 0.5) * planeWidth;
        const y = (iy / heightSegments - 0.5) * planeHeight;
        positions.push(x, y, 0);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    return geo;
  }, [planeWidth, planeHeight, widthSegments, heightSegments]);

  const uniforms = useMemo(
    () => ({
      uBaseSize: { value: particleSize * 100.0 },
      uStretchY: { value: 1.0 },
      uColor: { value: new THREE.Color(...particleColor) },
    }),
    [particleSize, particleColor]
  );

  useFrame(() => {
    if (!materialRef.current || !stretchRef) return;

    materialRef.current.uniforms.uStretchY.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uStretchY.value,
      stretchRef.current,
      0.12
    );
  });

  return (
    <points position={[0, 0, z]} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uBaseSize;
          uniform float uStretchY;
          varying float vStretchY;

          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            float dist = max(-mvPosition.z, 0.001);
            gl_PointSize = (uBaseSize * (5.0 / dist)) * max(uStretchY, 1.0);

            vStretchY = max(uStretchY, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vStretchY;

          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);

            uv.x *= vStretchY;

            float d = length(uv);
            float alpha = 1.0 - smoothstep(0.18, 0.5, d);
            float glow = 1.0 - smoothstep(0.0, 0.5, d);

            if (alpha < 0.01) discard;

            vec3 color = uColor * (0.65 + glow * 0.9);
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </points>
  );
}

function DiagonalStrokeTrail({
  planes,
  maxTrailPoints = 320,
  trailSize = 0.012,
  trailColor = [2.4, 2.4, 2.4],
  samplesPerSegment = 14,
  minNodes = 6,
  maxNodes = 14,
  speedMin = 42,
  speedMax = 72,
  tailMin = 10,
  tailMax = 24,
  trailOpacity = 1,
  tailShrink = 1.35,
}) {
  const geoRef = useRef(null);
  const matRef = useRef(null);

  const positions = useMemo(
    () => new Float32Array(maxTrailPoints * 3),
    [maxTrailPoints]
  );
  const alphas = useMemo(
    () => new Float32Array(maxTrailPoints),
    [maxTrailPoints]
  );
  const scales = useMemo(
    () => new Float32Array(maxTrailPoints),
    [maxTrailPoints]
  );

  const stateRef = useRef({
    activeCount: 0,
    progress: 0,
    speed: 32,
    tailLength: 18,
    delay: 0,
    scaleJitter: [],
  });

  const setupTrail = () => {
    const nodePath = pickDiagonalNodePath(planes, minNodes, maxNodes);
    if (!nodePath) return;

    const densePath = densifyPath(nodePath, samplesPerSegment).slice(
      0,
      maxTrailPoints
    );

    const activeCount = densePath.length;
    const tailLength = THREE.MathUtils.clamp(
      Math.floor(
        THREE.MathUtils.randFloat(tailMin, tailMax) +
          activeCount * THREE.MathUtils.randFloat(0.02, 0.08)
      ),
      tailMin,
      tailMax
    );

    stateRef.current.activeCount = activeCount;
    stateRef.current.progress = 0;
    stateRef.current.speed = THREE.MathUtils.randFloat(speedMin, speedMax);
    stateRef.current.tailLength = tailLength;
    stateRef.current.delay = THREE.MathUtils.randFloat(0.08, 0.9);
    stateRef.current.scaleJitter = Array.from({ length: activeCount }, () =>
      THREE.MathUtils.randFloat(0.9, 1.02)
    );

    for (let i = 0; i < maxTrailPoints; i++) {
      if (i < activeCount) {
        positions[i * 3 + 0] = densePath[i].x;
        positions[i * 3 + 1] = densePath[i].y;
        positions[i * 3 + 2] = densePath[i].z;
        alphas[i] = 0;
        scales[i] = stateRef.current.scaleJitter[i];
      } else {
        positions[i * 3 + 0] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        alphas[i] = 0;
        scales[i] = 0;
      }
    }

    if (geoRef.current) {
      geoRef.current.attributes.position.needsUpdate = true;
      geoRef.current.attributes.aAlpha.needsUpdate = true;
      geoRef.current.attributes.aScale.needsUpdate = true;
    }
  };

  useLayoutEffect(() => {
    setupTrail();
  }, [
    planes,
    maxTrailPoints,
    samplesPerSegment,
    minNodes,
    maxNodes,
    speedMin,
    speedMax,
    tailMin,
    tailMax,
  ]);

  useFrame((state, delta) => {
    if (!geoRef.current || !matRef.current) return;

    const s = stateRef.current;

    if (s.delay > 0) {
      s.delay -= delta;
      return;
    }

    s.progress += delta * s.speed;

    const head = s.progress;
    const tailStart = head - s.tailLength;
    const endLife = s.activeCount + s.tailLength;

    for (let i = 0; i < maxTrailPoints; i++) {
      if (i >= s.activeCount) {
        alphas[i] = 0;
        continue;
      }

      if (i <= head && i >= tailStart) {
        const t = THREE.MathUtils.clamp(
          (head - i) / Math.max(s.tailLength, 1),
          0,
          1
        );

        const bodyAlpha = (1 - Math.pow(t, 0.72)) * trailOpacity;
        const scaleFade = 1 - Math.pow(t, tailShrink);

        scales[i] = THREE.MathUtils.lerp(
          0.18,
          s.scaleJitter[i],
          scaleFade
        );

        const twinkle =
          0.985 + 0.015 * Math.sin(state.clock.elapsedTime * 10 + i * 0.1);

        alphas[i] = bodyAlpha * twinkle;
      } else {
        alphas[i] = 0;
        if (i < s.activeCount) {
          scales[i] = s.scaleJitter[i];
        }
      }
    }

    geoRef.current.attributes.aAlpha.needsUpdate = true;
    geoRef.current.attributes.aScale.needsUpdate = true;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    if (head > endLife) {
      setupTrail();
    }
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>

      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uSize: { value: trailSize * 100.0 },
          uColor: { value: new THREE.Color(...trailColor) },
          uTime: { value: 0 },
        }}
        vertexShader={`
          attribute float aAlpha;
          attribute float aScale;
          varying float vAlpha;

          uniform float uSize;

          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            float dist = max(-mvPosition.z, 0.001);
            gl_PointSize = (uSize * aScale) * (5.0 / dist);

            vAlpha = aAlpha;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;

          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float d = length(uv);

            float circle = 1.0 - smoothstep(0.10, 0.5, d);
            float glow = 1.0 - smoothstep(0.0, 0.5, d);

            float alpha = circle * vAlpha;
            if (alpha < 0.01) discard;

            vec3 color = uColor * (0.42 + glow * 1.05);
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </points>
  );
}

function DiagonalStrokeTrails({
  planes,
  count = 8,
  trailSize = 0.012,
  trailColor = [2.4, 2.4, 2.4],
  samplesPerSegment = 14,
  minNodes = 6,
  maxNodes = 14,
  speedMin = 42,
  speedMax = 72,
  tailMin = 10,
  tailMax = 24,
  trailOpacity = 1,
  tailShrink = 1.35,
}) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <DiagonalStrokeTrail
          key={i}
          planes={planes}
          trailSize={trailSize}
          trailColor={trailColor}
          samplesPerSegment={samplesPerSegment}
          minNodes={minNodes}
          maxNodes={maxNodes}
          speedMin={speedMin}
          speedMax={speedMax}
          tailMin={tailMin}
          tailMax={tailMax}
          trailOpacity={trailOpacity}
          tailShrink={tailShrink}
        />
      ))}
    </group>
  );
}

function SceneContent({
  sectionRef,
  planeWidth = 12,
  planeHeight = 10,
  widthSegments = 9,
  heightSegments = 10,
  planeCount = 15,
  planeSpacing = 0.5,
  particleSize = 0.08,
  particleColor = [2.4, 2.4, 2.4],
  startY = -3,
  endY = 4,
  debug = false,
  trailCount = 8,
  trailSize = 0.012,
  trailDensity = 14,
  trailMinNodes = 6,
  trailMaxNodes = 14,
  trailSpeedMin = 42,
  trailSpeedMax = 72,
  trailTailMin = 10,
  trailTailMax = 24,
  trailOpacity = 1,
  trailColor = null,
  tailShrink = 1.35,
}) {
  const groupRef = useRef(null);
  const stretchRef = useRef(1);
  const stopTimerRef = useRef(null);

  const effectiveTrailColor = trailColor ?? particleColor;

  const gridData = useMemo(
    () =>
      buildGridData({
        planeWidth,
        planeHeight,
        widthSegments,
        heightSegments,
        planeCount,
        planeSpacing,
      }),
    [
      planeWidth,
      planeHeight,
      widthSegments,
      heightSegments,
      planeCount,
      planeSpacing,
    ]
  );

  useLayoutEffect(() => {
  if (!sectionRef.current || !groupRef.current) return;

  const ctx = gsap.context(() => {
    // 1. Set the starting position (hidden/bottom)
    gsap.set(groupRef.current.position, { y: -2.5 });
    gsap.from(groupRef.current.position,{
    z:-5,
    ease: "power1.out",
    scrollTrigger: {
        trigger: "#experience",
        start: "50% top", 
        end: "60% top",
        scrub: true,
        // markers:true,
      },
    })
    // 2. Create the movement trigger
    gsap.to(groupRef.current.position, {
      y: 4.5, // Your desired end height
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#experience",
        start: "60% top", 
        end: "80% bottom",
        scrub: true,
        // markers:true,
        onUpdate: (self) => {
          // Velocity-based stretch logic
          const velocity = Math.abs(self.getVelocity());
          const intensity = Math.min(velocity / 2500, 1);

          // Update the stretch ref for the shader
          stretchRef.current = 1 + intensity * 15;

          // Smoothly reset stretch when scrolling stops
          if (stopTimerRef.current) stopTimerRef.current.kill();
          stopTimerRef.current = gsap.delayedCall(0.1, () => {
            gsap.to(stretchRef, { current: 1, duration: 0.2 });
          });
        },
      },
    });

    ScrollTrigger.refresh();
  }, sectionRef);

  return () => {
    if (stopTimerRef.current) stopTimerRef.current.kill();
    ctx.revert();
  };
}, [sectionRef, startY]);

  return (
    <>
      <color attach="background" args={["#0A1057"]} />
      <ambientLight intensity={0.35} />

      <group ref={groupRef} rotation={[0, Math.PI, 0]} position={[0, 0, -1]}>
        {Array.from({ length: planeCount }).map((_, i) => {
          const z = (i - (planeCount - 1) / 2) * planeSpacing;

          return (
            <PointPlane
              key={i}
              z={z}
              planeWidth={planeWidth}
              planeHeight={planeHeight}
              widthSegments={widthSegments}
              heightSegments={heightSegments}
              particleSize={particleSize}
              particleColor={particleColor}
              stretchRef={stretchRef}
            />
          );
        })}

        <DiagonalStrokeTrails
          planes={gridData.planes}
          count={trailCount}
          trailSize={trailSize}
          trailColor={effectiveTrailColor}
          samplesPerSegment={trailDensity}
          minNodes={trailMinNodes}
          maxNodes={trailMaxNodes}
          speedMin={trailSpeedMin}
          speedMax={trailSpeedMax}
          tailMin={trailTailMin}
          tailMax={trailTailMax}
          trailOpacity={trailOpacity}
          tailShrink={tailShrink}
        />
      </group>

      <EffectComposer>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.22}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function StickyPointPlaneSection({
  sectionHeight = "400vh",
  planeWidth = 12,
  planeHeight = 10,
  widthSegments = 9,
  heightSegments = 10,
  planeCount = 15,
  planeSpacing = 0.5,
  particleSize = 0.08,
  particleColor = [2.4, 2.4, 2.4],
  cameraPosition = [0, 0, 5],
  startY = -3,
  endY = 4,
  debug = false,

  // trail controls
  trailCount = 8,
  trailSize = 0.012,        // thinner trail
  trailDensity = 14,        // more samples = less space between trail particles
  trailMinNodes = 6,
  trailMaxNodes = 14,
  trailSpeedMin = 42,       // faster draw
  trailSpeedMax = 72,       // faster draw
  trailTailMin = 10,
  trailTailMax = 24,
  trailOpacity = 1,
  trailColor = null,        // if null, uses particleColor
  tailShrink = 1.35,
}) {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      id="cube-container"
      className="relative bg-gradient-to-b from-[#020E4F] via-50% to-[#1A2874]"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas camera={{ position: cameraPosition, fov: 50 }}>
          <SceneContent
            sectionRef={sectionRef}
            planeWidth={planeWidth}
            planeHeight={planeHeight}
            widthSegments={widthSegments}
            heightSegments={heightSegments}
            planeCount={planeCount}
            planeSpacing={planeSpacing}
            particleSize={particleSize}
            particleColor={particleColor}
            startY={startY}
            endY={endY}
            debug={debug}
            trailCount={trailCount}
            trailSize={trailSize}
            trailDensity={trailDensity}
            trailMinNodes={trailMinNodes}
            trailMaxNodes={trailMaxNodes}
            trailSpeedMin={trailSpeedMin}
            trailSpeedMax={trailSpeedMax}
            trailTailMin={trailTailMin}
            trailTailMax={trailTailMax}
            trailOpacity={trailOpacity}
            trailColor={trailColor}
            tailShrink={tailShrink}
          />
        </Canvas>
      </div>
    </section>
  );
}