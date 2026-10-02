import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function OfficeLighting() {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const orangeLightRef = useRef<THREE.PointLight>(null);
  const blueLightRef = useRef<THREE.PointLight>(null);

  // Target for directional room light (pointing towards center of room)
  const dirLightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0.106, 0.5, 0.117);
    return target;
  }, []);

  // Subtle natural light breathing
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (orangeLightRef.current) {
      orangeLightRef.current.intensity = 4.2 + Math.sin(t * 1.8) * 0.4;
    }
    if (blueLightRef.current) {
      blueLightRef.current.intensity = 4.8 + Math.cos(t * 2.2) * 0.45;
    }
  });

  return (
    <>
      <primitive object={dirLightTarget} />

      {/* 1. Blender: Light_Room_WarmAmbient (Area light 185W, Color: [1.0, 0.65, 0.55]) */}
      <directionalLight
        ref={dirLightRef}
        position={[3.20, 4.40, 3.40]}
        target={dirLightTarget}
        color={new THREE.Color(1.0, 0.65, 0.55)}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
      />

      {/* 2. Blender: Light_Desk_Orange (Area light 65W, Color: [1.0, 0.28, 0.02]) */}
      <pointLight
        ref={orangeLightRef}
        position={[-1.75, 0.94, -0.25]}
        color={new THREE.Color(1.0, 0.28, 0.02)}
        intensity={4.2}
        distance={4.0}
        decay={2}
      />

      {/* 3. Blender: Light_PC_Blue (Area light 80W, Color: [0.0, 0.38, 1.0]) */}
      <pointLight
        ref={blueLightRef}
        position={[-1.48, 1.25, -0.85]}
        color={new THREE.Color(0.0, 0.38, 1.0)}
        intensity={4.8}
        distance={3.2}
        decay={2}
      />

      {/* 4. Blender: Light_Monitors_Glow (Area light 45W, Color: [0.82, 0.72, 0.78]) */}
      <directionalLight
        position={[-0.40, 2.60, 1.80]}
        target={dirLightTarget}
        color={new THREE.Color(0.82, 0.72, 0.78)}
        intensity={0.8}
      />

      {/* 5. World Ambient Fill matching Blender World (Background Strength 0.85) */}
      <ambientLight color={new THREE.Color(0.22, 0.18, 0.26)} intensity={0.65} />
      <hemisphereLight
        color={new THREE.Color(1.0, 0.85, 0.75)}
        groundColor={new THREE.Color(0.06, 0.05, 0.08)}
        intensity={0.45}
      />
    </>
  );
}
