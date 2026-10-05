import React, { useEffect } from 'react';
import { SceneCanvas } from './Scene3D/SceneCanvas';
import { ScrollEngine } from './Scrollytelling/ScrollEngine';
import { ArtisticOverlays } from './Scrollytelling/ArtisticOverlays';
import { useAppStore, type AppRoute } from '../store/useAppStore';
import type { WorkItem, StudyCaseItem } from '../types/content';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
}

function programmaticScrollTo(targetProgress: number) {
  if (typeof window === 'undefined') return;
  const maxScroll = Math.max(
    0,
    (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight
  );
  const targetScrollY = targetProgress * maxScroll;

  gsap.to(window, {
    duration: 1.4,
    scrollTo: { y: targetScrollY, autoKill: false },
    ease: 'power2.inOut',
    overwrite: 'auto',
  });
}

export interface Portfolio3DProps {
  works?: WorkItem[];
  studyCases?: StudyCaseItem[];
  initialRoute?: AppRoute;
  initialSlug?: string;
}

/**
 * Portfolio3D - Global 3D Spatial Canvas Component (Tarefa 1)
 * Handles initial deep-linking route offsets, synchronization with GSAP ScrollTrigger,
 * and History API integration across /estudos/[slug], /trabalhos/[slug], and /.
 */
export function Portfolio3D({
  works = [],
  studyCases = [],
  initialRoute = 'hero',
  initialSlug,
}: Portfolio3DProps) {
  useEffect(() => {
    // 1. Initialize store with deep-linked route and slug
    useAppStore.getState().setInitialNavigation(initialRoute, initialSlug || null);

    // 2. Tarefa 4: Silent scroll initialization for deep linking
    let targetProgress = 0;
    if (initialRoute === 'jardim') {
      targetProgress = 0.50; // Monitor Esquerdo (Wiki / Jardim Digital)
    } else if (initialRoute === 'trabalho') {
      targetProgress = 0.25; // Monitor Direito (Win XP OS / Trabalhos)
    } else if (initialRoute === 'sobre') {
      targetProgress = 0.75;
    } else if (initialRoute === 'contacto') {
      targetProgress = 1.00;
    }

    if (targetProgress > 0) {
      // Force instantaneous silent scroll so page renders "de cara" for the targeted monitor
      const performSilentScroll = () => {
        const scrollH = document.documentElement.scrollHeight || document.body.scrollHeight;
        const fallbackMax = window.innerHeight * 4;
        const maxScroll = scrollH > window.innerHeight ? scrollH - window.innerHeight : fallbackMax;
        const targetY = targetProgress * maxScroll;

        window.scrollTo({ top: targetY, behavior: 'instant' });
        useAppStore.getState().setScrollProgress(targetProgress);

        let step = 0;
        if (targetProgress < 0.125) step = 0;
        else if (targetProgress < 0.375) step = 1;
        else if (targetProgress < 0.625) step = 2;
        else if (targetProgress < 0.875) step = 3;
        else step = 4;
        useAppStore.getState().setCurrentStep(step);

        ScrollTrigger.update();
      };

      // Run on mount and after layout settles
      performSilentScroll();
      const t1 = setTimeout(performSilentScroll, 60);
      const t2 = setTimeout(performSilentScroll, 180);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [initialRoute, initialSlug]);

  // 3. Listen to browser Back/Forward (History API support)
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/estudos')) {
        const parts = pathname.split('/estudos/');
        const slug = parts[1]?.replace(/\/$/, '') || null;
        useAppStore.getState().setActiveStudySlug(slug);
        programmaticScrollTo(0.50);
      } else if (pathname.startsWith('/trabalhos')) {
        const parts = pathname.split('/trabalhos/');
        const slug = parts[1]?.replace(/\/$/, '') || null;
        useAppStore.getState().setActiveWorkSlug(slug);
        programmaticScrollTo(0.25);
      } else if (pathname === '/' || pathname === '') {
        programmaticScrollTo(0.00);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="relative w-full">
      {/* GSAP ScrollTrigger Engine */}
      <ScrollEngine />

      {/* 3D WebGL Canvas Layer */}
      <SceneCanvas works={works} studyCases={studyCases} />

      {/* Artistic HTML Typographic Overlays */}
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

export default Portfolio3D;
