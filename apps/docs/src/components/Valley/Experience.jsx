import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import CameraRig from "./CameraRig";
import Flowers from "./Flowers";
import useValleyData from "./useValleyData";

// Tweak these values to change the look of the valley
const FLOWER_CONFIG = {
  flowerProbability: 1.0, // Controls how many flower patches appear (0.0 to 1.0)
  patchScale: 0.1, // How large the patches are (smaller number = larger patches)
  globalScale: .8, // Overall scale multiplier for all sprites
  minScale: 0.1,  // Minimum random scale
  maxScaleRandom: 1.5, // Maximum additional random scale
  flowerThreshold: 0.4, // Threshold for spawning flower patches (> 0 defaults to grass)
  flowerDensity: 0.35, // Density of flowers within a patch
  grassScaleMult: 0.8, // Scale multiplier specifically for base grass
  flowerScaleMult: 1.2, // Scale multiplier specifically for flowers
  flowerYOffset: -0.02, // How much higher flowers sit above the base grass (negative embeds them in grass)
  colorTint: new THREE.Color(0.22, 0.23, 0.28), // brighten tint for "little light"
  rows: 300, // Number of rows along the path
  perRow: 360 // Number of sprites per row
};

export default function Experience() {
  const gltf = useGLTF("/valley/camera-path07.glb");
  const sprite = useTexture("/valley/pool_summer.png");
  const terrainTex = useTexture("/valley/terrain.png");

  useEffect(() => {
    sprite.colorSpace = THREE.SRGBColorSpace;
    sprite.minFilter = THREE.LinearFilter;
    sprite.magFilter = THREE.LinearFilter;
  }, [sprite]);

  const cameraProps = useMemo(() => {
    const scene = gltf?.scene;
    if (!scene) return null;
    const cam =
      scene.getObjectByName("Camera") ||
      scene.getObjectByProperty("type", "PerspectiveCamera") ||
      gltf.cameras?.[0];
    if (!cam) return null;

    return {
      fov: cam.fov,
      near: cam.near,
      far: cam.far,
      rotation: [cam.rotation.x, cam.rotation.y, cam.rotation.z],
    };
  }, [gltf]);

  const { curve, flowers } = useValleyData(gltf, terrainTex, FLOWER_CONFIG);

  if (!curve || !flowers) return null;

  return (
    <>
      <CameraRig curve={curve} cameraProps={cameraProps} scrollConfig={{
        scrollIntensity: 0.1,
        autoSpeed: 0.00009,
        damping: 0.97,
        lerpSpeed: 0.03,
        
      }} />
      <Flowers data={flowers} sprite={sprite} config={FLOWER_CONFIG} />
    </>
  );
}

useGLTF.preload("/valley/camera-path07.glb");
