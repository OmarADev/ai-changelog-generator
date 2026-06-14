# Metrics

Two metrics tools used to evaluate code quality: Jest coverage and SonarCloud static analysis.

---

## Metric 1: Jest Test Coverage

Command: `npx jest --coverage`

Screenshot: [jest-coverage.png](screenshots/jest-coverage.png)

Result: 96.36% statement coverage, 76.92% branch coverage, 100% function coverage, 97.95% line coverage across all files. 11 tests passing across 2 test suites.

What this means: nearly every line and function in the codebase is exercised by a test. The two uncovered lines (generator.ts line 23, index.ts line 5) are minor edge cases not currently tested. Branch coverage at 76.92% means some conditional paths, likely rare error branches, are not yet hit by a test case.

---

## Metric 2: SonarCloud Static Analysis

Project analyzed: 156 lines of code, public repository.

Screenshot: [sonarcloud-dashboard.png](screenshots/sonarcloud-dashboard.png)

Results: Security rated A with 0 open issues. Reliability rated A with 0 open issues. Maintainability rated A with 3 open issues (all Code Smells, severity Minor).

Issues breakdown: [sonarcloud-issues.png](screenshots/sonarcloud-issues.png)

Issue 1 and 3 (src/__tests__/generator.test.ts line 7, src/index.ts line 2): SonarCloud recommends using `node:child_process` instead of `child_process` for built-in Node.js module imports. This is a modern Node.js convention that makes it explicit the import is a built-in module rather than an npm package. Low effort fix, not addressed yet since it does not affect functionality.

Issue 2 (src/__tests__/generator.test.ts line 19): SonarCloud flagged a redundant type assertion in one of the Part B mock tests, where a TypeScript cast was unnecessary because the value already matched the expected type. This is a leftover from writing the execSync mock and getting the types to align during development.

What this means: all three issues are Code Smells, not bugs or security risks. They represent small style and convention improvements rather than functional problems. Security and Reliability both rated A with zero issues, meaning the static analysis found no actual defects in the codebase.
