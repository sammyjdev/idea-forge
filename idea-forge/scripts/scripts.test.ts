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
import { checkDecisionsCarried, checkProfileForDepth, checkRuleSources, checkSourcesBinding, validateDossier, validateHandoff } from "./validate.ts";

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
1. WHEN a known key arrives within 24 hours THEN the API shall return 409. [F-01]
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
1. Key storage. Preferred: table. Rejected: cache because keys are lost on restart [F-01]

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

const UNTAGGED = GOOD_HANDOFF.replace("return 409. [F-01]", "return 409.");

test("a rule that cites no source fails", () => {
  const report = validateHandoff(UNTAGGED);
  assert.ok(report.errors.some((e) => e.startsWith("Rule cites no source")));
});

test("a rule that cites a decision, a fact or an assumption passes", () => {
  for (const tag of ["[D-02]", "[K-01]", "[A-03]", "[D-01, F-02]"]) {
    assert.deepEqual(validateHandoff(UNTAGGED.replace("return 409.", `return 409. ${tag}`)).errors, [], tag);
  }
});

test("a source tag does not count as the rule's concrete number", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("arrives within 24 hours THEN the API shall return 409.", "arrives THEN the API shall refuse it."));
  assert.ok(report.warnings.some((w) => w.startsWith("Rule has no concrete number")));
});

test("a preferred door option that cites no source warns", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("lost on restart [F-01]", "lost on restart"));
  assert.ok(report.warnings.some((w) => w.startsWith("Door candidate cites no source")));
});

const SOURCED_BRIEF = "# Brief: x\n## Facts\n- K-01: 40 orders a week. Said at: P-02\n## Decisions\n- D-01: Refuse a second charge. Because: F-01\n## Assumptions\n- A-01: 24 hours. Validate by: docs. Confirmed? n\n";

test("tags that exist in the brief and in findings pass", () => {
  const handoff = UNTAGGED.replace("return 409.", "return 409. [D-01, K-01, A-01, F-01]");
  assert.deepEqual(checkRuleSources(handoff, SOURCED_BRIEF, ["F-01"]), []);
});

test("a tag the brief or findings do not have fails", () => {
  const handoff = UNTAGGED.replace("return 409.", "return 409. [D-07, K-01, F-09]");
  assert.deepEqual(checkRuleSources(handoff, SOURCED_BRIEF, ["F-01"]), [
    "Rules: D-07 is not in brief.md. Cite a source that exists or move the value to Assumptions.",
    "Rules: F-09 is not in findings.md. Cite a source that exists or move the value to Assumptions.",
  ]);
});

test("a tag in the middle of a rule does not count; it must end the rule", () => {
  const report = validateHandoff(UNTAGGED.replace("WHEN a known key", "WHEN [D-01] a known key"));
  assert.ok(report.errors.some((e) => e.startsWith("Rule cites no source")));
});

test("an example rule inside a fenced block in Rules is not checked", () => {
  const handoff = GOOD_HANDOFF.replace("   Boundary: K1 at t=24h+1s -> 200\n", "   Boundary: K1 at t=24h+1s -> 200\n```\n2. WHEN x THEN y SHALL z. [D-99]\n3. WHEN x THEN y SHALL z.\n```\n");
  assert.ok(!validateHandoff(handoff).errors.some((e) => e.startsWith("Rule cites no source")));
  assert.deepEqual(checkRuleSources(handoff, SOURCED_BRIEF, ["F-01"]), []);
});

test("an ID in bold in its own brief section is known", () => {
  const brief = SOURCED_BRIEF.replace("- D-01: Refuse", "- **D-01**: Refuse");
  assert.deepEqual(checkRuleSources(UNTAGGED.replace("return 409.", "return 409. [D-01]"), brief, ["F-01"]), []);
});

test("a decision ID that only appears under open questions is not a decision", () => {
  const brief = `${SOURCED_BRIEF}## Open questions\n- D-05: is this decided?\n`;
  assert.deepEqual(checkRuleSources(UNTAGGED.replace("return 409.", "return 409. [D-05]"), brief, ["F-01"]), [
    "Rules: D-05 is not in brief.md. Cite a source that exists or move the value to Assumptions.",
  ]);
});

test("a door candidate that cites a decision nobody made fails", () => {
  const handoff = GOOD_HANDOFF.replace("lost on restart [F-01]", "lost on restart [D-99]");
  assert.deepEqual(checkRuleSources(handoff, SOURCED_BRIEF, ["F-01"]), [
    "Door candidates: D-99 is not in brief.md. Cite a source that exists or move the value to Assumptions.",
  ]);
});

