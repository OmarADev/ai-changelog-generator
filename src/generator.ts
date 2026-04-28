export type Commit = {
  hash: string;
  message: string;
  author: string;
  date: string;
};

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

  const header = [
    '# Changelog\n',
    `_Generated on ${new Date().toISOString().split('T')[0]}_\n`,
  ];

  const body = Object.entries(sections).flatMap(([section, sectionCommits]) => [
    `\n## ${section}\n`,
    ...sectionCommits.map(formatCommitLine),
  ]);

  return [...header, ...body].join('\n');
}
