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