test("validate command refuses a rule that cites a decision nobody made", () => {
  const root = project({
    "docs/discovery/handoff/x.md": UNTAGGED.replace("return 409.", "return 409. [D-09]"),
    "docs/discovery/dossier.md": "## Verdict\ngo. Decided by: F-01.\n",
    "docs/discovery/findings.md": finding("F-01", "high", today()),
    "docs/discovery/brief.md": SOURCED_BRIEF,
  });
  const { code, out } = runScript("validate.ts", ["x"], root);
  assert.equal(code, 1);
  assert.match(out, /D-09 is not in brief\.md/);
});

test("a complete handoff passes", () => {
  const report = validateHandoff(GOOD_HANDOFF);
  assert.deepEqual(report.errors, []);
});

test("a handoff with no suggested verification profile passes", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("Suggested profile: standard. Reason: money moves\n", ""));
  assert.deepEqual(report.errors, []);
});

const NO_PROFILE = GOOD_HANDOFF.replace("Suggested profile: standard. Reason: money moves\n", "");

test("a suggested profile outside light, standard and ui fails", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("Suggested profile: standard.", "Suggested profile: heavy."));
  assert.ok(report.errors.some((e) => e.includes("Suggested profile")));
});

test("a suggested profile with no reason fails", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("Suggested profile: standard. Reason: money moves", "Suggested profile: standard."));
  assert.ok(report.errors.some((e) => e.includes("Suggested profile")));
});

test("a thorough brief with no suggested profile warns that light may be too little", () => {
  const warnings = checkProfileForDepth(NO_PROFILE, "# Brief: x\nDepth: thorough\n");
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /Depth is thorough/);
});

test("the thorough-depth warning offers lines that pass the format check", () => {
  const [warning] = checkProfileForDepth(NO_PROFILE, "# Brief: x\nDepth: thorough\n");
  const offered = warning.match(/'(Suggested profile: [^']+)'/g) ?? [];
  assert.equal(offered.length, 2);
  for (const quoted of offered) {
    const line = quoted.slice(1, -1).replace("<why>", "the reason");
    assert.deepEqual(validateHandoff(GOOD_HANDOFF.replace("Suggested profile: standard. Reason: money moves", line)).errors, []);
  }
});

test("a thorough brief written with a capital T still warns", () => {
  assert.equal(checkProfileForDepth(NO_PROFILE, "# Brief: x\nDepth: Thorough\n").length, 1);
});

test("light and ui with a reason pass", () => {
  for (const value of ["light. Reason: thorough brief, but the change is reversible", "ui. Reason: the screen is the result"]) {
    assert.deepEqual(validateHandoff(GOOD_HANDOFF.replace("standard. Reason: money moves", value)).errors, []);
  }
});

test("the reason key and the value are read in any case", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("standard. Reason: money moves", "Standard. reason: money moves"));
  assert.deepEqual(report.errors, []);
});

test("a suggested profile written as a bullet or in bold is still checked", () => {
  for (const line of ["- Suggested profile: heavy.", "**Suggested profile**: heavy."]) {
    const report = validateHandoff(GOOD_HANDOFF.replace("Suggested profile: standard.", line));
    assert.ok(report.errors.some((e) => e.includes("Suggested profile")), line);
  }
});

test("bold with the colon inside the bold passes for the profile and warns for depth", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("Suggested profile: standard.", "**Suggested profile:** standard."));
  assert.deepEqual(report.errors, []);
  assert.equal(checkProfileForDepth(NO_PROFILE, "# Brief: x\n**Depth:** thorough\n").length, 1);
});

test("a profile line inside a code block is an example, not a second line", () => {
  const report = validateHandoff(`${GOOD_HANDOFF}\n\`\`\`\nSuggested profile: heavy.\n\`\`\`\n`);
  assert.ok(!report.errors.some((e) => e.includes("Suggested profile")));
});

test("a reason with inline code passes", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("Reason: money moves", "Reason: `payments.ts`"));
  assert.deepEqual(report.errors, []);
});

test("an unpaired backtick earlier in the handoff does not hide a bad profile line", () => {
  const text = GOOD_HANDOFF.replace("Suggested profile: standard.", "Suggested profile: heavy.").replace("Size: medium", "Size: medium `x") + "\nSee `notes`.\n";
  assert.ok(validateHandoff(text).errors.some((e) => e.includes("Suggested profile")));
});

test("a profile line inside a tilde fence is an example, not a second line", () => {
  const report = validateHandoff(`${GOOD_HANDOFF}\n~~~\nSuggested profile: heavy.\n~~~\n`);
  assert.ok(!report.errors.some((e) => e.includes("Suggested profile")));
});

