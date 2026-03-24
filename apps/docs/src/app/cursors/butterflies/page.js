'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'

function Butterfly(props) {
  const { nodes, materials } = useGLTF('/assets/cursors/butterflies/butterfly.glb')
  
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.butterfly_atlas_2.geometry}
        material={nodes.butterfly_atlas_2.material}
      />
    </group>
  )
}

useGLTF.preload('/assets/cursors/butterflies/butterfly.glb')

export default function ButterfliesPage() {
  return (
    <div className="w-full h-screen bg-[#EAEAE9]">
      <Canvas camera={{ position: [0, 1, 3], fov: 75 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <Butterfly scale={2} />
        <OrbitControls />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
