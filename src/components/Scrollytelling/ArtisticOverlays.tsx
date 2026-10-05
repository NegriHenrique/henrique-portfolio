import React from 'react';
import { Home, Briefcase, Library, User, Mail } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

function scrollToStep(stepIndex: number) {
  if (typeof window === 'undefined') return;
  const maxScroll = Math.max(
    0,
    (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight
  );
  const targetY = (stepIndex / 4) * maxScroll;
  gsap.to(window, {
    duration: 1.4,
    scrollTo: { y: targetY, autoKill: false },
    ease: 'power2.inOut',
    overwrite: 'auto',
  });
}

const NAV_ITEMS = [
  { idx: 0, label: 'Hero', icon: Home },
  { idx: 1, label: 'Trabalhos', icon: Briefcase },
  { idx: 2, label: 'Jardim', icon: Library },
  { idx: 3, label: 'Sobre', icon: User },
  { idx: 4, label: 'Contacto', icon: Mail },
];

export function ArtisticOverlays() {
  const scrollProgress = useAppStore((state) => state.scrollProgress);
  const currentStep = useAppStore((state) => state.currentStep);
  const isReducedMotion = useAppStore((state) => state.isReducedMotion);

  // Helper to calculate smooth opacity curves for the 5-step spatial journey
  // 0% (Hero) -> 25% (Trabalhos) -> 50% (Wiki) -> 75% (Sobre Mim) -> 100% (Contacto)
  const getStepOpacity = (stepIndex: number) => {
    if (isReducedMotion) {
      return currentStep === stepIndex ? 1 : 0;
    }

    const p = Math.max(0, Math.min(1, scrollProgress));
    switch (stepIndex) {
      case 0: // 0% Hero (0.00 to 0.18)
        if (p < 0.08) return 1;
        if (p > 0.18) return 0;
        return 1 - (p - 0.08) / 0.10;

      case 1: // 25% Trabalhos (Monitor 1) (0.14 to 0.36)
        if (p < 0.14 || p > 0.36) return 0;
        if (p >= 0.21 && p <= 0.29) return 1;
        if (p < 0.21) return (p - 0.14) / 0.07;
        return 1 - (p - 0.29) / 0.07;

      case 2: // 50% Wiki / Estudos (Monitor 2) (0.38 to 0.62)
        if (p < 0.38 || p > 0.62) return 0;
        if (p >= 0.46 && p <= 0.54) return 1;
        if (p < 0.46) return (p - 0.38) / 0.08;
        return 1 - (p - 0.54) / 0.08;

      case 3: // 75% Sobre Mim (Estante) (0.64 to 0.86)
        if (p < 0.64 || p > 0.86) return 0;
        if (p >= 0.71 && p <= 0.79) return 1;
        if (p < 0.71) return (p - 0.64) / 0.07;
        return 1 - (p - 0.79) / 0.07;

      case 4: // 100% Contacto (Mesa de trabalho) (0.86 to 1.00)
        if (p < 0.86) return 0;
        if (p >= 0.94) return 1;
        return (p - 0.86) / 0.08;

      default:
        return 0;
    }
  };

  const op1 = getStepOpacity(1);
  const op2 = getStepOpacity(2);
  const op3 = getStepOpacity(3);
  const op4 = getStepOpacity(4);

  return (
    <div
      className="fixed inset-0 w-screen h-screen pointer-events-none z-10 flex flex-col justify-between p-6 sm:p-8 md:p-10 select-none overflow-hidden"
      aria-live="polite"
    >
      {/* Top Floating Bar: Semantic Lucide Navbar at top-right (Tarefas 1 & 2) */}
      <header className="w-full flex items-center justify-end pointer-events-none">
        {/* Semantic Accessible Navigation Bar with Lucide Icons (WCAG 2.2 AA) */}
        <nav
          aria-label="Navegação dos pontos de interesse 3D"
          className="flex items-center gap-1 sm:gap-1.5 bg-[oklch(14%_0.015_250/0.82)] backdrop-blur-md border border-[oklch(32%_0.02_250/0.6)] p-1.5 rounded-full pointer-events-auto shadow-2xl"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentStep === item.idx;
            const Icon = item.icon;
            return (
              <button
                key={item.idx}
                type="button"
                onClick={() => scrollToStep(item.idx)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Saltar para o ponto de interesse: ${item.label}`}
                className={`group relative flex items-center justify-center min-h-[40px] px-3.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[oklch(82%_0.20_195)] focus-visible:outline-offset-2 cursor-pointer ${
                  isActive
                    ? 'bg-[oklch(78%_0.16_195)] text-[oklch(12%_0.015_250)] font-bold shadow-md'
                    : 'text-[oklch(78%_0.02_250)] hover:text-[oklch(96%_0.008_250)] hover:bg-[oklch(22%_0.02_250)]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span
                  className={`text-xs font-mono tracking-wider overflow-hidden whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'max-w-[120px] ml-2 opacity-100 font-bold'
                      : 'max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:ml-2 group-hover:opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Overlays Viewport Area (pointer-events-none allows transparent click-through to 3D room) */}
      <div className="relative w-full flex-1 flex items-center pointer-events-none">
        {/* Semantic WCAG 2.2 AA / SEO Fallback for Spatial 3D Typography (Lighthouse 100) */}
        <header className="sr-only">
          <h1>Henrique Negri - Design que converte. Engenharia que escala.</h1>
          <h2>UX/UI Designer • Senior Frontend • Creative Developer</h2>
        </header>

        {/* 25% (Trabalhos) & 50% (Wiki): O conteúdo e a navegação ocorrem 100% dentro dos monitores 3D físicos */}

        {/* 75% (Sobre Mim / Estante de Livros): Culture & Background */}
        <section
          aria-hidden={op3 < 0.05}
          style={{
            opacity: op3,
            transform: `translate3d(0, ${(1 - op3) * 16}px, 0)`,
          }}
          className="absolute inset-0 flex flex-col justify-center items-start max-w-2xl transition-opacity duration-300 pointer-events-none"
        >
          <div className="space-y-5">
            <span className="font-mono text-[clamp(0.72rem,1.1vw,0.85rem)] tracking-[0.25em] uppercase text-[oklch(78%_0.16_195)]">
              // 03 . REPERTÓRIO & CULTURA
            </span>

            <h2 className="text-[clamp(2.4rem,6.2vw,5.2rem)] font-black tracking-tighter leading-[0.95] text-[oklch(96%_0.008_250)]">
              A Arte na
              <br />
              <span className="text-[oklch(72%_0.20_40)]">Convergência.</span>
            </h2>

            <p className="text-[clamp(1rem,1.6vw,1.25rem)] text-[oklch(74%_0.02_250)] font-light leading-relaxed max-w-lg">
              A criatividade se nutre da amplitude: faixa preta de judô, estudos contínuos de computação gráfica, música e literatura clássica alimentando a disciplina da engenharia e a sensibilidade do design.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {['Faixa Preta de Judô', 'Música & Guitarra', 'Design Editorial', '3D Shader Math'].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-[oklch(18%_0.02_250/0.8)] border border-[oklch(30%_0.02_250/0.6)] text-[oklch(80%_0.02_250)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 100% (Contacto / Mesa de Trabalho): Interactive 3D Objects & Accessible Fallback */}
        <section
          aria-hidden={op4 < 0.05}
          style={{
            opacity: op4,
            transform: `translate3d(0, ${(1 - op4) * 16}px, 0)`,
          }}
          className="absolute top-8 left-0 max-w-xl flex flex-col justify-start items-start transition-opacity duration-300 pointer-events-none z-10"
        >
          <div className="space-y-4">
            <span className="font-mono text-[clamp(0.72rem,1.1vw,0.85rem)] tracking-[0.25em] uppercase text-[oklch(78%_0.16_195)]">
              // 04 . CONTACTO & INTERATIVIDADE TÂNGIVEL
            </span>

            <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-black tracking-tighter leading-[0.95] text-[oklch(96%_0.008_250)]">
              Pronto para criar
              <br />
              <span className="text-[oklch(78%_0.16_195)]">algo lendário?</span>
            </h2>

            <p className="text-xs sm:text-sm text-[oklch(78%_0.02_250)] font-light leading-relaxed max-w-md bg-[oklch(14%_0.015_250/0.7)] backdrop-blur-md p-3 rounded-xl border border-[oklch(30%_0.02_250/0.5)]">
              Toque ou passe o cursor sobre os objetos 3D na mesa (<span className="text-[oklch(78%_0.16_195)] font-semibold">Smartphone</span> e <span className="text-[oklch(82%_0.16_85)] font-semibold">Pasta</span>) para interagir, ou use as ações diretas:
            </p>

            {/* Semantic Accessible Fallback Actions (WCAG 2.2 AA compliant) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 pointer-events-auto">
              <a
                href="https://wa.me/5511999999999?text=Ol%C3%A1%20Henrique!%20Vi%20seu%20portf%C3%B3lio%203D%20e%20gostaria%20de%20conversar."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir conversa no WhatsApp com Henrique Negri"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-full bg-[oklch(68%_0.22_145)] text-[oklch(12%_0.015_250)] font-bold text-xs tracking-wide transition-all duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[oklch(82%_0.20_195)] cursor-pointer shadow-lg"
              >
                <span>WhatsApp</span>
                <span aria-hidden="true" className="font-mono">↗</span>
              </a>

              <a
                href="/assets/curriculo-henrique-negri.pdf"
                download="Curriculo-Henrique-Negri.pdf"
                aria-label="Baixar currículo de Henrique Negri em formato PDF"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-full bg-[oklch(78%_0.16_195)] text-[oklch(12%_0.015_250)] font-bold text-xs tracking-wide transition-all duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[oklch(82%_0.20_195)] cursor-pointer shadow-lg"
              >
                <span>Baixar CV (PDF)</span>
                <span aria-hidden="true" className="font-mono">↓</span>
              </a>

              <a
                href="mailto:negri.henrique@gmail.com"
                aria-label="Enviar email para Henrique Negri"
                className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-full bg-[oklch(18%_0.02_250/0.85)] border border-[oklch(32%_0.02_250/0.6)] text-[oklch(96%_0.008_250)] font-medium text-xs tracking-wide transition-all duration-300 hover:bg-[oklch(24%_0.02_250)] cursor-pointer"
              >
                Email
              </a>

              <a
                href="https://linkedin.com/in/henriquenegri"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Acessar perfil do LinkedIn de Henrique Negri"
                className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-full bg-[oklch(18%_0.02_250/0.85)] border border-[oklch(32%_0.02_250/0.6)] text-[oklch(96%_0.008_250)] font-medium text-xs tracking-wide transition-all duration-300 hover:bg-[oklch(24%_0.02_250)] cursor-pointer"
              >
                LinkedIn
              </a>

              <a
                href="https://github.com/NegriHenrique"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Acessar perfil do GitHub de Henrique Negri"
                className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-full bg-[oklch(18%_0.02_250/0.85)] border border-[oklch(32%_0.02_250/0.6)] text-[oklch(96%_0.008_250)] font-medium text-xs tracking-wide transition-all duration-300 hover:bg-[oklch(24%_0.02_250)] cursor-pointer"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Floating Area: Unified Glassmorphism Info Card & Scroll Indicator (Tarefas 1 & 2) */}
      <footer className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pointer-events-none z-50">
        {/* Tarefa 1: Bloco Único de Informações com Glassmorphism (Canto Inferior Esquerdo) */}
        <div className="flex flex-col gap-1 bg-[oklch(14%_0.015_250/0.82)] backdrop-blur-md border border-[oklch(32%_0.02_250/0.5)] rounded-2xl p-4 sm:p-5 shadow-2xl pointer-events-auto max-w-sm transition-all duration-300 hover:border-[oklch(40%_0.025_250/0.7)]">
          <span className="text-base sm:text-lg font-bold text-[oklch(96%_0.008_250)] tracking-tight">
            Henrique Negri
          </span>
          <span className="text-xs sm:text-sm font-medium text-[oklch(78%_0.16_195)] tracking-wide">
            Engenheiro Frontend Sénior & UI/UX
          </span>
          <div className="flex items-center gap-2 pt-1 text-[clamp(0.68rem,1vw,0.76rem)] font-mono text-[oklch(74%_0.02_250)]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(74%_0.20_145)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(74%_0.20_145)]"></span>
            </span>
            <span>
              Maringá, PR, Brasil • <span className="text-[oklch(84%_0.16_145)] font-semibold">Disponível para novos projetos</span>
            </span>
          </div>
        </div>

        {/* Tarefa 1: Scroll Indicator com Glassmorphism e Contraste WCAG 2.2 AA (Canto Inferior Direito) */}
        <div className="flex items-center gap-3.5 bg-[oklch(14%_0.015_250/0.82)] backdrop-blur-md border border-[oklch(32%_0.02_250/0.5)] px-4 py-3 rounded-2xl shadow-2xl pointer-events-auto self-end sm:self-auto">
          <span className="text-xs sm:text-sm font-mono text-[oklch(88%_0.012_250)] tracking-wide">
            Role para conduzir a câmara
          </span>
          <div
            className="w-4 h-7 rounded-full border border-[oklch(45%_0.02_250)] flex items-start justify-center p-0.5"
            aria-hidden="true"
          >
            <span
              className="w-1 h-2 rounded-full bg-[oklch(78%_0.16_195)] transition-all duration-150"
              style={{
                transform: `translateY(${Math.min(10, scrollProgress * 10)}px)`,
              }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
