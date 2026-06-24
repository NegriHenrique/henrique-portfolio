import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

export function CustomCursor() {
  const { activePersona } = useAppStore();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY]);

  let cursorContent = null;

  if (activePersona === 'designer') {
    cursorContent = (
      <div className="w-6 h-6 flex items-center justify-center relative">
        <div className="w-full h-[2px] bg-designer absolute" />
        <div className="h-full w-[2px] bg-designer absolute" />
      </div>
    );
  } else if (activePersona === 'developer') {
    cursorContent = (
      <div className="w-5 h-6 bg-developer opacity-80" />
    );
  } else {
    cursorContent = (
      <div className="w-8 h-8 rounded-full border border-white/50" />
    );
  }

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {cursorContent}
    </motion.div>
  );
}
