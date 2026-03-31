"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// FBO Helper - Fullscreen quad rendering utility
// ============================================================================
class FBOHelper {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.quad = new THREE.Mesh(geometry);
    this.scene.add(this.quad);
  }

  render(renderer, material, renderTarget) {
    const oldTarget = renderer.getRenderTarget();
    this.quad.material = material;
    renderer.setRenderTarget(renderTarget || null);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(oldTarget);
  }

  copy(renderer, source, destination) {
    const copyMaterial = new THREE.ShaderMaterial({
      uniforms: { tSource: { value: source.texture } },
      vertexShader: `
        varying vec2 v_uv;
        void main() {
          v_uv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tSource;
        varying vec2 v_uv;
        void main() {
          gl_FragColor = texture2D(tSource, v_uv);
        }
      `,
    });
    this.render(renderer, copyMaterial, destination);
    copyMaterial.dispose();
  }

  dispose() {
    this.quad.geometry.dispose();
    if (this.quad.material) {
      this.quad.material.dispose();
    }
  }
}

// ============================================================================
// Blur Utility - Multi-pass gaussian blur
// ============================================================================
class BlurUtil {
  constructor() {
    this.material = null;
  }

  getMaterial() {
    if (!this.material) {
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          u_texture: { value: null },
          u_delta: { value: new THREE.Vector2(0, 0) },
        },
        vertexShader: `
          uniform vec2 u_delta;
          varying vec2 v_uv[9];
          void main() {
            vec2 uv = position.xy * 0.5 + 0.5;
            v_uv[0] = uv;
            vec2 delta = u_delta;
            v_uv[1] = uv - delta;
            v_uv[2] = uv + delta;
            delta += u_delta;
            v_uv[3] = uv - delta;
            v_uv[4] = uv + delta;
            delta += u_delta;
            v_uv[5] = uv - delta;
            v_uv[6] = uv + delta;
            delta += u_delta;
            v_uv[7] = uv - delta;
            v_uv[8] = uv + delta;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D u_texture;
          varying vec2 v_uv[9];
          void main() {
            vec4 color = texture2D(u_texture, v_uv[0]) * 0.1633;
            color += texture2D(u_texture, v_uv[1]) * 0.1531;
            color += texture2D(u_texture, v_uv[2]) * 0.1531;
            color += texture2D(u_texture, v_uv[3]) * 0.12245;
            color += texture2D(u_texture, v_uv[4]) * 0.12245;
            color += texture2D(u_texture, v_uv[5]) * 0.0918;
            color += texture2D(u_texture, v_uv[6]) * 0.0918;
            color += texture2D(u_texture, v_uv[7]) * 0.051;
            color += texture2D(u_texture, v_uv[8]) * 0.051;
            gl_FragColor = color;
          }
        `,
      });
    }
    return this.material;
  }

  blur(renderer, fboHelper, iterations, strength, inputTarget, outputTarget) {
    const material = this.getMaterial();
    let tempTarget = null;

    if (!outputTarget || outputTarget === inputTarget) {
      tempTarget = new THREE.WebGLRenderTarget(inputTarget.width, inputTarget.height, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      });
    }

    let currentInput = inputTarget;
    let currentOutput = outputTarget || tempTarget;

    for (let i = 0; i < iterations; i++) {
      const targetWidth = currentInput.width;
      const targetHeight = currentInput.height;

      // Horizontal blur
      material.uniforms.u_texture.value = currentInput.texture;
      material.uniforms.u_delta.value.set(strength / targetWidth, 0);
      fboHelper.render(renderer, material, currentOutput);

      // Vertical blur
      const intermediateResult = currentOutput;
      currentOutput = currentInput;

      material.uniforms.u_texture.value = intermediateResult.texture;
      material.uniforms.u_delta.value.set(0, strength / targetHeight);
      fboHelper.render(renderer, material, currentOutput);

      currentInput = currentOutput;
      currentOutput = intermediateResult;
    }

    if (tempTarget) {
      if (currentInput !== inputTarget) {
        fboHelper.copy(renderer, currentInput, inputTarget);
      }
      tempTarget.dispose();
    }
  }

  dispose() {
    this.material?.dispose();
    this.material = null;
  }
}

