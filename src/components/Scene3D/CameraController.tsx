import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

interface Keyframe {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

export function CameraController() {
  const { camera } = useThree();
  const scrollProgress = useAppStore((state) => state.scrollProgress);
  const isReducedMotion = useAppStore((state) => state.isReducedMotion);

  // Exact camera timeline:
  // Step 0 (Hero): Enquadramento aproximado sem nenhum espaço preto nas laterais
  // Camera Position: [2.45, 1.90, 2.65], Target: [-0.10, 1.10, -0.35], FOV 38°
  // Preenche a tela completamente com as paredes e o chão do escritório, eliminando bordas pretas em qualquer aspecto.
  const keyframes = useMemo<Keyframe[]>(() => [
    // 0% (Hero): Aproximação para preenchimento total da tela (sem faixas pretas laterais)
    {
      position: new THREE.Vector3(2.45, 1.90, 2.65),
      target: new THREE.Vector3(-0.10, 1.10, -0.35),
    },
    // 25% (Trabalhos): Zoom e foco no Monitor 1 (Mac)
    {
      position: new THREE.Vector3(-0.95, 1.22, -0.48),
      target: new THREE.Vector3(-1.72, 1.20, -0.48),
    },
    // 50% (Wiki/Estudos): Câmera move-se e foca no Monitor 2 (PC)
    {
      position: new THREE.Vector3(-0.90, 1.18, 0.15),
      target: new THREE.Vector3(-1.68, 1.10, 0.15),
    },
    // 75% (Sobre Mim): Câmera gira e foca na Estante de Livros
    {
      position: new THREE.Vector3(0.35, 1.25, -0.40),
      target: new THREE.Vector3(0.35, 1.15, -1.88),
    },
    // 100% (Contacto): Close-up na superfície da Mesa de trabalho (interatividade 3D)
    {
      position: new THREE.Vector3(-0.85, 1.18, -0.18),
      target: new THREE.Vector3(-1.28, 0.815, -0.18),
    },
  ], []);

  const currentLookAt = useRef(new THREE.Vector3(-0.10, 1.10, -0.35));
  const targetPosition = useRef(new THREE.Vector3(2.45, 1.90, 2.65));
  const targetLookAt = useRef(new THREE.Vector3(-0.10, 1.10, -0.35));

  useFrame((state, delta) => {
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

    // Dynamic horizontal FOV lock:
    // In Three.js, camera.fov is vertical. When viewport is wide, horizontal FOV expands:
    // tan(HFOV/2) = tan(VFOV/2) * aspect.
    // If HFOV exceeds 62°, the room's right wall ends and reveals black space outside the diorama.
    // By keeping maximum HFOV capped at 62° for the Hero view, the room walls ALWAYS exceed the
    // left and right screen borders across any aspect ratio (16:9, 16:10, 21:9, ultra-wide)!
    const aspect = state.size.width / Math.max(1, state.size.height);
    const maxHFOVRad = THREE.MathUtils.degToRad(62);
    const tanHalfHFOV = Math.tan(maxHFOVRad / 2);
    const calculatedVFOV = 2 * Math.atan(tanHalfHFOV / aspect) * (180 / Math.PI);
    // On wide screens (aspect >= 1), cap VFOV so room walls cover left/right edges.
    // On portrait screens (aspect < 1), allow VFOV up to 58° to keep diorama edges completely off-screen.
    const heroVFOV = aspect >= 1 
      ? Math.min(38, calculatedVFOV) 
      : Math.min(58, Math.max(38, calculatedVFOV * 0.60));

    // Smoothly blend to standard 38° as we scroll into the room towards monitors / shelf
    const heroWeight = Math.max(0, 1 - clampedProgress * 4);
    const targetFOV = THREE.MathUtils.lerp(38, heroVFOV, heroWeight);

    if (Math.abs(camera.fov - targetFOV) > 0.02) {
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFOV, 10, delta);
      camera.updateProjectionMatrix();
    }

    // WCAG 2.2 AA Fallback: If prefers-reduced-motion is true, keep camera static
    if (isReducedMotion) {
      camera.position.copy(keyframes[0].position);
      camera.lookAt(keyframes[0].target);
      return;
    }

    // Map clampedProgress across the 4 segments (5 points)
    const totalSegments = keyframes.length - 1;
    const scaled = clampedProgress * totalSegments;
    const segmentIndex = Math.min(totalSegments - 1, Math.floor(scaled));
    const segmentT = scaled - segmentIndex;

    // Smooth cubic step interpolation
    const smoothT = segmentT * segmentT * (3 - 2 * segmentT);

    const fromKf = keyframes[segmentIndex];
    const toKf = keyframes[segmentIndex + 1];

    if (fromKf && toKf) {
      targetPosition.current.lerpVectors(fromKf.position, toKf.position, smoothT);
      targetLookAt.current.lerpVectors(fromKf.target, toKf.target, smoothT);

      // On portrait/mobile screens (aspect < 1.0), step camera back slightly and center on room corner
      // so both walls and room elements fit naturally within the tall screen without exposing void
      if (aspect < 1.0 && heroWeight > 0) {
        const pFactor = (1.0 - aspect) * heroWeight;
        const dir = new THREE.Vector3().subVectors(fromKf.position, fromKf.target);
        targetPosition.current.copy(fromKf.target).addScaledVector(dir, 1.0 + pFactor * 0.28);
        targetPosition.current.x -= pFactor * 0.95;
        targetLookAt.current.x -= pFactor * 0.95;
      }
    }

    // Subtle pointer parallax (micro-depth)
    const parallaxX = state.pointer.x * 0.015;
    const parallaxY = state.pointer.y * 0.01;

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetPosition.current.x + parallaxX,
      10,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetPosition.current.y + parallaxY,
      10,
      delta
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetPosition.current.z,
      10,
      delta
    );

    currentLookAt.current.x = THREE.MathUtils.damp(
      currentLookAt.current.x,
      targetLookAt.current.x,
      10,
      delta
    );
    currentLookAt.current.y = THREE.MathUtils.damp(
      currentLookAt.current.y,
      targetLookAt.current.y,
      10,
      delta
    );
    currentLookAt.current.z = THREE.MathUtils.damp(
      currentLookAt.current.z,
      targetLookAt.current.z,
      10,
      delta
    );

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
