# Design Direction

## Visual Philosophy

The interface should feel:

- calm
- spacious
- intentional
- editorial
- restrained
- premium

Avoid:

- excessive density
- visual competition
- dashboard patterns
- loud interactions
- decorative overload

---

## Dual Persona — Designer / Developer

### Decisão Arquitetural

A dualidade Designer vs Developer é uma **interação de interface localizada** (UI state),
e **NÃO** um Theme Switcher global.

### O que é permitido

- Estado `activePersona` no Zustand (`'designer' | 'developer' | 'neutral'`)
- Efeitos visuais localizados **dentro do componente Hero**:
  - Transição de opacidade em títulos/labels
  - Clip-path e morph de imagens via framer-motion
  - Divisão visual da tela em duas zonas de hover
- Componentes downstream podem **ler** `activePersona` para micro-ajustes sutis
  (ex: alterar um ícone, mudar uma label), mas nunca para trocar paleta ou layout

### O que é proibido

- ❌ Atributo `data-theme="developer"` ou `data-theme="designer"` na tag `<html>`
- ❌ Troca de variáveis CSS globais (`:root`) baseada na persona
- ❌ Alteração de fundo, layout global, ou tipografia base
- ❌ Componente `ThemeToggle` ou qualquer toggle global de tema
- ❌ Script de subscribe do Zustand no `BaseLayout.astro` para mutar o DOM global

### Escopo de Efeito

O efeito da persona deve ser **sentido**, não **imposto**. Deve parecer uma
descoberta sutil durante a interação, não uma mudança drástica de contexto.

---

## Content Hierarchy

Every section must communicate value through scanning alone.

Users should understand:

- what the project is
- why it matters
- what demonstrates expertise
- what problem was solved

without requiring long-form reading.

Prefer:

- strong headlines
- hierarchy anchors
- highlighted decisions
- visual pauses

---

## Works Philosophy

The Works section should behave more like:

- a curated publication archive
- an editorial showcase
- a directed narrative

and less like:

- a project gallery
- a card catalog
- a dashboard

Maximum 3 featured works visible simultaneously.

---

## Works Priority Order

Order for featured works:

1. Henrique Portfolio: Editorial governance and technical narrative.
2. Luzamor: Design-to-code handoff and system thinking.

If more works are added, keep the list at three and rotate by editorial intent,
not by recency.

---

## Editorial Copy Direction

The writing tone should feel:

- calm
- precise
- technically confident
- direct
- thoughtful

Avoid:

- startup language
- marketing buzzwords
- exaggerated self-promotion
- generic developer clichés

Technical confidence must emerge from:

- reasoning
- decisions
- implementation quality
- clarity

---

## Mobile Experience Philosophy

The mobile experience must preserve:

- calmness
- hierarchy
- spacing rhythm
- readability
- premium perception

No section should feel:

- compressed
- crowded
- dashboard-like

---

## Lab Philosophy

A Lab entry is only valid if:

- it explores a meaningful question
- it demonstrates reasoning
- it produces transferable insight
- it contributes to the portfolio narrative

Interesting technology alone is insufficient.
