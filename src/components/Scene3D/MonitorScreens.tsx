import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Html } from '@react-three/drei';
import {
  Folder,
  FileText,
  BookOpen,
  Search,
  Monitor,
  Wifi,
  Volume2,
  Sparkles,
  FileCode,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { WorkItem, StudyCaseItem } from '../../types/content';
import { OS_PROSE_CLASSES } from '../../styles/mdxStyles';

import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

// Tarefa 2: Helper universal de renderização de Mermaid para SVG no DOM
let renderQueue = Promise.resolve();

function renderMermaidElements(container?: HTMLElement | null): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  renderQueue = renderQueue
    .then(async () => {
      let attempts = 0;
      while (!(window as any).mermaid && attempts < 30) {
        await new Promise((r) => setTimeout(r, 100));
        attempts++;
      }

      const mermaid = (window as any).mermaid;
      if (!mermaid) return;

      const root = container || document.body;
      let elements = Array.from(
        root.querySelectorAll<HTMLElement>('.mermaid:not([data-processed="true"])')
      );

      if (elements.length === 0 && container) {
        elements = Array.from(
          document.querySelectorAll<HTMLElement>('.mermaid:not([data-processed="true"])')
        );
      }

      if (elements.length === 0) return;

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
          themeVariables: {
            fontSize: '12px',
            primaryColor: '#e0f2fe',
            primaryBorderColor: '#0284c7',
            primaryTextColor: '#0f172a',
            lineColor: '#64748b',
            secondaryColor: '#f8fafc',
            tertiaryColor: '#ffffff',
          },
        });
      } catch {
        // Ignora re-initialization warning
      }

      for (const el of elements) {
        if (el.getAttribute('data-processed') === 'true') continue;
        const rawCode = (el.getAttribute('data-mermaid-code') || el.textContent || '').trim();
        if (!rawCode) continue;
        el.setAttribute('data-mermaid-code', rawCode);
        const id = 'mermaid-svg-' + Math.random().toString(36).substring(2, 9);
        try {
          const { svg } = await mermaid.render(id, rawCode);
          el.innerHTML = svg;
          el.setAttribute('data-processed', 'true');
        } catch (err) {
          console.warn('[Mermaid] render error:', err);
        }
      }
    })
    .catch((err) => {
      console.warn('[Mermaid Queue Error]', err);
    });

  return renderQueue;
}

// Observador global para garantir renderização contínua de qualquer bloco Mermaid no DOM
if (typeof window !== 'undefined') {
  let debounceTimer: any = null;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      renderMermaidElements();
    }, 150);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}




