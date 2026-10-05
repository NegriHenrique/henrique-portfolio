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

        {/* Floating Tooltip Balloon on Hover (Tarefa 3) */}
        {hoveredPhone && (
          <Html
            position={[0, 0.08, 0]}
            center
            className="pointer-events-none select-none"
          >
            <div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[oklch(14%_0.02_250/0.92)] backdrop-blur-md border border-[oklch(78%_0.16_195)] shadow-2xl whitespace-nowrap text-white">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
                <span className="font-mono text-xs font-semibold tracking-wide text-white">
                  Abrir WhatsApp →
                </span>
              </div>
              {/* Balloon tail */}
              <div className="w-2 h-2 rotate-45 bg-[oklch(14%_0.02_250/0.92)] border-r border-b border-[oklch(78%_0.16_195)] -mt-1" />
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
        {/* Leather Folio Cover with subtle emissive response on hover */}
        <mesh castShadow={false} receiveShadow={false}>
          <boxGeometry ref={folderGeoRef} args={[0.18, 0.014, 0.24]} />
          <meshStandardMaterial
            ref={folderMatRef}
            color={new THREE.Color(0.12, 0.12, 0.15)}
            emissive={hoveredFolder ? new THREE.Color(0.2, 0.16, 0.08) : new THREE.Color(0, 0, 0)}
            emissiveIntensity={hoveredFolder ? 0.7 : 0.0}
            roughness={0.5}
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
            emissive={new THREE.Color(0.5, 0.4, 0.15)}
            emissiveIntensity={hoveredFolder ? 1.8 : 0.4}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Floating Tooltip Balloon on Hover (Tarefa 3) */}
        {hoveredFolder && (
          <Html
            position={[0, 0.08, 0]}
            center
            className="pointer-events-none select-none"
          >
            <div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[oklch(14%_0.02_250/0.92)] backdrop-blur-md border border-[oklch(78%_0.16_195)] shadow-2xl whitespace-nowrap text-white">
                <span className="w-2 h-2 rounded-full bg-[oklch(82%_0.16_85)] animate-pulse" />
                <span className="font-mono text-xs font-semibold tracking-wide text-white">
                  Baixar Currículo (PDF) ↓
                </span>
              </div>
              {/* Balloon tail */}
              <div className="w-2 h-2 rotate-45 bg-[oklch(14%_0.02_250/0.92)] border-r border-b border-[oklch(78%_0.16_195)] -mt-1" />
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
