import { motion } from "framer-motion";

const LOGOS = [
  "/imgs/certifications/uem.png",
  "/imgs/companies/tim.svg",
  "/imgs/companies/telefonica.svg",
  "/imgs/certifications/oracle.png",
  "/imgs/certifications/uxpm.png",
  "/imgs/certifications/github-copilot.svg",
  "/imgs/certifications/unicesumar.svg",
  "/imgs/companies/air.svg",
];

// Duplicate logos to create a seamless marquee
const MARQUEE_LOGOS = [...LOGOS, ...LOGOS];

export function About() {
  return (
    <section id="processo" className="w-full relative overflow-hidden bg-transparent">
      
      {/* ── Faixa de Autoridade Global (Full-Width Marquee) ── */}
      <div className="w-full overflow-hidden py-10 border-y border-white/5 flex items-center bg-zinc-950/20 backdrop-blur-sm pointer-events-auto">
        <motion.div
          className="flex whitespace-nowrap gap-16 md:gap-24 items-center w-max pr-16 md:pr-24"
          animate={{ x: [0, "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35,
          }}
        >
          {MARQUEE_LOGOS.map((src, i) => (
            <img 
              key={i}
              src={src} 
              alt={`Partner ${i}`} 
              className="h-10 md:h-12 w-auto object-contain opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer" 
            />
          ))}
        </motion.div>
      </div>

      {/* ── Manifesto Editorial (Grid Assimétrico Aberto) ── */}
      <div className="max-w-7xl mx-auto px-6 py-32 md:py-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-end">
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-8"
          >
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
              Engenharia orientada a escala. <br className="hidden md:block" />
              <span className="text-zinc-500">Design focado no humano.</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="md:col-span-4"
          >
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
              Formação em Ciência da Computação. Expertise em UX. Eu transformo lógica complexa em experiências fluídas, sem intermediários.
            </p>
          </motion.div>

        </div>
      </div>

      {/* ── Portais de Decisão Magnéticos ── */}
      <div className="w-full flex flex-col md:flex-row border-t border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5">
        
        {/* Portal Esquerda: Freelance */}
        <a href="#contato" className="group w-full md:w-1/2 py-24 md:py-32 px-6 flex items-center justify-center cursor-none bg-zinc-950/0 hover:bg-zinc-900/40 transition-colors duration-700 relative overflow-hidden">
          <div className="flex items-center gap-4 md:gap-6 relative z-10">
            <span className="text-3xl md:text-6xl text-zinc-700 uppercase font-black tracking-tighter group-hover:text-white transition-colors duration-500">
              [ Fechar Projeto ]
            </span>
            <span className="text-4xl md:text-6xl text-designer font-black -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">
              →
            </span>
          </div>
        </a>

        {/* Portal Direita: Recrutadores */}
        <a href="#works" className="group w-full md:w-1/2 py-24 md:py-32 px-6 flex items-center justify-center cursor-none bg-zinc-950/0 hover:bg-zinc-900/40 transition-colors duration-700 relative overflow-hidden">
          <div className="flex items-center gap-4 md:gap-6 relative z-10">
            <span className="text-3xl md:text-6xl text-zinc-700 uppercase font-black tracking-tighter group-hover:text-white transition-colors duration-500">
              [ Avaliar Código ]
            </span>
            <span className="text-4xl md:text-6xl text-developer font-black -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">
              →
            </span>
          </div>
        </a>

      </div>

    </section>
  );
}