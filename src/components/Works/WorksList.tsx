import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type Project = {
  id: string;
  title: string;
  tags?: string[];
  coverImage?: string;
  slug: string;
  description?: string;
};

export default function WorksList({ projects }: { projects: Project[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Valores de mola (spring) para rastrear o mouse suavemente
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.8 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Centraliza o cursor no meio da janela flutuante
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? 320 : 450;
      const height = isMobile ? 200 : 280;
      
      mouseX.set(e.clientX - width / 2);
      mouseY.set(e.clientY - height / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="w-full flex flex-col relative group">
      
      {/* ── A Janela Flutuante de Perseguição (Hover Follow) ── */}
      <motion.div 
        className="pointer-events-none fixed top-0 left-0 w-[320px] h-[200px] md:w-[450px] md:h-[280px] rounded-2xl overflow-hidden z-50 shadow-2xl border border-white/10 bg-zinc-900 flex items-center justify-center"
        style={{ x: springX, y: springY }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: hoveredIndex !== null ? 1 : 0, 
          scale: hoveredIndex !== null ? 1 : 0.8 
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {projects.map((project, idx) => {
          const isActive = hoveredIndex === idx;
          return (
            <motion.div
              key={project.id}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {project.coverImage ? (
                <img 
                  src={project.coverImage} 
                  alt={project.title} 
                  className="w-full h-full object-cover scale-[1.02]"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-mono text-xs">
                  SEM IMAGEM
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Design da Lista Editorial ── */}
      {projects.map((project, idx) => (
        <a
          key={project.id}
          href={`/works/${project.slug}`}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="w-full flex justify-between items-center py-12 border-b border-white/5 relative cursor-none"
        >
          <div className="flex items-center">
            {/* Marcador Numérico */}
            <span className="text-zinc-600 font-mono text-sm mr-8 opacity-50">
              {(idx + 1).toString().padStart(2, '0')}
            </span>
            
            {/* Título do Projeto */}
            <h3 className="text-4xl md:text-6xl font-black text-zinc-600 transition-colors duration-300 relative">
              <motion.span 
                className="inline-block"
                animate={{ 
                  x: hoveredIndex === idx ? 16 : 0,
                  color: hoveredIndex === idx ? '#ffffff' : 'rgb(82, 82, 91)' // zinc-600
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                {project.title}
              </motion.span>
            </h3>
          </div>
          
          {/* Tags e Papel */}
          <div className="hidden md:flex gap-4">
            <span className="text-xs text-zinc-500 font-medium tracking-widest uppercase">
              {project.tags && project.tags.length > 0 ? project.tags.join(' / ') : 'Engenharia Criativa'}
            </span>
          </div>
        </a>
      ))}

    </div>
  );
}
