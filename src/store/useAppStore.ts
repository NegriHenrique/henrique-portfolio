import { create } from 'zustand';

export type Persona = 'designer' | 'developer' | 'neutral';
export type Language = 'pt' | 'en';
export type AppRoute = 'hero' | 'trabalho' | 'jardim' | 'sobre' | 'contacto';

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
  isInsideMonitor: boolean;
  setIsInsideMonitor: (inside: boolean) => void;

  // Deep linking and initial route/slug state (Tarefas 3, 4, 5)
  initialRoute: AppRoute;
  initialSlug: string | null;
  activeWorkSlug: string | null;
  activeStudySlug: string | null;
  setInitialNavigation: (route?: AppRoute, slug?: string | null) => void;
  setActiveWorkSlug: (slug: string | null) => void;
  setActiveStudySlug: (slug: string | null) => void;
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
  isInsideMonitor: false,
  setIsInsideMonitor: (inside) => set({ isInsideMonitor: inside }),

  // Initial deep link values
  initialRoute: 'hero',
  initialSlug: null,
  activeWorkSlug: null,
  activeStudySlug: null,
  setInitialNavigation: (route = 'hero', slug = null) =>
    set({
      initialRoute: route,
      initialSlug: slug,
      activeWorkSlug: route === 'trabalho' ? slug : null,
      activeStudySlug: route === 'jardim' ? slug : null,
    }),
  setActiveWorkSlug: (slug) => set({ activeWorkSlug: slug }),
  setActiveStudySlug: (slug) => set({ activeStudySlug: slug }),
}));

