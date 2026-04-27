"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";

// ─── Data ─────────────────────────────────────────────────────────────────────

const previewImages = [
  "/assets/nature/nature01.png",
  "/assets/nature/nature02.png",
  "/assets/nature/nature03.png",
  "/assets/nature/nature04.png",
  "/assets/nature/nature05.png",
  "/assets/nature/nature06.png",
  "/assets/nature/nature07.png",
  "/assets/nature/nature08.png",
  "/assets/nature/nature09.png",
  "/assets/nature/nature10.png",
  "/assets/nature/nature11.png",
  "/assets/nature/nature12.png",
];

const rawItems = [
  ["ISB_104", "Unfolding Grace",               "WebGL – Motion – Interaction", "2025"],
  ["ISB_128", "The Shape of Flow",              "WebGL – Motion – Interaction", "2025"],
  ["ISB_142", "Endless in Color",               "WebGL – Motion – Interaction", "2025"],
  ["ISB_157", "TG 7th / Flow of Sound",         "WebGL – Motion – Interaction", "2025"],
  ["ISB_163", "Adult Akech for Vogue US",        "WebGL – Motion – Interaction", "2025"],
  ["ISB_174", "Transforming Spaces",             "WebGL – Motion – Interaction", "2025"],
  ["ISB_189", "Sixfold Portraits",              "WebGL – Motion – Interaction", "2025"],
  ["ISB_193", "About:Blank / Twist of Sight",   "WebGL – Motion – Interaction", "2025"],
  ["ISB_205", "AHKET: A Chain of Fashion",       "WebGL – Motion – Interaction", "2025"],
  ["ISB_217", "About:Blank / Distorted Looks",  "WebGL – Motion – Interaction", "2025"],
  ["ISB_224", "Vogue China / Waves of Fashion", "WebGL – Motion – Interaction", "2025"],
  ["ISB_239", "MIL's Curated Collection",       "WebGL – Motion – Interaction", "2025"],
  ["ISB_249", "Curved Perspectives",            "WebGL – Motion – Interaction", "2024"],
  ["ISB_256", "YSL FW25 / Flowing Looks",       "WebGL – Motion – Interaction", "2024"],
  ["ISB_263", "Spinning Triptych",              "WebGL – Motion – Interaction", "2024"],
  ["ISB_275", "Gucci PF25 / A Moving Lookbook", "WebGL – Motion – Interaction", "2024"],
  ["ISB_284", "Jellyfish in Motion",            "Kinetic Typography – Motion",  "2024"],
  ["ISB_298", "The Cylindrical Edit",           "WebGL – Motion – Interaction", "2024"],
  ["ISB_302", "Flow of Portraits",              "WebGL – Shaders",              "2024"],
  ["ISB_314", "Endless Ribbon",                 "WebGL – Motion – Interaction", "2024"],
  ["ISB_327", "Twisted Portraits",              "WebGL – Motion – Interaction", "2024"],
  ["ISB_339", "Spiral of Sight",               "WebGL – Motion – Interaction", "2024"],
];

const items = rawItems.map(([id, title, focus, year], index) => ({
  id, title, focus, year,
  img: previewImages[index % previewImages.length],
}));

