# CURRENT TASK — Execution Agent 2

**Epic:** 2 — Epic 2
**Task ID:** 2.7
**Objective:** MDX render compatibility pass.

## Scope

Adjust MDX parsing/rendering so existing MDX content (including images and Mermaid) displays correctly without changing the MDX content itself.

## File Ownership

**Owned Files:**

- `src/pages/works/**`
- `src/layouts/**`
- `src/components/**`

**Forbidden Files:**

- ALL OTHER FILES.

## Acceptance Criteria

- Existing MDX content is preserved (no copy edits).
- Mermaid graphs and images render correctly.
- Build passes without errors.

## QA Requirements

- Visual validation and binary correctness.

## TDD Phase

- Visual Task: RED → STOP.

## Dependencies

- None.

## Stop Conditions

- Changing MDX content (copy) instead of adjusting layout/parser.
- Touching any file other than the owned files.

## Blockers

- None.

## Action Required

- Revert any MDX content edits in `src/content/works/**`.
- Implement layout/parser changes so Mermaid and images render correctly without MDX edits.

## Hand-off Report (Required Each Iteration)

1. Files changed (with links)
2. Diff summary per file (what/why)
3. Editorial rationale (1-2 sentences)
4. Build/test status
5. Open issues/blockers
