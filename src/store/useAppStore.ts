import { create } from 'zustand';

export type Persona = 'designer' | 'developer' | 'neutral';

interface AppState {
  activePersona: Persona;
  setActivePersona: (persona: Persona) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activePersona: 'neutral',
  setActivePersona: (persona) => set({ activePersona: persona }),
}));
