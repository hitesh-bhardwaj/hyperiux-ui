"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CubeVisual } from "./CubeVisual";

function easeOutPower3(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutPower2(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function ParticleCube({
  data,
  texture,
  registerRef,
  faceColor = "#1a1a1a",
  outlineColor = "#ffffff",
}) {
  return (
    <group
      ref={registerRef}
      position={data.position}
      quaternion={data.quaternion}
      scale={data.scale}
    >
      <CubeVisual
        texture={texture}
        faceColor={faceColor}
        outlineColor={outlineColor}
      />
    </group>
  );
}

export function InteractiveParticles({
  particles,
  texture,
  interactionGroupRef,
  interactionRadius = 1.1,
  maxShrink = 0.7,
  minScaleMultiplier = 0.2,
  scaleLerp = 0.12,
  parallaxPositionStrength = 0.12,
  parallaxRotationStrength = 0.12,
  outlineColor = "#ffffff",
  faceColor = "#1a1a1a",

  actionPhase = "idle",
  burstKey = 0,
  explosionDuration = 0.7,
  explodedHoldDuration = 0.5,
  reformDuration = 0.8,
  holdShakeAmount = 0.08,
  holdShakeSpeed = 22,
  explosionSpreadX = 18,
  explosionSpreadY = 12,
  explosionForwardMin = 2.5,
  explosionForwardMax = 7,
  explosionRotateMax = 3.2,
}) {
  const particleRefs = useRef([]);
  const hoveredRef = useRef(false);
  const { camera, pointer, viewport, clock } = useThree();

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(), []);
  const worldPoint = useMemo(() => new THREE.Vector3(), []);
  const localPoint = useMemo(() => new THREE.Vector3(), []);
  const groupWorldPos = useMemo(() => new THREE.Vector3(), []);
  const planeNormal = useMemo(() => new THREE.Vector3(), []);

  const basePositionRef = useRef(new THREE.Vector3());
  const baseQuatRef = useRef(new THREE.Quaternion());
  const targetEuler = useMemo(() => new THREE.Euler(), []);
  const targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const initializedRef = useRef(false);

  const phaseStartRef = useRef(0);
  const explosionDataRef = useRef([]);

  const registerRef = useCallback((index) => {
    return (node) => {
      particleRefs.current[index] = node;
    };
  }, []);

  useEffect(() => {
    phaseStartRef.current = performance.now() / 1000;
  }, [actionPhase]);

  useEffect(() => {
    const width = viewport.width * 2.4 + explosionSpreadX;
    const height = viewport.height * 2.2 + explosionSpreadY;

    explosionDataRef.current = particles.map((base) => {
      const dir = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(width),
        THREE.MathUtils.randFloatSpread(height),
        THREE.MathUtils.randFloat(explosionForwardMin, explosionForwardMax),
      ).normalize();

      const distance = THREE.MathUtils.randFloat(
        Math.max(width, height) * 0.35,
        Math.max(width, height) * 0.85,
      );

      return {
        offset: dir.multiplyScalar(distance),
        rotation: new THREE.Euler(
          THREE.MathUtils.randFloatSpread(explosionRotateMax),
          THREE.MathUtils.randFloatSpread(explosionRotateMax),
          THREE.MathUtils.randFloatSpread(explosionRotateMax),
        ),
        seed: Math.random() * 1000,
      };
    });
  }, [
    burstKey,
    particles,
    viewport.width,
    viewport.height,
    explosionSpreadX,
    explosionSpreadY,
    explosionForwardMin,
    explosionForwardMax,
    explosionRotateMax,
  ]);

  useFrame(() => {
    const group = interactionGroupRef.current;
    if (!group) return;

    if (!initializedRef.current) {
      basePositionRef.current.copy(group.position);
      baseQuatRef.current.copy(group.quaternion);
      initializedRef.current = true;
    }

    const now = performance.now() / 1000;
    const phaseElapsed = now - phaseStartRef.current;

    const allowPointerInteraction =
      actionPhase === "idle" || actionPhase === "holding";

    if (allowPointerInteraction) {
      group.getWorldPosition(groupWorldPos);
      camera.getWorldDirection(planeNormal).normalize();
      plane.setFromNormalAndCoplanarPoint(planeNormal, groupWorldPos);

      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.ray.intersectPlane(plane, worldPoint);

      if (hit) {
        localPoint.copy(worldPoint);
        group.worldToLocal(localPoint);
      }

      const targetPosX =
        basePositionRef.current.x + pointer.x * parallaxPositionStrength;
      const targetPosY =
        basePositionRef.current.y + pointer.y * parallaxPositionStrength;

      group.position.x = THREE.MathUtils.lerp(
        group.position.x,
        targetPosX,
        0.08,
      );
      group.position.y = THREE.MathUtils.lerp(
        group.position.y,
        targetPosY,
        0.08,
      );

      targetEuler.set(
        actionPhase === "holding" ? 0 : -pointer.y * parallaxRotationStrength,
        actionPhase === "holding" ? 0 : pointer.x * parallaxRotationStrength,
        0,
        "XYZ",
      );
      targetQuat
        .copy(baseQuatRef.current)
        .multiply(new THREE.Quaternion().setFromEuler(targetEuler));
      group.quaternion.slerp(targetQuat, 0.08);
    } else {
      group.position.x = THREE.MathUtils.lerp(
        group.position.x,
        basePositionRef.current.x,
        0.08,
      );
      group.position.y = THREE.MathUtils.lerp(
        group.position.y,
        basePositionRef.current.y,
        0.08,
      );
      group.quaternion.slerp(baseQuatRef.current, 0.08);
    }

    for (let i = 0; i < particles.length; i++) {
      const ref = particleRefs.current[i];
      if (!ref) continue;

      const base = particles[i];
      const baseScale = base.scale;
      const explosion = explosionDataRef.current[i];

      let px = base.position.x;
      let py = base.position.y;
      let pz = base.position.z;

      let rx = 0;
      let ry = 0;
      let rz = 0;

      if (actionPhase === "holding") {
        const tt = clock.elapsedTime * holdShakeSpeed + explosion.seed;
        px += Math.sin(tt) * holdShakeAmount;
        py += Math.cos(tt * 1.1) * holdShakeAmount;
        pz += Math.sin(tt * 0.9) * holdShakeAmount * 0.5;
      }

      if (actionPhase === "exploding") {
        const t = Math.min(phaseElapsed / explosionDuration, 1);
        const eased = easeOutPower3(t);

        px = base.position.x + explosion.offset.x * eased;
        py = base.position.y + explosion.offset.y * eased;
        pz = base.position.z + explosion.offset.z * eased;

        rx = explosion.rotation.x * eased;
        ry = explosion.rotation.y * eased;
        rz = explosion.rotation.z * eased;
      }

      if (actionPhase === "exploded") {
        px = base.position.x + explosion.offset.x;
        py = base.position.y + explosion.offset.y;
        pz = base.position.z + explosion.offset.z;

        rx = explosion.rotation.x;
        ry = explosion.rotation.y;
        rz = explosion.rotation.z;
      }

      if (actionPhase === "reforming") {
        const t = Math.min(phaseElapsed / reformDuration, 1);
        const eased = easeInOutPower2(t);
        const inv = 1 - eased;

        px = base.position.x + explosion.offset.x * inv;
        py = base.position.y + explosion.offset.y * inv;
        pz = base.position.z + explosion.offset.z * inv;

        rx = explosion.rotation.x * inv;
        ry = explosion.rotation.y * inv;
        rz = explosion.rotation.z * inv;
      }

      const posFollow =
        actionPhase === "exploding"
          ? 0.28
          : actionPhase === "exploded"
            ? 0.45
            : actionPhase === "reforming"
              ? 0.16
              : 0.14;

      const rotFollow =
        actionPhase === "exploding"
          ? 0.24
          : actionPhase === "exploded"
            ? 0.4
            : actionPhase === "reforming"
              ? 0.14
              : 0.12;

      ref.position.x = THREE.MathUtils.lerp(ref.position.x, px, posFollow);
      ref.position.y = THREE.MathUtils.lerp(ref.position.y, py, posFollow);
      ref.position.z = THREE.MathUtils.lerp(ref.position.z, pz, posFollow);

      ref.rotation.x = THREE.MathUtils.lerp(ref.rotation.x, rx, rotFollow);
      ref.rotation.y = THREE.MathUtils.lerp(ref.rotation.y, ry, rotFollow);
      ref.rotation.z = THREE.MathUtils.lerp(ref.rotation.z, rz, rotFollow);

      let targetMultiplier = 1;

      if (allowPointerInteraction && hoveredRef.current) {
        const dist = base.position.distanceTo(localPoint);

        if (dist < interactionRadius) {
          const t = 1 - dist / interactionRadius;
          const eased = t * t;
          targetMultiplier = 1 - maxShrink * eased;
          targetMultiplier = Math.max(minScaleMultiplier, targetMultiplier);
        }
      }

      ref.scale.x = THREE.MathUtils.lerp(
        ref.scale.x,
        baseScale.x * targetMultiplier,
        scaleLerp,
      );
      ref.scale.y = THREE.MathUtils.lerp(
        ref.scale.y,
        baseScale.y * targetMultiplier,
        scaleLerp,
      );
      ref.scale.z = THREE.MathUtils.lerp(
        ref.scale.z,
        baseScale.z * targetMultiplier,
        scaleLerp,
      );
    }
  });
  return (
    <group
      onPointerEnter={() => {
        if (actionPhase === "idle") hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
    >
      {particles.map((particle, i) => (
        <ParticleCube
          key={i}
          data={particle}
          texture={texture}
          registerRef={registerRef(i)}
          outlineColor={outlineColor}
          faceColor={faceColor}
        />
      ))}
    </group>
  );
}
