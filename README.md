# AI Changelog Generator

> Turn your git commits into beautiful, human-readable release notes — automatically.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Quick Start

```bash
npx ai-changelog          # run in any git repo
npx ai-changelog /path/to/repo
```

---

## Grading Checklist (SE Course — Prof. Edlich)

### 1. Git
Branch strategy, merges, and time-travel demonstrated in this repository.
- See commit history: [github.com/OmarADev/ai-changelog-generator/commits](https://github.com/OmarADev/ai-changelog-generator/commits)
- Feature branch merged: `feature/cli-core` → `main`
- Time-travel example: `git checkout <hash>` shown in screenshots (see `docs/git-screenshots/`)
![example-screenshot](./docs/git-screenshots/03-time-travel.png)

This project uses Conventional Commits (`feat:`, `fix:`, `docs:`, etc.) — the same format our tool reads to generate changelogs.

### 2. Requirements

**a) Simple tool (Airtable):** [Airtable board](https://airtable.com/appywvnxpKDPCBdtP/tblvLl79AsGOfqzuM/viwh8sGsrPOlQJyxW) — 8 requirements with priority, MoSCoW, status, and iteration attributes. [Screenshot](docs/requirements-screenshots/airtable-requirements-board.png)

**b) Professional tool (Jira):** [Jira board](https://omar2942004.atlassian.net/jira/software/c/projects/ACG/boards/3/backlog) — same requirements with additional fields: acceptance criteria, story points, assignee, sprint. Screenshots: [Board view](docs/requirements-screenshots/jira-board-all-requirements.png) | [Issue detail](docs/requirements-screenshots/jira-issue-detail-cli-tool.png)

**AI usage note:** Claude was used to help draft requirement descriptions. Final requirements, priorities, and acceptance criteria were defined by the author.

**c) Constitution + Spec/Validation docs:**
- [Mission](docs/mission.md)
- [Roadmap](docs/roadmap.md)
- [Tech Stack](docs/techstack.md)
- [Constitution](docs/constitution.md)
- [Iteration 1 — Spec](docs/iteration-1-spec.md)
- [Iteration 1 — Validation](docs/iteration-1-validation.md)
- [Iteration 2 — Spec](docs/iteration-2-spec.md)

Full requirements list: [requirements/requirements.md](requirements/requirements.md)

### 3. Analysis
- [Startup Analysis (Classic + AI)](docs/startup-analysis.md) — 15 points covering problem, market, competition, business model, AI strategy, ethics

### 4. UML
Diagrams exported as PNG in `docs/uml/`. Drawn manually in draw.io — no AI used for diagram content.
- [Use-Case Diagram](docs/uml/use-case-diagram.png) — 18 use cases across Developer and End User actors, with GitHub / Claude AI API / Lemon Squeezy as external systems
- [Class Diagram](docs/uml/class-diagram.png) — 6 classes: CLIRunner, ChangelogGenerator, Commit, ChangelogEntry, User, Repository
- [Component Diagram](docs/uml/component-diagram.png) — 3 layers: Presentation (CLIInterface), Application (GitReader, ChangelogGenerator), External (Git Repository, stdout)
- [Activity Diagram](docs/uml/activity%20diagram.png) — CLI execution flow: validate path → read git log → parse → categorize → format → output

### 5. DDD
Diagrams exported as PNG in `docs/ddd/`. Drawn manually in draw.io.

- [Event Storming: Events](docs/ddd/event%20storming%201%20events.png) — 20 domain events across 5 bounded contexts (Authentication, Repository, Changelog, Billing, Notification)
- [Event Storming: Commands](docs/ddd/event%20storming%202%20commands.png) — 21 commands mapped to their triggering events
- [Core Domain Chart](docs/ddd/core%20domain%20chart.png) — Strategic classification: Changelog (Core), Repository (Supporting), Auth/Billing/Notification (Generic)
- [Context Mapping](docs/ddd/context%20mapping.png) — 5 bounded contexts with Customer/Supplier and Conformist integration patterns, upstream/downstream notation on every relationship
- [Bounded Context Canvas](docs/ddd/bounded%20context%20canvas.png) — Deep dive on the Changelog core domain: purpose, roles, inbound/outbound communications, ubiquitous language, business decisions, assumptions

