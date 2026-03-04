#!/usr/bin/env node

import { Command } from 'commander';
import clipboardy from 'clipboardy';
import pc from 'picocolors';
import { getGitAuthor, getCommits, formatMarkdownList } from './core';
import { showIntro, showSuccess, showError, showStandup, getSpinner } from './ui';

const program = new Command();

program
    .name('standup-hero')
    .description('🦸‍♂️ A fast CLI tool to generate beautiful markdown daily standups from local Git history.')
    .version('1.0.0')
    .option('-d, --days <number>', 'Number of days to look back for commits', '1');

program.parse(process.argv);
const options = program.opts();

async function main() {
    showIntro();
    const s = getSpinner();

    try {
        const daysAgo = parseInt(options.days, 10);
        if (isNaN(daysAgo) || daysAgo < 1) {
            throw new Error('Please provide a valid number of days (e.g., --days 3)');
        }

        s.start('Finding local Git repository author');
        const author = getGitAuthor();
        s.message(`Found Author: ${pc.cyan(author)}`);

        s.message(`Scanning repository history...`);

        // Simulate slight delay for dramatic UX effect
        await new Promise((resolve) => setTimeout(resolve, 800));

        const commits = getCommits(author, daysAgo);

        if (commits.length === 0) {
            s.stop('No commits found.');
            console.log(pc.dim(`No commits found for ${author} in the last ${daysAgo} day(s). Did you push your code? 🤔`));
            process.exit(0);
        }
        s.stop(`Found ${commits.length} commit(s)!`);

        const markdown = formatMarkdownList(commits);
        showStandup(markdown);

        clipboardy.writeSync(markdown);
        showSuccess('Copied securely to your clipboard! Ready to paste into Slack. ✨');

    } catch (error: any) {
        if (s) s.stop('Failed');
        showError(error.message);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(pc.red('An unexpected error occurred:'), err);
    process.exit(1);
});
