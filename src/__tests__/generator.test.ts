import { generateChangelog, Commit } from '../generator';

// ─── Part B: with AI + mocks ───────────────────────────────────────────────

jest.mock('child_process', () => ({ execSync: jest.fn() }));

import { execSync } from 'child_process';
const mockExecSync = jest.mocked(execSync);

describe('CLI (index.ts) with mocked execSync', () => {
  let logSpy: jest.SpyInstance;
  let errSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    process.argv = ['node', 'index.js', '.'];
    logSpy  = jest.spyOn(console, 'log').mockImplementation(() => {});
    errSpy  = jest.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as () => never);
    mockExecSync.mockReset();
  });

  afterEach(() => jest.restoreAllMocks());

  test('prints changelog when execSync returns valid git log output', () => {
    mockExecSync.mockReturnValue('abc1234567|feat: add login page|Omar|2024-01-01');
    jest.isolateModules(() => { require('../index'); });
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('## Features'));
  });

  test('prints "No commits found." when repository has no commits', () => {
    mockExecSync.mockReturnValue('');
    jest.isolateModules(() => { require('../index'); });
    expect(logSpy).toHaveBeenCalledWith('No commits found.');
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test('prints error and exits 1 when path is not a git repository', () => {
    mockExecSync.mockImplementation(() => { throw new Error('not a git repo'); });
    jest.isolateModules(() => { require('../index'); });
    expect(errSpy).toHaveBeenCalledWith('Error: Not a git repository or invalid path.');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

// ─── Part A: without AI ────────────────────────────────────────────────────

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
