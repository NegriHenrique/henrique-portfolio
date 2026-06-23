import { motion } from "framer-motion";
import {
  ArrowRight,
  Terminal,
  Activity,
  Layout,
  // Designer floating icons
  Paintbrush,
  PenTool,
  Layers,
  Palette,
  Sparkles,
  // Developer floating icons
  Code2,
  GitBranch,
  Braces,
  FileCode2,
  TerminalSquare,
} from "lucide-react";
import { buttonVariants } from "../ui/Button";
import { cn } from "../../utils/cn";
import { useAppStore } from "../../store/useAppStore";
import type { Persona } from "../../store/useAppStore";
import type { LucideIcon } from "lucide-react";

/* ── Motion config ─────────────────────────────────────────── */

const TRANSITION = { duration: 0.5, ease: "easeOut" } as const;
const CLIP_TRANSITION = {
  duration: 0.7,
  ease: [0.25, 0.46, 0.45, 0.94],
} as const;

const labelVariants = {
  active: { opacity: 1, scale: 1.05 },
  inactive: { opacity: 0.08, scale: 0.92 },
  neutral: { opacity: 0.3, scale: 1 },
};

/* ── Clip-path maps ────────────────────────────────────────── */

const designerClip: Record<Persona, string> = {
  designer: "inset(0% 0% 0% 0%)",
  developer: "inset(0% 100% 0% 0%)",
  neutral: "inset(0% 50% 0% 0%)",
};

/* ── Floating icon configs ─────────────────────────────────── */

interface FloatingIconConfig {
  Icon: LucideIcon;
  x: string;
  y: string;
  size: number;
  delay: number;
  rotate?: number;
}

const designerIcons: FloatingIconConfig[] = [
  { Icon: Paintbrush, x: "6%", y: "22%", size: 24, delay: 0, rotate: -15 },
  { Icon: PenTool, x: "3%", y: "48%", size: 20, delay: 0.4 },
  { Icon: Layers, x: "10%", y: "68%", size: 22, delay: 0.8, rotate: 10 },
  { Icon: Palette, x: "16%", y: "36%", size: 18, delay: 1.2, rotate: -8 },
  { Icon: Sparkles, x: "2%", y: "78%", size: 16, delay: 0.6, rotate: 20 },
];

const developerIcons: FloatingIconConfig[] = [
  { Icon: Code2, x: "90%", y: "24%", size: 24, delay: 0.2, rotate: 12 },
  { Icon: GitBranch, x: "94%", y: "50%", size: 20, delay: 0.6 },
  { Icon: Braces, x: "86%", y: "66%", size: 22, delay: 1.0, rotate: -10 },
  { Icon: FileCode2, x: "80%", y: "38%", size: 18, delay: 0.3, rotate: 8 },
  { Icon: TerminalSquare, x: "96%", y: "74%", size: 16, delay: 0.9, rotate: -5 },
];

/* ── HUD Components ────────────────────────────────────────── */

interface HUDProps {
  activePersona: Persona;
}

