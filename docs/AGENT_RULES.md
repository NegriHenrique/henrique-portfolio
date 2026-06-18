# AGENT RULES

This file defines the global operational constraints for all agents working on the Henrique Portfolio.

## 1. TDD Workflow Enforcement
All implementation must strictly follow the appropriate TDD cycle:

**Visual Tasks:**
1. RED → Stop & wait for approval
2. GREEN → Stop & wait for approval
3. VISUAL VALIDATION → Stop & wait for approval
4. REFACTOR → Stop & wait for approval

**Logical Tasks:**
1. RED → Stop & wait for approval
2. GREEN → Stop & wait for approval
3. REFACTOR → Stop & wait for approval

**Mechanical Tasks:**
1. Batch execution → Stop & wait for approval

*Never skip phases. Never hide refactors in a GREEN phase.*

## 2. Anti-Abstraction Rules
- Do not abstract layouts used only once.
- Do not abstract hooks used only once.
- Do not create components without behavioral variation.
- Duplication is always preferable to premature abstraction.

## 3. Stop Conditions
Immediately halt implementation and report if:
- Clarity decreases.
- Performance budgets are threatened (JS > 120kb, LCP > 2.0s).
- Visual noise increases.
- Pacing weakens.
- Abstraction appears prematurely.
- Task scope expands beyond `CURRENT_TASK.md`.
- Unrelated files are modified.
- A feature is added only because it is "technically possible".

## 4. Visual Quality Constraints
All UI must adhere to `DESIGN_TOKENS.md` and `QUALITY_BAR.md`:
- **Spacing/Typography:** Use ONLY defined tokens.
- **Motion:** Must reinforce hierarchy or smoothness. If it draws attention to itself, remove it. Max duration 800ms.
- **Mobile First:** Padding ≥ `px-6`. Touch targets ≥ `44px`. No compressed layouts. Must validate across 320px, 390px, 768px, 1280px, and 1536px.
- **Noise Control:** Every UI element must justify its existence. Subtraction over accumulation.

## 5. File Ownership
- An execution agent may ONLY modify files listed in the "Owned Files" section of `CURRENT_TASK.md`.
- Opportunistic refactors are strictly forbidden.
- Formatting unrelated files is strictly forbidden.
