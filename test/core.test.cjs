const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, mkdtempSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { test } = require('node:test');

require('ts-node/register');

const { getCommits } = require('../src/core');

function runGit(args, cwd, options = {}) {
    return execFileSync('git', args, {
        cwd,
        encoding: 'utf-8',
        env: {
            ...process.env,
            GIT_AUTHOR_DATE: '2026-05-22T09:00:00Z',
            GIT_COMMITTER_DATE: '2026-05-22T09:00:00Z',
            ...options.env,
        },
    });
}

function createRepo() {
    const repo = mkdtempSync(join(tmpdir(), 'standup-hero-'));
    runGit(['init'], repo);
    runGit(['config', 'user.name', 'Test User'], repo);
    runGit(['config', 'user.email', 'test@example.com'], repo);
    return repo;
}

function commit(repo, message, content = message) {
    writeFileSync(join(repo, 'work.txt'), content);
    runGit(['add', 'work.txt'], repo);
    runGit(['commit', '-m', message], repo);
}

test('preserves commit subjects that contain pipe characters', () => {
    const originalCwd = process.cwd();
    const repo = createRepo();

    try {
        commit(repo, 'fix: handle a|b subjects');
        process.chdir(repo);

        const commits = getCommits('Test User', 30);

        assert.equal(commits.length, 1);
        assert.equal(commits[0].message, 'fix: handle a|b subjects');
        assert.equal(commits[0].repoName, repo.split('/').pop());
    } finally {
        process.chdir(originalCwd);
    }
});

test('passes author values to git without shell execution', () => {
    const originalCwd = process.cwd();
    const repo = createRepo();
    const marker = join(repo, 'injected-marker');

    try {
        commit(repo, 'feat: safe author filtering');
        process.chdir(repo);

        const commits = getCommits(`"; touch ${marker}; echo "`, 30);

        assert.deepEqual(commits, []);
        assert.equal(existsSync(marker), false);
    } finally {
        process.chdir(originalCwd);
    }
});
