# Benchmark 4 results (run 2026-11-06)

Bench folder C:/tmp/idea-forge-bench4. idea-forge at fe2ce1f (detached worktree). tlc-prd, tlc-spec-lean, personas, claims.md copied from bench1; prompts from bench3 (paths changed, MAXP 30). Driver prompts/converse.py (two sessions per discovery, --resume, transcript written by the driver, web calls recorded per skill turn from the session log). All sessions claude -p, model sonnet (claude-sonnet-5-5). Never more than 3 claude sessions at once.

## Cells

B cell 3-B failed (hit the 30 persona message cap with no output file), so it has no plan, classification, audit or M1/G/U. M4 is wc -w of skill files Read inside the bench folder. M5 for C cells only. M2 strict / loose of 2 per idea.

| Cell | M1 | G | U | M2 strict / loose | M3 | M4 | M5 | M6 | Verdict / handoff |
|---|---|---|---|---|---|---|---|---|---|
| 1-A | 12 | n/a | n/a | n/a | 1 | 0 | n/a | 0 (exit 0) | n/a |
| 2-A | 9 | n/a | n/a | n/a | 1 | 0 | n/a | 0 | n/a |
| 3-A | 11 | n/a | n/a | n/a | 1 | 0 | n/a | 0 | n/a |
| 1-B | 6 | 7 | 1 | 0 / 0 | 8 | 3,231 | n/a | 0 | PRD written |
| 2-B | 4 | 2 | 0 | 0 / 0 | 6 | 3,231 | n/a | 0 | PRD written |
| 3-B | n/a | n/a | n/a | 0 / 0 | 30 (cap) | 2,524 | n/a | no plan | FAILED, no PRD |
| 1-C | 4 | 2 | 0 | 2 / 2 | 10 | 4,619 | 0 questions, 0 tool names | 0 | refine (D-10), dossier, no handoff; validate.ts not run |
| 2-C | 3 | 0 | 1 | 2 / 2 | 18 | 5,773 | 0, 0 | 0 | refine, dossier, no handoff; validate.ts not run |
| 3-C | 7 | 0 | 1 | 1 / 1 | 10 | 5,593 | 0, 0 | 0 | refine, dossier, no handoff; validate.ts not run |

M6 is validate_plan.py exit 0 in all 8 planned cells (runs: 1-A 2, 2-A 1, 3-A 2, 1-B 2, 2-B 1, 1-C 2, 2-C 2, 3-C 2).

## Sums

| Arm | M1 | G | U | M2 strict / loose (of 6) | M3 | M4 |
|---|---|---|---|---|---|---|
| A | 32 | n/a | n/a | n/a | 3 | 0 |
| B | 10 (2 cells) | 9 (2 cells) | 1 (2 cells) | 0 / 0 | 44 (incl. 30 cap) | 8,986 |
| C | 14 | 2 | 2 | 5 / 5 | 38 | 15,985 |

M2 strict catches: 1-C WhatsApp per-24h-conversation belief (voiced P-02; corrected with Meta pricing doc, per-message since 2025-07-01) and Pix cannot be scheduled/recurring (voiced; corrected with BCB resolution 402, Pix Automatico); 2-C Stripe 0.5% (corrected: 0.7%, stripe.com) and Orb free plan 250 invoices (corrected: no free plan, withorb.com); 3-C Opsgenie open to new customers (corrected: end of sale 2025-06-04, Atlassian). Not voiced and not found: Slack files.upload (3-C never touched Slack). Loose adds nothing over strict (no current fact surfaced for an unvoiced belief). B: 0 searches, 0 touches.

## Web calls (skill session logs)

1-C 14 WebSearch + 5 WebFetch; 2-C 6 + 7; 3-C 4 + 0. Total C 24 searches, 12 fetches. B cells 0 + 0.

## Reading, as pre-registered