export function DesignerHUD({ activePersona }: HUDProps) {
  const isVisible = activePersona === "designer";

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
        visible: { 
          opacity: 1, 
          scale: 1, 
          transition: { duration: 0.5, ease: "easeOut", delayChildren: 0.1 } 
        },
      }}
      className="absolute inset-0 z-20 pointer-events-none"
    >
      {/* Color Palette Badge */}
      <motion.div
        className="absolute left-[4%] lg:left-[12%] top-[20%] md:top-[25%] backdrop-blur-md bg-background/50 border border-designer/20 p-3 rounded-xl shadow-2xl w-44 lg:w-48 font-mono text-[10px]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-designer/10 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <Palette size={12} className="text-designer" />
            <span className="text-designer/70 font-semibold tracking-wider">COLOR SCHEME</span>
          </div>
          <span className="text-[8px] text-foreground/40">v1.0</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-designer border border-designer/30 shadow-sm" />
            <span className="text-foreground/80">#E25B3C (Brand)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-foreground border border-foreground/30 shadow-sm" />
            <span className="text-foreground/80">#FFFFFF (Light)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-zinc-900 border border-foreground/10 shadow-sm" />
            <span className="text-foreground/80">#18181B (Dark)</span>
          </div>
        </div>
      </motion.div>

      {/* Grid Inspector Badge */}
      <motion.div
        className="absolute left-[4%] lg:left-[16%] top-[45%] md:top-[55%] backdrop-blur-md bg-background/50 border border-designer/20 p-3 rounded-xl shadow-2xl w-44 lg:w-48 font-mono text-[10px]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-designer/10 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <Layout size={12} className="text-designer" />
            <span className="text-designer/70 font-semibold tracking-wider">GRID SPEC</span>
          </div>
          <span className="text-[8px] text-foreground/40">12_COL</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-foreground/60">Width:</span>
            <span className="text-foreground/90 font-bold">1440px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Height:</span>
            <span className="text-foreground/90 font-bold">900px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Gap:</span>
            <span className="text-foreground/90 font-bold">24px</span>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-center gap-0.5 opacity-40">
          <span className="w-1 h-3 bg-designer" />
          <span className="w-1 h-3 bg-designer animate-pulse" />
          <span className="w-1 h-3 bg-designer" />
          <span className="w-1 h-3 bg-designer animate-pulse" />
          <span className="w-1 h-3 bg-designer" />
          <span className="w-1 h-3 bg-designer" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DeveloperHUD({ activePersona }: HUDProps) {
  const isVisible = activePersona === "developer";

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
        visible: { 
          opacity: 1, 
          scale: 1, 
          transition: { duration: 0.5, ease: "easeOut", delayChildren: 0.1 } 
        },
      }}
      className="absolute inset-0 z-20 pointer-events-none"
    >
      {/* Terminal Block */}
      <motion.div
        className="absolute right-[4%] lg:right-[12%] top-[20%] md:top-[25%] bg-zinc-950/90 border border-developer/20 p-3 rounded-xl shadow-2xl w-48 lg:w-52 font-mono text-[10px] text-developer"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-developer/10 pb-1.5 mb-2">
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[8px] text-developer/50">astro-dev</span>
        </div>
        <div className="space-y-1 text-[9px]">
          <div><span className="text-developer/60">$</span> npm run build</div>
          <div className="text-developer/85">✓ built in 420ms</div>
          <div className="text-zinc-500">dist/index.html   12.4 kB</div>
          <div className="text-developer font-bold animate-pulse">&gt; build --prod</div>
        </div>
      </motion.div>

      {/* Performance Badge */}
      <motion.div
        className="absolute right-[4%] lg:right-[16%] top-[45%] md:top-[55%] backdrop-blur-md bg-background/50 border border-developer/20 p-3 rounded-xl shadow-2xl w-44 lg:w-48 font-mono text-[10px]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-developer/10 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-developer" />
            <span className="text-developer/70 font-semibold tracking-wider">PERF_AUDIT</span>
          </div>
          <span className="text-[8px] text-developer">100%</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-foreground/60">LCP:</span>
            <span className="text-developer font-bold">&lt; 0.8s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/60">FID:</span>
            <span className="text-developer font-bold">&lt; 15ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/60">CLS:</span>
            <span className="text-developer font-bold">0.00</span>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[8px] text-zinc-500">PAGE_SPEED</span>
          <span className="w-2.5 h-2.5 rounded-full bg-developer animate-ping" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Component ────────────────────────────────────────── */

