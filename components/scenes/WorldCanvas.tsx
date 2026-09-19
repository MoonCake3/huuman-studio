'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import ParticleField from './ParticleField';

interface WorldCanvasProps {
  scrollProgress: number; // 0 to 1 across total document
}

// ─── Floating Crystalline Artifact ──────────────────────────────────────────
function FloatingMonolith({ scrollProgress }: { scrollProgress: number }) {
  const meshOuter = useRef<THREE.Mesh>(null);
  const meshInner = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  const wireGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.6, 1);
    return new THREE.WireframeGeometry(geo);
  }, []);

  useFrame(({ pointer }, delta) => {
    if (!groupRef.current) return;

    const speed = 0.35 + scrollProgress * 0.5;
    if (meshOuter.current) {
      meshOuter.current.rotation.x += delta * speed * 0.7;
      meshOuter.current.rotation.y += delta * speed * 1.1;
    }
    if (meshInner.current) {
      meshInner.current.rotation.x -= delta * speed * 0.5;
      meshInner.current.rotation.y -= delta * speed * 0.9;
    }

    const targetX = pointer.x * 0.6;
    const targetY = pointer.y * 0.4;
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;

    const targetZ = -2 - scrollProgress * 5;
    const targetGroupY = 0.5 - scrollProgress * 1.8;
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.05;
    groupRef.current.position.y += (targetGroupY - groupRef.current.position.y) * 0.05;
  });

  return (
    <group ref={groupRef} position={[1.4, 0.2, -2]}>
      <mesh ref={meshOuter}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial
          color="#0C1128"
          roughness={0.15}
          metalness={0.85}
          transmission={0.4}
          thickness={0.8}
          transparent
          opacity={0.7}
          wireframe={false}
        />
      </mesh>

      <lineSegments ref={meshInner} geometry={wireGeometry}>
        <lineBasicMaterial
          color="#C9A96E"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <pointLight color="#C9A96E" intensity={1.5} distance={6} />
      <pointLight color="#3B82F6" intensity={1.2} distance={8} position={[-2, 1, 1]} />
    </group>
  );
}

// ─── Scene Stage with Smooth Parallax Ref ───────────────────────────────────
function SceneStage({ scrollProgress }: { scrollProgress: number }) {
  const stageRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (stageRef.current) {
      const targetZ = scrollProgress * 3.5;
      const targetY = scrollProgress * 2;
      stageRef.current.position.z += (targetZ - stageRef.current.position.z) * 0.05;
      stageRef.current.position.y += (targetY - stageRef.current.position.y) * 0.05;
    }

    if (lightRef.current) {
      const warmth = Math.sin(scrollProgress * Math.PI);
      lightRef.current.intensity = 0.8 + warmth * 0.6;
    }
  });

  return (
    <group ref={stageRef}>
      <ambientLight intensity={0.25} />
      <directionalLight
        ref={lightRef}
        position={[5, 8, 5]}
        intensity={1}
        color="#F0EDE8"
      />
      <directionalLight
        position={[-6, -4, -2]}
        intensity={0.4}
        color="#1E293B"
      />

      <Stars
        radius={50}
        depth={40}
        count={2500}
        factor={2.8}
        saturation={0.3}
        fade
        speed={0.2}
      />

      <FloatingMonolith scrollProgress={scrollProgress} />
      <ParticleField count={1200} spread={8} size={0.02} speed={0.8} />
    </group>
  );
}

// ─── Living World Canvas (Background) ─────────────────────────────────────────
export default function WorldCanvas({ scrollProgress }: WorldCanvasProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 200, position: [0, 0, 6] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <SceneStage scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