| Line | Result | Numbers |
|---|---|---|
| New (C corrects at least 4 of 6, B at most 1) | PASS | C 5 strict, B 0 |
| Gaps (C at least 3 fewer than B) | PASS | C 2, B 9 (B over 2 cells only, 3-B failed) |
| Unsupported (C at most B + 3) | PASS | C 2, B 1 (limit 4) |
| Effort (C at most 1.5 x B, ideas where both finished) | FAIL | ideas 1 and 2: C 28, B 14, ratio 2.0 (limit 21) |
| Hand off (at least 2 of 3 C cells reach go and pass validate.ts) | FAIL | 0 of 3: all three ended at refine; no handoff, validate.ts never run |
| Setup (0 questions, 0 tool names before first idea question, every C cell) | PASS | A-01 has no tool name and the first question is the idea question in all three (it says "check on the web", generic) |
| Guard (validate_plan.py exit 0 in every cell that produced a plan input) | PASS | 8 of 8 exit 0 |

## Decision rule as written

New and Gaps both pass: idea-forge does something the catalog does not, and the work goes on to the PR and the Tech Leads Club proposal. Failing lines among the rest become the next fixes, each measured in a later benchmark: Effort (C costs 2.0x the persona messages of B on ideas 1 and 2) and Hand off (no C cell reached go). Single run per cell: a signal, not a statistic.

## Deviations and caveats

1. 3-B failed at the cap: tlc-prd kept waiting for facts the persona does not have, then both sides traded "Talk soon" messages from about P-12 to P-30. Not rerun (rule). 3-B excluded from plan, classification, audit, G, U and the effort reading. Idea 3 C is thus also left out of effort. B sums for G, U, M1 cover 2 ideas, C covers 3 (raw sums over unequal cell counts).
2. Audit covers 5 cells (1-B, 2-B, 1-C, 2-C, 3-C). The audit template said "six"; edited to "five" and to explain the web lines (prompts/audit_r4.tmpl). Blind codes: 4Q=1-B, 7R=2-B, 2K=1-C, 8V=2-C, 5F=3-C.
3. Web call insertion: timing inside a turn was not recovered. All web calls of a skill turn were inserted as [web: query] / [fetch: url] lines immediately before the assistant message of that turn (list at message granularity).
4. M3 is the persona count when the driver saw [[DONE]] with the output file; it may be one higher than the message at which the file was written.
5. claude -p loads the user's global CLAUDE.md and user skills in both sessions (not switchable). Persona prompt carries the same added line as bench 3 (accept recommended option on process questions).
6. All three C outputs are dossiers (verdict refine), so plan input for C is the dossier, as in bench 3. validate.ts was never run (no handoff); freshness.ts ran in 2-C and 3-C and in 1-C. M4 counts only files read with Read; freshness/validate source was only head-ed through Bash in some cells, not counted.
7. M4 excludes tlc-spec-lean plan references (not read in discovery).

## Surprises

- The persona voiced 5 of the 6 seeded beliefs this time (bench 3: 1), because idea-forge now asks once which prices, fees and rules the idea counts on. That is the change that moved New.
- Gaps fell to 2 for C (0 in two cells), while U is low (0 to 1), a large drop from bench 3 (U 18). Labeling of assistant proposals and the record rule probably moved the auditor's reading; the audit still counts proposals marked as assumptions separately (C: 2K 7, 8V 13, 5F 7 unsupported-marked-as-assumption against B 2 and 0).
- All C cells ended at refine, so Hand off has now failed for want of a go in every benchmark but one cell; with these personas the unknowns the person cannot supply keep the verdict at refine.
- C persona cost is 10 to 18 messages against B 6 to 8.

## Reading the failing lines (added after the run)

- Hand off: all three C cells ended at refine, and each verdict asks for a record the persona does not have (cost invoices, a week of order counts, the paging vendor's name and plan). The persona briefs hold only remembered figures, so under the go rule chosen after benchmark 3 (a dated record counts, memory does not) refine is the rule working as written. The line measures the benchmark's personas as much as the skill. What it does show: a person who wants to build anyway has no path today except starting over.
- Effort: on ideas 1 and 2, 28 persona messages against 14, a ratio of 2.0. 2-C alone took 18.
