#!/usr/bin/env node
import { execSync } from 'child_process';
import { generateChangelog, Commit } from './generator';

const repoPath = process.argv[2] ?? '.';

function getCommits(path: string): Commit[] {
  const raw = execSync(
    `git -C "${path}" log --pretty=format:"%H|%s|%an|%ad" --date=short`,
    { encoding: 'utf-8' }
  );
  return raw
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [hash, message, author, date] = line.split('|');
      return { hash, message, author, date };
    });
}

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
