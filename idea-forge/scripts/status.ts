// Usage: node <skill-dir>/scripts/status.ts [--root <repo>]
// Prints the position and open items from the brief and findings, so a session can resume.
// Exit codes: 0 ok, 2 no brief found.

import { existsSync } from "node:fs";
import { join } from "node:path";
import { isBlockingQuestion, openQuestions, parseArgs, readFields, readText } from "./lib.ts";

const { flags } = parseArgs(process.argv.slice(2));
const root = flags["root"] ?? process.cwd();
const briefPath = join(root, "docs", "discovery", "brief.md");
const findingsPath = join(root, "docs", "discovery", "findings.md");

if (!existsSync(briefPath)) {
  console.log(`no brief at ${briefPath}`);
  process.exit(2);
}

const brief = readText(briefPath);
const fields = readFields(brief);
const lines = brief.split("\n").map((l) => l.trim());

const rqs = lines.filter((l) => /^- RQ-\d+/.test(l));
const rqOpen = rqs.filter((l) => /Status:\s*open/i.test(l)).length;
const unconfirmed = lines.filter((l) => /^- A-\d+/.test(l) && /Confirmed\?\s*n\b/i.test(l)).length;
const questions = openQuestions(brief);
const blocking = questions.filter(isBlockingQuestion).length;

console.log(`Position: ${fields["position"] ?? "unknown"}`);
console.log(`Updated: ${fields["updated"] ?? "unknown"}`);
console.log(`Research questions: ${rqs.length} (${rqOpen} open)`);

if (existsSync(findingsPath)) {
  const findings = readText(findingsPath);
  const count = (findings.match(/^### F-\d+/gm) ?? []).length;
  const contradictions = findings.split(/^### X-\d+/m).slice(1);
  const openX = contradictions.filter((c) => /Outcome:\s*open/i.test(c)).length;
  console.log(`Findings: ${count}`);
  console.log(`Contradictions: ${contradictions.length} (${openX} open)`);
}

console.log(`Unconfirmed assumptions: ${unconfirmed}`);
console.log(`Open questions: ${questions.length} (${blocking} blocking)`);
