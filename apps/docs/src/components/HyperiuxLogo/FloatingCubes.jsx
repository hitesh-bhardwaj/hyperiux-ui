"use client";

import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CubeVisual } from "./CubeVisual";

function FloatingCube({
  data,
  texture,
  faceColor = "#1a1a1a",
  outlineColor = "#ffffff",
  speedFactorRef,
}) {
  const ref = useRef(null);

  useFrame((_, delta) => {
    if (!ref.current) return;

    const d = data.current;
    d.progress += delta * d.speed * speedFactorRef.current;

    if (d.progress > 1) {
      d.progress = 0;
      d.x = THREE.MathUtils.randFloat(d.xMin, d.xMax);
      d.z = THREE.MathUtils.randFloat(d.zMin, d.zMax);
      d.scale = THREE.MathUtils.randFloat(d.scaleMin, d.scaleMax);
      d.yRot = THREE.MathUtils.randFloat(-Math.PI, Math.PI);
      d.zRot = THREE.MathUtils.randFloat(-Math.PI, Math.PI);
      d.yRotSpeed = THREE.MathUtils.randFloat(-d.rotSpeedMax, d.rotSpeedMax);
      d.zRotSpeed = THREE.MathUtils.randFloat(-d.rotSpeedMax, d.rotSpeedMax);
    }

    ref.current.position.set(
      d.x,
      THREE.MathUtils.lerp(d.yStart, d.yEnd, d.progress),
      d.z
    );

    ref.current.rotation.y += d.yRotSpeed * delta * speedFactorRef.current;
    ref.current.rotation.z += d.zRotSpeed * delta * speedFactorRef.current;
    ref.current.scale.setScalar(d.scale);
  });

  return (
    <group
      ref={ref}
      position={[data.current.x, data.current.yStart, data.current.z]}
      rotation={[0, data.current.yRot, data.current.zRot]}
      scale={data.current.scale}
    >
      <CubeVisual
        texture={texture}
        faceColor={faceColor}
        outlineColor={outlineColor}
      />
    </group>
  );
}

export function FloatingCubes({
  texture,
  count = 40,
  faceColor = "#1a1a1a",
  outlineColor = "#ffffff",
  yStartOffset = 2,
  yEndOffset = 2,
  zMin = -6,
  zMax = 2.5,
  scaleMin = 0.08,
  scaleMax = 0.28,
  speedMin = 0.08,
  speedMax = 0.22,
  rotationSpeedMax = 1.2,
  xSpreadMultiplier = 1.15,
  pauseTarget = 1,
}) {
  const { viewport } = useThree();
  const speedFactorRef = useRef(1);

  const cubes = useMemo(() => {
    const xMin = -viewport.width * xSpreadMultiplier * 0.5;
    const xMax = viewport.width * xSpreadMultiplier * 0.5;
    const yStart = -viewport.height  - yStartOffset;
    const yEnd = viewport.height  + yEndOffset;

    return Array.from({ length: count }, () => ({
      current: {
        progress: Math.random(),
        x: THREE.MathUtils.randFloat(xMin, xMax),
        xMin,
        xMax,
        yStart,
        yEnd,
        z: THREE.MathUtils.randFloat(zMin, zMax),
        zMin,
        zMax,
        scale: THREE.MathUtils.randFloat(scaleMin, scaleMax),
        scaleMin,
        scaleMax,
        speed: THREE.MathUtils.randFloat(speedMin, speedMax),
        yRot: THREE.MathUtils.randFloat(-Math.PI, Math.PI),
        zRot: THREE.MathUtils.randFloat(-Math.PI, Math.PI),
        yRotSpeed: THREE.MathUtils.randFloat(
          -rotationSpeedMax,
          rotationSpeedMax
        ),
        zRotSpeed: THREE.MathUtils.randFloat(
          -rotationSpeedMax,
          rotationSpeedMax
        ),
        rotSpeedMax: rotationSpeedMax,
      },
    }));
  }, [
    count,
    viewport.width,
    viewport.height,
    yStartOffset,
    yEndOffset,
    zMin,
    zMax,
    scaleMin,
    scaleMax,
    speedMin,
    speedMax,
    rotationSpeedMax,
    xSpreadMultiplier,
  ]);

  useFrame(() => {
    speedFactorRef.current = THREE.MathUtils.lerp(
      speedFactorRef.current,
      pauseTarget,
      0.06
    );
  });

  return (
    <group>
      {cubes.map((cube, i) => (
        <FloatingCube
          key={i}
          data={cube}
          texture={texture}
          faceColor={faceColor}
          outlineColor={outlineColor}
          speedFactorRef={speedFactorRef}
        />
      ))}
    </group>
  );
}