// Scroll programático via GSAP ScrollToPlugin (sem colisão de estado com ScrollTrigger)
function programmaticScrollToProgress(targetProgress: number) {
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

interface MonitorScreensProps {
  works?: WorkItem[];
  studyCases?: StudyCaseItem[];
}

interface SubcategoryGroup<T> {
  name: string;
  items: T[];
}

interface CategoryGroup<T> {
  category: string;
  subcategories: SubcategoryGroup<T>[];
}

// Tarefa 3: Agrupamento hierárquico via Array.prototype.reduce
function groupContentByHierarchy<
  T extends {
    data: {
      category?: string;
      subcategory?: string;
      parent?: string;
      subparent?: string;
    };
  }
>(items: T[], defaultCategory: string): CategoryGroup<T>[] {
  const map = items.reduce<Record<string, Record<string, T[]>>>((acc, item) => {
    const cat = item.data.category || item.data.parent || defaultCategory;
    const subcat = item.data.subcategory || item.data.subparent || '';
    if (!acc[cat]) acc[cat] = {};
    if (!acc[cat][subcat]) acc[cat][subcat] = [];
    acc[cat][subcat].push(item);
    return acc;
  }, {});

  return Object.entries(map).map(([category, subcats]) => ({
    category,
    subcategories: Object.entries(subcats).map(([name, groupItems]) => ({
      name,
      items: groupItems,
    })),
  }));
}

// =============================================================================
// TAREFA 2: MEMOIZED WORK ARTICLE VIEW (ZERO FLICKER & ISOLATED RENDER)
// TAREFA 1: RESET DE SCROLL AUTOMÁTICO NO scrollContainerRef
// =============================================================================
interface WorkArticleViewProps {
  work: WorkItem | null;
}

const WorkArticleView = memo(
  function WorkArticleView({ work }: WorkArticleViewProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Tarefa 1: Reset de scroll para o topo sempre que o trabalho selecionado mudar
    useEffect(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, [work?.id, work?.slug]);

    // Tarefa 2: Renderização de Mermaid somente quando o conteúdo MDX mudar
    useEffect(() => {
      if (!work) return;
      let isCancelled = false;
      const run = async () => {
        if (!isCancelled) {
          await renderMermaidElements(scrollContainerRef.current);
        }
      };

      run();
      const t1 = setTimeout(run, 150);
      const t2 = setTimeout(run, 500);

      return () => {
        isCancelled = true;
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }, [work?.id, work?.html]);

    if (!work) return null;

    return (
      <div
        ref={scrollContainerRef}
        onWheel={(e) => e.stopPropagation()}
        className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-white select-text"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#94a3b8 #f1f5f9',
        }}
      >
        <article key={work.id} className="space-y-5">
          {/* Header */}
          <div className="space-y-2 border-b border-[#e2e8f0] pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#0284c7] uppercase tracking-wider">
                // CASO DE ESTUDO & ARQUITETURA
              </span>
              <span className="text-xs font-mono text-[#64748b]">
                {new Date(work.data.publishDate).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>

            <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">
              {work.data.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono bg-[#0284c7]/10 text-[#0369a1] px-2.5 py-0.5 rounded font-semibold border border-[#0284c7]/20">
                {work.data.role}
              </span>
              {work.data.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description Box */}
          {work.data.description && (
            <div className="bg-[#f0f9ff] border-l-4 border-[#0284c7] p-3.5 rounded-r text-[#0369a1] text-xs font-medium leading-relaxed">
              {work.data.description}
            </div>
          )}

          {/* Métricas Dinâmicas via Frontmatter */}
          {work.data.metrics && work.data.metrics.length > 0 && (
            <div
              className={`grid gap-3 ${
                work.data.metrics.length === 1
                  ? 'grid-cols-1'
                  : work.data.metrics.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            >
              {work.data.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded text-center shadow-xs"
                >
                  <span className="text-[10px] font-mono text-[#64748b] uppercase block font-bold tracking-wider">
                    {metric.label}
                  </span>
                  <span className="text-base font-black text-[#0284c7]">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Rich Pre-rendered MDX Content (Shiki + Mermaid) */}
          {work.html ? (
            <div
              className={OS_PROSE_CLASSES}
              dangerouslySetInnerHTML={{ __html: work.html }}
            />
          ) : (
            <div className="space-y-4 text-xs text-[#334155] leading-relaxed">
              <h3 className="text-base font-bold text-[#0f172a] border-b border-[#e2e8f0] pb-1">
                Contexto & Desafio de Engenharia
              </h3>
              <p>
                A maioria dos projetos sofre com um hiato entre design e engenharia: designs
                não se traduzem para código sem atrito, e código não reflete a intenção
                original de design.
              </p>
            </div>
          )}
        </article>
      </div>
    );
  },
  (prev, next) => prev.work?.id === next.work?.id && prev.work?.html === next.work?.html
);

// =============================================================================
// TAREFA 2: MEMOIZED STUDY ARTICLE VIEW (ZERO FLICKER & ISOLATED RENDER)
// TAREFA 1: RESET DE SCROLL AUTOMÁTICO NO scrollContainerRef
// =============================================================================
interface StudyArticleViewProps {
  article: StudyCaseItem | null;
}

const StudyArticleView = memo(
  function StudyArticleView({ article }: StudyArticleViewProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Tarefa 1: Reset de scroll para o topo sempre que o artigo mudar
    useEffect(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, [article?.id, article?.slug]);

    // Tarefa 2: Renderização de Mermaid somente quando o conteúdo MDX mudar
    useEffect(() => {
      if (!article) return;
      let isCancelled = false;
      const run = async () => {
        if (!isCancelled) {
          await renderMermaidElements(scrollContainerRef.current);
        }
      };

      run();
      const t1 = setTimeout(run, 150);
      const t2 = setTimeout(run, 500);

      return () => {
        isCancelled = true;
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }, [article?.id, article?.html]);

    if (!article) return null;

    return (
      <div
        ref={scrollContainerRef}
        onWheel={(e) => e.stopPropagation()}
        className="flex-1 overflow-y-auto p-6 space-y-5 bg-white select-text"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#94a3b8 #f1f5f9',
        }}
      >
        <article key={article.id} className="space-y-5">
          {/* Header */}
          <div className="space-y-2 border-b border-[#e2e8f0] pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#059669] font-bold">
              <span>{article.data.category || article.data.parent || 'Engenharia'}</span>
              <span>/</span>
              <span>{article.data.subcategory || article.data.subparent || 'Notas'}</span>
            </div>
            <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">
              {article.data.title}
            </h1>
            <div className="flex items-center gap-3 text-xs font-mono text-[#64748b]">
              <span>{article.data.role}</span>
              <span>•</span>
              <span>
                Publicado:{' '}
                {new Date(article.data.publishDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Physical Memory Diagram if it's the arrays article */}
          {article.id.includes('array') && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#475569] uppercase font-bold tracking-wider">
                Layout de Memória RAM Contígua:
              </span>
              <div className="grid grid-cols-4 gap-2 font-mono text-center">
                <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg p-2.5 space-y-1">
                  <span className="text-[10px] text-[#64748b] block">0x1000</span>
                  <span className="text-sm font-bold text-[#0284c7]">arr[0]</span>
                  <span className="text-[11px] text-[#334155] block">Val: 12</span>
                </div>
                <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg p-2.5 space-y-1">
                  <span className="text-[10px] text-[#64748b] block">0x1004</span>
                  <span className="text-sm font-bold text-[#0284c7]">arr[1]</span>
                  <span className="text-[11px] text-[#334155] block">Val: 45</span>
                </div>
                <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg p-2.5 space-y-1">
                  <span className="text-[10px] text-[#64748b] block">0x1008</span>
                  <span className="text-sm font-bold text-[#0284c7]">arr[2]</span>
                  <span className="text-[11px] text-[#334155] block">Val: 89</span>
                </div>
                <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg p-2.5 space-y-1">
                  <span className="text-[10px] text-[#64748b] block">0x100C</span>
                  <span className="text-sm font-bold text-[#0284c7]">arr[3]</span>
                  <span className="text-[11px] text-[#334155] block">Val: 33</span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Metrics if present in Study Case */}
          {article.data.metrics && article.data.metrics.length > 0 && (
            <div
              className={`grid gap-3 ${
                article.data.metrics.length === 1
                  ? 'grid-cols-1'
                  : article.data.metrics.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            >
              {article.data.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded text-center shadow-xs"
                >
                  <span className="text-[10px] font-mono text-[#64748b] uppercase block font-bold tracking-wider">
                    {metric.label}
                  </span>
                  <span className="text-base font-black text-[#059669]">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Rich Pre-rendered MDX Content (Shiki + Mermaid) */}
          {article.html ? (
            <div
              className={OS_PROSE_CLASSES}
              dangerouslySetInnerHTML={{ __html: article.html }}
            />
          ) : (
            <div className="space-y-3 text-xs text-[#334155] leading-relaxed">
              <p className="text-sm text-[#0f172a] font-medium leading-relaxed bg-[#f0fdf4] border-l-4 border-[#059669] p-3 rounded-r">
                {article.data.description}
              </p>
              <p>
                Arrays são coleções ordenadas onde cada elemento ocupa um bloco de tamanho
                constante na memória.
              </p>
            </div>
          )}
        </article>
      </div>
    );
  },
  (prev, next) => prev.article?.id === next.article?.id && prev.article?.html === next.article?.html
);

// =============================================================================
// MONITOR DIREITO: SISTEMA OPERACIONAL CLÁSSICO / RETRO CLEAN (WIN XP / 2000 PRO)
// TAREFA 1: MÉTRICAS DINÂMICAS VIA FRONTMATTER
// TAREFA 2: RENDERIZAÇÃO DE DIAGRAMAS MERMAID
// TAREFA 3: ISOLAMENTO E LEGIBILIDADE DE BLOCOS DE CÓDIGO
// =============================================================================
function RightMonitorOS({ works = [] }: { works: WorkItem[] }) {
  const setIsInsideMonitor = useAppStore((state) => state.setIsInsideMonitor);
  const activeWorkSlug = useAppStore((state) => state.activeWorkSlug);
  const setActiveWorkSlug = useAppStore((state) => state.setActiveWorkSlug);

  // Janela ativa e projeto selecionado
  const [activeWindow, setActiveWindow] = useState<string | null>('explorer');
  const [minimizedWindows, setMinimizedWindows] = useState<Record<string, boolean>>({});
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(
    activeWorkSlug || works[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('19:00');
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // O monitor está focado quando scrollProgress está próximo de 0.25 (passo 1)
  // Tarefa 2: Selector booleano que NÃO re-renderiza nos frames de scroll intermediários
  const isZoomedIn = useAppStore(
    (state) => state.scrollProgress >= 0.16 && state.scrollProgress <= 0.35
  );

  // Sincroniza com mudanças externas de activeWorkSlug (Deep linking ou History API popstate)
  useEffect(() => {
    if (activeWorkSlug) {
      const match = works.find(
        (w) => w.id === activeWorkSlug || w.slug === activeWorkSlug
      );
      if (match) {
        setSelectedWorkId(match.id);
        setActiveWindow('explorer');
        setMinimizedWindows((prev) => ({ ...prev, explorer: false }));
      }
    }
  }, [activeWorkSlug, works]);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Isolamento estrito de scroll no container do monitor
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const stopWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    el.addEventListener('wheel', stopWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', stopWheel);
    };
  }, []);

  const openWindow = (id: string) => {
    setActiveWindow(id);
    setMinimizedWindows((prev) => ({ ...prev, [id]: false }));
  };

  const closeWindow = (id: string) => {
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const toggleMinimize = (id: string) => {
    setMinimizedWindows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleWikiShortcut = () => {
    // Scroll programático fluido para o Monitor Esquerdo (Passo 2, 50%)
    programmaticScrollToProgress(0.50);
  };

  // Selecionar trabalho via sidebar (Tarefa 5: History API)
  const handleSelectWork = (work: WorkItem) => {
    const targetSlug = work.slug || work.id;
    setSelectedWorkId(work.id);
    setActiveWorkSlug(targetSlug);

    // Atualiza URL nativamente sem recarregar o 3D
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/trabalhos/${targetSlug}`);
    }
  };

  const activeWork =
    works.find((w) => w.id === selectedWorkId || w.slug === selectedWorkId) ||
    works[0];

  const filteredWorks = works.filter(
    (w) =>
      w.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.data.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.data.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tarefa 3: Agrupamento hierárquico dos trabalhos por categoria
  const groupedWorks = useMemo(() => {
    return groupContentByHierarchy(filteredWorks, 'Projetos Comerciais');
  }, [filteredWorks]);

  return (
    <div
      ref={containerRef}
      onWheel={(e) => e.stopPropagation()}
      onPointerEnter={() => setIsInsideMonitor(true)}
      onPointerLeave={() => setIsInsideMonitor(false)}
      className="w-[1024px] h-[576px] bg-[#1c52a3] text-[#1c1c1c] font-sans select-none flex flex-col overflow-hidden relative border-2 border-[#1c1c1c] shadow-2xl cursor-default opacity-100"
      style={{
        backgroundImage: `
          linear-gradient(135deg, #1c52a3 0%, #008080 50%, #1e3a8a 100%)
        `,
      }}
    >
      {/* Iluminação de Repouso / LOD */}
      <div
        className={`absolute inset-0 pointer-events-none z-20 transition-opacity duration-500 ${
          isZoomedIn ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.14) 0%, rgba(37, 99, 235, 0.08) 80%, transparent 100%)',
          backdropFilter: isZoomedIn ? 'none' : 'blur(2px)',
        }}
      />

      {/* Desktop Workspace Icons Grid */}
      <div className="flex-1 p-6 flex flex-col gap-6 w-36 z-10">
        {/* Ícone: Pasta Meus Trabalhos */}
        <button
          type="button"
          onDoubleClick={() => openWindow('explorer')}
          onClick={() => openWindow('explorer')}
          className="group flex flex-col items-center gap-1.5 p-2 rounded hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer text-center outline-none"
        >
          <div className="w-12 h-12 flex items-center justify-center drop-shadow-md">
            <Folder className="w-11 h-11 text-[#ffcc00] fill-[#f59e0b] stroke-[#b45309] stroke-[1.5]" />
          </div>
          <span className="text-xs font-mono font-medium text-white px-1.5 py-0.5 rounded group-focus:bg-[#0a246a] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            Meus Trabalhos
          </span>
        </button>

        {/* Ícones dinâmicos dos projetos da coleção works */}
        {works.map((work) => (
          <button
            key={work.id}
            type="button"
            onDoubleClick={() => {
              handleSelectWork(work);
              openWindow('explorer');
            }}
            onClick={() => {
              handleSelectWork(work);
              openWindow('explorer');
            }}
            className="group flex flex-col items-center gap-1.5 p-2 rounded hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer text-center outline-none"
          >
            <div className="w-12 h-12 flex items-center justify-center drop-shadow-md">
              <FileText className="w-10 h-10 text-white fill-[#f8fafc] stroke-[#0284c7] stroke-[1.5]" />
            </div>
            <span className="text-xs font-mono font-medium text-white px-1.5 py-0.5 rounded group-focus:bg-[#0a246a] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate max-w-[110px]">
              {work.data.title.split(':')[0]}
            </span>
          </button>
        ))}

        {/* Ícone: Atalho para o Jardim Digital (Monitor 2) */}
        <button
          type="button"
          onDoubleClick={handleWikiShortcut}
          onClick={handleWikiShortcut}
          className="group flex flex-col items-center gap-1.5 p-2 rounded hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer text-center outline-none"
        >
          <div className="w-12 h-12 flex items-center justify-center drop-shadow-md relative">
            <BookOpen className="w-10 h-10 text-[#34d399] fill-[#10b981] stroke-[#047857] stroke-[1.5]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#38bdf8] text-[9px] font-mono items-center justify-center text-black font-bold">
                2
              </span>
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-[#7dd3fc] px-1.5 py-0.5 rounded group-focus:bg-[#0a246a] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] flex items-center gap-1">
            Jardim.lnk ↗
          </span>
        </button>
      </div>

      {/* =======================================================================
          JANELA PRINCIPAL DE TRABALHOS - ESTRUTURA SIMÉTRICA AO JARDIM
          Sidebar com lista de projetos + Área principal com MDX rico
         ======================================================================= */}
      {activeWindow === 'explorer' && !minimizedWindows['explorer'] && (
        <div className="absolute top-4 left-24 right-4 bottom-13 bg-[#ffffff] border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] shadow-2xl rounded-t-sm flex flex-col overflow-hidden z-20">
          {/* Classic Win XP Title Bar */}
          <div className="h-7 bg-gradient-to-r from-[#0a246a] via-[#1a5ca8] to-[#a6caf0] px-3 flex items-center justify-between shrink-0 select-none text-white font-bold text-xs tracking-wide">
            <div className="flex items-center gap-2 truncate">
              <Folder className="w-4 h-4 text-[#ffcc00] fill-[#f59e0b] shrink-0" />
              <span className="truncate">
                C:\Henrique\Trabalhos\{activeWork ? activeWork.data.title : 'Todos'}
              </span>
            </div>
            {/* Window Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => toggleMinimize('explorer')}
                className="w-5 h-5 bg-[#ece9d8] border border-t-white border-l-white border-r-[#404040] border-b-[#404040] active:border-[#404040] text-black font-bold flex items-center justify-center text-xs hover:bg-[#f5f5f5]"
              >
                _
              </button>
              <button
                type="button"
                className="w-5 h-5 bg-[#ece9d8] border border-t-white border-l-white border-r-[#404040] border-b-[#404040] text-black font-bold flex items-center justify-center text-xs hover:bg-[#f5f5f5]"
              >
                □
              </button>
              <button
                type="button"
                onClick={() => closeWindow('explorer')}
                className="w-5 h-5 bg-[#d63929] hover:bg-[#e81123] text-white font-bold flex items-center justify-center text-xs border border-t-[#ff867c] border-l-[#ff867c] border-r-[#7f1d1d] border-b-[#7f1d1d]"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Explorer Menu & Address Bar */}
          <div className="bg-[#f0ede0] border-b border-[#c0bdae] px-3 py-1 flex items-center justify-between text-xs font-sans text-[#404040] shrink-0">
            <div className="flex items-center gap-4">
              <span>Arquivo</span>
              <span>Editar</span>
              <span>Exibir</span>
              <span>Ajuda</span>
            </div>
            {/* Quick jump to Jardim */}
            <button
              type="button"
              onClick={handleWikiShortcut}
              className="text-[11px] font-mono font-bold text-[#0284c7] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Jardim Digital (Monitor 2)</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-[#f5f3e9] border-b border-[#c0bdae] px-3 py-1 flex items-center gap-2 text-xs font-mono text-[#555] shrink-0">
            <span className="text-[#888]">Endereço:</span>
            <div className="flex-1 bg-white border border-[#7f9db9] px-2 py-0.5 text-black truncate">
              C:\Henrique\Trabalhos\{activeWork?.slug || activeWork?.id || ''}\
            </div>
          </div>

          {/* MAIN SIMPLIFIED SPLIT VIEW: SIDEBAR + RICH MDX READING */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Lista de Trabalhos / Projetos (260px) */}
            <div
              onWheel={(e) => e.stopPropagation()}
              className="w-68 bg-[#f1f5f9] border-r border-[#cbd5e1] flex flex-col overflow-y-auto p-3 space-y-3 shrink-0"
              style={{ scrollbarWidth: 'thin' }}
            >
              {/* Search Filter */}
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-white border border-[#cbd5e1] text-[#334155] shrink-0">
                <Search className="w-3.5 h-3.5 text-[#94a3b8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar projetos..."
                  className="bg-transparent border-none outline-none text-xs text-[#0f172a] placeholder-[#94a3b8] w-full font-mono"
                />
              </div>

              {/* Tarefa 3: Sidebar hierárquica por categorias */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#64748b] px-1 font-bold block">
                  Categorias ({filteredWorks.length})
                </span>

                {groupedWorks.map(({ category, subcategories }) => (
                  <div key={category} className="space-y-1">
                    {/* Categoria Pai */}
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono tracking-wider uppercase text-[#0369a1] bg-[#e0f2fe] rounded border border-[#bae6fd] font-bold select-none">
                      <Folder className="w-3.5 h-3.5 shrink-0 text-[#0284c7] fill-[#38bdf8]/30" />
                      <span className="truncate">{category}</span>
                    </div>

                    {/* Subcategorias / Trabalhos */}
                    {subcategories.map(({ name: subcatName, items }) => (
                      <div key={subcatName || 'default'} className="space-y-1 pl-1.5">
                        {subcatName && (
                          <div className="flex items-center gap-1 px-1.5 pt-0.5 text-[9px] font-mono font-semibold text-[#64748b]">
                            <span className="text-[#94a3b8]">↳</span>
                            <span className="truncate">{subcatName}</span>
                          </div>
                        )}

                        <div className="space-y-1 pl-1">
                          {items.map((work) => {
                            const isSelected = selectedWorkId === work.id || selectedWorkId === work.slug;
                            return (
                              <button
                                key={work.id}
                                type="button"
                                onClick={() => handleSelectWork(work)}
                                className={`w-full flex flex-col items-start gap-1 p-2 rounded-lg text-left transition-all cursor-pointer border ${
                                  isSelected
                                    ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-sm'
                                    : 'bg-white border-[#e2e8f0] text-[#334155] hover:border-[#0284c7] hover:bg-[#f0f9ff]'
                                }`}
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <FileText
                                    className={`w-3.5 h-3.5 shrink-0 ${
                                      isSelected ? 'text-white' : 'text-[#0284c7]'
                                    }`}
                                  />
                                  <span className="text-xs font-bold truncate">
                                    {work.data.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 w-full">
                                  <span
                                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                      isSelected
                                        ? 'bg-white/20 text-white'
                                        : 'bg-[#f1f5f9] text-[#64748b]'
                                    }`}
                                  >
                                    {work.data.role}
                                  </span>
                                  <span
                                    className={`text-[9px] font-mono truncate ${
                                      isSelected ? 'text-blue-100' : 'text-[#94a3b8]'
                                    }`}
                                  >
                                    {new Date(work.data.publishDate).getFullYear()}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Technologies summary */}
              <div className="space-y-1.5 pt-2 border-t border-[#cbd5e1] mt-auto">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#64748b] px-1 font-bold block">
                  Stack & Especialidades
                </span>
                <div className="flex flex-wrap gap-1 px-1">
                  {['React', 'TypeScript', 'Astro 5', 'WebGL/Three.js', 'Design Systems', 'OKLCH'].map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-mono bg-[#e2e8f0] text-[#475569] px-1.5 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tarefas 1 & 2: Right Main Area com WorkArticleView memoizado e reset de scroll */}
            <WorkArticleView work={activeWork} />
          </div>

          {/* Status Bar */}
          <div className="h-6 bg-[#ece9d8] border-t border-[#c0bdae] px-3 flex items-center justify-between text-[11px] font-mono text-[#666] shrink-0">
            <span>{works.length} projeto(s) carregados da Content Collection</span>
            <span>Pronto // URL sincronizada via History API</span>
          </div>
        </div>
      )}

      {/* Classic Windows XP Taskbar (Bottom) */}
      <div className="h-10 bg-[#245edb] border-t border-[#3b82f6] px-2 flex items-center justify-between text-xs select-none z-30 shadow-lg">
        <div className="flex items-center gap-2">
          {/* Start Button */}
          <button
            type="button"
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-b from-[#388e3c] to-[#1b5e20] text-white font-extrabold rounded-r-xl border border-t-[#81c784] border-l-[#81c784] border-r-[#1b5e20] border-b-[#1b5e20] shadow-md hover:brightness-110 active:brightness-90 cursor-pointer italic text-sm tracking-wide"
          >
            <Sparkles className="w-4 h-4 text-[#ffeb3b]" />
            <span>iniciar</span>
          </button>

          {/* Taskbar Tabs for Active Windows */}
          <div className="flex items-center gap-1 pl-2">
            <button
              type="button"
              onClick={() => {
                if (activeWindow === 'explorer') {
                  toggleMinimize('explorer');
                } else {
                  openWindow('explorer');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium cursor-pointer border ${
                activeWindow === 'explorer' && !minimizedWindows['explorer']
                  ? 'bg-[#1e40af] text-white border-t-[#0f172a] border-l-[#0f172a] border-r-white border-b-white'
                  : 'bg-[#3b82f6] text-white border-t-white border-l-white border-r-[#1e40af] border-b-[#1e40af] hover:bg-[#60a5fa]'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-[#ffcc00] fill-[#f59e0b]" />
              <span>Meus Trabalhos</span>
            </button>
          </div>
        </div>

        {/* System Tray (Clock & Status) */}
        <div className="flex items-center gap-3 bg-[#0f3899] px-3 py-1 rounded border-t border-l border-[#0a246a] border-r-[#3b82f6] border-b-[#3b82f6] text-white font-mono text-[11px]">
          <span className="flex items-center gap-1 text-[#4ade80]">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            <span>60 FPS</span>
          </span>
          <Volume2 className="w-3.5 h-3.5 text-[#93c5fd]" />
          <Wifi className="w-3.5 h-3.5 text-[#93c5fd]" />
          <span className="font-bold pl-1">{currentTime}</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MONITOR ESQUERDO: WIKI / JARDIM DIGITAL DINÂMICO
// TAREFA 2: RENDERIZAÇÃO DE DIAGRAMAS MERMAID
// TAREFA 3: ISOLAMENTO E LEGIBILIDADE DE BLOCOS DE CÓDIGO
// =============================================================================
function LeftMonitorWiki({ studyCases = [] }: { studyCases: StudyCaseItem[] }) {
  const scrollProgress = useAppStore((state) => state.scrollProgress);
  const setIsInsideMonitor = useAppStore((state) => state.setIsInsideMonitor);
  const activeStudySlug = useAppStore((state) => state.activeStudySlug);
  const setActiveStudySlug = useAppStore((state) => state.setActiveStudySlug);

  // Seleciona o primeiro artigo da coleção studyCases ou o vindo do store
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    activeStudySlug || studyCases[0]?.id || 'entendendo-os-arrays'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // O monitor está focado quando scrollProgress está próximo de 0.50 (passo 2)
  // Tarefa 2: Selector booleano que NÃO re-renderiza nos frames de scroll intermediários
  const isZoomedIn = useAppStore(
    (state) => state.scrollProgress >= 0.38 && state.scrollProgress <= 0.62
  );

  // Sincroniza com mudanças externas de activeStudySlug (Deep linking ou History API popstate)
  useEffect(() => {
    if (activeStudySlug) {
      const match = studyCases.find(
        (s) => s.id === activeStudySlug || s.slug === activeStudySlug
      );
      if (match) {
        setSelectedCaseId(match.id);
      }
    }
  }, [activeStudySlug, studyCases]);

  // Isolamento estrito de scroll no container do monitor
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const stopWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    el.addEventListener('wheel', stopWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', stopWheel);
    };
  }, []);

  // Selecionar estudo via sidebar (Tarefa 5: History API)
  const handleSelectStudy = (item: StudyCaseItem) => {
    const targetSlug = item.slug || item.id;
    setSelectedCaseId(item.id);
    setActiveStudySlug(targetSlug);

    // Atualiza URL nativamente sem recarregar o 3D
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/estudos/${targetSlug}`);
    }
  };

  const activeArticle =
    studyCases.find((s) => s.id === selectedCaseId || s.slug === selectedCaseId) ||
    studyCases[0];

  const filteredCases = studyCases.filter(
    (s) =>
      s.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.data.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tarefa 3: Agrupamento hierárquico dos estudos por categoria
  const groupedStudies = useMemo(() => {
    return groupContentByHierarchy(filteredCases, 'Geral');
  }, [filteredCases]);

  return (
    <div
      ref={containerRef}
      onWheel={(e) => e.stopPropagation()}
      onPointerEnter={() => setIsInsideMonitor(true)}
      onPointerLeave={() => setIsInsideMonitor(false)}
      className="w-[1024px] h-[576px] bg-[#f8fafc] text-[#0f172a] font-sans select-none flex flex-col overflow-hidden border-2 border-[#334155] shadow-2xl rounded-sm cursor-default opacity-100"
    >
      {/* Iluminação de Repouso / LOD */}
      <div
        className={`absolute inset-0 pointer-events-none z-20 transition-opacity duration-500 ${
          isZoomedIn ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(110, 231, 183, 0.14) 0%, rgba(5, 150, 105, 0.08) 80%, transparent 100%)',
          backdropFilter: isZoomedIn ? 'none' : 'blur(2px)',
        }}
      />

      {/* Retro/Clean Browser Header */}
      <div className="h-10 bg-[#e2e8f0] border-b border-[#cbd5e1] px-4 flex items-center justify-between shrink-0 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#047857] font-extrabold text-sm">
            <BookOpen className="w-4 h-4 text-[#059669]" />
            <span>Henrique Negri // Jardim Digital</span>
          </div>
          <span className="text-[#94a3b8]">|</span>
          <span className="text-[11px] text-[#64748b]">Engenharia & Ciência da Computação</span>
        </div>

        {/* Search bar & quick jump to Monitor 1 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-white border border-[#cbd5e1] text-[#334155]">
            <Search className="w-3.5 h-3.5 text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar notas..."
              className="bg-transparent border-none outline-none text-xs text-[#0f172a] placeholder-[#94a3b8] w-36 font-mono"
            />
          </div>

          <button
            type="button"
            onClick={() => programmaticScrollToProgress(0.25)}
            className="px-2.5 py-1 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Monitor 1 (OS) →</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Sidebar Categories + Dynamic Article Reading */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Index (280px) */}
        <div
          onWheel={(e) => e.stopPropagation()}
          className="w-72 bg-[#f1f5f9] border-r border-[#e2e8f0] flex flex-col overflow-y-auto p-3 space-y-4 shrink-0"
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Tarefa 3: Sidebar hierárquica por categorias */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#64748b] px-1 font-bold block">
              Hierarquia ({filteredCases.length})
            </span>

            {groupedStudies.map(({ category, subcategories }) => (
              <div key={category} className="space-y-1">
                {/* Categoria Pai */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono tracking-wider uppercase text-[#047857] bg-[#ecfdf5] rounded border border-[#a7f3d0] font-bold select-none">
                  <Folder className="w-3.5 h-3.5 shrink-0 text-[#059669] fill-[#10b981]/20" />
                  <span className="truncate">{category}</span>
                </div>

                {/* Subcategorias / Artigos */}
                {subcategories.map(({ name: subcatName, items }) => (
                  <div key={subcatName || 'default'} className="space-y-1 pl-2">
                    {subcatName && (
                      <div className="flex items-center gap-1 px-2 pt-0.5 text-[10px] font-mono font-semibold text-[#64748b]">
                        <span className="text-[#10b981]">↳</span>
                        <span className="truncate">{subcatName}</span>
                      </div>
                    )}

                    <div className="space-y-0.5 pl-1">
                      {items.map((item) => {
                        const isSelected = selectedCaseId === item.id || selectedCaseId === item.slug;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectStudy(item)}
                            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-mono transition-all text-left cursor-pointer ${
                              isSelected
                                ? 'bg-[#059669] text-white font-bold shadow-sm'
                                : 'text-[#334155] hover:bg-[#e2e8f0]'
                            }`}
                          >
                            <FileCode className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{item.data.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Curated Technical Tags */}
          <div className="space-y-1.5 pt-2 border-t border-[#e2e8f0] mt-auto">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#64748b] px-2 font-bold block">
              Tópicos Principais
            </span>
            <div className="flex flex-wrap gap-1 px-1">
              {['Data Structures', 'WebGL Shaders', 'Astro 5', 'Performance', 'Memory'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono bg-[#e2e8f0] text-[#475569] px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Tarefas 1 & 2: Right Article Content com StudyArticleView memoizado e reset de scroll */}
        <StudyArticleView article={activeArticle} />
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT: MONITOR SCREENS (3D SPATIAL HTML PROJECTION)
// =============================================================================
export function MonitorScreens({ works = [], studyCases = [] }: MonitorScreensProps) {
  return (
    <group name="Spatial_Monitor_Screens">
      {/* -----------------------------------------------------------------------
          1. MONITOR DIREITO (Mac Screen / OS Desktop / Trabalhos)
         ----------------------------------------------------------------------- */}
      <group
        name="Monitor_Direito_Mac"
        position={[-1.722, 1.200, -0.480]}
        rotation={[0, -0.139626, 0]}
      >
        <group position={[0.008, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Html
            transform
            distanceFactor={0.228515625}
            position={[0, 0, 0]}
            className="pointer-events-auto"
          >
            <RightMonitorOS works={works} />
          </Html>
        </group>
      </group>

      {/* -----------------------------------------------------------------------
          2. MONITOR ESQUERDO (PC Screen / Wiki / Jardim Digital)
         ----------------------------------------------------------------------- */}
      <group
        name="Monitor_Esquerdo_PC"
        position={[-1.682, 1.100, 0.150]}
        rotation={[0, 0.174533, 0]}
      >
        <group position={[0.008, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Html
            transform
            distanceFactor={0.22734375}
            position={[0, 0, 0]}
            className="pointer-events-auto"
          >
            <LeftMonitorWiki studyCases={studyCases} />
          </Html>
        </group>
      </group>
    </group>
  );
}

export default MonitorScreens;
