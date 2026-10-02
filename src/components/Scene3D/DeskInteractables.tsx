import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export function DeskInteractables() {
  const currentStep = useAppStore((state) => state.currentStep);
  const isDeskStep = currentStep === 4; // Step 4 is Contact/Desk step

  // Hover states
  const [hoveredPhone, setHoveredPhone] = useState(false);
  const [hoveredFolder, setHoveredFolder] = useState(false);

  // Mesh and group refs
  const phoneGroupRef = useRef<THREE.Group>(null);
  const folderGroupRef = useRef<THREE.Group>(null);

  // Animated Y offsets
  const phoneTargetY = useRef(0.815);
  const folderTargetY = useRef(0.815);

  // References to geometries & materials for VRAM disposal
  const phoneGeoRef = useRef<THREE.BoxGeometry | null>(null);
  const screenGeoRef = useRef<THREE.BoxGeometry | null>(null);
  const folderGeoRef = useRef<THREE.BoxGeometry | null>(null);
  const pagesGeoRef = useRef<THREE.BoxGeometry | null>(null);
  const badgeGeoRef = useRef<THREE.BoxGeometry | null>(null);

  const phoneMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const screenMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const folderMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const pagesMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const badgeMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // VRAM Management - Dispose Pattern on unmount (AGENTS.md Rule 5)
  useEffect(() => {
    return () => {
      // Restore cursor if unmounting while hovered
      document.body.style.cursor = 'auto';

      phoneGeoRef.current?.dispose();
      screenGeoRef.current?.dispose();
      folderGeoRef.current?.dispose();
      pagesGeoRef.current?.dispose();
      badgeGeoRef.current?.dispose();

      phoneMatRef.current?.dispose();
      screenMatRef.current?.dispose();
      folderMatRef.current?.dispose();
      pagesMatRef.current?.dispose();
      badgeMatRef.current?.dispose();
    };
  }, []);

  // Update cursor style
  useEffect(() => {
    if (hoveredPhone || hoveredFolder) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
  }, [hoveredPhone, hoveredFolder]);

  // Smooth hover elevation in useFrame
  useFrame((_, delta) => {
    // Phone elevation
    const targetPhoneY = 0.815 + (hoveredPhone ? 0.04 : 0);
    phoneTargetY.current = THREE.MathUtils.damp(phoneTargetY.current, targetPhoneY, 12, delta);
    if (phoneGroupRef.current) {
      phoneGroupRef.current.position.y = phoneTargetY.current;
      phoneGroupRef.current.rotation.z = THREE.MathUtils.damp(
        phoneGroupRef.current.rotation.z,
        hoveredPhone ? 0.05 : 0,
        10,
        delta
      );
    }

    // Folder elevation
    const targetFolderY = 0.815 + (hoveredFolder ? 0.04 : 0);
    folderTargetY.current = THREE.MathUtils.damp(folderTargetY.current, targetFolderY, 12, delta);
    if (folderGroupRef.current) {
      folderGroupRef.current.position.y = folderTargetY.current;
      folderGroupRef.current.rotation.x = THREE.MathUtils.damp(
        folderGroupRef.current.rotation.x,
        hoveredFolder ? -0.06 : 0,
        10,
        delta
      );
    }
  });

  // Handlers for Phone (WhatsApp)
  const handlePhoneClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    window.open(
      'https://wa.me/5511999999999?text=Ol%C3%A1%20Henrique!%20Vi%20seu%20portf%C3%B3lio%203D%20e%20gostaria%20de%20conversar.',
      '_blank'
    );
  };

  // Handlers for Folder (CV Download)
  const handleFolderClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = '/assets/curriculo-henrique-negri.pdf';
    link.download = 'Curriculo-Henrique-Negri.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <group name="Desk_Interactive_Objects">
      {/* 1. OBJETO TELEFONE (Smartphone 3D) */}
      <group
        ref={phoneGroupRef}
        position={[-1.24, 0.815, 0.05]}
        rotation={[0, 0.15, 0]}
        onClick={handlePhoneClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPhone(true);
        }}
        onPointerOut={() => setHoveredPhone(false)}
      >
        {/* Phone Body */}
        <mesh castShadow={false} receiveShadow={false}>
          <boxGeometry ref={phoneGeoRef} args={[0.075, 0.007, 0.145]} />
          <meshStandardMaterial
            ref={phoneMatRef}
            color={new THREE.Color(0.08, 0.09, 0.12)}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Screen with WhatsApp glow */}
        <mesh position={[0, 0.004, 0]} castShadow={false} receiveShadow={false}>
          <boxGeometry ref={screenGeoRef} args={[0.068, 0.001, 0.138]} />
          <meshStandardMaterial
            ref={screenMatRef}
            color={new THREE.Color(0.05, 0.15, 0.1)}
            emissive={new THREE.Color(0.1, 0.45, 0.25)}
            emissiveIntensity={hoveredPhone ? 1.6 : 0.8}
            roughness={0.1}
          />
        </mesh>

        {/* Floating Tooltip Pill (Prominent on Step 4 or Hover) */}
        {(isDeskStep || hoveredPhone) && (
          <Html
            position={[0, 0.06, 0]}
            center
            distanceFactor={4}
            className="pointer-events-none select-none transition-all duration-300"
          >
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg whitespace-nowrap transition-transform duration-300 ${
                hoveredPhone
                  ? 'bg-[oklch(78%_0.16_195)] border-[oklch(85%_0.14_195)] scale-110 text-[oklch(12%_0.015_250)] font-bold'
                  : 'bg-[oklch(15%_0.018_250/0.85)] border-[oklch(35%_0.02_250/0.6)] text-[oklch(96%_0.008_250)] text-xs'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[oklch(68%_0.22_145)] animate-ping" />
              <span className="font-mono text-[11px] tracking-wide">
                {hoveredPhone ? 'Abrir WhatsApp →' : 'Telefone / WhatsApp'}
              </span>
            </div>
          </Html>
        )}
      </group>

      {/* 2. OBJETO PASTA / LIVRO (CV Portfolio 3D) */}
      <group
        ref={folderGroupRef}
        position={[-1.22, 0.815, -0.42]}
        rotation={[0, -0.25, 0]}
        onClick={handleFolderClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredFolder(true);
        }}
        onPointerOut={() => setHoveredFolder(false)}
      >
        {/* Leather Folio Cover */}
        <mesh castShadow={false} receiveShadow={false}>
          <boxGeometry ref={folderGeoRef} args={[0.18, 0.014, 0.24]} />
          <meshStandardMaterial
            ref={folderMatRef}
            color={new THREE.Color(0.12, 0.12, 0.15)}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>

        {/* Paper Pages Core */}
        <mesh position={[0.004, 0, 0]} castShadow={false} receiveShadow={false}>
          <boxGeometry ref={pagesGeoRef} args={[0.17, 0.01, 0.23]} />
          <meshStandardMaterial
            ref={pagesMatRef}
            color={new THREE.Color(0.85, 0.85, 0.8)}
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>

        {/* Gold Ribbon / Embossed Badge */}
        <mesh position={[-0.03, 0.008, 0]} castShadow={false} receiveShadow={false}>
          <boxGeometry ref={badgeGeoRef} args={[0.04, 0.001, 0.06]} />
          <meshStandardMaterial
            ref={badgeMatRef}
            color={new THREE.Color(0.8, 0.65, 0.2)}
            emissive={new THREE.Color(0.4, 0.3, 0.1)}
            emissiveIntensity={hoveredFolder ? 1.2 : 0.4}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Floating Tooltip Pill */}
        {(isDeskStep || hoveredFolder) && (
          <Html
            position={[0, 0.07, 0]}
            center
            distanceFactor={4}
            className="pointer-events-none select-none transition-all duration-300"
          >
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg whitespace-nowrap transition-transform duration-300 ${
                hoveredFolder
                  ? 'bg-[oklch(78%_0.16_195)] border-[oklch(85%_0.14_195)] scale-110 text-[oklch(12%_0.015_250)] font-bold'
                  : 'bg-[oklch(15%_0.018_250/0.85)] border-[oklch(35%_0.02_250/0.6)] text-[oklch(96%_0.008_250)] text-xs'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[oklch(82%_0.16_85)] animate-pulse" />
              <span className="font-mono text-[11px] tracking-wide">
                {hoveredFolder ? 'Baixar Currículo PDF ↓' : 'Pasta / Currículo'}
              </span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
