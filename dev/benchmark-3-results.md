# Benchmark 3 results (run 2026-11-06)

Bench folder C:/tmp/idea-forge-bench3. idea-forge at f1d8df0 (detached worktree). tlc-spec-lean and tlc-prd copied from benchmark 1. All sessions: claude -p, model claude-sonnet-5-5. Driver: prompts/converse.py (two sessions per discovery, --resume, transcript written by the driver). Driver test: two-turn dummy confirmed resume keeps context (same session id, recalled the secret word). Plan, classify and audit prompts are the benchmark 2 ones with the path changed.

## Cells

G and U from the blind audit (B and C only; 3-B not audited, see deviations). M2 shown as strict / loose (see below). M3 = P-NN messages when the driver stopped. M4 = wc -w over the skill files read, inside the bench folder (validate.ts included, tlc-spec-lean plan.md read in 3-C not included, see Growth guard). M5 is for C.

| Cell | M1 | G | U | M2 | M3 | M4 | M5 | M6 |
|---|---|---|---|---|---|---|---|---|
| 1-A | 10 | n/a | n/a | n/a | 1 | 0 | n/a | 0 |
| 2-A | 8 | n/a | n/a | n/a | 1 | 0 | n/a | 0 |
| 3-A | 7 | n/a | n/a | n/a | 1 | 0 | n/a | 0 |
| 1-B | 7 | 8 | 2 | 0 / 0 | 7 | 3,231 | n/a | 0 |
| 2-B | 10 | 4 | 2 | 0 / 0 | 7 | 3,231 | n/a | 0 |
| 3-B | 10 | not audited | not audited | 0 / 0 | 60 (cap, no PRD written) | 2,524 | n/a | 0 |
| 1-C | 4 | 1 | 5 | 0 / 1 | 11 | 5,289 | 0 questions, 0 names | 0 |
| 2-C | 7 | 3 | 6 | 1 / 1 | 12 | 5,289 | 0 questions, 0 names | 0 |
| 3-C | 9 | 0 | 7 | 0 / 1 | 12 | 9,605 | 0 questions, 0 names | 0 |

## Sums

| Arm | M1 | G | U | M2 (strict / loose, of 6) | M3 | M4 |
|---|---|---|---|---|---|---|
| A | 25 | n/a | n/a | n/a | 3 | 0 |
| B | 27 | 12 (2 cells) | 4 (2 cells) | 0 / 0 | 74 | 8,986 |
| C | 20 | 4 | 18 | 1 / 3 | 35 | 20,183 |

M2 scoring. Strict: the persona voiced the stale belief and the skill corrected it with a source. Loose: the current fact that contradicts the stale claim appears with a source in the transcript or output, even if the persona never voiced the belief. The personas only state a belief "when relevant" and never volunteer, so most beliefs never surfaced. Strict catch: Stripe 0.5% -> 0.7% in 2-C (A: persona stated 0.5%, skill showed stripe.com and support.stripe.com, persona accepted). Loose extras: 1-C F-01 (Meta per-message billing since July 2026, Meta docs cited; the per-24h-conversation belief was never voiced); 3-C Opsgenie end of sale 2025-06-04 (stated, but confirmed only through summaries; the belief was never voiced). Not caught anywhere: Pix recurring (Pix Automatico), Orb free plan, Slack files.upload. B never searched (0 WebSearch, 0 WebFetch in all three) and never touched a claim.

Web calls per discovery (from the skill session logs): 1-B 0/0, 2-B 0/0, 3-B 0/0 (WebSearch/WebFetch). 1-C 8 searches + 1 fetch; 2-C 5 + 1; 3-C 6 + 14. Total C: 19 searches, 16 fetches.

Gates that ran: validate_plan.py exit 0 in all nine cells (runs: 1-A 2, 2-A 2, 3-A 3, 1-B 2, 2-B 1, 3-B 2, 1-C 1, 2-C 2, 3-C 1). validate.ts ran in 1-C (output: "No handoff at ...", since the verdict was refine and no handoff exists) and in 3-C (final output "pass  0 warning(s)"); 2-C ended at refine and the skill ran freshness.ts only. freshness.ts ran in 2-C and 3-C.

## Reading, as pre-registered

