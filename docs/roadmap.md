# Roadmap — AI Changelog Generator

**Version:** 1.0
**Author:** Omar Abdelaziz
**Last updated:** 2026-05-05

> *This roadmap is a living document. It evolves with each iteration based on what was validated in the previous one. See iteration spec and validation docs for per-iteration detail.*

---

## Guiding Principle

Ship the smallest useful thing first. Validate it works. Then add the layer on top.

Iteration 1 works without AI and without a server — just a CLI reading local git history. Every iteration after that adds one major capability. Nothing is built speculatively.

---

## Iterations at a Glance

| Iteration | Theme | Status | Target |
|---|---|---|---|
| 1 | CLI Foundation | In Progress | May 2026 |
| 2 | AI + Web Dashboard | Planned | July 2026 |
| 3 | Monetization + Polish | Planned | October 2026 |
| 4 | Growth + Integrations | Planned | 2027 |

---

## Iteration 1 — CLI Foundation

**Goal:** Prove the core mechanic works. A developer runs one command and gets a readable changelog from their git history — no login, no internet, no AI required.

**Why this first:** Before adding AI, we need to validate that the output format, categorization logic, and developer experience are correct. Pattern-based generation is fast to build and lets us test the UX without API costs or latency.

### Deliverables
- `npx ai-changelog` CLI tool
- Reads local git log via `git log --pretty=format`
- Categorizes commits into: Features, Bug Fixes, Breaking Changes, Other
- Outputs valid Markdown to stdout
- Works on any git repository without configuration

### Requirements Covered
- REQ-005 — CLI Tool *(In Progress)*

### Success Criteria
- CLI runs in under 2 seconds for 500 commits
- Output is readable by a non-technical user
- Zero configuration required to get a useful result

### Out of Scope
- AI-based generation (Iteration 2)
- Web dashboard or public changelog page (Iteration 2)
- Authentication or user accounts (Iteration 2)

---

## Iteration 2 — AI + Web Dashboard

**Goal:** Replace pattern-matching with genuine AI understanding. Add a hosted web dashboard where developers connect their GitHub repos and get a public changelog page.

**Why this second:** The CLI in Iteration 1 proves the format. Iteration 2 proves the value — the AI layer is what separates this from free tools like Release Drafter. The web dashboard turns a CLI utility into a SaaS product.

### Deliverables
- Claude AI API integration — commit messages analyzed semantically, not just pattern-matched
- GitHub OAuth login (NextAuth)
- Dashboard: connect a repo, trigger changelog generation, view history
- Public changelog page per repository (`aichangelog.dev/{username}/{repo}`)
- Deployment to Vercel

### Requirements Covered
- REQ-001 — GitHub OAuth Authentication
- REQ-002 — Git Commit Retrieval
- REQ-003 — AI Changelog Generation
- REQ-004 — Public Changelog Page
- REQ-007 — Performance (P95 under 10s)

### Success Criteria
- User can sign in with GitHub, connect a repo, and get an AI-generated changelog in under 60 seconds
- Public changelog page is accessible without login and renders correctly on mobile
- AI output is coherent and readable for at least 85% of tested repositories
- Deployed and live on Vercel

### Out of Scope
- Payment processing (Iteration 3)
- Tier enforcement (Iteration 3)
- Custom branding (Iteration 3)

### Technical Notes
- AI layer uses Claude API (Anthropic) — commit-message analysis in this iteration, diff analysis on the roadmap for Iteration 4
- Next.js for the web dashboard
- GitHub API for commit retrieval (replaces local git commands used in CLI)

---

## Iteration 3 — Monetization + Polish

**Goal:** Wire in payments, enforce subscription tiers, and add the features that justify the Pro upgrade.

**Why this third:** Monetization comes after validation. If Iteration 2 shows the product works and people are using it, Iteration 3 captures that value. Building payments before anyone is using the product is premature.

### Deliverables
- Stripe integration — subscription billing
- Free tier: 1 repository, last 50 commits, "Powered by AI Changelog" badge
- Pro tier ($9/month): unlimited repositories, full commit history, remove badge
- Team tier ($29/month): multiple seats, shared repository access, audit log
- Custom branding for Pro users — logo upload, brand colors, custom domain via CNAME
- Tier limits enforced server-side

### Requirements Covered
- REQ-006 — Subscription Tiers
- REQ-008 — Custom Branding

### Success Criteria
- End-to-end payment flow works (signup → pay → access Pro features)
- Tier limits are enforced and cannot be bypassed client-side
- At least one paying customer outside of the development team
- Free tier changelogs show badge that links back to product (passive distribution)

### Out of Scope
- Diff-level AI analysis (Iteration 4)
- Third-party integrations like Slack, Linear, Notion (Iteration 4)

---

## Iteration 4 — Growth + Integrations

**Goal:** Deepen the AI capability and build the integrations that make the product sticky for teams.

### Planned Work
- **Diff analysis** — AI reads actual code changes, not just commit messages. This is the capability that makes the product defensible long-term.
- **Integrations** — Slack notifications on new changelog, Linear/Jira ticket linking, Notion export
- **GitLab support** — expand beyond GitHub
- **Changelog templates** — user-defined templates for different audiences (technical, marketing, end-user)
- **API access** — Pro users can trigger changelog generation via REST API for CI/CD integration

### Success Criteria
- Diff analysis produces measurably better output than commit-message-only on a benchmark set of real repos
- At least two integrations shipped and used by paying customers

---

## What This Is Not

This roadmap does not include:

- **Enterprise tier** — not until there is evidence of enterprise demand. Building enterprise features speculatively is a common startup mistake.
- **Mobile app** — changelogs are a developer workflow. Developers are at desks.
- **Self-hosted version** — possible later, not a priority until there is explicit demand from security-conscious teams.

---

## Roadmap Governance

- This document is updated at the end of each iteration based on what was validated
- Scope changes within an iteration require an update to the relevant spec document and a commit referencing the change
- Features are not added to an iteration after it has started unless the previous scope is descoped to compensate

---

## AI Usage Note

This roadmap was developed in conjunction with Claude AI through iterative Q&A. Iteration scope, success criteria, and sequencing decisions were made by the author based on product reasoning — not generated wholesale. See `docs/mission.md` for the product context that drives these decisions.
