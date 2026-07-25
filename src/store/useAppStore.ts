import { create } from 'zustand';

export type Persona = 'designer' | 'developer' | 'neutral';
export type Language = 'pt' | 'en';

interface AppState {
  activePersona: Persona;
  setActivePersona: (persona: Persona) => void;
  lang: Language;
  toggleLang: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activePersona: 'neutral',
  setActivePersona: (persona) => set({ activePersona: persona }),
  lang: 'pt',
  toggleLang: () => set((state) => ({ lang: state.lang === 'pt' ? 'en' : 'pt' })),
}));
