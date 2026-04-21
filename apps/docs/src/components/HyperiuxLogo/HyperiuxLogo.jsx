"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { CubeParticlesModel } from "./CubeParticlesModel";

const PHASE_IDLE = "idle";
const PHASE_HOLDING = "holding";
const PHASE_EXPLOADING = "exploding";
const PHASE_EXPLODED = "exploded";
const PHASE_REFORMING = "reforming";

const HyperiuxLogo = () => {
  const [actionPhase, setActionPhase] = useState(PHASE_IDLE);
  const [burstKey, setBurstKey] = useState(0);

  const lockRef = useRef(false);
  const releaseTriggeredRef = useRef(false);
  const activePointerIdRef = useRef(null);
  const timersRef = useRef([]);

  const explosionDuration = 0.95;
  const explodedHoldDuration = 0.8;
  const reformDuration = 0.9;

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const resetCycle = () => {
    clearTimers();
    lockRef.current = false;
    releaseTriggeredRef.current = false;
    activePointerIdRef.current = null;
    setActionPhase(PHASE_IDLE);
  };

  const startHold = (e) => {
    if (lockRef.current) return;
    if (actionPhase !== PHASE_IDLE) return;

    clearTimers();
    lockRef.current = true;
    releaseTriggeredRef.current = false;
    activePointerIdRef.current = e.pointerId ?? null;
    setActionPhase(PHASE_HOLDING);
  };

  const releaseHold = (e) => {
    if (actionPhase !== PHASE_HOLDING) return;
    if (releaseTriggeredRef.current) return;

    if (
      activePointerIdRef.current !== null &&
      e?.pointerId !== undefined &&
      e.pointerId !== activePointerIdRef.current
    ) {
      return;
    }

    releaseTriggeredRef.current = true;
    setBurstKey((v) => v + 1);
    setActionPhase(PHASE_EXPLOADING);

    timersRef.current.push(
      setTimeout(() => {
        setActionPhase(PHASE_EXPLODED);
      }, explosionDuration * 1000)
    );

    timersRef.current.push(
      setTimeout(() => {
        setActionPhase(PHASE_REFORMING);
      }, (explosionDuration + explodedHoldDuration) * 1000)
    );

    timersRef.current.push(
      setTimeout(() => {
        resetCycle();
      }, (explosionDuration + explodedHoldDuration + reformDuration) * 1000)
    );
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div
      className="w-full h-screen bg-[#111111] touch-none"
      onPointerDown={startHold}
      onPointerUp={releaseHold}
      onPointerCancel={releaseHold}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <CubeParticlesModel
            modelPath="/assets/models/hyperiux-new-model.glb"
            texturePath="/assets/models/new-logo-texture.png"
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={0.32}
            particleCount={1000}
            cubeSize={0.35}
            cubeScaleVariation={0.08}
            modelOpacity={0.01}
            outlineColor="#ffffff"
            faceColor="#1a1a1a"
            frontVector={[0, 0, 1]}
            frontBiasPower={3.4}
            backFill={0.015}
            edgeBoost={1.2}
            edgeOutwardBias={0.12}
            edgeJitter={0.06}
            gridSnapFactor={0.94}
            surfaceJitter={0.1}
            interactionRadius={4.5}
            maxShrink={1.5}
            minScaleMultiplier={0.1}
            scaleLerp={0.14}
            parallaxPositionStrength={0.06}
            parallaxRotationStrength={0.2}
            floatingCubeCount={42}
            floatingYStartOffset={2}
            floatingYEndOffset={2}
            floatingZMin={-6}
            floatingZMax={2.5}
            floatingScaleMin={0.08}
            floatingScaleMax={0.28}
            floatingSpeedMin={0.08}
            floatingSpeedMax={0.2}
            floatingRotationSpeedMax={1.1}
            floatingXSpreadMultiplier={1.25}
            actionPhase={actionPhase}
            burstKey={burstKey}
            explosionDuration={explosionDuration}
            explodedHoldDuration={explodedHoldDuration}
            reformDuration={reformDuration}
            holdShakeAmount={0.08}
            holdShakeSpeed={22}
            explosionSpreadX={42}
            explosionSpreadY={28}
            explosionForwardMin={6}
            explosionForwardMax={14}
            explosionRotateMax={5.5}
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default HyperiuxLogo;