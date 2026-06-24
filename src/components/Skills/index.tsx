import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const SKILLS_DATA = [
  {
    id: "web-design",
    title: "Web Design",
    type: "designer",
    process: [
      {
        title: "01. Descoberta Estratégica",
        description: "Imersão total no seu modelo de negócio para mapear o público-alvo, analisar concorrentes e estruturar a jornada que trará o maior retorno financeiro.",
        tools: ["Miro", "Hotjar"]
      },
      {
        title: "02. Wireframes de Alta Fidelidade",
        description: "Projeção da estrutura física da interface focada na escaneabilidade rápida e na retenção do usuário.",
        tools: ["Figma"]
      },
      {
        title: "03. Design System Escalável",
        description: "Construção de componentes reutilizáveis, consistentes e milimetricamente alinhados à identidade da sua marca.",
        tools: ["Figma"]
      }
    ]
  },
  {
    id: "engenharia-web",
    title: "Engenharia Web",
    type: "developer",
    process: [
      {
        title: "01. Arquitetura de Performance",
        description: "Planejamento estrutural do repositório utilizando padrões modulares, tipagem estrita e foco em SEO técnico.",
        tools: ["VSCode", "Git"]
      },
      {
        title: "02. Desenvolvimento Fullstack",
        description: "Codificação limpa com React e Astro, aplicando gerenciamento de estado ultra-otimizado com Zustand.",
        tools: ["Astro", "React", "Zustand"]
      },
      {
        title: "03. Otimização & Escala Cloud",
        description: "Garantia de carregamento instantâneo (LCP < 2s) e infraestrutura resiliente pronta para milhares de acessos.",
        tools: ["AWS", "Azure", "Tailwind CSS"]
      }
    ]
  },
  {
    id: "mentoria",
    title: "Mentoria Técnica",
    type: "developer",
    process: [
      {
        title: "01. Diagnóstico & Code Review",
        description: "Análise profunda de arquiteturas existentes e revisão minuciosa de código para elevar a qualidade do seu time técnico.",
        tools: ["GitHub", "IntelliJ"]
      },
      {
        title: "02. Engenharia de Carreira",
        description: "Direcionamento estratégico prático para acelerar a evolução de desenvolvedores rumo a cargos Sênior e Tech Lead.",
        tools: ["Mentoria Estratégica"]
      },
      {
        title: "03. System Design de Elite",
        description: "Capacitação em design de sistemas complexos, Clean Code, documentação inteligente e boas práticas de mercado.",
        tools: ["System Design", "Soft Skills"]
      }
    ]
  }
];

export function Skills() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="skills" className="w-full bg-transparent overflow-hidden">
      <div className="py-32 md:py-40 max-w-7xl mx-auto px-6">
        
        {/* ── Barra de Navegação Monumental Horizontal ── */}
        <div className="flex flex-wrap gap-6 md:gap-12 border-b border-white/10 pb-12 justify-center lg:justify-start w-full relative">
          {SKILLS_DATA.map((skill, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={skill.id}
                onClick={() => setActiveIndex(index)}
                className={`relative pb-4 text-2xl md:text-4xl font-black tracking-tight uppercase transition-all duration-300 ${
                  isActive ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {skill.title}
                {/* Linha indicadora sutil abaixo do item ativo */}
                {isActive && (
                  <motion.div
                    layoutId="activeSkillTab"
                    className="absolute -bottom-[1px] left-0 right-0 h-[2px]"
                    style={{ 
                      backgroundColor: skill.type === 'designer' ? 'var(--color-designer)' : 'var(--color-developer)',
                      boxShadow: `0 0 10px ${skill.type === 'designer' ? 'var(--color-designer)' : 'var(--color-developer)'}`
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Palco de Conteúdo Espaçoso e Fluido ── */}
        <div className="mt-20 md:mt-24 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
            >
              {SKILLS_DATA[activeIndex].process.map((step, idx) => (
                <div key={idx} className="flex flex-col h-full">
                  
                  {/* Título do Tópico */}
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight mb-6">
                    {step.title}
                  </h3>
                  
                  {/* Descrição Comercial Profunda */}
                  <p className="text-zinc-400 leading-relaxed font-light text-sm md:text-base">
                    {step.description}
                  </p>
                  
                  {/* Arsenal de Ferramentas */}
                  <div className="mt-auto pt-10">
                    <span className="block text-[10px] md:text-xs uppercase tracking-widest text-zinc-600 font-bold mb-4">
                      Arsenal
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {step.tools.map(tool => (
                        <span 
                          key={tool} 
                          className="px-4 py-2 rounded-full border border-zinc-800 bg-zinc-950/50 text-[10px] md:text-xs font-semibold text-zinc-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}