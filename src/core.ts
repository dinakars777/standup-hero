import { execFileSync } from 'child_process';
import path from 'path';

export interface CommitInfo {
    hash: string;
    message: string;
    date: string;
    repoName: string;
}

/**
 * Gets the configured Git username for the current machine.
 */
export function getGitAuthor(): string {
    try {
        return execFileSync('git', ['config', 'user.name'], { encoding: 'utf-8' }).trim();
    } catch (e) {
        throw new Error('Could not determine Git author. Please ensure you have configured git (git config --global user.name "Your Name").');
    }
}

/**
 * Returns the name of the directory as the Repo name.
 */
export function getRepoName(): string {
    try {
        const rootPath = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf-8' }).trim();
        return path.basename(rootPath) || 'Unknown Repo';
    } catch (error) {
        throw new Error('Not currently inside a Git repository! Please run this command from within a project folder.');
    }
}

/**
 * Executes a git command to fetch commits for a specific author over a specific timeframe.
 */
export function getCommits(author: string, daysAgo: number): CommitInfo[] {
    const repoName = getRepoName();
    let sinceArg = `${daysAgo} days ago`;

    // Provide a smart default: if today is Monday and the user runs it without args,
    // we should grab Friday's commits too (3 days ago).
    if (daysAgo === 1) {
        const today = new Date().getDay();
        if (today === 1) { // 1 = Monday
            sinceArg = `3 days ago`;
        }
    }

    try {
        const fieldSeparator = '\x1f';
        const recordSeparator = '\x1e';
        const rawOutput = execFileSync('git', [
            'log',
            `--author=${author}`,
            `--since=${sinceArg}`,
            '--no-merges',
            `--pretty=format:%h%x1f%s%x1f%cr%x1e`,
        ], { encoding: 'utf-8' });

        if (!rawOutput.trim()) {
            return [];
        }

        const commits = rawOutput
            .split(recordSeparator)
            .map((record) => record.trim())
            .filter(Boolean)
            .map((record) => {
                const [hash, message, date] = record.split(fieldSeparator);
                return { hash, message, date, repoName };
            })
            .filter((commit) => commit.hash && commit.message && commit.date);

        return commits.reverse(); // Display oldest to newest for chronological progression

    } catch (error) {
        return [];
    }
}

/**
 * Formats a raw list of commits into a beautiful markdown list.
 */
export function formatMarkdownList(commits: CommitInfo[]): string {
    if (commits.length === 0) return '';

    const repoName = commits[0].repoName;
    let md = `**Project: ${repoName}**\n`;

    for (const commit of commits) {
        // Clean up common prefixes like "fix:", "feat:", "chore:" if they exist for cleaner lists,
        // or just leave them. We will capitalize the first letter.
        let cleanMsg = commit.message.trim();
        cleanMsg = cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1);

        md += `- ${cleanMsg}\n`;
    }

    return md;
}
