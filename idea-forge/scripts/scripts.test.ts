// Run: node --test scripts/
// Unit tests for the deterministic parts: freshness flags, handoff and dossier validation.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { flagFindings, parseFindings } from "./freshness.ts";
import { today } from "./lib.ts";
import { checkSourcesBinding, validateDossier, validateHandoff } from "./validate.ts";

const SCRIPTS = dirname(fileURLToPath(import.meta.url));

const NOW = new Date("2026-11-05");

function finding(id: string, volatility: string, checked: string, binding = true, freshness = "current"): string {
  return [
    `### ${id}`,
    `- Volatility: ${volatility}`,
    `- Freshness: ${freshness}`,
    `- Checked: ${checked}`,
    `- Binding: ${binding ? "yes" : "no"}`,
    "",
  ].join("\n");
}

test("high volatility expires after 30 days", () => {
  const flags = flagFindings(parseFindings(finding("F-01", "high", "2026-09-01")), NOW);
  assert.equal(flags.length, 1);
  assert.match(flags[0].reason, /limit 30/);
});

test("medium volatility within 180 days passes", () => {
  assert.equal(flagFindings(parseFindings(finding("F-01", "medium", "2026-06-01")), NOW).length, 0);
});

test("low volatility never expires", () => {
  assert.equal(flagFindings(parseFindings(finding("F-01", "low", "2010-01-01")), NOW).length, 0);
});

test("missing check date is flagged", () => {
  const flags = flagFindings(parseFindings(finding("F-01", "high", "")), NOW);
  assert.match(flags[0].reason, /never checked/);
});

test("binding outdated and unverifiable findings are flagged", () => {
  const text = finding("F-01", "high", "2026-11-05", true, "outdated") + finding("F-02", "high", "2026-11-05", true, "unverifiable");
  const reasons = flagFindings(parseFindings(text), NOW).map((f) => f.reason).join(" ");
  assert.match(reasons, /outdated/);
  assert.match(reasons, /unverifiable/);
});

test("missing volatility is flagged", () => {
  const flags = flagFindings(parseFindings(finding("F-01", "", "2026-11-05")), NOW);
  assert.match(flags[0].reason, /volatility not set/);
});

const GOOD_HANDOFF = `# Handoff: x
Target: tlc-spec-lean, checked 2026-11-05
Size: medium
Suggested profile: standard. Reason: money moves

## Intent
Customers are charged twice today. After this, once.

## Flow
1. Submit payment (exists)
2. Check key (new)

## Entities
| Entity | Relations | Existing data touched |
|---|---|---|
| Key | Order 1..1 Key | payments |

## Rules
### S1 (P1): Reject duplicates
1. WHEN a known key arrives within 24 hours THEN the API shall return 409.
   Normal: K1 at t=0 -> 200
   Boundary: K1 at t=24h+1s -> 200

## Edges
| Dimension | Decision |
|---|---|
| Validation | 400 on missing key |
| Failure modes | 503 on timeout |
| Idempotency | key per order |
| Authorization | owner only |
| Concurrency | unique index |
| Data lifecycle | delete after 30 days |
| Dependency failure | retry 3 times |
| State transitions | n/a - single state |
| Observability | log outcome |

## Door candidates
1. Key storage. Preferred: table. Rejected: cache because keys are lost on restart

## Limits
- p95 latency: 300 ms

## Out of scope
| Capability | Reason |
|---|---|
| Refunds | separate |

## Assumptions
| Assumption | Chosen default | Rationale | Validate by | Confirmed? |
|---|---|---|---|---|
| Window length | 24 hours | provider keeps keys 24 hours | docs | n |

## Open questions
- None

## Sources
- F-01: [Docs](https://example.com), binding
`;

test("a complete handoff passes", () => {
  const report = validateHandoff(GOOD_HANDOFF);
  assert.deepEqual(report.errors, []);
});

