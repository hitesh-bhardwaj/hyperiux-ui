'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, Center, Stats } from '@react-three/drei'
import RoomModel from '@/components/601/RoomModel'
import VideoUI from '@/components/601/VideoUI'
import { degToRad } from 'three/src/math/MathUtils'
import gsap from 'gsap'
import CustomGrainNoise from '@/components/601/CustomGrainNoise'
import { EffectComposer } from '@react-three/postprocessing'

// MovingPointLight component
function MovingPointLight(props) {
  const lightRef = useRef()
  const { gl } = useThree()
  const targetRef = useRef({ x: 0, y: 0 })

  // Mousemove: update normalized coords (relative to canvas)
  const handlePointerMove = useCallback(
    event => {
      const rect = gl.domElement.getBoundingClientRect()
      targetRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      targetRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    },
    [gl]
  )

  useEffect(() => {
    const dom = gl.domElement
    dom.addEventListener('mousemove', handlePointerMove)
    return () => dom.removeEventListener('mousemove', handlePointerMove)
  }, [gl, handlePointerMove])

  // Animate light position smoothly
  useFrame(() => {
    const light = lightRef.current
    if (!light) return
    const basePos = { x: 0, y: -1.3, z: -2 }
    const spread = { x: 1.8, y: 0.0, z: 0.08 } // y/y=0.0 means very little y
    const tx = basePos.x + targetRef.current.x * spread.x
    const ty = basePos.y + targetRef.current.y * spread.y
    const tz = basePos.z + targetRef.current.y * spread.z
    const lerp = 0.1

    light.position.x += (tx - light.position.x) * lerp
    light.position.y += (ty - light.position.y) * lerp
    light.position.z += (tz - light.position.z) * lerp
  })

  return (
    <pointLight
      castShadow
      ref={lightRef}
      position={[0, -1.3, -2]}
      {...props}
    />
  )
}

// SceneContent component
function SceneContent({ isZoomed, setIsZoomed, videoRef }) {
  const groupRef = useRef()
  const { camera } = useThree()
  const [envIntensity, setEnvIntensity] = useState(0.4)
  const [lightIntensity, setLightIntensity] = useState(3)
  const intensityState = useRef({ env: 0.5, light: 3 })

  // Toggle zoom and animate scene/camera
  // Handles model click and ESC key to toggle zoom
  const handleModelClick = useCallback(
    e => {
      if (e) e.stopPropagation()
      setIsZoomed(prev => !prev)
    },
    [setIsZoomed]
  )

  // Toggle off zoom when Esc is pressed
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "Escape" || e.key === "Esc") {
        setIsZoomed(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setIsZoomed])

  useEffect(() => {
    const duration = 1.5
    const ease = 'power3.inOut'
    if (isZoomed) {
      gsap.to(camera.position, { x: 0, y: 0.05, z: 2.5, duration, ease })
      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, { x: 0, y: 0, z: 0, duration, ease })
      }
      gsap.to(intensityState.current, {
        env: 0,
        light: 0,
        duration,
        ease,
        onUpdate: () => {
          setEnvIntensity(intensityState.current.env)
          setLightIntensity(intensityState.current.light)
        }
      })
    } else {
      gsap.to(camera.position, { x: 0, y: 0, z: 5, duration, ease })
      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, { x: 0, y: 0, z: degToRad(-5), duration, ease })
      }
      gsap.to(intensityState.current, {
        env: 2,
        light: 3,
        duration,
        ease,
        onUpdate: () => {
          setEnvIntensity(intensityState.current.env)
          setLightIntensity(intensityState.current.light)
        }
      })
    }
  }, [isZoomed, camera])

  return (
    <>
      <MovingPointLight intensity={lightIntensity} color="#FFF" distance={100} decay={0.7} />
      <Environment
        background={false}
        environmentRotation={[degToRad(0), degToRad(40), degToRad(0)]}
        files='https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/wooden_studio_08_1k.exr'
        environmentIntensity={0.4}
      />
      <group rotation={[0, 0, degToRad(-5)]} ref={groupRef}>
        <RoomModel onClick={handleModelClick} isZoomed={isZoomed} videoRef={videoRef} />
      </group>
    </>
  )
}

export default function Page() {
  const [isZoomed, setIsZoomed] = useState(false)
  const videoRef = useRef(null)
  const [progress, setProgress] = useState(0)

  // Track video playback progress (only when zoomed in)
  useEffect(() => {
    let req
    const updateProgress = () => {
      if (videoRef.current) {
        const curr = videoRef.current.currentTime
        const dur = videoRef.current.duration
        const prog = dur ? curr / dur : 0
        setProgress(isNaN(prog) ? 0 : prog)
      }
      req = requestAnimationFrame(updateProgress)
    }
    if (isZoomed) {
      req = requestAnimationFrame(updateProgress)
    }
    return () => req && cancelAnimationFrame(req)
  }, [isZoomed])

  return (
    <section className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        className="h-full w-full"
        camera={{ position: [0, 0, 4], fov: 55 }}
      >
        {/* <Stats /> */}
        <Center>
          <SceneContent isZoomed={isZoomed} setIsZoomed={setIsZoomed} videoRef={videoRef} />
        </Center>
        {/* <OrbitControls /> */}
        <EffectComposer>

          <CustomGrainNoise amount={0.01} scale={1.5} opacity={0.9} />
        </EffectComposer>
      </Canvas>
      {/* UI Overlay */}
      <VideoUI isZoomed={isZoomed} setIsZoomed={setIsZoomed} progress={progress} />
    </section>
  )
}
