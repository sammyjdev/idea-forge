// Usage: node <skill-dir>/scripts/validate.ts <feature> [--root <repo>]
// Checks docs/discovery/handoff/<feature>.md and the dossier verdict before hand off.
// Errors block hand off (exit 1). Warnings are printed and do not block (exit 0).

import { existsSync } from "node:fs";
import { join } from "node:path";
import { fail, isMain, parseArgs, readText } from "./lib.ts";
import { type Finding, flagFindings, parseFindings } from "./freshness.ts";

const REQUIRED_SECTIONS = [
  "Intent",
  "Flow",
  "Entities",
  "Rules",
  "Edges",
  "Door candidates",
  "Limits",
  "Out of scope",
  "Assumptions",
  "Open questions",
  "Sources",
];

const SWEEP_DIMENSIONS = [
  "Validation",
  "Failure modes",
  "Idempotency",
  "Authorization",
  "Concurrency",
  "Data lifecycle",
  "Dependency failure",
  "State transitions",
  "Observability",
];

const VAGUE_WORDS = [
  "fast",
  "quickly",
  "easy",
  "easily",
  "simple",
  "robust",
  "seamless",
  "user-friendly",
  "intuitive",
  "scalable",
  "efficient",
  "appropriate",
  "as needed",
  "etc",
];

export type Report = { errors: string[]; warnings: string[] };

// A rule that reaches a person should say how: "via WhatsApp", "by email", "on the order page".
// It reads free text, so it only warns.
const PERSON = String.raw`(?:the\s+|a\s+|an\s+|each\s+|every\s+|all\s+|their\s+)?(?:customer|user|owner|buyer|seller|merchant|admin|operator|manager|client|member|staff|person|people|recipient)s?\b`;
const TO_PERSON = [
  new RegExp(String.raw`\b(?:shall|and|then|to)\s+(?:also\s+)?(?:notify|remind|message|alert|email|text)\s+${PERSON}`, "i"),
  new RegExp(String.raw`\bsen(?:d|ds|t)\s+${PERSON}`, "i"),
  new RegExp(String.raw`\bsen(?:d|ds|t)\b[^.]*\bto\s+${PERSON}`, "i"),
];
const MACHINE = /\b(webhook|queue|topic|endpoint|url|api call)\b/i;
const CHANNEL = /\b(via|by|through|over)\s+(?!\d)\w|\b(whatsapp|e-?mail|sms|push|telegram|slack|phone|dashboard|page|screen|in-app)\b/i;

function messagesWithoutChannel(rule: string): boolean {
  return TO_PERSON.some((m) => m.test(rule)) && !MACHINE.test(rule) && !CHANNEL.test(rule);
}

// "A lo..hi B" means each A has lo to hi B. lo is a number; hi is a number, n or *.
function bound(end: string): number {
  return /^[n*]$/i.test(end) ? Infinity : Number(end.replace(/,/g, ""));
}

// "and" separates two relations only when a range sits on both sides; "Terms and conditions" stays one name.
function splitOnAnd(part: string): string[] {
  const pieces = part.split(/\band\b/);
  const out: string[] = [pieces[0]];
  for (const piece of pieces.slice(1)) {
    const last = out.length - 1;
    if (out[last].includes("..") && piece.includes("..")) out.push(piece);
    else out[last] += `and${piece}`;
  }
  return out;
}

