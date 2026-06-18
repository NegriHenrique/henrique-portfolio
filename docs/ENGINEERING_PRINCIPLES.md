# Engineering Principles

## Product Principles

Prefer:
- fewer and deeper case studies
- restrained sophistication
- intentional architecture
- calm interfaces
- incremental complexity

Avoid:
- feature accumulation
- generic portfolio patterns
- excessive card grids
- dashboard aesthetics
- gimmick-driven UX

---

## Noise Control

Every new UI element must justify its existence.

If an element does not improve:
- clarity
- hierarchy
- usability
- narrative
- pacing

it should be removed.

Prefer subtraction over accumulation.

---

## Anti-Abstraction Rule

Do not abstract:
- layouts used once
- hooks used once
- tokens without repetition
- components without behavioral variation

Prefer duplication over premature abstraction.

Abstraction is only allowed after repetition proves necessity.

---

## Design System Governance

The interface must follow explicit design constraints.

Avoid:
- arbitrary spacing values
- one-off animation timings
- inconsistent container widths
- component-specific visual logic
- random visual exceptions

Prefer:
- token-driven spacing
- reusable motion patterns
- consistent layout rhythm
- restrained visual language

---

## Motion Principles

Motion exists to:
- reinforce hierarchy
- support orientation
- improve perceived smoothness

Motion must never:
- compete with content
- delay interaction
- create spectacle
- feel decorative

If motion calls attention to itself, remove it.

---

## Performance Budgets

Target budgets:

- Initial JS < 120kb gzipped
- LCP < 2.0s
- CLS < 0.05
- INP < 200ms

Rules:
- WebGL must remain isolated from the core experience
- 3D assets must be lazy-loaded
- hydration must be minimized aggressively
- motion must remain GPU-safe

---

## Stop Conditions

Do not implement a feature if it:
- reduces clarity
- harms performance budgets
- introduces unnecessary complexity
- weakens editorial pacing
- increases visual noise
- requires excessive explanation
- exists only because it is technically possible

---

## Strict TDD Workflow

All implementation follows:

RED
→ approval

GREEN
→ approval

VISUAL VALIDATION
→ approval

REFACTOR
→ approval

No production implementation proceeds without explicit validation.