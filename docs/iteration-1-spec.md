# Iteration 1 — Specification

**Iteration:** 1  
**Goal:** Working CLI that reads git history and generates a structured changelog (pattern-based, no AI yet)  
**Duration:** Week 1  
**Status:** In Progress

---

## Scope

This iteration delivers the core CLI tool. No web app, no AI API calls, no authentication. The goal is a working, installable Node.js CLI that any developer can run locally.

### In Scope
- Project scaffold (TypeScript, tsconfig, package.json)
- `src/generator.ts` — commit categorization by conventional commit prefix
- `src/index.ts` — CLI entry point, reads `git log`, outputs Markdown
- Unit tests for `generateChangelog()`
- `.gitignore`, `README.md` initial version
- Git repo setup with feature branch + merge demo

### Out of Scope
- Claude AI API integration (Iteration 2)
- Web dashboard (Iteration 2)
- GitHub OAuth (Iteration 2)
- Stripe payments (Iteration 3)

---

## Requirements Covered

| Requirement | Coverage |
|---|---|
| REQ-005 (CLI Tool) | Fully implemented |
| REQ-002 (Commit Retrieval) | Partially — local git only, no GitHub API |

---

## Technical Design

```
Input:  git log (via child_process.execSync)
        ↓
Parse:  split by "|" delimiter → Commit[]
        ↓
Group:  categorizeCommit() → sections by prefix
        ↓
Format: generateChangelog() → Markdown string
        ↓
Output: stdout (pipe to CHANGELOG.md if desired)
```

### Key Functions

**`categorizeCommit(message: string): string`**  
Maps a commit message to a human-readable category based on conventional commit prefixes (`feat`, `fix`, `docs`, etc.).

**`generateChangelog(commits: Commit[]): string`**  
Pure function. Takes an array of commits, groups them by category using `reduce`, and returns a Markdown string. No side effects.

---

## Acceptance Criteria

- [ ] Running `ts-node src/index.ts .` in any git repo outputs a valid Markdown changelog
- [ ] Commits are grouped into correct categories
- [ ] Unknown commit formats fall into "Other Changes"
- [ ] Empty repo outputs "No commits found."
- [ ] Unit tests pass for all categorization cases