// ============================================================================
// Enhanced Screen Paint - Velocity field simulation
// ============================================================================
class EnhancedScreenPaint {
  constructor(config = {}) {
    this.enabled = config.enabled ?? true;
    this.minRadius = config.minRadius ?? 0;
    this.maxRadius = config.maxRadius ?? 100;
    this.radiusDistanceRange = config.radiusDistanceRange ?? 100;
    this.pushStrength = config.pushStrength ?? 22;
    this.accelerationDissipation = config.accelerationDissipation ?? 0.8;
    this.velocityDissipation = config.velocityDissipation ?? 0.975;
    this.weight1Dissipation = config.weight1Dissipation ?? 0.95;
    this.weight2Dissipation = config.weight2Dissipation ?? 0.8;

    this._lowRenderTarget = null;
    this._lowBlurRenderTarget = null;
    this._prevPaintRenderTarget = null;
    this._currPaintRenderTarget = null;
    this._material = null;
    this._fromDrawData = new THREE.Vector4(0, 0, 0, 0);
    this._toDrawData = new THREE.Vector4(0, 0, 0, 0);
    this._lastMousePosition = new THREE.Vector2();
    this._idleTime = 0;

    this.fboHelper = new FBOHelper();
    this.blurUtil = new BlurUtil();
  }

  init(renderer) {
    this._lowRenderTarget = this.createRenderTarget(1, 1);
    this._lowBlurRenderTarget = this.createRenderTarget(1, 1);
    this._prevPaintRenderTarget = this.createRenderTarget(1, 1);
    this._currPaintRenderTarget = this.createRenderTarget(1, 1);
    this._material = this.createPaintMaterial();
  }

  createRenderTarget(width, height) {
    return new THREE.WebGLRenderTarget(width, height, {
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
      stencilBuffer: false,
    });
  }

  createPaintMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_lowPaintTexture: { value: this._lowRenderTarget?.texture || null },
        u_prevPaintTexture: { value: null },
        u_paintTexelSize: { value: new THREE.Vector2() },
        u_drawFrom: { value: this._fromDrawData },
        u_drawTo: { value: this._toDrawData },
        u_pushStrength: { value: 0 },
        u_vel: { value: new THREE.Vector2() },
        u_dissipations: { value: new THREE.Vector3() },
        u_scrollOffset: { value: new THREE.Vector2() },
      },
      vertexShader: `
        varying vec2 v_uv;
        void main() {
          v_uv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D u_lowPaintTexture;
        uniform sampler2D u_prevPaintTexture;
        uniform vec2 u_paintTexelSize;
        uniform vec2 u_scrollOffset;
        uniform vec4 u_drawFrom;
        uniform vec4 u_drawTo;
        uniform float u_pushStrength;
        uniform vec3 u_dissipations;
        uniform vec2 u_vel;

        varying vec2 v_uv;

        vec2 sdSegment(in vec2 p, in vec2 a, in vec2 b) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return vec2(length(pa - ba * h), h);
        }

        void main() {
          vec2 res = sdSegment(gl_FragCoord.xy, u_drawFrom.xy, u_drawTo.xy);
          vec2 radiusWeight = mix(u_drawFrom.zw, u_drawTo.zw, res.y);
          float d = 1.0 - smoothstep(-0.01, radiusWeight.x, res.x);

          vec4 lowData = texture2D(u_lowPaintTexture, v_uv - u_scrollOffset);
          vec2 velInv = (0.5 - lowData.xy) * u_pushStrength;

          vec4 data = texture2D(u_prevPaintTexture, v_uv - u_scrollOffset + velInv * u_paintTexelSize);
          data.xy -= 0.5;

          vec4 delta = (u_dissipations.xxyz - 1.0) * data;
          vec2 newVel = u_vel * d;
          delta += vec4(newVel, radiusWeight.yy * d);
          delta.zw = sign(delta.zw) * max(vec2(0.004), abs(delta.zw));

          data += delta;
          data.xy += 0.5;

          gl_FragColor = clamp(data, vec4(0.0), vec4(1.0));
        }
      `,
    });
  }

  resize(width, height, renderer) {
    const paintWidth = width >> 2;
    const paintHeight = height >> 2;
    const lowWidth = width >> 3;
    const lowHeight = height >> 3;

    if (paintWidth !== this._currPaintRenderTarget?.width ||
        paintHeight !== this._currPaintRenderTarget?.height) {
      this._currPaintRenderTarget?.setSize(paintWidth, paintHeight);
      this._prevPaintRenderTarget?.setSize(paintWidth, paintHeight);
      this._lowRenderTarget?.setSize(lowWidth, lowHeight);
      this._lowBlurRenderTarget?.setSize(lowWidth, lowHeight);

      if (this._material) {
        this._material.uniforms.u_paintTexelSize.value.set(1 / paintWidth, 1 / paintHeight);
      }

      this.clear(renderer);
    }
  }

  clear(renderer) {
    if (!this._lowRenderTarget) return;

    const oldTarget = renderer.getRenderTarget();
    renderer.setClearColor(0x808000, 0);

    [this._lowRenderTarget, this._lowBlurRenderTarget,
     this._currPaintRenderTarget, this._prevPaintRenderTarget].forEach(target => {
      if (target) {
        renderer.setRenderTarget(target);
        renderer.clear();
      }
    });

    renderer.setRenderTarget(oldTarget);

    if (this._material) {
      this._material.uniforms.u_vel.value.set(0, 0);
    }
  }

  update(renderer, deltaTime, mousePixel, prevMousePixel, windowWidth, windowHeight) {
    if (!this.enabled || !this._material || !this._currPaintRenderTarget) return;

    const mouseDistance = mousePixel.distanceTo(this._lastMousePosition);
    const hasMouseMoved = mouseDistance > 1.0;

    if (hasMouseMoved) {
      this._idleTime = 0;
      this._lastMousePosition.copy(mousePixel);
    } else {
      this._idleTime += deltaTime;
    }

    // Swap render targets
    const tempTarget = this._prevPaintRenderTarget;
    this._prevPaintRenderTarget = this._currPaintRenderTarget;
    this._currPaintRenderTarget = tempTarget;

    // Calculate brush radius
    const mouseDeltaDistance = mousePixel.distanceTo(prevMousePixel);
    let radius = this.minRadius + (this.maxRadius - this.minRadius) *
                 Math.min(mouseDeltaDistance / this.radiusDistanceRange, 1.0);

    const renderTargetHeight = this._currPaintRenderTarget.height;
    radius = (radius / windowHeight) * renderTargetHeight;

    // Apply idle dissipation
    let velocityDissipation = this.velocityDissipation;
    let weight1Dissipation = this.weight1Dissipation;
    let weight2Dissipation = this.weight2Dissipation;

    if (this._idleTime > 0.1) {
      const idleFactor = Math.min((this._idleTime - 0.1) * 2, 1.0);
      velocityDissipation = Math.min(velocityDissipation + idleFactor * 0.1, 0.99);
      weight1Dissipation = Math.min(weight1Dissipation + idleFactor * 0.15, 0.99);
      weight2Dissipation = Math.min(weight2Dissipation + idleFactor * 0.2, 0.99);
    }

    // Update material uniforms
    this._material.uniforms.u_pushStrength.value = this.pushStrength;
    this._material.uniforms.u_dissipations.value.set(
      velocityDissipation,
      weight1Dissipation,
      weight2Dissipation
    );
    this._material.uniforms.u_prevPaintTexture.value = this._prevPaintRenderTarget.texture;
    this._material.uniforms.u_lowPaintTexture.value = this._lowBlurRenderTarget?.texture || this._lowRenderTarget?.texture;

    // Update drawing data
    this._fromDrawData.copy(this._toDrawData);

    const targetWidth = this._currPaintRenderTarget.width;
    const targetHeight = this._currPaintRenderTarget.height;

    this._toDrawData.set(
      (mousePixel.x / windowWidth) * targetWidth,
      (1.0 - mousePixel.y / windowHeight) * targetHeight,
      radius,
      1.0
    );

    // Calculate velocity
    const velocity = new THREE.Vector2(
      this._toDrawData.x - this._fromDrawData.x,
      this._toDrawData.y - this._fromDrawData.y
    ).multiplyScalar(deltaTime * 0.8);

    this._material.uniforms.u_vel.value
      .multiplyScalar(this.accelerationDissipation)
      .add(velocity);

    // Render paint pass
    this.fboHelper.render(renderer, this._material, this._currPaintRenderTarget);

    // Copy to low res and blur
    if (this._lowRenderTarget) {
      this.fboHelper.copy(renderer, this._currPaintRenderTarget, this._lowRenderTarget);

      if (this._lowBlurRenderTarget) {
        this.blurUtil.blur(renderer, this.fboHelper, 8, 1, this._lowRenderTarget, this._lowBlurRenderTarget);
      }
    }
  }

  get currPaintTexture() {
    return this._currPaintRenderTarget?.texture || null;
  }

  dispose() {
    this._lowRenderTarget?.dispose();
    this._lowBlurRenderTarget?.dispose();
    this._prevPaintRenderTarget?.dispose();
    this._currPaintRenderTarget?.dispose();
    this._material?.dispose();
    this.fboHelper.dispose();
    this.blurUtil.dispose();
  }
}

