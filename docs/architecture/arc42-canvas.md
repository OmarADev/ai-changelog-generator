# Architecture Communication Canvas: AI Changelog Generator

**Author:** Omar Abdelaziz
**Date:** 2026-06-14
**Format:** arc42-based Architecture Communication Canvas

---

## 1. Purpose and Context

The AI Changelog Generator turns a repository's raw git commit history into structured, human-readable release notes. The system has two delivery modes: a CLI tool (Iteration 1, shipped) and a hosted web SaaS (Iteration 2, planned). This document covers the architecture of both, clearly marking what is implemented versus what is designed.

### System Context Diagram

```
                        ┌─────────────────────────────┐
                        │   AI Changelog Generator     │
                        │                              │
  Developer ───────────▶│  CLI (npx ai-changelog)      │──────▶ stdout (markdown)
                        │                              │
  Developer ───────────▶│  Web Dashboard (Iter. 2)     │──────▶ Public Changelog Page
                        │                              │
                        └──────────────┬───────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              ▼                        ▼                         ▼
      Local git repo          Anthropic Claude API       GitHub OAuth API
      (execSync git log)      (commit summarization)     (user identity + repos)
                                                          ▼
                                                  Supabase PostgreSQL
                                                  (changelogs, users)
```

**External actors and systems:**

| Actor / System | Role |
|---|---|
| Developer (CLI user) | Runs `npx ai-changelog` in their local repo |
| Developer (web user) | Authenticates via GitHub, connects a repo, generates changelogs |
| End user (public) | Reads the public changelog page at `/[username]/[repo]` |
| Local git repository | Source of commit history (read-only via `execSync git log`) |
| Anthropic Claude API | AI engine for semantic commit analysis and categorization |
| GitHub OAuth | Authentication and repository access (read scope) |
| Supabase PostgreSQL | Persistent storage for users, repos, and generated changelogs |

---

## 2. Building Blocks

### Iteration 1 — CLI (Implemented)

```
src/
├── index.ts          Entry point: parses CLI arguments, validates path, calls generator
└── generator.ts      Core logic: reads git log, categorizes commits, formats output
    ├── readCommits()          shells out to `git log --oneline`
    ├── categorizeCommit()     maps commit prefix (feat/fix/docs/...) to category
    ├── formatCommitLine()     formats a single entry for output
    └── generateChangelog()    orchestrates the pipeline end-to-end
```

**Responsibilities split:**
- `index.ts` owns the boundary: I/O, argument parsing, error messages, process exit codes
- `generator.ts` owns the logic: it is a pure transformation pipeline with no side effects beyond reading git. This separation is why it is 100% unit-testable without mocking the filesystem.

### Iteration 2 — Web Application (Designed, not yet built)

```
app/ (Next.js 14, App Router)
├── api/
│   ├── auth/[...nextauth]/   NextAuth.js GitHub OAuth handler
│   ├── repos/                Octokit commit fetch endpoint
│   └── generate/             Calls src/ai.ts, persists result to Supabase
├── dashboard/                Authenticated user area: connect repo, trigger generation
└── [username]/[repo]/        Public changelog page (server-rendered, SEO-friendly)

src/
├── ai.ts                     Claude API client: sends commits, returns structured changelog
└── db/
    ├── schema.prisma          Prisma schema: User, Repository, Changelog, Entry
    └── client.ts              Singleton Prisma client for connection pooling on Vercel
```

---

## 3. Runtime View — Key Flows

### Flow 1: CLI changelog generation (Iteration 1, implemented)

```
User                  index.ts              generator.ts         Git (local)
  │                      │                      │                    │
  │── npx ai-changelog──▶│                      │                    │
  │                      │── validate path ──▶  │                    │
  │                      │── generateChangelog()▶│                   │
  │                      │                      │── execSync git log▶│
  │                      │                      │◀── commit list ────│
  │                      │                      │── categorize each  │
  │                      │                      │── format output    │
  │                      │◀── markdown string ──│                    │
  │◀── stdout output ────│                      │                    │
```

**Key constraint:** `execSync` is synchronous and blocking. This is intentional: the CLI is a short-lived process where blocking is correct behavior. An async approach would add complexity with no user-visible benefit.

### Flow 2: Web changelog generation (Iteration 2, designed)

```
User         NextAuth      API Route /generate      ai.ts (Claude)    Supabase
  │               │                │                     │                │
  │── GitHub OAuth▶│               │                     │                │
  │◀── session ───│               │                     │                │
  │── POST /generate ────────────▶│                     │                │
  │                               │── Octokit.commits()─▶ GitHub API     │
  │                               │◀── commit list ──────                │
  │                               │── Claude.generate() ────────────────▶│
  │                               │◀── structured changelog ─────────────│
  │                               │── prisma.changelog.create() ────────▶│
  │                               │◀── saved ───────────────────────────│
  │◀── { publicUrl } ────────────│                     │                │
```

---

## 4. Deployment View

### Iteration 1 — CLI

```
npm registry (npmjs.com)
        │
        │  npx ai-changelog
        ▼
Developer's local machine
├── Node.js 20+ runtime
├── dist/index.js  (compiled from TypeScript via `npm run build`)
└── git binary (execSync dependency — must be on PATH)
```

No server, no network call, no authentication. Zero infrastructure cost.

