import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { VERTEX, FRAGMENT } from "./shaders";

export default function Flowers({ data, sprite, config }) {
  const pointsRef = useRef();

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCamFar: { value: 77 },
        uBrightness: { value: 1.0 },
        uSaturation: { value: 3.0 },
        uSpriteSheet: { value: sprite },
        uColorTint: { value:config?.colorTint  },
      
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      // blending: THREE.AdditiveBlending,
    });
  }, [sprite, config]);

  useEffect(() => {
    return () => material?.dispose();
  }, [material]);

  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={data.positions}
          count={data.count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColorCoordinate"
          array={data.colorCoords}
          count={data.count}
          itemSize={2}
        />
        <bufferAttribute
          attach="attributes-aSpriteScale"
          array={data.scales}
          count={data.count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandomSeed"
          array={data.seeds}
          count={data.count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aGrowNoise"
          array={data.growNoise}
          count={data.count}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive attach="material" object={material} />
    </points>
  );
}
