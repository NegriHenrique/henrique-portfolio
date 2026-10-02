import { create } from 'zustand';

export type Persona = 'designer' | 'developer' | 'neutral';
export type Language = 'pt' | 'en';

interface AppState {
  activePersona: Persona;
  setActivePersona: (persona: Persona) => void;
  lang: Language;
  toggleLang: () => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isReducedMotion: boolean;
  setIsReducedMotion: (reduced: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activePersona: 'neutral',
  setActivePersona: (persona) => set({ activePersona: persona }),
  lang: 'pt',
  toggleLang: () => set((state) => ({ lang: state.lang === 'pt' ? 'en' : 'pt' })),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  isReducedMotion: false,
  setIsReducedMotion: (reduced) => set({ isReducedMotion: reduced }),
}));

