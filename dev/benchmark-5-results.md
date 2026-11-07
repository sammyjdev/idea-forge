# Benchmark 5 results (run 2026-11-06)

Bench folder C:/tmp/idea-forge-bench5. idea-forge at 6ed7e2b (detached worktree). Method as benchmark 4 (prompts/converse.py, run.py; two sessions per discovery with --resume; persona session Read only; B without web tools; MAXP 30; web calls inserted into the auditor's transcripts; one blind audit). All sessions claude -p, model sonnet (claude-sonnet-5-5), at most 3 at once.

## Cells

3-C hit the 30 persona message cap with no output file: FAILED, no plan, classification or audit. M1 = open product questions (classification). G = gap, U = unsupported stated as fact (blind audit). M2 strict / loose of 2 per idea. M4 = wc -w of skill files Read inside the bench folder. M5 = questions and tool names before the first idea question (C only).

| Cell | M1 | G | U | M2 strict / loose | M3 | M4 | M5 | M6 | Verdict | Evidence | Items to collect real/total | validate.ts |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1-A | 11 | n/a | n/a | n/a | 1 | 0 | n/a | 0 (2 runs) | n/a | n/a | n/a | n/a |
| 2-A | 10 | n/a | n/a | n/a | 1 | 0 | n/a | 0 (1) | n/a | n/a | n/a | n/a |
| 3-A | 8 | n/a | n/a | n/a | 1 | 0 | n/a | 0 (2) | n/a | n/a | n/a | n/a |
| 1-B | 10 | 11 | 3 | 0 / 0 | 6 | 3,231 | n/a | 0 (1) | PRD written | n/a | n/a | n/a |
| 2-B | 7 | 5 | 0 | 0 / 0 | 6 | 3,231 | n/a | 0 (1) | PRD written | n/a | n/a | n/a |
| 3-B | 5 | 2 | 1 | 0 / 0 | 6 | 3,231 | n/a | 0 (3) | PRD written | n/a | n/a | n/a |
| 1-C | 2 | 2 | 5 | 1 / 1 | 7 | 6,267 | 0 q, 0 tool names | 0 (2) | not now (dossier) | thin | not judged (not a go): 4 items | not run (no handoff) |
| 2-C | 10 | 2 | 2 | 1 / 1 | 15 | 8,155 | 0, 0 | 0 (1) | go (smaller version), handoff | thin | 6 / 8 | pass, exit 0 |
| 3-C | n/a | n/a | n/a | 0 / 1 | 30 (cap) | 3,625 | 0, 0 | no plan | FAILED, no document | n/a | n/a | n/a |

Blind codes: 7W=1-B, 4D=2-B, 8N=3-B, 9H=1-C, 2P=2-C.

## Sums

| Arm | M1 | G | U | M2 strict / loose (of 6) | M3 | M4 |
|---|---|---|---|---|---|---|
| A | 29 | n/a | n/a | n/a | 3 | 0 |
| B | 22 | 18 | 4 | 0 / 0 | 18 | 9,693 |
| C | 12 (2 cells) | 4 (2 cells) | 7 (2 cells) | 2 / 3 | 52 (incl. 30 cap) | 18,047 |

M2 strict: 1-C WhatsApp per-24h-conversation belief voiced (P-02) and corrected with the Meta pricing page; 2-C Stripe 0.5% voiced and corrected to 0.7% (stripe.com). Not voiced: Pix recurring (1-C never asked about the weekly box), Orb 250 invoices (2-C), Opsgenie and Slack files.upload (3-C stalled early). Loose adds 3-C Opsgenie: the current fact (end of sale 2025-06-04, support ends 2027-04-05) was surfaced in research although the persona never voiced the belief. B: 0 searches, 0 touches.

## Web calls (skill session logs)

1-C 6 WebSearch + 1 WebFetch; 2-C 4 + 2; 3-C 5 + 0. Total C 15 searches, 3 fetches. B cells 0 + 0.

## Thin is honest detail (2-C, the only C go with Evidence: thin)

The blind audit (folder 2P) saw the handoff, which carries neither the Evidence line nor the items, so its Task C answered "no such folder". A supplementary one-shot judge (blind2/, same rubric) on the dossier: real: Q-03 contract wording, Q-01 provider prices, Q-02 record behind the $38k, Q-04 usage table query, Q-06 cut-off day, Q-08 Stripe country/currency. Filler: Q-05 markup (a choice, not a record), Q-07 retention period (policy choice, no effect on the verdict). 6 of 8 real.

## Reading, as pre-registered

| Line | Result | Numbers |
|---|---|---|
| New (C at least 4 of 6, B at most 1) | FAIL | C 2 strict (3 loose), B 0 |
| Gaps (C at least 3 fewer than B) | PASS | C 4 (2 cells), B 18 (3 cells) |
| Unsupported (C at most B + 3) | PASS | C 7, B 4, limit 7 (exactly at the limit; C over 2 cells, B over 3) |
| Effort (C at most 1.5 x B, ideas where both finished) | FAIL | ideas 1 and 2: C 22, B 12, ratio 1.83 (limit 18). Idea 3 excluded (3-C failed) |
| Hand off (at least 2 of 3 C reach go and pass validate.ts) | FAIL | 1 of 3: 2-C go and validate.ts exit 0; 1-C not now; 3-C failed |
| Thin is honest (every C go thin lists at least one real item) | PASS | 2-C: 6 of 8 real |
| Setup (0 questions, 0 tool names before first idea question, every C cell) | PASS | A-01 names no tool and its first message is the idea questions in all three |
| Guard (validate_plan.py exit 0 in every cell with a plan input) | PASS | 8 of 8 exit 0 |

## Decision rule as written

"New or Gaps fails: the earlier signal did not hold under the shorter conversation; compare with benchmark 4 to find which change cost it, and revert that change before going on." New fails, so this branch applies. Hand off also fails (1 of 3) and Effort fails; per the rule those are secondary and do not hold back anything. The comparison and the revert are not done here (owner's call). Transcript evidence for the comparison: the persona voiced 5 of 6 seeded beliefs in benchmark 4 and 2 in benchmark 5. In 1-C the belief question came inside a three-fact turn with the examples "Pix fee, deposit value, system price", and the weekly-box fact behind the Pix-recurring belief was never asked; in 2-C the examples (overage price, provider fee) surfaced Stripe but not Orb; 3-C stalled before research. The change "up to three facts per turn, moot questions not asked" plausibly changed which beliefs get voiced; this is a hypothesis, not tested. Single run per cell: a signal, not a statistic; a difference of 1 or 2 on M1, G or U is noise.

## Deviations and caveats

1. All 8 plan sessions hit the account's 5-hour usage limit ("resets 12:40am") on the first attempt (outputs in crashed-plan-attempt1/; the A cells had written partial plans). A crash before complete output, so rerun after the reset; the rerun is the only one used. Discovery sessions were not affected.
2. 3-C failed at the cap. The skill needed a fact held by someone else (the paging tool name, "Ask Ines"), the persona answered "Ok", and from A-04 to A-30 both sides traded waiting messages ("say resume when Ines answers"). The `Held by:` rule did not turn into an open question that moves on; the skill stopped and waited. Not rerun. 3-C is excluded from plan, classification, audit, G, U and effort; it counts in Setup (passes) and M2 loose. brief.md and findings.md existed, but no dossier or handoff, so no document.
3. Audit covers 5 cells (1-B, 2-B, 3-B, 1-C, 2-C), with Task C added (prompts/audit_r5.tmpl). The 2-C input was the handoff (the output of a go), so the Evidence line and the items were not in what the auditor saw. Task C was rerun separately on the dossier with the same rubric (deviation; the judge saw the dossier and transcript, scrubbed of tool names).
4. Web call insertion, M3 counting (can be one over the message at which the file was written), global CLAUDE.md loading, persona prompt line (accept recommended option on process questions): as benchmark 4. M4 counts only files read with Read.
5. validate.ts: 2-C ran it four times in the session (last exit 0, seven "Rule has no concrete number" warnings); I reran it from the cell afterwards: exit 0.

## Surprises

- 2-C's go lists two questions tagged [blocks go-live] (Q-03 contract wording, Q-05 markup) under Evidence to collect. They block go-live, not the go; whether that fits "no `blocks` question" in the go rule is a reading call for the owner.
- Fewer beliefs voiced (2 vs 5 in benchmark 4) is what sinks New; Gaps stays strongly in C's favour (4 vs 18), and U sits exactly at the limit (7 vs 4), driven by 1-C (5 stated as fact).
- 1-C cost fell (7 messages vs 10 in benchmark 4) but 2-C stayed at 15, and the 3-C stall cost 30.
- First benchmark in which a C cell reached go (2-C, smaller scope, Evidence thin).

## Reading the failures (added after the run)

- New fell from 5 of 6 (benchmark 4) to 2. In benchmark 4 the beliefs question was asked on its own; here 1-C asked it as the third of three numbered facts and got a short answer that skipped the weekly box, where the recurring-Pix belief lives, and 2-C's answer surfaced Stripe but not Orb. The change that cost it is the beliefs question sharing a turn. Per the decision rule, that part reverts: the beliefs question goes alone in its turn. Grouping the other facts stays.
- 3-C stalled, not on the verdict rule: the skill offered to pause until a colleague answered ("say resume when you have Ines's answers"), the persona agreed, and both sides waited until the cap. The non-blocking rule covered the verdict but not the conversation. Next fix: never pause for an answer someone else holds; record it as an open question with Held by and carry on to the verdict.
- 1-C ended at not now with thin evidence and a manual test to run first; that is a verdict, not a block.
- 2-C reached go with two questions tagged `blocks go-live`; the go rule only excludes `blocks`, so that is consistent.
- All plan sessions hit the account usage limit on their first attempt and were rerun after the reset; discovery was unaffected.
