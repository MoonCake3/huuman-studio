'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { shaderMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Custom GLSL Shader Material for the HUUMAN Portal
// ---------------------------------------------------------------------------

const PortalMaterial = shaderMaterial(
  {
    uProgress: 0.0,
    uTime: 0.0,
    uResolution: new THREE.Vector2(1, 1),
  },
  /* vertexShader */ `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragmentShader */ `
    uniform float uProgress;
    uniform float uTime;
    uniform vec2 uResolution;

    varying vec2 vUv;
    varying vec3 vPosition;

    // Simplex 2D noise helpers
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
      float total = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for (int i = 0; i < 5; i++) {
        total += snoise(p * freq) * amp;
        freq *= 2.0;
        amp *= 0.5;
      }
      return total;
    }

    void main() {
      vec2 st = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

      // Organic crack shape
      float noiseWarp = fbm(st * 3.0 + vec2(0.0, uTime * 0.05));
      float crackLine = abs(st.x - noiseWarp * 0.12);

      // Seam width grows with uProgress
      float width = 0.002 + uProgress * 0.15;
      float seam = smoothstep(width, 0.0, crackLine);
      float glow = smoothstep(width * 6.0, 0.0, crackLine) * 0.6;

      // Deep space void colors
      vec3 voidBg = vec3(0.023, 0.035, 0.078); // #060914
      vec3 goldLight = vec3(0.788, 0.662, 0.431); // #C9A96E
      vec3 hotCore = vec3(0.95, 0.93, 0.90);

      // Combine seam + glow
      vec3 color = voidBg;
      color = mix(color, goldLight, glow * min(1.0, uProgress * 2.0));
      color = mix(color, hotCore, seam * min(1.0, uProgress * 3.0));

      // Alpha mask for edges
      float alpha = clamp((glow + seam) * uProgress * 2.0, 0.0, 1.0);
      if (uProgress < 0.01) alpha = 0.0;

      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ PortalMaterial });

// ---------------------------------------------------------------------------
// Portal Plane Mesh
// ---------------------------------------------------------------------------

interface PortalMaterialUniforms {
  uProgress?: { value: number } | number;
  uTime?: { value: number } | number;
  uResolution?: {
    value?: { set: (w: number, h: number) => void };
    set?: (w: number, h: number) => void;
  };
}

function seededPRNG(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function PortalPlane({ progress }: { progress: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const mat = matRef.current as unknown as PortalMaterialUniforms;
    
    if (mat.uProgress !== undefined) {
      if (typeof mat.uProgress === 'number') mat.uProgress = progress;
      else if (mat.uProgress.value !== undefined) mat.uProgress.value = progress;
    }
    if (mat.uTime !== undefined) {
      if (typeof mat.uTime === 'number') mat.uTime = clock.getElapsedTime();
      else if (mat.uTime.value !== undefined) mat.uTime.value = clock.getElapsedTime();
    }
    if (mat.uResolution !== undefined) {
      if (mat.uResolution.set) mat.uResolution.set(size.width, size.height);
      else if (mat.uResolution.value?.set) mat.uResolution.value.set(size.width, size.height);
    }
  });

  const [planeW, planeH] = useMemo(() => {
    const fov = 60 * (Math.PI / 180);
    const dist = 5;
    const h = 2 * Math.tan(fov / 2) * dist;
    const w = h * (size.width / size.height);
    return [w, h];
  }, [size]);

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[planeW, planeH]} />
      {/* @ts-expect-error - custom shader material extended in JSX */}
      <portalMaterial ref={matRef} transparent depthWrite={false} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Particles Emerging From Portal
// ---------------------------------------------------------------------------

function EmergingParticles({ progress }: { progress: number }) {
  const count = 1500;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r1 = seededPRNG(i * 7 + 1);
      const r2 = seededPRNG(i * 7 + 2);
      const r3 = seededPRNG(i * 7 + 3);
      const r4 = seededPRNG(i * 7 + 4);
      const r5 = seededPRNG(i * 7 + 5);
      const r6 = seededPRNG(i * 7 + 6);

      pos[i * 3] = (r1 - 0.5) * 0.2;
      pos[i * 3 + 1] = (r2 - 0.5) * 6;
      pos[i * 3 + 2] = (r3 - 0.5) * 2;

      vel[i * 3] = (r4 - 0.5) * 0.05;
      vel[i * 3 + 1] = (r5 - 0.5) * 0.02;
      vel[i * 3 + 2] = r6 * 0.08 + 0.02;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    const attr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3] += velocities[i * 3] * progress;
      array[i * 3 + 1] += velocities[i * 3 + 1] * progress;
      array[i * 3 + 2] += velocities[i * 3 + 2] * progress;

      if (array[i * 3 + 2] > 5) {
        array[i * 3] = (Math.random() - 0.5) * 0.2;
        array[i * 3 + 1] = (Math.random() - 0.5) * 6;
        array[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#C9A96E"
        transparent
        opacity={Math.min(1, progress * 1.5)}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Main Exported Component
// ---------------------------------------------------------------------------

export default function PortalScene({ progress }: { progress: number }) {
  return (
    <div className="relative w-full h-full bg-[#060914]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.2} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <PortalPlane progress={progress} />
        <EmergingParticles progress={progress} />
      </Canvas>

      {/* Typography Overlay when progress is near completion */}
      <AnimatePresence>
        {progress > 0.8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute bottom-16 left-8 md:left-16 z-20 pointer-events-none"
          >
            <p className="text-label text-[--text-secondary] mb-2 tracking-[0.3em]">
              HUUMAN STUDIO
            </p>
            <h2 className="font-display text-display-md text-[--text-primary]">
              THE PORTAL IS OPEN.
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
