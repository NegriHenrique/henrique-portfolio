import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

const MODEL_PATH = '/assets/modelo-3d/Escritorio.glb';
const DRACO_PATH = '/draco/';

function disposeMaterial(mat: THREE.Material) {
  const textureKeys = [
    'map',
    'lightMap',
    'bumpMap',
    'normalMap',
    'specularMap',
    'envMap',
    'alphaMap',
    'aoMap',
    'displacementMap',
    'emissiveMap',
    'gradientMap',
    'metalnessMap',
    'roughnessMap',
    'transmissionMap',
    'thicknessMap',
  ];

  for (const key of textureKeys) {
    const tex = (mat as unknown as Record<string, unknown>)[key];
    if (tex && typeof (tex as { dispose?: unknown }).dispose === 'function') {
      (tex as THREE.Texture).dispose();
    }
  }

  mat.dispose();
}

export function OfficeModel() {
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  const isReducedMotion = useAppStore((state) => state.isReducedMotion);

  // References for perceptible, living scene animations
  const dogRef = useRef<THREE.Object3D | null>(null);
  const gingerCatRef = useRef<THREE.Object3D | null>(null);
  const greyCatRef = useRef<THREE.Object3D | null>(null);
  const steamRef = useRef<THREE.Object3D | null>(null);
  const chairRef = useRef<THREE.Object3D | null>(null);
  const guitarRef = useRef<THREE.Object3D | null>(null);
  const balletRef = useRef<THREE.Object3D | null>(null);
  const macScreenRef = useRef<THREE.Mesh | null>(null);
  const pcScreenRef = useRef<THREE.Mesh | null>(null);

  // Initial base transforms
  const baseTransforms = useRef<{
    dogScale: THREE.Vector3;
    dogPos: THREE.Vector3;
    dogRotY: number;
    gingerCatScale: THREE.Vector3;
    gingerCatRotZ: number;
    greyCatScale: THREE.Vector3;
    steamPos: THREE.Vector3;
    steamScale: THREE.Vector3;
    steamRotY: number;
    chairRotY: number;
    guitarRotZ: number;
    balletRotY: number;
  }>({
    dogScale: new THREE.Vector3(1, 1, 1),
    dogPos: new THREE.Vector3(0, 0, 0),
    dogRotY: 0,
    gingerCatScale: new THREE.Vector3(1, 1, 1),
    gingerCatRotZ: 0,
    greyCatScale: new THREE.Vector3(1, 1, 1),
    steamPos: new THREE.Vector3(0, 0, 0),
    steamScale: new THREE.Vector3(1, 1, 1),
    steamRotY: 0,
    chairRotY: 0,
    guitarRotZ: 0,
    balletRotY: 0,
  });

  // Enable shadows matching Blender EEVEE and store animated object refs
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

      const b = baseTransforms.current;

      if (child.name === 'Pet_BlackDog_Tereza') {
        dogRef.current = child;
        b.dogScale.copy(child.scale);
        b.dogPos.copy(child.position);
        b.dogRotY = child.rotation.y;
      } else if (child.name === 'Pet_GingerCat') {
        gingerCatRef.current = child;
        b.gingerCatScale.copy(child.scale);
        b.gingerCatRotZ = child.rotation.z;
      } else if (child.name === 'Pet_GreyTabbyCat') {
        greyCatRef.current = child;
        b.greyCatScale.copy(child.scale);
      } else if (child.name === 'coffeeSteamModel') {
        steamRef.current = child;
        b.steamPos.copy(child.position);
        b.steamScale.copy(child.scale);
        b.steamRotY = child.rotation.y;
      } else if (child.name === 'topChairModel') {
        chairRef.current = child;
        b.chairRotY = child.rotation.y;
      } else if (child.name === 'Interactive_Guitar_Music') {
        guitarRef.current = child;
        b.guitarRotZ = child.rotation.z;
      } else if (child.name === 'Interactive_Dance_Ballet') {
        balletRef.current = child;
        b.balletRotY = child.rotation.y;
      } else if (child.name === 'macScreenModel' && (child as THREE.Mesh).isMesh) {
        macScreenRef.current = child as THREE.Mesh;
      } else if (child.name === 'pcScreenModel' && (child as THREE.Mesh).isMesh) {
        pcScreenRef.current = child as THREE.Mesh;
      }
    });
  }, [scene]);

  // Perceptible, organic animations making the office feel alive
  useFrame((state) => {
    if (isReducedMotion) return;

    const t = state.clock.getElapsedTime();
    const b = baseTransforms.current;

    // 1. Black dog: Perceptible breathing + gentle tail/snout sniffing sway
    if (dogRef.current) {
      // Breathing cycle (approx 16 breaths per min)
      const breath = Math.sin(t * 2.4);
      dogRef.current.scale.set(
        b.dogScale.x * (1 + breath * 0.03),
        b.dogScale.y * (1 + breath * 0.06),
        b.dogScale.z * (1 + breath * 0.045)
      );
      // Subtle rhythmic rise of chest/body
      dogRef.current.position.y = b.dogPos.y + (breath + 1) * 0.006;
      // Head/tail micro-movement
      const tailWag = Math.sin(t * 4.5) * Math.max(0, Math.sin(t * 0.75)) * 0.05;
      dogRef.current.rotation.y = b.dogRotY + tailWag + Math.sin(t * 1.2) * 0.02;
    }

    // 2. Ginger cat on the armchair: Deep, cozy breathing
    if (gingerCatRef.current) {
      const breath = Math.sin(t * 1.7 + 1.2);
      gingerCatRef.current.scale.set(
        b.gingerCatScale.x * (1 + breath * 0.025),
        b.gingerCatScale.y * (1 + breath * 0.055),
        b.gingerCatScale.z * (1 + breath * 0.04)
      );
      // Subtle ear/head curl
      gingerCatRef.current.rotation.z =
        b.gingerCatRotZ + Math.sin(t * 0.8) * 0.025;
    }

    // 3. Grey tabby cat on the floor: Peaceful sleeping breathing
    if (greyCatRef.current) {
      const breath = Math.sin(t * 1.9 + 2.4);
      greyCatRef.current.scale.set(
        b.greyCatScale.x * (1 + breath * 0.025),
        b.greyCatScale.y * (1 + breath * 0.05),
        b.greyCatScale.z * (1 + breath * 0.035)
      );
    }

    // 4. Coffee steam: Noticeable ascending swirl and ethereal pulse
    if (steamRef.current) {
      steamRef.current.position.y =
        b.steamPos.y + Math.sin(t * 2.0) * 0.022;
      steamRef.current.position.x =
        b.steamPos.x + Math.sin(t * 1.3) * 0.008;
      steamRef.current.scale.y =
        b.steamScale.y * (1 + Math.sin(t * 2.2) * 0.16);
      steamRef.current.scale.x =
        b.steamScale.x * (1 + Math.cos(t * 1.7) * 0.10);
      steamRef.current.rotation.y = b.steamRotY + t * 0.35;
    }

    // 5. Office desk chair: Natural idle lazy swivel (looks like someone just got up)
    if (chairRef.current) {
      chairRef.current.rotation.y =
        b.chairRotY + Math.sin(t * 0.75) * 0.065; // ~3.7 degrees lazy sway
    }

    // 6. Acoustic guitar on the wall: Micro musical resonance sway
    if (guitarRef.current) {
      guitarRef.current.rotation.z =
        b.guitarRotZ + Math.sin(t * 0.9) * 0.015;
    }

    // 7. Ballet shoes hanging ribbon: Gentle air current drift
    if (balletRef.current) {
      balletRef.current.rotation.y =
        b.balletRotY + Math.sin(t * 1.4) * 0.04;
    }

    // 8. Dual monitors: Dynamic UI luminous activity pulse
    if (macScreenRef.current && macScreenRef.current.material) {
      const mat = macScreenRef.current.material as THREE.MeshStandardMaterial;
      if (mat.emissive) {
        mat.emissiveIntensity =
          1.0 + Math.sin(t * 3.2) * 0.18 + Math.cos(t * 7.5) * 0.07;
      }
    }
    if (pcScreenRef.current && pcScreenRef.current.material) {
      const mat = pcScreenRef.current.material as THREE.MeshStandardMaterial;
      if (mat.emissive) {
        mat.emissiveIntensity =
          1.0 + Math.cos(t * 2.8) * 0.18 + Math.sin(t * 6.8) * 0.06;
      }
    }
  });

  // VRAM Management - Strict Dispose Pattern on unmount (AGENTS.md Rule 5)
  useEffect(() => {
    return () => {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => disposeMaterial(mat));
          } else if (mesh.material) {
            disposeMaterial(mesh.material);
          }
        }
      });
    };
  }, [scene]);

  return <primitive object={scene} />;
}

// Preload model asset for immediate availability
useGLTF.preload(MODEL_PATH, DRACO_PATH);
