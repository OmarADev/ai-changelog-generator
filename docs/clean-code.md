# Clean Code Development

Five annotated examples from the actual source code, plus a personal CCD cheat sheet.

---

## Example 1: Single Responsibility Principle

**Principle:** A function should have exactly one reason to change.

**Location:** `src/generator.ts`, lines 19-25

**Code:**
```typescript
function categorizeCommit(message: string): string {
  const lower = message.toLowerCase();
  const prefix = Object.keys(CATEGORY_PREFIXES).find(p => lower.startsWith(p));
  if (prefix) return CATEGORY_PREFIXES[prefix];
  if (lower.includes('breaking')) return 'Breaking Changes';
  return 'Other Changes';
}
```

**Why this is clean:** This function does exactly one thing: take a commit message string and return a category string. It does not format output, does not write to a file, does not read from git. The only reason this function would ever need to change is if the categorization logic itself changes. That tight focus makes it trivial to understand, test, and modify in isolation.

---

## Example 2: Meaningful Names

**Principle:** Names should reveal intent: a reader should understand what something holds or does without needing a comment.

**Location:** `src/generator.ts`, lines 32-49

**Code:**
```typescript
export function generateChangelog(commits: Commit[]): string {
  const sections = commits.reduce<Record<string, Commit[]>>((acc, commit) => {
    const category = categorizeCommit(commit.message);
    return { ...acc, [category]: [...(acc[category] ?? []), commit] };
  }, {});
  ...
}
```

**Why this is clean:** Every name here earns its place. `generateChangelog` tells you exactly what the function produces. `commits` describes what the array contains, not `data`, not `arr`, not `c`. `sections` describes the grouped structure being built. `category` describes what the string represents. None of these need a comment above them: the names do that work on their own. Compare this to naming the same variables `input`, `obj`, `str`, `val` and you would need to trace the full execution to understand anything.

---

## Example 3: Pure Functions

**Principle:** A pure function takes inputs, returns an output, and touches nothing outside itself. Same input always gives the same output.

**Location:** `src/generator.ts`, lines 27-30

**Code:**
```typescript
function formatCommitLine(commit: Commit): string {
  const short = commit.hash.slice(0, 7);
  return `- ${commit.message} *(${commit.author}, ${commit.date})* \`${short}\``;
}
```

**Why this is clean:** This function reads only what you pass it and returns a string. It writes nothing, reads no global state, makes no network calls, has no randomness. Given the same `Commit` object you will always get the same formatted string back. That predictability is why it is trivial to test: just pass a commit and assert on the output, no setup or teardown needed. Pure functions are also easy to move, reuse, and reason about because they carry no hidden dependencies.

---

## Example 4: Fail Fast

**Principle:** Detect problems as early as possible and exit immediately with a clear message rather than letting bad state propagate silently.

**Location:** `src/index.ts`, lines 21-31

**Code:**
```typescript
try {
  const commits = getCommits(repoPath);
  if (commits.length === 0) {
    console.log('No commits found.');
    process.exit(0);
  }
  console.log(generateChangelog(commits));
} catch {
  console.error('Error: Not a git repository or invalid path.');
  process.exit(1);
}
```

**Why this is clean:** Two fail fast patterns are at work here. First, the `commits.length === 0` check exits immediately with a meaningful message instead of calling `generateChangelog` on empty input and producing garbage output. Second, the surrounding `try/catch` catches any failure from `execSync` (an invalid path, a missing git binary, a non-repo directory) and exits with a clear error message and a non-zero exit code. The alternative would be letting the error bubble up as a raw Node.js stack trace, which tells the user nothing useful. Failing fast keeps the error surface small and the messages actionable.

---

## Example 5: Small Functions

**Principle:** Functions should be small and do one thing. If you have to scroll to read a function, it is doing too much.

**Location:** `src/generator.ts`, all functions

**Code:**
```typescript
// categorizeCommit:  6 lines
// formatCommitLine:  3 lines
// generateChangelog: 17 lines
```

**Why this is clean:** Every function in `generator.ts` fits on one screen with room to spare. Each one has a clear entry point and a clear exit point. To understand what the module does you read three small pieces instead of one large tangled block. The alternative is a single `generateChangelog` function that reads the commits, loops through them, categorizes inline, formats inline, builds the header, builds the body, and joins everything: 60+ lines with nested conditionals and multiple responsibilities packed together. That version would be hard to test (you can't test categorization separately), hard to change (every edit risks breaking formatting or header logic), and hard to read. Keeping functions small forces the decomposition that makes code maintainable.

---

## Personal CCD Cheat Sheet

10 principles I apply every time I write code.

---

**1. Single Responsibility Principle**
Every function, class, or module should have one reason to change. If you find yourself writing "and" when describing what something does, split it.

**2. Meaningful Names**
Name things what they are, not what type they are. `commits` beats `arr`. `generateChangelog` beats `run`. A good name makes a comment unnecessary.

**3. Small Functions**
If a function needs a comment explaining what it does, it is probably too long. Aim for functions you can read in one glance.

**4. Pure Functions / No Side Effects**
Where possible, write functions that only depend on their inputs and only affect their output. They are easier to test, easier to move, and easier to trust.

**5. Fail Fast**
Check for bad input at the boundary. Exit early with a clear message. Do not let invalid state travel deep into the call stack where the error message will be confusing.

**6. DRY: Don't Repeat Yourself**
If you write the same logic twice, extract it. Duplication means two places to update when requirements change, and one of them will be forgotten.

**7. Comments Explain WHY, Not WHAT**
The code already shows what is happening. The comment should explain why a non-obvious decision was made, or what constraint forced a particular approach.

**8. Consistent Formatting**
Use a linter and formatter and commit to them. Inconsistent indentation, spacing, and bracket style create visual noise that slows down reading. Automate it so you never think about it.

**9. Early Returns Over Nested Conditionals**
```typescript
// bad
if (valid) {
  if (hasData) {
    // logic buried here
  }
}

// good
if (!valid) return;
if (!hasData) return;
// logic here, at the top level
```
Early returns keep the happy path at the left margin and make conditions easy to scan.

**10. Avoid Magic Numbers: Use Named Constants**
```typescript
// bad
if (hash.length > 7) { ... }

// good
const SHORT_HASH_LENGTH = 7;
if (hash.length > SHORT_HASH_LENGTH) { ... }
```
A named constant explains what the number means. A raw number forces the reader to guess.
