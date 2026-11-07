import { existsSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export type Args = { positional: string[]; flags: Record<string, string> };

export function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        flags[key] = "true";
      } else {
        flags[key] = next;
        i++;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

export function readFields(text: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const match = /^([A-Za-z][A-Za-z ]+):\s*(.*)$/.exec(line.trim());
    if (match) fields[match[1].trim().toLowerCase()] = match[2].trim();
  }
  return fields;
}

export function daysSince(isoDate: string, now: Date = new Date()): number | null {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return null;
  return Math.floor((now.getTime() - parsed) / 86_400_000);
}

export function today(now: Date = new Date()): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// True when the module is the script node was asked to run. Compares real paths,
// because a hand-built "file://" string fails on Windows, on paths with spaces and
// when the skill is reached through a symlink or junction.
export function isMain(moduleUrl: string): boolean {
  const entry = process.argv[1];
  if (entry === undefined || !existsSync(entry)) return false;
  return realpathSync(fileURLToPath(moduleUrl)) === realpathSync(entry);
}

export function readText(path: string): string {
  return readFileSync(path, "utf8");
}

export function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

// A list item's bullet: "-", "*" or "1.", optionally indented.
export const ITEM_BULLET = /^\s*(?:[-*]|\d+\.)\s+/;

// An open question line: "- Q-01:", "* **Q-01**:", "1. Q-01:". The ID is group 1.
export const QUESTION_LINE = new RegExp(String.raw`${ITEM_BULLET.source}\**(Q-\d+)`);

// A question blocks when any of its bracket tags reads "blocks", in any case: [Blocks], [blocks, open].
export function isBlockingQuestion(line: string): boolean {
  if (!QUESTION_LINE.test(line)) return false;
  return [...line.matchAll(/\[([^\]]*)\]/g)].some((m) => m[1].split(",").some((t) => t.trim().toLowerCase() === "blocks"));
}

// Markdown sections by their "## " title, lowercased.
export function sections(text: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const part of text.split(/^## /m).slice(1)) {
    const newline = part.indexOf("\n");
    const title = (newline === -1 ? part : part.slice(0, newline)).trim();
    map.set(title.toLowerCase(), newline === -1 ? "" : part.slice(newline + 1));
  }
  return map;
}

// Fenced blocks hold examples; inline code stays, since a reason may name a file.
// CommonMark rules: a fence is 3+ backticks or tildes, a backtick fence's info has no backtick,
// it closes on the same character at least as long with nothing after it, or at the end of the text.
export function stripFences(text: string): string {
  const kept: string[] = [];
  let open: { char: string; size: number } | null = null;
  for (const line of text.split("\n")) {
    const fence = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line.replace(/\r$/, ""));
    if (open) {
      if (fence && fence[1][0] === open.char && fence[1].length >= open.size && fence[2].trim() === "") open = null;
    } else if (fence && !(fence[1][0] === "`" && fence[2].includes("`"))) {
      open = { char: fence[1][0], size: fence[1].length };
    } else {
      kept.push(line);
    }
  }
  return kept.join("\n");
}

// The question lines under "## Open questions", leaving out fenced examples.
export function openQuestions(text: string): string[] {
  return stripFences(sections(text).get("open questions") ?? "").split("\n").filter((line) => QUESTION_LINE.test(line));
}