export function Hero() {
  const activePersona = useAppStore((s) => s.activePersona);
  const setActivePersona = useAppStore((s) => s.setActivePersona);

  const getState = (target: Persona) => {
    if (activePersona === "neutral") return "neutral";
    return activePersona === target ? "active" : "inactive";
  };

  return (
    <section className="relative w-full h-screen min-h-[calc(100vh-4rem)] lg:min-h-[700px] lg:max-h-[1100px] overflow-hidden bg-background">
      
      {/* ── Central Typographic Background (z-0) ── */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center select-none pointer-events-none overflow-hidden">
        <motion.div
          className="flex flex-col items-center justify-center text-center px-4"
          animate={{
            scale: activePersona === "neutral" ? 1 : 1.05,
          }}
          transition={TRANSITION}
        >
          <div className="relative w-screen h-[20vw] min-h-[120px] flex items-center justify-center">
            {/* Neutral Text */}
            <motion.span
              className="absolute text-[12vw] font-black text-foreground opacity-[0.03] uppercase tracking-tighter leading-none"
              animate={{
                opacity: activePersona === "neutral" ? 0.04 : 0,
                y: activePersona === "neutral" ? 0 : -20,
              }}
              transition={TRANSITION}
            >
              Henrique
            </motion.span>
            {/* Designer Text */}
            <motion.span
              className="absolute text-[12vw] font-black text-designer opacity-0 uppercase tracking-tighter leading-none"
              animate={{
                opacity: activePersona === "designer" ? 0.06 : 0,
                y: activePersona === "designer" ? 0 : 20,
              }}
              transition={TRANSITION}
            >
              Creative
            </motion.span>
            {/* Developer Text */}
            <motion.span
              className="absolute text-[12vw] font-black text-developer opacity-0 uppercase tracking-tighter leading-none"
              animate={{
                opacity: activePersona === "developer" ? 0.06 : 0,
                y: activePersona === "developer" ? 0 : 20,
              }}
              transition={TRANSITION}
            >
              Developer
            </motion.span>
          </div>

          <div className="relative w-screen h-[6vw] min-h-[50px] flex items-center justify-center -mt-2 md:-mt-6">
            {/* Neutral Subtitle */}
            <motion.span
              className="absolute text-[3vw] font-bold text-primary opacity-[0.03] uppercase tracking-[0.25em] leading-none"
              animate={{
                opacity: activePersona === "neutral" ? 0.04 : 0,
                y: activePersona === "neutral" ? 0 : 10,
              }}
              transition={TRANSITION}
            >
              Design & Dev
            </motion.span>
            {/* Designer Subtitle */}
            <motion.span
              className="absolute text-[3vw] font-bold text-designer opacity-0 uppercase tracking-[0.25em] leading-none"
              animate={{
                opacity: activePersona === "designer" ? 0.06 : 0,
                y: activePersona === "designer" ? 0 : -10,
              }}
              transition={TRANSITION}
            >
              Product Spec
            </motion.span>
            {/* Developer Subtitle */}
            <motion.span
              className="absolute text-[3vw] font-bold text-developer opacity-0 uppercase tracking-[0.25em] leading-none"
              animate={{
                opacity: activePersona === "developer" ? 0.06 : 0,
                y: activePersona === "developer" ? 0 : -10,
              }}
              transition={TRANSITION}
            >
              Code & Build
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* ── Full-screen hover hit areas (z-50 — topmost relative to HUD) ── */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 z-50 cursor-default hidden lg:block"
        onMouseEnter={() => setActivePersona("designer")}
        onMouseLeave={() => setActivePersona("neutral")}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2 z-50 cursor-default hidden lg:block"
        onMouseEnter={() => setActivePersona("developer")}
        onMouseLeave={() => setActivePersona("neutral")}
      />

      {/* ── HUD Components (z-20) ── */}
      <DesignerHUD activePersona={activePersona} />
      <DeveloperHUD activePersona={activePersona} />

      {/* ── Floating Design icons (ambient, left side) ── */}
      {designerIcons.map(({ Icon, x, y, size, delay, rotate }, i) => (
        <motion.div
          key={`design-${i}`}
          className="absolute z-[8] pointer-events-none"
          style={{ left: x, top: y }}
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              activePersona === "developer"
                ? 0
                : activePersona === "designer"
                  ? 0.4
                  : 0.08,
            scale: activePersona === "designer" ? 1.1 : 0.85,
            rotate: rotate ?? 0,
          }}
          transition={{ ...TRANSITION, delay: activePersona === "designer" ? delay * 0.15 : 0 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 3.5 + delay,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <Icon
              size={size}
              strokeWidth={1.5}
              className="text-designer"
            />
          </motion.div>
        </motion.div>
      ))}

      {/* ── Floating Code icons (ambient, right side) ── */}
      {developerIcons.map(({ Icon, x, y, size, delay, rotate }, i) => (
        <motion.div
          key={`dev-${i}`}
          className="absolute z-[8] pointer-events-none"
          style={{ left: x, top: y }}
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              activePersona === "designer"
                ? 0
                : activePersona === "developer"
                  ? 0.4
                  : 0.08,
            scale: activePersona === "developer" ? 1.1 : 0.85,
            rotate: rotate ?? 0,
          }}
          transition={{ ...TRANSITION, delay: activePersona === "developer" ? delay * 0.15 : 0 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 3.5 + delay,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <Icon
              size={size}
              strokeWidth={1.5}
              className="text-developer/70"
            />
          </motion.div>
        </motion.div>
      ))}

      {/* ── Persona label: Designer (left edge, single line typography) ── */}
      <motion.div
        className="absolute left-4 md:left-6 lg:left-10 xl:left-16 top-[45%] -translate-y-1/2 z-20 select-none pointer-events-none w-max hidden lg:block"
        variants={labelVariants}
        animate={getState("designer")}
        transition={TRANSITION}
      >
        <div className="flex flex-col items-start w-max">
          <span className="text-[10px] font-mono text-designer/50 tracking-[0.3em] uppercase mb-1 whitespace-nowrap">
            Creative
          </span>
          <span className="text-[clamp(1.5rem,4.5vw,5.5rem)] font-black tracking-tighter leading-[0.85] whitespace-nowrap" style={{ textShadow: "0 0 30px var(--color-designer)" }}>
            <span className="text-designer">Design</span>
            <span className="text-foreground/30">er</span>
            <span className="text-designer">.</span>
          </span>
        </div>
      </motion.div>

      {/* ── Persona label: Developer (right edge, single line code-styled) ── */}
      <motion.div
        className="absolute right-4 md:right-6 lg:right-10 xl:right-16 top-[45%] -translate-y-1/2 z-20 select-none pointer-events-none w-max hidden lg:block"
        variants={labelVariants}
        animate={getState("developer")}
        transition={TRANSITION}
      >
        <div className="flex flex-col items-end w-max">
          <span className="text-[10px] font-mono text-developer/50 tracking-[0.3em] mb-1 whitespace-nowrap">
            {"<Component />"}
          </span>
          <span className="text-[clamp(1.5rem,4.5vw,5.5rem)] font-black tracking-tighter leading-[0.85] whitespace-nowrap" style={{ textShadow: "0 0 30px var(--color-developer)" }}>
            <span className="text-developer">{"<Dev"}</span>
            <span className="text-foreground/30">{"eloper"}</span>
            <span className="text-developer">{" />"}</span>
          </span>
          <span className="text-xs font-mono text-developer/40 tracking-wider mt-2 whitespace-nowrap">
            {"{ code: true }"}
          </span>
        </div>
      </motion.div>

      {/* ── Mobile Hit Areas & Interactive Zones (block lg:hidden) ── */}
      <div className="block lg:hidden absolute inset-0 z-30 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-1/2 z-30 pointer-events-auto cursor-pointer"
          onClick={() => setActivePersona(activePersona === "designer" ? "neutral" : "designer")}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-1/2 z-30 pointer-events-auto cursor-pointer"
          onClick={() => setActivePersona(activePersona === "developer" ? "neutral" : "developer")}
        />
      </div>

      {/* ── Mobile Stacked Typography (block lg:hidden) ── */}
      <div className="block lg:hidden absolute inset-0 z-20 pointer-events-none">
        {/* Designer Mobile Label */}
        <motion.div
          className="absolute top-[80px] left-1/2 -translate-x-1/2 select-none w-max flex flex-col items-center"
          variants={labelVariants}
          animate={getState("designer")}
          transition={TRANSITION}
        >
          <span className="text-[10px] font-mono text-designer/50 tracking-[0.3em] uppercase mb-1 whitespace-nowrap">
            Creative
          </span>
          <span className="text-4xl sm:text-5xl font-black tracking-tighter leading-none whitespace-nowrap" style={{ textShadow: "0 0 30px var(--color-designer)" }}>
            <span className="text-designer">Design</span>
            <span className="text-foreground/30">er</span>
            <span className="text-designer">.</span>
          </span>
        </motion.div>

        {/* Developer Mobile Label */}
        <motion.div
          className="absolute bottom-[256px] left-1/2 -translate-x-1/2 select-none w-max flex flex-col items-center"
          variants={labelVariants}
          animate={getState("developer")}
          transition={TRANSITION}
        >
          <span className="text-[10px] font-mono text-developer/50 tracking-[0.3em] mb-1 whitespace-nowrap">
            {"<Component />"}
          </span>
          <span className="text-4xl sm:text-5xl font-black tracking-tighter leading-none whitespace-nowrap" style={{ textShadow: "0 0 30px var(--color-developer)" }}>
            <span className="text-developer">{"<Dev"}</span>
            <span className="text-foreground/30">{"eloper"}</span>
            <span className="text-developer">{" />"}</span>
          </span>
          <span className="text-xs font-mono text-developer/40 tracking-wider mt-1.5 whitespace-nowrap">
            {"{ code: true }"}
          </span>
        </motion.div>
      </div>

      {/* ── Atmospheric Glow Background (z-0 / z-[5], behind silhouette) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Designer Persona Aura */}
        <motion.div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-designer blur-[100px] sm:blur-[140px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: activePersona === "designer" ? 0.35 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        {/* Developer Persona Aura */}
        <motion.div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-developer blur-[100px] sm:blur-[140px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: activePersona === "developer" ? 0.35 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      {/* ── Silhouette images (bottom-center, large, isolated in z-10) ── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl lg:max-w-4xl xl:max-w-5xl h-[70%] z-10 pointer-events-none">
        {/* Developer silhouette (base, grayscale) */}
        <motion.img
          src="/imgs/hero/dev-no-bg.png"
          alt="Developer persona silhouette"
          className="absolute inset-0 w-full h-full object-contain object-bottom"
          animate={{ 
            opacity: activePersona === "designer" ? 0 : 1 
          }}
          transition={CLIP_TRANSITION}
        />

        {/* Designer silhouette (overlay, color) */}
        <motion.img
          src="/imgs/hero/designer-no-bg.png"
          alt="Designer persona silhouette"
          className="absolute inset-0 w-full h-full object-contain object-bottom"
          animate={{ 
            clipPath: designerClip[activePersona],
            opacity: activePersona === "developer" ? 0 : 1 
          }}
          transition={CLIP_TRANSITION}
        />
      </div>

      {/* ── Bottom gradient (smooth transition to next section, overlaying bottom of silhouette to blend) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-[12] pointer-events-none" />

      {/* ── Non-obstructive Bottom Overlay (Bio & CTAs, z-[60] to keep clickable) ── */}
      <div className="absolute bottom-8 left-0 right-0 z-[60] flex flex-col md:flex-row justify-between items-center md:items-end px-6 md:px-12 gap-4 pointer-events-none">
        {/* Bio Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...TRANSITION, delay: 0.2 }}
          className="max-w-xs md:max-w-sm text-center md:text-left pointer-events-none bg-background/40 backdrop-blur-md p-4 rounded-xl border border-foreground/10 shadow-xl"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono uppercase tracking-wider mb-2">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-1.5 w-1.5 rounded-full bg-primary"
            />
            Disponível para novos desafios
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed font-sans">
            Olá, sou Henrique Negri Rodrigues. Traduzo necessidades de negócio em arquiteturas visuais escaláveis e escrevo o código correspondente.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...TRANSITION, delay: 0.3 }}
          className="flex flex-row gap-2 pointer-events-auto"
        >
          <a
            href="#works"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5 text-xs shadow-lg")}
          >
            Casos de Estudo <ArrowRight size={12} />
          </a>
          <a
            href="#processo"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 text-xs backdrop-blur-md bg-background/30 shadow-lg",
            )}
          >
            Processo <Terminal size={12} />
          </a>
          <a
            href="#contato"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 text-xs backdrop-blur-md bg-background/30 shadow-lg",
            )}
          >
            Contato <Terminal size={12} />
          </a>
        </motion.div>
      </div>

    </section>
  );
}
