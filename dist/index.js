#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");
var import_clipboardy = __toESM(require("clipboardy"));
var import_picocolors2 = __toESM(require("picocolors"));

// src/core.ts
var import_child_process = require("child_process");
function getGitAuthor() {
  try {
    return (0, import_child_process.execSync)("git config user.name", { encoding: "utf-8" }).trim();
  } catch (e) {
    throw new Error('Could not determine Git author. Please ensure you have configured git (git config --global user.name "Your Name").');
  }
}
function getRepoName() {
  try {
    const rootPath = (0, import_child_process.execSync)("git rev-parse --show-toplevel", { encoding: "utf-8" }).trim();
    return rootPath.split("/").pop() || "Unknown Repo";
  } catch (error) {
    throw new Error("Not currently inside a Git repository! Please run this command from within a project folder.");
  }
}
function getCommits(author, daysAgo) {
  const repoName = getRepoName();
  let sinceArg = `${daysAgo} days ago`;
  if (daysAgo === 1) {
    const today = (/* @__PURE__ */ new Date()).getDay();
    if (today === 1) {
      sinceArg = `3 days ago`;
    }
  }
  try {
    const rawOutput = (0, import_child_process.execSync)(`git log --author="${author}" --since="${sinceArg}" --no-merges --pretty=format:"%h|%s|%cr"`, { encoding: "utf-8" });
    if (!rawOutput.trim()) {
      return [];
    }
    const commits = [];
    const lines = rawOutput.split("\n");
    for (const line of lines) {
      const [hash, message, date] = line.split("|");
      commits.push({ hash, message, date, repoName });
    }
    return commits.reverse();
  } catch (error) {
    return [];
  }
}
function formatMarkdownList(commits) {
  if (commits.length === 0) return "";
  const repoName = commits[0].repoName;
  let md = `**Project: ${repoName}**
`;
  for (const commit of commits) {
    let cleanMsg = commit.message.trim();
    cleanMsg = cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1);
    md += `- ${cleanMsg}
`;
  }
  return md;
}

// src/ui.ts
var import_prompts = require("@clack/prompts");
var import_picocolors = __toESM(require("picocolors"));
function showIntro() {
  (0, import_prompts.intro)(import_picocolors.default.bgCyan(import_picocolors.default.black(" standup-hero \u{1F9B8}\u200D\u2642\uFE0F ")));
}
function showSuccess(message) {
  (0, import_prompts.outro)(import_picocolors.default.green(`\u2714 ${message}`));
}
function showError(message) {
  (0, import_prompts.outro)(import_picocolors.default.red(`\u2716 ${message}`));
}
function showStandup(markdown) {
  console.log(import_picocolors.default.yellow("\nYour generated standup notes:\n"));
  console.log(import_picocolors.default.cyan("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501"));
  console.log(markdown);
  console.log(import_picocolors.default.cyan("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n"));
}
function getSpinner() {
  return (0, import_prompts.spinner)();
}

// src/index.ts
var program = new import_commander.Command();
program.name("standup-hero").description("\u{1F9B8}\u200D\u2642\uFE0F A fast CLI tool to generate beautiful markdown daily standups from local Git history.").version("1.0.0").option("-d, --days <number>", "Number of days to look back for commits", "1");
program.parse(process.argv);
var options = program.opts();
async function main() {
  showIntro();
  const s = getSpinner();
  try {
    const daysAgo = parseInt(options.days, 10);
    if (isNaN(daysAgo) || daysAgo < 1) {
      throw new Error("Please provide a valid number of days (e.g., --days 3)");
    }
    s.start("Finding local Git repository author");
    const author = getGitAuthor();
    s.message(`Found Author: ${import_picocolors2.default.cyan(author)}`);
    s.message(`Scanning repository history...`);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const commits = getCommits(author, daysAgo);
    if (commits.length === 0) {
      s.stop("No commits found.");
      console.log(import_picocolors2.default.dim(`No commits found for ${author} in the last ${daysAgo} day(s). Did you push your code? \u{1F914}`));
      process.exit(0);
    }
    s.stop(`Found ${commits.length} commit(s)!`);
    const markdown = formatMarkdownList(commits);
    showStandup(markdown);
    import_clipboardy.default.writeSync(markdown);
    showSuccess("Copied securely to your clipboard! Ready to paste into Slack. \u2728");
  } catch (error) {
    if (s) s.stop("Failed");
    showError(error.message);
    process.exit(1);
  }
}
main().catch((err) => {
  console.error(import_picocolors2.default.red("An unexpected error occurred:"), err);
  process.exit(1);
});