### 6. Metrics
*Planned for Iteration 2 — SonarQube scan of the TypeScript codebase with screenshots of code quality report, coverage metrics, and explanation of any flagged issues.*

### 7. Clean Code Development
*Planned for Iteration 2 — `docs/clean-code.md` will annotate 5+ examples directly from the source with explanations, plus a personal CCD cheat sheet (PDF).*

### 8. Refactoring
*Planned for Iteration 2 — `docs/refactoring.md` will show two non-trivial before/after refactoring examples from `generator.ts` and `index.ts`, with explanation of what changed and why.*

### 9. Build Management
npm scripts defined in `package.json`:

| Script | Command | Purpose |
|--------|---------|---------|
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `test` | `jest` | Run unit tests |
| `lint` | `eslint src/**/*.ts` | Static analysis |
| `docs` | `typedoc --entryPoints src/index.ts --out docs/api` | Generate API docs |

ESLint configured in `.eslintrc.json` with `@typescript-eslint` rules.
See CI pipeline screenshot: [ci-pipeline-steps.png](docs/screenshots/ci-pipeline-steps.png)

### 10. Continuous Delivery
GitHub Actions pipeline defined in `.github/workflows/ci.yml`. Runs on every push and pull request to `main`.

Pipeline steps:
1. Install dependencies (`npm install`)
2. Lint (`npm run lint`)
3. Test (`npm test`)
4. Build (`npm run build`)

First run passed on Jun 3, 2026 in 1m 17s.
- [Pipeline overview](docs/screenshots/ci-pipeline-overview.png)
- [Pipeline steps — all passing](docs/screenshots/ci-pipeline-steps.png)

### 11. Unit Tests
Unit tests in `src/__tests__/generator.test.ts` covering the core `generateChangelog()` function.

Written manually without AI assistance (first pass — no mocks, basic assertions):
- Groups `feat:` commits under "Features"
- Groups `fix:` commits under "Bug Fixes"
- Routes unrecognized commits to "Other Changes"
- Handles empty input

All 4 tests pass. See: [tests-passing.png](docs/screenshots/tests-passing.png)

### 12. Functional Programming
*Planned for Iteration 2 — `docs/functional-programming.md` will demonstrate: pure functions, higher-order functions, immutable data, function composition, and closures — all from the existing TypeScript source.*

### 13. Vibe Coding / Agentic Coding
*Planned for Iteration 3 — will cover: (A) GUI built with Google Stitch with prompts documented, (B) middle-sized pet project via Lovable, (C) distributed app built step-by-step with Claude Code, with full proof of understanding.*

---

## Project Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── src/
│   ├── __tests__/
│   │   └── generator.test.ts   # Unit tests
│   ├── index.ts                # CLI entry point
│   └── generator.ts            # Core changelog generation logic
├── docs/
│   ├── screenshots/
│   │   ├── ci-pipeline-overview.png
│   │   ├── ci-pipeline-steps.png
│   │   └── tests-passing.png
│   ├── requirements-screenshots/
│   │   ├── airtable-requirements-board.png
│   │   ├── jira-board-all-requirements.png
│   │   └── jira-issue-detail-cli-tool.png
│   ├── mission.md
│   ├── roadmap.md
│   ├── techstack.md
│   ├── constitution.md
│   ├── iteration-1-spec.md
│   ├── iteration-1-validation.md
│   ├── iteration-2-spec.md
│   └── startup-analysis.md
├── requirements/
│   └── requirements.md
├── .eslintrc.json
├── package.json
└── tsconfig.json
```

## Tech Stack

- TypeScript / Node.js (CLI)
- Next.js (Web dashboard — Iteration 2)
- Claude AI API (Iteration 2)
- GitHub OAuth / NextAuth (Iteration 2)
- Lemon Squeezy (Payments — Iteration 2)
- Vercel (Deployment)
