// Usage:
//   node <skill-dir>/scripts/profile.ts check [--path <file>] [--root <project>]
//   node <skill-dir>/scripts/profile.ts show  [--path <file>] [--root <project>]
//   node <skill-dir>/scripts/profile.ts init --role <r> --level <l> --focus <f> --format <o> --workflow <w>
//                                [--depth <d>] [--niches <list>] [--verification <p>] [--writing <rules>]
//                                [--conventions <text>] [--path <file>] [--force]
//
// check prints one line: "missing", "ok <path> <date>" or "stale <path> <date> <days>".
// Exit codes: 0 ok, 2 missing, 3 stale, 1 error.

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  PROFILE_HOME,
  SKILL_DIR,
  STALE_DAYS,
  daysSince,
  fail,
  findProfile,
  parseArgs,
  readFields,
  readText,
  today,
} from "./lib.ts";

const ALLOWED: Record<string, string[]> = {
  role: ["founder", "PM", "engineer", "designer", "other"],
  level: ["non-technical", "technical", "senior engineer"],
  focus: ["business", "product", "technical", "design", "mixed"],
  format: ["text", "tables", "diagram", "illustration", "document"],
  depth: ["quick", "thorough"],
  verification: ["light", "standard", "ui"],
};

const DEFAULTS: Record<string, string> = {
  role: "engineer",
  level: "technical",
  niches: "none yet",
  focus: "technical",
  format: "tables",
  workflow: "tlc-spec-lean",
  verification: "standard",
  depth: "thorough",
  writing: "plain, files in English",
  conventions: "none",
};

function check(explicit?: string, root?: string): void {
  const path = findProfile(explicit, root);
  if (!path) {
    console.log("missing");
    process.exit(2);
  }
  const fields = readFields(readText(path));
  const updated = fields["updated"] ?? "";
  const age = daysSince(updated);
  if (age !== null && age > STALE_DAYS) {
    console.log(`stale ${path} ${updated} ${age}`);
    process.exit(3);
  }
  console.log(`ok ${path} ${updated || "no-date"}`);
}

function show(explicit?: string, root?: string): void {
  const path = findProfile(explicit, root);
  if (!path) fail("No profile found. Run: node <skill-dir>/scripts/profile.ts init ...");
  process.stdout.write(readText(path));
}

function init(flags: Record<string, string>): void {
  const values: Record<string, string> = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    if (flags[key] !== undefined) values[key] = flags[key];
  }
  for (const [key, allowed] of Object.entries(ALLOWED)) {
    if (!allowed.includes(values[key])) {
      fail(`Invalid --${key} "${values[key]}". Allowed: ${allowed.join(", ")}`);
    }
  }
  const target = flags["path"] ?? PROFILE_HOME;
  if (existsSync(target) && flags["force"] !== "true") {
    fail(`Profile exists at ${target}. Pass --force to overwrite.`);
  }
  let text = readText(join(SKILL_DIR, "templates", "profile.md"));
  text = text.replace("{{date}}", today());
  for (const [key, value] of Object.entries(values)) {
    text = text.replace(`{{${key}}}`, value);
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text, "utf8");
  console.log(`saved ${target}`);
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const command = positional[0] ?? "check";

if (command === "check") check(flags["path"], flags["root"]);
else if (command === "show") show(flags["path"], flags["root"]);
else if (command === "init") init(flags);
else fail(`Unknown command "${command}". Use check, show or init.`);
