import { execSync } from 'child_process';

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
        return execSync('git config user.name', { encoding: 'utf-8' }).trim();
    } catch (e) {
        throw new Error('Could not determine Git author. Please ensure you have configured git (git config --global user.name "Your Name").');
    }
}

/**
 * Returns the name of the directory as the Repo name.
 */
export function getRepoName(): string {
    try {
        const rootPath = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
        return rootPath.split('/').pop() || 'Unknown Repo';
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
        // Format string: %h (hash), %s (subject/message), %cr (relative date)
        const rawOutput = execSync(`git log --author="${author}" --since="${sinceArg}" --no-merges --pretty=format:"%h|%s|%cr"`, { encoding: 'utf-8' });

        if (!rawOutput.trim()) {
            return [];
        }

        const commits: CommitInfo[] = [];
        const lines = rawOutput.split('\n');

        for (const line of lines) {
            const [hash, message, date] = line.split('|');
            commits.push({ hash, message, date, repoName });
        }

        return commits.reverse(); // Display oldest to newest for chronological logical progression

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