function withRule(rule: string): string {
  return GOOD_HANDOFF.replace("   Boundary: K1 at t=24h+1s -> 200\n", `   Boundary: K1 at t=24h+1s -> 200\n${rule}\n`);
}

test("a rule that sends a message without naming the channel fails", () => {
  const report = validateHandoff(withRule("2. WHEN the payment is refused THEN the API shall send the customer a message within 5 minutes."));
  assert.ok(report.errors.some((e) => /channel/.test(e) && /2\. WHEN the payment is refused/.test(e)), report.errors.join("\n"));
});

test("a rule that sends a message via a named channel passes", () => {
  const report = validateHandoff(withRule("2. WHEN the payment is refused THEN the API shall send the customer a message via email within 5 minutes."));
  assert.deepEqual(report.errors, []);
});

test("a rule that shows text on a page is not taken for a message", () => {
  const report = validateHandoff(withRule("2. The API shall show the refund rules text on the payment page within 1 second."));
  assert.deepEqual(report.errors, []);
});

for (const rule of [
  "2. WHEN a known key arrives THEN the API shall send a 202 response within 1 second.",
  "2. WHEN the user clicks Send THEN the form shall submit within 1 second.",
  "2. WHEN the user updates their email THEN the API shall store it within 1 second.",
  "2. WHEN the payment is refused THEN the API shall send the customer a WhatsApp message within 5 minutes.",
  "2. WHEN the payment is refused THEN the API shall notify the customer by SMS within 5 minutes.",
  "2. WHEN 3 payments fail in 1 minute THEN the API shall alert the operator dashboard.",
]) {
  test(`a rule that is not a message, or names its channel, passes: ${rule.slice(8, 60)}`, () => {
    assert.deepEqual(validateHandoff(withRule(rule)).errors, []);
  });
}

test("a rule that messages a person with no channel fails", () => {
  const report = validateHandoff(withRule("2. WHEN the payment is refused THEN the API shall message the customer within 5 minutes."));
  assert.ok(report.errors.some((e) => /channel/.test(e)), report.errors.join("\n"));
});

function withRelations(relations: string): string {
  return GOOD_HANDOFF.replace("| Key | Order 1..1 Key | payments |", relations);
}

test("an entity relation whose low end is above its high end fails", () => {
  const report = validateHandoff(withRelations("| Refund | Refund n..1 Payment | none |"));
  assert.ok(report.errors.some((e) => /Refund n\.\.1 Payment/.test(e)), report.errors.join("\n"));
});

test("the same entity relation given two different ranges fails", () => {
  const report = validateHandoff(withRelations("| Payment | Payment 0..1 Refund | none |\n| Refund | Payment 0..n Refund | none |"));
  assert.ok(report.errors.some((e) => /Payment.*Refund/.test(e) && /0\.\.1/.test(e) && /0\.\.n/.test(e)), report.errors.join("\n"));
});

for (const cell of ["Order 2..1 Item-v2", "Order 0..1 Invoice, Order 2..1 Item", "Order 2..1 Item (legacy)", "Order N..1 Item"]) {
  test(`a relation with the low end above the high end fails in any common notation: ${cell}`, () => {
    const report = validateHandoff(withRelations(`| Order | ${cell} | none |`));
    assert.ok(report.errors.some((e) => /Entities/.test(e)), report.errors.join("\n"));
  });
}

test("a relation the validator cannot read fails instead of passing silently", () => {
  const report = validateHandoff(withRelations("| Order | Order 1..x Item | none |"));
  assert.ok(report.errors.some((e) => /Entities/.test(e) && /1\.\.x/.test(e)), report.errors.join("\n"));
});

test("star and capital N upper ends pass", () => {
  const report = validateHandoff(withRelations("| Order | Order 1..* Item; Order 0..N Invoice | none |"));
  assert.deepEqual(report.errors, []);
});

test("a pair given two ranges fails even when one row starts with each", () => {
  const report = validateHandoff(withRelations("| Order | each Order 0..1 Item | none |\n| Item | Order 0..n Item | none |"));
  assert.ok(report.errors.some((e) => /Order to Item/.test(e)), report.errors.join("\n"));
});

