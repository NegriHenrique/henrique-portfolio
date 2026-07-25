import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

export function LanguageToggle() {
  const { lang, toggleLang } = useAppStore();
  
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 120, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Magnetic pull radius
    if (Math.abs(distanceX) < 40 && Math.abs(distanceY) < 40) {
      x.set(distanceX * 0.4);
      y.set(distanceY * 0.4);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={toggleLang}
      style={{ x: springX, y: springY }}
      className="fixed top-8 right-8 z-50 px-4 py-2 rounded-full bg-zinc-950/50 backdrop-blur-md border border-white/5 shadow-2xl flex items-center justify-center cursor-none"
    >
      <div className="flex items-center gap-2 font-mono text-sm tracking-widest">
        <span className={lang === 'pt' ? 'text-white font-bold' : 'text-zinc-600 font-light hover:text-zinc-400 transition-colors'}>
          PT
        </span>
        <span className="text-zinc-800">/</span>
        <span className={lang === 'en' ? 'text-white font-bold' : 'text-zinc-600 font-light hover:text-zinc-400 transition-colors'}>
          EN
        </span>
      </div>
    </motion.button>
  );
}
