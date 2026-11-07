// Usage: node <skill-dir>/scripts/freshness.ts [--root <repo>] [--today YYYY-MM-DD]
// Reads docs/discovery/findings.md and lists findings whose check is missing or expired.
// Validity: high 30 days, medium 180 days, low never expires.
// Exit codes: 0 nothing to re-check, 1 a binding finding needs a check, 2 no findings file,
// 3 only non-binding findings need a check.

import { existsSync } from "node:fs";
import { join } from "node:path";
import { daysSince, isMain, parseArgs, readText } from "./lib.ts";

export const VALIDITY_DAYS: Record<string, number> = { high: 30, medium: 180 };

export type Finding = {
  id: string;
  volatility: string;
  freshness: string;
  checked: string;
  binding: boolean;
};

export type Flag = { id: string; reason: string; binding: boolean; kind: "format" | "stale" | "outdated" | "unverifiable" };

export function parseFindings(text: string): Finding[] {
  const findings: Finding[] = [];
  const blocks = text.split(/^### (?=F-\d+)/m).slice(1);
  for (const block of blocks) {
    const id = /^(F-\d+)/.exec(block)?.[1] ?? "F-?";
    const field = (name: string): string =>
      new RegExp(`^- ${name}:\\s*(.+)$`, "mi").exec(block)?.[1].trim().toLowerCase() ?? "";
    findings.push({
      id,
      volatility: field("Volatility"),
      freshness: field("Freshness"),
      checked: field("Checked"),
      binding: field("Binding").startsWith("yes"),
    });
  }
  return findings;
}

export function flagFindings(findings: Finding[], now: Date): Flag[] {
  const flags: Flag[] = [];
  for (const f of findings) {
    const volatility = ["high", "medium", "low"].includes(f.volatility) ? f.volatility : "";
    if (!volatility) {
      flags.push({ id: f.id, reason: "volatility not set (high, medium or low)", binding: f.binding, kind: "format" });
      continue;
    }
    if (volatility === "low") continue;
    const age = daysSince(f.checked, now);
    if (age === null) {
      flags.push({ id: f.id, reason: `${volatility} volatility, never checked`, binding: f.binding, kind: "stale" });
    } else if (age > VALIDITY_DAYS[volatility]) {
      flags.push({
        id: f.id,
        reason: `${volatility} volatility, checked ${age} days ago (limit ${VALIDITY_DAYS[volatility]})`,
        binding: f.binding,
        kind: "stale",
      });
    }
    // The status is the first word; a note may follow: "unverifiable (no web access)".
    const status = /^[a-z]*/.exec(f.freshness)?.[0] ?? "";
    if (status === "outdated" && f.binding) {
      flags.push({ id: f.id, reason: "binding finding is outdated; use the correction or replace it", binding: true, kind: "outdated" });
    }
    if (status === "unverifiable" && f.binding) {
      const reason = /no web access/.test(f.freshness)
        ? "binding finding is unverifiable only for lack of web access; search it when web access returns"
        : "binding finding is unverifiable; it cannot decide the verdict alone; list it under Evidence to collect";
      flags.push({ id: f.id, reason, binding: true, kind: "unverifiable" });
    }
  }
  return flags;
}

function main(): void {
  const { flags } = parseArgs(process.argv.slice(2));
  const root = flags["root"] ?? process.cwd();
  const path = join(root, "docs", "discovery", "findings.md");
  if (!existsSync(path)) {
    console.log(`no findings at ${path}`);
    process.exit(2);
  }
  const now = flags["today"] ? new Date(flags["today"]) : new Date();
  const findings = parseFindings(readText(path));
  const result = flagFindings(findings, now);

  const binding = result.filter((f) => f.binding);
  const other = result.filter((f) => !f.binding);
  for (const f of binding) console.log(`recheck ${f.id} (binding): ${f.reason}`);
  for (const f of other) console.log(`recheck ${f.id}: ${f.reason}`);
  console.log(`${findings.length} finding(s), ${binding.length} binding to re-check, ${other.length} other`);

  if (binding.length > 0) process.exit(1);
  if (other.length > 0) process.exit(3);
}

if (isMain(import.meta.url)) main();
