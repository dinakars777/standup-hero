# standup-hero 🦸‍♂️

[![npm version](https://img.shields.io/npm/v/@dinakars777/standup-hero.svg?style=flat-square)](https://www.npmjs.com/package/@dinakars777/standup-hero)
[![npm downloads](https://img.shields.io/npm/dm/@dinakars777/standup-hero.svg?style=flat-square)](https://www.npmjs.com/package/@dinakars777/standup-hero)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> Automatically generate your daily standup notes from your local Git history.

It's 9:55 AM. Standup is in 5 minutes. You can't remember what you worked on yesterday across 3 different repos. **standup-hero** eliminates that anxiety — one command, instant Slack-ready notes.

## Features

- ✨ Zero configuration — just type `standup` in any Git repo
- 📋 Auto-copies the result to your clipboard — just hit `Cmd+V` in Slack
- ⚡ Lightning fast — uses native `git log` under the hood
- 🧠 Smart Monday logic — automatically grabs Friday's commits on Mondays

## Quick Start

```bash
npx @dinakars777/standup-hero
```

Or install globally for the short `standup` alias:

```bash
npm install -g @dinakars777/standup-hero
cd my-project
standup
```

## Options

| Flag | Description | Default |
|---|---|---|
| `--days <n>` | Look back N days instead of 1 | `1` |

```bash
standup --days 5
```

## How It Works

1. Reads your `git config user.name` to filter commits by author
2. Runs `git log` filtering out merge commits over the specified timeframe
3. Capitalizes and formats commit messages into a clean bulleted list
4. Copies the result to your clipboard automatically

## Tech Stack

| Package | Purpose |
|---|---|
| `@clack/prompts` | Beautiful interactive CLI UI |
| `clipboardy` | Cross-platform clipboard access |
| TypeScript | Type-safe implementation |

## Contributing

```bash
git clone https://github.com/dinakars777/standup-hero.git
cd standup-hero
npm install
npm run dev
```

## License

MIT
