import { useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";

export function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePersona = useAppStore((state) => state.activePersona);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Linear interpolation (lerp) for smooth mouse follow effect
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (containerRef.current) {
        containerRef.current.style.setProperty("--mouse-x", `${currentX}px`);
        containerRef.current.style.setProperty("--mouse-y", `${currentY}px`);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getSpotlightGradient = () => {
    switch (activePersona) {
      case "designer":
        return "radial-gradient(800px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), color-mix(in srgb, var(--color-designer) 15%, transparent), transparent 60%)";
      case "developer":
        return "radial-gradient(800px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), color-mix(in srgb, var(--color-developer) 15%, transparent), transparent 60%)";
      default:
        return "radial-gradient(800px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), rgba(255,255,255,0.03), transparent 60%)";
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
    >
      {/* Texture 1: Static SVG Dots Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Dynamic Spotlight */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: getSpotlightGradient(),
        }}
      />

      {/* Texture 2: CSS Noise Filter */}
      <div className="absolute inset-0 opacity-[0.025] mix-blend-screen">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="ambientNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#ambientNoise)" />
        </svg>
      </div>
    </div>
  );
}
