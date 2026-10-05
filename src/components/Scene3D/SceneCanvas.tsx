import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OfficeModel } from './OfficeModel';
import { OfficeLighting } from './OfficeLighting';
import { DeskInteractables } from './DeskInteractables';
import { MonitorScreens } from './MonitorScreens';
import { CameraController } from './CameraController';
import { WallTypography } from './WallTypography';

import type { WorkItem, StudyCaseItem } from '../../types/content';

function CanvasFallback() {
  return null;
}

interface SceneCanvasProps {
  works?: WorkItem[];
  studyCases?: StudyCaseItem[];
}

export function SceneCanvas({ works = [], studyCases = [] }: SceneCanvasProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-auto z-0 overflow-hidden bg-[oklch(14%_0.015_250)]">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.AgXToneMapping,
          toneMappingExposure: 1.05,
        }}
        dpr={[1, 2]}
        camera={{
          position: [2.45, 1.90, 2.65],
          fov: 38,
          near: 0.1,
          far: 50,
        }}
        shadows
        className="w-full h-full"
      >
        <OfficeLighting />

        <Suspense fallback={<CanvasFallback />}>
          <OfficeModel />
          <DeskInteractables />
          <WallTypography />
          <MonitorScreens works={works} studyCases={studyCases} />
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
