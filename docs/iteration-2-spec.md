# Iteration 2 — Specification

**Iteration:** 2  
**Goal:** Replace pattern-matching with Claude AI; add public changelog web page  
**Duration:** Week 2–3  
**Status:** Planned

---

## Scope

This iteration upgrades the core generation logic to use the Claude AI API, and introduces the first web-facing component: a public changelog page hosted on Vercel.

### In Scope
- Claude API integration in `src/ai.ts`
- Upgrade `generateChangelog()` to call Claude when API key is present
- Next.js web app scaffold (`web/`)
- Public changelog page rendered from generated data
- GitHub OAuth login (NextAuth.js)
- Basic dashboard: connect a repo, generate, view public link

### Out of Scope
- Stripe payments (Iteration 3)
- Custom branding (Iteration 3)
- Custom domains (Iteration 3)

---

## Requirements Covered

| Requirement | Coverage |
|---|---|
| REQ-001 (GitHub OAuth) | Fully implemented |
| REQ-002 (Commit Retrieval) | Extended — GitHub API via Octokit |
| REQ-003 (AI Generation) | Fully implemented |
| REQ-004 (Public Page) | Fully implemented |
| REQ-007 (Performance) | Partially — manual testing, no load test yet |

---

## Technical Design

```
User logs in via GitHub OAuth (NextAuth)
        ↓
Selects a repository from their GitHub account
        ↓
Backend fetches commits via GitHub API (Octokit)
        ↓
Commits sent to Claude API with structured prompt
        ↓
Claude returns categorized, human-readable changelog
        ↓
Changelog saved to database (Vercel KV or Supabase)
        ↓
Public page rendered at /[username]/[repo]
```

### Claude Prompt Design

```
You are a technical writer. Given the following git commits, generate a 
human-readable changelog grouped into: Features, Bug Fixes, Breaking Changes, 
Other. Be concise. Use plain English. Do not repeat the raw commit message — 
interpret what it means for a user.

Commits:
[commit list here]
```

---

## Acceptance Criteria

- [ ] User can log in with GitHub
- [ ] User can select a repo and click "Generate Changelog"
- [ ] Claude generates a readable, categorized changelog
- [ ] Public page is accessible at `/OmarADev/ai-changelog-generator`
- [ ] Page updates when changelog is regenerated
- [ ] Generation completes in under 10 seconds for 500 commits
