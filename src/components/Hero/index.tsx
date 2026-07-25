import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { buttonVariants } from "../ui/Button";
import { cn } from "../../utils/cn";
import { useAppStore } from "../../store/useAppStore";
import { dict } from "../../utils/i18n";

function MagneticCTA({
  children,
  href,
  className,
  targetId,
  fillColorClass,
  textColorClass,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  targetId: string;
  fillColorClass: string;
  textColorClass: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 120, damping: 15, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Magnetic pull with max displacement 20px
    const maxDisplacement = 20;
    const pullX = Math.max(-maxDisplacement, Math.min(maxDisplacement, distanceX * 0.4));
    const pullY = Math.max(-maxDisplacement, Math.min(maxDisplacement, distanceY * 0.4));
    
    x.set(pullX); 
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Tenta interceptar globalmente com o Lenis para scroll inercial
    if (typeof window !== "undefined" && (window as any).lenis) {
      (window as any).lenis.scrollTo(targetId, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={cn(
        "relative overflow-hidden group cursor-pointer transition-shadow",
        className
      )}
    >
      {/* Liquid fill: start small in center, scale massively */}
      <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out z-0", fillColorClass)} />
      
      <span className={cn("relative z-10 flex items-center gap-2 transition-colors duration-300", textColorClass)}>
        {children}
      </span>
    </motion.a>
  );
}

export function Hero() {
  const setActivePersona = useAppStore((s) => s.setActivePersona);
  const lang = useAppStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);

  // Inicializa no centro (se for cliente) ou zero no servidor.
  const initialX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const mouseX = useMotionValue(initialX);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);
    // Re-garantir o centro ao montar
    mouseX.set(window.innerWidth / 2);
  }, [mouseX]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    setActivePersona(e.clientX < window.innerWidth / 2 ? 'designer' : 'developer');
  };

  const clipPathDesigner = useTransform(
    springX,
    (x) => `polygon(0 0, ${x}px 0, ${x}px 100%, 0 100%)`
  );

  return (
    <section 
      className="relative w-full h-screen min-h-[calc(100vh-4rem)] lg:min-h-[700px] lg:max-h-[1100px] overflow-hidden bg-zinc-950 cursor-crosshair"
      onMouseMove={handleMouseMove}
    >
      
      {/* ── Camada Base (Developer - Fundo) z-10 ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Brilho radial ciano */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(34,211,238,0.15),transparent_50%)]" />
        
        {/* Tipografia Monumental */}
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black uppercase text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.15)] whitespace-nowrap z-0 pointer-events-none select-none">
          {dict[lang].hero.title}
        </h1>

        {/* Imagem Developer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[85vh] flex items-end justify-center">
          <img 
            src="/imgs/hero/dev-no-bg.png" 
            alt="Developer" 
            className="object-contain h-[80vh] w-auto max-w-none opacity-90 drop-shadow-2xl"
          />
        </div>
      </div>

      {/* ── Camada Máscara (Designer - Frente) z-20 ── */}
      <motion.div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={mounted ? { clipPath: clipPathDesigner } : { clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
      >
        {/* Fundo escuro para ocultar a base */}
        <div className="absolute inset-0 bg-zinc-950" />

        {/* Brilho radial magenta */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(217,70,239,0.15),transparent_50%)]" />

        {/* Tipografia Monumental (Repetida para ficar na mesma posição relativa) */}
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black uppercase text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.15)] whitespace-nowrap z-0 pointer-events-none select-none">
          {dict[lang].hero.title}
        </h1>

        {/* Imagem Designer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[85vh] flex items-end justify-center">
          <img 
            src="/imgs/hero/designer-no-bg.png" 
            alt="Designer" 
            className="object-contain h-[80vh] w-auto max-w-none drop-shadow-2xl"
          />
        </div>
      </motion.div>

      {/* ── O Divisor Visual z-30 ── */}
      <motion.div 
        className="absolute top-0 bottom-0 w-[1px] bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.6)] z-30 pointer-events-none hidden md:block"
        style={mounted ? { x: springX } : { left: "50%" }}
      />

      {/* Bottom gradient para suavizar a transição */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-[35] pointer-events-none" />

      {/* ── Chamada Comercial e CTAs (Foreground Fixo) z-40 ── */}
      <div className="absolute bottom-12 md:bottom-20 left-6 md:left-12 lg:left-20 z-40 pointer-events-none flex flex-col gap-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl">
          {dict[lang].hero.callout1}<br/>
          <span className="text-zinc-500">{dict[lang].hero.callout2}</span>
        </h2>

        <div className="flex flex-wrap gap-4 pointer-events-auto">
          <MagneticCTA
            href="#contato"
            targetId="#contato"
            className={cn(buttonVariants({ size: "lg" }), "bg-white border-transparent shadow-xl font-bold")}
            fillColorClass="bg-zinc-950"
            textColorClass="text-zinc-950 group-hover:text-white"
          >
            {dict[lang].hero.btnMeeting} <Calendar size={16} />
          </MagneticCTA>
          
          <MagneticCTA
            href="#works"
            targetId="#works"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/20 bg-black/20 backdrop-blur-md shadow-xl font-medium")}
            fillColorClass="bg-white"
            textColorClass="text-white group-hover:text-zinc-950"
          >
            {dict[lang].hero.btnWorks} <ArrowRight size={16} />
          </MagneticCTA>
        </div>
      </div>

    </section>
  );
}