test("relations in both directions with valid ranges pass", () => {
  const report = validateHandoff(withRelations("| Payment | Payment 0..n Refund | none |\n| Refund | Refund 1..1 Payment | none |"));
  assert.deepEqual(report.errors, []);
});

test("handoff without slice heading fails", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("### S1 (P1): Reject duplicates\n", ""));
  assert.ok(report.errors.some((e) => e.includes("slice heading")));
});

test("handoff with an approval line fails", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("Size: medium", "Size: medium\n**Approved**: 2026-11-05 - user: \"ok\""));
  assert.ok(report.errors.some((e) => e.includes("Approval line")));
});

test("handoff with an undecided edge fails", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("| Concurrency | unique index |", "| Concurrency | |"));
  assert.ok(report.errors.some((e) => e.includes("Concurrency")));
});

test("handoff with placeholders fails", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("Customers are charged", "<who> is charged"));
  assert.ok(report.errors.some((e) => e.includes("placeholders")));
});

test("vague words are warnings, not errors", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("return 409.", "return 409 fast."));
  assert.deepEqual(report.errors, []);
  assert.ok(report.warnings.some((w) => w.includes("fast")));
});

test("a slice heading in the tlc-spec-lean order also passes", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("### S1 (P1): Reject duplicates", "### S1: Reject duplicates (P1)"));
  assert.deepEqual(report.errors, []);
});

test("handoff without an open questions section fails", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("## Open questions\n- None\n", ""));
  assert.ok(report.errors.includes("Missing section: ## Open questions"));
});

test("assumptions without a chosen default and rationale fail", () => {
  const old = GOOD_HANDOFF.replace(
    "| Assumption | Chosen default | Rationale | Validate by | Confirmed? |\n|---|---|---|---|---|\n| Window length | 24 hours | provider keeps keys 24 hours | docs | n |",
    "| Assumption | Validate by | Confirmed? |\n|---|---|---|\n| 24 h window | docs | n |",
  );
  const report = validateHandoff(old);
  assert.ok(report.errors.some((e) => e.includes("Chosen default")));
});

test("a source marked non-binding that findings mark binding fails", () => {
  const findings = finding("F-01", "high", "2026-11-05", true);
  const errors = checkSourcesBinding(GOOD_HANDOFF.replace("(https://example.com), binding", "(https://example.com), non-binding"), parseFindings(findings));
  assert.deepEqual(errors, ["Sources: F-01 is non-binding here but binding in findings.md"]);
});

function sourcesWith(line: string): string {
  return GOOD_HANDOFF.replace("- F-01: [Docs](https://example.com), binding", line);
}

test("a source with no binding mark fails", () => {
  const errors = checkSourcesBinding(sourcesWith("- F-01: [Docs](https://example.com)"), parseFindings(finding("F-01", "high", "2026-11-05")));
  assert.deepEqual(errors, ["Sources: F-01 has no binding or non-binding mark"]);
});

test("a source left with both marks fails", () => {
  const line = "- F-01: [Docs](https://example.com), binding | non-binding";
  const errors = checkSourcesBinding(sourcesWith(line), parseFindings(finding("F-01", "high", "2026-11-05", false)));
  assert.deepEqual(errors, ["Sources: F-01 has both marks; keep binding or non-binding"]);
});

test("a source citing a finding that does not exist fails", () => {
  const errors = checkSourcesBinding(GOOD_HANDOFF, parseFindings(finding("F-02", "high", "2026-11-05")));
  assert.deepEqual(errors, ["Sources: F-01 is not in findings.md"]);
});

test("a source marked binding that findings mark non-binding fails", () => {
  const errors = checkSourcesBinding(GOOD_HANDOFF, parseFindings(finding("F-01", "high", "2026-11-05", false)));
  assert.deepEqual(errors, ["Sources: F-01 is binding here but non-binding in findings.md"]);
});

