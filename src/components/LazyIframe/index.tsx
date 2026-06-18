import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LazyIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  containerClassName?: string;
}

export function LazyIframe({
  src,
  title,
  containerClassName,
  ...props
}: LazyIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.disconnect(); // Para de observar após carregar
        }
      },
      { rootMargin: "300px" }, // Dispara 300px antes de aparecer na tela
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`bg-foreground/5 relative flex items-center justify-center overflow-hidden border border-foreground/10 ${containerClassName}`}
    >
      {isIntersecting ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          {...props}
        />
      ) : (
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.5, ease: "easeOut", repeat: Infinity }}
          className="text-foreground/50 text-sm font-medium"
        >
          Carregando ambiente interativo...
        </motion.span>
      )}
    </div>
  );
}