test("a line with inline triple backticks does not open a fence that hides a bad profile line", () => {
  const text = GOOD_HANDOFF.replace("Suggested profile: standard.", "```x``` note\nSuggested profile: heavy.\n```y``` note\nSuggested profile: standard.").replace("Reason: money moves\n", "Reason: money moves\n");
  assert.ok(validateHandoff(text).errors.some((e) => e.includes("Suggested profile")));
});

test("a four-backtick fence with a three-backtick example inside is one example", () => {
  const report = validateHandoff(`${GOOD_HANDOFF}\n\`\`\`\`\n\`\`\`\nSuggested profile: heavy.\n\`\`\`\n\`\`\`\`\n`);
  assert.deepEqual(report.errors, []);
});

test("an unclosed fence runs to the end of the handoff", () => {
  const report = validateHandoff(`${GOOD_HANDOFF}\n\`\`\`\nSuggested profile: heavy.\n`);
  assert.ok(!report.errors.some((e) => e.includes("Suggested profile")));
  assert.equal(checkProfileForDepth(`# Handoff\n\`\`\`\nSuggested profile: standard. Reason: x\n`, "Depth: thorough\n").length, 1);
});

test("a profile value in bold passes", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("Suggested profile: standard.", "**Suggested profile:** **standard**."));
  assert.deepEqual(report.errors, []);
});

test("a second suggested profile line fails", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("Reason: money moves\n", "Reason: money moves\nSuggested profile: heavy.\n"));
  assert.ok(report.errors.some((e) => e.includes("Suggested profile")));
});

test("a thorough depth written in bold or as a bullet still warns", () => {
  for (const brief of ["**Depth**: thorough\n", "- Depth: thorough\n"]) {
    assert.equal(checkProfileForDepth(NO_PROFILE, `# Brief: x\n${brief}`).length, 1, brief);
  }
});

test("a suggested profile key in another case is still checked", () => {
  const report = validateHandoff(GOOD_HANDOFF.replace("Suggested profile: standard.", "Suggested Profile: heavy."));
  assert.ok(report.errors.some((e) => e.includes("Suggested profile")));
});

test("a thorough brief with a suggested profile warns nothing", () => {
  assert.deepEqual(checkProfileForDepth(GOOD_HANDOFF, "# Brief: x\nDepth: thorough\n"), []);
});

test("a quick brief with no suggested profile warns nothing", () => {
  assert.deepEqual(checkProfileForDepth(NO_PROFILE, "# Brief: x\nDepth: quick\n"), []);
});

test("validate command shows the thorough-depth warning without failing", () => {
  const root = project({
    "docs/discovery/handoff/x.md": NO_PROFILE,
    "docs/discovery/dossier.md": "## Verdict\ngo. Decided by: F-01.\n",
    "docs/discovery/findings.md": finding("F-01", "high", today()),
    "docs/discovery/brief.md": "# Brief: x\nDepth: thorough\n",
  });
  const { code, out } = runScript("validate.ts", ["x"], root);
  assert.equal(code, 0, out);
  assert.match(out, /warn .*Depth is thorough/);
});

function withRule(rule: string): string {
  return GOOD_HANDOFF.replace("   Boundary: K1 at t=24h+1s -> 200\n", `   Boundary: K1 at t=24h+1s -> 200\n${rule} [D-01]\n`);
}

function channelWarnings(rule: string): { errors: string[]; channel: string[] } {
  const report = validateHandoff(withRule(rule));
  return { errors: report.errors, channel: report.warnings.filter((w) => /channel/.test(w)) };
}

// The channel check reads free text, so it warns and never blocks a hand off.
for (const rule of [
  "2. WHEN the payment is refused THEN the API shall send the customer a message within 5 minutes.",
  "2. WHEN the payment is refused THEN the API shall message the customer within 5 minutes.",
  "2. WHEN the payment is refused THEN the API shall notify customers within 5 minutes.",
  "2. WHEN the payment is refused THEN the API shall remind the user to pay within 5 minutes.",
  "2. WHEN the user signs in THEN the API shall send the user a one-time code within 30 seconds.",
  "2. WHEN the order is paid THEN the API shall send the receipt to the buyer by 18:00.",
]) {
  test(`a message to a person with no channel is a warning, not an error: ${rule.slice(8, 70)}`, () => {
    const result = channelWarnings(rule);
    assert.deepEqual(result.errors, []);
    assert.equal(result.channel.length, 1);
  });
}