test("today is the local calendar date, not the UTC one", () => {
  const code = `import("${pathToFileURL(join(SCRIPTS, "lib.ts")).href}").then((m) => console.log(m.today(new Date("2026-11-06T01:30:00Z"))))`;
  const result = spawnSync(process.execPath, ["-e", code], { encoding: "utf8", env: { ...process.env, TZ: "America/Sao_Paulo" } });
  assert.equal(result.stdout.trim(), "2026-11-05");
});

test("a script reached through a linked folder with a space in its path still runs", () => {
  const holder = mkdtempSync(join(tmpdir(), "idea forge link "));
  const link = join(holder, "skill");
  symlinkSync(dirname(SCRIPTS), link, "junction");
  const root = project({ "docs/discovery/findings.md": finding("F-01", "high", "2020-01-01") });
  const result = spawnSync(process.execPath, [join(link, "scripts", "freshness.ts")], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /recheck F-01 \(binding\)/);
});

test("profile check with --root finds the project profile from another folder", () => {
  const home = project({});
  const root = project({ ".idea-forge/profile.md": "# idea-forge profile\nUpdated: 2026-11-02\n" });
  const result = spawnSync(process.execPath, [join(SCRIPTS, "profile.ts"), "check", "--root", root], {
    cwd: home,
    encoding: "utf8",
    env: { ...process.env, HOME: home, USERPROFILE: home },
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /\.idea-forge[\\/]profile\.md 2026-11-02/);
});

function runScript(name: string, args: string[], cwd: string): { code: number; out: string } {
  const result = spawnSync(process.execPath, [join(SCRIPTS, name), ...args], { cwd, encoding: "utf8" });
  return { code: result.status ?? -1, out: `${result.stdout}${result.stderr}` };
}

function project(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "idea forge "));
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return root;
}

test("validate command refuses a hand off when the verdict is refine", () => {
  const root = project({
    "docs/discovery/handoff/x.md": GOOD_HANDOFF,
    "docs/discovery/dossier.md": "## Verdict\nrefine. Next: interviews.\n",
  });
  const { code, out } = runScript("validate.ts", ["x"], root);
  assert.equal(code, 1);
  assert.match(out, /Dossier verdict is "refine"/);
});

test("validate command passes a complete handoff and says so", () => {
  const root = project({
    "docs/discovery/handoff/x.md": GOOD_HANDOFF,
    "docs/discovery/dossier.md": "## Verdict\ngo. Decided by: F-01.\n",
    "docs/discovery/findings.md": finding("F-01", "high", today()),
  });
  const { code, out } = runScript("validate.ts", ["x"], root);
  assert.equal(code, 0);
  assert.match(out, /^pass /m);
});

test("freshness command reports a binding finding to re-check", () => {
  const root = project({ "docs/discovery/findings.md": finding("F-01", "high", "2020-01-01") });
  const { code, out } = runScript("freshness.ts", [], root);
  assert.equal(code, 1);
  assert.match(out, /recheck F-01 \(binding\)/);
});

test("a project profile wins over the personal profile", () => {
  const home = project({ ".config/idea-forge/profile.md": "# idea-forge profile\nUpdated: 2026-11-01\n" });
  const root = project({ ".idea-forge/profile.md": "# idea-forge profile\nUpdated: 2026-11-02\n" });
  const result = spawnSync(process.execPath, [join(SCRIPTS, "profile.ts"), "check"], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, HOME: home, USERPROFILE: home },
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /\.idea-forge[\\/]profile\.md 2026-11-02/);
});

test("dossier must say go and have no blocking question", () => {
  assert.deepEqual(validateDossier("## Verdict\ngo. Decided by: F-01.\n").errors, []);
  assert.ok(validateDossier("## Verdict\nrefine. Next: interviews.\n").errors.length > 0);
  assert.ok(validateDossier("## Verdict\ngo.\n\n- Q-01: who pays [blocks]\n").errors.length > 0);
});
