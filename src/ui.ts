import { intro, outro, spinner } from '@clack/prompts';
import pc from 'picocolors';

export function showIntro() {
    intro(pc.bgCyan(pc.black(' standup-hero 🦸‍♂️ ')));
}

export function showSuccess(message: string) {
    outro(pc.green(`✔ ${message}`));
}

export function showError(message: string) {
    outro(pc.red(`✖ ${message}`));
}

export function showStandup(markdown: string) {
    console.log(pc.yellow('\nYour generated standup notes:\n'));
    console.log(pc.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(markdown);
    console.log(pc.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
}

export function getSpinner() {
    return spinner();
}
