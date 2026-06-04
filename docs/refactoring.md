# Refactoring

Two non-trivial refactoring examples from the actual source code, showing the before state, what changed, and what went wrong along the way.

---

## Refactoring 1: Extract Function from generateChangelog

**What the code did before:**

The original `generateChangelog` function did everything in one block. Categorization, grouping, and formatting were all tangled together with no separation between them:

```typescript
export function generateChangelog(commits: Commit[]): string {
  const sections: Record<string, Commit[]> = {};

  for (const commit of commits) {
    const lower = commit.message.toLowerCase();
    let category = 'Other Changes';
    if (lower.startsWith('feat')) category = 'Features';
    else if (lower.startsWith('fix')) category = 'Bug Fixes';
    else if (lower.startsWith('docs')) category = 'Documentation';
    else if (lower.startsWith('chore')) category = 'Chores';
    else if (lower.includes('breaking')) category = 'Breaking Changes';

    if (!sections[category]) sections[category] = [];
    sections[category].push(commit);
  }

  let output = '# Changelog\n\n';
  for (const [section, commits] of Object.entries(sections)) {
    output += `## ${section}\n`;
    for (const commit of commits) {
      const short = commit.hash.slice(0, 7);
      output += `- ${commit.message} *(${commit.author}, ${commit.date})* \`${short}\`\n`;
    }
    output += '\n';
  }
  return output;
}
```

**The problem:**

This function was doing three things at once: deciding what category a commit belongs to, grouping commits by that category, and formatting the output string. Any change to the categorization logic required reading through the formatting logic to find the right place. Writing a unit test for just the categorization meant you had to pass in full commits and inspect the formatted output string to verify what happened.

**What I changed:**

Extracted `categorizeCommit` and `formatCommitLine` as separate pure functions, and moved the prefix mapping to a `CATEGORY_PREFIXES` constant to replace the if/else chain:

```typescript
const CATEGORY_PREFIXES: Record<string, string> = {
  feat: 'Features',
  fix: 'Bug Fixes',
  docs: 'Documentation',
  refactor: 'Refactoring',
  test: 'Tests',
  chore: 'Chores',
  perf: 'Performance',
  style: 'Style',
};

function categorizeCommit(message: string): string {
  const lower = message.toLowerCase();
  const prefix = Object.keys(CATEGORY_PREFIXES).find(p => lower.startsWith(p));
  if (prefix) return CATEGORY_PREFIXES[prefix];
  if (lower.includes('breaking')) return 'Breaking Changes';
  return 'Other Changes';
}

function formatCommitLine(commit: Commit): string {
  const short = commit.hash.slice(0, 7);
  return `- ${commit.message} *(${commit.author}, ${commit.date})* \`${short}\``;
}

export function generateChangelog(commits: Commit[]): string {
  const sections = commits.reduce<Record<string, Commit[]>>((acc, commit) => {
    const category = categorizeCommit(commit.message);
    return { ...acc, [category]: [...(acc[category] ?? []), commit] };
  }, {});
  // ...
}
```

**Why it is better:**

`categorizeCommit` can now be tested in isolation without building a full commit array and parsing formatted output. `generateChangelog` now reads as a high-level orchestration: group by category, build header, build body, join. Adding a new prefix category means adding one line to `CATEGORY_PREFIXES`, nothing else. This is the Extract Function refactoring from Fowler's catalog.

**What went wrong along the way:**

The first version of the extracted function used only the `CATEGORY_PREFIXES` object and nothing else. That broke detection of "breaking change" commits because those don't follow a prefix pattern -- "breaking" can appear anywhere in the message. The tests caught it immediately but it still meant going back and adding the `includes('breaking')` check as a fallback after the extraction, which felt like a step backwards at the time.

---

## Refactoring 2: Add Error Handling at the Boundary

**What the code did before:**

The original `index.ts` called `getCommits` directly with no error handling. If someone ran the tool outside a git repository, Node.js threw a raw `execSync` error and dumped a full stack trace to the terminal:

```typescript
const repoPath = process.argv[2] || '.';
const commits = getCommits(repoPath);
console.log(generateChangelog(commits));
```

Running this on an invalid path produced something like:

```
Error: Command failed: git -C "/not/a/repo" log ...
    at checkExecSyncError (node:child_process:885:11)
    at execSync (node:child_process:957:15)
    at getCommits (/src/index.ts:8:15)
    ...
```

**The problem:**

That output is useless to anyone not actively debugging the source code. A developer running `npx ai-changelog /wrong/path` should get one clear line telling them what happened, not a Node.js internals dump. There was also no handling for the case where the repo exists but has zero commits, which produced a changelog with just a header and no sections, looking like a bug.

**What I changed:**

Wrapped the main execution in a try/catch with a human-readable error message and proper exit codes, and added an early exit for empty commit lists:

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

**Why it is better:**

The user now gets one actionable sentence instead of a stack trace. Exit code `1` means CI pipelines and shell scripts can detect failure properly. The `commits.length === 0` check exits cleanly with code `0` because an empty repo is not an error state, it just has nothing to report. Fail fast at the boundary, clean output to the user.

**What went wrong along the way:**

The first version of the try/catch wrapped every internal call individually rather than just the top level. That meant errors inside `categorizeCommit` or `formatCommitLine` were also being caught and replaced with the same generic message, which made it very hard to find real bugs during development. The fix was to catch only at the outermost boundary and let internal errors surface normally during development.
