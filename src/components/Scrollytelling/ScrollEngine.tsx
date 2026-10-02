import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '../../store/useAppStore';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollEngine() {
  const setScrollProgress = useAppStore((state) => state.setScrollProgress);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const setIsReducedMotion = useAppStore((state) => state.setIsReducedMotion);

  useEffect(() => {
    // 1. Accessibility: Detect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', onMotionChange);
    } else {
      motionQuery.addListener(onMotionChange);
    }

    // 2. Connect Lenis smooth scroll if active
    const lenis = (window as unknown as { lenis?: { on: (event: string, cb: () => void) => void } }).lenis;
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', ScrollTrigger.update);
    }

    // 3. Native scroll bound to GSAP ScrollTrigger
    // Timeline checkpoints: 0% (Hero), 25% (Trabalhos), 50% (Wiki), 75% (Sobre Mim), 100% (Contacto)
    const trigger = ScrollTrigger.create({
      trigger: '#scroll-track',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(1, self.progress));
        setScrollProgress(progress);

        // Map progress into the 5 journey steps centered on 0%, 25%, 50%, 75%, 100%
        let step = 0;
        if (progress < 0.125) {
          step = 0; // 0% Hero
        } else if (progress < 0.375) {
          step = 1; // 25% Trabalhos (Monitor 1)
        } else if (progress < 0.625) {
          step = 2; // 50% Wiki / Estudos (Monitor 2)
        } else if (progress < 0.875) {
          step = 3; // 75% Sobre Mim (Estante)
        } else {
          step = 4; // 100% Contacto (Mesa)
        }

        setCurrentStep(step);
      },
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', onMotionChange);
      } else {
        motionQuery.removeListener(onMotionChange);
      }
    };
  }, [setScrollProgress, setCurrentStep, setIsReducedMotion]);

  return null;
}
