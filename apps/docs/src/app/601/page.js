'use client'
import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Center } from '@react-three/drei'
import RoomModel from '@/components/601/RoomModel'
import { degToRad } from 'three/src/math/MathUtils'

export default function Page() {
    return (
        <section className="w-full h-screen bg-black flex items-center justify-center">
            <Canvas
                dpr={[1, 2]}
                gl={{ antialias: true }}
                className='h-full w-full'
                camera={{ position: [0, 0, 5.5], rotation: [0, 0, degToRad(5)], fov: 55 }}
            >
                <Center>
                    {/* <pointLight position={[0, 0, 0]} intensity={5} color={'#fff'} /> */}
                    <Environment environmentRotation={[degToRad(0), degToRad(100), degToRad(0)]} preset='city' environmentIntensity={2} />
                    <RoomModel />
                </Center>

                {/* <OrbitControls /> */}
            </Canvas>
        </section>
    )
}
