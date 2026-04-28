# Project Constitution — AI Changelog Generator

**Version:** 1.0  
**Date:** 2026-04-28  
**Author:** Omar Abdelaziz (OmarADev)

---

## 1. Vision

To become the default tool developers reach for when they need to communicate what changed in their software — turning raw git history into clear, human-readable release notes automatically.

## 2. Mission

Build an AI-powered SaaS product that reads a repository's git commit history and generates professional, categorized changelogs — accessible as both a CLI tool and a hosted public changelog page.

## 3. Core Values

| Value | What it means in practice |
|---|---|
| **Simplicity** | One command should be enough to get a changelog. No complex config. |
| **Transparency** | Open source CLI. Clear pricing. No hidden limits. |
| **Quality over speed** | Ship fewer features that work reliably rather than many that break. |
| **Developer-first** | Every decision is made asking: "Does this make a developer's life easier?" |

## 4. Roles & Responsibilities

| Role | Person | Responsibilities |
|---|---|---|
| Product Owner | Omar Abdelaziz | Requirements, roadmap, acceptance testing |
| Lead Developer | Omar Abdelaziz | Architecture, implementation, code review |
| DevOps | Omar Abdelaziz | CI/CD, deployment, monitoring |

## 5. Technical Standards

- **Language:** TypeScript (strict mode)
- **Runtime:** Node.js 20+
- **Branching strategy:** `main` (stable) + feature branches (`feature/short-description`)
- **Commit style:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)
- **PR rule:** No direct commits to `main`. All changes via pull request.
- **Code review:** At least one self-review pass before merging
- **Tests:** All core logic must have unit tests before merging to `main`

## 6. Definition of Done

A feature is considered done when:
- [ ] Code is written and passes all existing tests
- [ ] New unit tests cover the added logic
- [ ] Linting passes with zero errors
- [ ] CI/CD pipeline passes
- [ ] Feature is documented (README or relevant doc file updated)
- [ ] Deployed to staging and manually tested

## 7. Branching & Release Strategy

```
main          ← stable, production-ready at all times
  └── feature/cli-core
  └── feature/ai-integration
  └── feature/web-dashboard
  └── feature/stripe-payments
```

Releases are tagged using semantic versioning: `v0.1.0`, `v0.2.0`, etc.

## 8. Decision Making

Decisions affecting architecture or scope are documented as a comment in the relevant GitHub Issue before implementation begins. This creates an audit trail of why decisions were made.

## 9. Change Management

Scope changes to an iteration require:
1. Updating the relevant spec document
2. Updating the affected requirement(s) in the requirements tracker
3. A commit to `main` referencing the change

## 10. Communication

All task tracking happens via GitHub Issues. All design decisions are documented in `docs/`. External communication (launch, updates) happens via Product Hunt and Twitter/X.
