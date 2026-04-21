"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Center, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { snapToGrid } from "./utils/snapToGrid";
import { InteractiveParticles } from "./InteractiveParticles";
import { FloatingCubes } from "./FloatingCubes";

export function CubeParticlesModel({
  modelPath = "/assets/models/hyperiux-new-model.glb",
  texturePath = "/assets/models/new-logo-texture.png",

  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,

  particleCount = 1800,
  cubeSize = 0.16,
  cubeScaleVariation = 0.08,

  modelOpacity = 0.015,
  outlineColor = "#ffffff",
  faceColor = "#1a1a1a",

  frontVector = [0, 0, 1],
  frontBiasPower = 3.2,
  backFill = 0.02,

  edgeBoost = 1.0,
  edgeOutwardBias = 0.16,
  edgeJitter = 0.08,

  gridSnapFactor = 0.94,
  surfaceJitter = 0.14,

  interactionRadius = 0.9,
  maxShrink = 0.72,
  minScaleMultiplier = 0.2,
  scaleLerp = 0.12,

  parallaxPositionStrength = 0.08,
  parallaxRotationStrength = 0.12,

  floatingCubeCount = 42,
  floatingYStartOffset = 2,
  floatingYEndOffset = 2,
  floatingZMin = -6,
  floatingZMax = 2.5,
  floatingScaleMin = 0.08,
  floatingScaleMax = 0.28,
  floatingSpeedMin = 0.08,
  floatingSpeedMax = 0.2,
  floatingEasePower = 2.4,
  floatingRotationSpeedMax = 1.1,
  floatingXSpreadMultiplier = 1.25,

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
  const gltf = useGLTF(modelPath);
  const faceTexture = useTexture(texturePath);

  const baseGroupRef = useRef(null);
  const interactionGroupRef = useRef(null);

  useEffect(() => {
    if (!faceTexture.image) return;

    const img = faceTexture.image;
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    ctx.putImageData(imageData, 0, 0);

    const invertedTexture = new THREE.CanvasTexture(canvas);
    invertedTexture.wrapS = THREE.ClampToEdgeWrapping;
    invertedTexture.wrapT = THREE.ClampToEdgeWrapping;
    invertedTexture.colorSpace = THREE.SRGBColorSpace;
    invertedTexture.needsUpdate = true;

    faceTexture.dispose();
    faceTexture.image = invertedTexture.image;
    faceTexture.needsUpdate = true;
  }, [faceTexture]);

  const prepared = useMemo(() => {
    const sceneClone = gltf.scene.clone(true);
    const meshes = [];
    const bbox = new THREE.Box3();

    sceneClone.updateMatrixWorld(true);

    sceneClone.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const mesh = child.clone();
        mesh.geometry = child.geometry.clone();
        mesh.material =
          child.material?.clone?.() || new THREE.MeshStandardMaterial();
        mesh.updateMatrixWorld(true);
        meshes.push(mesh);
        bbox.expandByObject(mesh);
      }
    });

    return { sceneClone, meshes, bbox };
  }, [gltf]);

  const particleData = useMemo(() => {
    const particles = [];
    const occupied = new Set();

    if (!prepared.meshes.length) return particles;

    const tempPosition = new THREE.Vector3();
    const tempNormal = new THREE.Vector3();
    const tempScale = new THREE.Vector3();
    const tempQuaternion = new THREE.Quaternion();
    const tempMatrix = new THREE.Matrix4();
    const tempPos = new THREE.Vector3();
    const tempQuat = new THREE.Quaternion();
    const tempScl = new THREE.Vector3();

    const frontDir = new THREE.Vector3(...frontVector).normalize();
    const grid = cubeSize * gridSnapFactor;

    const bboxCenter = new THREE.Vector3();
    const bboxSize = new THREE.Vector3();
    prepared.bbox.getCenter(bboxCenter);
    prepared.bbox.getSize(bboxSize);

    const halfExtentAlongFront =
      (Math.abs(frontDir.x) * bboxSize.x +
        Math.abs(frontDir.y) * bboxSize.y +
        Math.abs(frontDir.z) * bboxSize.z) *
      0.5;

    const samplers = prepared.meshes.map((mesh) => {
      const sampler = new MeshSurfaceSampler(mesh).build();
      return { sampler, mesh };
    });

    const computeFrontness = (pos) => {
      const centered = pos.clone().sub(bboxCenter);
      const projected = centered.dot(frontDir);
      const normalized =
        halfExtentAlongFront > 0
          ? (projected + halfExtentAlongFront) / (2 * halfExtentAlongFront)
          : 0.5;

      return THREE.MathUtils.clamp(normalized, 0, 1);
    };

    const shouldKeep = (pos, edge = false) => {
      const frontness = computeFrontness(pos);
      let probability =
        backFill + (1 - backFill) * Math.pow(frontness, frontBiasPower);

      if (edge) {
        probability = THREE.MathUtils.clamp(probability * 1.28, 0, 1);
      }

      return Math.random() < probability;
    };

    const addCube = (pos, size) => {
      const snapped = snapToGrid(pos, grid);
      const key = `${snapped.x.toFixed(4)}|${snapped.y.toFixed(
        4,
      )}|${snapped.z.toFixed(4)}`;

      if (occupied.has(key)) return false;
      occupied.add(key);

      tempQuaternion.identity();
      tempScale.set(size, size, size);
      tempMatrix.compose(snapped.clone(), tempQuaternion.clone(), tempScale);
      tempMatrix.decompose(tempPos, tempQuat, tempScl);

      particles.push({
        position: tempPos.clone(),
        quaternion: tempQuat.clone(),
        scale: tempScl.clone(),
      });

      return true;
    };

    let attempts = 0;
    const maxAttempts = particleCount * 12;

    while (particles.length < particleCount && attempts < maxAttempts) {
      const source = samplers[attempts % samplers.length];
      source.sampler.sample(tempPosition, tempNormal);

      const p = tempPosition
        .clone()
        .addScaledVector(
          tempNormal,
          (Math.random() - 0.5) * cubeSize * surfaceJitter,
        );

      if (!shouldKeep(p, false)) {
        attempts++;
        continue;
      }

      const size =
        cubeSize *
        (1 - cubeScaleVariation + Math.random() * cubeScaleVariation);
      addCube(p, size);
      attempts++;
    }

    const edgeTarget = Math.floor(particleCount * edgeBoost);
    let edgeAttempts = 0;
    const maxEdgeAttempts = edgeTarget * 14;

    while (
      edgeAttempts < maxEdgeAttempts &&
      particles.length < particleCount + edgeTarget
    ) {
      const source = samplers[edgeAttempts % samplers.length];
      source.sampler.sample(tempPosition, tempNormal);

      const p = tempPosition
        .clone()
        .addScaledVector(
          tempNormal,
          cubeSize * (edgeOutwardBias + Math.random() * edgeOutwardBias),
        )
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * cubeSize * edgeJitter,
            (Math.random() - 0.5) * cubeSize * edgeJitter,
            (Math.random() - 0.5) * cubeSize * edgeJitter,
          ),
        );

      if (!shouldKeep(p, true)) {
        edgeAttempts++;
        continue;
      }

      const size =
        cubeSize *
        (1 - cubeScaleVariation + Math.random() * cubeScaleVariation);
      addCube(p, size);
      edgeAttempts++;
    }

    return particles;
  }, [
    prepared.meshes,
    prepared.bbox,
    particleCount,
    cubeSize,
    cubeScaleVariation,
    frontVector,
    frontBiasPower,
    backFill,
    edgeBoost,
    edgeOutwardBias,
    edgeJitter,
    gridSnapFactor,
    surfaceJitter,
  ]);

  useEffect(() => {
    prepared.sceneClone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = modelOpacity;
        child.material.depthWrite = false;
      }
    });
  }, [prepared.sceneClone, modelOpacity]);

  return (
    <>
      <FloatingCubes
        texture={faceTexture}
        count={floatingCubeCount}
        faceColor={faceColor}
        outlineColor={outlineColor}
        yStartOffset={floatingYStartOffset}
        yEndOffset={floatingYEndOffset}
        zMin={floatingZMin}
        zMax={floatingZMax}
        scaleMin={floatingScaleMin}
        scaleMax={floatingScaleMax}
        speedMin={floatingSpeedMin}
        speedMax={floatingSpeedMax}
        easePower={floatingEasePower}
        rotationSpeedMax={floatingRotationSpeedMax}
        xSpreadMultiplier={floatingXSpreadMultiplier}
        pauseTarget={actionPhase === "holding" ? 0 : 1}
      />

      <Center>
        <group
          ref={baseGroupRef}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <group ref={interactionGroupRef}>
            <primitive object={prepared.sceneClone} dispose={null} />

            <InteractiveParticles
              particles={particleData}
              texture={faceTexture}
              interactionGroupRef={interactionGroupRef}
              interactionRadius={interactionRadius}
              maxShrink={maxShrink}
              minScaleMultiplier={minScaleMultiplier}
              scaleLerp={scaleLerp}
              parallaxPositionStrength={parallaxPositionStrength}
              parallaxRotationStrength={parallaxRotationStrength}
              outlineColor={outlineColor}
              faceColor={faceColor}
              actionPhase={actionPhase}
              burstKey={burstKey}
              explosionDuration={explosionDuration}
              explodedHoldDuration={explodedHoldDuration}
              reformDuration={reformDuration}
              holdShakeAmount={holdShakeAmount}
              holdShakeSpeed={holdShakeSpeed}
              explosionSpreadX={explosionSpreadX}
              explosionSpreadY={explosionSpreadY}
              explosionForwardMin={explosionForwardMin}
              explosionForwardMax={explosionForwardMax}
              explosionRotateMax={explosionRotateMax}
            />
          </group>
        </group>
      </Center>
    </>
  );
}

useGLTF.preload("/assets/models/hyperiux-new-model.glb");