- New (C catches at least 5 of 6; B at most 2): FAIL. C 1 strict, 3 loose; B 0. The B half passes, the C half fails.
- Quality (C at least 3 fewer gaps than B, and U no higher than B): FAIL. Gaps: C 4, B 12, so 8 fewer, pass (B sum is over 2 cells). U: C 18, B 4, fail. Per cell C is 5, 6, 7 against B 2, 2.
- Effort (C's M3 at most 1.5 times B's): PASS as computed, 35 against 74 (limit 111). It is not a clean pass: 3-B hit the 60 message cap (a stall, see deviations). Over ideas 1 and 2 only, C is 23 and B is 14, ratio 1.64, which would fail.
- Growth guard (C's M4 at most 21,318): PASS at 20,183 counting the bench-folder skill files read (validate.ts included). 3-C also read tlc-spec-lean's references/plan.md from ~/.agents (4,903 words); counting it gives 25,086 and FAIL. I did not count it because the plan step of the target skill is the same for all arms and outside the bench folder; the owner should decide.
- Setup (0 questions and 0 tool names before the first idea question, every idea): PASS. A-01 in all three C cells has no tool name and the first question is the idea question.
- Guard (M6 passes in B and C on every idea): PASS. All nine exit 0.

## Deviations

1. 3-B stalled. tlc-prd verdict was "on hold" until the person brought four items (paging tool rotation, incident dates and cost, Ines's hours per fix, who edits the sheet). The persona, answering only from its brief, kept saying it would come back; the skill kept waiting; from about P-10 to P-60 the two traded "Okay" messages. The driver stopped at the 60 persona message cap. No `.prd` file was written. Not rerun (rule). M3 = 60.
2. 3-B plan and classification used a fallback input: the conversation up to the stall (messages M-01 to M-17), saved as runs/3-B/fallback-input.md with a header saying no document was written. run.py find_input got a fallback for it. 3-B was left out of the blind audit (a transcript used as the document would show U near 0 and few gaps, which would flatter B). So B's G and U sums cover 2 ideas.
3. Blind audit covers 5 cells, not 6. The audit prompt (audit_r2.tmpl) still says "six folders". A stray prompt.txt sat in the audit working directory. The transcripts passed to the auditor have no [web: ...] notes (the driver only has what passed between the sessions), so the auditor judged web basis from sources cited inside the messages. The 2-C and 1-C audit inputs are dossiers (verdict refine in both); only 3-C produced a handoff.
4. The persona prompt includes one line not in the task text: for process or presentation questions accept the recommended option (as in benchmark 2, deviation 6); facts only from the brief.
5. claude -p loads the user's global CLAUDE.md and user-level skills in both sessions; not switchable. The skill session was told to reply in the person's language.
6. M3 is the persona count when the driver saw [[DONE]] plus the output file. For the C cells ending at refine, the dossier may have been written one message before [[DONE]], so M3 could be 1 lower. Not checked per file time.
7. Skill session had --add-dir for the skill folder only; the persona session had --add-dir for the personas folder. The plan and classify sessions were run from the benchmark 2 run.py (path changed), so they carry --add-dir of the whole bench folder, as before.
8. 3-C read a file outside the bench folder (~/.agents/skills/tlc-spec-lean/references/plan.md), following the skill's own target mapping.

## Surprises

- The independent persona broke the deadlock handling of tlc-prd: when the verdict depends on facts the person does not have, the skill waits and the persona (a real unknown) cannot supply them, so it loops. A real human would leave the chat; the driver cannot.
- 3-C handed off (go); 1-C and 2-C ended at refine, as in benchmark 2. The handoff-based planning is again tested on one cell.
- With the persona isolated, C's U is 18 and B's is 4 (B's PRD is short; B's questions ran into G: 12 against 4). Benchmark 2 had 31 against 20.
- The stale-claim catches mostly never happened because the personas never voiced the beliefs. The persona brief rule "do not volunteer" together with a skill that asks few questions means the seeded claims rarely come up; only the web research of C surfaced the current facts (in 1-C and 3-C as findings, not as a correction of a belief).
- C's per-idea persona cost is 11 to 12 messages, B's is 7.

## Reading across the three benchmarks (added after the run)

- With the persona in its own session, the persona rarely voiced its seeded beliefs: only the Stripe fee came up as a stated belief, in 2-C. In benchmarks 1 and 2 one session played both sides and had read the brief, so the skill side could raise the beliefs itself. The 6 of 6 catches reported there for idea-forge leaned on that leak, and cannot be taken as evidence of the freshness check working in a real conversation. What this run shows is narrower: idea-forge searched the web in every C cell (5 to 14 searches) and arm B in none, and idea-forge found current facts with sources; whether it corrects a belief depends on the person stating it.
- The leak also inflated unsupported claims in both arms: B fell from 20 to 4. idea-forge fell from 31 to 18 but stays well above B.
- Gaps held across all three benchmarks: idea-forge 9, 3 and 4 against tlc-prd 14, 13 and 12.
- Effort on the two comparable ideas (1 and 2): idea-forge 23 persona messages, tlc-prd 14, a ratio of 1.64, down from 2.45 in benchmark 2. The pass on the full sum comes from 3-B stalling at the 60-message cap.
- Two of three C cells ended at refine again, so only 3-C tested a real handoff.
