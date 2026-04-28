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

This project uses Conventional Commits (`feat:`, `fix:`, `docs:`, etc.) — the same format our tool reads to generate changelogs.

### 2. Requirements

**a) Simple tool (Airtable):** [Link to Airtable board](#) — 8 requirements with priority, MoSCoW, status, and iteration attributes.

**b) Professional tool (Jira):** [Link to Jira board](#) — same requirements with additional fields: acceptance criteria, story points, assignee, sprint.

**AI usage note:** Claude was used to help draft requirement descriptions. Final requirements, priorities, and acceptance criteria were defined by the author.

**c) Constitution + Spec/Validation docs:**
- [Constitution](docs/constitution.md)
- [Iteration 1 — Spec](docs/iteration-1-spec.md)
- [Iteration 1 — Validation](docs/iteration-1-validation.md)
- [Iteration 2 — Spec](docs/iteration-2-spec.md)

Full requirements list: [requirements/requirements.md](requirements/requirements.md)

### 3. Analysis
- [Startup Analysis (Classic + AI)](docs/startup-analysis.md) — 15 points covering problem, market, competition, business model, AI strategy, ethics

### 4. UML
*Coming in next iteration — see `docs/uml/`*

### 5. DDD
*Coming in next iteration — see `docs/ddd/`*

### 6. Metrics
*Coming in next iteration — SonarQube output in `docs/metrics/`*

### 7. Clean Code Development
*Coming in next iteration — see `docs/clean-code.md`*

### 8. Refactoring
*Coming in next iteration — see `docs/refactoring.md`*

### 9. Build Management
*Coming in next iteration — npm scripts + GitHub Actions*

### 10. Continuous Delivery
*Coming in next iteration — GitHub Actions pipeline*

### 11. Unit Tests
*Coming in next iteration — see `src/__tests__/`*

### 12. Functional Programming
*Coming in next iteration — see `docs/functional-programming.md`*

### 13. Vibe Coding / Agentic Coding
*Coming in next iteration*

---

## Project Structure

```
├── src/
│   ├── index.ts        # CLI entry point
│   └── generator.ts    # Core changelog generation logic
├── docs/
│   ├── constitution.md
│   ├── iteration-1-spec.md
│   ├── iteration-1-validation.md
│   ├── iteration-2-spec.md
│   └── startup-analysis.md
├── requirements/
│   └── requirements.md
├── package.json
└── tsconfig.json
```

## Tech Stack

- TypeScript / Node.js (CLI)
- Next.js (Web dashboard — Iteration 2)
- Claude AI API (Iteration 2)
- GitHub OAuth / NextAuth (Iteration 2)
- Stripe (Iteration 3)
- Vercel (Deployment)