// ============================================================================
// Glass Distortion Plane - The visual output component
// ============================================================================
function GlassDistortionPlane({
  rgbShift = 0.5,
  multiplier = 5,
  colorMultiplier = 10,
  shade = 1.0,
  minRadius = 0,
  maxRadius = 100,
  radiusDistanceRange = 100,
  pushStrength = 22,
  velocityDissipation = 0.975,
}) {
  const { gl, size } = useThree();
  const meshRef = useRef();
  const materialRef = useRef();
  const screenPaint = useRef(null);
  const currentMousePos = useRef(new THREE.Vector2(0, 0));
  const prevMousePos = useRef(new THREE.Vector2(0, 0));
  const hasMoved = useRef(false);
  const lastMovementTime = useRef(0);
  const splatStack = useRef([]);

  // Initialize screen paint
  useEffect(() => {
    if (!screenPaint.current) {
      screenPaint.current = new EnhancedScreenPaint({
        minRadius,
        maxRadius,
        radiusDistanceRange,
        pushStrength,
        velocityDissipation,
      });
      screenPaint.current.init(gl);
    }
  }, [gl, minRadius, maxRadius, radiusDistanceRange, pushStrength, velocityDissipation]);

  // Handle resize
  useEffect(() => {
    if (screenPaint.current) {
      screenPaint.current.resize(size.width, size.height, gl);
    }
  }, [size.width, size.height, gl]);

  // Pointer tracking
  useEffect(() => {
    const onPointerMove = (event) => {
      const deltaX = event.clientX - (prevMousePos.current.x * size.width);
      const deltaY = event.clientY - (prevMousePos.current.y * size.height);

      if (!hasMoved.current) {
        hasMoved.current = true;
        prevMousePos.current.set(event.clientX / size.width, event.clientY / size.height);
        return;
      }

      splatStack.current.push({
        mouseX: event.clientX / size.width,
        mouseY: 1.0 - event.clientY / size.height,
        velocityX: deltaX * 30,
        velocityY: -deltaY * 30,
      });

      prevMousePos.current.set(event.clientX / size.width, event.clientY / size.height);
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [size.width, size.height]);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D u_motionTexture;
        uniform float u_rgbShift;
        uniform float u_multiplier;
        uniform float u_colorMultiplier;
        uniform float u_shade;

        varying vec2 vUv;

        void main() {
          // Sample motion texture
          vec4 data = texture2D(u_motionTexture, vUv);
          float weight = (data.z + data.w) * 0.5;
          vec2 vel = (0.5 - data.xy - 0.001) * 2.0 * weight;

          // Discard outside blob
          if (weight < 0.003) {
            discard;
          }

          float velocityMagnitude = length(vel);

          // Pure white base - key for translucent look
          vec3 baseColor = vec3(1.0);

          // RGB chromatic aberration using sin waves with phase offsets (Enigma style)
          // This creates mathematical color separation, not texture sampling
          vec3 rgbShift = sin(
            vec3(vel.x + vel.y) * 40.0 +      // High frequency based on velocity
            vec3(0.0, 2.0, 4.0) * u_rgbShift   // Phase offset: R=0, G=2, B=4
          ) * smoothstep(0.4, -0.9, weight)    // Stronger at edges
            * u_shade
            * max(abs(vel.x), abs(vel.y))      // Scale by velocity
            * u_colorMultiplier * 30.0;         // High multiplier for visibility

          // Prismatic rainbow colors based on velocity direction
          float hue = (vel.x + vel.y) * 20.0 + velocityMagnitude * 15.0;
          vec3 prismColor = vec3(
            0.3 + 0.7 * sin(hue) * 1.8,           // Red channel
            0.3 + 0.7 * sin(hue + 2.094) * 0.01,  // Green (low for peach/coral tones)
            0.3 + 0.7 * sin(hue + 4.188) * 0.1    // Blue channel
          );

          // Directional color variation
          vec3 directionalColor = vec3(
            0.2 + 0.8 * sin(vel.x * 25.0) * 1.2,
            0.2 + 0.8 * cos(vel.y * 20.0) * 0.5,
            0.2 + 0.8 * sin((vel.x + vel.y) * 2.0)
          );

          // Combine colors additively on white base
          vec3 glassColor = baseColor;
          glassColor += rgbShift;
          glassColor = mix(glassColor, prismColor, weight * velocityMagnitude * 0.8);
          glassColor = mix(glassColor, directionalColor, weight * 0.6);

          // Alpha: very low for translucent glass effect (max 10%)
          float alpha = weight * (velocityMagnitude * u_multiplier * 0.15 + 1.0);
          alpha = clamp(alpha, 0.0, 0.1);

          gl_FragColor = vec4(glassColor, alpha);
        }
      `,
      uniforms: {
        u_motionTexture: { value: null },
        u_rgbShift: { value: rgbShift },
        u_multiplier: { value: multiplier },
        u_colorMultiplier: { value: colorMultiplier },
        u_shade: { value: shade },
      },
      transparent: true,
      blending: THREE.NormalBlending,
    });
  }, [rgbShift, multiplier, colorMultiplier, shade]);

  // Animation loop
  useFrame((_, deltaTime) => {
    if (!screenPaint.current || !materialRef.current) return;

    const currentTime = performance.now();
    const hasNewMovement = splatStack.current.length > 0;

    let mousePixelPos = currentMousePos.current;

    if (hasNewMovement) {
      hasMoved.current = true;
      lastMovementTime.current = currentTime;

      const latestSplat = splatStack.current[splatStack.current.length - 1];
      mousePixelPos = new THREE.Vector2(
        latestSplat.mouseX * size.width,
        (1.0 - latestSplat.mouseY) * size.height
      );
      prevMousePos.current.copy(currentMousePos.current);
      currentMousePos.current.copy(mousePixelPos);
    }

    screenPaint.current.update(
      gl,
      deltaTime,
      hasNewMovement ? mousePixelPos : currentMousePos.current,
      hasNewMovement ? prevMousePos.current : currentMousePos.current,
      size.width,
      size.height
    );

    // Update shader uniforms
    const uniforms = materialRef.current.uniforms;
    uniforms.u_motionTexture.value = screenPaint.current.currPaintTexture;
    uniforms.u_rgbShift.value = rgbShift;
    uniforms.u_multiplier.value = multiplier;
    uniforms.u_colorMultiplier.value = colorMultiplier;
    uniforms.u_shade.value = shade;

    if (hasNewMovement) {
      splatStack.current.length = 0;
    }
  });

  // Cleanup
  useEffect(() => {
    return () => {
      screenPaint.current?.dispose();
      materialRef.current?.dispose();
    };
  }, []);

  // Calculate plane size to fill screen
  const distance = 1;
  const fov = (75 * Math.PI) / 180;
  const height = 2 * Math.tan(fov / 2) * distance;
  const width = height * (size.width / size.height);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[width, height, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}

// ============================================================================
// Main Export Component
// ============================================================================
export function LiquidCursor({
  className = "",
  rgbShift = 0.5,
  multiplier = 5,
  colorMultiplier = 10,
  shade = 1.0,
  minRadius = 0,
  maxRadius = 100,
  radiusDistanceRange = 100,
  pushStrength = 22,
  velocityDissipation = 0.975,
}) {
  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none ${className}`}
    >
      <Canvas
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
      >
        <GlassDistortionPlane
          rgbShift={rgbShift}
          multiplier={multiplier}
          colorMultiplier={colorMultiplier}
          shade={shade}
          minRadius={minRadius}
          maxRadius={maxRadius}
          radiusDistanceRange={radiusDistanceRange}
          pushStrength={pushStrength}
          velocityDissipation={velocityDissipation}
        />
      </Canvas>
    </div>
  );
}
