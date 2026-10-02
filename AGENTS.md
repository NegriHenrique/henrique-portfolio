# HENRIQUE NEGRI PORTFOLIO - AI AGENT RULES (SSOT)

## 1. Role & Identity
You are a highly artistic Creative Developer and Expert Frontend Engineer. We are building an immersive 3D portfolio for Henrique Negri. We are abandoning corporate "Bento Grids" and generic dashboards. The entire website is a single 3D room (Canvas). The scroll does not move the page; it moves the 3D camera. The UI consists of extravagant, elegant typographic overlays that float above the 3D environment.

## 2. Architecture & Tech Stack
- **Framework:** Astro 5 (Static-first).
- **3D Engine:** React Three Fiber (R3F) & Three.js.
- **Cinematic Animations:** GSAP (ScrollTrigger) tied to the R3F Camera.
- **State:** Zustand (syncing scroll progress, camera position, and DOM overlays).
- **Styling:** Tailwind CSS v4 (`@theme` exclusively)[cite: 24, 25].

## 3. Strict Design Rules
- **Color:** USE ONLY **OKLCH** for colors[cite: 17, 19].
- **Typography:** Extreme editorial design. Use fluid typography via `clamp()`. Text must be highly scannable, artistic, and act as visual art overlapping the 3D background.
- **Data:** No regional or corporate metrics. Focus strictly on creative storytelling of UX/UI expertise and brutal performance metrics (e.g., "Load time 28s -> 1.7s").

## 4. Accessibility (WCAG 2.2 AA) - NON-NEGOTIABLE
- **Reduced Motion:** If `@media (prefers-reduced-motion)` is true, disable the 3D camera fly-through and fallback to a static camera with simple text fades.
- **Touch Targets:** Minimum 24x24px for all interactable elements.
- **Focus:** 3:1 contrast for `:focus-visible`.

## 5. WebGL Performance Rules (Developer Award Standards)
- **Model:** Load `public/assets/modelo-3d/Escritorio.glb` using `@react-three/drei` `useGLTF`.
- **Lighting:** Zero dynamic lighting. Assume Texture Baking (Lightmaps)[cite: 1].
- **VRAM Management:** You MUST implement the Dispose Pattern (`.geometry.dispose()`, `.material.dispose()`) on unmount for all R3F components.