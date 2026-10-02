import React, { useState, useEffect } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useAppStore } from '../../store/useAppStore';

const LED_PHRASES = [
  'UX/UI Designer',
  'Senior Frontend',
  'Creative Developer',
];

// Physical scene fonts
const FONT_GRAFFITI = '/fonts/GraffitiYouth.ttf';
const FONT_LED = '/fonts/VT323.ttf';
const FONT_WHITEBOARD = '/fonts/Caveat.ttf';

/**
 * WallTypography - Organic 3D Spatial Integration:
 * - Left Wall: "HENRIQUE NEGRI" as authentic urban graffiti spray painted on the wall.
 * - Left Wall: Snug 3D LED Digital Signboard with authentic dot-matrix display.
 * - Right Wall: Physical Whiteboard with natural wood frame, marker tray, pens, eraser,
 *   and technical sprint notes written in dry-erase Pilot marker ink.
 */
export function WallTypography() {
  const scrollProgress = useAppStore((state) => state.scrollProgress);
  const { viewport } = useThree();

  // Dynamic LED Panel phrase cycle (Tarefa 2)
  const [ledIndex, setLedIndex] = useState(0);
  const [ledText, setLedText] = useState(LED_PHRASES[0]);
  const [ledPulse, setLedPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setLedIndex((prev) => {
        const next = (prev + 1) % LED_PHRASES.length;
        setLedText(LED_PHRASES[next]);
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Subtle pulsating glow for LED status indicator
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    setLedPulse(0.82 + Math.sin(t * 3.8) * 0.18);
  });

  // Calculate smooth fade as camera flies into case study monitors (Step 1+)
  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
  const opacity = Math.max(0, 1 - clampedProgress * 3.2);

  // Tarefa 5: Spatial responsiveness based on R3F viewport.width
  const responsiveScale = viewport.width < 5.0
    ? Math.max(0.52, (viewport.width / 5.0) * 0.74)
    : Math.min(1.08, 0.80 + (viewport.width - 5.0) * 0.08);

  // Tarefa 1: Cor vibrante em OKLCH para o grafite (terracota / pôr do sol urbano)
  // Conversa com a poltrona de bambu, o gato ruivo e a iluminação acolhedora da sala
  const graffitiColor = '#df5728'; // oklch(62% 0.21 42)

  // Glowing LED neon tokens (Tarefa 2)
  const ledColor = '#00f7ff';
  const ledEmissive = '#00e5ff';

  return (
    <group name="Wall_Spatial_Typography">
      {/* =========================================================================
          PAREDE ESQUERDA (Left Wall)
          Surface plane: X = -2.14 (encostado na parede de gesso).
          Rotation: [0, Math.PI / 2, 0] faces +X into the room.
          Local +X = World -Z. Local +Y = World +Y.
          Centered at local X = 0.50 (world Z = -0.50).
          Vertical Range: Y = 1.76 to 2.50.
          100% CLEAR of monitors (top bezel at 1.385).
         ========================================================================= */}
      <group
        position={[-2.14, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[responsiveScale, responsiveScale, responsiveScale]}
      >
        {/* =======================================================================
            TAREFA 1: O GRAFITE NA PAREDE ESQUERDA
            - "HENRIQUE NEGRI" na fonte GraffitiYouth.ttf.
            - Material com spray paint look: transparent={true}, opacity={0.85}.
            - polygonOffset para evitar z-fighting e parecer pintado no gesso.
            - Subtítulo "Arte na Interface." removido conforme instrução.
           ======================================================================= */}
        <Text
          font={FONT_GRAFFITI}
          position={[0.50, 2.24, 0]}
          fontSize={0.4}
          color={graffitiColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.03}
          maxWidth={2.8}
          textAlign="center"
          fillOpacity={opacity * 0.88}
        >
          HENRIQUE NEGRI
          <meshStandardMaterial
            color={graffitiColor}
            transparent
            opacity={opacity * 0.88}
            roughness={0.92}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </Text>

        {/* =======================================================================
            TAREFA 2: O PAINEL DE LED REALISTA & PROPORCIONAL
            - Carcaça 3D ajustada e reduzida (largura 1.34) com padding perfeito.
            - Fonte Dot Matrix / LED Display (VT323.ttf).
            - Texto posicionado milimetricamente à frente no eixo Z local (z = 0.029).
            - Alinhamento obrigatório: anchorX="center", anchorY="middle".
            - Emissão realista com emissive e emissiveIntensity={2.5}.
           ======================================================================= */}
        <group position={[0.50, 1.88, 0]}>
          {/* Carcaça metálica preta e compacta com bordas chanfradas */}
          <RoundedBox
            args={[1.34, 0.22, 0.05]}
            radius={0.015}
            smoothness={4}
            position={[0, 0, 0]}
          >
            <meshStandardMaterial
              color="#111316"
              roughness={0.25}
              metalness={0.88}
              transparent
              opacity={opacity * 0.98}
            />
          </RoundedBox>

          {/* Superfície interna da matriz de LED */}
          <mesh position={[0, 0, 0.026]}>
            <planeGeometry args={[1.28, 0.17]} />
            <meshStandardMaterial
              color="#07090c"
              roughness={0.4}
              metalness={0.5}
              transparent
              opacity={opacity * 0.95}
            />
          </mesh>

          {/* Borda de realce ciano suave */}
          <lineSegments position={[0, 0, 0.028]}>
            <edgesGeometry args={[new THREE.BoxGeometry(1.34, 0.22, 0.05)]} />
            <lineBasicMaterial
              color="#00e5ff"
              transparent
              opacity={opacity * 0.30}
            />
          </lineSegments>

          {/* Ponto indicador de status LED pulsante */}
          <mesh position={[-0.56, 0, 0.029]}>
            <circleGeometry args={[0.014, 16]} />
            <meshBasicMaterial
              color={ledColor}
              transparent
              opacity={opacity * ledPulse}
            />
          </mesh>

          {/* Texto Dot Matrix perfeitamente centralizado */}
          <Text
            font={FONT_LED}
            position={[0.02, 0, 0.029]}
            fontSize={0.13}
            color={ledColor}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.06}
            fillOpacity={opacity}
          >
            {ledText}
            <meshStandardMaterial
              color={ledColor}
              emissive={ledEmissive}
              emissiveIntensity={2.5}
              toneMapped={false}
              transparent
              opacity={opacity}
            />
          </Text>
        </group>
      </group>

      {/* =========================================================================
          PAREDE DIREITA / DO FUNDO (Back Wall)
          TAREFA 3: O QUADRO BRANCO FÍSICO (WHITEBOARD)
          - Modelado diretamente em 3D: superfície branca levemente refletiva.
          - Moldura em madeira clara (pinho/carvalho).
          - Canaleta inferior para canetas e apagador.
          - Canetas Pilot reais (azul, vermelha, preta) e apagador de feltro.
          - Textos em caligrafia realista (Caveat.ttf) em estilo anotações técnicas.
          - Posicionado no vão livre em X = -1.25, Y = 2.05, Z = -2.14.
         ========================================================================= */}
      <group
        position={[-1.25, 2.05, -2.14]}
        rotation={[0, 0, 0]}
        scale={[responsiveScale, responsiveScale, responsiveScale]}
      >
        {/* Placa do Quadro Branco (Off-white refletivo, roughness 0.20) */}
        <mesh position={[0, 0, 0.010]}>
          <boxGeometry args={[1.36, 0.86, 0.012]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.20}
            metalness={0.06}
            transparent
            opacity={opacity * 0.98}
          />
        </mesh>

        {/* Moldura de Madeira Clara (Light Natural Wood) */}
        <group name="Whiteboard_Wood_Frame">
          {/* Borda Superior */}
          <mesh position={[0, 0.445, 0.016]}>
            <boxGeometry args={[1.42, 0.035, 0.024]} />
            <meshStandardMaterial
              color="#c89868"
              roughness={0.65}
              metalness={0.06}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Borda Inferior com Canaleta Expandida (Marker Shelf / Tray) */}
          <mesh position={[0, -0.445, 0.025]}>
            <boxGeometry args={[1.42, 0.045, 0.042]} />
            <meshStandardMaterial
              color="#c89868"
              roughness={0.65}
              metalness={0.06}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Borda Lateral Esquerda */}
          <mesh position={[-0.69, 0, 0.016]}>
            <boxGeometry args={[0.035, 0.90, 0.024]} />
            <meshStandardMaterial
              color="#c89868"
              roughness={0.65}
              metalness={0.06}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Borda Lateral Direita */}
          <mesh position={[0.69, 0, 0.016]}>
            <boxGeometry args={[0.035, 0.90, 0.024]} />
            <meshStandardMaterial
              color="#c89868"
              roughness={0.65}
              metalness={0.06}
              transparent
              opacity={opacity}
            />
          </mesh>
        </group>

        {/* Acessórios 3D na Canaleta: Canetas Marcadoras Pilot & Apagador */}
        <group name="Whiteboard_Accessories" position={[0, -0.425, 0.035]}>
          {/* Caneta Azul Piloto */}
          <mesh position={[-0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.007, 0.007, 0.11, 12]} />
            <meshStandardMaterial color="#1a4c8a" roughness={0.3} metalness={0.1} />
          </mesh>

          {/* Caneta Vermelha Piloto */}
          <mesh position={[-0.17, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.007, 0.007, 0.11, 12]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.1} />
          </mesh>

          {/* Caneta Preta Piloto */}
          <mesh position={[-0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.007, 0.007, 0.11, 12]} />
            <meshStandardMaterial color="#1c2024" roughness={0.3} metalness={0.1} />
          </mesh>

          {/* Apagador de Quadro Branco com Feltro */}
          <mesh position={[0.26, 0.005, -0.002]}>
            <boxGeometry args={[0.11, 0.024, 0.030]} />
            <meshStandardMaterial color="#2d3748" roughness={0.8} />
          </mesh>
        </group>

        {/* =======================================================================
            CONTEÚDO DO QUADRO BRANCO (Caneta Marcadora Pilot / Caligrafia Real)
            - Escrito na fonte Caveat.ttf com naturalidade de reunião técnica.
            - Cores autênticas: Azul Piloto (#12437b), Preto Piloto (#1c2127), Vermelho Piloto (#b91c1c).
           ======================================================================= */}
        <group position={[0, 0, 0.019]}>
          {/* Título da Sprint (Azul Escuro Piloto) */}
          <Text
            font={FONT_WHITEBOARD}
            position={[0, 0.30, 0]}
            fontSize={0.076}
            color="#12437b"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.02}
            fillOpacity={opacity * 0.95}
          >
            HENRIQUE NEGRI // ARCHITECTURE & UX
            <meshBasicMaterial
              color="#12437b"
              transparent
              opacity={opacity * 0.95}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </Text>

          {/* Subtítulo / Objetivo da Sprint (Preto Piloto) */}
          <Text
            font={FONT_WHITEBOARD}
            position={[0, 0.20, 0]}
            fontSize={0.052}
            color="#1c2127"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.02}
            fillOpacity={opacity * 0.92}
          >
            Sprint Goal: High-converting UX & scalable engineering
            <meshBasicMaterial
              color="#1c2127"
              transparent
              opacity={opacity * 0.92}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </Text>

          {/* Linha Divisória de Marcador Azul */}
          <mesh position={[0, 0.155, 0]}>
            <planeGeometry args={[1.12, 0.004]} />
            <meshBasicMaterial
              color="#12437b"
              transparent
              opacity={opacity * 0.75}
            />
          </mesh>

          {/* Checklist de Serviços Técnicos (Preto Piloto com Visto Vermelho) */}
          <Text
            font={FONT_WHITEBOARD}
            position={[-0.54, 0.08, 0]}
            fontSize={0.050}
            color="#1c2127"
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.02}
            fillOpacity={opacity * 0.92}
          >
            [✓] Design Systems & Figma Variables (Tokens)
            <meshBasicMaterial
              color="#1c2127"
              transparent
              opacity={opacity * 0.92}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </Text>

          <Text
            font={FONT_WHITEBOARD}
            position={[-0.54, -0.01, 0]}
            fontSize={0.050}
            color="#1c2127"
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.02}
            fillOpacity={opacity * 0.92}
          >
            [✓] Fullstack Frontend (React 19, Next.js, Astro 5)
            <meshBasicMaterial
              color="#1c2127"
              transparent
              opacity={opacity * 0.92}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </Text>

          <Text
            font={FONT_WHITEBOARD}
            position={[-0.54, -0.10, 0]}
            fontSize={0.050}
            color="#1c2127"
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.02}
            fillOpacity={opacity * 0.92}
          >
            [✓] 3D WebGL / R3F Spatial UI & Shaders
            <meshBasicMaterial
              color="#1c2127"
              transparent
              opacity={opacity * 0.92}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </Text>

          <Text
            font={FONT_WHITEBOARD}
            position={[-0.54, -0.19, 0]}
            fontSize={0.050}
            color="#1c2127"
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.02}
            fillOpacity={opacity * 0.92}
          >
            [✓] Brutal Perf: Core Web Vitals &lt; 1.7s • 60 FPS GPU
            <meshBasicMaterial
              color="#1c2127"
              transparent
              opacity={opacity * 0.92}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </Text>

          {/* Anotação Técnica Destacada (Vermelho Marcador Piloto) */}
          <Text
            font={FONT_WHITEBOARD}
            position={[0, -0.30, 0]}
            fontSize={0.054}
            color="#b91c1c"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.03}
            fillOpacity={opacity * 0.95}
          >
            ⚡ Status: 60 FPS locked • Production Ready
            <meshBasicMaterial
              color="#b91c1c"
              transparent
              opacity={opacity * 0.95}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </Text>
        </group>
      </group>
    </group>
  );
}

export default WallTypography;
