'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  speed?: number;
}

// Deterministic PRNG for React 19 purity
function createSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface ParticleBuffers {
  positions: Float32Array;
  velocities: Float32Array;
  phases: Float32Array;
  sizes: Float32Array;
}

function buildBuffers(count: number, spread: number, speed: number): ParticleBuffers {
  const rand = createSeededRandom(42);
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);

  const baseSpeed = 0.03 * speed;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3]     = (rand() - 0.5) * spread * 2;
    positions[i3 + 1] = (rand() - 0.5) * spread * 2;
    positions[i3 + 2] = (rand() - 0.5) * spread * 2;

    velocities[i3]     = (rand() - 0.5) * baseSpeed;
    velocities[i3 + 1] = (rand() - 0.3) * baseSpeed * 0.6;
    velocities[i3 + 2] = (rand() - 0.5) * baseSpeed * 0.4;

    phases[i] = rand() * Math.PI * 2;
    sizes[i]  = 0.5 + rand() * 0.5;
  }

  return { positions, velocities, phases, sizes };
}

function ParticleFieldMesh({
  count = 1500,
  color = '#C9A96E',
  size = 0.022,
  spread = 6,
  speed = 1,
}: Required<ParticleFieldProps>) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const timeRef = useRef(0);

  const buffers = useMemo(
    () => buildBuffers(count, spread, speed),
    [count, spread, speed]
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const posBuf = new THREE.BufferAttribute(buffers.positions.slice(), 3);
    posBuf.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posBuf);
    geo.setAttribute('aPhase', new THREE.BufferAttribute(buffers.phases, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(buffers.sizes, 1));
    return geo;
  }, [buffers]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    timeRef.current += delta;
    const t = timeRef.current;

    const geo = pointsRef.current.geometry;
    const posArr = geo.attributes['position'].array as Float32Array;
    const halfSpread = spread;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ph = buffers.phases[i];

      const shimX = Math.sin(t * 0.31 + ph) * 0.001;
      const shimY = Math.cos(t * 0.23 + ph * 1.3) * 0.0012;
      const shimZ = Math.sin(t * 0.19 + ph * 0.7) * 0.0008;

      posArr[i3]     += buffers.velocities[i3]     + shimX;
      posArr[i3 + 1] += buffers.velocities[i3 + 1] + shimY;
      posArr[i3 + 2] += buffers.velocities[i3 + 2] + shimZ;

      if (posArr[i3]     >  halfSpread) posArr[i3]     -= halfSpread * 2;
      if (posArr[i3]     < -halfSpread) posArr[i3]     += halfSpread * 2;
      if (posArr[i3 + 1] >  halfSpread) posArr[i3 + 1] -= halfSpread * 2;
      if (posArr[i3 + 1] < -halfSpread) posArr[i3 + 1] += halfSpread * 2;
      if (posArr[i3 + 2] >  halfSpread) posArr[i3 + 2] -= halfSpread * 2;
      if (posArr[i3 + 2] < -halfSpread) posArr[i3 + 2] += halfSpread * 2;
    }

    geo.attributes['position'].needsUpdate = true;

    if (matRef.current) {
      matRef.current.opacity = 0.55 + Math.sin(t * 0.4) * 0.15;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        ref={matRef}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField({
  count = 1500,
  color = '#C9A96E',
  size = 0.022,
  spread = 6,
  speed = 1,
}: ParticleFieldProps) {
  return (
    <ParticleFieldMesh
      count={count}
      color={color}
      size={size}
      spread={spread}
      speed={speed}
    />
  );
}