### Iteration 2 — Web Application

```
GitHub (source repo)
        │  push to main
        ▼
Vercel (build + deploy)
├── Serverless functions: API routes (/api/auth, /api/repos, /api/generate)
├── SSR pages: /dashboard, /[username]/[repo]  (public changelog, SEO)
└── Static assets: Tailwind-compiled CSS, client JS bundles

External services wired via environment variables:
├── ANTHROPIC_API_KEY        → Anthropic Claude API
├── GITHUB_CLIENT_ID/SECRET  → GitHub OAuth (NextAuth)
├── DATABASE_URL             → Supabase PostgreSQL (Prisma)
└── NEXTAUTH_SECRET          → NextAuth.js session signing
```

**Why Vercel over Railway or Fly.io:** Vercel is built by the Next.js team. Deploys from a GitHub push with zero configuration. Preview deployments per pull request are available for free. The tradeoff is cold-start latency on the serverless functions — acceptable because changelog generation is a user-triggered action, not a latency-sensitive API.

---

## 5. Key Architectural Decisions

### ADR-01: TypeScript with strict mode

**Decision:** TypeScript strict mode, no `any` in production code.

**Rationale:** The core pipeline reads raw git output (a string), parses it into typed `Commit` objects, maps them through categorization, and formats them. Without types, each transformation step is a potential bug. TypeScript catches mismatches at compile time. The cost — a `tsconfig.json` and type annotations — is low and one-time.

**Consequence:** ESLint + `@typescript-eslint` rules enforce this at lint time. CI blocks merges that violate it.

---

### ADR-02: Next.js over separate Express + React

**Decision:** Next.js for the web layer, not Express API + React SPA.

**Rationale:** The public changelog page at `/[username]/[repo]` must be server-rendered for SEO (changelogs are the product's public content). That requirement alone forces a server. Adding a separate React SPA on top would mean two deployments, two sets of environment variables, CORS configuration, and split mental models. Next.js collapses the API server and frontend into one deployment with one config.

**Consequence:** API routes live at `app/api/` and share the same runtime as the frontend. NextAuth integrates natively because it is a Next.js plugin.

---

### ADR-03: Claude API over GPT-4

**Decision:** Anthropic Claude API for commit analysis.

**Rationale:** The product claim is semantic understanding — transforming "fix null pointer crash in auth" into "Fixed a crash that occurred when signing in without a prior session" at a level no regex can reach. Claude was manually validated against a set of real repositories with inconsistent, abbreviated commit messages. It performs well on structured summarization tasks and has competitive pricing at the expected usage volumes (50-200 commits per generation request).

**Consequence:** `ANTHROPIC_API_KEY` is a required environment variable. API calls are batched per generation request to control cost. Free tier users are capped at 50 commits per request.

---

### ADR-04: Supabase over self-hosted PostgreSQL

**Decision:** PostgreSQL via Supabase (managed), not a self-hosted instance.

**Rationale:** The data model is relational: users have repositories, repositories have changelogs. SQL joins are the right query model. Supabase provides managed PostgreSQL with a free tier, built-in connection pooling (critical on Vercel's serverless architecture where each function invocation would otherwise open a new connection), and a dashboard for inspecting data during development.

**Consequence:** Prisma connects via `DATABASE_URL` pointing to the Supabase connection pooler endpoint, not the direct Postgres port.

---

### ADR-05: Lemon Squeezy over Stripe

**Decision:** Lemon Squeezy as the payment provider (Iteration 3).

**Rationale:** Lemon Squeezy is a merchant of record: they collect and remit VAT in every customer jurisdiction automatically. As a solo developer selling internationally from Germany, Stripe would require manual VAT compliance across 40+ countries — a legal and accounting burden that is not viable without a finance function.

**Consequence:** Payment integration is deferred to Iteration 3. Lemon Squeezy's API differs from Stripe's — no migration path if switching later.

---

## 6. Quality Goals

| Quality attribute | Target | Mechanism |
|---|---|---|
| Correctness | Core logic must categorize commits accurately | 100% unit test coverage on `generator.ts`, all branches tested |
| Maintainability | Each function has one reason to change | SRP enforced via code review and SonarCloud smells |
| Type safety | No runtime type errors in the transformation pipeline | TypeScript strict mode, no `any` in production |
| Deployability | Zero-config deployment on push to `main` | Vercel + GitHub Actions CI gate (lint → test → build) |
| Security | OAuth tokens never exposed to client | NextAuth stores tokens server-side only |

---

## 7. Risks and Technical Debt

| Risk | Impact | Mitigation |
|---|---|---|
| `execSync` blocks on large repos (10k+ commits) | CLI hangs for seconds | Cap at `--max-count=200` in Iteration 2; streaming in Iteration 3 |
| Vercel cold starts on the `/api/generate` route | User waits 1-2 seconds on first request | Acceptable now; move to Vercel Pro (faster cold starts) if traction justifies it |
| SonarCloud complexity warning on `generateChangelog()` | Harder to maintain as categories grow | Refactor to a `commitTypeMap` lookup object in Iteration 2 |
| No retry logic on Claude API calls | Transient API errors surface to users | Add exponential backoff in `src/ai.ts` before Iteration 2 launch |
| Single-developer team | No review of critical changes | Enforced self-review checklist in `constitution.md` definition of done |