function checkRelations(entities: string): string[] {
  const errors: string[] = [];
  const seen = new Map<string, string>();
  const relation = /^(?:each\s+)?(.+?)\s+(\d[\d,]*|[n*])\.\.(\d[\d,]*|[n*])\s+(.+)$/i;
  for (const row of entities.split("\n")) {
    const cells = row.split("|");
    if (cells.length < 4) continue;
    for (const raw of cells[2].split(/;|,(?!\d)/).flatMap(splitOnAnd)) {
      const text = raw.replace(/\(([^)]*)\)/g, (_, inner: string) => (inner.includes("..") ? inner : "")).replace(/\s+/g, " ").trim();
      if (!text.includes("..")) continue;
      const m = relation.exec(text);
      if (!m) {
        errors.push(`Entities: cannot read "${text}"; write it as "A lo..hi B", hi a number, n or *`);
        continue;
      }
      const [from, lo, hi, to] = [m[1].trim(), m[2], m[3], m[4].trim()];
      if (bound(lo) === Infinity || bound(lo) > bound(hi)) {
        errors.push(`Entities: "${text}" reads as each ${from} has ${lo} to ${hi} ${to}; the low end is above the high end`);
        continue;
      }
      const key = `${from} -> ${to}`;
      const range = `${lo}..${bound(hi) === Infinity ? "n" : bound(hi)}`;
      const before = seen.get(key);
      if (before && before !== range) errors.push(`Entities: ${from} to ${to} is ${before} in one row and ${range} in another`);
      else seen.set(key, range);
    }
  }
  return errors;
}

function sections(text: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const part of text.split(/^## /m).slice(1)) {
    const newline = part.indexOf("\n");
    const title = (newline === -1 ? part : part.slice(0, newline)).trim();
    map.set(title.toLowerCase(), newline === -1 ? "" : part.slice(newline + 1));
  }
  return map;
}

function stripCode(text: string): string {
  return text.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
}

