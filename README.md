# standup-hero 🦸‍♂️

> A fast, beautiful CLI tool to automatically generate your daily standup notes from your local Git history.

> *(A beautiful, interactive CLI built with `@clack/prompts`)*

## The Problem
It's 9:55 AM. Daily standup is in 5 minutes. You can't remember exactly what you worked on yesterday across 3 different microservices.

**standup-hero** eliminates developer anxiety by instantly querying your local Git repository and formatting a beautiful, Slack-ready bulleted list of what you worked on.

## Features
- ✨ **Zero configuration required.** Just type `standup`.
- 📋 **Auto-Clipboard.** Instantly copies the Markdown to your OS clipboard so you can just hit Cmd+V in Slack!
- ⚡ **Lightning Fast.** Uses native `git log` commands under the hood. 
- 🧠 **Smart Logic.** If you run it on a Monday, it automatically grabs your commits from Friday.

## Usage

Simply navigate to your project folder and run:

```bash
npx @dinakars777/standup-hero
```

For the best experience, install it globally so you can use the short `standup` alias!
```bash
npm install -g @dinakars777/standup-hero

# Now you can just use:
cd my-project
standup
```

### Options

Need to look further back in time? Pass the `--days` flag:

```bash
standup --days 5
```

## How It Works
It uses your `git config user.name` value to query `git log` filtering out merge commits over the specified timeframe, capitalizing your commit messages, and stringing them together cleanly.

## Contributing

Pull requests are welcome!

```bash
git clone https://github.com/dinakars777/standup-hero.git
cd standup-hero
npm install
npm run dev
```

## License

MIT
