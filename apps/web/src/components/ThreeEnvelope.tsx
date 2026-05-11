import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

function EnvelopeModel({ onOpen }: { onOpen: () => void }) {
  const groupRef = useRef<THREE.Group>(null!)
  const flapRef = useRef<THREE.Group>(null!)
  const sealGroupRef = useRef<THREE.Group>(null!)
  const backMatRef = useRef<THREE.MeshStandardMaterial>(null!)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  // Shading colors for realistic paper folds
  const colorInside = "#e2dcce" 
  const colorLeftRight = "#f2ebd9" 
  const colorBottom = "#ede5d0" 
  const colorTop = "#f8f4e6"

  const { topFlapShape, bottomFlapShape, leftFlapShape, rightFlapShape } = useMemo(() => {
    const top = new THREE.Shape()
    top.moveTo(-2, 0)
    top.lineTo(2, 0)
    top.lineTo(0, -1.4)
    top.lineTo(-2, 0)

    const bottom = new THREE.Shape()
    bottom.moveTo(-2, -1.4)
    bottom.lineTo(2, -1.4)
    bottom.lineTo(0, 0.2)
    bottom.lineTo(-2, -1.4)

    const left = new THREE.Shape()
    left.moveTo(-2, 1.4)
    left.lineTo(-2, -1.4)
    left.lineTo(-0.2, 0)
    left.lineTo(-2, 1.4)

    const right = new THREE.Shape()
    right.moveTo(2, 1.4)
    right.lineTo(2, -1.4)
    right.lineTo(0.2, 0)
    right.lineTo(2, 1.4)

    return { topFlapShape: top, bottomFlapShape: bottom, leftFlapShape: left, rightFlapShape: right }
  }, [])

  useFrame((state) => {
    if (groupRef.current && !groupRef.current.userData.opened) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05
    }
  })

  const handleClick = () => {
    if (groupRef.current.userData.opened) return;
    groupRef.current.userData.opened = true;
    setHovered(false);

    const tl = gsap.timeline()

    // 1. Zoom in on envelope
    tl.to(groupRef.current.position, { z: 3.5, y: -0.5, duration: 0.8, ease: "power2.inOut" }, 0)

    // 2. Open the flap
    tl.to(flapRef.current.rotation, { x: Math.PI * 0.85, duration: 0.6, ease: "power2.inOut" }, 0.4)

    // 3. Pop and vanish seal
    tl.to(sealGroupRef.current.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.15, ease: "power1.out" }, 0.5)
    tl.to(sealGroupRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.3, ease: "back.in(2)" }, 0.65)

    // 4. Envelope fades out and sinks to bottom
    tl.to(groupRef.current.position, { y: -8, z: 5, duration: 1, ease: "power2.inOut" }, 0.8)
    tl.to(groupRef.current.rotation, { x: -Math.PI / 6, duration: 1, ease: "power2.in" }, 0.8)

    // 5. Trigger letter slide up
    tl.call(onOpen, [], 0.8)
  }

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group 
        ref={groupRef}
        position={[0, -0.4, 0]}
        onClick={handleClick} 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        {/* Envelope Body (Back Panel) */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[4, 2.8]} />
          <meshStandardMaterial ref={backMatRef} color={colorInside} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>

        {/* Left Flap */}
        <mesh position={[0, 0, 0.01]}>
          <shapeGeometry args={[leftFlapShape]} />
          <meshStandardMaterial color={colorLeftRight} roughness={0.9} />
        </mesh>

        {/* Right Flap */}
        <mesh position={[0, 0, 0.02]}>
          <shapeGeometry args={[rightFlapShape]} />
          <meshStandardMaterial color={colorLeftRight} roughness={0.9} />
        </mesh>

        {/* Bottom Flap */}
        <mesh position={[0, 0, 0.03]}>
          <shapeGeometry args={[bottomFlapShape]} />
          <meshStandardMaterial color={colorBottom} roughness={0.9} />
        </mesh>

        {/* Top Flap Group (Hinged at Top Edge) */}
        <group ref={flapRef} position={[0, 1.4, 0.04]}>
          <mesh position={[0, 0, 0]}>
            <shapeGeometry args={[topFlapShape]} />
            <meshStandardMaterial color={colorTop} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Wax Seal Group */}
        <group ref={sealGroupRef} position={[0, 0, 0.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.04, 32]} />
            <meshStandardMaterial 
              color="#b91c1c" 
              roughness={0.3} 
              metalness={0.2}
              emissive="#ff0000"
              emissiveIntensity={hovered ? 0.3 : 0}
            />
          </mesh>
          <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.04, 32, 32]} />
            <meshStandardMaterial color="#881111" roughness={0.4} />
          </mesh>
        </group>

      </group>
    </Float>
  )
}

export function ThreeEnvelope({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="w-full h-full cursor-pointer">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={65} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-2, -5, 4]} intensity={0.5} color="#ffffff" />
        
        <EnvelopeModel onOpen={onOpen} />
      </Canvas>
    </div>
  )
}
