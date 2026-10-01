import { useState, useMemo, useEffect } from 'react';
import type { CollectionEntry } from "astro:content";
import { cn } from "../../utils/cn";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StudySidebarProps {
  cases: CollectionEntry<"studyCases">[];
  currentSlug?: string;
}

export function StudySidebar({ cases, currentSlug }: StudySidebarProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [openParents, setOpenParents] = useState<string[]>([]);
  const [openSubparents, setOpenSubparents] = useState<string[]>([]);

  // Agrupamento hierárquico
  const groupedCases = useMemo(() => {
    const grouped: Record<string, Record<string, CollectionEntry<"studyCases">[]>> = {};

    cases.forEach((item) => {
      const parent = item.data.parent || "Geral";
      const subparent = item.data.subparent || "Tópicos";

      if (!grouped[parent]) {
        grouped[parent] = {};
      }
      if (!grouped[parent][subparent]) {
        grouped[parent][subparent] = [];
      }

      grouped[parent][subparent].push(item);
    });

    // Ordenar itens por 'order' dentro de cada subparent
    Object.keys(grouped).forEach((parent) => {
      Object.keys(grouped[parent]).forEach((subparent) => {
        grouped[parent][subparent].sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
      });
    });

    return grouped;
  }, [cases]);

  // Expandir automaticamente a seção ativa baseado no slug atual
  useEffect(() => {
    if (!currentSlug) return;
    
    cases.forEach((item) => {
      const cleanSlug = item.id.replace(/\.[^/.]+$/, "");
      if (cleanSlug === currentSlug) {
        const parent = item.data.parent || "Geral";
        const subparent = item.data.subparent || "Tópicos";
        setOpenParents(prev => prev.includes(parent) ? prev : [...prev, parent]);
        setOpenSubparents(prev => prev.includes(subparent) ? prev : [...prev, subparent]);
      }
    });
  }, [currentSlug, cases]);

  const toggleParent = (parent: string) => {
    setOpenParents(prev => 
      prev.includes(parent) ? prev.filter(p => p !== parent) : [...prev, parent]
    );
  };

  const toggleSubparent = (subparent: string) => {
    setOpenSubparents(prev => 
      prev.includes(subparent) ? prev.filter(p => p !== subparent) : [...prev, subparent]
    );
  };

  const sidebarContent = (
    <div className="flex flex-col gap-8 pb-12 md:pb-0">
      {Object.keys(groupedCases).map((parent) => (
        <div key={parent} className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
            {parent}
          </h2>
          
          <div className="flex flex-col gap-2">
            {Object.keys(groupedCases[parent]).map((subparent) => (
              <div key={subparent} className="flex flex-col border-b border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                <button
                  onClick={() => toggleSubparent(subparent)}
                  className="flex items-center justify-between py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <span className="font-medium">{subparent}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      openSubparents.includes(subparent) && "rotate-180"
                    )}
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {openSubparents.includes(subparent) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="flex flex-col gap-1 py-2 pl-2">
                        {groupedCases[parent][subparent].map((item) => {
                          const cleanSlug = item.id.replace(/\.[^/.]+$/, "");
                          const isActive = cleanSlug === currentSlug;
                          return (
                            <li key={item.id}>
                              <a
                                href={`/estudos/${cleanSlug}`}
                                className={cn(
                                  "block py-1.5 px-3 rounded-md text-sm transition-colors",
                                  isActive
                                    ? "bg-zinc-800 text-zinc-100 font-medium"
                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                                )}
                              >
                                <span className="line-clamp-1">{item.data.title}</span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Contatos mockup as per wireframe */}
      <div className="mt-8 border-t border-zinc-800 pt-6">
        <h3 className="text-sm font-medium text-zinc-500 mb-4">contatos</h3>
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 border border-zinc-800 rounded flex items-center justify-center hover:bg-zinc-800/50 transition-colors cursor-pointer text-zinc-400">
               <div className="w-3 h-3 bg-zinc-600 rounded-sm"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center justify-between mb-6 pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight">Casos de Estudos</h1>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2 -mr-2 text-zinc-400 hover:text-zinc-200 transition-colors rounded-lg hover:bg-zinc-800/50"
          aria-label="Menu"
        >
          {isOpenMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-24">
        {sidebarContent}
      </div>
    </>
  );
}