// ─── Shaders ──────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */`
  uniform vec2  uVelocity;
  uniform vec2  uViewport;    // canvas width & height in px (ortho)
  uniform float uCurvature;   // strength of the cylindrical bend
  varying vec2  vUv;

  void main() {
    vUv = uv;

    // ── 1. Compute world-space position of this vertex ───────────────────────
    vec4 worldPos = modelMatrix * vec4(position, 1.0);

    // ── 2. Normalise world X/Y to [-1, 1] across the full viewport ──────────
    float nx = worldPos.x / (uViewport.x);   // -1 left … +1 right
    float ny = worldPos.y / (uViewport.y);   // -1 bottom … +1 top

    // ── 3. Cylindrical Z displacement ────────────────────────────────────────
    float cx = clamp(nx, -1.0, 1.0);
    float cy = clamp(ny, -1.0, 1.0);

    // Expand the bend to the whole screen using a lower exponent (1.4 instead of 2.0).
    // Multiply by 1.35 to create "more bend" overall as requested.
    float bendY = pow(abs(cy), 1.4) * 1.35;
    float bendX = pow(abs(cx), 1.4) * 1.35;

    // Dynamic scroll intensity: smoothly settles to 0 when scrolling stops
    float scrollIntensity = smoothstep(0.0, 2.0, abs(uVelocity.y));

    // Push edges back (negative Z axis) dynamically based on scroll velocity
    float zOffset = (bendY * uCurvature + bendX * (uCurvature * 0.15)) * scrollIntensity;

    // ── 4. Velocity warp ─────────────────────────────────────────────────────
    float localX   = (uv.x - 0.5) * 2.0;
    float ripple   = sin(uv.y * 3.14159265) * localX;
    float velWarp  = ripple * abs(uVelocity.y) * 0.025;

    float finalZOffset = zOffset + velWarp;

    // ── 5. Fake Perspective ──────────────────────────────────────────────────
    // We simulate perspective by scaling X and Y towards the center based on Z.
    // A larger focal length makes the perspective less extreme and smoother (less "bulgy").
    float focalLength = max(uViewport.y * 3.0, 1200.0);
    float perspective = focalLength / (focalLength - finalZOffset);

    // Apply fake perspective to world coordinates before projection
    vec3 finalPos = worldPos.xyz;
    finalPos.xy *= perspective;
    finalPos.z += finalZOffset;

    // ── 6. Final position ────────────────────────────────────────────────────
    gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  uniform sampler2D uTexture;
  uniform vec2 uPlaneSize;
  uniform vec2 uImageSize;
  uniform float uAlpha;
  uniform float uZoom;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 planeSize, vec2 imageSize) {
    float planeRatio = planeSize.x / planeSize.y;
    float imageRatio = imageSize.x / imageSize.y;
    vec2 scale = vec2(1.0);
    if (planeRatio > imageRatio) {
      scale.y = imageRatio / planeRatio;
    } else {
      scale.x = planeRatio / imageRatio;
    }
    uv = (uv - 0.5) * scale + 0.5;
    return (uv - 0.5) / uZoom + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv, uPlaneSize, uImageSize);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
    vec4 tex = texture2D(uTexture, uv);
    gl_FragColor = vec4(tex.rgb, tex.a * uAlpha);
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
const lerp  = (a, b, t)   => a + (b - a) * t;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HoverSlider() {
  const mountRef = useRef(null);
  const glRef    = useRef(null);
  const stateRef = useRef({ activeIndex: 0, hovering: false });

  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let W = mount.offsetWidth;
    let H = mount.offsetHeight;

    // ── Card sizing ───────────────────────────────────────────────────────────
    const CARD_ASPECT = 1.4;
    const GAP         = 14;
    const VISIBLE     = 7;
    const HALF        = 3;

    const getCardH = () => Math.round(H * 0.46);
    const getCardW = () => Math.round(getCardH() * CARD_ASPECT);
    const getStripCX = (_cw) => 0;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      position: "absolute", inset: "0",
      width: "100%", height: "100%",
      zIndex: "15", pointerEvents: "none",
    });
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    const updateCamera = () => {
      camera.left   = -W / 2;  camera.right  =  W / 2;
      camera.top    =  H / 2;  camera.bottom = -H / 2;
      camera.near   = -2000;   camera.far    =  2000;
      camera.updateProjectionMatrix();
    };
    camera.position.z = 1000;
    updateCamera();
    renderer.setSize(W, H, false);

    // ── Textures ──────────────────────────────────────────────────────────────
    const loader   = new THREE.TextureLoader();
    const textures = previewImages.map((src) => {
      const tex = loader.load(src, (t) => {
        t.colorSpace  = THREE.SRGBColorSpace;
        t.minFilter   = THREE.LinearFilter;
        t.magFilter   = THREE.LinearFilter;
        t.userData.iw = t.image?.width  || 1;
        t.userData.ih = t.image?.height || 1;
      });
      tex.userData.iw = 1;
      tex.userData.ih = 1;
      return tex;
    });

    const syncImageSize = (mesh) => {
      const t = mesh.material.uniforms.uTexture.value;
      if (!t?.image) return;
      mesh.material.uniforms.uImageSize.value.set(
        t.image.width  || t.userData.iw || 1,
        t.image.height || t.userData.ih || 1,
      );
    };

    // ── Meshes ────────────────────────────────────────────────────────────────
    // Higher segment count so the cylindrical curve is smooth
    const geo = new THREE.PlaneGeometry(1, 1, 60, 60);
    let CW = getCardW(), CH = getCardH();

    const makeMat = (tex) => new THREE.ShaderMaterial({
      uniforms: {
        uTexture:   { value: tex },
        uPlaneSize: { value: new THREE.Vector2(CW, CH) },
        uImageSize: { value: new THREE.Vector2(tex.userData.iw, tex.userData.ih) },
        uVelocity:  { value: new THREE.Vector2(0, 0) },
        uAlpha:     { value: 0 },
        uZoom:      { value: 1.06 },
        // World-space viewport half-extents (ortho camera bounds)
        uViewport:  { value: new THREE.Vector2(W / 2, H / 2) },
        // How many px the edges bend back in Z.
        // ~220 px gives the pronounced barrel visible in the video.
        uCurvature: { value: 220 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite:  false,
      side:        THREE.DoubleSide,
    });

    const meshes = Array.from({ length: VISIBLE }, (_, i) => {
      const mesh = new THREE.Mesh(geo, makeMat(textures[i % textures.length]));
      mesh.renderOrder = i;
      scene.add(mesh);
      return mesh;
    });

    // ── Animation state ───────────────────────────────────────────────────────
    const anim = { alpha: 0 };
    let floatIdx  = 0;
    let prevFloat = 0;
    const vel = new THREE.Vector2(0, 0);
    let raf = 0;

    const show = () => gsap.to(anim, { alpha: 1, duration: 0.45, ease: "power3.out" });
    const hide = () => gsap.to(anim, { alpha: 0, duration: 0.35, ease: "power2.out" });

    const onResize = () => {
      W = mount.offsetWidth;
      H = mount.offsetHeight;
      renderer.setSize(W, H, false);
      updateCamera();
      CW = getCardW();
      CH = getCardH();
      meshes.forEach(m => {
        m.material.uniforms.uPlaneSize.value.set(CW, CH);
        // Keep viewport uniform in sync
        m.material.uniforms.uViewport.value.set(W / 2, H / 2);
      });
    };
    window.addEventListener("resize", onResize);

    const tick = () => {
      raf = requestAnimationFrame(tick);

      const targetIdx = stateRef.current.activeIndex;

      floatIdx = lerp(floatIdx, targetIdx, 0.10);

      const delta = floatIdx - prevFloat;
      vel.y = lerp(vel.y, delta * 55, 0.14);
      vel.x = lerp(vel.x, 0, 0.12);
      prevFloat = floatIdx;

      const centreInt = Math.round(floatIdx);
      const drift     = floatIdx - centreInt;

      const cx = getStripCX(CW);

      for (let i = 0; i < VISIBLE; i++) {
        const offset  = i - HALF;
        const itemIdx = ((centreInt + offset) % items.length + items.length) % items.length;
        const posY    = (-offset + drift) * (CH + GAP);
        const dist    = Math.abs(offset - drift);
        const scale   = Math.max(0.76, 1.0 - dist * 0.06);
        const opacity = Math.max(0, 1.0 - dist * 0.22) * anim.alpha;

        const wantTex = textures[itemIdx % textures.length];
        if (meshes[i].material.uniforms.uTexture.value !== wantTex) {
          meshes[i].material.uniforms.uTexture.value = wantTex;
        }
        syncImageSize(meshes[i]);

        const sw = CW * scale;
        const sh = CH * scale;

        meshes[i].position.set(cx, posY, i);
        meshes[i].scale.set(sw, sh, 1);
        meshes[i].rotation.z = 0;
        meshes[i].material.uniforms.uVelocity.value.set(vel.x, vel.y * 0.28);
        meshes[i].material.uniforms.uAlpha.value   = opacity;
        meshes[i].material.uniforms.uZoom.value    = 1.06 - clamp(1.0 - dist, 0, 1) * 0.06;
        meshes[i].material.uniforms.uPlaneSize.value.set(sw, sh);
        // uViewport and uCurvature are static — no need to update per-frame
      }

      renderer.render(scene, camera);
    };

    tick();

    glRef.current = { setActive: (i) => { stateRef.current.activeIndex = i; }, show, hide };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(anim);
      geo.dispose();
      meshes.forEach(m => m.material.dispose());
      textures.forEach(t => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      glRef.current = null;
    };
  }, []);

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const onEnter = useCallback((index) => {
    stateRef.current.hovering    = true;
    stateRef.current.activeIndex = index;
    setHighlightedIndex(index);
    glRef.current?.setActive(index);
    glRef.current?.show();
  }, []);

  const onLeave = useCallback(() => {
    stateRef.current.hovering = false;
    setHighlightedIndex(null);
    glRef.current?.hide();
  }, []);

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <section
      ref={mountRef}
      onPointerLeave={onLeave}
      className="relative isolate min-h-screen overflow-hidden bg-[#f0ede6] px-8 py-9 text-[#1e1c18] md:px-10"
      style={{ cursor: "crosshair" }}
    >

      {/* Header */}
      <header
        className="relative z-10 flex items-start justify-between text-[11px]"
        style={{ color: "rgba(30,28,24,0.35)" }}
      >
        <div>1470px × 797px</div>
        <nav className="absolute left-1/2 top-0 flex -translate-x-1/2 gap-3">
          <span>Featured Works,</span>
          <span>Archive</span>
          <span>About</span>
        </nav>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-[#e63000]" />
          <span>Available June 2026</span>
        </div>
      </header>

      {/* List */}
      <div className="relative z-10 mt-16 max-w-[820px] md:mt-[9vh]">

        {/* Column headers */}
        <div
          className="grid gap-5 pb-4 text-[10px] uppercase tracking-widest"
          style={{
            gridTemplateColumns: "72px minmax(140px,1fr) minmax(180px,1.1fr) 64px",
            color: "rgba(30,28,24,0.28)",
            borderBottom: "1px solid rgba(30,28,24,0.10)",
          }}
        >
          <div>ID</div>
          <div>Title</div>
          <div>Focus</div>
          <div>Year</div>
        </div>

        {/* Rows */}
        {items.map((item, index) => {
          const active = highlightedIndex === index;
          return (
            <div
              key={item.id}
              onPointerEnter={() => onEnter(index)}
              style={{
                display: "grid",
                gridTemplateColumns: "72px minmax(140px,1fr) minmax(180px,1.1fr) 64px",
                gap: "20px",
                padding: "7px 0",
                borderBottom: "1px solid rgba(30,28,24,0.06)",
                cursor: "crosshair",
                transition: "color 0.15s",
                color: active ? "#e63000" : "rgba(30,28,24,0.16)",
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: "0.03em" }}>{item.id}</div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{item.title}</div>
              <div style={{ fontSize: 11 }}>{item.focus}</div>
              <div style={{ fontSize: 11 }}>{item.year}</div>
            </div>
          );
        })}
      </div>

      {/* Ambient copy */}
      <p
        className="pointer-events-none absolute right-[10vw] top-[22vh] z-10 max-w-[320px] text-center text-[12px] leading-relaxed"
        style={{ color: "rgba(30,28,24,0.11)" }}
      >
        A curated collection of work — from collaborations and experiments to
        personal projects, capturing finished pieces and ideas in motion.
      </p>
    </section>
  );
}