for (const rule of [
  "2. WHEN a known key arrives THEN the API shall send a 202 response within 1 second.",
  "2. WHEN the user clicks Send THEN the form shall submit within 1 second.",
  "2. WHEN the user updates their email THEN the API shall store it within 1 second.",
  "2. WHEN the payment is refused THEN the API shall send the customer a WhatsApp message within 5 minutes.",
  "2. WHEN the payment is refused THEN the API shall send the customer a message via email within 5 minutes.",
  "2. WHEN the payment is refused THEN the API shall notify the customer by SMS within 5 minutes.",
  "2. WHEN the payment is due THEN the API shall send a reminder by phone 1 day before.",
  "2. WHEN 3 payments fail in 1 minute THEN the API shall alert the operator dashboard.",
  "2. WHEN the refund fails THEN the error message the user sees shall read 'Refund in 5 days'.",
  "2. WHEN a payment settles THEN the API shall send a message to the queue within 1 second.",
  "2. WHEN a payment settles THEN the API shall send a webhook notification to the merchant URL within 1 second.",
  "2. The API shall show the refund rules text on the payment page within 1 second.",
]) {
  test(`a rule that is not a message to a person, or names its channel, gets no channel warning: ${rule.slice(8, 70)}`, () => {
    assert.deepEqual(channelWarnings(rule), { errors: [], channel: [] });
  });
}

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

for (const cell of ["Order 2..1 Item-v2", "Order 0..1 Invoice, Order 2..1 Item", "Order 2..1 Item (legacy)", "Order N..1 Item", "Order 1..n Item and 2..1 Coupon", "Order (2..1) Item"]) {
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

test("n and * are the same upper end, and a thousands comma is part of the number", () => {
  const report = validateHandoff(withRelations("| Order | Order 1..n Item; Order 1..* Item; Order 0..1,000 Coupon | none |"));
  assert.deepEqual(report.errors, []);
});

test("entity names that contain and are read whole", () => {
  const report = validateHandoff(withRelations("| User | User 1..1 Terms and conditions; User 0..n Terms and privacy notes | none |"));
  assert.deepEqual(report.errors, []);
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

const BRIEF = `# Brief: x
## Decisions
- D-01: Refuse a second charge. Because: F-01
- D-02: Deposit is 50% per bakery. Because: owner choice

## Assumptions
- A-01: none
`;

test("a handoff that says where every brief decision lands passes", () => {
  const handoff = `${GOOD_HANDOFF}
## Decisions
- D-01: Rules S1.1
- D-02: not for this feature, it belongs to onboarding
`;
  assert.deepEqual(checkDecisionsCarried(handoff, BRIEF), []);
});

test("a brief decision the handoff never mentions fails", () => {
  const handoff = `${GOOD_HANDOFF}
## Decisions
- D-01: Rules S1.1
`;
  assert.deepEqual(checkDecisionsCarried(handoff, BRIEF), [
    "Decisions: D-02 from brief.md is missing. Say where it lands or why it is not for this feature.",
  ]);
});

test("a decision listed with nothing after it is still missing", () => {
  const handoff = `${GOOD_HANDOFF}\n## Decisions\n- D-01:\n- D-02: not for this feature, it belongs to onboarding\n`;
  assert.deepEqual(checkDecisionsCarried(handoff, BRIEF), [
    "Decisions: D-01 from brief.md is missing. Say where it lands or why it is not for this feature.",
  ]);
});

test("a brief with no decisions asks nothing of the handoff", () => {
  assert.deepEqual(checkDecisionsCarried(GOOD_HANDOFF, "# Brief: x\n## Decisions\n\n## Assumptions\n"), []);
});

test("validate command refuses a handoff that drops a brief decision", () => {
  const root = project({
    "docs/discovery/handoff/x.md": GOOD_HANDOFF,
    "docs/discovery/dossier.md": "## Verdict\ngo. Decided by: F-01.\n",
    "docs/discovery/findings.md": finding("F-01", "high", today()),
    "docs/discovery/brief.md": BRIEF,
  });
  const { code, out } = runScript("validate.ts", ["x"], root);
  assert.equal(code, 1);
  assert.match(out, /D-01 from brief\.md is missing/);
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

test("dossier must say go and have no blocking question", () => {
  assert.deepEqual(validateDossier("## Verdict\ngo. Decided by: F-01.\n").errors, []);
  assert.ok(validateDossier("## Verdict\nrefine. Next: interviews.\n").errors.length > 0);
  assert.ok(validateDossier("## Verdict\ngo.\n\n- Q-01: who pays [blocks]\n").errors.length > 0);
});

test("a not now verdict is read as a verdict and still refuses the hand off", () => {
  assert.deepEqual(validateDossier("## Verdict\nnot now. After: the payment slice ships.\n").errors, [
    'Dossier verdict is "not now". Hand off only on go.',
  ]);
});
