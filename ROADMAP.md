# standup-hero Roadmap

Status as of May 23, 2026.

## Current Baseline

- The CLI reads the current repository's `git config user.name`, queries local Git history, formats matching commits as Markdown, prints the result, and copies it to the clipboard.
- The only user-facing option is `--days <n>`.
- The npm package now publishes the built CLI output from `dist/` only.
- Local verification currently covers `npm test`, `npm run build`, `npm audit --json`, and `npm pack --dry-run`.
- There are no open GitHub issues in `dinakars777/standup-hero`.

## Product Direction

Keep the tool local-first, fast, and zero-config for the default path. Add power-user options only when they make the morning standup workflow more reliable or reduce editing after the command runs.

## Near-Term: Reliability And Release Hygiene

1. Add GitHub Actions for `npm ci`, `npm test`, `npm run build`, `npm audit --audit-level=high`, and `npm pack --dry-run`.
2. Add a release workflow that builds from a clean checkout, publishes to npm with provenance, and tags the exact version.
3. Expand core test coverage for Monday lookback logic, invalid `--days` values, no-commit output, missing Git repositories, and missing `git config user.name`.
4. Make clipboard behavior explicit with `--copy` and `--no-copy`, and gracefully continue when clipboard access fails.
5. Tighten CLI argument parsing so values like `--days 3abc` fail instead of being accepted as `3`.

## Next: More Useful Standup Output

1. Support multiple repositories in one run, with output grouped by project.
2. Add `--author <name>` and optional author aliases for users whose Git history spans multiple identities.
3. Add date-window controls such as `--since`, `--until`, and weekday-aware defaults beyond Monday.
4. Add output formats: Slack-ready Markdown, plain text, and JSON for automation.
5. Improve commit cleanup by optionally stripping conventional commit prefixes, issue IDs, and noisy branch metadata.

## Later: Integrations And Polish

1. Add optional GitHub enrichment for PR titles and issue links when a remote URL is available.
2. Generate shell completions for common shells.
3. Add a non-interactive mode that disables spinner delays and color output for scripts.
4. Keep README and landing-page examples synchronized with the real CLI output.
5. Consider Node 18 support by bundling ESM dependencies, if supporting older developer environments matters.

## Issue Candidates

- `ci: add build, test, audit, and pack verification`
- `feat: support multi-repo standup generation`
- `feat: add no-copy and non-interactive modes`
- `feat: add author override and aliases`
- `docs: sync README and landing-page CLI examples`
