# TASK BOARD

## Backlog

| Task ID | Description                              | Status      | Owner             | Notes                                                                                                                                   |
| ------- | ---------------------------------------- | ----------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 0.A     | Update Contact Data placeholders         | IN_PROGRESS | Execution Agent 1 | Mechanical batch.                                                                                                                       |
| 0.B     | Remove Zustand & Close MDX code block    | DONE        | Execution Agent 1 | Mechanical batch. Modifies package.json and luzamor.mdx.                                                                                |
| 0.C     | SEO Infrastructure & 404 Page            | DONE        | Execution Agent 1 | Mechanical batch. Modifies astro.config.mjs, public/robots.txt, src/pages/404.astro.                                                    |
| 1.1     | Encode Design Tokens in CSS              | DONE        | Execution Agent 1 | Logical TDD (3 phases).                                                                                                                 |
| 1.2     | Integrate Inter Typography               | DONE        | Execution Agent 1 | Visual TDD (4 phases).                                                                                                                  |
| 1.3     | Complete BaseLayout                      | DONE        | Execution Agent 1 | Visual TDD (4 phases).                                                                                                                  |
| 1.4     | Refactor [slug].astro to use BaseLayout  | DONE        | Execution Agent 1 | Logical TDD (3 phases). Validation limited to file due to MDX blocker.                                                                  |
| 1.5     | Motion Compliance Audit                  | DONE        | Execution Agent 1 | Visual validation.                                                                                                                      |
| 1.6     | Fix invalid work MDX schema              | DONE        | Execution Agent 1 | Mechanical batch. Includes MDX frontmatter + LazyIframe/Lab adjustments.                                                                |
| 2.1     | Define Epic 2 task list                  | DONE        | Execution Agent 1 | Governance task. Populate Epic 2 backlog before implementation work.                                                                    |
| 2.2     | Define Epic 2 scope and success criteria | DONE        | Orchestrator      | Governance task. Scope/success criteria defined.                                                                                        |
| 2.3     | Curate works content priorities          | DONE        | Orchestrator      | Editorial task. Order defined in DESIGN_DIRECTION.md.                                                                                   |
| 2.4     | Build Works index section                | DONE        | Execution Agent 1 | Visual TDD (4 phases). Order applied.                                                                                                   |
| 2.5     | Refine work detail narrative             | DONE        | Execution Agent 2 | Visual TDD (4 phases). Token-aligned updates applied.                                                                                   |
| 2.7     | MDX render compatibility pass            | IN_PROGRESS | Execution Agent 2 | Parsing/layout pass. Files: src/pages/works/**, src/layouts/**, src/components/\*\*. Revert MDX edits; render Mermaid/images correctly. |
| 2.6     | Epic 2 QA + experience pass              | IN_PROGRESS | Execution Agent 3 | Visual validation. Files: src/\*\*.                                                                                                     |
| 2.8     | Works index polish pass                  | IN_PROGRESS | Execution Agent 1 | Visual polish. Files: src/components/Works/\*\*, src/pages/index.astro.                                                                 |

## Coordination

- Orchestrator is the only role allowed to edit docs.
- Agents must only touch their owned files and stop if a dependency is blocked.
- If a task is blocked, do not change scope; report to the Orchestrator.
- No parallel edits on the same file paths across agents.

_Additional tasks from Epics 2-5 will be populated as Epic 1 nears completion._
