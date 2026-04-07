"use client";

/**
 * ParallaxCard Component
 * ----------------------
 * Renders a single transparent plane with the color texture.
 * The depth map drives per-pixel UV parallax distortion in the shader.
 * Normal + scan maps are used for subtle lighting effects only.
 *
 * Usage:
 *   <ParallaxCard
 *     colorMap="/textures/character.ktx2"
 *     depthMap="/textures/character_depth.ktx2"
 *     normalMap="/textures/character_normal.ktx2"
 *     scanMap="/textures/character_scan.ktx2"
 *     width={3}
 *     height={4}
 *     parallaxStrength={0.04}
 *     ambientIntensity={0.4}
 *     ambientColor="#ffffff"
 *     lightColor="#a8d8ff"
 *     lightIntensity={0.8}
 *     dirLightColor="#ffffff"
 *     dirLightIntensity={1.0}
 *     dirLightPosition={[2, 3, 4]}
 *     dirLightSpecular={64}
 *   />
 *
 * REQUIRED — copy WASM transcoder into /public/basis/:
 *   cp node_modules/three/examples/jsm/libs/basis/basis_transcoder.js public/basis/
 *   cp node_modules/three/examples/jsm/libs/basis/basis_transcoder.wasm public/basis/
 */

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { extend } from "@react-three/fiber";

// ─── Shader Material ──────────────────────────────────────────────────────────
// Single plane. The depth map warps UV coords based on mouse position.
// Normal map contributes a subtle rim light. Scan map adds a faint emissive edge.

class ParallaxDepthMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor:           { value: null },
        uDepth:           { value: null },
        uNormal:          { value: null },
        uScan:            { value: null },
        uMouse:           { value: new THREE.Vector2(0, 0) },
        uParallax:        { value: 0.04 },
        uHasDepth:        { value: 0.0 },
        uHasNormal:       { value: 0.0 },
        uHasScan:         { value: 0.0 },
        uHasColor:        { value: 0.0 },
        // Ambient
        uAmbientColor:      { value: new THREE.Color(1, 1, 1) },
        uAmbientIntensity:  { value: 0.4 },
        // Mouse point light
        uLightColor:        { value: new THREE.Color(0.659, 0.847, 1.0) },
        uLightIntensity:    { value: 0.8 },
        // Directional light
        uDirLightColor:     { value: new THREE.Color(1, 1, 1) },
        uDirLightIntensity: { value: 1.0 },
        uDirLightDir:       { value: new THREE.Vector3(0.408, 0.612, 0.680) }, // normalised [2,3,4]
        uDirLightSpecular:  { value: 64.0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uColor;
        uniform sampler2D uDepth;
        uniform sampler2D uNormal;
        uniform sampler2D uScan;
        uniform vec2  uMouse;
        uniform float uParallax;
        uniform float uHasDepth;
        uniform float uHasNormal;
        uniform float uHasScan;
        uniform float uHasColor;
        // Ambient
        uniform vec3  uAmbientColor;
        uniform float uAmbientIntensity;
        // Mouse point light
        uniform vec3  uLightColor;
        uniform float uLightIntensity;
        // Directional light
        uniform vec3  uDirLightColor;
        uniform float uDirLightIntensity;
        uniform vec3  uDirLightDir;       // pre-normalised world direction toward light
        uniform float uDirLightSpecular;  // shininess exponent
        varying vec2 vUv;

        void main() {
          // 1. Per-pixel depth for UV warp
          float depth = 0.5;
          if (uHasDepth > 0.5) depth = texture2D(uDepth, vUv).r;

          // 2. Warp UVs by mouse × depth
          vec2 offset   = uMouse * depth * uParallax;
          vec2 warpedUv = clamp(vUv - offset, 0.001, 0.999);

          // 3. Base color
          if (uHasColor < 0.5) { gl_FragColor = vec4(0.0); return; }
          vec4 col = texture2D(uColor, warpedUv);

          // 4. Ambient
          vec3 ambient = uAmbientColor * uAmbientIntensity;

          vec3 lightContrib = vec3(0.0);
          if (uHasNormal > 0.5) {
            vec3 nrm     = normalize(texture2D(uNormal, warpedUv).rgb * 2.0 - 1.0);
            vec3 viewDir = vec3(0.0, 0.0, 1.0);

            // 5. Mouse point light (Blinn-Phong)
            vec3 mouseDir  = normalize(vec3(uMouse.x * 1.5, uMouse.y * 1.5, 1.0));
            float mDiff    = max(dot(nrm, mouseDir), 0.0);
            vec3  mHalf    = normalize(mouseDir + viewDir);
            float mSpec    = pow(max(dot(nrm, mHalf), 0.0), 32.0) * 0.4;
            lightContrib  += uLightColor * uLightIntensity * (mDiff + mSpec);

            // 6. Directional light (Blinn-Phong, fixed position)
            float dDiff    = max(dot(nrm, uDirLightDir), 0.0);
            vec3  dHalf    = normalize(uDirLightDir + viewDir);
            float dSpec    = pow(max(dot(nrm, dHalf), 0.0), uDirLightSpecular) * 0.5;
            lightContrib  += uDirLightColor * uDirLightIntensity * (dDiff + dSpec);
          }

          // 7. Combine color × (ambient + lights)
          col.rgb = col.rgb * (ambient + lightContrib);

          // 8. Scan emissive (additive, uses dir light color as tint)
          if (uHasScan > 0.5) {
            vec4  scan    = texture2D(uScan, warpedUv);
            float scanLum = dot(scan.rgb, vec3(0.299, 0.587, 0.114));
            col.rgb += uDirLightColor * scanLum * 0.10;
          }

          gl_FragColor = col;
        }
      `,
    });
  }
}
extend({ ParallaxDepthMaterial });

// ─── KTX2 Loader singleton ────────────────────────────────────────────────────

let _ktx2 = null;
function getKTX2Loader(renderer) {
  if (!_ktx2) {
    _ktx2 = new KTX2Loader()
      .setTranscoderPath("/basis/")
      .detectSupport(renderer);
  }
  return _ktx2;
}

function useKTX2(path) {
  const { gl } = useThree();
  const [tex, setTex] = useState(null);
  useEffect(() => {
    if (!path) return;
    let dead = false;
    getKTX2Loader(gl).load(
      path,
      (t) => { if (!dead) { t.needsUpdate = true; setTex(t); } },
      undefined,
      (e) => console.error("[ParallaxCard] KTX2 load error:", path, e)
    );
    return () => { dead = true; };
  }, [path, gl]);
  return tex;
}

// ─── Main Mesh ────────────────────────────────────────────────────────────────

function ParallaxMesh({ colorMap, depthMap, normalMap, scanMap, width, height, parallaxStrength, ambientIntensity, ambientColor, lightColor, lightIntensity, dirLightColor, dirLightIntensity, dirLightPosition, dirLightSpecular }) {
  const matRef = useRef();
  const smoothMouse = useRef(new THREE.Vector2());
  const targetMouse = useRef(new THREE.Vector2());
  const { gl } = useThree();

  const tColor  = useKTX2(colorMap);
  const tDepth  = useKTX2(depthMap);
  const tNormal = useKTX2(normalMap);
  const tScan   = useKTX2(scanMap);

  // Mouse tracking
  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x =  ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const y = -((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      targetMouse.current.set(x, y);
    };
    const onLeave = () => targetMouse.current.set(0, 0);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [gl]);

  // Update uniforms when textures arrive
  useEffect(() => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    if (tColor)  { u.uColor.value  = tColor;  u.uHasColor.value  = 1; }
    if (tDepth)  { u.uDepth.value  = tDepth;  u.uHasDepth.value  = 1; }
    if (tNormal) { u.uNormal.value = tNormal; u.uHasNormal.value = 1; }
    if (tScan)   { u.uScan.value   = tScan;   u.uHasScan.value   = 1; }
    u.uParallax.value           = parallaxStrength;
    u.uAmbientIntensity.value   = ambientIntensity;
    u.uAmbientColor.value.set(ambientColor);
    u.uLightColor.value.set(lightColor);
    u.uLightIntensity.value     = lightIntensity;
    u.uDirLightColor.value.set(dirLightColor);
    u.uDirLightIntensity.value  = dirLightIntensity;
    u.uDirLightSpecular.value   = dirLightSpecular;
    // Convert world-space position into a normalised direction toward origin
    const [px, py, pz] = dirLightPosition;
    u.uDirLightDir.value.set(px, py, pz).normalize();
  }, [tColor, tDepth, tNormal, tScan, parallaxStrength, ambientIntensity, ambientColor, lightColor, lightIntensity, dirLightColor, dirLightIntensity, dirLightPosition, dirLightSpecular]);

  // Smooth mouse → shader
  useFrame((_, delta) => {
    if (!matRef.current) return;
    const lp = 1 - Math.exp(-9 * delta);
    smoothMouse.current.lerp(targetMouse.current, lp);
    matRef.current.uniforms.uMouse.value.copy(smoothMouse.current);
  });

  return (
    <mesh scale={1} position={[0,-.2,0]}>
      <planeGeometry args={[width, height]} />
      <parallaxDepthMaterial ref={matRef} />
    </mesh>
  );
}

// ─── Scene wrapper ────────────────────────────────────────────────────────────

function ParallaxScene(props) {
  return (
    <Suspense fallback={null}>
      <ParallaxMesh {...props} />
    </Suspense>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export default function ParallaxCard({
  colorMap,
  depthMap,
  normalMap,
  scanMap,
  width = 3,
  height = 4,
  parallaxStrength = 0.04,
  ambientIntensity = 0.4,
  ambientColor = "#ffffff",
  lightColor = "#a8d8ff",
  lightIntensity = 0.8,
  dirLightColor = "#ffffff",
  dirLightIntensity = 10.0,
  dirLightPosition = [-10, 13, 5],  // world-space position — converted to direction in shader
  dirLightSpecular = 64,
  style = {},
  className = "",
}) {
  return (
    <div className={className} style={{ width: "100%", height: "100%", ...style }}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ background: "transparent" }}
      >
        <ParallaxScene
          colorMap={colorMap}
          depthMap={depthMap}
          normalMap={normalMap}
          scanMap={scanMap}
          width={width}
          height={height}
          parallaxStrength={parallaxStrength}
          ambientIntensity={ambientIntensity}
          ambientColor={ambientColor}
          lightColor={lightColor}
          lightIntensity={lightIntensity}
          dirLightColor={dirLightColor}
          dirLightIntensity={dirLightIntensity}
          dirLightPosition={dirLightPosition}
          dirLightSpecular={dirLightSpecular}
        />
      </Canvas>
    </div>
  );
}