# Iteration 1 — Validation

**Iteration:** 1  
**Date:** 2026-04-28  
**Validated by:** Omar Abdelaziz

---

## Validation Method

Each acceptance criterion from the Iteration 1 Spec was tested manually and via automated unit tests. Results are recorded below.

---

## Results

| Criteria | Method | Status | Notes |
|---|---|---|---|
| CLI outputs valid Markdown in a git repo | Manual — ran `ts-node src/index.ts .` | ✅ Pass | Output renders correctly in VS Code Markdown preview |
| Commits grouped by category | Manual + unit test | ✅ Pass | `feat:`, `fix:`, `docs:` prefixes categorized correctly |
| Unknown formats → "Other Changes" | Unit test | ✅ Pass | Messages without prefixes land in correct bucket |
| Empty repo → "No commits found." | Manual | ✅ Pass | Tested with a fresh `git init` directory |
| Unit tests pass | `npm test` | ✅ Pass | All tests green |

---

## Manual Test — Sample Output

Ran CLI against this repository's own commit history:

```markdown
# Changelog

_Generated on 2026-04-28_

## Features

- feat: add CLI entry point *(Omar Abdelaziz, 2026-04-28)* `a1b2c3d`

## Documentation

- docs: add constitution and iteration docs *(Omar Abdelaziz, 2026-04-28)* `e4f5g6h`

## Chores

- chore: initialize project with tsconfig and package.json *(Omar Abdelaziz, 2026-04-28)* `i7j8k9l`
```

Output is clean, readable, and correctly structured. ✅

---

## Issues Found

None in this iteration. The CLI is minimal by design — complexity is deferred to Iteration 2 (AI integration).

---

## Sign-off

Iteration 1 objectives met. Proceeding to Iteration 2.