export function validateHandoff(text: string): Report {
  const report: Report = { errors: [], warnings: [] };
  const map = sections(text);

  for (const name of REQUIRED_SECTIONS) {
    const body = map.get(name.toLowerCase());
    if (body === undefined) report.errors.push(`Missing section: ## ${name}`);
    else if (body.trim().length === 0) report.errors.push(`Empty section: ## ${name}`);
  }

  if (/^\*\*Approved\*\*:/m.test(text)) {
    report.errors.push("Approval line present. Only the person approves, inside the target skill.");
  }

  if (/<[a-z][^>\n]*>/i.test(stripCode(text))) {
    report.errors.push("Template placeholders like <...> remain.");
  }

  const target = /^Target:\s*(.+)$/m.exec(text)?.[1].trim() ?? "";
  if (!target) report.errors.push("Missing 'Target: <spec-driven skill, checked YYYY-MM-DD>'.");
  else if (!/checked \d{4}-\d{2}-\d{2}/.test(target)) {
    report.warnings.push("Target has no check date. Read the target's current template before handing off.");
  }
  if (!/^Size:\s*(small|medium|large|complex)\b/m.test(text)) {
    report.errors.push("Missing 'Size: small | medium | large | complex'.");
  }
  const profile = /^Suggested profile:(.*)$/im.exec(text)?.[1] ?? null;
  if (profile !== null && !/^\s*(light|standard|ui)\.\s*Reason:\s*\S/.test(profile)) {
    report.errors.push("Suggested profile must read 'light | standard | ui. Reason: <why>', or be left out.");
  }

  const flow = map.get("flow") ?? "";
  const steps = flow.split("\n").filter((l) => /^\d+\.\s/.test(l.trim()));
  if (steps.length === 0) report.errors.push("Flow has no numbered steps.");
  for (const step of steps) {
    if (!/\((exists|new)\)/.test(step)) report.warnings.push(`Flow step not tagged (exists) or (new): ${step.trim()}`);
  }

  const rules = map.get("rules") ?? "";
  if (!/^### S\d+(: .+)? \(P\d\)/m.test(rules) && !/^### S\d+ \(P\d\)/m.test(rules)) {
    report.errors.push("Rules have no slice heading like '### S1: name (P1)'. tlc-spec-lean criteria are grouped by slice.");
  }
  const ruleLines = rules.split("\n").filter((l) => /^\d+\.\s/.test(l.trim()));
  if (ruleLines.length === 0) report.errors.push("Rules has no numbered rules.");
  for (const line of ruleLines) {
    if (!/\bshall\b/i.test(line)) report.errors.push(`Rule is not in EARS form (no "shall"): ${line.trim()}`);
    if (!/\d/.test(line.replace(/^\s*\d+\.\s/, ""))) report.warnings.push(`Rule has no concrete number: ${line.trim()}`);
  }
  for (const line of ruleLines) {
    if (messagesWithoutChannel(line)) {
      report.warnings.push(`Rule messages a person but names no channel (via WhatsApp, by email, on a page): ${line.trim()}`);
    }
  }
  report.errors.push(...checkRelations(map.get("entities") ?? ""));
  const normals = (rules.match(/^\s*Normal:/gm) ?? []).length;
  const boundaries = (rules.match(/^\s*Boundary:/gm) ?? []).length;
  if (normals < ruleLines.length) report.warnings.push(`${ruleLines.length - normals} rule(s) without a Normal example.`);
  if (boundaries < ruleLines.length) report.warnings.push(`${ruleLines.length - boundaries} rule(s) without a Boundary example.`);

  const edges = map.get("edges") ?? "";
  for (const dim of SWEEP_DIMENSIONS) {
    const row = edges.split("\n").find((l) => l.startsWith(`| ${dim} |`));
    if (!row) report.errors.push(`Edges missing dimension: ${dim}`);
    else if (/^\|[^|]+\|\s*\|\s*$/.test(row.trim())) report.errors.push(`Edges dimension undecided: ${dim}`);
  }

  const doors = map.get("door candidates") ?? "";
  if (doors.trim() && !/^None - /m.test(doors.trim()) && !/Rejected:/i.test(doors)) {
    report.errors.push("Door candidate without a rejected alternative.");
  }

  const assumptions = map.get("assumptions") ?? "";
  if (assumptions.trim()) {
    for (const column of ["Chosen default", "Rationale", "Confirmed?"]) {
      if (!assumptions.includes(column)) report.errors.push(`Assumptions table has no '${column}' column.`);
    }
  }

  const sources = map.get("sources") ?? "";
  if (sources.trim() && !/F-\d+/.test(sources)) report.warnings.push("Sources cite no finding IDs (F-NN).");

  const prose = stripCode(text).toLowerCase();
  for (const word of VAGUE_WORDS) {
    const pattern = new RegExp(`(^|[^a-z-])${word.replace(/-/g, "\\-")}([^a-z-]|$)`);
    if (pattern.test(prose)) report.warnings.push(`Vague word "${word}". Replace with a concrete value.`);
  }
  if (/[–—]/.test(text)) report.warnings.push("En-dash or em-dash found. Use a plain hyphen.");

  return report;
}

// A source's binding mark in the handoff must match the finding it cites.
export function checkSourcesBinding(handoff: string, findings: Finding[]): string[] {
  const errors: string[] = [];
  const sources = sections(handoff).get("sources") ?? "";
  for (const line of sources.split("\n")) {
    const id = /^\s*-\s*(F-\d+)/.exec(line)?.[1];
    if (!id) continue;
    const finding = findings.find((f) => f.id === id);
    if (!finding) {
      errors.push(`Sources: ${id} is not in findings.md`);
      continue;
    }
    const nonBinding = /non-binding/i.test(line);
    const binding = /(^|[^-])\bbinding\b/i.test(line);
    if (nonBinding && binding) {
      errors.push(`Sources: ${id} has both marks; keep binding or non-binding`);
      continue;
    }
    if (!nonBinding && !binding) {
      errors.push(`Sources: ${id} has no binding or non-binding mark`);
      continue;
    }
    const marked = binding;
    if (marked === finding.binding) continue;
    const here = marked ? "binding" : "non-binding";
    const there = finding.binding ? "binding" : "non-binding";
    errors.push(`Sources: ${id} is ${here} here but ${there} in findings.md`);
  }
  return errors;
}

