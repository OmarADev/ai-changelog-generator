# Tech Stack: AI Changelog Generator

**Version:** 1.0
**Author:** Omar Abdelaziz
**Last updated:** 2026-05-05

> *Each technology choice is justified by a specific product requirement or constraint, not picked for familiarity alone. Alternatives considered are noted where the decision was non-obvious.*

---

## Overview

| Layer | Technology | Iteration Introduced |
|---|---|---|
| Language | TypeScript | 1 |
| Runtime | Node.js 20+ | 1 |
| CLI packaging | npx / npm | 1 |
| Web framework | Next.js 14 | 2 |
| AI engine | Claude API (Anthropic) | 2 |
| Authentication | NextAuth.js + GitHub OAuth | 2 |
| Database | PostgreSQL (via Supabase) | 2 |
| ORM | Prisma | 2 |
| Deployment | Vercel | 2 |
| Payments | Lemon Squeezy | 3 |
| Styling | Tailwind CSS | 2 |

---

## Language: TypeScript

**Why:** Type safety catches a class of bugs at compile time that are expensive to debug at runtime, especially important in a tool that reads and transforms structured git data. TypeScript also makes the codebase easier to navigate and extend as it grows.

**Why not plain JavaScript:** The product reads git commit objects, maps them to typed domain models, and transforms them through several stages before output. Without types, that pipeline is fragile. The cost of adding TypeScript (a `tsconfig.json` and type annotations) is low compared to the bugs it prevents.

**Configuration:** Strict mode enabled. No `any` types permitted in production code.

---

## Runtime: Node.js 20+

**Why:** The CLI needs to shell out to `git` commands and read the local filesystem. Node.js has first-class support for both via `child_process` and `fs`. It also shares the language with the web dashboard, meaning no context switch between CLI and server development.

**Why not Deno or Bun:** Both are viable alternatives, but Node.js has the broadest `npx` ecosystem support. Since the CLI is distributed via `npx ai-changelog`, Node.js compatibility is a hard requirement for the broadest possible user base.

---

## CLI Packaging: npx / npm

**Why:** `npx ai-changelog` requires zero installation. A developer who wants to try the tool runs one command. No global install, no dependency management, no setup. This is the lowest possible friction for the target user (solo developers).

**Distribution:** Published to npm registry. The package entry point is `src/index.ts` compiled to `dist/index.js`.

---

## Web Framework: Next.js 14

**Why:** Next.js covers the full web layer in one framework: server-side rendering, API routes, and static pages. The public changelog page (REQ-004) must be server-rendered for SEO and fast load times. The dashboard API routes handle GitHub OAuth callbacks and changelog generation requests. One framework handles both without splitting into a separate frontend and backend.

**Why not Express + React separately:** Two separate services (API server + React SPA) means two deployments, two sets of environment variables, and a CORS configuration to maintain. Next.js collapses this into a single Vercel deployment.

**Why not Remix or SvelteKit:** Next.js has the most mature Vercel integration and the best NextAuth.js support. Both are decision factors since Vercel is the target deployment platform and GitHub OAuth is a core requirement.

---

## AI Engine: Claude API (Anthropic)

**Why:** The core product claim is semantic understanding of git history, not just pattern matching. Claude's language understanding reliably interprets ambiguous, inconsistent, or poorly written commit messages and produces coherent user-facing output. This was validated manually against a set of real repositories with messy commit histories.

**Why not OpenAI GPT-4 or local models:** GPT-4 is a valid alternative technically, but Anthropic's API has competitive pricing at the usage volumes expected in early iterations, and Claude performs well on structured summarization tasks. Local models (Ollama, LLaMA) were ruled out because the hosted SaaS product cannot rely on the user having a local inference server.

**Current usage:** Commit message analysis and categorization. Diff-level code analysis is planned for Iteration 4.

**Cost control:** API calls are batched per changelog generation request. Free tier users are limited to 50 commits per request to cap per-user API cost.

---

## Authentication: NextAuth.js + GitHub OAuth

**Why GitHub OAuth:** The target user is a developer with an existing GitHub account. GitHub OAuth means zero new credentials to manage: users sign in with something they already have. It also grants the OAuth scope needed to read their repository commit history via the GitHub API.

