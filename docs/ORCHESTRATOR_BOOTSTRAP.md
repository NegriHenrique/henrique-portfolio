# ORCHESTRATOR BOOTSTRAP

This repository uses file-based orchestration.

The operational state of the project is NOT stored in chat memory.

The source of truth is the documentation inside `/docs`.

---

# Read Order

When initializing orchestration, read files in this exact order:

1. PROJECT_CONTEXT.md
2. ENGINEERING_PRINCIPLES.md
3. DESIGN_DIRECTION.md
4. DESIGN_TOKENS.md
5. QUALITY_BAR.md
6. IMPLEMENTATION_STRATEGY.md
7. IMPLEMENTATION_PLAN.md
8. AGENT_RULES.md
9. TASK_BOARD.md
10. CURRENT_TASK.md
11. DECISION_LOG.md

---

# Operational Responsibilities

The orchestrator is responsible for:

- maintaining execution continuity
- maintaining governance files
- preventing scope creep
- preventing overwrite conflicts
- enforcing strict TDD
- enforcing DESIGN_TOKENS.md
- enforcing QUALITY_BAR.md
- keeping tasks atomic
- minimizing context usage
- minimizing token usage

The orchestrator does NOT implement production code directly.

---

# Operational Rules

- Only ONE active implementation task at a time
- Only ONE implementation owner at a time
- Every task must define:
  - scope
  - owned files
  - forbidden files
  - acceptance criteria
  - stop conditions
- Tasks must remain atomic
- Prefer subtraction over accumulation
- Reject overengineering
- Reject premature abstraction
- Reject decorative UI
- Reject unnecessary motion

---

# TDD Workflow

Visual Tasks:
RED → STOP
GREEN → STOP
VISUAL VALIDATION → STOP
REFACTOR → STOP

Logical Tasks:
RED → STOP
GREEN → STOP
REFACTOR → STOP

Mechanical Tasks:
Batch → Approval

---

# Quality Gates

Every task must pass:

1. Technical QA
2. Design QA
3. Experience QA

Final gate:
QUALITY_BAR.md

---

# Recovery Procedure

When resuming orchestration:

1. Read TASK_BOARD.md
2. Identify active task
3. Read CURRENT_TASK.md
4. Verify task state
5. Continue from the current TDD phase
6. Never restart completed work
7. Never rewrite approved decisions

---

# Documentation Responsibilities

The orchestrator must keep updated:
- TASK_BOARD.md
- CURRENT_TASK.md
- DECISION_LOG.md

Implementation changes must not happen without governance updates.

---

# Execution Philosophy

Optimize for:
- clarity
- simplicity
- editorial quality
- maintainability
- low noise
- minimal token usage
- predictable execution
- production readiness