// Every decision in brief.md must reach the handoff, or say why it does not.
export function checkDecisionsCarried(handoff: string, brief: string): string[] {
  const decided = (sections(brief).get("decisions") ?? "").match(/^\s*-\s*D-\d+/gm) ?? [];
  const carried = sections(handoff).get("decisions") ?? "";
  return decided
    .map((line) => line.replace(/^\s*-\s*/, ""))
    .filter((id) => !new RegExp(`^[ \\t]*-[ \\t]*${id}:[ \\t]*\\S`, "m").test(carried))
    .map((id) => `Decisions: ${id} from brief.md is missing. Say where it lands or why it is not for this feature.`);
}

// A costly-to-be-wrong idea with no profile hint falls to the target's default, usually light.
export function checkProfileForDepth(handoff: string, brief: string): string[] {
  if (!/^Depth:\s*thorough\b/im.test(brief) || /^Suggested profile:/im.test(handoff)) return [];
  return ["Depth is thorough but the handoff suggests no verification profile. Add 'Suggested profile: standard. Reason: <why>', or 'Suggested profile: light. Reason: <why>' when light is enough."];
}

export function validateDossier(text: string): Report {
  const report: Report = { errors: [], warnings: [] };
  const verdict = /^## Verdict\s*\n+\s*(go|refine|not now|stop)\b/im.exec(text);
  if (!verdict) report.errors.push("Dossier has no verdict (go, refine, not now or stop).");
  else if (verdict[1].toLowerCase() !== "go") report.errors.push(`Dossier verdict is "${verdict[1]}". Hand off only on go.`);
  if (/^- Q-\d+.*\[blocks\]/m.test(text)) report.errors.push("Dossier has an open question tagged [blocks].");
  return report;
}

function main(): void {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const feature = positional[0];
  if (!feature) fail("Usage: node <skill-dir>/scripts/validate.ts <feature> [--root <repo>]");
  const root = flags["root"] ?? process.cwd();
  const handoff = join(root, "docs", "discovery", "handoff", `${feature}.md`);
  const dossier = join(root, "docs", "discovery", "dossier.md");
  if (!existsSync(handoff)) fail(`No handoff at ${handoff}`);

  const errors: string[] = [];
  const warnings: string[] = [];
  const h = validateHandoff(readText(handoff));
  errors.push(...h.errors);
  warnings.push(...h.warnings);
  if (existsSync(dossier)) {
    const d = validateDossier(readText(dossier));
    errors.push(...d.errors);
    warnings.push(...d.warnings);
  } else {
    errors.push(`No dossier at ${dossier}`);
  }

  const briefPath = join(root, "docs", "discovery", "brief.md");
  if (existsSync(briefPath)) {
    errors.push(...checkDecisionsCarried(readText(handoff), readText(briefPath)));
    warnings.push(...checkProfileForDepth(readText(handoff), readText(briefPath)));
  }

  const findingsPath = join(root, "docs", "discovery", "findings.md");
  if (existsSync(findingsPath)) {
    const findings = parseFindings(readText(findingsPath));
    errors.push(...checkSourcesBinding(readText(handoff), findings));
    for (const flag of flagFindings(findings, new Date())) {
      if (flag.binding) errors.push(`Freshness: ${flag.id} ${flag.reason}`);
      else warnings.push(`Freshness: ${flag.id} ${flag.reason}`);
    }
  } else {
    warnings.push(`No findings at ${findingsPath}. Nothing was checked.`);
  }

  for (const w of warnings) console.log(`warn  ${w}`);
  for (const e of errors) console.log(`error ${e}`);
  if (errors.length > 0) {
    console.log(`fail  ${errors.length} error(s), ${warnings.length} warning(s)`);
    process.exit(1);
  }
  console.log(`pass  ${warnings.length} warning(s)`);
}

if (isMain(import.meta.url)) main();
