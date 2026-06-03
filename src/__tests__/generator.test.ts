import { generateChangelog, Commit } from '../generator';

test('generateChangelog includes a Features section for feat commits', () => {
  const commits: Commit[] = [
    { hash: 'abc1234567', message: 'feat: add login page', author: 'Omar', date: '2024-01-01' },
  ];

  const result = generateChangelog(commits);

  expect(result).toContain('## Features');
  expect(result).toContain('feat: add login page');
});

test('generateChangelog includes a Bug Fixes section for fix commits', () => {
  const commits: Commit[] = [
    { hash: 'def5678901', message: 'fix: resolve crash on startup', author: 'Omar', date: '2024-01-02' },
  ];

  const result = generateChangelog(commits);

  expect(result).toContain('## Bug Fixes');
  expect(result).toContain('fix: resolve crash on startup');
});

test('generateChangelog puts unrecognized commits under Other Changes', () => {
  const commits: Commit[] = [
    { hash: 'fff9999111', message: 'updated stuff', author: 'Omar', date: '2024-01-03' },
  ];

  const result = generateChangelog(commits);

  expect(result).toContain('## Other Changes');
});

test('generateChangelog returns empty sections for empty input', () => {
  const result = generateChangelog([]);

  expect(result).toContain('# Changelog');
  expect(result).not.toContain('##');
});
