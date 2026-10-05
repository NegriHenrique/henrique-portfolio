import React from 'react';
import { SceneCanvas } from '../Scene3D/SceneCanvas';
import { ScrollEngine } from './ScrollEngine';
import { ArtisticOverlays } from './ArtisticOverlays';

import type { WorkItem, StudyCaseItem } from '../../types/content';

interface ScrollytellingProps {
  works?: WorkItem[];
  studyCases?: StudyCaseItem[];
}

export function Scrollytelling({ works = [], studyCases = [] }: ScrollytellingProps) {
  return (
    <div className="relative w-full">
      {/* GSAP ScrollTrigger Engine */}
      <ScrollEngine />

      {/* 3D WebGL Canvas Layer (Fixed 100vw x 100vh, handles raycasting on interactive objects) */}
      <SceneCanvas works={works} studyCases={studyCases} />

      {/* Artistic HTML Typographic Overlays (Fixed 100vw x 100vh, z-10, pointer-events-none for transparent clicks) */}
      <ArtisticOverlays />

      {/* Native Browser Scroll Track (500vh for the 5-point spatial journey) */}
      <div
        id="scroll-track"
        className="w-full h-[500vh] pointer-events-none opacity-0 select-none"
        aria-hidden="true"
      />
    </div>
  );
}

export default Scrollytelling;
