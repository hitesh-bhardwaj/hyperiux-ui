"use client";

import { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Environment } from "@react-three/drei";
import { DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import FilmGrainEffect from "./FilmGrainEffect";

export default function ValleyR3F() {
  return (
    <div className="h-screen w-full relative">
      <Canvas
        dpr={[1, 1.5]}
        flat
        gl={{
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace,
        }}

      >
        <color attach="background" args={["#000"]} />
        <Suspense fallback={null}>
          <Experience />
        </Suspense>

        <EffectComposer>
          <FilmGrainEffect amount={0.05} scale={1} />

          <Vignette
            offset={0.3}
            darkness={.7}
          />


        </EffectComposer>
      </Canvas>
    </div>
  );
}