**Why NextAuth.js:** NextAuth handles the OAuth flow, session management, and token storage with minimal configuration. It integrates directly with Next.js API routes and has built-in support for GitHub as a provider.

**Security note:** OAuth tokens are stored server-side only. They are never exposed to the client or included in API responses.

---

## Database: PostgreSQL via Supabase

**Why PostgreSQL:** Relational structure is the right fit for this data model: users have repositories, repositories have changelogs, changelogs have entries. Relational queries (join user → repos → latest changelog) are straightforward in SQL and efficient with proper indexing.

**Why Supabase:** Supabase provides a managed PostgreSQL instance with a generous free tier, built-in connection pooling, and a dashboard for inspecting data during development. It removes the operational overhead of running a database server while keeping full SQL access via Prisma.

**Why not MongoDB or Firebase:** Document databases are a poor fit for relational data with foreign key constraints. Firebase was ruled out due to vendor lock-in on querying patterns that would be difficult to migrate later.

---

## ORM: Prisma

**Why:** Prisma generates TypeScript types directly from the database schema, meaning the data layer is fully type-safe end-to-end. Database schema changes are managed via versioned migration files, giving a clear audit trail of how the data model evolved.

**Why not raw SQL or Drizzle:** Raw SQL loses type safety. Drizzle is a valid modern alternative but has a smaller ecosystem and less documentation at the time of this decision. Prisma's maturity and Next.js integration documentation made it the lower-risk choice.

---

## Deployment: Vercel

**Why:** Vercel is the natural deployment target for Next.js: it was built by the same team. Zero-config deployments from GitHub pushes, automatic preview deployments per pull request, and a global CDN for the public changelog pages (which must load fast for end users).

**Why not AWS, Railway, or Fly.io:** All are viable. Vercel wins on time-to-deploy for a solo developer: no infrastructure configuration, no Dockerfile, no environment provisioning. The tradeoff (less control, vendor lock-in on serverless functions) is acceptable at this stage.

---

## Payments: Lemon Squeezy

**Why:** Lemon Squeezy acts as merchant of record: they handle VAT collection and remittance in every country a customer pays from, automatically. As a solo developer based in Germany selling internationally, managing EU VAT compliance manually via Stripe would require an accountant and significant ongoing overhead. Lemon Squeezy removes this entirely.

**Why not Stripe:** Stripe is the more technically powerful option and the industry standard for larger SaaS products. But Stripe makes you responsible for tax compliance in every jurisdiction. At the scale and team size of this product (one developer, no accountant), that is an unacceptable operational risk. Stripe becomes the right choice if the product grows to a scale where a dedicated finance function makes sense.

**Why not Paddle:** Paddle is a valid alternative with the same merchant-of-record model. Lemon Squeezy wins on developer experience, simpler dashboard, and better documentation for solo indie developers, which matches the target operator profile of this product.

**Introduced in:** Iteration 3. Payments are not wired in until the product is validated.

---

## Styling: Tailwind CSS

**Why:** Tailwind enables consistent UI without writing custom CSS files. Utility classes keep styles co-located with components, which matters in a codebase maintained by one developer. The output is also smaller than a traditional CSS framework because unused styles are purged at build time.

**Why not plain CSS or MUI/shadcn:** Plain CSS at scale becomes hard to maintain without a naming convention (BEM etc.). shadcn/ui is built on Tailwind and will be used for component primitives (buttons, modals, inputs): it is a layer on top of Tailwind, not a replacement.

---

## What Is Deliberately Not Here

| Technology | Reason excluded |
|---|---|
| Redis / caching layer | Not needed until traffic justifies it. Premature optimisation. |
| Docker | Vercel serverless functions remove the need for containerisation in this architecture. |
| GraphQL | REST API routes in Next.js are sufficient. GraphQL adds complexity without a client-side benefit at this scale. |
| Microservices | Single Next.js app is the right architecture until there is a concrete reason to split. |

---

## AI Usage Note

Technology choices were made by the author based on product requirements and prior experience. Claude AI was used to pressure-test specific decisions (e.g. Stripe vs Paddle, NextAuth vs custom OAuth) through structured Q&A. Final decisions and justifications are the author's own.
