import React, { useRef, useEffect, useCallback } from "react";
import { MeshReflectorMaterial, useGLTF, useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RoomModel(props) {
    const groupRef = useRef();
    const targetRotation = useRef({ x: 0, y: 0 });
    const { gl, size } = useThree();
    const { nodes, materials } = useGLTF("/601/final7.glb");
    const TVtexture = useTexture("/601/tvtex.webp");
    TVtexture.flipY = false;

    const normalMap = useTexture("/601/normal.webp");
    normalMap.colorSpace = THREE.NoColorSpace
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
    normalMap.anisotropy = 16
    const normalScale = new THREE.Vector2(0.3, 0.3); // scale the normal map
    const roughnessMap = useTexture("/601/roughness.webp");
    roughnessMap.repeat.set(4, 4);
    roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;

    const sharedMaterialProps = {
        color: "#000",
        side: THREE.DoubleSide,
        normalMap: normalMap,
        normalScale: normalScale,
        roughness: .8
    };

    // Much more subtle, smaller ranges for rotation
    const maxY = 0.09; // max ~4 degrees left/right
    const maxX = 0.05; // max ~2 degrees up/down

    // Higher lerp for MORE smoothness
    const lerpAmt = 0.05;

    const handlePointerMove = useCallback(
        (event) => {
            const rect = gl.domElement.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            targetRotation.current.y = x * maxY;
            targetRotation.current.x = -y * maxX;
        },
        [gl]
    );

    useEffect(() => {
        const dom = gl.domElement;
        dom.addEventListener("mousemove", handlePointerMove);
        return () => {
            dom.removeEventListener("mousemove", handlePointerMove);
        };
    }, [gl, handlePointerMove]);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * lerpAmt;
            groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * lerpAmt;
        }
    });

    return (
        <group ref={groupRef} {...props} dispose={null}>
            <mesh castShadow receiveShadow geometry={nodes.room.geometry}>
                <meshStandardMaterial {...sharedMaterialProps} />
            </mesh>
            {/* Door */}
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Door.geometry}
            >
                <meshStandardMaterial {...sharedMaterialProps} />
            </mesh>

            <group scale={.9} >

                {/* Screen */}
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.screen.geometry}
                >
                    <meshStandardMaterial {...sharedMaterialProps} />
                </mesh>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.tv.geometry}
                >
                    <meshStandardMaterial map={TVtexture} emissiveMap={TVtexture} emissive="white" emissiveIntensity={.5} toneMapped={false} />
                </mesh>
            </group>

            {/* Switch */}
            {nodes.switch && (
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.switch.geometry}
                >
                    <meshStandardMaterial {...sharedMaterialProps} />
                </mesh>
            )}
            {/* Wires */}
            {nodes.wires && (
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.wires.geometry}
                >
                    <meshStandardMaterial {...sharedMaterialProps} />
                </mesh>
            )}
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.ladder.geometry}
                material={materials["ladder.002"]}
            >
                <meshStandardMaterial {...sharedMaterialProps} />
            </mesh>

            <mesh
                castShadow
                receiveShadow
                geometry={nodes.baseplane.geometry}
                // material={nodes.baseplane.material}
            >
                {/* <MeshReflectorMaterial
                    blur={[0, 100]}
                    resolution={1024}
                    mixBlur={80}
                    mirror={0}
                    mixStrength={1}
                    depthScale={1}
                    color="#000"
                    metalness={1}
                    roughness={0}
                    reflectorOffset={.2}
                /> */}
                <meshStandardMaterial color={'#000'} roughness={.5}  roughnessMap={roughnessMap} />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Body4002.geometry}
                material={materials["Steel - Satin.001"]}
            >
                <meshStandardMaterial {...sharedMaterialProps} />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Body4002_1.geometry}
                material={materials["Powder Coat (Grey).003"]}
            >
                <meshStandardMaterial {...sharedMaterialProps} />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Body4002_2.geometry}
                material={materials["Powder Coat (Grey).002"]}
            >
                <meshStandardMaterial {...sharedMaterialProps} />
            </mesh>

        </group>
    );
}
